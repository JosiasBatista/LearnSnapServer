import { Request, Response } from "express";
import * as contentService from "../services/contentService";
import { CustomRequest } from "../interfaces/commons";

export const getContentList = async (req: Request, res: Response) => {
  try {
    const contents = await contentService.getContents(
      parseInt(req.params.page), 
      parseInt(req.params.limit)
    );

    res.status(200).json(contents);
  } catch {
    res.status(500).json({ message: "Erro ao listar conteúdos" })
  }
}

export const likeContent = async (req: CustomRequest, res: Response) => {
  try {
    const likeAmount = await contentService.likeContent(parseInt(req.params.id), req.payload);

    res.status(201).json(likeAmount);
  } catch (error: unknown) {
    res.status(500).json({ message: "Erro ao conceder like" })
  }
}

export const createComment = async (req: CustomRequest, res: Response) => {
  try {
    const comment = await contentService.createComment(req.body, req.payload);

    res.status(201).json(comment)
  } catch (error: unknown) {
    res.status(500).json({ message: "Erro ao conceder like" })
  }
}