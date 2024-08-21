import express, { Router } from 'express';
import { createArticle } from '../controllers/articleController';

const contentRouter: Router = express.Router();

contentRouter.post('/article', createArticle);

export default contentRouter;