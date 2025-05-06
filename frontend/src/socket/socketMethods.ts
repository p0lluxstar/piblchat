import { socket } from '@/socket';
import { useAuthStore } from '@/store/useAuthStore';
import type { IDataActiveChat, IMessagesChat } from '@/types';

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
): Promise<{ chatId: number; sucsess: boolean } | null> => {
  return new Promise((resolve) => {
    if (!socket) return resolve(null);

    const authStore = useAuthStore();

    socket.once('create-chat-response', (data) => {
      if (data.success) {
        socketEmitJoinChat(data.chatId);
        if (authStore.user?.id !== undefined) {
          socketEmitSendMessage(userOneId, userTwoId, authStore.user.id, text, data.chatId);
        }
      }
      resolve(data);
    });
  });
};

export const socketEmitGetUserChats = (userId: number): Promise<IDataActiveChat[] | null> => {
  return new Promise((resolve) => {
    if (!socket) return resolve(null);

    socket.emit('get-user-chats', userId, (data: IDataActiveChat[]) => {
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

export const socketEmitGetMessagesChat = (userId: number): Promise<IMessagesChat[] | null> => {
  return new Promise((resolve) => {
    if (!socket) return resolve(null);

    socket.emit('get-messages-chat', { chatId: userId }, (messagesChat: IMessagesChat[]) => {
      resolve(messagesChat);
    });
  });
};
