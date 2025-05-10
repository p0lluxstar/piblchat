<script setup lang="ts">
import { storeToRefs } from 'pinia';
import PageLoader from './components/PageLoader.vue';
import { useAuthStore } from './store/useAuthStore';

const authStore = useAuthStore();
const { isLoading } = storeToRefs(authStore);
</script>

<template>
  <div v-if="isLoading">
    <PageLoader />
  </div>
  <router-view v-else />
</template>

<style scoped></style>
