import { defineStore } from 'pinia';
import type { IUserDataActiveChats } from '@/types';

export const useActiveChatsStore = defineStore('chat', {
  state: () => ({
    activeChats: [] as IUserDataActiveChats[],
  }),
  actions: {
    setChats(activeChats: IUserDataActiveChats[]) {
      this.activeChats = activeChats;
    },
    removeChatById(chatId: number) {
      this.activeChats = this.activeChats.filter((chat) => chat.chatId !== chatId);
    },
    clearChats() {
      this.activeChats = [];
    },
  },
});
