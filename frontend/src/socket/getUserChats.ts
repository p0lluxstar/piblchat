import { socket } from '@/socket';
import { useAuthStore } from '@/store/useAuthStore';
import type { IUserChat } from '@/types/interfaces';

export const getUserChats = async (): Promise<IUserChat[]> => {
  const authStore = useAuthStore();

  const chats = await new Promise<IUserChat[]>((resolve, reject) => {
    if (!socket) throw new Error('Socket не подключен');
    socket.emit('getUserChats', authStore.user!.userId, (response: { chats?: IUserChat[] }) => {
      if (!response?.chats) {
        reject(new Error('Нет чатов в ответе'));
      } else {
        resolve(response.chats);
      }
    });
  });

  console.log('Получены чаты:', chats);
  return chats;
};
