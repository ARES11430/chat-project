import { Server, Socket } from 'socket.io';
import { Client } from './client';
import {
  ChatMessage,
  onlineUsers,
  PublicChatMediator,
} from './publicChatMediator';

export const publicChatHandler = (io: Server, socket: Socket) => {
  const chatMediator = PublicChatMediator.getInstance(io);
  const client = new Client(socket);

  chatMediator.addClient(client);

  socket.on('getPreviousMessages', () => {
    chatMediator.sendPreviousMessages(client);
  });

  socket.on('chatMessage', (msg: ChatMessage) => {
    chatMediator.broadcastMessage(msg, socket);
  });

  socket.on('joinChat', (userName: string) => {
    const user = { id: socket.id, userName };

    const existingUserIndex = onlineUsers.findIndex(
      (u) => u.userName === userName
    );
    if (existingUserIndex === -1) {
      onlineUsers.push(user);
    } else {
      onlineUsers[existingUserIndex].id = socket.id;
    }

    chatMediator.broadcastOnlineUsers();
  });

  socket.on('disconnect', () => {
    chatMediator.removeClient(socket.id);

    const index = onlineUsers.findIndex((user) => user.id === socket.id);
    if (index !== -1) {
      onlineUsers.splice(index, 1);
      chatMediator.broadcastOnlineUsers();
    }
  });
};
