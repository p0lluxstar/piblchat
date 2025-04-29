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

    getters: {
      // Получить выбранный ID (может быть null)
      getSelectedChatId: (state) => state.selectedChatId,

      // Проверить, есть ли выбранный чат
      hasSelectedChat: (state) => state.selectedChatId !== null,
    },
  },
});
