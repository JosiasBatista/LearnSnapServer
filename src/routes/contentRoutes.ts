import express, { Router } from 'express';
import { createArticle, deleteArticle, getArticle } from '../controllers/articleController';

const contentRouter: Router = express.Router();

contentRouter.post('/article', createArticle);
contentRouter.get('/article/:id', getArticle);
contentRouter.delete('/article/:id', deleteArticle);

export default contentRouter;