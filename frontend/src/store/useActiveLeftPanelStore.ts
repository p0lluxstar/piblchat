import { defineStore } from 'pinia';

export const useActiveLeftPanelStore = defineStore('activeLeftPanel', {
  state: () => ({
    isLeftPanelActive: false,
  }),
  actions: {
    trueActiveLeftPanel() {
      this.isLeftPanelActive = true;
    },
    falseActiveLeftPanel() {
      this.isLeftPanelActive = false;
    },
    setLeftPanel(value: boolean) {
      this.isLeftPanelActive = value;
    },
  },
});
