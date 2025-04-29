import { io, Socket } from 'socket.io-client';

export let socket: Socket | null = null;

export const connectSocket = (): Socket => {
  if (!socket) {
    socket = io('http://localhost:3000', {
      withCredentials: true,
    });

    socket.on('connect', () => {
      console.log('Socket подключён:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket отключён');
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
