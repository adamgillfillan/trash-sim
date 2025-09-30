import { writeFile } from 'node:fs/promises';
import { stderr, stdout } from 'node:process';
import { defaultConfig, runBatch } from '@trash-sim/game-core';
import type { BatchResult } from '@trash-sim/game-core';

export interface CliOptions {
  runs: number;
  outFile?: string;
}

export interface ParsedArgs {
  options?: CliOptions;
  error?: string;
  showHelp?: boolean;
}

const RULES_ID = 'jack-wild-discard';

export async function main(): Promise<void> {
  const parsed = parseArgs(process.argv.slice(2));

  if (parsed.showHelp) {
    stdout.write(buildHelp());
    return;
  }

  if (!parsed.options) {
    const message = parsed.error ?? 'Invalid arguments.';
    stderr.write(`${message}\n`);
    stderr.write('Run with --help to see usage information.\n');
    process.exitCode = 1;
    return;
  }

  const { runs, outFile } = parsed.options;
  const start = performance.now();
  const results = runBatch({ runs, config: defaultConfig });
  const elapsedMs = performance.now() - start;

  stdout.write(
    formatSummary({
      runs,
      successes: results.successes,
      probability: results.probability,
      expectedGamesToSuccess: results.expectedGamesToSuccess,
      averageRoundsToWin: results.averageRoundsToWin,
      confidenceInterval: results.confidenceInterval95,
      elapsedMs,
    })
  );

  if (outFile) {
    const payload = buildJsonPayload(runs, results);
    await writeFile(outFile, JSON.stringify(payload, null, 2), 'utf8');
  }
}

export function parseArgs(argv: string[]): ParsedArgs {
  if (argv.includes('--help') || argv.includes('-h')) {
    return { showHelp: true };
  }

  if (argv.length === 0) {
    return { error: 'Missing required arguments.' };
  }

  let runs: number | undefined;
  let outFile: string | undefined;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--runs') {
      const value = argv[i + 1];
      if (!value) {
        return { error: 'Missing value for --runs.' };
      }
      runs = Number.parseInt(value, 10);
      if (!Number.isFinite(runs) || runs <= 0) {
        return { error: '--runs must be a positive integer.' };
      }
      i += 1;
      continue;
    }

    if (arg === '--out') {
      const value = argv[i + 1];
      if (!value) {
        return { error: 'Missing value for --out.' };
      }
      outFile = value;
      i += 1;
      continue;
    }

    return { error: `Unknown argument: ${arg}` };
  }

  if (runs === undefined) {
    return { error: 'The --runs option is required.' };
  }

  return {
    options: {
      runs,
      outFile,
    },
  };
}

export function buildHelp(): string {
  return [
    'Trash Simulator CLI',
    '',
    'Usage:',
    '  trash-sim --runs <number> [--out <file>]',
    '',
    'Options:',
    '  --runs <number>   Number of independent simulations to run.',
    '  --out <file>      Optional path to write results as JSON.',
    '  --help            Show this help message.',
    '',
    'Rules:',
    '  jack-wild-discard variant with initial discard pile.',
    '',
  ].join('\n');
}

export interface SummaryInput {
  runs: number;
  successes: number;
  probability: number;
  expectedGamesToSuccess: number | null;
  averageRoundsToWin: number | null;
  confidenceInterval: [number, number] | null;
  elapsedMs: number;
}

export function formatSummary(input: SummaryInput): string {
  const probabilityPct = (input.probability * 100).toFixed(4);
  const expectedText = input.expectedGamesToSuccess !== null
    ? input.expectedGamesToSuccess.toFixed(2)
    : 'Not enough successes';
  const averageRoundsText = input.averageRoundsToWin !== null
    ? input.averageRoundsToWin.toFixed(2)
    : 'Not enough wins';
  const ciText = input.confidenceInterval
    ? `[${(input.confidenceInterval[0] * 100).toFixed(4)}%, ${(input.confidenceInterval[1] * 100).toFixed(4)}%]`
    : 'n/a';

  return [
    `Runs: ${input.runs}`,
    `First-turn perfect wins: ${input.successes}`,
    `Probability: ${probabilityPct}%`,
    `Expected games to success: ${expectedText}`,
    `Average rounds until win: ${averageRoundsText}`,
    `95% confidence interval: ${ciText}`,
    `Runtime: ${(input.elapsedMs / 1000).toFixed(2)}s`,
    '',
  ].join('\n');
}

export function buildJsonPayload(runs: number, results: BatchResult) {
  return {
    rules: RULES_ID,
    runs,
    successes: results.successes,
    probability: results.probability,
    expectedGamesToSuccess: results.expectedGamesToSuccess,
    averageRoundsToWin: results.averageRoundsToWin,
    confidenceInterval95: results.confidenceInterval95,
    generatedAt: new Date().toISOString(),
  };
}
