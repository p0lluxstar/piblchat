import { jwtDecode } from 'jwt-decode';

export interface JwtPayload {
  userName: string;
  email: string;
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
}
