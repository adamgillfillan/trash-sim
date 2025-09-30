import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const here = fileURLToPath(new URL('.', import.meta.url));
const workspaceRoot = resolve(here, '..', '..', '..', '..', '..');
const cliEntrypoint = fileURLToPath(new URL('../../index.ts', import.meta.url));
const nodeBin = process.execPath;
const tsxCli = resolve(workspaceRoot, 'node_modules', 'tsx', 'dist', 'cli.cjs');

interface CliResult {
  code: number | null;
  stdout: string;
  stderr: string;
}

function runCli(args: string[]): Promise<CliResult> {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(nodeBin, [tsxCli, cliEntrypoint, ...args], {
      cwd: workspaceRoot,
      env: {
        ...process.env,
        NODE_ENV: 'test',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');

    child.stdout.on('data', (chunk) => {
      stdout += chunk;
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });

    child.on('error', (error) => {
      rejectPromise(error);
    });

    child.on('close', (code) => {
      resolvePromise({ code, stdout, stderr });
    });
  });
}

describe('trash-sim CLI (e2e)', () => {
  it('prints help output', async () => {
    const result = await runCli(['--help']);

    expect(result.code).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.stdout).toContain('Trash Simulator CLI');
    expect(result.stdout).toContain('--runs <number>');
  });

  it('runs simulations and prints a summary', async () => {
    const result = await runCli(['--runs', '5']);

    expect(result.code).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.stdout).toContain('Runs: 5');
    expect(result.stdout).toMatch(/Probability: \d+\.\d{4}%/);
  });

  it('writes JSON output when an out file is provided', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'trash-sim-cli-'));
    const outPath = join(tempDir, 'results.json');

    try {
      const result = await runCli(['--runs', '5', '--out', outPath]);

      expect(result.code).toBe(0);
      expect(result.stderr).toBe('');

      const fileContents = await readFile(outPath, 'utf8');
      const payload = JSON.parse(fileContents) as Record<string, unknown>;

      expect(payload).toMatchObject({
        rules: 'jack-wild-discard',
        runs: 5,
      });
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it('surfaces argument errors with exit code 1', async () => {
    const result = await runCli(['--runs']);

    expect(result.code).toBe(1);
    expect(result.stdout.trim()).toBe('');
    expect(result.stderr).toContain('Missing value for --runs');
  });
});
