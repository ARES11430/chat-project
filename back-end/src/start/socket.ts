import { Server } from 'socket.io';
import { Message } from '../models/message';

export const initSocket = (server: any) => {
	const io = new Server(server);

	io.on('connection', (socket) => {
		console.log('User connected:', socket.id);

		// Receive message and save it
		socket.on('chatMessage', async (msg) => {
			const newMessage = new Message(msg);
			await newMessage.save();

			io.emit('chatMessage', newMessage); // Broadcast to all users
		});

		socket.on('disconnect', () => {
			console.log('User disconnected:', socket.id);
		});
	});
};
