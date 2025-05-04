<script setup lang="ts">
import { storeToRefs } from 'pinia';
import TheLogo from '@/components/TheLogo.vue';
import { useAuthStore } from '@/store/useAuthStore';

const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);
</script>

<template>
  <div class="home-container">
    <div class="home-page">
      <TheLogo />
      <h1>Добро пожаловать в наш чат!</h1>
      <p>Общайтесь с друзьями, коллегами и единомышленниками в удобном и безопасном мессенджере.</p>

      <div class="auth-buttons">
        <router-link class="btn btn-primary" v-if="!isAuthenticated" to="/signup"
          >Регистрация</router-link
        >
        <router-link class="btn btn-secondary" v-if="!isAuthenticated" to="/signin"
          >Войти</router-link
        >
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/components/TheHome.scss';
</style>
