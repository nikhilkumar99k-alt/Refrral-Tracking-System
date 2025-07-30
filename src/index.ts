import express from 'express';
import { PrismaClient } from '@prisma/client';
import authRoutes from './auth/routes/auth.routes';
import leadRoutes from './leads/routes/lead.routes';
import customerRoutes from './customers/routes/customer.routes';
import paymentRoutes from './payments/routes/payment.routes';
import referralRoutes from './referral/routes/referral.routes';
import adminRoutes from './admin/routes/admin.routes';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/leads', leadRoutes);
app.use('/customers', customerRoutes);
app.use('/payments', paymentRoutes);
app.use('/referral', referralRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});


