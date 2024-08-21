import { Article, Content } from "@prisma/client";
import { ArticleRequest } from "../interfaces/article";
import * as userService from "./userService";
import * as contentModel from "../models/contentModel";

export const createArticle = async (request: ArticleRequest) => {
  const isReqValid = validateArticleRequest(request)

  if (!isReqValid) {
    throw new Error(JSON.stringify({ status: 400, message: "Dados incorretos na criação" }))
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

const validateArticleRequest = (req: ArticleRequest) => {
  const user = userService.findUserById(req.educatorId);
  
  return (req.article && req.title && user !== null);
}