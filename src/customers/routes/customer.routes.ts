import { Router } from 'express';
import * as customerController from '../controllers/customer.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();

router.get('/all', authenticateToken, customerController.getAllCustomers);

export default router;

