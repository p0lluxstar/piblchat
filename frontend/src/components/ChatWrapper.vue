<script setup lang="ts">
import 'splitpanes/dist/splitpanes.css';
import { Pane, Splitpanes } from 'splitpanes';
import { ref } from 'vue';
import LeftPanel from '@/components/LeftPanel.vue';
import RightPanel from '@/components/RightPanel.vue';
import type { ISearchUser } from '@/types/interfaces';

const sharedData = ref({});

const handleData = (data: ISearchUser): void => {
  sharedData.value = data; // Обновляем sharedData
};
</script>

<template>
  <Splitpanes class="custom-theme">
    <Pane class="left-panel" :size="20" :min-size="15" :max-size="30"
      ><LeftPanel @user-data="handleData"
    /></Pane>
    <Pane class="right-panel"><RightPanel :receivedData="sharedData" /></Pane>
  </Splitpanes>
</template>

<style lang="scss">
.custom-theme {
  height: calc(100vh - 60px);
  width: 100%;

  /* Стили для разделителя */
  .splitpanes__splitter {
    background-color: #e0e0e0;
    width: 8px !important;
    position: relative;
    transition: background-color 0.3s;

    &:hover {
      background-color: #bdbdbd;
    }

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 2px;
      height: 20px;
      background: #9e9e9e;
    }
  }

  .left-panel {
    background: #f0f8ff;
    padding: 20px;
  }

  .right-panel {
    background: #f0f0f0;
  }
}
</style>
