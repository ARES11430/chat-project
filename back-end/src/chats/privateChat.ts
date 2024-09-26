import { Server, Socket } from 'socket.io';
import { PrivateChat } from '../models/privateChat';
import { User } from '../models/user';

type PrivateChatMessage = {
	roomId: string;
	senderId: string;
	message: string;
};

export const privateChatHandler = (io: Server, socket: Socket) => {
	console.log('User connected to private chat:', socket.id);

	// * Handle joining or creating a private chat room
	socket.on('joinPrivateChat', async (chatId) => {
		try {
			// * Join the specific chat room by chatId
			socket.join(chatId);
			console.log(`User ${socket.id} joined private chat room: ${chatId}`);

			// ? Fetch the last 10 messages from this chat room
			const chat = await PrivateChat.findById(chatId)
				.populate('participants', 'userName')
				.populate('messages.user', 'userName')
				.slice('messages', -10)
				.exec();

			const formattedMessages = chat?.messages.map((message) => ({
				userName: message.user?.userName || 'Unknown',
				message: message.message,
				timestamp: message.timestamp
			}));

			// * Send the last 10 messages to the client
			socket.emit('previousMessages', formattedMessages);
			socket.emit('participants', chat?.participants);
		} catch (err) {
			console.error('Error joining private chat:', err);
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
