import express, { Router } from 'express';
import { isAuthenticated } from './middlewares/auth';
import { getUserAreasOfInterest, getUserById, updateUserAreas } from '../controllers/userController';

const userRouter: Router = express.Router();

userRouter.get('/user/:userId', isAuthenticated, getUserById);
userRouter.get('/userAreasOfInterest/:userId', isAuthenticated, getUserAreasOfInterest);
userRouter.post('/userAreasOfInterest/update/:userId', isAuthenticated, updateUserAreas);

export default userRouter;