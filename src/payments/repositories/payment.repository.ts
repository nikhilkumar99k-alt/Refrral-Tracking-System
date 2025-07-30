import { PrismaClient, TransactionSource } from '@prisma/client';
import { createWallet } from '../../customers/repositories/customer.repository';

const prisma = new PrismaClient();

export const updateScheduledEmiStatus = async (emiId: number, paidDate: Date) => {
  return prisma.scheduledEmi.update({
    where: { id: emiId },
    data: { status: 'COMPLETED', paid_date: paidDate },
  });
};

export const getScheduledEmiById = async (emiId: number) => {
  return prisma.scheduledEmi.findUnique({
    where: { id: emiId },
  });
};

export const createTransaction = async (userId: number, amount: number, type: 'CREDIT' | 'DEBIT', reason: string, source: TransactionSource ) => {
  return prisma.transaction.create({
    data: {
      user_id: userId,
      amount,
      type,
      reason,
      source
    },
  });
};

export const updateWalletBalance = async (userId: number, amount: number, type: 'CREDIT' | 'DEBIT') => {
  let currentWallet = await prisma.wallet.findUnique({
    where: { user_id: userId },
  });

  if (!currentWallet) {
    throw new Error('Wallet not found for this user');
  }

  const newBalance = type === 'CREDIT' ? currentWallet.balance + amount : currentWallet.balance - amount;

  return prisma.wallet.update({
    where: { user_id: userId },
    data: { balance: newBalance },
  });
};



export const updateWalletAndCreateTransaction = async (userId: number, amount: number, type: 'CREDIT' | 'DEBIT', reason: string) => {
  // Check if wallet exists
  let currentWallet = await prisma.wallet.findUnique({
    where: { user_id: userId },
  });

  // Create wallet if it doesn't exist
  if (!currentWallet) {
    await createWallet(userId);
    currentWallet = await prisma.wallet.findUnique({
      where: { user_id: userId },
    });
  }

  // Calculate new balance
  const newBalance = type === 'CREDIT' ? (currentWallet?.balance || 0) + amount : (currentWallet?.balance || 0) - amount;

  // Update wallet balance
  const updatedWallet = await prisma.wallet.update({
    where: { user_id: userId },
    data: { balance: newBalance },
  });

  // Create transaction record
  const transaction = await prisma.transaction.create({
    data: {
      user_id: userId,
      amount,
      type,
      reason,
    },
  });

  return {
    wallet: updatedWallet,
    transaction,
  };
};


export const fetchAllTran = async (cust_id?: number) => {
  try {
    const where = cust_id ? { user_id: cust_id } : {};

    const transactions = await prisma.transaction.findMany({ where });

    return {
      success: true,
      data: transactions,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to fetch transactions',
    };
  }
};
