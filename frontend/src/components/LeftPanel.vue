<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { socket } from '@/socket';
import { socketEmitGetUserChats, socketEmitJoinChat } from '@/socket/socketMethods';
import { socketEmitGetMessagesChat } from '@/socket/socketMethods';
import { useActiveChatsStore } from '@/store/useActiveChatsStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useSelectedChatStore } from '@/store/useSelectedChatStore';
import type { IUserChat, IUserData } from '@/types/interfaces';
import { fetchSearchUsers } from '@/utils/fetchSearchUsers';
import IconChatStatus from './icons/IconChatStatus.vue';
import UserBadge from './UserBadge.vue';

const emit = defineEmits(['userSelectedData', 'chatMessages']);
const authStore = useAuthStore();
const selectedChatStore = useSelectedChatStore();
const searchUserNameQuery = ref('');
const searchUsers = ref<IUserData[]>([]);
const selectedUser = ref<IUserData | null>(null);
const isSearchActive = ref(false);
const userChats = ref<IUserChat[]>([]);
const activeChatsStore = useActiveChatsStore();
const savedActiveChats = computed(() => activeChatsStore.activeChats);
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

  if (foundChat?.chatId) {
    selectedChatStore.selectedChatId = foundChat.chatId;

    if (socket) {
      socketEmitJoinChat(foundChat.chatId);

      socketEmitGetMessagesChat(foundChat.chatId).then((chatMessages) => {
        emit('chatMessages', chatMessages);
      });
    }
  }

  emit('userSelectedData', user);
  emit('chatMessages', []);
  selectedUser.value = user;
  searchUserNameQuery.value = '';
  searchUsers.value = [];
};

const getUsersChat = (userChat: IUserChat[]): any => {
  const myUserId = authStore.user?.id;
  const activeChats = userChat.flatMap((chat) =>
    chat.users
      .filter((user) => user.id !== myUserId)
      .map((user) => ({
        ...user,
        chatId: chat.id,
      }))
  );

  activeChatsStore.setChats(activeChats);

  return activeChats;
};

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

onUnmounted(() => {
  // очищаем при размонтировании
  activeChatsStore.clearChats();
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
      <ul v-if="userChats.length" class="left-panel__chats-list">
        <li v-for="user in getUsersChat(userChats)" :key="user.id" class="left-panel__chats-item">
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
