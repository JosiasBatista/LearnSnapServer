import { Quizz } from "@prisma/client"
import { Response } from "express"

import * as quizzService from "../services/quizzService";
import { CustomRequest } from "../interfaces/commons"
import { CustomError } from "../exceptions/CustomError";

export const createQuizz = async (req: CustomRequest, res: Response) => {
  try {
    const quizz: Quizz = await quizzService.createQuizz(req.body, req.payload);

    if (!quizz) {
      return res.status(500).json({ message: "Erro ao realizar criação de Quizz"})
    }

    return res.status(201).json(quizz);
  } catch (error: unknown) {
    if (error instanceof CustomError) {
      res.status(error.getStatusCode()).json({ message: error.message });;
    } else {
      res.status(500).json({ message: `Erro ao criar o quizz: ${error}` })
    }
  }
}

export const getQuizz = async (req: CustomRequest, res: Response) => {
  try {
    const quizz: Quizz | null = await quizzService.getQuizz(parseInt(req.params.id), req.payload)

    if (!quizz) {
      return res.status(404).json({ message: "Quizz não encontrado na base" })
    }

    return res.status(200).json(quizz);
  } catch (error: any) {
    res.status(500).json({ message: `Erro ao encontrar o quizz: ${error}` })
  }
}

export const deleteQuizz = async (req: CustomRequest, res: Response) => {
  try {
    await quizzService.deleteQuizz(parseInt(req.params.id), req.payload);

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: `Erro ao deletar o quizz: ${error}` })
  }
}

export const answerQuizz = async (req: CustomRequest, res: Response) => {
  try {
    const answerResult = await quizzService.answerQuizz(req.body, req.payload);

    res.status(200).send(answerResult)
  } catch (error: unknown) {
    if (error instanceof CustomError) {
      res.status(error.getStatusCode()).json({ message: error.message });;
    } else {
      res.status(500).json({ message: `Erro ao responder o quizz: ${error}` })
    }
  }
}