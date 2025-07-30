import { PrismaClient, TransactionSource } from '@prisma/client';

const prisma = new PrismaClient();

export const getReferralAnalytics = async () => {
  // Total referrals from leads (with referred_by not null)
  const totalReferrals = await prisma.lead.count({
    where: { referred_by: { not: null } },
  });

  // Rejected referrals = leads referred but isActive is false
  const rejectedReferrals = await prisma.lead.count({
    where: {
      referred_by: { not: null },
      isActive: false,
    },
  });

  // Converted referrals = customers with referred_by
  const convertedReferrals = await prisma.customer.count({
    where: { referred_by: { not: null } },
  });

  // Active referrals = total - rejected
  const activeReferrals = totalReferrals - rejectedReferrals;

  // Total earnings from referral-based CREDIT transactions
  const totalEarningsResult = await prisma.transaction.aggregate({
    where: {
      type: 'CREDIT',
      source: TransactionSource.REFRRAL,
    },
    _sum: { amount: true },
  });

  const totalEarnings = totalEarningsResult._sum.amount || 0;

  // Pending payouts = (active referrals * 7500) - total earnings
  const pendingPayouts = activeReferrals * 7500 - totalEarnings >0 ? activeReferrals * 7500 - totalEarnings : 0 ;

  // Conversion rate = (converted / total) * 100
  const conversionRate =
    totalReferrals > 0 ? (convertedReferrals / totalReferrals) * 100 : 0;

  // Avg earnings per lead
  const avgEarningsPerLead =
    totalReferrals > 0 ? totalEarnings / totalReferrals : 0;

  return {
    totalReferrals,
    rejectedReferrals,
    activeReferrals,
    convertedReferrals,
    totalEarnings,
    pendingPayouts,
    conversionRate: Number(conversionRate.toFixed(2)),
    avgEarningsPerLead: Number(avgEarningsPerLead.toFixed(2)),
  };
};

export const getReferralAnalyticsForCustomer = async (cust_id: number) => {
  if (!cust_id) {
    throw new Error("Customer ID is required");
  }

  // Total referrals by customer
  const totalReferrals = await prisma.lead.count({
    where: {
      referred_by: cust_id,
    },
  });

  // Rejected referrals (inactive leads)
  const rejectedReferrals = await prisma.lead.count({
    where: {
      referred_by: cust_id,
      isActive: false,
    },
  });

  // Converted referrals (leads that became customers)
  const convertedReferrals = await prisma.customer.count({
    where: {
      referred_by: cust_id,
    },
  });

  // Active referrals = total - rejected
  const activeReferrals = totalReferrals - rejectedReferrals;

  // Total earnings for customer from referral-based CREDIT transactions
  const totalEarningsResult = await prisma.transaction.aggregate({
    where: {
      type: "CREDIT",
      source: TransactionSource.REFRRAL,
      user_id: cust_id,
    },
    _sum: {
      amount: true,
    },
  });

  const totalEarnings = totalEarningsResult._sum.amount || 0;

  // Pending payouts (per referral ₹7500)
  const pendingPayouts =
    activeReferrals * 7500 - totalEarnings > 0
      ? activeReferrals * 7500 - totalEarnings
      : 0;

  // Conversion rate
  const conversionRate =
    totalReferrals > 0
      ? (convertedReferrals / totalReferrals) * 100
      : 0;

  // Avg earnings per lead
  const avgEarningsPerLead =
    totalReferrals > 0 ? totalEarnings / totalReferrals : 0;

  return {
    totalReferrals,
    rejectedReferrals,
    activeReferrals,
    convertedReferrals,
    totalEarnings,
    pendingPayouts,
    conversionRate: Number(conversionRate.toFixed(2)),
    avgEarningsPerLead: Number(avgEarningsPerLead.toFixed(2)),
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

