# Trash Simulator Monorepo

Card game simulation toolkit for the Trash (Garbage) variant where Jacks are wild, Queens/Kings are dead, and the discard pile starts with a face-up card. The repo uses a TypeScript workspace layout with a reusable simulation core, a Node CLI, and a modern React web client built with Vite, Tailwind CSS, and daisyUI. Deployments target Vercel.

## Project Structure

- `packages/game-core` - Pure TypeScript engine with run helpers and Vitest coverage.
- `apps/cli` - Node CLI for batch simulations and optional JSON export.
- `apps/web` - React + Vite SPA with Tailwind/daisyUI themes and a summary dashboard.

## Prerequisites

- Node.js 22.x (or newer)
- npm (comes with Node 24)

Install dependencies once at the repo root:

```bash
npm install
```

## Workspace Scripts

Most scripts run across workspaces from the repo root:

```bash
npm run dev       # Starts the web client in dev mode (proxy to @trash-sim/web)
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

Dev mode (repo root shortcut):

```bash
npm run dev
```

Direct workspace invocation:

```bash
npm run dev --workspace @trash-sim/web
```

Build preview:

```bash
npm run build --workspace @trash-sim/web
npx serve apps/web/dist   # or vercel dev, etc.
```

The UI supports theme switching via daisyUI (including the felt-inspired "Table Felt" default) and runs simulations (up to ~100k runs) on demand without a worker. Results include probability, expected games, confidence interval, and runtime. The layout keeps the settings panel and results summary in a single viewport so you can review the full output without scrolling, and there is space reserved to add more configuration fields or result tiles later. By default the model tracks how often a single player completes a perfect first round (fills every slot without drawing additional cards).

## Deployment (Vercel)

1. Create a free account at https://vercel.com/signup (skip if you already have one).
2. Install the Vercel CLI locally:

```bash
npm install -g vercel
```

3. Authenticate with Vercel from the repo root:

```bash
vercel login
```

4. Link the local project (creates the project if it does not exist yet):

```bash
vercel link
```

   When prompted, keep the current directory, select your team or personal account, and use the suggested project name (for example, `trash-sim`).

5. Deploy the production build:

```bash
vercel --prod
```

   The CLI reads `vercel.json` for defaults. If Vercel asks for settings, choose:
   - Framework: Vite
   - Build command: `npm run build --workspace @trash-sim/web`
   - Output directory: `apps/web/dist`
   - Install command: `npm install`

6. (Optional) Connect the GitHub repository inside the Vercel dashboard so future pushes to `main` trigger automatic builds, and preview deployments are created for pull requests.

After the first deploy, use `vercel` for preview deployments and `vercel --prod` for production releases.

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

