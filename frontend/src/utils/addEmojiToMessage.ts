import { nextTick, type Ref } from 'vue';

export const useEmojiInsertione = (
  messageText: Ref<string>,
  textareaSelector = 'textarea'
): any => {
  const addEmojiToMessage = (emoji: string): void => {
    const textarea = document.querySelector(textareaSelector) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = messageText.value;

    // Вставка emoji в позицию курсора
    messageText.value = text.slice(0, start) + emoji + text.slice(end);

    nextTick(() => {
      textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
      textarea.focus();
    });
  };

  return { addEmojiToMessage };
};
