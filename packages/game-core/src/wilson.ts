export function computeWilsonInterval(successes: number, trials: number): [number, number] | null {
  if (trials <= 0) {
    return null;
  }

  const z = 1.96;
  const n = trials;
  const pHat = successes / n;
  const denominator = 1 + (z * z) / n;
  const centre = pHat + (z * z) / (2 * n);
  const margin = z * Math.sqrt((pHat * (1 - pHat) + (z * z) / (4 * n)) / n);

  const lower = (centre - margin) / denominator;
  const upper = (centre + margin) / denominator;

  return [Math.max(0, lower), Math.min(1, upper)];
}