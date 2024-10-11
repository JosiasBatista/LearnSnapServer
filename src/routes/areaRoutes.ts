import express, { Router } from 'express';
import { isAuthenticated } from './middlewares/auth';
import { getAreas } from '../controllers/areaController';

const areaRouter: Router = express.Router();

areaRouter.get('/areas', isAuthenticated, getAreas);

export default areaRouter;