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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const auth_routes_1 = __importDefault(require("./auth/routes/auth.routes"));
const lead_routes_1 = __importDefault(require("./leads/routes/lead.routes"));
const customer_routes_1 = __importDefault(require("./customers/routes/customer.routes"));
const payment_routes_1 = __importDefault(require("./payments/routes/payment.routes"));
const referral_routes_1 = __importDefault(require("./referral/routes/referral.routes"));
const admin_routes_1 = __importDefault(require("./admin/routes/admin.routes"));
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use('/auth', auth_routes_1.default);
app.use('/leads', lead_routes_1.default);
app.use('/customers', customer_routes_1.default);
app.use('/payments', payment_routes_1.default);
app.use('/referral', referral_routes_1.default);
app.use('/admin', admin_routes_1.default);
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
process.on('beforeExit', () => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
