import { Server, Socket } from 'socket.io';
import { Message } from '../models/message';
import { User } from '../models/user';

type ChatMessage = {
	id: string;
	userName: string;
	message: string;
};

type UserType = {
	id: string;
	userName: string;
};

const onlineUsers: UserType[] = [];

export const publicChatHandler = (io: Server, socket: Socket) => {
	console.log('User connected to public chat:', socket.id);

	// ? Send last 10 messages to the client with user info
	socket.on('getPreviousMessages', async () => {
		try {
			const lastMessages = await Message.find()
				.sort({ timestamp: -1 })
				.limit(10)
				.populate('user', 'userName')
				.lean(); // !Convert to plain JavaScript objects

			const formattedMessages = lastMessages.reverse().map((message) => ({
				id: message._id,
				userName: message.user?.userName || 'Unknown',
				message: message.message,
				timestamp: message.timestamp
			}));

			// * Send formatted messages to the client
			socket.emit('previousMessages', formattedMessages);
		} catch (err) {
			console.error('Error fetching last messages:', err);
		}
	});

	// * Handle receiving and saving a chat message
	socket.on('chatMessage', async (msg: ChatMessage) => {
		try {
			// ? Find the user by userName
			const user = await User.findOne({ userName: msg.userName });

			if (!user) {
				console.error('User not found');
				return;
			}

			// ? Create a new message with the user's ObjectId
			const newMessage = new Message({
				id: socket.id,
				user: user._id,
				message: msg.message,
				timestamp: new Date()
			});

			// ? Save the message to the database
			await newMessage.save();

			// ? Populate the message with the user data before broadcasting it
			const populatedMessage = await newMessage.populate('user', 'userName name lastName');

			// ? Broadcast the new message to all connected clients
			io.emit('chatMessage', {
				id: populatedMessage.id,
				userName: populatedMessage.user.userName,
				message: populatedMessage.message,
				timestamp: populatedMessage.timestamp
			});
		} catch (err) {
			console.error('Error saving message:', err);
		}
	});

	// * Handle user joining public chat
	socket.on('joinChat', (userName: string) => {
		const user = { id: socket.id, userName };

		// ? Check if the user is already in the online users list
		const existingUserIndex = onlineUsers.findIndex((u) => u.userName === userName);

		if (existingUserIndex === -1) {
			onlineUsers.push(user);
		} else {
			// ? If user exists, update their socket ID
			onlineUsers[existingUserIndex].id = socket.id;
		}

		// * Emit updated online users list to all clients
		io.emit('onlineUsers', onlineUsers);
	});

	socket.on('disconnect', () => {
		console.log('User disconnected from public chat:', socket.id);

		// ? Remove user from the online users list
		const index = onlineUsers.findIndex((user) => user.id === socket.id);
		if (index !== -1) {
			onlineUsers.splice(index, 1);
			// ? Emit updated online users list to all clients
			io.emit('onlineUsers', onlineUsers);
		}
	});
};
