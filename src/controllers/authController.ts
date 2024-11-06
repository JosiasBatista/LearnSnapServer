import { Request, Response } from 'express';

import * as authService from "../services/authService";
import { CustomError } from '../exceptions/CustomError';

export const register = async (req: Request, res: Response) => {
  try {
    const { accessToken, refreshToken, userId } = await authService.registerUser(req.body);
    
    res.status(201).json({
      accessToken,
      refreshToken,
      userId
    })
  } catch (error: unknown) {
    if (error instanceof CustomError) {
      res.status(error.getStatusCode()).json({ message: error.message });
    } else {
      res.status(500).json({ message: `Erro ao realizar registro: ${error}` })
    }
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { accessToken, refreshToken, userId } = await authService.authenticateUser(req.body);

    res.status(200).json({
      accessToken,
      refreshToken,
      userId
    })
  } catch (error: unknown) {
    if (error instanceof CustomError) {
      res.status(error.getStatusCode()).json({ message: error.message });
    } else {
      res.status(500).json({ message: `Erro ao realizar login: ${error}` })
    }
  }
}

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { accessToken, refreshToken } = await authService.refreshToken(req.body);

    res.status(200).json({
      accessToken,
      refreshToken
    })
  } catch (error: unknown) {
    if (error instanceof CustomError) {
      res.status(error.getStatusCode()).json({ message: error.message });;
    } else {
      res.status(500).json({ message: `Erro ao atualizar token: ${error}` })
    }
  }
}

export const revokeRefreshTokens = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    await authService.revokeTokens(userId);

    res.status(200).json({ message: 'Tokens de acesso removidos' })
  } catch {
    res.status(500).json({ message: 'Erro ao remover tokens de acesso' })
  }
}