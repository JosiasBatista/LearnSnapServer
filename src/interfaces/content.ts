import { Educator } from "./user";

export interface Article {
  id: number,
  title: string,
  article: string,
  author: Educator
} 

export interface ArticleRequest {
  title: string,
  article: string,
  educatorId: number,
  areaId: number
}

export interface QuoteRequest {
  description: string,
  quoteAuthor: string,
  userId: number,
  areaId: number
}

export interface QuizzRequest {
  question: string,
  option1: string,
  option2: string,
  option3: string,
  correctAnswer: string,
  areaId: number
}

export interface CommentRequest {
  contentId: number,
  value: string
}

export interface AnswerRequest {
  quizzOption: string,
  quizzId: number
}