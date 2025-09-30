import { defaultConfig } from './constants.js';
import { createDeck, getRank, shuffle, TEN_RANK } from './deck.js';
import type { BatchOptions, BatchResult, RNG, SimulationConfig, SimulationResult } from './types.js';
import { computeWilsonInterval } from './wilson.js';

const EMPTY_SLOT = -1;

type Card = number;

interface SimulationState {
  slots: Card[];
  hidden: Card[];
  slotsFilled: number;
  discardTop: Card | null;
  stockIndex: number;
  deck: Card[];
}

export function simulateFirstTurn(
  config: SimulationConfig = defaultConfig,
  rng: RNG = Math.random
): SimulationResult {
  const deck = createDeck();
  shuffle(deck, rng);
  return simulateFirstTurnFromDeck(deck, config);
}

export function simulateFirstTurnFromDeck(
  shuffledDeck: Card[],
  config: SimulationConfig = defaultConfig
): SimulationResult {
  const deck = [...shuffledDeck];
  const state = initialiseState(deck, config);

  let drawsTaken = 0;
  let firstTurnPerfect = true;

  const drawWithCount = (): Card | null => {
    const card = drawNextCard(state, config);
    if (card !== null) {
      drawsTaken += 1;
    }
    return card;
  };

  let currentCard = drawWithCount();

  while (currentCard !== null) {
    const slotIndex = chooseSlot(currentCard, state, config);

    if (slotIndex === null) {
      firstTurnPerfect = false;
      state.discardTop = currentCard;
      currentCard = drawWithCount();
      continue;
    }

    const revealedCard = placeCardIntoSlot(currentCard, slotIndex, state);

    if (state.slotsFilled === config.boardSize) {
      return { firstTurnPerfect, drawsTaken, boardCompleted: true };
    }

    if (revealedCard !== null && revealedCard !== undefined) {
      currentCard = revealedCard;
      continue;
    }

    currentCard = drawWithCount();
  }

  return { firstTurnPerfect: false, drawsTaken, boardCompleted: false };
}

export function runBatch(options: BatchOptions): BatchResult {
  const { runs, config = defaultConfig, rng = Math.random } = options;

  if (!Number.isFinite(runs) || runs <= 0) {
    return {
      runs: 0,
      successes: 0,
      probability: 0,
      expectedGamesToSuccess: null,
      averageRoundsToWin: null,
      confidenceInterval95: null,
    };
  }

  let successes = 0;
  let wins = 0;
  let totalDrawsToWin = 0;

  for (let i = 0; i < runs; i += 1) {
    const result = simulateFirstTurn(config, rng);
    if (result.firstTurnPerfect) {
      successes += 1;
    }
    if (result.boardCompleted) {
      wins += 1;
      totalDrawsToWin += result.drawsTaken;
    }
  }

  const probability = successes / runs;
  const expectedGamesToSuccess = probability > 0 ? 1 / probability : null;
  const averageRoundsToWin = wins > 0 ? totalDrawsToWin / wins : null;
  const confidenceInterval95 = computeWilsonInterval(successes, runs);

  return {
    runs,
    successes,
    probability,
    expectedGamesToSuccess,
    averageRoundsToWin,
    confidenceInterval95,
  };
}

function initialiseState(deck: Card[], config: SimulationConfig): SimulationState {
  const slots = new Array<Card>(config.boardSize).fill(EMPTY_SLOT);
  const hidden = new Array<Card>(config.boardSize).fill(EMPTY_SLOT);

  let index = 0;
  for (let i = 0; i < config.boardSize; i += 1) {
    const card = deck[index];
    if (card === undefined) {
      throw new Error('Deck exhausted while dealing.');
    }
    hidden[i] = card;
    index += 1;
  }

  let discardTop: Card | null = null;
  if (config.useInitialDiscard) {
    const discardCard = deck[index];
    if (discardCard === undefined) {
      throw new Error('Deck exhausted while setting discard pile.');
    }
    discardTop = discardCard;
    index += 1;
  }

  return {
    slots,
    hidden,
    slotsFilled: 0,
    discardTop,
    stockIndex: index,
    deck,
  };
}

function drawNextCard(state: SimulationState, config: SimulationConfig): Card | null {
  if (config.allowDiscardDraw && state.discardTop !== null) {
    const slotIndex = chooseSlot(state.discardTop, state, config);
    if (slotIndex !== null) {
      const card = state.discardTop;
      state.discardTop = null;
      return card;
    }
  }

  if (state.stockIndex >= state.deck.length) {
    return null;
  }

  const card = state.deck[state.stockIndex];
  state.stockIndex += 1;
  return card === undefined ? null : card;
}

function chooseSlot(card: Card, state: SimulationState, config: SimulationConfig): number | null {
  const rank = getRank(card);

  if (config.wildRanks.has(rank)) {
    return findLowestEmptySlot(state.slots);
  }

  if (config.deadRanks.has(rank)) {
    return null;
  }

  if (rank <= TEN_RANK && rank < config.boardSize) {
    const slotIndex = rank;
    return state.slots[slotIndex] === EMPTY_SLOT ? slotIndex : null;
  }

  return null;
}

function findLowestEmptySlot(slots: Card[]): number | null {
  for (let i = 0; i < slots.length; i += 1) {
    if (slots[i] === EMPTY_SLOT) {
      return i;
    }
  }
  return null;
}

function placeCardIntoSlot(card: Card, slotIndex: number, state: SimulationState): Card | null {
  state.slots[slotIndex] = card;
  state.slotsFilled += 1;

  const revealedCard = state.hidden[slotIndex];
  state.hidden[slotIndex] = EMPTY_SLOT;

  if (revealedCard === undefined || revealedCard === EMPTY_SLOT) {
    return null;
  }

  return revealedCard;
}

export { EMPTY_SLOT };
