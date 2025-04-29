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
    origin: 'http://localhost:5173', // Точный адрес вашего фронтенда
    credentials: true, // Разрешить передачу кук/заголовков авторизации
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatService: ChatService,
    private readonly messsgeService: MessageService
    // private readonly messageService: MessageService
  ) {}

  @WebSocketServer() server: Server;

  // Подключение клиента
  async handleConnection(client: Socket) {
    console.log(`Client connected socket: ${client.id}`);
  }

  // Отключение клиента
  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected socket: ${client.id}`);
  }

  @SubscribeMessage('start-chat')
  async handleStartChat(client: Socket, payload: { userOneId: number; userTwoId: number }) {
    try {
      // Проверяем, есть ли уже чат
      let chat = await this.chatService.findChatBetweenUsers(payload.userOneId, payload.userTwoId);

      // Если нет — создаём
      if (!chat) {
        chat = await this.chatService.createChat(payload.userOneId, payload.userTwoId);
      }

      // // Ещё можно автоматически присоединить сокет в комнату чата
      client.join(String(chat.id));

      // Отправляем подтверждение
      client.emit('join-confirmation', {
        success: true,
        chatId: chat.id,
        message: 'Вы успешно подключены к чату',
      });
    } catch (error) {
      console.error('Ошибка при создании чата:', error);
      client.emit('join-confirmation', {
        success: false,
        error: 'Failed to join chat room',
      });
      throw new WsException('Failed to join chat room');
    }
  }

  @SubscribeMessage('send-message')
  async handleMessage(
    client: Socket,
    payload: { userOneId: number; userTwoId: number; text: string; chatId: number }
  ) {
    console.log('payload handleMessage', payload);
    try {
      this.messsgeService.createMessage(payload.chatId, payload.text);
      const chat = `${payload.chatId}`;
      this.server.to(chat).emit('new-message', {
        text: payload.text,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
      throw new WsException('Failed to send message');
    }
  }

  @SubscribeMessage('getUserChats')
  async handleGetMyRooms(
    client: Socket,
    userId: number // Передаем userId из клиента
  ) {
    // console.log('Получение чатов пользователя с id:', userId);

    // Получаем чаты пользователя из базы данных
    const chats = await this.chatService.findChatByUserId(userId);

    console.log('Чаты пользователя:', chats);

    // console.log('Чаты пользователя:', chats);

    // Извлекаем только id чатов
    const chatIds = chats.map((chat) => chat.id);

    // console.log('Чаты пользователя:', chatIds);

    // Можно также сразу подключить сокет к этим комнатам:
    chatIds.forEach((chatId) => {
      client.join(`chat_${chatId}`);
    });

    // Возвращаем клиенту список комнат
    return { chats: chats };
  }

  @SubscribeMessage('get-messages')
  async handleGetMessages(client: Socket, payload: { chatId: number }) {
    try {
      this.messsgeService.getMessagesByChatId(payload.chatId).then((messages) => {
        console.log('Messages:', messages);
        client.emit('get-messages', [...messages]);
      });
    } catch (error) {}
  }
}
