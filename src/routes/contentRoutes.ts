import express, { Router } from 'express';
import { createArticle, deleteArticle, getArticle } from '../controllers/articleController';
import { createQuote, getQuote, deleteQuote } from '../controllers/quoteController';
import { answerQuizz, createQuizz, deleteQuizz, getQuizz } from '../controllers/quizzController';
import { createComment, getCommentsFromContent, getContentList, likeContent, unlikeContent } from '../controllers/contentController';
import { runRobotTask, robotTaskFinished } from '../controllers/scrappingController';
import { isAuthenticated, isAuthenticatedAsEducator } from './middlewares/auth';

const contentRouter: Router = express.Router();

contentRouter.post('/article', isAuthenticatedAsEducator, createArticle);
contentRouter.get('/article/:id', isAuthenticated, getArticle);
contentRouter.delete('/article/:id', isAuthenticatedAsEducator, deleteArticle);

contentRouter.post('/quote', isAuthenticatedAsEducator, createQuote);
contentRouter.get('/quote/:id', isAuthenticated, getQuote);
contentRouter.delete('/quote/:id', isAuthenticatedAsEducator, deleteQuote);

contentRouter.post('/quizz', isAuthenticatedAsEducator, createQuizz);
contentRouter.get('/quizz/:id', isAuthenticated, getQuizz);
contentRouter.delete('/quizz/:id', isAuthenticatedAsEducator, deleteQuizz);
contentRouter.post('/quizz/answer', isAuthenticated, answerQuizz);

contentRouter.get('/contents/:page/:limit', isAuthenticated, getContentList);
contentRouter.post('/contents/:id/like', isAuthenticated, likeContent);
contentRouter.post('/contents/:id/unlike', isAuthenticated, unlikeContent);
contentRouter.post('/contents/comment', isAuthenticated, createComment);
contentRouter.get('/comments/content/:id', isAuthenticated, getCommentsFromContent);

contentRouter.post('/robotTaskFinished', robotTaskFinished);

export default contentRouter;