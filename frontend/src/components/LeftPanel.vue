<script setup lang="ts">
import Cookies from 'js-cookie';
import { ref, watch } from 'vue';
import type { ISearchUser } from '@/types/interfaces';

const searchQuery = ref('');
const users = ref<ISearchUser[]>([]);
let debounceTimeout: ReturnType<typeof setTimeout>;
const emit = defineEmits(['user-data']);

watch(searchQuery, (newQuery) => {
  clearTimeout(debounceTimeout);

  debounceTimeout = setTimeout(async () => {
    if (newQuery.trim().length === 0) {
      users.value = [];
      return;
    }

    const token = Cookies.get('auth_token');
    if (!token) {
      console.warn('Нет токена — пользователь не авторизован');
      return;
    }

    try {
      const res = await fetch(
        `http://192.168.22.120:3000/users/search?userName=${encodeURIComponent(newQuery)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Ошибка HTTP: ${res.status}`);
      }

      const data = await res.json();
      users.value = [data];
    } catch (err) {
      users.value = [];
      console.error('Ошибка при поиске пользователей:', err);
    }
  }, 500);
});

const handleUserSelect = (user: ISearchUser): void => {
  emit('user-data', user);
  searchQuery.value = '';
  users.value = [];
};
</script>

<template>
  <div class="search-users">
    <input
      type="text"
      v-model="searchQuery"
      placeholder="Поиск пользователей..."
      class="search-input"
    />
    <ul v-if="users.length">
      <li v-for="user in users" :key="user.id">
        <button @click="handleUserSelect(user)" class="user-button">
          {{ user.userName }}
        </button>
      </li>
    </ul>
    <div v-else-if="users.length === 0 && searchQuery" class="no-results">
      Пользователь не найден
    </div>
  </div>
  <div>Ваши чаты</div>
</template>

<style scoped lang="scss">
.search-users {
  position: relative;

  .search-input {
    padding: 8px 12px;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  ul {
    position: absolute;
    display: flex;
    justify-content: space-between;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #eee;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-top: 4px;
    padding: 0;
    list-style: none;
    z-index: 10;

    li {
      width: 100%;
    }

    .no-results {
      padding: 8px 12px;
      color: #666;
      font-style: italic;
    }
  }

  .user-button {
    width: 100%;
    padding: 8px 12px;
    text-align: left;
    background: none;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f5f5f5;
    }

    &:active {
      background-color: #ebebeb;
    }
  }
}
</style>
