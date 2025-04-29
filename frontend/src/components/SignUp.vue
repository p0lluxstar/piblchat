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
    const response = await fetch('http://192.168.22.120:3000/users', {
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
    router.push('/');
    connectSocket();
  } catch (error) {
    console.error('Error during registration:', error);
  }
};
</script>

<template>
  <div class="registration-form">
    <h1 class="registration-form__title">Registration Form</h1>
    <form @submit.prevent="handleSubmit" class="registration-form__form">
      <div class="registration-form__input-group">
        <div class="registration-form__input-group-item">
          <label for="username" class="registration-form__label">Username</label>
          <input
            type="text"
            id="username"
            v-model="username"
            class="registration-form__input"
            required
          />
        </div>
        <div class="registration-form__input-group-item">
          <label for="email" class="registration-form__label">E-mail</label>
          <input type="text" id="email" v-model="email" class="registration-form__input" required />
        </div>
        <div class="registration-form__input-group-item">
          <label for="password" class="registration-form__label">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="registration-form__input"
            required
          />
        </div>
      </div>
      <button type="submit">Register</button>
      <div v-if="isError" class="registration-form__error">{{ errorMessage }}</div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.registration-form__title {
  text-align: center;
}

.registration-form__form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  margin: auto;
  gap: 1rem;
}

.registration-form__input-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.registration-form__input-group-item {
  label {
    display: inline-block;
    width: 80px;
  }
}

.registration-form__error {
  color: red;
}
</style>
