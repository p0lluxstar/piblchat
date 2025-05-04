<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { socket } from '@/socket';
import { socketEmitGetUserChats, socketEmitJoinChat } from '@/socket/socketMethods';
import { socketEmitGetMessagesChat } from '@/socket/socketMethods';
import { useAuthStore } from '@/store/useAuthStore';
import { useSelectedChatStore } from '@/store/useSelectedChatStore';
import type { IUserChat, IUserData } from '@/types/interfaces';
import { searchUsersUtil } from '@/utils/searchUsersUtil';
import UserBadge from './UserBadge.vue';

const authStore = useAuthStore();
const selectedChatStore = useSelectedChatStore();
const searchUserNameQuery = ref('');
const searchUsers = ref<IUserData[]>([]);
const selectedUser = ref<IUserData | null>(null);
const isSearchActive = ref(false);
const userChats = ref<IUserChat[]>([]);
const emit = defineEmits(['userSelectedData', 'chatMessages']);
let debounceTimeout: ReturnType<typeof setTimeout>;

watch(searchUserNameQuery, (newQuery) => {
  isSearchActive.value = newQuery.length > 0;
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(async () => {
    const users = await searchUsersUtil(newQuery);
    searchUsers.value = users;
  }, 300);
});

const handleUserSelectSearch = (user: IUserData): void => {
  emit('userSelectedData', user);
  selectedUser.value = user;
  searchUserNameQuery.value = '';
  searchUsers.value = [];
  emit('chatMessages', []);
};

const handleUserSelectChat = (user: IUserData & { chatId: number }): void => {
  emit('userSelectedData', user);
  selectedUser.value = user;
  searchUserNameQuery.value = '';
  searchUsers.value = [];

  if (user.chatId) {
    selectedChatStore.selectedChatId = user.chatId;
  }

  if (socket) {
    socketEmitJoinChat(user.chatId);

    socketEmitGetMessagesChat(user.chatId).then((chatMessages) => {
      emit('chatMessages', chatMessages);
    });
  }
};

const getUsersChat = (chatData: IUserChat[]): any => {
  const myUserId = authStore.user?.id;

  return chatData.flatMap((chat) =>
    chat.users
      .filter((user) => user.id !== myUserId)
      .map((user) => ({
        ...user,
        chatId: chat.id,
      }))
  );
};

// const handleInputFocus = (): void => {
//   isSearchActive.value = true;
// };

// const handleInputBlur = (): void => {
//   // Не деактивируем сразу, чтобы можно было кликнуть по результатам поиска
//   setTimeout(() => {
//     if (searchUserNameQuery.value.length === 0) {
//       isSearchActive.value = false;
//     }
//   }, 200);
// };

const loadUserChats = async (): Promise<void> => {
  try {
    const response = await socketEmitGetUserChats(authStore.user?.id);
    if (response?.chats) {
      userChats.value = response.chats;
    }
  } catch (error) {
    console.error('Failed to load chats:', error);
    userChats.value = [];
  }
};

defineExpose({ loadUserChats });

onMounted(() => {
  loadUserChats();
});
</script>

<template>
  <div class="left-panel-container">
    <div class="left-panel__search">
      <input
        type="text"
        v-model="searchUserNameQuery"
        placeholder="Поиск..."
        class="left-panel__search-input"
      />
    </div>
    <div v-if="isSearchActive" class="left-panel__search-results">
      <ul v-if="searchUsers.length" class="left-panel__search-list">
        <li v-for="user in searchUsers" :key="user.id" class="left-panel__search-item">
          <button @click="handleUserSelectSearch(user)" class="left-panel__user-button">
            <UserBadge :userData="user" />
          </button>
        </li>
      </ul>
      <div v-else-if="searchUserNameQuery" class="left-panel__no-results">
        Пользователь не найден
      </div>
    </div>
    <div v-if="!searchUserNameQuery" class="left-panel__chats">
      <ul v-if="userChats.length" class="left-panel__chats-list">
        <li v-for="user in getUsersChat(userChats)" :key="user.id" class="left-panel__chats-item">
          <button
            @click="handleUserSelectChat(user)"
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
