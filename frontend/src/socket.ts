import { io, Socket } from 'socket.io-client';
import { useAuthStore } from './store/useAuthStore';
const apiUrl = import.meta.env.VITE_API_URL;

export let socket: Socket | null = null;

export const connectSocket = (): Socket => {
  const authStore = useAuthStore();
  const userId = authStore.user?.id || null;

  if (!socket) {
    socket = io(`${apiUrl}`, {
      withCredentials: true,
      query: {
        userId,
      },
    });

    socket.on('connect', () => {
      if (!socket) return;
      // console.log('Socket подключён:', socket.id);
    });

    socket.on('disconnect', () => {
      // console.log('Socket отключён');
    });
  }
  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.off(); // Удаляет все обработчики
    socket.disconnect();
    socket = null;
  }
};
