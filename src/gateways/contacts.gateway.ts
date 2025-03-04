import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: "http://localhost:4200", 
    credentials: true,
  }
})
export class ContactsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('lockContact')
  handleLockContact(@MessageBody() data: { id: number, lockedBy: string }) {
    this.server.emit('contactLocked', data);
  }

  @SubscribeMessage('unlockContact')
  handleUnlockContact(@MessageBody() data: { id: number }) {
    this.server.emit('contactUnlocked', data);
  }
}
