import express from 'express';
import { createPrivateChat } from '../controllers/chats/chatController';

const router = express.Router();

router.post('/create-private-chat', createPrivateChat);

export default router;
