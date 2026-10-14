# IRIS — ophthalmology teaching clinic (React 19 + TypeScript + Vite)

## Commands
- `npm install` — install pinned deps (lockfile committed)
- `npm run dev` — dev server (http://localhost:5173)
- `npm test` — Vitest unit/domain tests (`tests/`)
- `npm run reference` — independent Python reference checks (`reference/`, sampling derivation, not production code)
- `npm run e2e` — Playwright journeys (`e2e/`), desktop + mobile; uses installed **Edge** (`channel: 'msedge'`), starts Vite on :5199
- `npx tsc --noEmit -p tsconfig.app.json` — typecheck; `npm run build` — production build

## Architecture
- `src/domain/` pure, React-free logic: `optics.ts` (ONLY place for lens math and the coordinate convention), `missions.ts` (optics task families), `learning.ts` (attempt schema, scheduler, evidence, export schema), `cases.ts` (authored refraction patients + coherence checks), `exam.ts`, plus studio models (`pupils.ts`, `motility.ts`, `fields.ts`, `acuity.ts`).
- `src/lib/store.ts` IndexedDB repo (memory fallback, reported to the user); `src/app/` context + hash router.
- `src/lab/` studio UIs; `src/lab/registry.tsx` maps studio id → component. `src/pages/` the six destinations + notebook/search/settings.
- `src/content/` lecture data (`lectures.data*.ts`, schema in `schema.ts`), `studios.ts` (truthful status), `TEST_REGISTRY.json` (88 activities), `reference.ts` (sources, glossary, misconceptions).

## Conventions
- Keep target state, examination conditions, observations and learner answers separate; a submission never mutates the target.
- Units in names (`sphereD`, `axisDeg`, `workingDistanceM`). Never `eval`. Grade lenses by matrix, never by string/SE/two meridians.
- Status is truthful: only mark a studio/registry entry implemented after it works and is tested. Content is `draft` — no human clinical review exists.
- Tests derive expected values from fixtures or independent formulas, not from the function under test.

## Docs
`docs/IRIS_FULL_LAB_MASTER_PROMPT.md` (spec) · `docs/SIMULATION_CONTRACTS.md` · `docs/TEST_PLAN.md` · `docs/SOURCES.md` · `docs/CONTENT_STATUS.md` · `docs/PRODUCT.md` · **`BUILD_STATUS.md` (resume here)**
