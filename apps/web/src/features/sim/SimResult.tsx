import type { BatchResult } from '@trash-sim/game-core';

interface SimulationDisplay {
  runs: number;
  batch: BatchResult;
  runtimeMs: number;
}

interface SimResultProps {
  result: SimulationDisplay | null;
  loading: boolean;
}

export default function SimResult({ result, loading }: SimResultProps) {
  if (loading && !result) {
    return (
      <div className="card bg-base-200 shadow">
        <div className="card-body items-center justify-center">
          <span className="loading loading-bars loading-md" aria-label="Running simulations" />
          <p className="mt-2 text-sm text-base-content/80">Running simulations...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="card bg-base-200 shadow">
        <div className="card-body">
          <h2 className="card-title">Results</h2>
          <p className="text-base-content/70">
            Run a simulation to see the estimated probability of a first-turn win.
          </p>
        </div>
      </div>
    );
  }

  const { batch, runs, runtimeMs } = result;
  const probabilityPct = (batch.probability * 100).toFixed(4);
  const expectedText = batch.expectedGamesToSuccess
    ? batch.expectedGamesToSuccess.toFixed(2)
    : 'Not enough successes';
  const [ciLow, ciHigh] = batch.confidenceInterval95 ?? [null, null];
  const ciText = ciLow !== null && ciHigh !== null
    ? `${(ciLow * 100).toFixed(4)}% - ${(ciHigh * 100).toFixed(4)}%`
    : 'n/a';

  return (
    <div className="card bg-base-200 shadow">
      <div className="card-body gap-4">
        <div className="flex flex-col gap-1">
          <div className="card-title flex items-center gap-2">
            <span>Summary</span>
            {loading ? (
              <span className="loading loading-ring loading-xs" aria-label="Running simulations" />
            ) : null}
          </div>
          <span className="text-sm text-base-content/70">Runs: {runs.toLocaleString()}</span>
          <span className="text-sm text-base-content/70">
            Runtime: {(runtimeMs / 1000).toFixed(2)} seconds
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Stat label="Probability" value={`${probabilityPct}%`} />
          <Stat label="Expected games to success" value={expectedText} />
          <Stat label="95% confidence interval" value={ciText} />
          <Stat label="First-turn perfect wins" value={batch.successes.toLocaleString()} />
        </div>
      </div>
    </div>
  );
}

interface StatProps {
  label: string;
  value: string;
}

function Stat({ label, value }: StatProps) {
  return (
    <div className="rounded-box bg-base-100 p-4">
      <div className="text-sm text-base-content/70">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}