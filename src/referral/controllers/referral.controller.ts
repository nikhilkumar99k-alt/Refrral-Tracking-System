import { Request, Response } from 'express';
import * as referralService from '../services/referral.service';

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const getReferralAnalytics = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const analytics = await referralService.getReferralAnalytics(req.user);

    res.status(200).json({
      analytics,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const processFirstReferralPayout = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { customerId } = req.params;
    
    if (!customerId) {
      return res.status(400).json({ error: 'Customer ID is required' });
    }
    
    const response = await referralService.processFirstReferralPayout(parseInt(customerId));
    
    if (response.success) {
      return res.status(200).json({
        success: true,
        message: response.message
      });
    } else {
      return res.status(400).json({
        success: false,
        message: response.message
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const processSecondReferralPayout = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { customerId } = req.params;
    
    if (!customerId) {
      return res.status(400).json({ error: 'Customer ID is required' });
    }
    
    const response = await referralService.processSecondReferralPayout(parseInt(customerId));
    
    if (response.success) {
      return res.status(200).json({
        success: true,
        message: response.message
      });
    } else {
      return res.status(400).json({
        success: false,
        message: response.message
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

