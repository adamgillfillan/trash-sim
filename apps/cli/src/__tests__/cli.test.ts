import { describe, expect, it } from 'vitest';
import type { BatchResult } from '@trash-sim/game-core';
import {
  buildHelp,
  buildJsonPayload,
  formatSummary,
  parseArgs,
  type ParsedArgs,
  type SummaryInput,
} from '../cli.js';

describe('parseArgs', () => {
  it('parses runs and optional output file', () => {
    const parsed = parseArgs(['--runs', '500', '--out', 'result.json']);

    expect(parsed.options).toEqual({ runs: 500, outFile: 'result.json' });
    expect(parsed.error).toBeUndefined();
  });

  it('signals help when requested', () => {
    const parsed = parseArgs(['--help']);

    expect(parsed.showHelp).toBe(true);
  });

  it('rejects missing runs', () => {
    const parsed = parseArgs([]);

    expect(parsed.error).toMatch(/missing required/iu);
  });

  it('rejects invalid run counts', () => {
    const parsed = parseArgs(['--runs', '-10']);

    expect(parsed.error).toMatch(/must be a positive integer/iu);
  });

  it('rejects unknown flags', () => {
    const parsed = parseArgs(['--runs', '10', '--foo']);

    expect(parsed.error).toBe('Unknown argument: --foo');
  });
});

describe('buildHelp', () => {
  it('contains usage information', () => {
    const help = buildHelp();

    expect(help).toContain('trash-sim --runs <number>');
    expect(help).toContain('--out <file>');
  });
});

describe('formatSummary', () => {
  const baseInput: SummaryInput = {
    runs: 100,
    successes: 40,
    probability: 0.4,
    expectedGamesToSuccess: 2.5,
    averageRoundsToWin: 3.2,
    confidenceInterval: [0.3, 0.5],
    elapsedMs: 1200,
  };

  it('renders numeric values with their expected formatting', () => {
    const summary = formatSummary(baseInput);

    expect(summary).toContain('Runs: 100');
    expect(summary).toContain('First-turn perfect wins: 40');
    expect(summary).toContain('Probability: 40.0000%');
    expect(summary).toContain('Expected games to success: 2.50');
    expect(summary).toContain('Average rounds until win: 3.20');
    expect(summary).toContain('95% confidence interval: [30.0000%, 50.0000%]');
    expect(summary).toContain('Runtime: 1.20s');
  });

  it('handles missing expected value and confidence interval', () => {
    const summary = formatSummary({
      ...baseInput,
      expectedGamesToSuccess: null,
      averageRoundsToWin: null,
      confidenceInterval: null,
    });

    expect(summary).toContain('Expected games to success: Not enough successes');
    expect(summary).toContain('Average rounds until win: Not enough wins');
    expect(summary).toContain('95% confidence interval: n/a');
  });
});

describe('buildJsonPayload', () => {
  it('captures batch output and metadata', () => {
    const batch: BatchResult = {
      runs: 25,
      successes: 5,
      probability: 0.2,
      expectedGamesToSuccess: 4,
      averageRoundsToWin: 3,
      confidenceInterval95: [0.1, 0.3],
    };

    const payload = buildJsonPayload(25, batch);

    expect(payload).toMatchObject({
      rules: 'jack-wild-discard',
      runs: 25,
      successes: 5,
      probability: 0.2,
      expectedGamesToSuccess: 4,
      averageRoundsToWin: 3,
      confidenceInterval95: [0.1, 0.3],
    });
    expect(typeof payload.generatedAt).toBe('string');
  });
});
