import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null,
  }),
  actions: {
    singUp() {
      this.isAuthenticated = true;
    },
    singIn() {
      this.isAuthenticated = false;
    },
  },
});
