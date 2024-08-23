import { Request, Response } from 'express';

import * as authService from "../services/authService";

export const register = async (req: Request, res: Response) => {
  try {
    const { accessToken, refreshToken } = await authService.registerUser(req.body);
    
    res.status(201).json({
      accessToken,
      refreshToken
    })
  } catch (error: any) {
    console.log(error)
    try {
      const errorParsed = JSON.parse(error);
      res.status(errorParsed.status).json(errorParsed.message);
    } catch (e) {
      res.status(500).json({ message: 'Erro ao realizar login: ', e })
    }
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { accessToken, refreshToken } = await authService.authenticateUser(req.body);

    res.status(200).json({
      accessToken,
      refreshToken
    })
  } catch (error: any) {
    try {
      const errorParsed = JSON.parse(error);
      res.status(errorParsed.status).json(errorParsed.message);
    } catch (e) {
      res.status(500).json({ message: 'Erro ao realizar login: ', e })
    }
  }
}