<script setup lang="ts">
import router from '@/router';

const handleBtnOnMainPage = (): void => {
  router.push('/');
};
</script>

<template>
  <div class="not-found">
    <div class="content">
      <div class="error-code">404</div>
      <div class="error-message">Oops! Страница не найдена</div>
      <button class="btn btn-primary" @click="handleBtnOnMainPage">На главную</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/components/NotFoundPage.scss';
</style>
