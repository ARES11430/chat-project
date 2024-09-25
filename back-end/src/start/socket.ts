import { Server } from 'socket.io';
import { Message } from '../models/message';
import { User } from '../models/user';

const frontURL = process.env.FRONT_URL;

type ChatMessage = {
	id: string;
	userName: string;
	message: string;
};

type UserType = {
	id: string;
	userName: string;
};

export const initSocket = (server: any) => {
	const io = new Server(server, {
		cors: {
			origin: frontURL!, // ! Allow requests from your frontend
			credentials: true
		}
	});

	const onlineUsers: UserType[] = [];

	io.on('connection', async (socket) => {
		console.log('User connected:', socket.id);

		// ? Send last 10 messages to the client with user info
		try {
			const lastMessages = await Message.find()
				.sort({ timestamp: -1 })
				.limit(10)
				.populate('user', 'userName')
				.lean(); // Convert to plain JavaScript objects

			const formattedMessages = lastMessages.reverse().map((message) => ({
				id: message._id,
				userName: message.user?.userName || 'Unknown', // Fallback if user is null
				message: message.message,
				timestamp: message.timestamp
			}));

			socket.emit('previousMessages', formattedMessages); // Send formatted messages to the client
		} catch (err) {
			console.error('Error fetching last messages:', err);
		}

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

				// * Broadcast the new message to all connected clients
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

		// ? Handle user joining
		socket.on('joinChat', (userName: string) => {
			const user = { id: socket.id, userName };
			onlineUsers.push(user);

			// * Emit updated online users list to all clients
			io.emit('onlineUsers', onlineUsers);
		});

		socket.on('disconnect', () => {
			console.log('User disconnected:', socket.id);

			// ? Remove user from the online users list
			const index = onlineUsers.findIndex((user) => user.id === socket.id);
			if (index !== -1) {
				onlineUsers.splice(index, 1);
				// * Emit updated online users list to all clients
				io.emit('onlineUsers', onlineUsers);
			}
		});
	});
};
