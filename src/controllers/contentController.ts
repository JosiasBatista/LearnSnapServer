import { Request, Response } from "express";
import * as contentService from "../services/contentService";
import { CustomRequest } from "../interfaces/commons";
import { CustomError } from "../exceptions/CustomError";

export const getContentList = async (req: CustomRequest, res: Response) => {
  try {
    const contents = await contentService.getContents(
      parseInt(req.params.page), 
      parseInt(req.params.limit),
      req.payload
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

export const unlikeContent = async (req: CustomRequest, res: Response) => {
  try {
    const likeAmount = await contentService.unlikeContent(
      parseInt(req.params.id),
      req.payload
    );

    res.status(201).json(likeAmount);
  } catch (error: unknown) {
    if (error instanceof CustomError) {
      res.status(error.getStatusCode()).json({ message: error.message });;
    } else {
      res.status(500).json({ message: 'Erro ao remover like' })
    }
  }
}

export const createComment = async (req: CustomRequest, res: Response) => {
  try {
    const comment = await contentService.createComment(req.body, req.payload);

    res.status(201).json(comment)
  } catch (error: unknown) {
    res.status(500).json({ message: "Erro ao adicionar comentário" })
  }
}

export const getCommentsFromContent = async (req: Request, res: Response) => {
  try {
    const comments = await contentService.getCommentsFromContent(parseInt(req.params.id));

    res.status(200).json(comments)
  } catch (error: unknown) {
    res.status(500).json({ message: "Erro ao buscar lista de comentários" });
  }
}