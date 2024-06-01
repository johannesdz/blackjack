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
    <div v-if="!box" class="box__add">+</div>
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
  position: relative;
}

.box__add {
  position: absolute;
  left: 0;
  right: 0;
  margin: -15px auto;
  top: 50%;
  width: 30px;
  height: 30px;
  border: 2px solid #3b934b;
  font-size: 30px;
  line-height: 30px;
  font-weight: 800;
  border-radius: 50%;
  color: #3b934b;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
