<script setup lang="ts">
import { storeToRefs } from 'pinia';
import TheHome from '@/components/TheHome.vue';
import { useAuthStore } from '@/store/useAuthStore';

const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);
</script>

<template>
  <TheHome v-if="!isAuthenticated" />
</template>
