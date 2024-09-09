import express, { Router } from 'express';
import { createArticle, deleteArticle, getArticle } from '../controllers/articleController';
import { createQuote, getQuote, deleteQuote } from '../controllers/quoteController';
import { isAuthenticated } from './middlewares/auth';
import { getContentList } from '../controllers/contentController';

const contentRouter: Router = express.Router();

contentRouter.post('/article', isAuthenticated, createArticle);
contentRouter.get('/article/:id', isAuthenticated, getArticle);
contentRouter.delete('/article/:id', isAuthenticated, deleteArticle);

contentRouter.post('/quote', isAuthenticated, createQuote);
contentRouter.get('/quote/:id', isAuthenticated, getQuote);
contentRouter.delete('/quote/:id', isAuthenticated, deleteQuote)

contentRouter.get('/contents/:page/:limit', isAuthenticated, getContentList);

export default contentRouter;