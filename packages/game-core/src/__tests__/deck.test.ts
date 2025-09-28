import { describe, expect, it } from 'vitest';
import { createDeck, shuffle } from '../deck.js';

const deterministicRng = () => 0.123456789;

describe('deck helpers', () => {
  it('creates a full deck of 52 unique cards', () => {
    const deck = createDeck();

    expect(deck).toHaveLength(52);
    const unique = new Set(deck);
    expect(unique.size).toBe(52);
  });

  it('shuffles the deck in place using the provided rng', () => {
    const deck = createDeck();
    const original = [...deck];

    shuffle(deck, deterministicRng);

    expect(deck).toHaveLength(52);
    expect(deck).not.toEqual(original);
    const unique = new Set(deck);
    expect(unique.size).toBe(52);
  });
});