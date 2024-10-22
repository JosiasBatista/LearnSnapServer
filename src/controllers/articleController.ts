import { Article } from '@prisma/client';
import { Request, Response } from 'express';
import { CustomRequest } from '../interfaces/commons';

import * as articleService from "../services/articleService";
import { CustomError } from '../exceptions/CustomError';

export const createArticle = async (req: CustomRequest, res: Response) => {
  try {
    const article: Article = await articleService.createArticle(req.body, req.payload);

    if (!article) {
      res.status(500).json({ message: "Erro ao criar artigo" })
      return;
    }

    res.status(201).json(article);
  } catch (error: unknown) {
    if (error instanceof CustomError) {
      res.status(error.getStatusCode()).json({ message: error.message });;
    } else {
      res.status(500).json({ message: `Erro ao criar artigo: ${error}` })
    }
  }
}

export const getArticle = async (req: Request, res: Response) => {
  try {
    const article: Article | null = await articleService.getArticle(parseInt(req.params.id));

    if (!article) {
      res.status(404).json({ message: "Artigo não encontrado na base" })
      return;
    }
    
    res.status(200).json(article);
  } catch (error: any) {
    res.status(500).json({ message: `Erro ao buscar artigo: ${error}` })
  }
}

export const deleteArticle = async (req: CustomRequest, res: Response) => {
  try {
    await articleService.deleteArticle(parseInt(req.params.id), req.payload);
    
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: `Erro ao deletar artigo: ${error}` })
  }
}