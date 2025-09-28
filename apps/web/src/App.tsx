import { useState } from 'react';
import { defaultConfig, runBatch } from '@trash-sim/game-core';
import ThemeToggle from './components/ThemeToggle';
import SimForm from './features/sim/SimForm';
import SimResult from './features/sim/SimResult';
import type { BatchResult } from '@trash-sim/game-core';

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
    <div className="min-h-screen bg-base-100 text-base-content">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">Trash Simulator</h1>
            <p className="text-base-content/70">
              Estimate the odds of a first-turn perfect win in the Jack-wild variant.
            </p>
          </div>
          <ThemeToggle />
        </header>

        <SimForm defaultRuns={DEFAULT_RUNS} loading={isRunning} onSubmit={handleRun} />

        {error ? (
          <div className="alert alert-error">
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