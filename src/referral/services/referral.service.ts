
// export const processReferralPayout = async (customerId: number) => {
//   // Get the customer who was referred
//   const customer = await referralRepository.getCustomersWithReferrals();
//   const referredCustomer = customer.find(c => c.id === customerId);

//   if (!referredCustomer || !referredCustomer.referred_by) {
//     return;
//   }

//   const referrerId = referredCustomer.referred_by;

//   // Check if vehicle has been delivered (customer has at least one vehicle)
//   if (referredCustomer.Vehicle.length > 0) {
//     // Credit ₹5000 to referrer's wallet for vehicle delivery
//     await paymentRepository.updateWalletBalance(referrerId, 5000, 'CREDIT');
//     await paymentRepository.createTransaction(referrerId, 5000, 'CREDIT', 'Referral bonus - Vehicle delivered');
//   }

//   // Check if first 3 EMIs are paid on time
//   const emiPayments = await referralRepository.getCustomerEmiPayments(customerId);
//   const firstThreeEmis = emiPayments.slice(0, 3);

//   if (firstThreeEmis.length === 3) {
//     // Check if all were paid on or before due date
//     const allPaidOnTime = firstThreeEmis.every(emi => {
//       return emi.paid_date && emi.paid_date <= emi.due_date;
//     });

//     if (allPaidOnTime) {
//       // Credit additional ₹2500 to referrer's wallet
//       await paymentRepository.updateWalletBalance(referrerId, 2500, 'CREDIT');
//       await paymentRepository.createTransaction(referrerId, 2500, 'CREDIT', 'Referral bonus - First 3 EMIs paid on time');
//     }
//   }
// };

import * as referralRepository from '../repositories/referral.repository';
import * as paymentRepository from '../../payments/repositories/payment.repository';
import * as customerRepository from '../../customers/repositories/customer.repository';
import { PrismaClient, TransactionSource } from '@prisma/client';
import { createWallet } from '../../customers/repositories/customer.repository';

const prisma = new PrismaClient();

export const processFirstReferralPayout = async (customerId: number) => {
  // Get the customer who was referred directly by ID
  const referredCustomer = await customerRepository.getCustomerById(customerId);

  if (!referredCustomer || !referredCustomer.referred_by) {
    return { success: false, message: "Customer not found or not referred by anyone" };
  }

  const referrerId = referredCustomer.referred_by;
  // Check if vehicle has been delivered (customer has at least one vehicle)
  // if (referredCustomer.Vehicle.length > 0) {
    // Credit ₹5000 to referrer's wallet for vehicle delivery
    let currentWallet = await prisma.wallet.findUnique({
      where: { user_id: referrerId },
    });

    const isValidCust = await customerRepository.getCustomerById(
      referrerId
    );
    if (!isValidCust) {
      return { success: false, message: "Referrer customer not found" };
    }
    
    if (isValidCust.first_payout == true) {
      return { success: false, message: "First payout already processed for this referrer" };
    }

    if (!currentWallet) {
      await createWallet(referrerId);
      currentWallet = await prisma.wallet.findUnique({
        where: { user_id: referrerId },
      });
    }
    
    await paymentRepository.updateWalletBalance(referrerId, 5000, 'CREDIT');
    await paymentRepository.createTransaction(referrerId, 5000, 'CREDIT', 'Referral bonus - Vehicle delivered',TransactionSource.REFRRAL);
    await customerRepository.updateFirstPayout(referrerId)
    return { success: true, message: "First referral payout of ₹5000 credited successfully" };
  // }
};

export const processSecondReferralPayout = async (customerId: number) => {
  // Get the customer who was referred directly by ID
  const referredCustomer = await customerRepository.getCustomerById(customerId);

  if (!referredCustomer || !referredCustomer.referred_by) {
    return { success: false, message: "Customer not found or not referred by anyone" };
  }

  const referrerId = referredCustomer.referred_by;

  const isValidCust = await customerRepository.getCustomerById(
    referrerId
  );
  if (!isValidCust) {
    return { success: false, message: "Referrer customer not found" };
  }
  
  if (isValidCust.first_payout == true) {
    return { success: false, message: "Second payout already processed for this referrer" };
  }

  // // Check if first 3 EMIs are paid on time
  // const emiPayments = await referralRepository.getCustomerEmiPayments(customerId);
  // const firstThreeEmis = emiPayments.slice(0, 3);

  // if (firstThreeEmis.length < 3) {
  //   return { success: false, message: "Customer has not completed first 3 EMI payments yet" };
  // }
  
  // // Check if all were paid on or before due date
  // const allPaidOnTime = firstThreeEmis.every(emi => {
  //   return emi.paid_date && emi.paid_date <= emi.due_date;
  // });

  // if (!allPaidOnTime){
  //   return { success: false, message: "Not all of the first 3 EMIs were paid on time" };
  // }
  
  // Credit additional ₹2500 to referrer's wallet
  let currentWallet = await prisma.wallet.findUnique({
    where: { user_id: referrerId },
  });

  if (!currentWallet) {
    await createWallet(referrerId);
    currentWallet = await prisma.wallet.findUnique({
      where: { user_id: referrerId },
    });
  }
  
  await paymentRepository.updateWalletBalance(referrerId, 2500, 'CREDIT');
  await paymentRepository.createTransaction(referrerId, 2500, 'CREDIT', 'Referral bonus - First 3 EMIs paid on time', TransactionSource.REFRRAL);
  await customerRepository.updateSecondPayout(referrerId)
  return { success: true, message: "Second referral payout of ₹2500 credited successfully" };
};

export const getReferralAnalytics = async (user?:any) => {
  if(user?.cust_id)
      return referralRepository.getReferralAnalyticsForCustomer(user.cust_id);
  return referralRepository.getReferralAnalytics();
};

