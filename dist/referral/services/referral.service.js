"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReferralAnalytics = exports.processReferralPayout = void 0;
const referralRepository = __importStar(require("../repositories/referral.repository"));
const paymentRepository = __importStar(require("../../payments/repositories/payment.repository"));
const processReferralPayout = (customerId) => __awaiter(void 0, void 0, void 0, function* () {
    // Get the customer who was referred
    const customer = yield referralRepository.getCustomersWithReferrals();
    const referredCustomer = customer.find(c => c.id === customerId);
    if (!referredCustomer || !referredCustomer.referred_by) {
        return;
    }
    const referrerId = referredCustomer.referred_by;
    // Check if vehicle has been delivered (customer has at least one vehicle)
    if (referredCustomer.Vehicle.length > 0) {
        // Credit ₹5000 to referrer's wallet for vehicle delivery
        yield paymentRepository.updateWalletBalance(referrerId, 5000, 'CREDIT');
        yield paymentRepository.createTransaction(referrerId, 5000, 'CREDIT', 'Referral bonus - Vehicle delivered');
    }
    // Check if first 3 EMIs are paid on time
    const emiPayments = yield referralRepository.getCustomerEmiPayments(customerId);
    const firstThreeEmis = emiPayments.slice(0, 3);
    if (firstThreeEmis.length === 3) {
        // Check if all were paid on or before due date
        const allPaidOnTime = firstThreeEmis.every(emi => {
            return emi.paid_date && emi.paid_date <= emi.due_date;
        });
        if (allPaidOnTime) {
            // Credit additional ₹2500 to referrer's wallet
            yield paymentRepository.updateWalletBalance(referrerId, 2500, 'CREDIT');
            yield paymentRepository.createTransaction(referrerId, 2500, 'CREDIT', 'Referral bonus - First 3 EMIs paid on time');
        }
    }
});
exports.processReferralPayout = processReferralPayout;
const getReferralAnalytics = () => __awaiter(void 0, void 0, void 0, function* () {
    return referralRepository.getReferralAnalytics();
});
exports.getReferralAnalytics = getReferralAnalytics;
