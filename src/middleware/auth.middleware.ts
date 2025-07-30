import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { findUserById } from '../auth/repositories/auth.repository';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;

    const authDetails = await findUserById(req.user.id);
    if (authDetails) {
      req.user.cust_id = authDetails?.Customer?.id ?? null;
    }

    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

export const requireRole = (role: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

export const requireAdminRole = requireRole('ADMIN');

