<script setup lang="ts">
import { defineEmits, ref } from 'vue';
import IconHidePassword from './icons/IconHidePassword.vue';
import IconShowPassword from './icons/IconShowPassword.vue';

const emit = defineEmits<{ (e: 'toggle', value: boolean): void }>();
const showPassword = ref(false);

const togglePassword = (): void => {
  showPassword.value = !showPassword.value;
  emit('toggle', showPassword.value);
};
</script>

<template>
  <button type="button" class="form__toggle-password" @click="togglePassword">
    <IconHidePassword v-if="showPassword" />
    <IconShowPassword v-else />
  </button>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/components/ToggleShowPassword.scss';
</style>
