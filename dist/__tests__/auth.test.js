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
const client_1 = require("@prisma/client");
const auth_service_1 = require("../auth/services/auth.service");
const prisma = new client_1.PrismaClient();
describe('Auth Service', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clear the database before running tests
        yield prisma.$connect();
        yield prisma.auth.deleteMany({});
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    it('should register a new user', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, auth_service_1.registerUser)('Test User', '1234567890', 'test@example.com');
        expect(user).toBeDefined();
        expect(user.email).toBe('test@example.com');
    }));
    it('should login a user with valid OTP', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, auth_service_1.registerUser)('Login User', '0987654321', 'login@example.com');
        const { user, token } = yield (0, auth_service_1.loginUser)('login@example.com', '0000');
        expect(user).toBeDefined();
        expect(token).toBeDefined();
    }));
    it('should throw an error for invalid OTP', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, auth_service_1.registerUser)('Invalid OTP User', '1112223334', 'invalidotp@example.com');
        yield expect((0, auth_service_1.loginUser)('invalidotp@example.com', '9999')).rejects.toThrow('Invalid OTP');
    }));
    it('should throw an error for user not found', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect((0, auth_service_1.loginUser)('nonexistent@example.com', '0000')).rejects.toThrow('User not found');
    }));
});
