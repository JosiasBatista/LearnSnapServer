import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import jwt from 'jsonwebtoken';

import { RefreshTokenProps } from "../interfaces/token";
import { createRefreshToken, deleteTokenById, findTokenById, revokeAllUserTokens } from "../models/tokenModel";
import { LoginReq, RefreshReq, RegisterReq } from '../interfaces/user';
import * as userService from "./userService";
import { validateUserAuthReq } from '../utils/validations';
import { generateTokens } from '../utils/jwt';
import { CustomError } from '../exceptions/CustomError';
import { hashToken } from '../utils/hashToken';

export const addRefreshTokenToWhiteList = (data: RefreshTokenProps) => {
    return createRefreshToken(data);
}

export const findRefreshTokenById = (id: string) => {
    return findTokenById(id);
}

export const deleteRefreshToken = (id: string) => {
  return deleteTokenById(id);
}

export const revokeTokens = (userId: number) => {
  return revokeAllUserTokens(userId);
}

export const validateUserPasswordToLogin = async (password: string, user: User) => {
  const result = await bcrypt.compare(password, user.password);
  return result;
}

export const authenticateUser = async (requestBody: LoginReq) => {
  if (!validateUserAuthReq(requestBody, true)) {
    throw new CustomError("Informações incompletas", 400);
  }

  const user: User | null = await userService.findUserByEmail(requestBody.email);
  if (!user) {
    throw new CustomError('Usuário não existente na base', 400);
  }

  console.log("LOGIN || Usuário encontrado")
  const validatedPassword = await validateUserPasswordToLogin(requestBody.password, user);
  if (!validatedPassword) {
    throw new CustomError('Informações de login inválidas', 400);
  }

  console.log("LOGIN || Senha validada")
  const jti = v4();
  const { accessToken, refreshToken } = generateTokens(user, jti);

  if (!accessToken || !refreshToken) {
    throw new CustomError('Erro ao realizar autenticação', 500);
  }
  
  console.log("LOGIN || Tokens gerados para o usuário: " + user.id)
  await addRefreshTokenToWhiteList({ jti, refreshToken, userId: user.id})

  return {
    accessToken,
    refreshToken,
    userId: user.id
  }
}

export const registerUser = async (requestBody: RegisterReq) => {
  if (!validateUserAuthReq(requestBody, false)) {
    throw new Error(JSON.stringify({ status: 400, message: "Informações incompletas"}));
  }

  const user: User = await userService.createUser(requestBody);
  const jti = v4();
  const { accessToken, refreshToken } = generateTokens(user, jti);

  if (!accessToken || !refreshToken) {
    throw new Error(JSON.stringify({ status: 500, message: 'Erro ao registrar usuário' }));
  }

  await addRefreshTokenToWhiteList({ jti, refreshToken, userId: user.id})

  return {
    accessToken,
    refreshToken
  }
}

export const refreshToken = async (requestBody: RefreshReq) => {
  try {
    const refreshToken = requestBody.refreshToken;
    if (!refreshToken) {
      throw new CustomError("RefreshToken não enviado", 400);
    }

    if (!process.env.JWT_REFRESH_SECRET) throw new CustomError("RefreshSecret not present", 500);

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    if (typeof payload === 'string' || !payload.jti) {
      throw new CustomError("Erro ao revalidar o token", 500);
    }
    const savedRefreshToken = await findRefreshTokenById(payload.jti);

    if (!savedRefreshToken || savedRefreshToken.revoked === true) {
      throw new CustomError("Não autorizado", 401);
    }

    const hashedToken = hashToken(refreshToken);
    if (hashedToken !== savedRefreshToken.hashedToken) {
      throw new CustomError("Não autorizado", 401);
    }

    const user = await userService.findUserById(payload.userId);
    if (!user) {
      throw new CustomError("Não autorizado", 401);
    }

    await deleteRefreshToken(savedRefreshToken.id);
    const jti = v4();
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user, jti);

    if (!newRefreshToken) {
      throw new CustomError("Erro ao revalidar o token", 500);
    }
    await addRefreshTokenToWhiteList({ jti, refreshToken: newRefreshToken, userId: user.id });

    return ({
      accessToken,
      refreshToken: newRefreshToken
    });
  } catch {
    throw new CustomError("Erro ao revalidar token", 500);
  }
}