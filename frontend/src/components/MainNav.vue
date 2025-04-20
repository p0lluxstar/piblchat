<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/store/auth';

const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);
</script>

<template>
  <nav class="nav">
    <router-link to="/">Home</router-link>
    <router-link v-if="!isAuthenticated" to="/signup">SignUp</router-link>
    <router-link v-if="!isAuthenticated" to="/signin">SignIn</router-link>
    <router-link v-if="isAuthenticated" to="/logout">Logout</router-link>
  </nav>
</template>
