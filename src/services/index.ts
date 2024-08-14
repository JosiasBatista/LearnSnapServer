import { articlesMock, educatorsMock } from "../mock";

export const getEducatorById = (educatorId: number) => {
  const educator = educatorsMock.find(edu => edu.id === educatorId);
  if (!educator) {
    throw new Error(`Educator not found with id ${educatorId}`);
  }

  return educator;
}

export const getArticleById = (articleId: number) => {
  const article = articlesMock.find(art => art.id === articleId);
  if (!article) {
    throw new Error(`Article not found with id ${articleId}`);
  }

  return article;
}