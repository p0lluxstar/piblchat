<script setup lang="ts">
import '@/assets/styles/components/RightPanel.scss';
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import TheEmoji from '@/components/TheEmoji.vue';
import UserBadge from '@/components/UserBadge.vue';
import { socket } from '@/socket';
import {
  socketEmitCreateChat,
  socketEmitDeleteChat,
  socketEmitSendMessage,
  socketOnceStartChatResponse,
} from '@/socket/socketMethods';
import { useAuthStore } from '@/store/useAuthStore';
import { useSelectedChatStore } from '@/store/useSelectedChatStore';
import type { IUserData } from '@/types/interfaces';
import { useEmojiInsertione } from '@/utils/addEmojiToMessage';
import { formatDay, formatTime, showDate } from '@/utils/formatDate';
import ConfirmModal from './ConfirmModal.vue';
import IconDeleteChat from './icons/IconDeleteChat.vue';
import IconSendMessage from './icons/IconSendMessage.vue';

const props = defineProps<{
  userSelectedData: IUserData | null;
  chatMessages: any[];
}>();

const emit = defineEmits(['loadUserChats']);
const authStore = useAuthStore();
const selectedChatStore = useSelectedChatStore();
const selectedUser = ref(props.userSelectedData);
const selectedChatId = computed(() => selectedChatStore.selectedChatId);
const messageText = ref('');
const chatMessages = ref([...props.chatMessages]);
const messagesContainer = ref<HTMLDivElement | null>(null);
const { addEmojiToMessage } = useEmojiInsertione(messageText);
const showDeleteConfirm = ref(false);

watch(
  [(): any => props.chatMessages, (): any => props.userSelectedData],
  ([newMessages, newUserData]) => {
    chatMessages.value = [...newMessages];
    selectedUser.value = newUserData;
  },
  { deep: true }
);

const sendMessage = async (): Promise<void> => {
  if (!messageText.value.trim() || !props.userSelectedData) return;

  if (!socket?.connected) return console.warn('Соединение не установлено');

  if (!chatMessages.value.length) {
    socketEmitCreateChat(authStore.user.id, props.userSelectedData.id);

    const startChatResponse = await socketOnceStartChatResponse(
      authStore.user?.id,
      props.userSelectedData?.id,
      messageText.value
    );

    if (startChatResponse) {
      emit('loadUserChats');
      selectedChatStore.selectedChatId = startChatResponse.chatId;
    }
  }

  if (chatMessages.value.length) {
    socketEmitSendMessage(
      authStore.user?.id,
      props.userSelectedData?.id,
      authStore.user?.id,
      messageText.value,
      selectedChatId.value
    );
  }

  messageText.value = '';
  scrollToBottom();
};

const handleKeyEnter = (event: KeyboardEvent): void => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
};

const scrollToBottom = (): void => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTo({
        top: messagesContainer.value.scrollHeight,
        behavior: 'smooth',
      });
    }
  });
};

const handleDeleteChat = (): void => {
  showDeleteConfirm.value = true;
};

const confirmDelete = (): void => {
  if (!selectedChatId.value) return;
  socketEmitDeleteChat(selectedChatId.value);
  showDeleteConfirm.value = false;
};

watch(chatMessages, scrollToBottom, { deep: true });

onMounted(scrollToBottom);

onMounted(() => {
  if (!socket) return;

  socket.on('new-message', (data) => {
    if (selectedChatStore.selectedChatId === data.chatId) {
      chatMessages.value.push(data);
      return;
    }
  });

  socket.on('delete-chat', (data) => {
    if (data) {
      emit('loadUserChats');
      selectedUser.value = null;
      return;
    }
  });

  socket.on('create-chat', () => {
    emit('loadUserChats');
  });

  emit('loadUserChats');
});

onUnmounted(() => {
  if (!socket) return;
  socket.off('create-chat');
  socket.off('new-message');
  socket.off('delete-chat');
});
</script>

<template>
  <div class="right-panel-container">
    <div v-if="!selectedUser" class="right-panel__empty-chat">
      <p class="empty-state__description">
        Начните новый диалог или выберите <br />
        существующий из списка ваших чатов.
      </p>
    </div>
    <div v-else class="right-panel__chat-container">
      <div class="right-panel__chart-header">
        <UserBadge :userData="selectedUser" />
        <div v-if="chatMessages.length" class="right-panel__delete-chat">
          <button @click="handleDeleteChat()" class="right-panel__delete-button">
            <IconDeleteChat />
          </button>
          <ConfirmModal
            :show="showDeleteConfirm"
            title="Удалить чат?"
            message="Вы уверены, что хотите удалить этот чат? Это действие нельзя отменить."
            confirm-text="Удалить"
            @confirm="confirmDelete"
            @cancel="showDeleteConfirm = false"
          />
        </div>
      </div>
      <div v-if="chatMessages.length === 0" class="right-panel__empty-chat">
        Отправьте первое сообщение
      </div>
      <div ref="messagesContainer" class="right-panel__messages">
        <div v-for="(message, index) in chatMessages" :key="index" class="right-panel__message">
          <div v-if="showDate(index, chatMessages)" class="right-panel__date-container">
            <span class="right-panel__date">{{ formatDay(message.createdAt) }}</span>
          </div>
          <div class="right-panel__message-content">
            <div
              v-if="message.senderId === authStore.user?.id"
              class="right-panel__message-text-container right-panel__message-text--sender"
            >
              <span class="right-panel__message-text">{{ message.text }}</span>
              <span class="right-panel__message-time">
                {{ formatTime(message.createdAt) }}
              </span>
            </div>
            <div
              v-else
              class="right-panel__message-text-container right-panel__message-text--receiver"
            >
              <span class="right-panel__message-text">{{ message.text }}</span>
              <span class="right-panel__message-time">
                {{ formatTime(message.createdAt) }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="right-panel__input">
        <TheEmoji @select-emoji="addEmojiToMessage" />
        <textarea
          v-model="messageText"
          placeholder="Введите сообщение..."
          rows="1"
          @keydown="handleKeyEnter"
          class="right-panel__textarea"
        ></textarea>
        <button @click="sendMessage" class="right-panel__send-button"><IconSendMessage /></button>
      </div>
    </div>
  </div>
</template>
