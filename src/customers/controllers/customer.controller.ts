import { Request, Response } from 'express';
import * as customerService from '../services/customer.service';

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const getAllCustomers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const customers = await customerService.getAllCustomers();

    res.status(200).json({
      customers,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllReffrals = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const customers = await customerService.getAllReffrals(req?.user?.cust_id);

    res.status(200).json({
      customers,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllCampaign = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const campaign = await customerService.getAllCampaign();

    res.status(200).json({
      campaign,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
