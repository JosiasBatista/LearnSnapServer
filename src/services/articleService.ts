import { Article, Content } from "@prisma/client";
import { ArticleRequest } from "../interfaces/article";
import * as userService from "./userService";
import * as contentModel from "../models/contentModel";
import { CustomError } from "../exceptions/CustomError";

export const createArticle = async (request: ArticleRequest) => {
  const isReqValid = validateArticleRequest(request)

  if (!isReqValid) {
    throw new CustomError("Dados incorretos na criação", 400);
  }

  const contentReq: Omit<Content, "id"> = {
    authorId: request.educatorId,
    createdAt: new Date()
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

export const deleteArticle = async (articleId: number) => {
  try {
    await contentModel.deleteArticleById(articleId);

    return true;
  } catch (error) {
    throw new CustomError("Erro ao deletar artigo", 500);
  }
}

const validateArticleRequest = (req: ArticleRequest) => {
  const user = userService.findUserById(req.educatorId);
  
  return (req.article && req.title && user !== null);
}