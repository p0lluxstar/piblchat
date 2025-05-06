import Cookies from 'js-cookie';
import { ref } from 'vue';
import router from '@/router';
import { connectSocket } from '@/socket';
import { useAuthStore } from '@/store/useAuthStore';
import type { IUseFetchAuthReturn, TAuthPayload } from '@/types';

export function fetchAuth(url: string): IUseFetchAuthReturn {
  const isLoading = ref(false);
  const isError = ref(false);
  const errorMessage = ref('');
  const authStore = useAuthStore();

  const submit = async (payload: TAuthPayload): Promise<boolean> => {
    isLoading.value = true;
    isError.value = false;
    errorMessage.value = '';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        isError.value = true;
        errorMessage.value = data.message || 'Ошибка';
        throw new Error(data.message);
      }

      // сохраняем токен в куках
      if (data.token) {
        Cookies.set('auth_token', data.token, {
          expires: 7,
          secure: import.meta.env.PROD,
          sameSite: 'strict',
          path: '/',
        });
      }

      authStore.singUp();
      router.push('/chat');
      connectSocket();

      return true;
    } catch (err) {
      console.error('Auth error:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    isError,
    errorMessage,
    submit,
  };
}
