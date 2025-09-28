import type { SimulationConfig } from './types.js';

export const BOARD_SIZE = 10;

export function createDefaultConfig(): SimulationConfig {
  return {
    boardSize: BOARD_SIZE,
    allowDiscardDraw: true,
    useInitialDiscard: true,
    wildRanks: new Set([10]),
    deadRanks: new Set([11, 12]),
  };
}

export const defaultConfig = createDefaultConfig();