<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import TheLogo from '@/components/TheLogo.vue';
import UserBadge from '@/components/UserBadge.vue';
import { disconnectSocket } from '@/socket';
import { useAuthStore } from '@/store/useAuthStore';
import { useSelectedChatStore } from '@/store/useSelectedChatStore';
import ConfirmModal from './ConfirmModal.vue';
import IconLogout from './icons/IconLogout.vue';

const router = useRouter();
const authStore = useAuthStore();
const { isAuthenticated, user } = storeToRefs(authStore);
const selectedChatStore = useSelectedChatStore();
const showLogoutConfirm = ref(false);

const showConfirmLogout = (): void => {
  showLogoutConfirm.value = true;
};

const confirmLogout = (): void => {
  selectedChatStore.clearSelectedChat(); // очищаем из store данные выбранной чата
  authStore.logout(); // удалит токен из кук и сбросит auth
  disconnectSocket(); // отключаем сокет при выходе
  router.push('/'); // редирект на главную
};
</script>

<template>
  <header class="header">
    <div class="aaa"><TheLogo /></div>
    <div class="header__user-panel">
      <UserBadge v-if="user" :userData="user" :isShowSettingBtn="true" />
      <button class="header__logout-button" v-if="isAuthenticated" @click="showConfirmLogout">
        <IconLogout />
      </button>
      <ConfirmModal
        :show="showLogoutConfirm"
        title="Выйти из чата?"
        message="Вы уверены, что хотите выйти из чата?"
        confirm-text="Выйти"
        @confirm="confirmLogout"
        @cancel="showLogoutConfirm = false"
      />
    </div>
  </header>
</template>

<style scoped lang="scss">
@use '@/assets/styles/components/TheHeader.scss';
</style>
