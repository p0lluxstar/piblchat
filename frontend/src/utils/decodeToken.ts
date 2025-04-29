import { jwtDecode } from 'jwt-decode';
import { type JwtPayload } from '../types/interfaces';

export function decodeToken(token: string): JwtPayload | null {
  try {
    if (!token) {
      console.error('No token provided');
      return null;
    }
    return jwtDecode<JwtPayload>(token);
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
}
