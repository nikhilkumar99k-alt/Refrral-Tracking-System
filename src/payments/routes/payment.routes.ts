import { Router } from 'express';
import * as paymentController from '../controllers/payment.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();

router.post('/pay-emi', authenticateToken, paymentController.payEmi);
router.post('/update-wallet', authenticateToken, paymentController.updateWallet);
router.get('/tran/all', authenticateToken, paymentController.fetchAllTran);

export default router;

