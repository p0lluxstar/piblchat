export interface IUserData {
  id: number;
  userName: string;
  email: string;
  colorAvatar: string;
}

export interface IMessage {
  id: number;
  text: string;
  createdAt: string;
}

export interface IUserChat {
  id: number;
  createdAt: string;
  users: {
    id: number;
    userName: string;
    colorAvatar: string;
  }[];
}

export interface IActiveChats {
  id: number;
  userName: string;
  colorAvatar: string;
  chatId: number;
}
