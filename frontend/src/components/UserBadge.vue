<script setup lang="ts">
import router from '@/router';
import type { IUserData } from '@/types';
import IconSettingsUser from './icons/IconSettingsUser.vue';

const props = defineProps<{
  userData: IUserData;
  isShowSettingBtn?: boolean;
}>();

const handleOpenSeetingUser = async (): Promise<void> => {
  router.push('/profile');
};
</script>

<template>
  <div class="user-panel-container">
    <div class="user-panel__info">
      <div class="user-panel__avatar-block">
        <button
          v-if="isShowSettingBtn"
          class="user-panel__delete-user"
          @click="handleOpenSeetingUser"
        >
          <IconSettingsUser />
        </button>
        <div class="user-panel__avatar" :style="{ backgroundColor: props.userData.colorAvatar }">
          {{ props.userData.userName.slice(0, 2).toUpperCase() }}
        </div>
      </div>

      <div class="user-panel__details">
        <span class="user-panel__name">{{ props.userData.userName }}</span>
        <!-- <span class="user-panel__email" v-if="isShowSettingBtn">{{ props.userData.email }}</span> -->
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/components/UserBadge.scss';
</style>
