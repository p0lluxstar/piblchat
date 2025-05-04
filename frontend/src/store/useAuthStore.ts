import Cookies from 'js-cookie';
import { defineStore } from 'pinia';
import type { IUserData } from '@/types/interfaces';
import { decodeToken } from '@/utils/decodeToken';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    token: null as string | null,
    user: null as IUserData | null,
  }),
  actions: {
    checkAuth() {
      const token = Cookies.get('auth_token');
      const decoded = decodeToken(token as string);

      if (decoded) {
        this.user = {
          id: decoded.id,
          userName: decoded.userName,
          email: decoded.email,
          colorAvatar: decoded.colorAvatar,
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
