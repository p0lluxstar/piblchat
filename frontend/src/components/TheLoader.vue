<script setup lang="ts">
defineProps<{
  backgroundColor: string;
}>();
</script>

<template>
  <div class="form-loader">
    <div :style="{ backgroundColor: backgroundColor }"></div>
    <div :style="{ backgroundColor: backgroundColor }"></div>
    <div :style="{ backgroundColor: backgroundColor }"></div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/components/TheLoader.scss';
</style>
