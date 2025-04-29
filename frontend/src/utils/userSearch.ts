import Cookies from 'js-cookie';
import type { ISearchUser } from '@/types/interfaces';

export async function searchUsers(query: string): Promise<ISearchUser | null> {
  if (query.trim().length === 0) return null;

  const token = Cookies.get('auth_token');
  if (!token) {
    console.warn('Нет токена — пользователь не авторизован');
    return null;
  }

  try {
    const res = await fetch(`http://192.168.22.120:3000/users/search?userName=${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error(`Ошибка HTTP: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Ошибка при поиске пользователей:', err);
    return null;
  }
}
