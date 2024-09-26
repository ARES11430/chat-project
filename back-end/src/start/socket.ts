import { Server } from 'socket.io';
import { publicChatHandler } from './../chats/publicChat';
import { privateChatHandler } from './../chats/privateChat';

const frontURL = process.env.FRONT_URL;

export const initSocket = (server: any) => {
	const io = new Server(server, {
		cors: {
			origin: frontURL!,
			credentials: true
		}
	});

	io.on('connection', (socket) => {
		console.log('User connected:', socket.id);

		// * Public chat handlers
		publicChatHandler(io, socket);

		// * Private chat handlers
		privateChatHandler(io, socket);

		socket.on('disconnect', () => {
			console.log('User disconnected:', socket.id);
		});
	});
};
