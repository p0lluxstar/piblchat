export interface ISearchUser {
  id: number;
  userName: string;
}

export interface IMessage {
  userId: number;
  text: string;
  createdAt: string;
}

export interface JwtPayload {
  userId: number;
  userName: string;
  email: string;
}

export interface IUserChat {
  id: number;
  createdAt: string;
  users: {
    id: number;
    userName: string;
  }[];
}
