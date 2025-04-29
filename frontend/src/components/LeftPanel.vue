<script setup lang="ts">
import '@/assets/styles/components/LeftPanel.scss';
import { ref, watch } from 'vue';
import { socket } from '@/socket';
import { useAuthStore } from '@/store/useAuthStore';
import { useSelectedChatStore } from '@/store/useSelectedChatStore';
import type { IMessage, ISearchUser, IUserChat } from '@/types/interfaces';
import { searchUsers } from '@/utils/userSearch';

const props = defineProps<{
  userChats: IUserChat[];
}>();

const authStore = useAuthStore();
const selectedChatStore = useSelectedChatStore();
const searchUserNameQuery = ref('');
const searchUser = ref<ISearchUser | null>(null);
const selectedUser = ref<ISearchUser | null>(null);
const emit = defineEmits(['userSelectedData', 'chatMessages']);
let debounceTimeout: ReturnType<typeof setTimeout>;
// const userChatsTemp = ref<IUserChat[]>([]);

watch(searchUserNameQuery, (newQuery) => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(async () => {
    searchUser.value = await searchUsers(newQuery);
  }, 500);
});

const handleUserSelectSearch = (user: ISearchUser): void => {
  emit('userSelectedData', user);
  selectedUser.value = user;
  searchUserNameQuery.value = '';
  searchUser.value = null;
  emit('chatMessages', []);
};

const handleUserSelectChat = (user: ISearchUser & { chatId?: number }): void => {
  emit('userSelectedData', user);
  selectedUser.value = user;
  searchUserNameQuery.value = '';
  searchUser.value = null;

  if (user.chatId) {
    selectedChatStore.selectedChatId = user.chatId;
  }

  if (socket) {
    socket.emit('get-messages', {
      chatId: user.chatId,
    });

    socket.once('get-messages', (messages) => {
      const chatMessages = messages.map((message: IMessage) => message.text);
      emit('chatMessages', chatMessages);
    });
  }
};

const getUsersChat = (chatData: IUserChat[]): any => {
  const myUserId = authStore.user?.userId;

  return chatData.flatMap((chat) =>
    chat.users
      .filter((user) => user.id !== myUserId)
      .map((user) => ({
        ...user,
        chatId: chat.id,
      }))
  );
};

// onMounted(async () => {
//   userChatsTemp.value = await getUserChats(); // Присваиваем результат
// });
</script>

<template>
  <div class="search-users">
    <input
      type="text"
      v-model="searchUserNameQuery"
      placeholder="Поиск пользователей..."
      class="search-input"
    />
    <div v-if="searchUser">
      <button @click="handleUserSelectSearch(searchUser)" class="search-user-button">
        {{ searchUser.userName }}
      </button>
    </div>
    <div v-else-if="!searchUser && searchUserNameQuery" class="no-results">
      Пользователь не найден
    </div>
  </div>
  <div class="chats-section">
    <h3>Ваши чаты</h3>
    <ul v-if="props.userChats.length" class="chats-list">
      <li v-for="user in getUsersChat(props.userChats)" :key="user.id">
        <button
          @click="handleUserSelectChat(user)"
          :class="['user-selected-button', { active: selectedUser?.id === user.id }]"
        >
          {{ user.userName }}
        </button>
      </li>
    </ul>
    <div v-else class="no-chats">У вас пока нет чатов</div>
  </div>
</template>

<style scoped lang="scss"></style>
