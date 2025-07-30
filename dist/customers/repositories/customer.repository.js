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
exports.createWallet = exports.createScheduledEmis = exports.createVehicle = exports.getCustomerByReferralCode = exports.getCustomerById = exports.getAllCustomers = exports.createCustomer = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createCustomer = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.customer.create({
        data,
    });
});
exports.createCustomer = createCustomer;
const getAllCustomers = () => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.customer.findMany({
        include: {
            Vehicle: true,
            ScheduledEmi: true,
            Wallet: true,
        },
    });
});
exports.getAllCustomers = getAllCustomers;
const getCustomerById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.customer.findUnique({
        where: { id },
        include: {
            Vehicle: true,
            ScheduledEmi: true,
            Wallet: true,
        },
    });
});
exports.getCustomerById = getCustomerById;
const getCustomerByReferralCode = (referralCode) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.customer.findUnique({
        where: { refer_code: referralCode },
    });
});
exports.getCustomerByReferralCode = getCustomerByReferralCode;
const createVehicle = (custId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.vehicle.create({
        data: { cust_id: custId },
    });
});
exports.createVehicle = createVehicle;
const createScheduledEmis = (customerId, numberOfVehicles) => __awaiter(void 0, void 0, void 0, function* () {
    const emis = [];
    const today = new Date();
    for (let week = 1; week <= 36; week++) {
        const dueDate = new Date(today);
        dueDate.setDate(dueDate.getDate() + (week - 1) * 7); // Weekly due every Tuesday
        // Set to Tuesday (day 2 of the week)
        const dayOfWeek = dueDate.getDay();
        const daysUntilTuesday = (2 - dayOfWeek + 7) % 7;
        dueDate.setDate(dueDate.getDate() + daysUntilTuesday);
        emis.push({
            customer_id: customerId,
            due_date: dueDate,
            week_count: week,
        });
    }
    return prisma.scheduledEmi.createMany({
        data: emis,
    });
});
exports.createScheduledEmis = createScheduledEmis;
const createWallet = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.wallet.create({
        data: {
            user_id: userId,
            balance: 0,
        },
    });
});
exports.createWallet = createWallet;
