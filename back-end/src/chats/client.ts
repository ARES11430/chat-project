import { Socket } from 'socket.io';

// * Observer pattern: Clients are observers listening for updates
class Client {
  constructor(public socket: Socket) {}

  sendMessage(event: string, data: any) {
    this.socket.emit(event, data);
  }
}

export { Client };
