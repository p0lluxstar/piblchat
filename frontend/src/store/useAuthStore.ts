import Cookies from 'js-cookie';
import { defineStore } from 'pinia';
import router from '@/router';
import type { IUserData } from '@/types';
import { decodeToken } from '@/utils/decodeToken';
import { connectSocket } from '../socket';
const apiUrl = import.meta.env.VITE_API_URL;

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    token: null as string | null,
    user: null as IUserData | null,
    isLoading: true,
  }),
  actions: {
    async checkAuth() {
      this.isLoading = true;

      const token = Cookies.get('auth_token');
      const decoded = decodeToken(token as string);

      if (token) {
        try {
          const response = await fetch(`${apiUrl}/auth/verify`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Token is invalid or expired');
          }

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

          connectSocket();
          router.push('/chat');
        } catch (error) {
          console.error('❌ Ошибка проверки токена:', error);
          Cookies.remove('auth_token');
          router.push('/');
        }
      }

      this.isLoading = false;
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
