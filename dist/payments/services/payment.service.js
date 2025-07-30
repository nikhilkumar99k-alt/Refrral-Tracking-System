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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.payEmi = void 0;
const paymentRepository = __importStar(require("../repositories/payment.repository"));
const axios_1 = __importDefault(require("axios"));
const RAZORPAY_API_URL = 'https://api.razorpay.com/v1/payment_links';
const RAZORPAY_AUTH = 'Basic cnpwX3Rlc3RfZ3d6UVJURWFIc2V5NUs6T2lyeVNGZzhzM2h5ZkpIWnkweFJreXNM';
const payEmi = (emiId, customerId, customerName, customerEmail, customerPhone) => __awaiter(void 0, void 0, void 0, function* () {
    const emi = yield paymentRepository.getScheduledEmiById(emiId);
    if (!emi) {
        throw new Error('EMI not found');
    }
    if (emi.status === 'COMPLETED') {
        throw new Error('EMI already paid');
    }
    // Create Razorpay payment link
    const paymentData = {
        amount: 450000, // ₹4500 in paise
        currency: 'INR',
        description: `EMI Payment - Week ${emi.week_count}`,
        callback_url: 'https://webhook.site/xxxx',
        callback_method: 'get',
        customer: {
            name: customerName,
            email: customerEmail,
            contact: customerPhone,
        },
    };
    try {
        const response = yield axios_1.default.post(RAZORPAY_API_URL, paymentData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': RAZORPAY_AUTH,
            },
        });
        // For simulation purposes, we'll mark the EMI as paid immediately
        // In a real application, this would be handled by a webhook from Razorpay
        yield paymentRepository.updateScheduledEmiStatus(emiId, new Date());
        yield paymentRepository.createTransaction(customerId, 4500, 'DEBIT', `EMI Payment - Week ${emi.week_count}`);
        return {
            paymentLink: response.data,
            message: 'Payment link created successfully',
        };
    }
    catch (error) {
        throw new Error(`Payment link creation failed: ${error.message}`);
    }
});
exports.payEmi = payEmi;
