<script setup lang="ts">
import '@/assets/styles/components/RightPanel.scss';
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import UserNameBadge from '@/components/UserNameBadge.vue';
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
import type { ISearchUser } from '@/types/interfaces';
import { formatDay, formatTime, showDate } from '@/utils/formatDate';

const props = defineProps<{
  userSelectedData: ISearchUser | null;
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
      props.userSelectedData?.id,
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
      props.userSelectedData?.id,
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
  <div v-if="!selectedUser" class="empty-chat">Выберите чат</div>
  <div v-else class="chat-container">
    <UserNameBadge :userName="selectedUser.userName" />
    <div v-if="chatMessages.length">
      <button @click="handleDeleteChat()">Удалить чат</button>
    </div>
    <div v-if="chatMessages.length === 0" class="empty-chat">Нет сообщений</div>
    <div class="message-content" ref="messagesContainer">
      <div v-for="(message, index) in chatMessages" :key="index" class="message">
        <div v-if="showDate(index, chatMessages)" class="date-separator">
          {{ formatDay(message.createdAt) }}
        </div>
        <div>
          <div v-if="message.senderId === authStore.user?.userId" class="sender">
            {{ message.text }}
            {{ formatTime(message.createdAt) }}
          </div>
          <div v-else class="receiver">
            {{ message.text }}
            {{ formatTime(message.createdAt) }}
          </div>
        </div>
      </div>
    </div>
    <div class="message-input">
      <textarea
        v-model="messageText"
        placeholder="Введите сообщение..."
        rows="1"
        @keydown="handleKeyEnter"
      ></textarea>
      <button @click="sendMessage">Отправить</button>
    </div>
  </div>
</template>
