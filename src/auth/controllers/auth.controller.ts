import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export const login = async (req: Request, res: Response) => {
  try {
    const { identifier, otp } = req.body;

    if (!identifier || !otp) {
      return res.status(400).json({ error: 'Identifier and OTP are required' });
    }

    const result = await authService.loginUser(identifier, otp);

    res.status(200).json({
      message: 'Login successful',
      user: result.user,
      token: result.token,
    });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, phone, email } = req.body;

    if (!name || !phone || !email) {
      return res.status(400).json({ error: 'Name, phone, and email are required' });
    }

    const user = await authService.registerUser(name, phone, email);

    res.status(201).json({
      message: 'User registered successfully',
      user,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

