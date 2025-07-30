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


export const getEmiSatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req?.body?.cust_id) {
      throw new Error("cust_id is required");
    }

    const is3Emi = req?.body?.is3rdEmi ?? false;

    const campaign = await customerService.getEmiSatus(req.body.cust_id,is3Emi);

    res.status(200).json({
      campaign,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
