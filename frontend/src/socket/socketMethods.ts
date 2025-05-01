import { socket } from '@/socket';
import { useAuthStore } from '@/store/useAuthStore';
import type { IMessage } from '@/types/interfaces';

export const socketEmitCreateChat = (userOneId: number, userTwoId: number): void => {
  if (!socket) return;

  socket.emit('create-chat', {
    userOneId,
    userTwoId,
  });
};

export const socketEmitJoinChat = (chatId: number): void => {
  if (!socket) return;

  socket.emit('join-chat', {
    chatId,
  });
};

export const socketEmitSendMessage = (
  userOneId: number,
  userTwoId: number,
  senderId: number,
  text: string,
  chatId: number
): void => {
  if (!socket) return;

  socket.emit('send-message', {
    userOneId,
    userTwoId,
    senderId,
    text,
    chatId,
  });
};

export const socketOnceStartChatResponse = (
  userOneId: number,
  userTwoId: number,
  text: string
): Promise<any> => {
  return new Promise((resolve) => {
    if (!socket) return resolve(undefined);

    const authStore = useAuthStore();

    socket.once('create-chat-response', (data) => {
      if (data.success) {
        socketEmitJoinChat(data.chatId);
        socketEmitSendMessage(userOneId, userTwoId, authStore.user?.userId, text, data.chatId);
      }
      resolve(data);
    });
  });
};

export const socketEmitGetUserChats = (userId: number): Promise<any> => {
  return new Promise((resolve) => {
    if (!socket) return resolve(undefined);

    socket.emit('get-user-chats', userId, (data: any) => {
      resolve(data);
    });
  });
};

export const socketEmitDeleteChat = (chatId: number): void => {
  if (!socket) return;
  socket.emit('delete-chat', {
    chatId,
  });
};

export const socketEmitGetMessagesChat = (userId: number): Promise<any> => {
  return new Promise((resolve) => {
    if (!socket) return resolve(undefined);

    socket.emit('get-messages-chat', { chatId: userId }, (chatMessages: IMessage[]) => {
      //   const chatMessages = messages.map((message) => message.text);
      resolve(chatMessages);
    });
  });
};
