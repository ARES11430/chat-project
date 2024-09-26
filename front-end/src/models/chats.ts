export interface CreatePrivateChat {
	userId1: string;
	userId2: string;
}

export interface CreatePrivateChatResponse {
	chatId: string;
	participants: string[];
}
