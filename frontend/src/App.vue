<script setup lang="ts">
import Cookies from 'js-cookie';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import TheHeader from '@/components/TheHeader.vue';
import TheMain from '@/components/TheMain.vue';
import { connectSocket } from './socket';
import { useAuthStore } from './store/useAuthStore';

const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);

onMounted(() => {
  const token = Cookies.get('auth_token');
  if (token) {
    connectSocket();
  }
});
</script>

<template>
  <TheHeader v-if="isAuthenticated" />
  <TheMain />
</template>

<style scoped></style>
