import { Router } from 'express';
import * as leadController from '../controllers/lead.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();

router.post('/add', authenticateToken, leadController.addLead);
router.get('/all', authenticateToken, leadController.getAllLeads);
router.post('/move-to-customer', authenticateToken, leadController.moveLeadToCustomer);

export default router;

