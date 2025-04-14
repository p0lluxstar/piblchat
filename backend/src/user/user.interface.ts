import { User } from '@prisma/client';

export interface IUserResponse extends User {
  token: string;
}
