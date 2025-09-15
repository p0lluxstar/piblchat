<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import { ref } from 'vue';
import type { ILoginPayload } from '@/types';
import { fetchAuth } from '@/utils/fetchAuth';
import { loginSchema } from '@/yup/validationSchema';
import TheLoader from './TheLoader.vue';
import ToggleShowPassword from './ToggleShowPassword.vue';

const apiUrl = import.meta.env.VITE_API_URL;
const { isLoading, isError, errorMessage, submit } = fetchAuth(`${apiUrl}/users/login`);

const { handleSubmit, errors } = useForm({
  validationSchema: loginSchema,
});

const { value: email } = useField<string>('email');
const { value: password } = useField<string>('password');

const showPassword = ref(false);

const onSubmit = handleSubmit(async () => {
  const payload: ILoginPayload = {
    email: email.value,
    password: password.value,
  };
  await submit(payload);
});
</script>

<template>
  <div class="login-form-layout">
    <div class="login-container">
      <router-link to="/" class="login-main-link">❮</router-link>
      <h1 class="login-form__title">Форма авторизации</h1>
      <form @submit.prevent="onSubmit" class="login-form__form">
        <div class="login-form__input-group">
          <div class="login-form__input-group-item">
            <label for="email" class="login-form__label">Email</label>
            <input type="text" id="email" v-model="email" class="login-form__input" />
            <span class="registration-form__input-error">{{ errors.email }}</span>
          </div>
          <div class="login-form__input-group-item">
            <label for="password" class="login-form__label">Пароль</label>
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              class="login-form__input"
            />
            <ToggleShowPassword @toggle="(value) => (showPassword = value)" />
            <span class="registration-form__input-error">{{ errors.password }}</span>
          </div>
        </div>
        <button
          :disabled="isLoading"
          :class="{ loading: isLoading }"
          class="login-form__button"
          type="submit"
        >
          <span v-if="!isLoading">Авторизоваться</span>
          <template v-else>
            <TheLoader backgroundColor="#ffffff" />
          </template>
        </button>
        <div v-if="isError" class="login-form__error">{{ errorMessage }}</div>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/components/SignIn.scss';
</style>
