import { Educator } from "./user";

export interface Article {
    id: number,
    title: string,
    article: string,
    author: Educator
} 