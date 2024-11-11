import { Server } from 'socket.io';
import { ChatMediator } from '../chats/chatMediator';
import { publicChatHandler } from './../chats/publicChat';
import { privateChatHandler } from '../chats/privateChat';

export const initSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      credentials: true,
    },
  });

  const chatMediator = ChatMediator.init(io);

  io.on('connection', (socket) => {
    chatMediator.registerHandlers(socket, [
      publicChatHandler,
      privateChatHandler,
    ]);
  });
};
