import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { authenticateToken, requireAdminRole } from '../../middleware/auth.middleware';

const router = Router();

router.get('/dashboard', authenticateToken, requireAdminRole, adminController.getDashboard);
router.get('/transactions', authenticateToken, requireAdminRole, adminController.getAllTransactions);

export default router;

