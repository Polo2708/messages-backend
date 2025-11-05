import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})

export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('CONECTADO', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('DESCONECTADO', client.id);
  }

  @SubscribeMessage('msgToServer')
  handleMessage(@MessageBody() message: string) {
    console.log('Mensaje recibido', message);
    this.server.emit('msgToClient', message);
  }
}
