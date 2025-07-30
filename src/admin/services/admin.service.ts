import * as adminRepository from '../repositories/admin.repository';
import * as referralService from '../../referral/services/referral.service';

export const getDashboardData = async () => {
  const leads = await adminRepository.getAllLeads();
  const customers = await adminRepository.getAllCustomers();
  const vehicles = await adminRepository.getAllVehicles();
  const referralAnalytics = await referralService.getReferralAnalytics();

  return {
    leads,
    customers,
    vehicles,
    referralAnalytics,
  };
};

export const getAllTransactions = async () => {
  return adminRepository.getAllTransactions();
};

