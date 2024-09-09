import { Article, Content, Quote } from '@prisma/client';
import prisma from '.';

export const createContent = async (contentData: Omit<Content, "id">): Promise<Content> => {
  return prisma.content.create({
    data: contentData,
  });
};

export const getContent = async (contentId: number): Promise<Content | null> => {
  return prisma.content.findFirst({
    where: { id: contentId }
  })
}

export const createArticle = async (articleData: Article): Promise<Article> => {
  return prisma.article.create({
    data: articleData
  })
}

export const createQuote = async (quoteData: Quote): Promise<Quote> => {
  return prisma.quote.create({
    data: quoteData
  })
}

export const getQuoteById = async (quoteId: number) => {
  return prisma.quote.findFirst({
    where: { contentId: quoteId },
    include: { content: true }
  })
}

export const getArticleById = async (articleId: number) => {
  return prisma.article.findFirst({
    where: { contentId: articleId },
    include: { content: true }
  })
}

export const deleteArticleById = async (articleId: number): Promise<Article> => {
  return prisma.article.delete({
    where: { contentId: articleId }
  });
}

export const deleteQuoteById = async (quoteId: number): Promise<Quote> => {
  return prisma.quote.delete({
    where: { contentId: quoteId }
  });
}

export const getContentList = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  
  const contents = await prisma.content.findMany({
    skip: skip,
    take: limit,
    include: {
      Article: true,
      Quote: true,
      Quizz: true
    }
  });

  const totalContents = await prisma.content.count();
  
  return {
    data: contents,
    total: totalContents,
    currentPage: page,
    totalPages: Math.ceil(totalContents / limit)
  };
}