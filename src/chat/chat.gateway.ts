import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: true },
})

export class ChatGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(room);
    console.log(`Cliente ${client.id} se unió a la sala: ${room}`);
    client.emit('joinedRoom', room);
  }

  @SubscribeMessage('msgToServer')
  handleMessage(
    @MessageBody() { room, message }: { room: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.to(room).emit('msgToClient', message);
  }
}
