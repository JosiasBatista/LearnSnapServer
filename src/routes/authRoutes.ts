import express, { Router } from 'express';
import { register, login, refreshToken, revokeRefreshTokens } from '../controllers/authController';

const authRouter: Router = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/refreshToken', refreshToken);
authRouter.post('/revokeRefreshTokens', revokeRefreshTokens);

export default authRouter;