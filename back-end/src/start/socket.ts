import { Server } from 'socket.io';
import { Message } from '../models/message';
import { User } from '../models/user';

const frontURL = process.env.FRONT_URL;

type ChatMessage = {
	userName: string;
	message: string;
};

export const initSocket = (server: any) => {
	const io = new Server(server, {
		cors: {
			origin: frontURL!, // ! Allow requests from your frontend
			credentials: true
		}
	});

	io.on('connection', (socket) => {
		console.log('User connected:', socket.id);

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
					userName: populatedMessage.user.userName,
					message: populatedMessage.message,
					timestamp: populatedMessage.timestamp
				});
			} catch (err) {
				console.error('Error saving message:', err);
			}
		});

		socket.on('disconnect', () => {
			console.log('User disconnected:', socket.id);
		});
	});
};
