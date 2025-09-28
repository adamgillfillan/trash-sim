import { describe, expect, it } from 'vitest';
import { createDeck, shuffle } from '../deck.js';
import { defaultConfig } from '../constants.js';
import { runBatch, simulateFirstTurnFromDeck } from '../simulation.js';

const card = (rank: number, suit = 0) => rank + suit * 13;

describe('simulateFirstTurnFromDeck', () => {
  it('returns true when the player completes the board on the first turn', () => {
    const deck = [
      card(1), // hidden slot 0 reveals rank 2
      card(2),
      card(3),
      card(4),
      card(5),
      card(6),
      card(7),
      card(8),
      card(9),
      card(11), // hidden slot 9 (unused because board fills first)
      card(0), // initial discard is Ace
    ];

    const result = simulateFirstTurnFromDeck(deck, defaultConfig);

    expect(result.firstTurnPerfect).toBe(true);
  });

  it('returns false when the first card is unplaceable', () => {
    const deck = [
      card(1),
      card(2),
      card(3),
      card(4),
      card(5),
      card(6),
      card(7),
      card(8),
      card(9),
      card(10),
      card(11), // initial discard Queen (dead card)
      card(12), // stock draw King -> unplaceable
    ];

    const result = simulateFirstTurnFromDeck(deck, defaultConfig);

    expect(result.firstTurnPerfect).toBe(false);
  });

  it('fails when a revealed card duplicates a filled slot', () => {
    const deck = [
      card(0), // hidden slot 0 reveals Ace
      card(0),
      card(0),
      card(0),
      card(0),
      card(0),
      card(0),
      card(0),
      card(0),
      card(0),
      card(1), // initial discard = Two -> place into slot 1
      card(0), // stock card (unused)
    ];

    const result = simulateFirstTurnFromDeck(deck, defaultConfig);

    expect(result.firstTurnPerfect).toBe(false);
  });
});

describe('runBatch', () => {
  it('aggregates results consistently for a deterministic RNG', () => {
    const deterministicRng = () => 0;

    const deck = createDeck();
    shuffle(deck, deterministicRng);
    const expected = simulateFirstTurnFromDeck(deck, defaultConfig);

    const batch = runBatch({ runs: 10, rng: deterministicRng, config: defaultConfig });

    if (expected.firstTurnPerfect) {
      expect(batch.successes).toBe(10);
      expect(batch.probability).toBe(1);
    } else {
      expect(batch.successes).toBe(0);
      expect(batch.probability).toBe(0);
    }

    expect(batch.runs).toBe(10);
    expect(batch.confidenceInterval95).not.toBeNull();
  });
});