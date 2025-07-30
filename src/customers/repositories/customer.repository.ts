import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createCustomer = async (data: { authId: number; leadId: number; name: string; phone: string; email: string; address: string; customer_type: 'DCO' | 'FLEET_CUSTOMER'; created_by: number; referred_by?: number; refer_code: string; campaign_id?: number }) => {
  return prisma.customer.create({
    data,
  });
};



export const getAllCustomers = async () => {
  return prisma.customer.findMany({
    include: {
      Vehicle: true,
      ScheduledEmi: true,
      Wallet: true,
    },
  });
};

export const getCustomerById = async (id: number) => {
  return prisma.customer.findUnique({
    where: { id },
    include: {
      Vehicle: true,
      ScheduledEmi: true,
      Wallet: true,
    },
  });
};

export const getCustomerByReferralCode = async (referralCode: string) => {
  return prisma.customer.findUnique({
    where: { refer_code: referralCode },
  });
};

export const createVehicle = async (custId: number) => {
  return prisma.vehicle.create({
    data: { cust_id: custId },
  });
};



export const createScheduledEmis = async (customerId: number, numberOfVehicles: number) => {
  const emis = [];
  const today = new Date();
  
  for (let week = 1; week <= 36; week++) {
    const dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() + (week - 1) * 7); // Weekly due every Tuesday
    
    // Set to Tuesday (day 2 of the week)
    const dayOfWeek = dueDate.getDay();
    const daysUntilTuesday = (2 - dayOfWeek + 7) % 7;
    dueDate.setDate(dueDate.getDate() + daysUntilTuesday);
    
    emis.push({
      customer_id: customerId,
      due_date: dueDate,
      week_count: week,
    });
  }
  
  return prisma.scheduledEmi.createMany({
    data: emis,
  });
};

export const createWallet = async (userId: number) => {
  return prisma.wallet.create({
    data: {
      user_id: userId,
      balance: 0,
    },
  });
};


export const updateFirstPayout = async (custId: number) => {
  return prisma.customer.update({
    where: { id: custId },
    data: { first_payout: true },
  });
};

export const updateSecondPayout = async (custId: number) => {
  return prisma.customer.update({
    where: { id: custId },
    data: { second_payout: true },
  });
};