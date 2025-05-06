import type { IMessagesChat } from '@/types';

export const formatTime = (date: string | Date): string => {
  const d = new Date(date);
  return d
    .toLocaleString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    .replace(',', '');
};

export const formatDay = (date: string | Date): string => {
  const d = new Date(date);
  return d
    .toLocaleString(undefined, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    .replace(',', '');
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const showDate = (index: number, messagesChat: IMessagesChat[]): boolean => {
  if (index === 0) return true;

  const current = new Date(messagesChat[index].createdAt);
  const previous = new Date(messagesChat[index - 1].createdAt);

  return !isSameDay(current, previous);
};
