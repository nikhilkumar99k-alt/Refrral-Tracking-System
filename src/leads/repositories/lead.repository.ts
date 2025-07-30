import { PrismaClient, ReferralStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const createLead = async (leadData: {
  name: string;
  phone: string;
  email: string;
  address: string;
  created_by: number;
  source: string;
  referred_by?: number | null;
  campaign_id?: number | null;
}) => {
  return await prisma.lead.create({
    data: {
      name: leadData.name,
      phone: leadData.phone,
      email: leadData.email,
      address: leadData.address,
      created_by: leadData.created_by,
      source: leadData.source,
      referred_by: leadData.referred_by ?? null,
      campaign_id: leadData.campaign_id ?? null,
      referralStatus: leadData.referred_by ? ReferralStatus.IN_PROGRESS : null
    },
  });
};



export const getAllLeads = async () => {
  return prisma.lead.findMany();
};

export const getLeadById = async (id: number) => {
  return prisma.lead.findUnique({
    where: { id },
  });
};

export const updateLeadStatus = async (id: number, status: string, referralStatus: ReferralStatus) => {
  // Assuming 'status' is part of the Lead model, though not explicitly defined in the provided schema.
  // For now, this function will just return the lead, as there's no direct 'status' field to update.
  // If a status field is added to the Lead model, this function should be updated accordingly.
  return prisma.lead.update({
    where: { id },
    data: { source: status, referralStatus: referralStatus }, // Using 'source' as a placeholder for status update for now.
  });
};

