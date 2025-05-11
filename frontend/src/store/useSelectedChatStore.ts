import { defineStore } from 'pinia';

export const useSelectedChatStore = defineStore('selectedChat', {
  state: () => ({
    selectedChatId: null as number | null,
  }),

  actions: {
    // Установить выбранный чат
    setSelectedChatId(id: number) {
      this.selectedChatId = id;
    },

    // Сбросить выбор чата
    clearSelectedChat() {
      this.selectedChatId = null;
    },

    // Проверить, выбран ли конкретный чат
    isChatSelected(id: number): boolean {
      return this.selectedChatId === id;
    },
  },
});
