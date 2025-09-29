import { useState } from 'react';
import { defaultConfig, runBatch } from '@trash-sim/game-core';
import ThemeToggle from './components/ThemeToggle';
import SimForm from './features/sim/SimForm';
import SimResult from './features/sim/SimResult';
import type { BatchResult } from '@trash-sim/game-core';
import { CardFanIcon } from './assets/icons';

const DEFAULT_RUNS = 100_000;

interface SimulationState {
  runs: number;
  batch: BatchResult;
  runtimeMs: number;
}

export default function App() {
  const [result, setResult] = useState<SimulationState | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRun = async (runs: number) => {
    try {
      setIsRunning(true);
      setError(null);
      const start = performance.now();
      const batch = await runSimulation(runs);
      const runtimeMs = performance.now() - start;
      setResult({ runs, batch, runtimeMs });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run simulations.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen text-base-content">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-12">
        <div className="relative overflow-hidden rounded-3xl border border-base-300/60 bg-base-200/90 p-8 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur">
          <div className="pointer-events-none absolute -top-20 right-4 h-48 w-48 text-accent/25">
            <CardFanIcon className="h-full w-full" />
          </div>
          <header className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3 text-sm uppercase tracking-[0.35em] text-accent/70">
                <span className="inline-block h-px w-10 bg-accent/40" aria-hidden="true" />
                <span>Card Table Analysis</span>
              </div>
              <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Trash Simulator</h1>
              <p className="mt-2 max-w-xl text-base-content/70">
                Estimate the odds of dealing a first-turn perfect win in the Jack-wild variant. Shuffle, deal, and let the math handle the stakes.
              </p>
            </div>
            <ThemeToggle />
          </header>
        </div>

        <SimForm defaultRuns={DEFAULT_RUNS} loading={isRunning} onSubmit={handleRun} />

        {error ? (
          <div className="alert border border-error/40 bg-error/20 text-error-content">
            <span>{error}</span>
          </div>
        ) : null}

        <SimResult result={result} loading={isRunning} />
      </div>
    </div>
  );
}

function runSimulation(runs: number): Promise<BatchResult> {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      const batch = runBatch({ runs, config: defaultConfig });
      resolve(batch);
    }, 10);
  });
}

