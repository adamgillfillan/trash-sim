import { FormEvent, useState } from 'react';

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
      setValidationError('Please enter a positive number of runs.');
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
    <form onSubmit={handleSubmit} className="card bg-base-200 shadow">
      <div className="card-body gap-4">
        <h2 className="card-title">Simulation Settings</h2>
        <div className="form-control w-full max-w-xs">
          <label className="label" htmlFor="runs-input">
            <span className="label-text">Number of runs</span>
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
            className="input input-bordered"
            placeholder="100000"
            disabled={loading}
          />
          <label className="label">
            <span className="label-text-alt">Runs per click. Higher values increase accuracy.</span>
          </label>
        </div>

        {validationError ? (
          <div className="alert alert-warning">
            <span>{validationError}</span>
          </div>
        ) : null}

        <div className="card-actions justify-end">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Running...' : 'Run Simulation'}
          </button>
        </div>
      </div>
    </form>
  );
}