import { Content, Quote, User } from "@prisma/client";

import { QuoteAiRequest, QuoteRequest } from "../interfaces/content";
import * as userService from "./userService";
import * as contentModel from "../models/contentModel";
import { CustomError } from "../exceptions/CustomError";
import { JwtPayload } from "jsonwebtoken";

export const createAiQuote = async (request: QuoteAiRequest) => {
  const requestData: QuoteRequest = {
    ...request,
    userId: 0
  }

  console.log("Quote generated: ", JSON.stringify(requestData))

  try {
    await createQuote(requestData, { userId: 0 });
  } catch {
    console.log("Error creating quote with AI")
  }
}

export const createQuote = async (request: QuoteRequest, payload: JwtPayload) => {
  const isReqValid = await validateQuoteRequest(request, payload.userId);

  if (!isReqValid) {
    throw new CustomError("Dados incorretos na criação", 400);
  }

  const contentReq: Omit<Content, "id"> = {
    authorId: payload.userId,
    createdAt: new Date(),
    areaId: request.areaId
  }
  const content = await contentModel.createContent(contentReq);

  const quote: Quote = {
    contentId: content.id,
    description: request.description,
    quoteAuthor: request.quoteAuthor
  };

  await contentModel.createQuote(quote);

  return quote;
}

export const getQuote = async (quoteId: number) => {
  const quote: Quote | null = await contentModel.getQuoteById(quoteId);

  return quote;
}

export const deleteQuote = async (quoteId: number, payload: JwtPayload) => {
  try {
    const quote = await contentModel.getQuoteById(quoteId);
  
    if (
      !quote || !quote.content || 
      quote.content.authorId !== payload.userId
    ) {
      throw new CustomError("Você não tem autorização para deletar essa citação", 401);
    }

    await contentModel.deleteQuoteById(quoteId);

    return true;
  } catch (error) {
    throw new CustomError("Erro ao deletar citação", 500);
  }
}

const validateQuoteRequest = async (req: QuoteRequest, userId: number): Promise<boolean> => {
  const user: User | null = await userService.findUserById(userId);
  
  return !!(req.description && req.quoteAuthor && user !== null);
}