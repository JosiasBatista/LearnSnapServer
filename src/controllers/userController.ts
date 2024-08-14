import { Request, Response } from 'express';
import { User } from '@prisma/client';
import { validateUserReq } from '../utils/validations';

import * as userService from "../services/userService";

export const getUser = async (req: Request, res: Response) => {
  try {
    const user: User = await userService.findUserById(req.body.userId);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários', error });
  }
}