import * as customerRepository from '../repositories/customer.repository';
import * as authRepository from '../../auth/repositories/auth.repository';

export const getAllCustomers = async () => {
  return customerRepository.getAllCustomers();
};

export const createCustomerFromLead = async (lead: any, customerType: 'DCO' | 'FLEET_CUSTOMER', created_by: number) => {
  // Create auth entry for the customer
  // console.log(lead)
  const auth = await authRepository.createUser({
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
  });

  // Generate referral code
  const referCode = `REF${auth.id}${Date.now().toString().slice(-4)}`;
  // Create customer
  const customer = await customerRepository.createCustomer({
    "authId": auth.id,
    "leadId": lead.id,
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    address: lead.address,
    customer_type: customerType,
    created_by,
    referred_by: lead.referred_by,
    campaign_id: lead.campaign_id,
    refer_code: referCode,
  });


  // Create wallet
  await customerRepository.createWallet(customer.id);

  // Determine number of vehicles based on customer type
  const numberOfVehicles = customerType === 'DCO' ? 1 : 1; // Default to 1, can be modified for FLEET_CUSTOMER

  // Create vehicle(s)
  for (let i = 0; i < numberOfVehicles; i++) {
    await customerRepository.createVehicle(customer.id);
  }

  // Create 36 scheduled EMIs
  await customerRepository.createScheduledEmis(customer.id, numberOfVehicles);

  return customer;
};

