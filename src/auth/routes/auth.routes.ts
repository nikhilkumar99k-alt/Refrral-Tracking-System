import { Router } from 'express';
import * as authController from '../controllers/auth.controller';

const router = Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/', (req, res) => {
  return res.status(200).json({ message: 'Auth service is healthy' });
});

export default router;

