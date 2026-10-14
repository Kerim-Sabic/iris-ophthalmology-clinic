# Simulation contracts

Every simulation states its assumptions here. Numerical tests (see TEST_PLAN.md) verify the mathematics; they do not validate any clinical protocol.

## 1. Coordinates (single definition)
- Mathematical frame: x to the viewer's right, y up, angles counter-clockwise from +x, **degrees at API boundaries, radians only inside trig calls** (`src/domain/optics.ts`).
- Screen transform: `toScreen(cx, cy, r, θ) = (cx + r cosθ, cy − r sinθ)` in `src/lab/OpticsViews.tsx`. No component flips signs independently.
- Lens diagrams are a front view with 0° on the viewer's right for both eyes (TABO-style). Laterality is never inferred from a diagram.
- Axis and meridian are undirected orientations, period 180°. Horizontal is displayed as 180. Zero cylinder ⇒ axis `null` (never graded).

## 2. Lens model
- `F(θ) = S + C·sin²(θ − A)` — meridional power, not a claim of a ray focus at 1/F(θ).
- `Q = S·I + C·n·nᵀ`, `n = (−sin A, cos A)`; `M = (Qxx+Qyy)/2`, `J0 = (Qxx−Qyy)/2 = −(C/2)cos2A`, `J45 = Qxy = −(C/2)sin2A`.
- Transposition `(S, C, A) → (S+C, −C, A+90 mod 180)`.
- Equivalence = all three matrix components within tolerance. Exact fixture tolerance 1e‑6 D; learner answer tolerance 0.005 D (quarter-step answers); oblique measurement task in the intro mission ±0.13 D worst-meridian (readouts rounded to 0.01 D). Requested notation is scored separately from optical equivalence.
- Composition = matrix addition (same-plane thin lenses). Residual = target − proposal.
- Inverse: declared orthogonal principal meridians ⇒ unique lens; non-orthogonal ⇒ rejected. Arbitrary samples ⇒ least squares after rank check (≥3 distinct meridians; opposite directions are the same meridian); RMS residual reported.
- Classification only in context `full-distance-correction-relaxed`, from both principal powers (spec table 5.4). WTR/ATR: minus-cyl axis within ±30° of 180 / 090, otherwise oblique — describes the written correction, not corneal topography.

## 3. Reduced eye (same-plane paraxial)
- n′ = 4/3, reference retina at l = n′/60 m (Dret = 60 D). `Qeye = Dret·I − Qtarget`; `Qeff = Qeye + Qtrial + (L + a)·I`, L = −1/d.
- Eigenvalue λ > 0 ⇒ real focus at n′/λ; 0 ⇒ infinity; < 0 ⇒ virtual. Line focus is perpendicular to the converging meridian. COLC at `2n′/(λ1+λ2)`.
- Blur patch: geometric ellipse `r0·|1 − zλ/n′|` per principal meridian; illustrative only, not acuity.
- Retina shift slider is a hypothetical model change; the patient target is unchanged. Not a spectacle-plane / vertex-corrected calculation.

## 4. Retinoscopy (LAB02, patients)
- Plane-mirror static retinoscopy, accommodation relaxed unless the authored case declares fluctuation. Streak orientation φ, swept perpendicular, measures meridian φ+90°.
- Gross neutral `G(θ) = R(θ) + 1/w`; residual `G − T`; > +0.125 D ⇒ with, < −0.125 D ⇒ against, else neutral (teaching band). Break phenomenon flagged when streak is >5° off the residual principal meridians.
- Net = gross − 1/w on sphere, unless a working-distance lens is in the frame (tracked to avoid double subtraction). 0.67 m is the entered value (1/0.67 ≈ 1.4925 D); 2/3 m is offered separately.
- Reflex brightness/width are schematic cues. Small pupil, media haze and fluctuating accommodation are authored observation-quality states; they never name a disease.

## 5. JCC and sphere refinement
- ±p JCC = `p / −2p × axis` (principal +p/−p, SE 0). Axis check: JCC principal meridians at trial axis ± 45°; power check: aligned with the trial axis. Both views composed by matrix addition with the trial.
- Fictional patient preference = lower residual blur strength `√(M²+J0²+J45²)` with 0.04 D tie zone — a **declared teaching metric**, not a validated preference or acuity model. Excess minus during sphere checks is reported as “smaller and darker” (declared accommodation behaviour).

## 6. Learner record
- Immutable attempt log (IndexedDB). Summaries (review schedule, evidence, error notebook) are derived, never stored as truth.
- Review policy: intervals 1 → 3 → 7 → 16 → 35 days on unassisted delayed successes; errors/hints → 1 day. Exam attempts do not schedule.
- Evidence: hinted answers never count; delayed = unhinted success ≥ 20 h after an earlier success; transfer = held-out family + delayed pass.
- Controlled test clock (Settings) offsets `now()` for scheduling checks.

## 7. Refraction cases
- Authored archetypes (`src/domain/cases.ts`); acuity values are authored observations. `validateCase` enforces acuity ordering, pinhole improvement for significant refractive blur, correction to 6/6 unless non-refractive loss is declared, a defensible next action, and no diagnosis leakage in IDs/labels.
