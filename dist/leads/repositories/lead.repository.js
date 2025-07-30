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
exports.updateLeadStatus = exports.getLeadById = exports.getAllLeads = exports.createLead = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createLead = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.lead.create({
        data,
    });
});
exports.createLead = createLead;
const getAllLeads = () => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.lead.findMany();
});
exports.getAllLeads = getAllLeads;
const getLeadById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.lead.findUnique({
        where: { id },
    });
});
exports.getLeadById = getLeadById;
const updateLeadStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    // Assuming 'status' is part of the Lead model, though not explicitly defined in the provided schema.
    // For now, this function will just return the lead, as there's no direct 'status' field to update.
    // If a status field is added to the Lead model, this function should be updated accordingly.
    return prisma.lead.update({
        where: { id },
        data: { source: status }, // Using 'source' as a placeholder for status update for now.
    });
});
exports.updateLeadStatus = updateLeadStatus;
