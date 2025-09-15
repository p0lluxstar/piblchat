import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from '../message/message.service';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [], // Точный адрес вашего фронтенда
    credentials: true, // Разрешить передачу кук/заголовков авторизации
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatService: ChatService,
    private readonly messsgeService: MessageService
  ) {}

  private userSockets: Map<number, string> = new Map();

  @WebSocketServer() server: Server;

  // Подключение клиента
  async handleConnection(client: Socket) {
    const rawUserId = client.handshake.query.userId;
    // console.log('Raw userId:', rawUserId);

    const userId = Number(rawUserId);
    if (!userId || isNaN(userId)) {
      // console.warn(`Клиент ${client.id} не передал корректный userId`);
      client.disconnect(true);
      return;
    }

    this.userSockets.set(userId, client.id);
    // console.log(`User id: ${userId} connected with socket ${client.id}`);
  }

  // Отключение клиента
  async handleDisconnect(client: Socket) {
    // ищим socketId
    const userId = [...this.userSockets.entries()].find(
      ([, socketId]) => socketId === client.id
    )?.[0];

    if (userId) {
      this.userSockets.delete(userId);
      // console.log(`User ${userId} disconnected`);
    }
  }

  @SubscribeMessage('create-chat')
  async handleCreateChat(client: Socket, payload: { userOneId: number; userTwoId: number }) {
    try {
      // 1. Проверяем, есть ли уже чат между двумя пользователями
      let chat = await this.chatService.findChatBetweenUsers(payload.userOneId, payload.userTwoId);

      // 2. Если чата нет — создаём новый
      if (!chat) {
        chat = await this.chatService.createChat(payload.userOneId, payload.userTwoId);

        // Массив id участников
        const userIds = [payload.userOneId, payload.userTwoId];

        // 3. Для каждого пользователя ищем его socketId
        userIds.forEach((id) => {
          const socketId = this.userSockets.get(id);

          // 4. Если пользователь подключён — отправляем ему событие "create-chat"
          if (socketId) {
            this.server.to(socketId).emit('create-chat', {
              chatId: chat.id,
              userIds,
            });
          }
        });

        // 5. Отправляем ответ инициатору запроса (клиенту, который вызвал "create-chat")
        client.emit('create-chat-response', {
          success: true,
          chatId: chat.id,
        });
      }
    } catch (error) {
      // 6. Логируем ошибку и отправляем клиенту сообщение об ошибке
      console.error('Ошибка при создании чата:', error);
      client.emit('create-chat-response', {
        success: false,
        error: 'Failed to join chat room',
      });
      throw new WsException('Failed to join chat room');
    }
  }

  @SubscribeMessage('join-chat')
  async handleStartChatTest(client: Socket, payload: { chatId: number }) {
    try {
      client.join(String(payload.chatId));
    } catch (error) {
      console.error('Ошибка при создании чата:', error);

      throw new WsException('Failed to join chat room');
    }
  }

  @SubscribeMessage('send-message')
  async handleMessage(
    client: Socket,
    payload: {
      userOneId: number;
      userTwoId: number;
      senderId: number;
      text: string;
      chatId: number;
    }
  ) {
    try {
      this.messsgeService.createMessage(payload.chatId, payload.senderId, payload.text);
      const chat = `${payload.chatId}`;

      this.server.to(chat).emit('new-message', {
        chatId: payload.chatId,
        senderId: payload.senderId,
        text: payload.text,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
      throw new WsException('Failed to send message');
    }
  }

  @SubscribeMessage('get-user-chats')
  async handleGetMyRooms(client: Socket, userId: number) {
    const chats = await this.chatService.findChatByUserId(userId);

    return chats;
  }

  @SubscribeMessage('get-messages-chat')
  async handleGetMessages(client: Socket, payload: { chatId: number }) {
    try {
      const messegaes = await this.messsgeService.getMessagesByChatId(payload.chatId);
      return messegaes;
    } catch (error) {}
  }

  @SubscribeMessage('delete-chat')
  async handleDeleteChat(client: Socket, payload: { chatId: number }) {
    try {
      // Получаем участников чата
      const participants = await this.chatService.getChatParticipants(payload.chatId);
      const userIds = participants.map((user) => user.id);

      // Удаляем чат и сообщения
      await this.chatService.deleteChatAndMessages(payload.chatId);

      // Оповещаем всех участников
      userIds.forEach((userId) => {
        const socketId = this.userSockets.get(userId);
        if (socketId) {
          this.server.to(socketId).emit('delete-chat', {
            chatId: payload.chatId,
          });
        }
      });
    } catch (error) {
      console.error('Ошибка при удалении чата:', error);
      throw new WsException('Failed to delete chat');
    }
  }
}
