<script setup lang="ts">
import Cookies from 'js-cookie';
import { onMounted } from 'vue';
import { connectSocket } from './socket';

onMounted(() => {
  const token = Cookies.get('auth_token');
  if (token) {
    connectSocket();
  }
});
</script>

<template>
  <router-view />
</template>

<style scoped></style>
