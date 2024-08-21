import { User } from '@prisma/client';

import * as userModel from '../models/userModel';

export const createUser = async (userData: User): Promise<User> => {
  const existingUser = await userModel.findUserByEmail(userData.email);

  if (existingUser) {
    throw new Error('Email já em uso');
  }
  return await userModel.createUser(userData);
}

export const findUserByEmail = async (email: string): Promise<User> => {
  return await userModel.findUserByEmail(email);
}