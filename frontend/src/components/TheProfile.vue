<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import router from '@/router';
import { disconnectSocket } from '@/socket';
import { useAuthStore } from '@/store/useAuthStore';
import { useSelectedChatStore } from '@/store/useSelectedChatStore';
import { fetchDeleteUser } from '@/utils/fetchDeleteUser';
import ConfirmModal from './ConfirmModal.vue';
import IconLeftArrow from './icons/IconLeftArrow.vue';

const selectedChatStore = useSelectedChatStore();
const authStore = useAuthStore();
const showDeleteUserConfirm = ref(false);
const { user } = storeToRefs(authStore);

const handleDeleteUser = (): void => {
  showDeleteUserConfirm.value = true;
};

const confirmDeleteUser = async (userName: string | undefined): Promise<void> => {
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

const handleBtnBackChat = (): void => {
  router.push('/chat');
};
</script>

<template>
  <div class="profile">
    <button class="profile__btn-back-chat" @click="handleBtnBackChat"><IconLeftArrow /></button>
    <h1 class="profile__title">Данные пользователя</h1>
    <div>
      <ul class="profile__data-list">
        <li>ID: {{ user?.id }}</li>
        <li>Имя: {{ user?.userName }}</li>
        <li>Email: {{ user?.email }}</li>
        <li class="profile__avatar-color">
          Аватар:
          <span
            :style="{
              backgroundColor: user?.colorAvatar,
            }"
            >{{ user?.colorAvatar.toUpperCase() }}</span
          >
        </li>
      </ul>
    </div>
    <div>
      <div class="profile__delete-block">
        <span>Удалить учетную запись</span>
        <button class="profile__btn-delete" @click="handleDeleteUser">Удалить</button>
      </div>
    </div>
    <ConfirmModal
      :show="showDeleteUserConfirm"
      title="Удалить учетную запись?"
      message="Все ваши чаты и сообщения будут удалены у всех участников. Это действие необратимо."
      confirm-text="Удалить"
      @confirm="confirmDeleteUser(user?.userName)"
      @cancel="showDeleteUserConfirm = false"
    />
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/components/TheProfile.scss';
</style>
