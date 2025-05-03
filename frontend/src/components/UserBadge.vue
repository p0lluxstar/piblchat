<script setup lang="ts">
import type { IUserData } from '@/types/interfaces';

const props = defineProps<{
  userData: IUserData;
}>();
</script>

<template>
  <div class="user-panel-container">
    <div class="user-panel__info">
      <div class="user-panel__avatar" :style="{ backgroundColor: props.userData.colorAvatar }">
        {{ props.userData.userName.slice(0, 2).toUpperCase() }}
      </div>
      <div class="user-panel__name">{{ props.userData.userName }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/components/UserBadge.scss';
</style>
