<script setup lang="ts">
import MainNav from './components/MainNav.vue';
</script>

<template>
  <header></header>
  <main>
    <MainNav />
    <router-view />
  </main>
</template>

<style scoped>
.nav {
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>
