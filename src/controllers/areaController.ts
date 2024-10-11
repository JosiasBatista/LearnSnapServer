import { Request, Response } from "express";

import * as areaService from "../services/areaService";

export const getAreas = async (req: Request, res: Response) => {
  try {
    const areas = await areaService.getAreas();

    res.status(200).send(areas);
  } catch (error: unknown) {
    res.status(500).json({ message: 'Erro ao buscar áreas' });
  }
}