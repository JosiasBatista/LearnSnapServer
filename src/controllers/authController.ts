import { Request, Response } from 'express';
import { User } from '@prisma/client';
import { v4 } from 'uuid';

import * as authService from "../services/authService";
import * as userService from "../services/userService";
import { validateUserReq } from '../utils/validations';
import { generateTokens } from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
    try {
        const validatedReq = validateUserReq(req.body);

        if (!validatedReq) {
            res.status(400).json({ message: 'Informações incompletas para criação de usuário' });
            return;
        }

        const newUser: User = await userService.createUser(req.body);
        const jti = v4();
        const { accessToken, refreshToken } = generateTokens(newUser, jti);
        await authService.addRefreshTokenToWhiteList({ jti, refreshToken, userId: newUser.id})

        res.status(201).json({
            accessToken,
            refreshToken
        })
    } catch (error) {
        res.status(500).json("Erro ao registrar: " + error);
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const validatedReq = validateUserReq(req.body);

        if (!validatedReq) {
            res.status(400).json({ message: 'Informações incompletas' });
            return;
        }

        const user: User = userService.findUserByEmail(req.body.email);
        const validatedPassword = authService.validateUserPasswordToLogin(req.body.password, user);

        if (!validatedPassword) {
            res.status(403).json({ message: 'Informações de login inválidas' });
            return;
        }

        const jti = v4();
        const { accessToken, refreshToken } = generateTokens(user, jti);
        await authService.addRefreshTokenToWhiteList({ jti, refreshToken, userId: user.id})

        res.status(200).json({
            accessToken,
            refreshToken
        })
    } catch (error) {
        res.status(500).json({ message: "Erro ao realizar login: " + error });
    }
}