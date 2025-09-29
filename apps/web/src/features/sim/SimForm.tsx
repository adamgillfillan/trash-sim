import { FormEvent, useState } from "react";
import { ChipIcon } from "../../assets/icons";

interface SimFormProps {
  defaultRuns: number;
  loading: boolean;
  onSubmit: (runs: number) => Promise<void> | void;
  className?: string;
}

const MAX_RUNS = 1_000_000;

export default function SimForm({ defaultRuns, loading, onSubmit, className }: SimFormProps) {
  const [runsValue, setRunsValue] = useState<string>(defaultRuns.toString());
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = Number.parseInt(runsValue, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setValidationError("Please enter a positive number of runs.");
      return;
    }

    if (parsed > MAX_RUNS) {
      setValidationError(`Please choose ${MAX_RUNS.toLocaleString()} runs or fewer.`);
      return;
    }

    setValidationError(null);
    await onSubmit(parsed);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex h-full flex-col overflow-hidden rounded-3xl border border-base-300/60 bg-base-200/95 text-base-content shadow-[0_18px_40px_rgba(7,25,15,0.45)] backdrop-blur-sm ${className ?? ""}`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-10 top-0 h-1 rounded-full bg-gradient-to-r from-accent/30 via-accent to-accent/30"
      />
      <div className="card-body gap-5 px-6 py-6 sm:px-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Simulation Settings</h2>
            <p className="text-sm text-base-content/70">
              Choose how many simulated games to deal. Each game asks: did the player fill every slot on the opening round with no extra draws?
            </p>
            <p className="text-sm text-base-content/60">
              More runs produce steadier odds but take longer to compute.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="form-control">
            <label className="label" htmlFor="runs-input">
              <span className="label-text text-base-content/80">Number of runs</span>
            </label>
            <input
              id="runs-input"
              type="number"
              inputMode="numeric"
              min={1}
              max={MAX_RUNS}
              step={1}
              value={runsValue}
              onChange={(event) => {
                setRunsValue(event.target.value);
                setValidationError(null);
              }}
              className="input input-bordered border-base-300/70 bg-base-100/90 text-base-content placeholder:text-base-content/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/35"
              placeholder="100000"
              disabled={loading}
            />
            <label className="label">
              <span className="label-text-alt text-xs text-base-content/60">
                How many games to simulate per click. Increase later for smoother estimates.
              </span>
            </label>
          </div>
        </div>

        {validationError ? (
          <div className="alert border border-warning/50 bg-warning/15 text-warning-content">
            <span>{validationError}</span>
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-end border-t border-base-300/50 bg-base-100/60 px-6 py-4 sm:px-7">
        <button
          type="submit"
          className="btn btn-primary gap-2 border-none bg-gradient-to-r from-accent via-accent/90 to-accent/80 text-neutral shadow-[0_12px_24px_hsl(var(--a)_/_0.35)] transition-transform duration-200 hover:scale-[1.02]"
          disabled={loading}
        >
          <ChipIcon className="h-5 w-5" />
          {loading ? "Running..." : "Run Simulation"}
        </button>
      </div>
    </form>
  );
}

