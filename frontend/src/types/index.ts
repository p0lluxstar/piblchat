import type { Ref } from 'vue';

export interface IUserData {
  id: number;
  userName: string;
  email?: string;
  colorAvatar: string;
  chatStatus?: boolean;
}

export interface IDataActiveChat {
  id: number;
  createdAt: string;
  users: {
    id: number;
    userName: string;
    colorAvatar: string;
  }[];
}

export interface IUserDataActiveChats {
  id: number;
  userName: string;
  colorAvatar: string;
  chatId: number;
}

export interface IMessagesChat {
  id: number;
  text: string;
  createdAt: string;
  chatId?: number;
  senderId?: number;
}

// для fetchAuth
export interface IUseFetchAuthReturn {
  isLoading: Ref<boolean>;
  isError: Ref<boolean>;
  errorMessage: Ref<string>;
  submit: (payload: TAuthPayload) => Promise<boolean>;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IRegistrationPayload extends ILoginPayload {
  userName: string;
  roleId: number;
  colorAvatar: string;
}

export type TAuthPayload = ILoginPayload | IRegistrationPayload;
