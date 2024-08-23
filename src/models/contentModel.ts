import { Article, Content } from '@prisma/client';
import prisma from '.';

export const createContent = async (contentData: Omit<Content, "id">): Promise<Content> => {
  return prisma.content.create({
    data: contentData,
  });
};

export const createArticle = async (articleData: Article): Promise<Article> => {
  return prisma.article.create({
    data: articleData
  })
}

export const getArticleById = async (articleId: number): Promise<Article | null> => {
  return prisma.article.findFirst({
    where: { contentId: articleId }
  })
}

export const deleteArticleById = async (articleId: number): Promise<Article> => {
  return prisma.article.delete({
    where: { contentId: articleId }
  });
}