import { Request, Response } from 'express';
import * as leadService from '../services/lead.service';

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const addLead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, phone, email, address, source, reffralCode, campaign_id } = req.body;

    if (!name || !phone || !email || !address || !source) {
      return res.status(400).json({ error: 'Name, phone, email, address, and source are required' });
    }

    const leadData = {
      name,
      phone,
      email,
      address,
      source,
      created_by: req?.user?.id || 0,
      reffralCode,
      campaign_id,
    };

    const lead = await leadService.addLead(leadData);

    res.status(201).json({
      message: 'Lead added successfully',
      lead,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllLeads = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const leads = await leadService.getAllLeads();

    res.status(200).json({
      leads,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const moveLeadToCustomer = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { leadId, customerType } = req.body;

    if (!leadId || !customerType) {
      return res.status(400).json({ error: 'Lead ID and customer type are required' });
    }

    const customer = await leadService.moveLeadToCustomer(parseInt(leadId), customerType, req.user.id);

    res.status(200).json({
      message: 'Lead moved to customer successfully',
      customer,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

