import { Server, Socket } from 'socket.io';
import { Client } from './client';
import { PrivateChatMediator, PrivateChatMessage } from './privateChatMediator';

export const privateChatHandler = (io: Server, socket: Socket) => {
  const chatMediator = PrivateChatMediator.getInstance(io);
  const client = new Client(socket);

  socket.on('joinPrivateChat', (roomId: string) => {
    socket.join(roomId);
    chatMediator.addClient(roomId, client);
    chatMediator.sendPreviousMessages(client, roomId);
  });

  socket.on('privateMessage', (msg: PrivateChatMessage) => {
    chatMediator.broadcastMessage(msg, socket);
  });

  socket.on('disconnect', () => {
    chatMediator.removeClient(socket.id);
  });
};
