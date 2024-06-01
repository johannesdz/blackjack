import { Game, Box, Hand } from '../models/game';
import { ref, computed } from 'vue';

const gameRef = ref(new Game([]));

export function useGame() {
  async function init() {
    const box1 = new Box(1);
    const box2 = new Box(2);
    const box3 = new Box(3);
    const boxes = [box1, box2, box3];
    gameRef.value = new Game(boxes);
    await gameRef.value.init();
    next();
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

  return { init, gameRef, next, dealerFinalValueRef };
}
