import { CreatePrivateChat, CreatePrivateChatResponse } from '../models/chats';
import APIClient from './api-client';

export const createPrivateChatService = new APIClient<CreatePrivateChat, CreatePrivateChatResponse>(
	'chats/create-private-chat'
);
