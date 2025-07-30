import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllLeads = async () => {
  return prisma.lead.findMany();
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

export const getAllVehicles = async () => {
  return prisma.vehicle.findMany();
};

export const getAllTransactions = async () => {
  return prisma.transaction.findMany();
};


