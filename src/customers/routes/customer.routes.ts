import { Router } from 'express';
import * as customerController from '../controllers/customer.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();

router.get('/all', authenticateToken, customerController.getAllCustomers);
router.get('/all-reffrals', authenticateToken, customerController.getAllReffrals);
router.get('/campaign', authenticateToken, customerController.getAllCampaign);


export default router;

