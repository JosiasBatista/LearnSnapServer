import { Request, Response } from "express";
import * as userService from "../services/userService";
import { CustomRequest } from "../interfaces/commons";
import { CustomError } from "../exceptions/CustomError";

export const getUserAreasOfInterest = async (req: Request, res: Response) => {
  const areasOfInterest = await userService.getUserAreasOfInterest(parseInt(req.params.userId));

  res.status(200).json({areasOfInterest});
}

export const getUserById = async (req: Request, res: Response) => {
  const user = await userService.findUserById(parseInt(req.params.userId));

  res.status(200).json(user)
}

export const updateUserAreas = async (req: CustomRequest, res: Response) => {
  try {
    const user = await userService.updateUserAreas(req.body, req.payload);
  
    res.status(200).json(user);
  } catch (error: unknown) {
    if (error instanceof CustomError) {
      res.status(error.getStatusCode()).json({ message: error.message });
    } else {
      res.status(500).json({ message: `Erro ao atualizar áreas de interesse: ${error}` })
    }
  }
}