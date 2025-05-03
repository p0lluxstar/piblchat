<script setup lang="ts">
import 'splitpanes/dist/splitpanes.css';
import '@/assets/styles/components/TheChat.scss';
import { Pane, Splitpanes } from 'splitpanes';
import { ref } from 'vue';
import LeftPanel from '@/components/LeftPanel.vue';
import RightPanel from '@/components/RightPanel.vue';
import type { IUserData } from '@/types/interfaces';

const userSelectedData = ref<IUserData | null>(null);
const userChats = ref([]);
const chatMessages = ref([]);

const handleUserSelectedData = (data: IUserData): void => {
  userSelectedData.value = data;
};

const handleUserChats = (data): void => {
  userChats.value = data;
};

const handleChatMessages = (data): void => {
  chatMessages.value = data;
};
</script>

<template>
  <div class="chat-container">
    <Splitpanes class="splitpanes">
      <Pane :size="20" :min-size="15" :max-size="30"
        ><LeftPanel
          @userSelectedData="handleUserSelectedData"
          @chatMessages="handleChatMessages"
          :userChats="userChats"
      /></Pane>
      <Pane class="right-panel"
        ><RightPanel
          @userChats="handleUserChats"
          :chatMessages="chatMessages"
          :userSelectedData="userSelectedData"
      /></Pane>
    </Splitpanes>
  </div>
</template>

<style lang="scss"></style>
