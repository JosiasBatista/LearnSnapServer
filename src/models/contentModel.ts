import { Article, Content } from '@prisma/client';
import { prisma } from '.';

export const createContent = async (contentData: Omit<Content, "id">): Promise<Content> => {
  return await prisma.content.create({
    data: contentData,
  });
};

export const createArticle = async (articleData: Article): Promise<Article> => {
  return await prisma.article.create({
    data: articleData
  })
}