import { RNG } from './types.js';

export type Card = number;

export const ACE_RANK = 0;
export const TEN_RANK = 9;
export const JACK_RANK = 10;
export const QUEEN_RANK = 11;
export const KING_RANK = 12;

export function createDeck(): Card[] {
  return Array.from({ length: 52 }, (_, index) => index);
}

export function shuffle<T>(items: T[], rng: RNG): void {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const temp = items[i]!;
    items[i] = items[j]!;
    items[j] = temp;
  }
}

export function getRank(card: Card): number {
  return card % 13;
}