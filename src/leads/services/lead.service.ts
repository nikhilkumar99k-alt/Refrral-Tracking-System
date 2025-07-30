import * as leadRepository from '../repositories/lead.repository';
import * as customerService from '../../customers/services/customer.service';
import * as customerRepository from '../../customers/repositories/customer.repository';


export const addLead = async (data: {
  name: string;
  phone: string;
  email: string;
  address: string;
  created_by: number;
  source: string;
  reffralCode?: string;
  campaign_id?: number;
}) => {
  let referred_by: number | null = null;

  // Get referrer customer ID if referral code is provided
  if (data.reffralCode) {
    const referrer = await customerRepository.getCustomerByReferralCode(data.reffralCode);
    if (referrer) {
      referred_by = referrer.id;
    }
  }

  const leadData = {
    name: data.name,
    phone: data.phone,
    email: data.email,
    address: data.address,
    created_by: data.created_by,
    source: data.source,
    referred_by,
    campaign_id: data.campaign_id || null,
  };

  return leadRepository.createLead(leadData);
};


export const getAllLeads = async () => {
  return leadRepository.getAllLeads();
};

export const moveLeadToCustomer = async (leadId: number, customerType: 'DCO' | 'FLEET_CUSTOMER', created_by: number) => {
  const lead = await leadRepository.getLeadById(leadId);
  if (!lead) {
    throw new Error('Lead not found');
  }

  // Create customer from lead
  const customer = await customerService.createCustomerFromLead(lead, customerType, created_by);

  // Update lead status to "vehicle delivered"
  await leadRepository.updateLeadStatus(leadId, 'vehicle delivered');

  return customer;
};

