import { Request, Response } from 'express';
import * as paymentService from '../services/payment.service';

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const payEmi = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { emiId } = req.body;

    if (!emiId) {
      return res.status(400).json({ error: 'EMI ID is required' });
    }

    const result = await paymentService.payEmi(
      parseInt(emiId),
      req.user.cust_id,
      req.user.name || 'Customer',
      req.user.email,
      req.user.phone,
      req.user,
    );

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};


export const updateWallet = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId, amount, type, reason } = req.body;

    // Validate required fields
    if (!userId || !amount || !type || !reason) {
      return res.status(400).json({ 
        error: 'Missing required fields. Please provide userId, amount, type (CREDIT/DEBIT), and reason' 
      });
    }

    // Validate amount is a positive number
    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    // Validate type is either CREDIT or DEBIT
    if (type !== 'CREDIT' && type !== 'DEBIT') {
      return res.status(400).json({ error: 'Type must be either CREDIT or DEBIT' });
    }

    // Only admins can update other users' wallets
    if (req.user.role !== 'ADMIN' && parseInt(userId) !== req.user.cust_id) {
      return res.status(403).json({ error: 'You can only update your own wallet' });
    }

    const result = await paymentService.updateWallet(
      parseInt(userId),
      parseFloat(amount),
      type,
      reason
    );

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const fetchAllTran = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const cust_id= req?.user?.cust_id;

    return await paymentService.fetchAllTran(cust_id);

  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};