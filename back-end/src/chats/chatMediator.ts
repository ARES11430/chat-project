import { Server, Socket } from 'socket.io';

type ChatHandler = (io: Server, socket: Socket) => void;

// * singleton chat mediator
export class ChatMediator {
  private static instance: ChatMediator;
  private io: Server;

  private constructor(io: Server) {
    this.io = io;
  }

  static init(io: Server) {
    if (!ChatMediator.instance) {
      ChatMediator.instance = new ChatMediator(io);
    }
    return ChatMediator.instance;
  }

  registerHandlers(socket: Socket, handlers: ChatHandler[]) {
    handlers.forEach((handler) => handler(this.io, socket));
  }
}
