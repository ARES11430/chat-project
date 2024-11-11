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

// Observer pattern: Clients are observers listening for updates
class Client {
  constructor(public socket: Socket) {}

  sendMessage(event: string, data: any) {
    this.socket.emit(event, data);
  }
}

// Mediator pattern: handling of chat logic with classes
class PublicChatMediator {
  private clients: Client[] = [];

  constructor(private io: Server) {}

  addClient(client: Client) {
    this.clients.push(client);
    console.log('User connected:', client.socket.id);
  }

  removeClient(socketId: string) {
    this.clients = this.clients.filter(
      (client) => client.socket.id !== socketId
    );
    console.log('User disconnected:', socketId);
  }

  async sendPreviousMessages(client: Client) {
    try {
      const lastMessages = await Message.find()
        .sort({ timestamp: -1 })
        .limit(10)
        .populate('user', 'userName')
        .lean();

      const formattedMessages = lastMessages.reverse().map((message) => ({
        id: message._id,
        userName: message.user?.userName || 'Unknown',
        message: message.message,
        timestamp: message.timestamp,
      }));

      client.sendMessage('previousMessages', formattedMessages);
    } catch (err) {
      console.error('Error fetching last messages:', err);
    }
  }

  async broadcastMessage(message: ChatMessage, socket: Socket) {
    try {
      const user = await User.findOne({ userName: message.userName });

      if (!user) {
        console.error('User not found');
        return;
      }

      const newMessage = new Message({
        id: socket.id,
        user: user._id,
        message: message.message,
        timestamp: new Date(),
      });

      await newMessage.save();
      const populatedMessage = await newMessage.populate('user', 'userName');

      this.io.emit('chatMessage', {
        id: populatedMessage.id,
        userName: populatedMessage.user.userName,
        message: populatedMessage.message,
        timestamp: populatedMessage.timestamp,
      });
    } catch (err) {
      console.error('Error broadcasting message:', err);
    }
  }

  broadcastOnlineUsers() {
    this.io.emit('onlineUsers', onlineUsers);
  }
}

export const publicChatHandler = (io: Server, socket: Socket) => {
  const chatMediator = new PublicChatMediator(io);
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
