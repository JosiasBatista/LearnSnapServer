import { Article } from '@prisma/client';
import { Request, Response } from 'express';

import * as articleService from "../services/articleService";

export const createArticle = async (req: Request, res: Response) => {
  try {
    const article: Article = await articleService.createArticle(req.body);

    if (!article) {
      res.status(500).json({ message: "Houve um erro ao criar o seu artigo" })
      return;
    }

    res.status(201).json(article);
  } catch (error: any) {
    try {
      const errorParsed = JSON.parse(error);
      res.status(errorParsed.status).json(errorParsed.message);
    } catch (e) {
      res.status(500).json({ message: 'Erro ao realizar login: ', e })
    }
  }
}