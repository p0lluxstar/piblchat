<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/store/useAuthStore';

const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);
</script>
<template>
  <div :class="{ 'logo-container': !isAuthenticated, 'logo-container-auth': isAuthenticated }">
    <img class="logo-image" src="../assets/img/svg/logo.svg" alt="logo" />
    <span class="logo-text">PiblCHAT</span>
  </div>
</template>
<style scoped lang="scss">
@use '@/assets/styles/components/TheLogo.scss';
</style>
