import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const findUserByEmailOrPhone = async (identifier: string) => {
  return prisma.auth.findFirst({
    where: {
      OR: [
        { email: identifier },
        { phone: identifier },
      ],
    },
  });
};

export const findUserById = async (id: number) => {
  return prisma.auth.findFirst({
    include: {
      Customer: true
    },
    where: {
      id: id
    },
  });
};

export const createUser = async (data: { name: string; phone: string; email: string; }) => {
  return prisma.auth.create({
    data: {
      name: data.name,
      phone: data.phone,
      email: data.email,
      lastLogin: new Date(),
    },
  });
};

export const updateLastLogin = async (userId: number) => {
  return prisma.auth.update({
    where: { id: userId },
    data: { lastLogin: new Date() },
  });
};


