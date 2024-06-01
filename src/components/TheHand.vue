<script setup lang="ts">
import type { PropType } from 'vue';
import type { Hand } from '@/models/game';
import type { PlayerAction } from '@/types/types';
import { PLAYER_ACTIONS } from '@/utils/constants';
import { useGame } from '@/composables/useGame';
const { next, dealerFinalValueRef } = useGame();

const props = defineProps({
  hand: {
    type: Object as PropType<Hand>,
    default: null,
  },
  isDealer: {
    type: Boolean,
    default: false,
  },
});

function handleAction(action: PlayerAction) {
  props.hand.setNextAction(action);
  next();
}

const resultMessages = {
  '-1': 'You loose 😔',
  '0': 'Push 👊',
  '1': 'You win 🎉',
};

const actions = [
  {
    name: PLAYER_ACTIONS.HIT,
    label: 'H',
  },
  {
    name: PLAYER_ACTIONS.STAND,
    label: 'S',
  },
  {
    name: PLAYER_ACTIONS.DOUBLE,
    label: 'DD',
  },
  {
    name: PLAYER_ACTIONS.SPLIT,
    label: 'SP',
  },
];
</script>

<template>
  <div
    :class="[
      'hand',
      {
        'hand--busted': hand.getIsBust(),
      },
    ]"
  >
    <div class="cards">
      <div v-for="(card, i) in hand.getCards()" :key="i" class="card">
        <img
          v-if="card.getIsVisible()"
          class="card__image"
          :data-src="`/svg/${card.getSvg()}.svg`"
          :src="`/svg/${card.getSvg()}.svg`"
        />
      </div>
    </div>
    <div v-if="hand.getCards().length > 0" class="sum">{{ hand.getDisplayValue() }}</div>
    <template v-if="!hand.getBox().isDealer() && dealerFinalValueRef">
      <div :class="['result', `result--${hand.getResult(dealerFinalValueRef)}`]">
        {{ resultMessages[hand.getResult(dealerFinalValueRef)] }}
      </div>
    </template>
    <div
      :class="[
        'actions',
        {
          'actions--disabled': hand.getNextAction(),
          'actions--hidden':
            !hand.isReady() || (!hand.isInteractionAllowed() && !hand.getNextCorrectAction()),
        },
      ]"
    >
      <button
        v-for="action in actions"
        :key="action.name"
        :class="[
          'action',
          {
            'action--disabled':
              (action.name === PLAYER_ACTIONS.DOUBLE && !hand.isDoubleAllowed()) ||
              (action.name === PLAYER_ACTIONS.SPLIT && !hand.isSplitAllowed()),

            'action--success':
              hand.getNextCorrectAction() && hand.getNextCorrectAction() === action.name,
            'action--alert':
              hand.getNextCorrectAction() &&
              hand.getNextCorrectAction() !== action.name &&
              hand.getNextAction() === action.name,
          },
        ]"
        @click="() => handleAction(action.name)"
        :title="action.name"
      >
        {{ action.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.hand {
  position: relative;
  height: 100%;
  width: 55px;
}

.hand--busted {
  opacity: 0.3;
}

.cards {
  position: relative;
  flex-grow: 1;
  height: 100%;
}

.card {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 55px;
  height: 80px;
  z-index: 2;
}

.card:nth-child(2) {
  bottom: 15px;
  left: 15px;
}

.card:nth-child(3) {
  bottom: 30px;
  left: 30px;
}

.card:nth-child(4) {
  bottom: 45px;
  left: 45px;
}

.card:nth-child(5) {
  bottom: 60px;
  left: 60px;
}

.card__image {
  height: 100%;
  width: 100%;
}

.actions {
  width: 64px;
  transition: all ease 0.3s;
  position: absolute;
  top: 100%;
  margin: 40px auto 0 auto;
  left: 0;
  right: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-left: -4px;
}

.actions--disabled {
  opacity: 0.5;
  pointer-events: none;
}

.actions--hidden {
  opacity: 0;
  pointer-events: none;
}

.action {
  background: #333;
  color: #ccc;
  width: 30px;
  height: 30px;
  font-size: 11px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
  border: 0 none;
  box-shadow: 1px 1px 2px #111;
}

.action--alert {
  background: rgb(202, 59, 59);
}

.action--success {
  background: rgb(14, 152, 14);
}

.action--alert,
.action--success {
  animation: background 1.4s linear;
}

.action--disabled {
  opacity: 0.5;
  pointer-events: none;
}

.sum {
  position: absolute;
  top: 100%;
  margin-top: 4px;
  width: 55px;
  height: 30px;
  color: #96c69f;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result {
  position: absolute;
  width: 76px;
  margin-left: -14px;
  top: 50%;
  left: 0;
  right: 0;
  height: 30px;
  font-size: 13px;
  background: #333;
  color: #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  z-index: 1;
  top: 100%;
  margin-top: 42px;
}

.result---1 {
  background: rgb(202, 59, 59);
}

.result--1 {
  background: rgb(14, 152, 14);
}
</style>
