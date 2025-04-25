<script setup lang="ts">
import { ref } from 'vue';
import UserNameBadge from '@/components/UserNameBadge.vue';

const messageText = ref('');

const sendMessage = (): void => {
  if (messageText.value.trim()) {
    console.log('Отправка сообщения:', messageText.value);
    // Здесь ты можешь сделать emit, отправку через websocket и т.д.
    messageText.value = '';
  }
};

defineProps({
  receivedData: {
    type: Object,
    default: () => ({}),
  },
});
</script>

<template>
  <div v-if="!receivedData.userName" class="empty-chat">Выберите чат</div>
  <div v-else class="chat-container">
    <UserNameBadge :userName="receivedData.userName" />

    <!-- Здесь может быть список сообщений -->

    <div class="message-input">
      <textarea v-model="messageText" placeholder="Введите сообщение..." rows="1"></textarea>
      <button @click="sendMessage">Отправить</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.user-name {
  display: flex;
  background-color: #f0f0f0;
  justify-content: left;
  padding-bottom: 12px;
  border-bottom: 1px solid #ddd;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
  background-color: #f0f0f0;
  padding: 20px;
  box-sizing: border-box;
  width: 60%;
  margin: 0 auto;
}

.message-input {
  display: flex;
  gap: 8px;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid #ddd;

  textarea {
    flex: 1;
    resize: none;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-family: inherit;
    font-size: 1rem;
  }

  button {
    padding: 8px 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #0069d9;
    }
  }
}

.empty-chat {
  padding: 20px;
}
</style>
