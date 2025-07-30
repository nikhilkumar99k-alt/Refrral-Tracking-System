import * as authRepository from '../repositories/auth.repository';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

export const loginUser = async (identifier: string, otp: string) => {
  // In a real application, you would verify the OTP with a service like Twilio or a database.
  // For this project, we simulate OTP verification by checking if it's '0000'.
  if (otp !== '347612') {
    throw new Error('Invalid OTP');
  }

  const user = await authRepository.findUserByEmailOrPhone(identifier);

  if (!user) {
    throw new Error('User not found');
  }

  await authRepository.updateLastLogin(user.id);

  const token = jwt.sign(
    { id: user.id, role: user.role, email: user.email, phone: user.phone },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { user, token };
};

export const registerUser = async (name: string, phone: string, email: string) => {
  const existingUser = await authRepository.findUserByEmailOrPhone(email);
  if (existingUser) {
    throw new Error('User with this email or phone already exists');
  }
  return authRepository.createUser({ name, phone, email });
};


