<script setup lang="ts">
import type { PropType } from 'vue';
import type { Box } from '@/models/game';
import TheHand from '@/components/TheHand.vue';

defineProps({
  box: {
    type: Object as PropType<Box>,
    default: null,
  },
});
</script>

<template>
  <div class="box">
    <template v-if="box">
      <TheHand
        v-for="(hand, i) in box.getHands()"
        :key="i"
        :hand="hand"
        :is-dealer="box.isDealer()"
      ></TheHand>
    </template>
  </div>
</template>

<style scoped>
.box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row-reverse;
  width: 100%;
  height: 100%;
  gap: 80px;
}
</style>
