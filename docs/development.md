# Development

## Setup and checks

Follow the [README](../README.md) setup. `mise.toml` pins tools and exposes common tasks; `package.json` owns command arguments and verification order. `pnpm-lock.yaml` locks dependencies. Use frozen installs through `mise run setup`; refresh the lockfile with pnpm when intentionally changing dependencies.

`mise run verify` runs formatting, ESLint, dependency boundaries, Vitest, TypeScript, and the production build. CI runs that same task. `pnpm run test:watch` provides the focused development loop, `pnpm run format` applies formatting, and `pnpm run preview` serves an existing production build locally.

Setup installs `.githooks/pre-commit` through `scripts/install-hooks.mjs` when the checkout has no custom hooks. The hook runs full verification. Existing custom hook paths are preserved; integrate `mise run verify` into them. Git hooks require mise on PATH. CI skips local hook installation.

The project retains its Vite/SWC, TypeScript, and ESLint stack. ESLint enforces React hooks and refresh rules; Prettier handles formatting with unwrapped Markdown. No commit-message convention is imposed because there is no release automation consuming one.

Only SWC and esbuild dependency build scripts are enabled in `pnpm-workspace.yaml`.

## Code conventions

Follow the ownership and public APIs in [architecture](architecture.md). Keep state transitions and mathematical calculations pure; components compose them and render results. Use local state and ordinary typed dependencies. Add libraries, shared abstractions, and directories only for concrete needs.

Keep UI copy with its feature, including labels, errors, and accessibility text. Use semantic names and complete message functions. Format display numbers through the shared native `Intl` helpers; keep editable and mathematical values unformatted. The single-language app uses English and does not need a translation library yet.

Use Tailwind utilities and existing controls. Keep components and helpers focused, flatten control flow where useful, and remove redundant comments and unused exports. Markdown paragraphs and list items remain on one physical line.

## Tests

Tests live beside their owner as `*.test.ts` or `*.test.tsx`. `tests/setup.ts` contains only shared DOM cleanup and matchers. Vitest uses jsdom and React Testing Library; component tests stub chart rendering while exercising the real controls, state, and sampling. They do not verify SVG layout.

Cover meaningful contracts: sampling limits and precision, gaps in output, unit conversions, parameter mappings, memory bounds and review sequences, numeric drafts, function/variable switching, invalid-input recovery, and output visibility. Use a browser smoke check for chart rendering or responsive-layout changes.

## Adding a function

1. Implement the pure evaluator with its feature owner and add tests for its domain rules.
2. Add parameter defaults in `features/grapher/parameters.ts` as needed. Suggested ranges must include their default values.
3. Add a stable function ID to `features/grapher/model.ts`, register it in `registry.ts`, and supply matching labels in `copy.ts`.
4. For cross-feature formulas, export only the required API from that feature's `index.ts`. Add unit conversions and name mappings at the registry boundary.
5. Extend contract tests and run `mise run verify`.

There are no generated clients, schemas, migrations, or application sources to refresh.

## Local operation

Vite's development and preview servers are local development tools. Use the loopback URLs they print; exposing them to a network is outside the supported development setup. `pnpm run build` writes static assets to `dist/`. Hosting and release automation are not configured.
