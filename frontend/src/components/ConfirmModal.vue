<script setup lang="ts">
defineProps<{
  show: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}>();

const emit = defineEmits(['confirm', 'cancel']);
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="confirm-modal">
      <div class="confirm-modal__overlay" @click="emit('cancel')"></div>
      <div class="confirm-modal__content">
        <h3 v-if="title">{{ title }}</h3>
        <p v-if="message">{{ message }}</p>
        <div class="confirm-modal__buttons">
          <button
            @click="emit('cancel')"
            class="confirm-modal__button confirm-modal__button--cancel"
          >
            {{ cancelText || 'Отмена' }}
          </button>
          <button
            @click="emit('confirm')"
            class="confirm-modal__button confirm-modal__button--confirm"
          >
            {{ confirmText || 'Подтвердить' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
@use '@/assets/styles/components/ConfirmModal.scss';
</style>
