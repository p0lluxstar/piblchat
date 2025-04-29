import Cookies from 'js-cookie';
import { defineStore } from 'pinia';
import { decodeToken } from '@/utils/decodeToken';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    token: null as string | null,
    user: null as { userId: number; userName: string; email: string } | null,
  }),
  actions: {
    checkAuth() {
      const token = Cookies.get('auth_token');
      const decoded = decodeToken(token as string);

      if (decoded) {
        this.user = {
          userId: decoded.userId,
          userName: decoded.userName,
          email: decoded.email,
        };
        this.isAuthenticated = true;
      } else {
        this.logout();
      }
    },
    singUp() {
      this.checkAuth();
    },
    singIn() {
      this.checkAuth();
    },
    logout() {
      this.isAuthenticated = false;
      this.token = null;
      this.user = null;
      Cookies.remove('auth_token');
    },
  },
});
