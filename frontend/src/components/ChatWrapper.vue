<script setup lang="ts">
import 'splitpanes/dist/splitpanes.css';
import '@/assets/styles/components/ChatWrapper.scss';
import { Pane, Splitpanes } from 'splitpanes';
import { provide, ref } from 'vue';
import LeftPanel from '@/components/LeftPanel.vue';
import RightPanel from '@/components/RightPanel.vue';
import type { ISearchUser, IUserChat } from '@/types/interfaces';

const userSelectedData = ref<ISearchUser | null>(null);
const userChats = ref([]);
const chatMessages = ref([]);

const handleUserSelectedData = (data: ISearchUser): void => {
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
  <Splitpanes class="custom-theme">
    <Pane class="left-panel" :size="20" :min-size="15" :max-size="30"
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
</template>

<style lang="scss"></style>
