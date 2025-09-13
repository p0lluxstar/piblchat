<script setup lang="ts">
import '@/assets/styles/components/TheChat.scss';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import LeftPanel from '@/components/LeftPanel.vue';
import RightPanel from '@/components/RightPanel.vue';
import { useActiveLeftPanelStore } from '@/store/useActiveLeftPanelStore';
import type { IMessagesChat, IUserData } from '@/types';

const userSelectedData = ref<IUserData | null>(null);
const messagesChat = ref<IMessagesChat[] | null>(null);
const loadUserChats = ref();
const activeLeftPanelStore = useActiveLeftPanelStore();

const leftPanel = ref<HTMLElement | null>(null);
const container = ref<HTMLElement | null>(null);

let isResizing = false;

const handleUserSelectedData = (data: IUserData): void => {
  userSelectedData.value = data;
};

const handleChatMessages = (data: IMessagesChat[]): void => {
  messagesChat.value = data;
};

const handleLoadUserChats = (): void => {
  loadUserChats.value?.loadUserChats();
};

onMounted(() => {
  const resizer = document.querySelector('.resizer');

  const onMouseMove = (e: MouseEvent): void => {
    if (!isResizing || !leftPanel.value || !container.value) return;

    const containerRect = container.value.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

    if (newLeftWidth > 10 && newLeftWidth < 80) {
      leftPanel.value.style.width = `${newLeftWidth}%`;
    }
  };

  const onMouseUp = (): void => {
    isResizing = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  resizer?.addEventListener('mousedown', () => {
    isResizing = true;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
});

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', () => {});
  document.removeEventListener('mouseup', () => {});
});
</script>

<template>
  <div class="chat-container" ref="container">
    <div
      class="left-panel"
      ref="leftPanel"
      :class="{ active: activeLeftPanelStore.isLeftPanelActive }"
    >
      <LeftPanel
        @userSelectedData="handleUserSelectedData"
        @messagesChat="handleChatMessages"
        ref="loadUserChats"
      />
    </div>

    <div class="resizer"></div>

    <div class="right-panel">
      <RightPanel
        :userSelectedData="userSelectedData"
        :messagesChat="messagesChat"
        @loadUserChats="handleLoadUserChats"
      />
    </div>
  </div>
</template>
