import { jwtDecode } from 'jwt-decode';
import { type IUserData } from '../types/interfaces';

export function decodeToken(token: string): IUserData | null {
  try {
    if (!token) {
      console.error('No token provided');
      return null;
    }
    return jwtDecode<IUserData>(token);
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
}
