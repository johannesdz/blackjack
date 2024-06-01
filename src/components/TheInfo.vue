<script setup lang="ts">
import { useGame } from '@/composables/useGame';
const { next, dealerFinalValueRef, setHelpInfo, currentHelpInfoHandRef } = useGame();

function handleChartClick() {
  setHelpInfo(null, true);
}
</script>

<template>
  <div class="info">
    <h1 class="info__headline">Basic Strategy Trainer for Black Jack</h1>
    Ideal tool to train your blackjack skills and improve your basic strategy. You can play up to 3
    hands in parallel. Splitting is possible, and doubling on aces is allowed.
    <br /><br />
    <strong>You will always lose money in the long run - gambling is not recommended.</strong>
    <br /><br />
    <strong>Rules (currently European Style only)</strong>
    <ul>
      <li>4 or more decks</li>
      <li>Dealer stands on soft 17</li>
      <li>Double after split allowed</li>
      <li>Surrender not allowed</li>
      <li>No peek / No hole card</li>
      <li>
        <RouterLink to="/" @click.stop="handleChartClick">Check rules / Show chart</RouterLink>
      </li>
    </ul>
    <br /><br />
    This is a private project to play around with some web technologies - feel free to check out the
    code on
    <a rel="noopener noreferrer" href="https://github.com/johannesdz/blackjack" target="_blank"
      >GitHub </a
    ><br /><br />
    <strong>Open todos:</strong>
    <ul>
      <li>
        Allow different table settings like surrender, number of decks, dealer peek, double options,
        ...
      </li>
      <li>
        Allow more training modes like train pairs, soft hands, weak hands and other szenarios
      </li>
      <li>Provide ingame statistics</li>
      <li>Allow multiplayer mode across different devices</li>
      <li>Make user interface nicer</li>
    </ul>
  </div>
</template>

<style scoped>
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
