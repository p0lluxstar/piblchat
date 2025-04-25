<script setup lang="ts">
import { storeToRefs } from 'pinia';
import ChatWrapper from '@/components/ChatWrapper.vue';
import GreetingMessage from '@/components/GreetingMessage.vue';
import { useAuthStore } from '@/store/useAuthStore';

const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);
</script>

<template>
  <GreetingMessage v-if="!isAuthenticated" />
  <ChatWrapper v-if="isAuthenticated" />
</template>
