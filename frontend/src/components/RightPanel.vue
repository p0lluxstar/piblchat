<script setup lang="ts">
import '@/assets/styles/components/RightPanel.scss';
import Cookies from 'js-cookie';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import UserNameBadge from '@/components/UserNameBadge.vue';
import { socket } from '@/socket';
import { useAuthStore } from '@/store/useAuthStore';
import { useSelectedChatStore } from '@/store/useSelectedChatStore';
import type { IMessage, ISearchUser } from '@/types/interfaces';

const props = defineProps<{
  userSelectedData: ISearchUser | null;
  chatMessages: any[];
}>();

const selectedUser = ref(props.userSelectedData);

const authStore = useAuthStore();
const selectedChatStore = useSelectedChatStore();
const selectedChatId = computed(() => selectedChatStore.selectedChatId);
const messageText = ref('');
const chatMessages = ref([...props.chatMessages]);

// const userChats = ref<string[]>([]);
const emit = defineEmits(['userChats']);

watch(
  [(): any => props.chatMessages, (): any => props.userSelectedData],
  ([newMessages, newUserData]) => {
    chatMessages.value = [...newMessages];
    selectedUser.value = newUserData;
  },
  { deep: true }
);
const sendMessage = (): void => {
  // if (!messageText.value.trim() || !props.userSelectedData) return;

  if (!socket?.connected) {
    console.warn('Соединение не установлено');
    return;
  }

  socket.emit('start-chat', {
    userOneId: authStore.user?.userId,
    userTwoId: props.userSelectedData.id,
  });

  // Отправлять сообщение ТОЛЬКО после подтверждения подключения
  socket.once('join-confirmation', (data) => {
    console.log('Подтверждение подключения к чату:', data);

    if (data.success) {
      console.log(`Подключились к чату с id: ${data.chatId}`);

      // Теперь можно отправлять сообщение
      if (socket) {
        socket.emit('send-message', {
          userOneId: authStore.user?.userId,
          userTwoId: props.userSelectedData.id,
          text: messageText.value,
          chatId: data.chatId,
        });
      }

      messageText.value = '';
      selectedChatStore.selectedChatId = data.chatId; // Сохраняем в Pinia
      fetchUserRooms();
    } else {
      console.error('Ошибка подключения к чату:', data.error);
    }
  });
};

onMounted(() => {
  if (!socket) return;

  // Подписка на новые сообщения
  socket.on('new-message', (data) => {
    chatMessages.value.push(data.text);
  });

  fetchUserRooms();
});

onUnmounted(() => {
  if (!socket) return;
  socket.off('new-message');
  socket.off('join-confirmation');
});

const fetchUserRooms = (): void => {
  if (!socket) return;

  socket.emit('getUserChats', authStore.user?.userId, (response: { chats: any[] }) => {
    if (!response?.chats) {
      console.warn('Нет комнат в ответе');
      return;
    }

    emit('userChats', response.chats);
  });
};

const handleDeleteChat = async (): Promise<Promise<void>> => {
  try {
    const res = await fetch(
      `http://192.168.22.120:3000/chat/delete?chatId=${selectedChatId.value}`,
      {
        method: 'DELETE',
      }
    );

    if (!res.ok) throw new Error(`Ошибка HTTP: ${res.status}`);

    fetchUserRooms();
    selectedUser.value = null;
  } catch (err) {
    console.error('Ошибка при удалении чата:', err);
  }
};
</script>

<template>
  <div v-if="!selectedUser" class="empty-chat">Выберите чат</div>
  <div v-else class="chat-container">
    <UserNameBadge :userName="selectedUser.userName" />
    <div v-if="chatMessages.length">
      <button @click="handleDeleteChat()">Удалить чат</button>
    </div>
    <div v-if="chatMessages.length === 0" class="empty-chat">Нет сообщений</div>
    <div class="messages-list">
      <div v-for="(message, index) in chatMessages" :key="index" class="message">
        <div class="message-content">
          {{ message }}
        </div>
      </div>
    </div>

    <div class="message-input">
      <textarea v-model="messageText" placeholder="Введите сообщение..." rows="1"></textarea>
      <button @click="sendMessage">Отправить</button>
    </div>
  </div>
</template>
