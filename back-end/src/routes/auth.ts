import express from 'express';
import { login, logout, refreshAccessToken } from '../controllers/auth/authController';
import { authorized } from '../middlewares/authorize';

const router = express.Router();

router.post('/login', login);

router.post('/refresh-access-token', refreshAccessToken);

router.post('/logout', authorized, logout);

export default router;
