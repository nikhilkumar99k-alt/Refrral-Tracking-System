import { Router } from 'express';
import * as referralController from '../controllers/referral.controller';
import { authenticateToken, requireAdminRole } from '../../middleware/auth.middleware';

const router = Router();

router.get('/analytics', authenticateToken, requireAdminRole, referralController.getReferralAnalytics);
router.post('/payout/first/:customerId', authenticateToken, requireAdminRole, referralController.processFirstReferralPayout);
router.post('/payout/second/:customerId', authenticateToken, requireAdminRole, referralController.processSecondReferralPayout);

export default router;

