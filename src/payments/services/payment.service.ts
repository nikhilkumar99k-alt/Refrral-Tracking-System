import { TransactionSource } from '@prisma/client';
import * as paymentRepository from '../repositories/payment.repository';

export const payEmi = async (emiId: number, customerId: number, customerName: string, customerEmail: string, customerPhone: string, user: any) => {
  const emi = await paymentRepository.getScheduledEmiById(emiId);
  if (!emi) {
    throw new Error('EMI not found');
  }

  // if (emi.status === 'COMPLETED') {
  //   throw new Error('EMI already paid');
  // }
  if (user.role !== 'ADMIN' && user.cust_id !== emi.customer_id) {
    throw new Error('You cannot pay EMIs for other customers');
  }

    await paymentRepository.updateScheduledEmiStatus(emiId, new Date());
    await paymentRepository.createTransaction(customerId, 4500, 'DEBIT', `EMI Payment - Week ${emi.week_count}`, TransactionSource.EMI);

    return {
      message: 'Payment Paid successfully',
    }
}


export const updateWallet = async (userId: number, amount: number, type: 'CREDIT' | 'DEBIT', reason: string) => {
  try {
    const result = await paymentRepository.updateWalletAndCreateTransaction(
      userId,
      amount,
      type,
      reason
    );

    return {
      success: true,
      message: `Wallet ${type === 'CREDIT' ? 'credited' : 'debited'} successfully`,
      data: {
        wallet: {
          userId: result.wallet.user_id,
          balance: result.wallet.balance
        },
        transaction: {
          id: result.transaction.id,
          amount: result.transaction.amount,
          type: result.transaction.type,
          reason: result.transaction.reason,
          createdAt: result.transaction.created_at
        }
      }
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to update wallet',
    };
  }
};