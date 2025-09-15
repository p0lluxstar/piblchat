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
import { useActiveChatsStore } from '@/store/useActiveChatsStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useSelectedChatStore } from '@/store/useSelectedChatStore';
import type { IMessagesChat, IUserData } from '@/types';
import { useEmojiInsertione } from '@/utils/addEmojiToMessage';
import { formatDay, formatTime, showDate } from '@/utils/formatDate';
import ConfirmModal from './ConfirmModal.vue';
import IconDeleteChat from './icons/IconDeleteChat.vue';
import IconSendMessage from './icons/IconSendMessage.vue';
import ToggleShowLeftPanel from './ToggleShowLeftPanel.vue';

const props = defineProps<{
  userSelectedData: IUserData | null;
  messagesChat: IMessagesChat[] | null;
}>();

const emit = defineEmits(['loadUserChats']);
const authStore = useAuthStore();
const selectedChatStore = useSelectedChatStore();
const selectedUser = ref(props.userSelectedData);
const selectedChatId = computed(() => selectedChatStore.selectedChatId);
const messageText = ref('');
const messagesChat = ref([...(props.messagesChat || [])]);
const messagesContainer = ref<HTMLDivElement | null>(null);
const { addEmojiToMessage } = useEmojiInsertione(messageText);
const showDeleteConfirm = ref(false);
const activeChatsStore = useActiveChatsStore();

watch(
  [
    (): IMessagesChat[] | null => props.messagesChat,
    (): IUserData | null => props.userSelectedData,
  ],
  ([newMessages, newUserData]) => {
    messagesChat.value = [...(newMessages || [])];
    selectedUser.value = newUserData;
  },
  { deep: true }
);

const sendMessage = async (): Promise<void> => {
  if (!messageText.value.trim() || !props.userSelectedData) return;

  if (!socket?.connected) return console.warn('Соединение не установлено');

  if (!authStore.user) return;

  if (!messagesChat.value.length) {
    socketEmitCreateChat(authStore.user.id, props.userSelectedData.id);

    const startChatResponse = await socketOnceStartChatResponse(
      authStore.user?.id,
      props.userSelectedData?.id,
      messageText.value
    );
    setTimeout(() => {
      emit('loadUserChats');
    }, 100);

    if (startChatResponse) {
      selectedChatStore.selectedChatId = startChatResponse.chatId;
    }
  }

  if (messagesChat.value.length) {
    socketEmitSendMessage(
      authStore.user?.id,
      props.userSelectedData?.id,
      authStore.user?.id,
      messageText.value,
      selectedChatId.value!
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
  selectedUser.value = null;
  showDeleteConfirm.value = false;
  socketEmitDeleteChat(selectedChatId.value);
  activeChatsStore.removeChatById(selectedChatId.value);
  selectedChatStore.clearSelectedChat();

  // setTimeout(() => {
  //   emit('loadUserChats');
  // }, 100);
};

watch(messagesChat, scrollToBottom, { deep: true });

onMounted(scrollToBottom);

onMounted(() => {
  if (!socket) return;

  socket.on('new-message', (data) => {
    if (selectedChatStore.selectedChatId === data.chatId) {
      messagesChat.value.push(data);
      return;
    }
  });

  socket.on('delete-chat', (data) => {
    if (data) {
      selectedUser.value = null;
      emit('loadUserChats');
      return;
    }
  });

  socket.on('create-chat', () => {
    emit('loadUserChats');
  });

  // emit('loadUserChats');
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
    <div class="right-panel__burgermenu-icon"><ToggleShowLeftPanel :show="true" /></div>
    <div v-if="!selectedUser" class="right-panel__empty-chat">
      <p class="empty-state__description">
        Начните новый диалог или выберите <br />
        существующий из вашего списка
      </p>
    </div>
    <div v-else class="right-panel__chat-container">
      <div class="right-panel__chart-header">
        <div class="right-panel__header-burgermenu-icon"><ToggleShowLeftPanel :show="true" /></div>
        <UserBadge :userData="selectedUser" />
        <div v-if="messagesChat.length" class="right-panel__delete-chat">
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
      <div v-if="messagesChat.length === 0" class="right-panel__empty-chat">
        Отправьте первое сообщение
      </div>
      <div ref="messagesContainer" class="right-panel__messages">
        <div v-for="(message, index) in messagesChat" :key="index" class="right-panel__message">
          <div v-if="showDate(index, messagesChat)" class="right-panel__date-container">
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
