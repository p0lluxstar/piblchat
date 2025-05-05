<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import { fetchAuth } from '@/utils/fetchAuth';
import { loginSchema } from '@/yup/validationSchema';
import FormLoader from './FormLoader.vue';

const { isLoading, isError, errorMessage, submit } = fetchAuth('http://localhost:3000/users/login');

const { handleSubmit, errors } = useForm({
  validationSchema: loginSchema,
});

const { value: email } = useField('email');
const { value: password } = useField('password');

const onSubmit = handleSubmit(async () => {
  const payload = {
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
            <label for="email" class="login-form__label">Почта</label>
            <input type="text" id="email" v-model="email" class="login-form__input" />
            <span class="registration-form__input-error">{{ errors.email }}</span>
          </div>
          <div class="login-form__input-group-item">
            <label for="password" class="login-form__label">Пароль</label>
            <input type="password" id="password" v-model="password" class="login-form__input" />
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
            <FormLoader />
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
