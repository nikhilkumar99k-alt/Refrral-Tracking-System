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
exports.moveLeadToCustomer = exports.getAllLeads = exports.addLead = void 0;
const leadService = __importStar(require("../services/lead.service"));
const addLead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, phone, email, address, source, referred_by } = req.body;
        if (!name || !phone || !email || !address || !source) {
            return res.status(400).json({ error: 'Name, phone, email, address, and source are required' });
        }
        const leadData = {
            name,
            phone,
            email,
            address,
            source,
            created_by: req.user.id,
            referred_by: referred_by ? parseInt(referred_by) : undefined,
        };
        const lead = yield leadService.addLead(leadData);
        res.status(201).json({
            message: 'Lead added successfully',
            lead,
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.addLead = addLead;
const getAllLeads = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const leads = yield leadService.getAllLeads();
        res.status(200).json({
            leads,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAllLeads = getAllLeads;
const moveLeadToCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { leadId, customerType } = req.body;
        if (!leadId || !customerType) {
            return res.status(400).json({ error: 'Lead ID and customer type are required' });
        }
        const customer = yield leadService.moveLeadToCustomer(parseInt(leadId), customerType, req.user.id);
        res.status(200).json({
            message: 'Lead moved to customer successfully',
            customer,
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.moveLeadToCustomer = moveLeadToCustomer;
