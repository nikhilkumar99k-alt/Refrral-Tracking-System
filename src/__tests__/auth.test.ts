import { PrismaClient } from '@prisma/client';
import { loginUser, registerUser } from '../auth/services/auth.service';
import * as authRepository from '../auth/repositories/auth.repository';

const prisma = new PrismaClient();

describe('Auth Service', () => {
  beforeAll(async () => {
    // Clear the database before running tests
    await prisma.$connect();
    await prisma.auth.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should register a new user', async () => {
    const user = await registerUser('Test User', '1234567890', 'test@example.com');
    expect(user).toBeDefined();
    expect(user.email).toBe('test@example.com');
  });

  it('should login a user with valid OTP', async () => {
    await registerUser('Login User', '0987654321', 'login@example.com');
    const { user, token } = await loginUser('login@example.com', '0000');
    expect(user).toBeDefined();
    expect(token).toBeDefined();
  });

  it('should throw an error for invalid OTP', async () => {
    await registerUser('Invalid OTP User', '1112223334', 'invalidotp@example.com');
    await expect(loginUser('invalidotp@example.com', '9999')).rejects.toThrow('Invalid OTP');
  });

  it('should throw an error for user not found', async () => {
    await expect(loginUser('nonexistent@example.com', '0000')).rejects.toThrow('User not found');
  });
});

