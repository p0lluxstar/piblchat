<script setup lang="ts">
import { useActiveLeftPanelStore } from '@/store/useActiveLeftPanelStore';
import IconBurgerMenu from './icons/IconBurgerMenu.vue';
import IconClose from './icons/IconClose.vue';

const props = defineProps<{
  show: boolean;
}>();

const activeLeftPanelStore = useActiveLeftPanelStore();

const togglePanel = (): void => {
  if (props.show) {
    activeLeftPanelStore.trueActiveLeftPanel();
  } else {
    activeLeftPanelStore.falseActiveLeftPanel();
  }
};
</script>

<template>
  <button class="btn-icon" @click="togglePanel">
    <component :is="show ? IconBurgerMenu : IconClose" />
  </button>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/components/ToggleShowLeftPanel.scss';
</style>
