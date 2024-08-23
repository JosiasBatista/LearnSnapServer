import { User } from '@prisma/client';

import * as userModel from '../models/userModel';
import { RegisterReq } from '../interfaces/user';

export const createUser = async (userReq: RegisterReq): Promise<User> => {
  const existingUser = await userModel.findUserByEmail(userReq.email);

  if (existingUser) {
    throw new Error('Email já em uso');
  }

  const { passwordConfirm, ...userInfos } = userReq;

  const userData: Omit<User, "id"> = {
    ...userInfos,
    contentsPosted: 0,
    createdAt: new Date(),
    field: ""
  }

  return await userModel.createUser(userData);
}

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return userModel.findUserByEmail(email);
}

export const findUserById = async (id: number): Promise<User | null> => {
  return userModel.findUserById(id);
}