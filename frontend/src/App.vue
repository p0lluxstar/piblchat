<script setup lang="ts">
import Cookies from 'js-cookie';
import { onMounted } from 'vue';
import HeaderBlock from './components/HeaderBlock.vue';
import MainBlock from './components/MainBlock.vue';
import { connectSocket } from './socket';

onMounted(() => {
  const token = Cookies.get('auth_token');
  if (token) {
    connectSocket();
  }
});
</script>

<template>
  <HeaderBlock />
  <MainBlock />
</template>

<style scoped></style>
