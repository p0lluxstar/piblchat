<script setup lang="ts">
import { ref } from 'vue';
import router from '@/router';
import { disconnectSocket } from '@/socket';
import { useAuthStore } from '@/store/useAuthStore';
import { useSelectedChatStore } from '@/store/useSelectedChatStore';
import type { IUserData } from '@/types';
import { fetchDeleteUser } from '@/utils/fetchDeleteUser';
import ConfirmModal from './ConfirmModal.vue';
import IconClose from './icons/IconClose.vue';

const props = defineProps<{
  userData: IUserData;
}>();

const showDeleteUserConfirm = ref(false);
const selectedChatStore = useSelectedChatStore();
const authStore = useAuthStore();

const handleDeleteUser = (): void => {
  showDeleteUserConfirm.value = true;
};

const confirmDeleteUser = async (userName: string): Promise<void> => {
  try {
    await fetchDeleteUser(`${userName}`);

    // Только после успешного удаления выполняем остальные действия
    selectedChatStore.clearSelectedChat(); // очищаем из store данные выбранной чата
    authStore.logout(); // удалит токен из кук и сбросит auth
    disconnectSocket(); // отключаем сокет при выходе
    router.push('/'); // редирект на главную
  } catch (error) {
    console.error('Ошибка при удалении пользователя:', error);
    // Можно добавить обработку ошибки, например, показать уведомление пользователю
  }
};
</script>

<template>
  <div class="user-panel-container">
    <div class="user-panel__info">
      <div class="user-panel__avatar-block">
        <button class="user-panel__delete-user" @click="handleDeleteUser"><IconClose /></button>
        <div class="user-panel__avatar" :style="{ backgroundColor: props.userData.colorAvatar }">
          {{ props.userData.userName.slice(0, 2).toUpperCase() }}
        </div>
      </div>

      <div class="user-panel__details">
        <span class="user-panel__name">{{ props.userData.userName }}</span>
        <span class="user-panel__email">{{ props.userData.email }}</span>
      </div>
    </div>
    <ConfirmModal
      :show="showDeleteUserConfirm"
      title="Удалить учетную запись?"
      message="Вы уверены, что хотите удалить свою учетную запись? Это действие нельзя отменить."
      confirm-text="Удалить"
      @confirm="confirmDeleteUser(userData.userName)"
      @cancel="showDeleteUserConfirm = false"
    />
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/components/UserBadge.scss';
</style>
