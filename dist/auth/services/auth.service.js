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
exports.registerUser = exports.loginUser = void 0;
const authRepository = __importStar(require("../repositories/auth.repository"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';
const loginUser = (identifier, otp) => __awaiter(void 0, void 0, void 0, function* () {
    // In a real application, you would verify the OTP with a service like Twilio or a database.
    // For this project, we simulate OTP verification by checking if it's '0000'.
    if (otp !== '0000') {
        throw new Error('Invalid OTP');
    }
    const user = yield authRepository.findUserByEmailOrPhone(identifier);
    if (!user) {
        throw new Error('User not found');
    }
    yield authRepository.updateLastLogin(user.id);
    const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role, email: user.email, phone: user.phone }, JWT_SECRET, { expiresIn: '1h' });
    return { user, token };
});
exports.loginUser = loginUser;
const registerUser = (name, phone, email) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield authRepository.findUserByEmailOrPhone(email);
    if (existingUser) {
        throw new Error('User with this email or phone already exists');
    }
    return authRepository.createUser({ name, phone, email });
});
exports.registerUser = registerUser;
