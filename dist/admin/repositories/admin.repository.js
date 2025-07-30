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
exports.getAllTransactions = exports.getAllVehicles = exports.getAllCustomers = exports.getAllLeads = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllLeads = () => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.lead.findMany();
});
exports.getAllLeads = getAllLeads;
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
const getAllVehicles = () => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.vehicle.findMany();
});
exports.getAllVehicles = getAllVehicles;
const getAllTransactions = () => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.transaction.findMany();
});
exports.getAllTransactions = getAllTransactions;
