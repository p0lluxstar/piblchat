<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import { ref } from 'vue';
import type { IRegistrationPayload } from '@/types';
import { fetchAuth } from '@/utils/fetchAuth';
import { generateRandomColor } from '@/utils/generateRandomColor';
import { registrationSchema } from '@/yup/validationSchema';
import TheLoader from './TheLoader.vue';
import ToggleShowPassword from './ToggleShowPassword.vue';

const apiUrl = import.meta.env.VITE_API_URL;

const { isLoading, isError, errorMessage, submit } = fetchAuth(`${apiUrl}/users`);

const { handleSubmit, errors } = useForm({
  validationSchema: registrationSchema,
});

const { value: username } = useField<string>('username');
const { value: email } = useField<string>('email');
const { value: password } = useField<string>('password');
const { value: confirmPassword } = useField('confirmPassword');

const showPassword = ref(false);
const showconfirmPassword = ref(false);

const onSubmit = handleSubmit(async () => {
  const payload: IRegistrationPayload = {
    userName: username.value,
    email: email.value,
    password: password.value,
    roleId: 2,
    colorAvatar: generateRandomColor(),
  };
  await submit(payload);
});
</script>

<template>
  <div class="registration-form-layout">
    <div class="registration-container">
      <router-link to="/" class="registration-main-link">❮</router-link>
      <h1 class="registration-form__title">Форма регистрации</h1>
      <form @submit.prevent="onSubmit" class="registration-form__form">
        <div class="registration-form__input-group">
          <div class="registration-form__input-group-item">
            <label for="username" class="registration-form__label">Логин</label>
            <input type="text" id="username" v-model="username" class="registration-form__input" />
            <span class="registration-form__input-error">{{ errors.username }}</span>
          </div>
          <div class="registration-form__input-group-item">
            <label for="email" class="registration-form__label">Email</label>
            <input type="text" id="email" v-model="email" class="registration-form__input" />
            <span class="registration-form__input-error">{{ errors.email }}</span>
          </div>
          <div class="registration-form__input-group-item">
            <label for="password" class="registration-form__label">Пароль</label>
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              class="registration-form__input"
            />
            <ToggleShowPassword @toggle="(value) => (showPassword = value)" />
            <span class="registration-form__input-error">{{ errors.password }}</span>
          </div>
          <div class="registration-form__input-group-item">
            <label for="confirmPassword" class="registration-form__label">Повторите пароль</label>
            <input
              :type="showconfirmPassword ? 'text' : 'password'"
              id="confirmPassword"
              v-model="confirmPassword"
              class="registration-form__input"
            />
            <ToggleShowPassword @toggle="(value) => (showconfirmPassword = value)" />
            <span class="registration-form__input-error">{{ errors.confirmPassword }}</span>
          </div>
        </div>
        <button
          :disabled="isLoading"
          :class="{ loading: isLoading }"
          class="registration-form__button"
          type="submit"
        >
          <span v-if="!isLoading">Зарегистрироваться</span>
          <template v-else>
            <TheLoader backgroundColor="#ffffff" />
          </template>
        </button>
        <div v-if="isError" class="registration-form__error">{{ errorMessage }}</div>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/components/SignUp.scss';
</style>
