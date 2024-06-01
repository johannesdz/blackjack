<script setup lang="ts">
import { onMounted } from 'vue';
import { useGame } from '@/composables/useGame';
import TheBox from '@/components/TheBox.vue';

const { init, gameRef, addBox } = useGame();

onMounted(() => {
  init();
});

function handleBoxClick(index: number) {
  addBox(index - 1);
}
</script>

<template>
  <div class="wrapper">
    <div class="board">
      <div class="dealer">
        <div class="dealer-box">
          <TheBox :box="gameRef.getBoxByPosition(0)" />
        </div>
      </div>
      <div class="sign-wrapper">
        <svg class="sign-before" viewBox="0 0 30 5" xmlns="http://www.w3.org/2000/svg">
          <path fill="none" d="M 0 0 Q 15 6 30 0" pathLength="2" />
        </svg>
        <svg class="sign" viewBox="0 0 30 5" xmlns="http://www.w3.org/2000/svg">
          <path id="sign" fill="none" d="M 0 0 Q 15 6 30 0" pathLength="2" />
          <text class="title is-4" font-size="2" dominant-baseline="hanging" text-anchor="middle">
            <textPath href="#sign" startOffset="1">Dealer must hit soft 17</textPath>
          </text>
        </svg>
        <svg class="sign-after" viewBox="0 0 30 5" xmlns="http://www.w3.org/2000/svg">
          <path fill="none" d="M 0 0 Q 15 6 30 0" pathLength="2" />
        </svg>
      </div>
      <div class="players">
        <div :key="i" v-for="i in [1, 2, 3]" class="player-box" @click="handleBoxClick(i)">
          <TheBox :box="gameRef.getBoxByPosition(i)" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  background: radial-gradient(#16892b, #1c5928);
  border-radius: 10px;
  color: #000;
  position: relative;
}

.board {
  min-height: 500px;
  max-height: 700px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.dealer {
  flex-basis: 25%;
  display: flex;
  justify-content: center;
  align-items: end;
}

.dealer-box {
  border: 3px dashed #3b934b;
  height: 80px;
  width: 55px;
  border-radius: 5px;
  padding: 2px;
}

.dealer-box :deep(.card) {
  bottom: 0;
}

.sign-wrapper {
  position: relative;
}

.sign-wrapper svg {
  fill: #1c5928;
}

.sign-wrapper .sign {
  position: absolute;
  top: 0;
  left: 0;
  height: 115px;
  width: 100%;
}

.sign-wrapper .sign-before,
.sign-wrapper .sign-after {
  stroke: #1c5928;
}

.players {
  flex-basis: 40%;
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
  width: 100%;
  gap: 40px;
}

.player-box {
  border: 2px dashed #3b934b;
  height: 80px;
  width: 55px;
  border-radius: 5px;
  padding: 2px;
  transform: translateY(10px);
}

.player-box:hover {
  border: 2px dashed #ddd;
  cursor: pointer;
}

.player-box:hover :deep(.box__add) {
  color: #ddd;
  border-color: #ddd;
}

.player-box:first-of-type {
  transform: rotate(-10deg);
}

.player-box:last-of-type {
  transform: rotate(+10deg);
}

.info {
  margin-top: 10px;
  background: #fff;
  border-radius: 10px;
  padding: 20px 10px;
  color: #333;
  position: relative;
}

.info__headline {
  font-size: 20px;
  padding-bottom: 10px;
}
</style>
