import { User } from '@prisma/client';
import bcrypt from 'bcrypt';

import { RefreshTokenProps } from "../interfaces/token";
import { createRefreshToken, findTokenById } from "../models/tokenModel";

export const addRefreshTokenToWhiteList = (data: RefreshTokenProps) => {
    return createRefreshToken(data);
}

export const findRefreshTokenById = (id: string) => {
    return findTokenById(id);
}

export const validateUserPasswordToLogin = (password: string, user: User) => {
    return bcrypt.compare(password, user.password);
}