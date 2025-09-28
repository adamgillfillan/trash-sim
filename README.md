# Trash Simulator Monorepo

Card game simulation toolkit for the Trash (Garbage) variant where Jacks are wild, Queens/Kings are dead, and the discard pile starts with a face-up card. The repo uses a TypeScript workspace layout with a reusable simulation core, a Node CLI, and a modern React web client built with Vite, Tailwind CSS, and daisyUI. Deployments target Vercel.

## Project Structure

- `packages/game-core` – Pure TypeScript engine with run helpers and Vitest coverage.
- `apps/cli` – Node CLI for batch simulations and optional JSON export.
- `apps/web` – React + Vite SPA with Tailwind/daisyUI themes and a summary dashboard.

## Prerequisites

- Node.js 24.x
- npm (comes with Node 24)

Install dependencies once at the repo root:

```bash
npm install
```

## Workspace Scripts

Most scripts run across workspaces from the repo root:

```bash
npm test          # Runs Vitest in game-core and placeholder scripts elsewhere
npm run build     # Builds the game core, CLI, and web app
npm run lint      # Lints all workspaces (if eslint configs are present)
```

### Game Core

```
cd packages/game-core
npm run test      # Vitest test suite
npm run build     # Emits ESM output in dist/
```

### CLI Usage

Build once, then invoke via Node:

```bash
npm run build --workspace @trash-sim/cli
node apps/cli/dist/index.js --runs 100000 --out results.json
```

The CLI prints:
- Total runs and wins
- Estimated probability (%)
- Expected games to first success (`1/p` when available)
- Wilson 95% confidence interval
- Runtime in seconds

If `--out <file>` is supplied, a JSON summary file is written containing the same metrics plus the rules identifier.

### Web UI

Dev mode:

```bash
npm run dev --workspace @trash-sim/web
```

Build preview:

```bash
npm run build --workspace @trash-sim/web
npx serve apps/web/dist   # or vercel dev, etc.
```

The UI supports theme switching via daisyUI and runs simulations (up to ~100k runs) on demand without a worker. Results include probability, expected games, confidence interval, and runtime.

## Deployment (Vercel)

A `vercel.json` file is included. Recommended project settings:

- **Framework:** Vite
- **Build Command:** `npm run build --workspace @trash-sim/web`
- **Install Command:** `npm install`
- **Output Directory:** `apps/web/dist`
- **Development Command:** `npm run dev --workspace @trash-sim/web`

After connecting the repo, Vercel will install dependencies, run the configured build, and serve the static output from the web app. Every push to `main` will trigger a rebuild, and preview deployments are created for pull requests. Ensure the CI workflow passes before relying on deploys.

## Continuous Integration

`.github/workflows/ci.yml` runs on pushes and PRs:

1. Install dependencies
2. Run tests (`npm test`)
3. Build all workspaces (`npm run build`)

## Configuration Notes

- Simulation logic defaults to Math.random but exposes an RNG interface for future seedable implementations.
- Rule configuration lives in `packages/game-core/src/constants.ts` and can be cloned via `createDefaultConfig()`.
- Web simulations deliberately run on the main thread; upgrade to a worker for >100k runs if necessary.
- TypeScript strict mode and ESLint/Prettier configurations are shared via `tsconfig.base.json` and root configs.

## Next Steps

- Extend the CLI/web to support additional rule variants or multi-player tracking.
- Add histogram visualisations in the web client.
- Consider wiring a Web Worker for very large batch sizes in the browser.