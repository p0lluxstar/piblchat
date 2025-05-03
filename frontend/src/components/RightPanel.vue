<script setup lang="ts">
import '@/assets/styles/components/RightPanel.scss';
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import UserBadge from '@/components/UserBadge.vue';
import { socket } from '@/socket';
import {
  socketEmitCreateChat,
  socketEmitDeleteChat,
  socketEmitGetUserChats,
  socketEmitSendMessage,
  socketOnceStartChatResponse,
} from '@/socket/socketMethods';
import { useAuthStore } from '@/store/useAuthStore';
import { useSelectedChatStore } from '@/store/useSelectedChatStore';
import type { IUserData } from '@/types/interfaces';
import { formatDay, formatTime, showDate } from '@/utils/formatDate';

const props = defineProps<{
  userSelectedData: IUserData | null;
  chatMessages: any[];
}>();

const authStore = useAuthStore();
const selectedChatStore = useSelectedChatStore();
const selectedUser = ref(props.userSelectedData);
const selectedChatId = computed(() => selectedChatStore.selectedChatId);
const messageText = ref('');
const chatMessages = ref([...props.chatMessages]);
const messagesContainer = ref<HTMLDivElement | null>(null);
const emit = defineEmits(['userChats']);

watch(
  [(): any => props.chatMessages, (): any => props.userSelectedData],
  ([newMessages, newUserData]) => {
    chatMessages.value = [...newMessages];
    selectedUser.value = newUserData;
  },
  { deep: true }
);

const sendMessage = async (): Promise<void> => {
  // if (!messageText.value.trim() || !props.userSelectedData) return;
  console.log(authStore.user?.userId);
  if (!socket?.connected) return console.warn('Соединение не установлено');

  if (!chatMessages.value.length) {
    socketEmitCreateChat(authStore.user.userId, props.userSelectedData.id);

    const startChatResponse = await socketOnceStartChatResponse(
      authStore.user?.userId,
      props.userSelectedData?.userId,
      messageText.value
    );

    if (startChatResponse) {
      getUserChats();
      selectedChatStore.selectedChatId = startChatResponse.chatId;
    }
  }

  if (chatMessages.value.length) {
    socketEmitSendMessage(
      authStore.user?.userId,
      props.userSelectedData?.userId,
      authStore.user?.userId,
      messageText.value,
      selectedChatId.value
    );
  }

  messageText.value = '';
  scrollToBottom();
};

const getUserChats = async (): Promise<void> => {
  const response = await socketEmitGetUserChats(authStore.user.userId);

  if (response?.chats) {
    emit('userChats', response.chats);
  }
};

const handleDeleteChat = (): void => {
  if (!selectedChatId.value) return;

  socketEmitDeleteChat(selectedChatId.value);
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
      getUserChats();
      selectedUser.value = null;
      return;
    }
  });

  socket.on('create-chat', () => {
    getUserChats();
  });

  getUserChats();
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
    <div v-if="!selectedUser" class="right-panel__empty-chat">Выберите чат</div>
    <div v-else class="right-panel__chat-container">
      <UserBadge :userData="selectedUser" />
      <div v-if="chatMessages.length" class="right-panel__delete-chat">
        <button @click="handleDeleteChat()" class="right-panel__delete-button">Удалить чат</button>
      </div>
      <div v-if="chatMessages.length === 0" class="right-panel__empty-chat">Нет сообщений</div>
      <div ref="messagesContainer" class="right-panel__messages">
        <div v-for="(message, index) in chatMessages" :key="index" class="right-panel__message">
          <div v-if="showDate(index, chatMessages)" class="right-panel__date-separator">
            {{ formatDay(message.createdAt) }}
          </div>
          <div class="right-panel__message-content">
            <div
              v-if="message.senderId === authStore.user?.userId"
              class="right-panel__message-text right-panel__message-text--sender"
            >
              {{ message.text }}
              <span class="right-panel__message-time">
                {{ formatTime(message.createdAt) }}
              </span>
            </div>
            <div v-else class="right-panel__message-text right-panel__message-text--receiver">
              {{ message.text }}
              <span class="right-panel__message-time">
                {{ formatTime(message.createdAt) }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="right-panel__input">
        <textarea
          v-model="messageText"
          placeholder="Введите сообщение..."
          rows="1"
          @keydown="handleKeyEnter"
          class="right-panel__textarea"
        ></textarea>
        <button @click="sendMessage" class="right-panel__send-button">Отправить</button>
      </div>
    </div>
  </div>
</template>
