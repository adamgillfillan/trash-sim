import type { BatchResult } from "@trash-sim/game-core";
import { ClubIcon, DiamondIcon, HeartIcon, SpadeIcon } from "../../assets/icons";
import type { ReactNode } from "react";

interface SimulationDisplay {
  runs: number;
  batch: BatchResult;
  runtimeMs: number;
}

interface SimResultProps {
  result: SimulationDisplay | null;
  loading: boolean;
  className?: string;
}

const CARD_CLASS =
  "relative overflow-hidden rounded-3xl border border-base-300/70 bg-base-200/95 text-base-content shadow-[0_22px_55px_rgba(7,25,15,0.6)] backdrop-blur-sm";

export default function SimResult({ result, loading, className }: SimResultProps) {
  const composedClassName = `${CARD_CLASS} ${className ?? ""}`.trim();

  if (loading && !result) {
    return (
      <section className={composedClassName} aria-busy="true">
        <AccentBar />
        <div className="card-body items-center gap-3 py-12 text-base-content/80">
          <div className="deal-stack" aria-hidden="true">
            <div className="deal-card" />
            <div className="deal-card" />
            <div className="deal-card" />
          </div>
          <p>Running simulations...</p>
        </div>
      </section>
    );
  }

  if (!result) {
    return (
      <section className={composedClassName}>
        <AccentBar />
        <div className="card-body gap-4 px-6 py-6 sm:px-7">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold">Results</h2>
            <p className="text-base-content/70">
              Run simulations here to estimate how many games you should expect to play before hitting a perfect first round with no extra draws. The numbers will pop in as soon as dealing finishes.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const { batch, runs, runtimeMs } = result;
  const probabilityPct = (batch.probability * 100).toFixed(4);
  const expectedText = batch.expectedGamesToSuccess ? batch.expectedGamesToSuccess.toFixed(2) : "Not enough successes";
  const [ciLow, ciHigh] = batch.confidenceInterval95 ?? [null, null];
  const ciText = ciLow !== null && ciHigh !== null ? `${(ciLow * 100).toFixed(4)}% - ${(ciHigh * 100).toFixed(4)}%` : "n/a";

  return (
    <section className={composedClassName}>
      <AccentBar />
      <div className="card-body gap-5 px-6 py-6 sm:px-7">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-accent/75">
                <span>Summary</span>
                {loading ? <span className="loading loading-ring loading-xs text-accent" aria-label="Running simulations" /> : null}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-base-content/75">
                <span>Runs: {runs.toLocaleString()}</span>
                <span>Runtime: {(runtimeMs / 1000).toFixed(2)} seconds</span>
              </div>
            </div>
            <SuitCluster />
          </div>
        </div>

        <p className="text-sm text-base-content/70">
          A “perfect” game fills every slot on the opening round with no extra draws. These stats reflect how often that happened
          in the simulated games.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-[repeat(auto-fit,minmax(15rem,1fr))]">
          <Stat
            key={`prob-${probabilityPct}`}
            label="Perfect round probability"
            value={`${probabilityPct}%`}
            icon={<SpadeIcon className="h-6 w-6 text-accent" />}
            highlight
          />
          <Stat
            key={`expected-${expectedText}`}
            label="Expected games until first perfect round"
            value={expectedText}
            icon={<DiamondIcon className="h-6 w-6 text-accent" />}
          />
          <Stat
            key={`ci-${ciText}`}
            label="95% confidence interval"
            value={ciText}
            icon={<ClubIcon className="h-6 w-6 text-accent" />}
          />
          <Stat
            key={`wins-${batch.successes}`}
            label="Perfect first-round wins"
            value={batch.successes.toLocaleString()}
            icon={<HeartIcon className="h-6 w-6 text-accent" />}
          />
        </div>
      </div>
    </section>
  );
}

interface StatProps {
  label: string;
  value: string;
  icon: ReactNode;
  highlight?: boolean;
}

function Stat({ label, value, icon, highlight = false }: StatProps) {
  const baseClass =
    "flex h-full flex-col justify-between gap-4 rounded-2xl border border-base-300/60 bg-base-100/90 px-7 py-5 text-base-content shadow-inner ring-1 ring-base-300/40";
  const statClassName = highlight ? `${baseClass} stat-highlight` : baseClass;

  return (
    <div className={statClassName}>
      <div className="flex items-center gap-3 text-base-content/80">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-accent">{icon}</span>
        <span className="text-sm uppercase tracking-[0.2em]">{label}</span>
      </div>
      <div className="text-2xl font-semibold leading-tight">{value}</div>
    </div>
  );
}

function SuitCluster() {
  return (
    <div className="flex items-center gap-2 rounded-full border border-accent/35 bg-base-100/60 px-4 py-2 text-accent">
      <SpadeIcon className="h-4 w-4" />
      <HeartIcon className="h-4 w-4" />
      <ClubIcon className="h-4 w-4" />
      <DiamondIcon className="h-4 w-4" />
    </div>
  );
}

function AccentBar() {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-x-12 top-0 h-1 rounded-full bg-gradient-to-r from-accent/30 via-accent to-accent/30"
    />
  );
}

