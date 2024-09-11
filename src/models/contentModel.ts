import { Article, Comment, Content, Like, Quizz, QuizzAnswer, Quote } from '@prisma/client';
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

export const createQuizz = async (quizzData: Quizz): Promise<Quizz> => {
  return prisma.quizz.create({
    data: quizzData
  })
}

export const getQuizzById = async (quizzId: number, userId: number) => {
  return prisma.quizz.findFirst({
    where: { contentId: quizzId },
    include: { 
      content: true,
      QuizzAnswer: {
        where: {
          userId: userId
        }
      }
    }
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

export const deleteQuizzById = async (quizzId: number): Promise<Quizz> => {
  return prisma.quizz.delete({
    where: { contentId: quizzId }
  })
}

export const getContentList = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  
  const contents = await prisma.content.findMany({
    skip: skip,
    take: limit,
    include: {
      Article: true,
      Quote: true,
      Quizz: true,
      _count: {
        select: {
          Like: true,
          Comment: true
        }
      }
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

export const giveLikeToContent = async (likeData: Omit<Like, "id">) => {
  await prisma.like.create({
    data: likeData
  });
}

export const getContentLikesAmount = async (contentId: number) => {
  const likesAmount = await prisma.like.count({
    where: { contentId: contentId }
  })

  return likesAmount;
}

export const createComment = async (commentData: Omit<Comment, "id">) => {
  const comment = await prisma.comment.create({
    data: commentData
  });

  return comment;
}

export const answerQuizz = async (answerData: Omit<QuizzAnswer, "id">) => {
  const answer = await prisma.quizzAnswer.create({
    data: answerData
  });

  return answer;
}