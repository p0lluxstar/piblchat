import { User } from '@prisma/client';

export interface IUserResponse extends User {
  token: string;
}

export type ILoginResponse = Pick<User, 'email' | 'password'>;
