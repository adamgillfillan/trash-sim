export type RNG = () => number;

export interface SimulationConfig {
  boardSize: number;
  allowDiscardDraw: boolean;
  useInitialDiscard: boolean;
  wildRanks: Set<number>;
  deadRanks: Set<number>;
}

export interface SimulationResult {
  firstTurnPerfect: boolean;
  drawsTaken: number;
  boardCompleted: boolean;
}

export interface BatchOptions {
  runs: number;
  config?: SimulationConfig;
  rng?: RNG;
}

export interface BatchResult {
  runs: number;
  successes: number;
  probability: number;
  expectedGamesToSuccess: number | null;
  averageRoundsToWin: number | null;
  confidenceInterval95: [number, number] | null;
}
