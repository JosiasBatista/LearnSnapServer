import { Article, Content } from "@prisma/client";
import { ArticleAiRequest, ArticleRequest } from "../interfaces/content";
import * as userService from "./userService";
import * as contentModel from "../models/contentModel";
import { CustomError } from "../exceptions/CustomError";
import { JwtPayload } from "jsonwebtoken";

export const createAiArticle = async ({ title, description, link, areaId }: ArticleAiRequest) => {
  const request: ArticleRequest = {
    article: description + `\n\nCreated by AI based on: ${link}`,
    title: title,
    educatorId: 0,
    areaId
  }
  
  console.log("Article generated: ", JSON.stringify(request))

  try {
    await createArticle(request, { userId: 0 });
  } catch {
    console.log("Error creating article with AI")
  }
}

export const createArticle = async (request: ArticleRequest, payload: JwtPayload) => {
  const isReqValid = await validateArticleRequest(request, payload.userId);

  if (!isReqValid) {
    throw new CustomError("Dados incorretos na criação", 400);
  }

  const contentReq: Omit<Content, "id"> = {
    authorId: payload.userId,
    createdAt: new Date(),
    areaId: request.areaId
  }
  const content = await contentModel.createContent(contentReq);

  const article: Article = {
    contentId: content.id,
    article: request.article,
    title: request.title
  }
  await contentModel.createArticle(article);

  return article;
}

export const getArticle = async (articleId: number) => {
  const article: Article | null = await contentModel.getArticleById(articleId);

  return article;
}

export const deleteArticle = async (articleId: number, payload: JwtPayload) => {
  try {
    const article = await contentModel.getArticleById(articleId);
    
    if (
      !article || !article.content || 
      article.content.authorId !== payload.userId
    ) {
      throw new CustomError("Você não tem autorização para deletar esse artigo", 401);
    }

    await contentModel.deleteArticleById(articleId);

    return true;
  } catch (error) {
    throw new CustomError("Erro ao deletar artigo", 500);
  }
}

const validateArticleRequest = async (req: ArticleRequest, userId: number): Promise<boolean> => {
  const user = await userService.findUserById(userId);
  
  return !!(req.article && req.title && user !== null);
}