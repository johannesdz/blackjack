import { PLAYER_ACTIONS } from '@/utils/constants';
import type { PlayerAction, CardSuite, CardName } from '@/types/types';

const possibleSuites: CardSuite[] = ['clubs', 'spades', 'hearts', 'diamonds'];
const possibleCards: CardName[] = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'jack',
  'queen',
  'king',
  'ace',
];

const BLACK_JACK = 21;
const DEALER_SOFT_NUMBER = 17;
const BLACK_JACK_DISPLAY_VALUE = 'BJ';

const sleep = (delay = 600) => new Promise((resolve) => setTimeout(resolve, delay));

export class Game {
  _boxes: Box[] = [];
  _currentBox: Box;
  _isFinished = false;

  constructor(boxes: Box[]) {
    const dealerBox = new Box(0);
    this._boxes = [dealerBox, ...boxes];
    this._currentBox = this._boxes[0];
  }

  getBoxes() {
    return this._boxes;
  }

  getBoxByPosition(position: number) {
    return this.getBoxes().find((box) => box.getPosition() === position);
  }

  getDealerBox() {
    return this._boxes[0];
  }

  getPlayerBoxes() {
    return this._boxes.filter((box) => !box.isDealer());
  }

  async init() {
    const handOut = async (
      isDealerCardVisible: boolean,
      cardName?: CardName,
      cardSuite?: CardSuite,
    ) => {
      await sleep();
      for (const box of this.getPlayerBoxes()) {
        box.getHands()[0].addCard(cardName, cardSuite);
        // Test doubles
        // box.getHands()[0].addCard('7');
        await sleep();
      }
      this.getDealerBox().getHands()[0].addCard(cardName, cardSuite, isDealerCardVisible);
    };

    // first cards
    await handOut(true);
    // second cards
    await handOut(false);
  }

  async playDealer() {
    const dealerBoxHand = this.getDealerBox().getHands()[0];
    dealerBoxHand.getCards().forEach((card) => {
      card.setIsVisible(true);
    });
    await sleep();
    let isPossibleWinningHand = false;
    this.getPlayerBoxes().find((box) => {
      return box.getHands().find((hand) => {
        if (hand.getValue() <= BLACK_JACK) {
          isPossibleWinningHand = true;
          return true;
        }
      });
    });
    if (isPossibleWinningHand) {
      while (dealerBoxHand.getValue() < DEALER_SOFT_NUMBER) {
        dealerBoxHand.addCard();
        await sleep();
      }
    }
  }

  async setIsFinished() {
    this._isFinished = true;
    await sleep(2500);
  }

  getIsFinished() {
    return this._isFinished;
  }
}

export class Card {
  _name: CardName;
  _suite: CardSuite;
  _softValue: number;
  _hardValue: number;
  _isVisible: boolean;

  constructor(name: CardName, suite: CardSuite, isVisible = true) {
    this._isVisible = isVisible;
    this._name = name;
    this._suite = suite;
    if (['10', 'jack', 'queen', 'king'].includes(name)) {
      this._softValue = 10;
      this._hardValue = 10;
    } else if (name === 'ace') {
      this._softValue = 1;
      this._hardValue = 11;
    } else {
      this._softValue = parseInt(name);
      this._hardValue = parseInt(name);
    }
  }

  getName() {
    return this._name;
  }

  getSuite() {
    return this._suite;
  }

  getSvg() {
    return `${this.getName()}_of_${this.getSuite()}`;
  }

  getSoftValue() {
    return this._softValue;
  }

  getHardValue() {
    return this._hardValue;
  }

  getIsVisible() {
    return this._isVisible;
  }

  setIsVisible(isVisible: boolean) {
    this._isVisible = isVisible;
  }
}

export class Box {
  _position: number;
  _hands: Hand[] = [];

  constructor(position: number) {
    this._position = position;
    this.addHand();
  }

  isDealer() {
    return this._position === 0;
  }

  getPosition() {
    return this._position;
  }

  addHand(cards?: Card[]) {
    const hand = new Hand(this);
    if (cards) {
      hand.setCards(cards);
    }
    this._hands.splice(Math.max(this._hands.length - 1, 0), 0, hand);
    return hand;
  }

  getHands() {
    return this._hands;
  }
}

export class Hand {
  _box: Box;
  _cards: Card[];
  _isStand: boolean = false;
  _isDouble: boolean = false;
  _isSplit: boolean = false;
  _nextAction: PlayerAction | null = null;

  constructor(box: Box) {
    this._box = box;
    this._cards = [];
  }

  getBox() {
    return this._box;
  }

  getIsStand() {
    return this._isStand;
  }

  setIsStand() {
    this._isStand = true;
  }

  getIsDouble() {
    return this._isDouble;
  }

  setIsDouble() {
    this._isDouble = true;
  }

  getIsSplit() {
    return this._isSplit;
  }

  setIsSplit() {
    this._isSplit = true;
  }

  getIsBust() {
    return this.getValue() > BLACK_JACK;
  }

  isReady() {
    return this.getCards().length >= 2;
  }

  isDoubleAllowed() {
    return this.getCards().length === 2;
  }

  isSplitAllowed() {
    const cards = this.getCards();
    return cards.length === 2 && cards[0].getHardValue() === cards[1].getHardValue();
  }

  isInteractionAllowed() {
    if (this._box.isDealer()) {
      return false;
    }
    if (this.getCardsHardValue() >= BLACK_JACK || this.getValue() === BLACK_JACK) {
      return false;
    }
    if (this.getIsStand()) {
      return false;
    }
    if (this.getIsDouble()) {
      return false;
    }
    const hasAcesSplit =
      this.getIsSplit() && this.getCards().length > 1 && this.getCards()[0].getName() === 'ace';
    if (hasAcesSplit) {
      return false;
    }
    return true;
  }

  private getCardValues(isSoft: boolean) {
    let value = 0;
    this.getVisibleCards().forEach((card) => {
      value += isSoft ? card.getSoftValue() : card.getHardValue();
    });
    return value;
  }

  getCardsSoftValue() {
    return this.getCardValues(false);
  }

  getCardsHardValue() {
    return this.getCardValues(true);
  }

  getValue() {
    const softValue = this.getCardsSoftValue();
    const hardValue = this.getCardsHardValue();
    if (softValue === hardValue) {
      return softValue;
    } else if (softValue > BLACK_JACK) {
      return hardValue;
    } else {
      return softValue;
    }
  }

  getDisplayValue() {
    const softValue = this.getCardsSoftValue();
    const hardValue = this.getCardsHardValue();
    if (this.isBlackJack()) {
      return BLACK_JACK_DISPLAY_VALUE;
    } else if (this.getValue() === BLACK_JACK) {
      return BLACK_JACK;
    } else if (softValue === hardValue) {
      return softValue;
    } else if (softValue > BLACK_JACK) {
      return hardValue;
    } else {
      if (this.getBox().isDealer()) {
        return softValue;
      }
      return `${hardValue}/${softValue}`;
    }
  }

  getCards() {
    return this._cards;
  }

  getVisibleCards() {
    return this._cards.filter((card) => card.getIsVisible());
  }

  addCard(cardName?: CardName, cardSuite?: CardSuite, isVisible = true) {
    const randomCard = possibleCards[Math.floor(Math.random() * possibleCards.length)];
    const randomSuite = possibleSuites[Math.floor(Math.random() * possibleSuites.length)];
    const newCard = new Card(cardName || randomCard, cardSuite || randomSuite, isVisible);
    this._cards.push(newCard);
  }

  setCards(cards: Card[]) {
    this._cards = cards;
  }

  getNextAction() {
    return this._nextAction;
  }

  setNextAction(action: PlayerAction | null) {
    this._nextAction = action;
  }

  isBlackJack() {
    const cards = this.getVisibleCards();
    return cards.length === 2 && this.getValue() === BLACK_JACK;
  }

  getResult(dealerValue: number) {
    const LOOSE = -1;
    const PUSH = 0;
    const WIN = 1;
    if (this.getValue() > BLACK_JACK) {
      return LOOSE;
    }
    // A bit hacky
    if (dealerValue === 99) {
      if (this.isBlackJack()) {
        return PUSH;
      } else {
        return LOOSE;
      }
    }
    if (dealerValue > BLACK_JACK) {
      return WIN;
    }
    if (this.getValue() < dealerValue) {
      return LOOSE;
    }
    if (this.getValue() === dealerValue) {
      return PUSH;
    }
    return WIN;
  }

  async action() {
    const nextAction = this.getNextAction();
    if (!nextAction) {
      return;
    }
    if (this.getNextAction() === PLAYER_ACTIONS.HIT) {
      this.addCard();
      this.setNextAction(null);
    }
    if (this.getNextAction() === PLAYER_ACTIONS.STAND) {
      this.setIsStand();
      this.setNextAction(null);
    }
    if (this.getNextAction() === PLAYER_ACTIONS.DOUBLE) {
      this.addCard();
      this.setIsDouble();
      this.setNextAction(null);
    }
    if (this.getNextAction() === PLAYER_ACTIONS.SPLIT) {
      const [card1, card2] = this.getCards();
      this.setCards([card1]);
      const newHand = this.getBox().addHand([card2]);
      newHand.setIsSplit();
      newHand.setNextAction(PLAYER_ACTIONS.HIT);
      this.setIsSplit();
      this.setNextAction(PLAYER_ACTIONS.HIT);
    }
    await sleep();
  }
}
