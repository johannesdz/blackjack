import { Game, Box, Hand } from '../models/game';
import { ref, computed } from 'vue';

const gameRef = ref(new Game([]));
const boxesActive: boolean[] = [false, false, false];

export function useGame() {
  async function init() {
    const boxes: Box[] = [];
    boxesActive.forEach((boxActive, i) => {
      if (boxActive) {
        boxes.push(new Box(i + 1));
      }
    });
    if (!boxes.length) {
      return;
    }
    gameRef.value = new Game(boxes);
    await gameRef.value.init();
    next();
  }

  function addBox(index: number) {
    if (!boxesActive[index]) {
      boxesActive[index] = true;
      init();
    }
  }

  async function next() {
    let nextHand: Hand | null = null;
    let waitForInteraction = false;
    gameRef.value.getPlayerBoxes().find((box) => {
      return box.getHands().find((hand) => {
        if (hand.isInteractionAllowed()) {
          waitForInteraction = true;
          const nextAction = hand.getNextAction();
          if (nextAction) {
            nextHand = hand;
          } else if (hand.getIsSplit()) {
            nextHand = hand;
          }
          return true;
        }
      });
    });
    if (nextHand && (nextHand as Hand).getNextAction()) {
      let dealerHardValue = 0;
      gameRef.value
        .getDealerBox()
        .getHands()
        .forEach((hand) => {
          dealerHardValue += hand.getCardsHardValue();
        });
      await (nextHand as Hand).calculateCorrectAction(dealerHardValue);
      await (nextHand as Hand).action();
      next();
    } else if (!waitForInteraction) {
      await gameRef.value.playDealer();
      await gameRef.value.setIsFinished();
      init();
    }
  }

  const dealerFinalValueRef = computed(() => {
    if (!gameRef.value.getIsFinished()) {
      return 0;
    }
    const dealerHand = gameRef.value.getDealerBox().getHands()[0];
    if (dealerHand.isBlackJack()) {
      return 99;
    }
    return gameRef.value.getDealerBox().getHands()[0].getValue();
  });

  return { init, addBox, gameRef, next, dealerFinalValueRef };
}
