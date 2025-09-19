<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/store/useAuthStore';
import IconLogo from './icons/IconLogo.vue';

const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);
</script>
<template>
  <div :class="{ 'logo-container': !isAuthenticated, 'logo-container-auth': isAuthenticated }">
    <IconLogo />
    <span class="logo-text">PiblCHAT</span>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/components/TheLogo.scss';
</style>
