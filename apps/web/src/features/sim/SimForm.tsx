import { FormEvent, useState } from "react";
import { ChipIcon } from "../../assets/icons";

interface SimFormProps {
  defaultRuns: number;
  loading: boolean;
  onSubmit: (runs: number) => Promise<void> | void;
}

const MAX_RUNS = 1_000_000;

export default function SimForm({ defaultRuns, loading, onSubmit }: SimFormProps) {
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
      className="relative overflow-hidden rounded-3xl border border-base-300/60 bg-base-200/95 text-base-content shadow-[0_20px_45px_rgba(7,25,15,0.6)] backdrop-blur-sm"
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-12 top-0 h-1 rounded-full bg-gradient-to-r from-accent/30 via-accent to-accent/30"
      />
      <div className="card-body gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold">Simulation Settings</h2>
          <p className="text-base-content/75">
            Choose how many hands to deal per batch. Higher numbers smooth the odds but take a little longer to run.
          </p>
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label" htmlFor="runs-input">
            <span className="label-text text-base-content/85">Number of runs</span>
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
            <span className="label-text-alt text-base-content/60">
              Runs per click. Higher values increase accuracy.
            </span>
          </label>
        </div>

        {validationError ? (
          <div className="alert border border-warning/50 bg-warning/15 text-warning-content">
            <span>{validationError}</span>
          </div>
        ) : null}

        <div className="card-actions justify-end">
          <button
            type="submit"
            className="btn btn-primary gap-2 border-none bg-gradient-to-r from-accent via-accent/90 to-accent/80 text-neutral shadow-[0_12px_24px_rgba(212,175,55,0.35)] transition-transform duration-200 hover:scale-[1.02]"
            disabled={loading}
          >
            <ChipIcon className="h-5 w-5" />
            {loading ? "Running..." : "Run Simulation"}
          </button>
        </div>
      </div>
    </form>
  );
}

