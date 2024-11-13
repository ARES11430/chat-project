import { Server, Socket } from 'socket.io';
import { Client } from './client';
import { Message } from '../models/message';
import { User } from '../models/user';

export type ChatMessage = {
  id: string;
  userName: string;
  message: string;
};

export type UserType = {
  id: string;
  userName: string;
};

export const onlineUsers: UserType[] = [];

// Mediator pattern: handling of chat logic with classes
export class PublicChatMediator {
  private static instance: PublicChatMediator;
  private clients: Client[] = [];

  private constructor(private io: Server) {}

  static getInstance(io: Server): PublicChatMediator {
    if (!PublicChatMediator.instance) {
      PublicChatMediator.instance = new PublicChatMediator(io);
    }
    return PublicChatMediator.instance;
  }

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
