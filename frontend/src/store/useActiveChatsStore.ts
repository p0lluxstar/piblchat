import { defineStore } from 'pinia';
import type { IActiveChats } from '@/types/interfaces';

export const useActiveChatsStore = defineStore('chat', {
  state: () => ({
    activeChats: [] as IActiveChats[],
  }),
  actions: {
    setChats(activeChats: IActiveChats[]) {
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
