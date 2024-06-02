<script setup lang="ts">
import { RULES, RULE_TYPES } from '@/utils/constants';
import { computed } from 'vue';
import { useGame } from '@/composables/useGame';

const { gameRef, currentHelpInfoHandRef, setHelpInfo, isHelpOpenRef } = useGame();

const currentRuleRef = computed(() => {
  if (!currentHelpInfoHandRef.value) {
    return null;
  }
  return currentHelpInfoHandRef.value.calculateNextCorrectActionRule() || '';
});

const currentPlayerValueRef = computed(() => {
  if (!currentHelpInfoHandRef.value) {
    return null;
  }
  return currentHelpInfoHandRef.value.calculateNextCorrectActionPlayerValue() || 0;
});

const currentDealerValueRef = computed(() => {
  if (!currentHelpInfoHandRef.value) {
    return 0;
  }
  return gameRef.value.getDealerBox().getHands()[0].getCardsSoftValue() || 0;
});

function handleCloseClick() {
  setHelpInfo(null);
}

const actionMapping: any = {
  hit: 'hit',
  stand: 'stand',
  double: 'dbl',
  split: 'split',
};
</script>

<template>
  <div class="rules__wrapper" v-if="isHelpOpenRef">
    <div class="rules">
      <div class="rules__close-wrapper">
        <button class="rules__close" @click="handleCloseClick">x</button>
      </div>
      <div v-for="(rule, i) in Object.keys(RULES)" :key="rule">
        <table class="rules__table">
          <tr v-if="i === 0">
            <th class="rules__th">Pl.</th>
            <th class="rules__th" colspan="10">Dealer</th>
          </tr>
          <tr>
            <th class="rules__th">{{ rule }}</th>
            <th
              class="rules__th"
              v-for="dealersCard in Object.keys(RULES[rule])"
              :key="dealersCard"
            >
              {{ dealersCard }}
            </th>
          </tr>
          <template
            v-for="dealersCard in Object.keys(Object.keys(RULES[rule])[0])[0]"
            :key="dealersCard"
          >
            <tr
              v-for="playersCard in Object.keys(RULES[rule][Object.keys(RULES[rule])[0]])"
              :key="playersCard"
            >
              <th class="rules__th">
                {{ rule === RULE_TYPES.PAIR ? `${playersCard}/${playersCard}` : '' }}
                {{ rule === RULE_TYPES.SOFT ? `${Number(playersCard) - 10}/${playersCard}` : '' }}
                {{ rule === RULE_TYPES.HARD ? `${playersCard}` : '' }}
              </th>
              <td
                v-for="dealersCard2 in Object.keys(RULES[rule])"
                :key="dealersCard2"
                :class="[
                  'rules__td',
                  `rules__td--${RULES[rule][dealersCard2][playersCard]}`,
                  {
                    'rules__td--active':
                      currentRuleRef === rule &&
                      (dealersCard2 === String(currentDealerValueRef) ||
                        playersCard === String(currentPlayerValueRef)),
                    'rules__td--active-exact':
                      currentRuleRef === rule &&
                      dealersCard2 === String(currentDealerValueRef) &&
                      playersCard === String(currentPlayerValueRef),
                  },
                ]"
              >
                {{ actionMapping[RULES[rule][dealersCard2][playersCard]] }}
              </td>
            </tr>
          </template>
        </table>
      </div>
    </div>
  </div>
</template>

<style>
.rules__wrapper {
  top: 0;
  bottom: 0;
  background: #fff;
  border-radius: 10px;
  padding: 0;
  color: #333;
  position: fixed;
  max-height: 100vh;
  z-index: 10;
  overflow: auto;
  max-width: 430px;
  min-width: 320px;
  width: 100%;
  margin: 0 auto;
}

.rules {
  padding: 10px 10px 20px 10px;
}

.rules__close-wrapper {
  position: absolute;
  top: 0;
  font-size: 30px;
  line-height: 30px;
  border-radius: 50%;
  display: flex;
  justify-content: end;
  align-items: center;
  z-index: 20;
  opacity: 0.8;
  position: fixed;
  max-width: 410px;
  min-width: 320px;
  width: 100%;
  margin: 0 auto;
}

.rules__close {
  margin: 10px;
  width: 40px;
  height: 40px;
  font-size: 20px;
  line-height: 20px;
  background: #111;
  color: #ccc;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 2px 2px 2px #111;
  cursor: pointer;
}

@media only screen and (min-width: 1400px) {
  .rules__wrapper {
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 440px;
    bottom: auto;
    max-height: calc(100vh - 20px);
  }

  .rules__close-wrapper {
    top: 10px;
  }
}

@media only screen and (max-width: 500px) {
  .rules__wrapper {
    left: 0;
    right: 0;
    width: 100%;
    max-width: none;
  }

  .rules__close-wrapper {
    width: 100%;
    right: 10px;
    max-width: none;
  }

  .rules {
    padding: 0;
    padding: 10px 2px;
  }
}

.rules__table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.rules__td,
.rules__th {
  text-align: center;
  font-size: 11px;
  padding: 2px 0px;
  border-spacing: 0;
  opacity: 0.6;
}

.rules__td {
  transition: all ease 0.3s;
  border: 1px solid #fff;
  color: #ccc;
}

.rules__td:hover {
  transform: scale(1.3);
  opacity: 1;
  color: #fff;
}

.rules__td--active {
  opacity: 0.8;
  color: #fff;
}

.rules__td--active-exact {
  opacity: 1;
  transform: scale(1.3);
  color: #fff;
}

.rules__td--hit {
  background: rgb(14, 152, 14);
}

.rules__td--stand {
  background: rgb(202, 59, 59);
}

.rules__td--double {
  background: #104fb5;
}

.rules__td--split {
  background: #b5a110;
}

.info__headline {
  font-size: 20px;
  padding-bottom: 10px;
}
</style>
