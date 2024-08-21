import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { v4 } from 'uuid';

import { RefreshTokenProps } from "../interfaces/token";
import { createRefreshToken, findTokenById } from "../models/tokenModel";
import { LoginReq, RegisterReq } from '../interfaces/user';
import * as userService from "./userService";
import { validateUserAuthReq } from '../utils/validations';
import { generateTokens } from '../utils/jwt';

export const addRefreshTokenToWhiteList = (data: RefreshTokenProps) => {
    return createRefreshToken(data);
}

export const findRefreshTokenById = (id: string) => {
    return findTokenById(id);
}

export const validateUserPasswordToLogin = (password: string, user: User) => {
    return bcrypt.compare(password, user.password);
}

export const authenticateUser = async (requestBody: LoginReq) => {
  if (!validateUserAuthReq(requestBody, true)) {
    throw new Error(JSON.stringify({ status: 400, message: "Informações incompletas"}));
  }

  const user: User | null = await userService.findUserByEmail(requestBody.email);
  if (!user) {
    throw new Error(JSON.stringify({ status: 400, message: 'Usuário não existente na base' }));
  }

  const validatedPassword = validateUserPasswordToLogin(requestBody.password, user);
  if (!validatedPassword) {
    throw new Error(JSON.stringify({ status: 400, message: 'Informações de login inválidas' }));
  }

  const jti = v4();
  const { accessToken, refreshToken } = generateTokens(user, jti);
  await addRefreshTokenToWhiteList({ jti, refreshToken, userId: user.id})

  return {
    accessToken,
    refreshToken
  }
}

export const registerUser = async (requestBody: RegisterReq) => {
  if (!validateUserAuthReq(requestBody, false)) {
    throw new Error(JSON.stringify({ status: 400, message: "Informações incompletas"}));
  }

  const user: User = await userService.createUser(requestBody);
  const jti = v4();
  const { accessToken, refreshToken } = generateTokens(user, jti);
  await addRefreshTokenToWhiteList({ jti, refreshToken, userId: user.id})

  return {
    accessToken,
    refreshToken
  }
}