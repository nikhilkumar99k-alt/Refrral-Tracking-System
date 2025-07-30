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
exports.createCustomerFromLead = exports.getAllCustomers = void 0;
const customerRepository = __importStar(require("../repositories/customer.repository"));
const authRepository = __importStar(require("../../auth/repositories/auth.repository"));
const getAllCustomers = () => __awaiter(void 0, void 0, void 0, function* () {
    return customerRepository.getAllCustomers();
});
exports.getAllCustomers = getAllCustomers;
const createCustomerFromLead = (lead, customerType, created_by) => __awaiter(void 0, void 0, void 0, function* () {
    // Create auth entry for the customer
    const auth = yield authRepository.createUser({
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
    });
    // Generate referral code
    const referCode = `REF${auth.id}${Date.now().toString().slice(-4)}`;
    // Create customer
    const customer = yield customerRepository.createCustomer({
        authId: auth.id,
        leadId: lead.id,
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        address: lead.address,
        customer_type: customerType,
        created_by,
        referred_by: lead.referred_by,
        refer_code: referCode,
    });
    // Create wallet
    yield customerRepository.createWallet(customer.id);
    // Determine number of vehicles based on customer type
    const numberOfVehicles = customerType === 'DCO' ? 1 : 1; // Default to 1, can be modified for FLEET_CUSTOMER
    // Create vehicle(s)
    for (let i = 0; i < numberOfVehicles; i++) {
        yield customerRepository.createVehicle(customer.id);
    }
    // Create 36 scheduled EMIs
    yield customerRepository.createScheduledEmis(customer.id, numberOfVehicles);
    return customer;
});
exports.createCustomerFromLead = createCustomerFromLead;
