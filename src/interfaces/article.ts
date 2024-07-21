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
  educatorId: number
}