import { Request, Response } from 'express';
import { User } from '@prisma/client';

import * as userService from "../services/userService";

export const createUser = async (req: Request, res: Response) => {
  try {
    const isValidReq = validateUseReq(req.body);

    if (!isValidReq) {
      res.status(400).json({ message: 'Informações incompletas para criação de usuário' });
      return;
    }
    
    const newUser: User = await userService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários', error });
  }
}

const validateUseReq = (userReq: any): boolean => {
  return (!!userReq.name && !!userReq.email && !!userReq.password);
}