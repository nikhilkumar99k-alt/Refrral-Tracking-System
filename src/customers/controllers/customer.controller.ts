import { Request, Response } from 'express';
import * as customerService from '../services/customer.service';

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const getAllCustomers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    console.log(req.user)
    const customers = await customerService.getAllCustomers();

    res.status(200).json({
      customers,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

