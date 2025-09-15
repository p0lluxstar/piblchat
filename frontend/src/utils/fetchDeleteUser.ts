import Cookies from 'js-cookie';
import type { IUserData } from '@/types';
const apiUrl = import.meta.env.VITE_API_URL;

export async function fetchDeleteUser(query: string): Promise<IUserData[] | []> {
  if (query.trim().length === 0) return [];

  const token = Cookies.get('auth_token');
  if (!token) return [];

  try {
    const res = await fetch(`${apiUrl}/users/delete?userName=${query}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) throw new Error(`Ошибка HTTP: ${res.status}`);

    const searchUsers = await res.json();

    return searchUsers;
  } catch (err) {
    console.error('Ошибка при удалении пользователя:', err);
    return [];
  }
}
