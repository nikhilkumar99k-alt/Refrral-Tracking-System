import { PrismaClient, TransactionSource } from '@prisma/client';

const prisma = new PrismaClient();

export const getReferralAnalytics = async () => {
  const totalReferrals = await prisma.lead.count({
    where: {
      referred_by: {
        not: null,
      },
    },
  });

  const convertedReferrals = await prisma.customer.count({
    where: {
      referred_by: {
        not: null,
      },
    },
  });

  const totalPayouts = await prisma.transaction.aggregate({
    where: {
      type: 'CREDIT',
      source: TransactionSource.REFRRAL
    },
    _sum: {
      amount: true,
    },
  });

  return {
    totalReferrals,
    convertedReferrals,
    totalPayouts: totalPayouts._sum.amount || 0,
  };
};

export const getCustomersWithReferrals = async () => {
  return prisma.customer.findMany({
    where: {
      referred_by: {
        not: null,
      },
    },
    include: {
      Vehicle: true,
      ScheduledEmi: {
        where: {
          status: 'COMPLETED',
        },
        orderBy: {
          week_count: 'asc',
        },
      },
    },
  });
};

export const getCustomerEmiPayments = async (customerId: number) => {
  return prisma.scheduledEmi.findMany({
    where: {
      customer_id: customerId,
      status: 'COMPLETED',
    },
    orderBy: {
      week_count: 'asc',
    },
  });
};

