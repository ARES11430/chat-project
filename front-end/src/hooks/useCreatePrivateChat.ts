import { useMutation } from '@tanstack/react-query';
import { CreatePrivateChat, CreatePrivateChatResponse } from '../models/chats';
import { createPrivateChatService } from '../services/chatService';
import usePrivateChatStore from '../stores/privateChatStore';
import { showErrorToast } from '../utils/toastUtil';

const useCreatePrivateChat = (navigate: (path: string) => void) => {
	const setChatDetails = usePrivateChatStore((s) => s.setChatDetails);

	return useMutation<CreatePrivateChatResponse, Error, CreatePrivateChat>({
		mutationFn: (data: CreatePrivateChat) => createPrivateChatService.post(data),
		onSuccess: (data) => {
			setChatDetails(data.chatId, data.participants[0], data.participants[1]);
			navigate(`/private-chat/${data.chatId}`);
		},
		onError: (error: any) => {
			if (error.response) {
				const errorMessage = error.response.data.error;
				showErrorToast(errorMessage);
			}
		}
	});
};

export default useCreatePrivateChat;
