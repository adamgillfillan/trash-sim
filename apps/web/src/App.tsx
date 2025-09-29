import { useState } from "react";
import { defaultConfig, runBatch } from "@trash-sim/game-core";
import ThemeToggle from "./components/ThemeToggle";
import SimForm from "./features/sim/SimForm";
import SimResult from "./features/sim/SimResult";
import type { BatchResult } from "@trash-sim/game-core";
import { CardFanIcon } from "./assets/icons";

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
      setError(err instanceof Error ? err.message : "Failed to run simulations.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col text-base-content">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 lg:px-6 lg:py-8">
        <header className="relative overflow-hidden rounded-3xl border border-base-300/50 bg-base-200/85 p-6 shadow-[0_18px_48px_rgba(0,0,0,0.25)] backdrop-blur-xl lg:p-7">
          <div className="pointer-events-none absolute -top-16 right-4 h-40 w-40 text-accent/25 lg:-top-20 lg:h-48 lg:w-48">
            <CardFanIcon className="h-full w-full" />
          </div>
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-accent/70">
                <span className="inline-block h-px w-8 bg-accent/40" aria-hidden="true" />
                Card Table Analysis
              </span>
              <h1 className="mt-3 text-3xl font-semibold sm:text-[2.15rem]">Trash Simulator</h1>
              <p className="mt-1 text-base-content/70">
                Estimate how many Trash games you need to play before hitting a perfect first round with no extra draws.
              </p>
              <p className="mt-2 text-sm text-base-content/60">
                Assumes a single player, Jacks wild, Queens/Kings dead, and a face-up discard to start.
              </p>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <div className="grid flex-1 gap-6 lg:grid-cols-[minmax(260px,320px)_minmax(0,1fr)] xl:grid-cols-[minmax(280px,360px)_minmax(0,1fr)]">
          <SimForm className="h-full" defaultRuns={DEFAULT_RUNS} loading={isRunning} onSubmit={handleRun} />
          <div className="flex h-full flex-col gap-6">
            {error ? (
              <div className="alert border border-error/40 bg-error/15 text-error-content">
                <span>{error}</span>
              </div>
            ) : null}

            <SimResult className="flex-1" result={result} loading={isRunning} />
          </div>
        </div>
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

