<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import IconSmile from './icons/IconSmile.vue';

const emit = defineEmits(['select-emoji']);

const emojis = ref([
  '😊', // Улыбающееся лицо
  '😂', // Лицо со слезами радости
  '❤️', // Красное сердце
  '🤣', // Катающийся от смеха
  '👍', // Большой палец вверх
  '😭', // Громко плачущий
  '👋', // Приветствие
  '🙏', // Сложенные руки (молитва или спасибо)
  '😍', // Влюбленное лицо
  '🥰', // Улыбающееся лицо с сердечками
  '🔥', // Огонь
  '🎉', // Торжество (конфетти)
  '🤔', // Задумчивое лицо
  '😘', // Воздушный поцелуй
  '🥺', // Умоляющее лицо
  '😁', // Сияющее лицо
  '✨', // Блестки
  '😅', // Улыбка с потом (нервный смех)
  '👀', // Глаза
  '😎', // Крутой в очках
  '💕', // Два сердца
  '🤷', // Пожимание плечами
  '🙌', // Поднятые руки (ура!)
  '😢', // Плачущий смайл
  '😴', // Спящий смайл
  '🤪', // Безумное лицо (язык наружу)
  '😡', // Злое лицо
  '👏', // Аплодисменты
  '😋', // Облизывающийся (вкусно)
  '😱', // Кричащий от ужаса
  '💯', // 100 баллов (идеально)
  '🥳', // Вечеринка (празднование)
  '😇', // Ангельское лицо
  '🤩', // Звездные глаза (в восторге)
  '🙄', // Глаза закатываются
  '😐', // Нейтральное лицо
]);
const showPicker = ref(false);
const pickerRef = ref<HTMLDivElement | null>(null);

const handleClickOutside = (event: MouseEvent): void => {
  if (pickerRef.value && !pickerRef.value.contains(event.target as Node)) {
    showPicker.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const togglePicker = (event: MouseEvent): void => {
  event.stopPropagation();
  showPicker.value = !showPicker.value;
};

const insertEmoji = (emoji: string): void => {
  emit('select-emoji', emoji);
  showPicker.value = false;
};
</script>

<template>
  <div class="emoji-container">
    <button @click="togglePicker($event)" class="emoji__button"><IconSmile /></button>
    <div v-if="showPicker" ref="pickerRef" class="emoji__picker">
      <button
        v-for="(emoji, index) in emojis"
        :key="index"
        @click="insertEmoji(emoji)"
        class="emoji__item"
      >
        {{ emoji }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/components/TheEmoji.scss';
</style>
