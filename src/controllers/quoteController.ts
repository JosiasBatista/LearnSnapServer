import { Quote } from "@prisma/client";
import { Request, Response } from "express";
import { CustomRequest } from "../interfaces/commons";

import { CustomError } from "../exceptions/CustomError";
import * as quoteService from "../services/quoteService";

export const createQuote = async (req: CustomRequest, res: Response) => {
  try {
    const quote: Quote = await quoteService.createQuote(req.body, req.payload);

    if (!quote) {
      res.status(500).json({ message: "Erro ao criar artigo" })
      return;
    }

    res.status(201).json(quote);
  } catch (error: unknown) {
    if (error instanceof CustomError) {
      res.status(error.getStatusCode()).json(error.message);
    } else {
      res.status(500).json({ message: `Erro ao criar citação: ${error}` })
    }
  }
}

export const getQuote = async (req: Request, res: Response) => {
  try {
    const quote: Quote | null = await quoteService.getQuote(parseInt(req.params.id));

    if (!quote) {
      res.status(404).json({ message: "Citação não encontrada na base" });
    }

    res.status(200).json(quote);
  } catch (error: unknown) {
    if (error instanceof CustomError) {
      res.status(error.getStatusCode()).json(error.message);
    } else {
      res.status(500).json({ message: `Erro ao criar citação: ${error}` })
    }
  }
}

export const deleteQuote = async (req: CustomRequest, res: Response) => {
  try {
    await quoteService.deleteQuote(parseInt(req.params.id), req.payload);
    
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: `Erro ao deletar artigo: ${error}` })
  }
}