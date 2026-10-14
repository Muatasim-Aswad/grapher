# Architecture

A browser-only React application plots trusted, bundled mathematical functions. It has no server, remote state, authentication, or persistence. Form and visibility state last for the current session.

## Ownership

```text
src/
├── app/                 # Bootstrap, shell, global CSS, shell copy
├── assets/              # Bundled favicon
├── features/
│   ├── grapher/          # Controls, plot state, registry, sampling, chart, copy
│   └── memory/           # Pure memory formulas and their tests
└── shared/
    ├── format.ts        # Explicit English locale and Intl number formatting
    └── ui/              # Numeric editing and parsing
```

Keep files flat within each feature until grouping improves navigation. Add `infra/` or configuration when there is code for them to own.

`app` imports features through their `index.ts` public APIs. The grapher imports the memory feature through its public API. Features may use shared code; shared code must not import features or the shell. Imports must remain acyclic. `.dependency-cruiser.cjs` enforces these boundaries, including type imports, in verification.

## Authoritative sources

| Topic                                         | Owner                                |
| --------------------------------------------- | ------------------------------------ |
| Function types and stable IDs                 | `src/features/grapher/model.ts`      |
| Parameter defaults and suggested ranges       | `src/features/grapher/parameters.ts` |
| Available functions and input mappings        | `src/features/grapher/registry.ts`   |
| Memory formulas and model constants           | `src/features/memory/model.ts`       |
| Form transitions and default sampling density | `src/features/grapher/state.ts`      |
| Sampling validation, limits, and results      | `src/features/grapher/sampling.ts`   |
| UI wording                                    | Feature and shell `copy.ts` files    |
| Display number formatting                     | `src/shared/format.ts`               |

## State and contracts

`Grapher` owns form state. Initialization and switching functions use the same default-state builder. Switching variables resets the range and step to that parameter's defaults. Editing either range endpoint recalculates the step for approximately 200 intervals when the range is valid. Editing the step overrides that suggestion.

Numeric controls preserve draft text, including incomplete or invalid input. The parent receives a finite number or `null`; the graph reports invalid state instead of silently plotting stale values. Decimal commas and scientific notation are accepted. Machine IDs, select values, numeric data, and HTML IDs remain independent of display wording.

Functions have an explicit stable ID, at least one parameter, a default variable, and a pure evaluator. Evaluators receive named numbers and return a number or a record of named numbers. `makeFunction` maps registered inputs; it never imports the function registry. Feature-owned copy supplies function, parameter, and output labels separately.

`Graph` owns hidden-output choices. Sampling updates retain those choices, including across invalid-input recovery. Switching functions or pressing Refresh graph resets visibility. `Chart` renders the sampled data and loads separately to keep the initial application bundle smaller.

## Sampling invariants

- Endpoints, step, and all required fixed inputs must be finite numbers. The maximum must be at least the minimum, and the span must be finite.
- The step must be positive and large enough to advance at the lower endpoint's floating-point precision.
- `MAX_SAMPLE_COUNT` bounds function evaluations before any evaluation occurs. Samples use integer indices rather than repeated floating-point addition.
- The upper endpoint is included when it lies on the sampling grid, allowing floating-point tolerance. Equal endpoints produce one sample. A step larger than the span also produces one sample.
- Results retain numeric precision; formatting happens only at display boundaries. Output values are nested under `values` so their names cannot overwrite the horizontal coordinate.
- Nonfinite outputs create gaps in their individual series. Finite sibling outputs remain available. Output keys are collected across all samples. No finite results produce a visible empty-state message.
- Thrown evaluations return a stable `evaluationFailed` code. The UI maps error codes to safe messages and does not expose exception details.

Suggested parameter ranges support exploration; they are not hard domain constraints. Model functions retain their own clamps and preconditions. Invalid mathematical domains may produce gaps or an evaluation error. New functions must be trusted, synchronous, bounded computations: sample limits cannot interrupt an evaluator that itself loops forever. User-supplied executable code is unsupported.

## Memory terms and units

Strength represents retention duration in days. Difficulty adjusts decay and review updates. Answer score represents recall quality; speed and streak bonuses contribute to answer quality. The model clamps strength, difficulty, speed score, and answer quality where defined by its formulas.

`answerTime`, `reactionTime`, and `charTime` use milliseconds. `daysSinceLastReview` and strength use days. The grapher's `timeSinceLastReview` input uses milliseconds; its registry adapter converts to days before calling the memory model. `getForgetProbability` accepts only explicit days. The default review adapter likewise converts its explicitly named `msSinceLastReview` input.

Review sequences and contract tests exercise these units, mappings, and invariants. These are experimental model formulas, not a claim of validated predictions.
