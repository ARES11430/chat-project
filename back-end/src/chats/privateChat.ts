import { Server, Socket } from 'socket.io';
import { PrivateChat } from '../models/privateChat';
import { User } from '../models/user';

type PrivateChatMessage = {
  roomId: string;
  senderId: string;
  message: string;
};

// Observer pattern: Clients are observers listening for updates
class Client {
  constructor(public socket: Socket) {}

  sendMessage(event: string, data: any) {
    this.socket.emit(event, data);
  }
}

// Mediator pattern: handling private chat logic
class PrivateChatMediator {
  private clients: Map<string, Client[]> = new Map();

  constructor(private io: Server) {}

  addClient(roomId: string, client: Client) {
    if (!this.clients.has(roomId)) {
      this.clients.set(roomId, []);
    }
    this.clients.get(roomId)!.push(client);
    console.log('User connected:', client.socket.id, 'to room:', roomId);
  }

  removeClient(socketId: string) {
    for (const [roomId, clients] of this.clients.entries()) {
      const filteredClients = clients.filter(
        (client) => client.socket.id !== socketId
      );
      if (filteredClients.length !== clients.length) {
        this.clients.set(roomId, filteredClients);
        console.log('User disconnected:', socketId, 'from room:', roomId);
      }
    }
  }

  async sendPreviousMessages(client: Client, roomId: string) {
    try {
      const chat = await PrivateChat.findById(roomId)
        .populate('participants', 'userName')
        .populate('messages.user', 'userName')
        .slice('messages', -10)
        .exec();

      const formattedMessages = chat?.messages.map((message) => ({
        userName: message.user?.userName || 'Unknown',
        message: message.message,
        timestamp: message.timestamp,
      }));

      client.sendMessage('previousMessages', formattedMessages);
      client.sendMessage('participants', chat?.participants);
    } catch (err) {
      console.error('Error fetching previous messages:', err);
    }
  }

  async broadcastMessage(msg: PrivateChatMessage, socket: Socket) {
    try {
      const { roomId, senderId, message } = msg;

      const sender = await User.findById(senderId);
      if (!sender) {
        console.error('Sender not found');
        return;
      }

      let chat = await PrivateChat.findById(roomId);
      if (!chat) {
        console.error('Private chat room not found');
        return;
      }

      const newMessage = {
        id: socket.id,
        user: sender,
        message,
        timestamp: new Date(),
      };

      chat.messages.push(newMessage);
      await chat.save();

      // ! Broadcast the message only to users in the specific private chat room
      this.io.to(roomId).emit('privateMessage', {
        id: newMessage.id,
        userName: sender.userName,
        message: newMessage.message,
        timestamp: newMessage.timestamp,
      });
    } catch (err) {
      console.error('Error broadcasting private message:', err);
    }
  }
}

export const privateChatHandler = (io: Server, socket: Socket) => {
  const chatMediator = new PrivateChatMediator(io);
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
