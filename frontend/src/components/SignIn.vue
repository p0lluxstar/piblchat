<script setup lang="ts">
import Cookies from 'js-cookie';
import { ref } from 'vue';
import router from '@/router';
import { connectSocket } from '@/socket';
import { useAuthStore } from '@/store/useAuthStore';

const username = ref('');
const email = ref('');
const password = ref('');
const isLoading = ref(false);
const isError = ref(false);
const errorMessage = ref('');
const authStore = useAuthStore();

const handleSubmit = async (): Promise<void> => {
  isLoading.value = true;
  isError.value = false;
  errorMessage.value = '';

  const payload = {
    userName: username.value,
    email: email.value,
    password: password.value,
    roleId: 2,
  };

  try {
    const response = await fetch('http://192.168.22.120:3000/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      isError.value = true;
      errorMessage.value = data.message;
      throw new Error(data.message);
    }

    // ✅ Сохраняем токен в куки при успешной регистрации
    if (data.token) {
      Cookies.set('auth_token', data.token, {
        expires: 7, // Срок жизни 7 дней
        secure: import.meta.env.PROD, // HTTPS в production
        sameSite: 'strict',
        path: '/',
      });
    }

    console.log('User registered successfully:', data);
    authStore.singUp();
    router.push('/chat');
    connectSocket();
  } catch (error) {
    console.error('Error during login:', error);
  }
};
</script>

<template>
  <div class="login-form-layout">
    <div class="login-container">
      <router-link to="/" class="login-main-link">❮</router-link>
      <h1 class="login-form__title">Login Form</h1>
      <form @submit.prevent="handleSubmit" class="login-form__form">
        <div class="login-form__input-group">
          <div class="login-form__input-group-item">
            <label for="email" class="login-form__label">E-mail</label>
            <input type="text" id="email" v-model="email" class="login-form__input" required />
          </div>
          <div class="login-form__input-group-item">
            <label for="password" class="login-form__label">Password</label>
            <input
              type="password"
              id="password"
              v-model="password"
              class="login-form__input"
              required
            />
          </div>
        </div>
        <button class="login-form__button" type="submit">Login</button>
        <div v-if="isError" class="login-form__error">{{ errorMessage }}</div>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/components/SignIn.scss';
</style>
