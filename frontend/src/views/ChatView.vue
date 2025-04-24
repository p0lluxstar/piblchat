<script setup lang="ts">
import { storeToRefs } from 'pinia';
import ChatWrapper from '@/components/ChatWrapper.vue';
import Greeting from '@/components/ChatWrapper.vue';
import { useAuthStore } from '@/store/useAuthStore';

const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);
</script>

<template>
  <Greeting v-if="!isAuthenticated" />
  <ChatWrapper v-if="isAuthenticated" />
</template>
