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
exports.updateWalletBalance = exports.createTransaction = exports.getScheduledEmiById = exports.updateScheduledEmiStatus = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const updateScheduledEmiStatus = (emiId, paidDate) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.scheduledEmi.update({
        where: { id: emiId },
        data: { status: 'COMPLETED', paid_date: paidDate },
    });
});
exports.updateScheduledEmiStatus = updateScheduledEmiStatus;
const getScheduledEmiById = (emiId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.scheduledEmi.findUnique({
        where: { id: emiId },
    });
});
exports.getScheduledEmiById = getScheduledEmiById;
const createTransaction = (userId, amount, type, reason) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.transaction.create({
        data: {
            user_id: userId,
            amount,
            type,
            reason,
        },
    });
});
exports.createTransaction = createTransaction;
const updateWalletBalance = (userId, amount, type) => __awaiter(void 0, void 0, void 0, function* () {
    const currentWallet = yield prisma.wallet.findUnique({
        where: { user_id: userId },
    });
    if (!currentWallet) {
        throw new Error('Wallet not found for this user');
    }
    const newBalance = type === 'CREDIT' ? currentWallet.balance + amount : currentWallet.balance - amount;
    return prisma.wallet.update({
        where: { user_id: userId },
        data: { balance: newBalance },
    });
});
exports.updateWalletBalance = updateWalletBalance;
