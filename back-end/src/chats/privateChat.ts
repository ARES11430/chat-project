import axios from 'axios';
import { Server, Socket } from 'socket.io';
import { PrivateChat } from '../models/privateChat';
import { User } from '../models/user';

type CreateChatPayload = {
	userId1: string;
	userId2: string;
};

type PrivateChatMessage = {
	roomId: string;
	senderId: string;
	message: string;
};

const BACK_END_ENDPOINT = process.env.BACK_END_URL;

export const privateChatHandler = (io: Server, socket: Socket) => {
	console.log('User connected to private chat:', socket.id);

	// * Handle joining or creating a private chat room
	socket.on('createOrJoinPrivateChat', async ({ userId1, userId2 }: CreateChatPayload) => {
		try {
			const { data } = await axios.post(`${BACK_END_ENDPOINT}chats/create-private-chat`, {
				userId1,
				userId2
			});
			const roomId = data.chatId;

			// * Join the specific chat room
			socket.join(roomId);
			console.log(`User ${socket.id} joined or created private chat room: ${roomId}`);

			// * Notify the user of the successful join
			socket.emit('privateChatJoined', roomId);
		} catch (err) {
			console.error('Error joining or creating private chat:', err);
		}
	});

	socket.on('privateMessage', async (msg: PrivateChatMessage) => {
		try {
			const { roomId, senderId, message } = msg;

			const sender = await User.findById(senderId);
			if (!sender) {
				console.error('Sender not found');
				return;
			}

			// ? Find the private chat room
			let chat = await PrivateChat.findById(roomId);
			if (!chat) {
				console.error('Private chat room not found');
				return;
			}

			const newMessage = {
				id: socket.id,
				user: sender,
				message: message,
				timestamp: new Date()
			};

			chat.messages.push(newMessage);
			await chat.save();

			// ? Broadcast the message only to users in the specific private chat room
			io.to(roomId).emit('privateMessage', {
				id: newMessage.id,
				userName: sender.userName,
				message: newMessage.message,
				timestamp: newMessage.timestamp
			});
		} catch (err) {
			console.error('Error saving private message:', err);
		}
	});

	socket.on('disconnect', () => {
		console.log('User disconnected from private chat:', socket.id);
	});
};
