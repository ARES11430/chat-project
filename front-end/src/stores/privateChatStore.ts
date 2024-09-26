import { create } from 'zustand';

interface PrivateChat {
	chatId: string;
	userId1: string;
	userId2: string;
	setChatDetails: (chatId: string, userId1: string, userId2: string) => void;
	clearChatDetails: () => void;
}

const usePrivateChatStore = create<PrivateChat>((set) => ({
	chatId: '',
	userId1: '',
	userId2: '',
	setChatDetails: (chatId, userId1, userId2) => set({ chatId, userId1, userId2 }),
	clearChatDetails: () => set({ chatId: undefined, userId1: undefined, userId2: undefined })
}));

export default usePrivateChatStore;
