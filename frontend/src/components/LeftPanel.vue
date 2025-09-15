<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { socket } from '@/socket';
import { socketEmitGetUserChats, socketEmitJoinChat } from '@/socket/socketMethods';
import { socketEmitGetMessagesChat } from '@/socket/socketMethods';
import { useActiveChatsStore } from '@/store/useActiveChatsStore';
import { useActiveLeftPanelStore } from '@/store/useActiveLeftPanelStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useSelectedChatStore } from '@/store/useSelectedChatStore';
import type { IDataActiveChat, IUserData, IUserDataActiveChats } from '@/types';
import { fetchSearchUsers } from '@/utils/fetchSearchUsers';
import IconChatStatus from './icons/IconChatStatus.vue';
import ToggleShowLeftPanel from './ToggleShowLeftPanel.vue';
import UserBadge from './UserBadge.vue';

const emit = defineEmits(['userSelectedData', 'messagesChat']);
const authStore = useAuthStore();
const selectedChatStore = useSelectedChatStore();
const searchUserNameQuery = ref('');
const searchUsers = ref<IUserData[]>([]);
const selectedUser = ref<IUserData | null>(null);
const isSearchActive = ref(false);
const dataActiveChats = ref<IDataActiveChat[]>([]);
const activeChatsStore = useActiveChatsStore();
const savedActiveChats = computed(() => activeChatsStore.activeChats);
const activeLeftPanelStore = useActiveLeftPanelStore();

let debounceTimeout: ReturnType<typeof setTimeout>;

watch(searchUserNameQuery, (newQuery) => {
  isSearchActive.value = newQuery.length > 0;
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(async () => {
    const getFetchUsers = await fetchSearchUsers(newQuery);
    const otherUsers = getFetchUsers.filter((user) => user.id !== authStore.user?.id);

    const usersWithChatStatus = otherUsers.map((item) => ({
      ...item,
      chatStatus: savedActiveChats.value.some((el) => el.id === item.id),
    }));

    searchUsers.value = usersWithChatStatus;
  }, 300);
});

const handleUserSelect = (user: IUserData & { chatId?: number }): void => {
  const foundChat = savedActiveChats.value.find((item) => item.id === user.id);
  activeLeftPanelStore.falseActiveLeftPanel();

  if (foundChat?.chatId) {
    selectedChatStore.selectedChatId = foundChat.chatId;

    if (socket) {
      socketEmitJoinChat(foundChat.chatId);

      socketEmitGetMessagesChat(foundChat.chatId).then((messagesChat) => {
        emit('messagesChat', messagesChat);
      });
    }
  } else {
    emit('messagesChat', []);
  }

  emit('userSelectedData', user);

  selectedUser.value = user;
  searchUserNameQuery.value = '';
  searchUsers.value = [];
};

const getUsersChat = (userChat: IDataActiveChat[]): IUserDataActiveChats[] => {
  const myUserId = authStore.user?.id;

  // массив данных пользователей с кем есть чат
  const listUsersActiveChat = userChat.flatMap((chat) =>
    chat.users
      .filter((user) => user.id !== myUserId)
      .map((user) => ({
        ...user,
        chatId: chat.id,
      }))
  );

  activeChatsStore.setChats(listUsersActiveChat);

  return listUsersActiveChat;
};

const loadUserChats = async (): Promise<void> => {
  try {
    if (!authStore.user) return;

    const response = await socketEmitGetUserChats(authStore.user?.id);

    if (response) {
      dataActiveChats.value = response;
    }
  } catch (error) {
    console.error('Failed to load chats:', error);
    dataActiveChats.value = [];
  }
};

defineExpose({ loadUserChats });

onMounted(() => {
  loadUserChats();
});

onUnmounted(() => {
  activeChatsStore.clearChats();
});
</script>

<template>
  <div class="left-panel-container">
    <div class="left-panel__search">
      <div class="left-panel__close-icon"><ToggleShowLeftPanel :show="false" /></div>
      <input
        type="text"
        v-model="searchUserNameQuery"
        placeholder="Поиск по имени"
        class="left-panel__search-input"
      />
    </div>
    <div v-if="isSearchActive" class="left-panel__search-results">
      <ul v-if="searchUsers.length" class="left-panel__search-list">
        <li v-for="user in searchUsers" :key="user.id" class="left-panel__search-item">
          <button @click="handleUserSelect(user)" class="left-panel__user-button">
            <UserBadge :userData="user" />
            <span v-if="user.chatStatus" class="left-panel__user-chat-staus"
              ><IconChatStatus
            /></span>
          </button>
        </li>
      </ul>
      <div v-else-if="searchUserNameQuery" class="left-panel__no-results">
        Пользователь не найден
      </div>
    </div>
    <div v-if="!searchUserNameQuery" class="left-panel__chats">
      <ul v-if="dataActiveChats.length" class="left-panel__chats-list">
        <li
          v-for="user in getUsersChat(dataActiveChats)"
          :key="user.id"
          class="left-panel__chats-item"
        >
          <button
            @click="handleUserSelect(user)"
            :class="[
              'left-panel__user-button',
              { 'left-panel__user-button--active': selectedUser?.id === user.id },
            ]"
          >
            <UserBadge :userData="user" />
          </button>
        </li>
      </ul>
      <div v-else class="left-panel__no-chats">У вас пока нет диалогов</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/components/LeftPanel.scss';
</style>
