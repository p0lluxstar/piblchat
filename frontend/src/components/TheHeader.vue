<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import TheLogo from '@/components/TheLogo.vue';
import UserBadge from '@/components/UserBadge.vue';
import { disconnectSocket } from '@/socket';
import { useAuthStore } from '@/store/useAuthStore';
import IconLogout from './icons/IconLogout.vue';

const router = useRouter();
const authStore = useAuthStore();
const { isAuthenticated, user } = storeToRefs(authStore);

const handleLogout = (): void => {
  authStore.logout(); // удалит токен из кук и сбросит auth
  router.push('/'); // редирект на главную
  disconnectSocket(); // отключаем сокет при выходе
};
</script>

<template>
  <header class="header">
    <TheLogo />
    <div class="header__user-panel">
      <UserBadge v-if="user" :userData="user" />
      <button class="header__logout-button" v-if="isAuthenticated" @click="handleLogout">
        <IconLogout />
      </button>
    </div>
  </header>
</template>

<style scoped lang="scss">
@use '@/assets/styles/components/TheHeader.scss';
</style>
