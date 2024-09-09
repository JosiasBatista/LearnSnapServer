import { User } from '@prisma/client';
import bcrypt from 'bcrypt';

import * as userModel from '../models/userModel';
import { RegisterReq } from '../interfaces/user';
import { CustomError } from '../exceptions/CustomError';

export const createUser = async (userReq: RegisterReq): Promise<User> => {
  const existingUser = await userModel.findUserByEmail(userReq.email);

  if (existingUser) {
    throw new Error('Email já em uso');
  }

  const { passwordConfirm, ...userInfos } = userReq;

  return bcrypt.hash(userInfos.password, 10).then(async (hash) => {
    const userData: Omit<User, "id"> = {
      ...userInfos,
      contentsPosted: 0,
      createdAt: new Date(),
      field: "",
      password: hash
    }
  
    const user = await userModel.createUser(userData);
    return user;
  }).catch(() => {
    throw new CustomError("Erro ao criar usuário", 500);
  })
}

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return userModel.findUserByEmail(email);
}

export const findUserById = async (id: number): Promise<User | null> => {
  return userModel.findUserById(id);
}