import { Request, Response } from 'express';
import * as adminService from '../services/admin.service';

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const getDashboard = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const dashboardData = await adminService.getDashboardData();

    res.status(200).json({
      message: 'Admin dashboard data retrieved successfully',
      data: dashboardData,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllTransactions = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const transactions = await adminService.getAllTransactions();

    res.status(200).json({
      transactions,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

