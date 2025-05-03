export interface IUserData {
  userId: number;
  userName: string;
  email: string;
  colorAvatar: string;
}

export interface IMessage {
  userId: number;
  text: string;
  createdAt: string;
}

export interface IUserChat {
  id: number;
  createdAt: string;
  users: {
    id: number;
    userName: string;
  }[];
}
