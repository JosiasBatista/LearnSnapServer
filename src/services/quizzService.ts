import { JwtPayload } from "jsonwebtoken"
import { Content, Quizz, QuizzAnswer } from "@prisma/client";

import { AnswerRequest, QuizzRequest } from "../interfaces/content";
import { CustomError } from "../exceptions/CustomError";
import * as contentModel from "../models/contentModel";

export const createAiQuizz = async (request: QuizzRequest) => {
  const requestData: QuizzRequest = {
    ...request
  }

  createQuizz(requestData, { userId: 0 });
}

export const createQuizz = async (request: QuizzRequest, payload: JwtPayload) => {
  const isReqValid = validateRequest(request);

  if (!isReqValid) {
    throw new CustomError("Informações insuficientes para criação de quiz", 400)
  }

  const contentReq: Omit<Content, "id"> = {
    authorId: payload.userId,
    createdAt: new Date(),
    areaId: request.areaId
  }
  const content = await contentModel.createContent(contentReq);

  const quizz: Quizz = {
    contentId: content.id,
    question: request.question,
    options: [
      request.option1,
      request.option2,
      request.option3
    ],
    correctAswer: request.correctAnswer
  };

  await contentModel.createQuizz(quizz);

  return quizz;
}

export const getQuizz = async (quizzId: number, payload: JwtPayload) => {
  const quizz: Quizz | null = await contentModel.getQuizzById(quizzId, payload.userId);

  if (quizz) {
    const quizzResponse: any = {...quizz};
    delete quizzResponse.correctAswer
  }

  return quizz;
}

export const deleteQuizz = async (quizzId: number, payload: JwtPayload) => {
  try {
    const quizz = await contentModel.getQuizzById(quizzId, payload.userId);

    if (!quizz || !quizz.content || quizz.content.authorId !== payload.userId) {
      throw new CustomError("Você não tem autorização para deletar esse quizz", 401);
    }

    await contentModel.deleteQuizzById(quizzId);

    return true;
  } catch (error) {
    throw new CustomError("Erro ao deletar quizz", 500);
  }
}

export const answerQuizz = async (answerReq: AnswerRequest, payload: JwtPayload) => {
  try {
    const isValid = (!!answerReq.quizzId && !!answerReq.quizzOption);
    if (!isValid) {
      throw new CustomError("Dados insuficientes para responder o quizz", 400);
    }

    const quizz = await contentModel.getQuizzById(answerReq.quizzId, payload.userId);

    if (!quizz) {
      throw new CustomError("Quizz não encontrado na base com id: " + answerReq.quizzId, 404);
    }
    if (quizz?.QuizzAnswer.length > 0) {
      throw new CustomError("Não é possível responder mais de uma vez", 400);
    }
    
    const isAnswerCorrect = quizz.correctAswer === answerReq.quizzOption;

    const quizzAnswer: Omit<QuizzAnswer, "id"> = {
      isCorrect: isAnswerCorrect,
      quizzId: answerReq.quizzId,
      userId: payload.userId,
      answer: answerReq.quizzOption
    }

    return contentModel.answerQuizz(quizzAnswer);
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    } else {
      throw new CustomError("Erro ao responder quizz", 500);
    }
  }
}

const validateRequest = (request: QuizzRequest) => {
  const options = [request.option1, request.option2, request.option3];

  return (request.correctAnswer && request.option1 && request.option2 && 
    request.option3 && request.correctAnswer && options.includes(request.correctAnswer));
}