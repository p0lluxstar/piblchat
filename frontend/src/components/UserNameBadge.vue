<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  userName: string;
}>();
</script>

<template>
  <div class="user-name">
    <div class="user-name_logo">
      {{ userName.slice(0, 2).toUpperCase() }}
    </div>
    <div>{{ userName }}</div>
  </div>
</template>

<style scoped lang="scss">
.user-name {
  display: flex;
  align-items: center; // по вертикали
  justify-content: center; // по горизонтали
  gap: 8px;

  .user-name_logo {
    width: 40px;
    height: 40px;
    border-radius: 50%; /* Делаем круг */
    background: #3498db;
    color: white;

    /* Центрируем содержимое */
    display: flex;
    align-items: center;
    justify-content: center;

    /* Доп. стили */
    font-weight: bold;
    font-size: 18px;
  }
}
</style>
