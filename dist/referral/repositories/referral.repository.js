"use strict";
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
exports.getCustomerEmiPayments = exports.getCustomersWithReferrals = exports.getReferralAnalytics = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getReferralAnalytics = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalReferrals = yield prisma.customer.count({
        where: {
            referred_by: {
                not: null,
            },
        },
    });
    const convertedReferrals = yield prisma.customer.count({
        where: {
            referred_by: {
                not: null,
            },
            // Assuming a customer is "converted" if they have at least one vehicle
            Vehicle: {
                some: {},
            },
        },
    });
    const totalPayouts = yield prisma.transaction.aggregate({
        where: {
            type: 'CREDIT',
            reason: {
                contains: 'Referral',
            },
        },
        _sum: {
            amount: true,
        },
    });
    return {
        totalReferrals,
        convertedReferrals,
        totalPayouts: totalPayouts._sum.amount || 0,
    };
});
exports.getReferralAnalytics = getReferralAnalytics;
const getCustomersWithReferrals = () => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.customer.findMany({
        where: {
            referred_by: {
                not: null,
            },
        },
        include: {
            Vehicle: true,
            ScheduledEmi: {
                where: {
                    status: 'COMPLETED',
                },
                orderBy: {
                    week_count: 'asc',
                },
            },
        },
    });
});
exports.getCustomersWithReferrals = getCustomersWithReferrals;
const getCustomerEmiPayments = (customerId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.scheduledEmi.findMany({
        where: {
            customer_id: customerId,
            status: 'COMPLETED',
        },
        orderBy: {
            week_count: 'asc',
        },
    });
});
exports.getCustomerEmiPayments = getCustomerEmiPayments;
