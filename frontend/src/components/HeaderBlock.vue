<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import MainNav from '@/components/MainNav.vue';
import { disconnectSocket } from '@/socket';
import { useAuthStore } from '@/store/useAuthStore';
import IconLogout from './icons/IconLogout.vue';
import UserNameBadge from './UserNameBadge.vue';

const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);
const router = useRouter();

const handleLogout = (): void => {
  authStore.logout(); // удалит токен из кук и сбросит auth
  router.push('/'); // редирект на главную
  disconnectSocket(); // отключаем сокет при выходе
};
</script>

<template>
  <header class="header">
    <MainNav />
    <div class="header__user-panel">
      <div class="user-panel__auth" v-if="!isAuthenticated">
        <router-link v-if="!isAuthenticated" to="/signup">SignUp</router-link>
        <router-link v-if="!isAuthenticated" to="/signin">SignIn</router-link>
      </div>
      <div class="user-panel__info" v-if="isAuthenticated">
        <div class="user-panel__info-text">
          <UserNameBadge :userName="authStore.user?.userName || ''" />
        </div>
        <button class="user-panel__logout-button" v-if="isAuthenticated" @click="handleLogout">
          <IconLogout />
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 10px 20px;
  background-color: #f7f7f7;
  border-bottom: 1px solid #dee2e6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .header__user-panel {
    display: flex;
    gap: 10px;

    .user-panel__auth {
      display: flex;
      gap: 10px;
    }

    .user-panel__info {
      display: flex;
      gap: 20px;

      .user-panel__info-text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 5px;
      }
    }

    .user-panel__logout-button {
      border: none;
      background: none;

      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
