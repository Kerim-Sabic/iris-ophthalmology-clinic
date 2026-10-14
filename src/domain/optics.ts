/**
 * IRIS optical model — pure, framework-independent thin-lens mathematics.
 *
 * Coordinate convention (the ONE place it is defined; see docs/SIMULATION_CONTRACTS.md):
 *   - Mathematical frame: x to the examiner's/viewer's right when facing the lens,
 *     y upward, angles measured counter-clockwise from +x, in degrees at the API
 *     boundary and radians only inside trig calls.
 *   - Screen (SVG) frame has y downward, so `toScreen(angleDeg)` = (cos, -sin).
 *     No other component may flip signs independently.
 *   - Axis/meridian are undirected orientations with 180° periodicity.
 *
 * Model: F(θ) = S + C·sin²(θ − A) (meridional power, not a ray focus claim).
 * Power matrix Q = S·I + C·n·nᵀ with n = (−sin A, cos A).
 */

export const EXACT_TOL_D = 1e-6;

export interface SpheroCyl {
  sphereD: number;
  cylinderD: number;
  /** null when cylinder is zero (axis undefined). Stored 0..180, 0 normalised to 180. */
  axisDeg: number | null;
}

export interface PowerMatrix {
  xxD: number;
  xyD: number;
  yyD: number;
}

export interface PowerVector {
  mD: number;
  j0D: number;
  j45D: number;
}

export type CylConvention = 'minus' | 'plus';

const rad = (deg: number) => (deg * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

/** Avoid -0 and floating dust in outputs. */
export function clean(x: number, eps = 1e-12): number {
  if (Math.abs(x) < eps) return 0;
  return x;
}

/** Normalise an orientation to (0, 180]; horizontal is reported as 180. */
export function normalizeAxis(a: number): number {
  let r = ((a % 180) + 180) % 180;
  if (Math.abs(r) < 1e-9 || Math.abs(r - 180) < 1e-9) r = 180;
  return r;
}

/** Orientation to [0,180) for internal comparisons. */
export function orientation(a: number): number {
  const r = ((a % 180) + 180) % 180;
  return Math.abs(r - 180) < 1e-9 ? 0 : r;
}

/** Smallest angular difference between two undirected orientations (0..90). */
export function orientationDiff(a: number, b: number): number {
  const d = Math.abs(orientation(a) - orientation(b));
  return Math.min(d, 180 - d);
}

export function makeLens(sphereD: number, cylinderD = 0, axisDeg: number | null = null): SpheroCyl {
  const c = clean(cylinderD);
  return {
    sphereD: clean(sphereD),
    cylinderD: c,
    axisDeg: c === 0 ? null : normalizeAxis(axisDeg ?? 180),
  };
}

export function toMatrix(rx: SpheroCyl): PowerMatrix {
  const S = rx.sphereD;
  const C = rx.cylinderD;
  if (C === 0 || rx.axisDeg === null) return { xxD: S, xyD: 0, yyD: S };
  const a = rad(rx.axisDeg);
  const s = Math.sin(a);
  const c = Math.cos(a);
  return { xxD: S + C * s * s, xyD: -C * s * c, yyD: S + C * c * c };
}

export function matrixToVector(q: PowerMatrix): PowerVector {
  return { mD: (q.xxD + q.yyD) / 2, j0D: (q.xxD - q.yyD) / 2, j45D: q.xyD };
}

export function vectorToMatrix(v: PowerVector): PowerMatrix {
  return { xxD: v.mD + v.j0D, xyD: v.j45D, yyD: v.mD - v.j0D };
}

export function toVector(rx: SpheroCyl): PowerVector {
  return matrixToVector(toMatrix(rx));
}

export function addMatrices(...qs: PowerMatrix[]): PowerMatrix {
  return qs.reduce(
    (acc, q) => ({ xxD: acc.xxD + q.xxD, xyD: acc.xyD + q.xyD, yyD: acc.yyD + q.yyD }),
    { xxD: 0, xyD: 0, yyD: 0 },
  );
}

export function subMatrices(a: PowerMatrix, b: PowerMatrix): PowerMatrix {
  return { xxD: a.xxD - b.xxD, xyD: a.xyD - b.xyD, yyD: a.yyD - b.yyD };
}

export function scalarMatrix(pD: number): PowerMatrix {
  return { xxD: pD, xyD: 0, yyD: pD };
}

/** Meridional power from the matrix: F(θ) = uᵀQu, u = (cos θ, sin θ). */
export function meridionalPowerQ(q: PowerMatrix, thetaDeg: number): number {
  const t = rad(thetaDeg);
  const c = Math.cos(t);
  const s = Math.sin(t);
  return clean(q.xxD * c * c + 2 * q.xyD * s * c + q.yyD * s * s);
}

/** Direct formula F(θ) = S + C·sin²(θ − A). Kept separate as an internal cross-check. */
export function meridionalPower(rx: SpheroCyl, thetaDeg: number): number {
  if (rx.cylinderD === 0 || rx.axisDeg === null) return clean(rx.sphereD);
  const s = Math.sin(rad(thetaDeg - rx.axisDeg));
  return clean(rx.sphereD + rx.cylinderD * s * s);
}

export function sphericalEquivalent(rx: SpheroCyl): number {
  return clean(rx.sphereD + rx.cylinderD / 2);
}

export interface Principal {
  /** Higher (more positive) principal power and its meridian. */
  maxD: number;
  maxMeridianDeg: number;
  minD: number;
  minMeridianDeg: number;
  /** true when the two principal powers are equal within tolerance (sphere). */
  spherical: boolean;
}

export function principalMeridians(q: PowerMatrix, tol = EXACT_TOL_D): Principal {
  const v = matrixToVector(q);
  const J = Math.hypot(v.j0D, v.j45D);
  if (J < tol / 2) {
    return { maxD: clean(v.mD), minD: clean(v.mD), maxMeridianDeg: 180, minMeridianDeg: 90, spherical: true };
  }
  const thetaMax = normalizeAxis(deg(Math.atan2(v.j45D, v.j0D)) / 2);
  return {
    maxD: clean(v.mD + J),
    minD: clean(v.mD - J),
    maxMeridianDeg: thetaMax,
    minMeridianDeg: normalizeAxis(thetaMax + 90),
    spherical: false,
  };
}

/** Matrix → spherocylinder in the requested convention. */
export function fromMatrix(q: PowerMatrix, convention: CylConvention = 'minus', tol = EXACT_TOL_D): SpheroCyl {
  const p = principalMeridians(q, tol);
  if (p.spherical) return makeLens(p.maxD, 0, null);
  if (convention === 'minus') {
    // Axis is the meridian carrying the sphere-only power = the more positive meridian.
    return makeLens(p.maxD, p.minD - p.maxD, p.maxMeridianDeg);
  }
  return makeLens(p.minD, p.maxD - p.minD, p.minMeridianDeg);
}

export function transpose(rx: SpheroCyl): SpheroCyl {
  if (rx.cylinderD === 0 || rx.axisDeg === null) return makeLens(rx.sphereD, 0, null);
  return makeLens(rx.sphereD + rx.cylinderD, -rx.cylinderD, rx.axisDeg + 90);
}

export function convention(rx: SpheroCyl): CylConvention | 'sphere' {
  if (rx.cylinderD === 0) return 'sphere';
  return rx.cylinderD < 0 ? 'minus' : 'plus';
}

export function matricesEqual(a: PowerMatrix, b: PowerMatrix, tol = EXACT_TOL_D): boolean {
  return Math.abs(a.xxD - b.xxD) <= tol && Math.abs(a.xyD - b.xyD) <= tol && Math.abs(a.yyD - b.yyD) <= tol;
}

export function opticallyEquivalent(a: SpheroCyl, b: SpheroCyl, tol = EXACT_TOL_D): boolean {
  return matricesEqual(toMatrix(a), toMatrix(b), tol);
}

/** Largest absolute meridional difference of a residual matrix, and where it occurs. */
export function worstMeridian(residual: PowerMatrix): { errorD: number; meridianDeg: number } {
  const p = principalMeridians(residual, 1e-12);
  if (Math.abs(p.maxD) >= Math.abs(p.minD)) return { errorD: clean(p.maxD), meridianDeg: p.maxMeridianDeg };
  return { errorD: clean(p.minD), meridianDeg: p.minMeridianDeg };
}

// ---------------------------------------------------------------- formatting

export function fmtD(x: number, opts: { plano?: boolean; digits?: number } = {}): string {
  const digits = opts.digits ?? 2;
  const v = clean(Number(x.toFixed(digits)) === 0 ? 0 : x);
  if (v === 0) return opts.plano ? 'plano' : '0.00';
  const sign = v > 0 ? '+' : '−';
  return sign + Math.abs(v).toFixed(digits);
}

export function fmtAxis(a: number | null): string {
  if (a === null) return '';
  const n = normalizeAxis(a);
  const r = Math.round(n * 10) / 10;
  return Number.isInteger(r) ? String(r).padStart(3, '0') : r.toFixed(1).padStart(5, '0');
}

export function formatRx(rx: SpheroCyl): string {
  if (rx.cylinderD === 0 || rx.axisDeg === null) {
    return rx.sphereD === 0 ? 'plano DS' : `${fmtD(rx.sphereD)} DS`;
  }
  return `${fmtD(rx.sphereD, { plano: true })} / ${fmtD(rx.cylinderD)} × ${fmtAxis(rx.axisDeg)}`;
}

// ---------------------------------------------------------------- parsing

export interface ParseResult {
  ok: boolean;
  lens?: SpheroCyl;
  errors: string[];
  /** Interpretations made that a learner should confirm before submission. */
  warnings: string[];
  fields?: { sphere: string; cylinder: string; axis: string };
}

const MAX_ABS_D = 30;

export function normaliseRxText(raw: string): string {
  return raw
    .replace(/[−–—‒﹣－]/g, '-')
    .replace(/[×✕✖]/g, 'x')
    .replace(/[°º˚]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function parseNumber(tok: string, warnings: string[], label: string): number | null {
  let t = tok;
  if (/^[+-]?\d+,\d+$/.test(t)) {
    warnings.push(`Read the comma in ${label} "${tok}" as a decimal separator.`);
    t = t.replace(',', '.');
  }
  if (!/^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(t)) return null;
  const v = Number(t);
  return Number.isFinite(v) ? v : null;
}

/**
 * Parse a written spherocylinder without eval. Accepts e.g.
 *   "plano −4.00 × 180", "pl/-4.00x180", "-4.00 +4.00 x 90", "-2.00 DS", "+1,00 -3,00 x 045°".
 */
export function parseRx(raw: string): ParseResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (typeof raw !== 'string' || raw.trim() === '') return { ok: false, errors: ['Empty prescription.'], warnings };
  const s = normaliseRxText(raw);
  if (/[;=()<>{}[\]]|\bnan\b|\binf/.test(s)) return { ok: false, errors: ['Unrecognised characters in prescription.'], warnings };
  const NUM = '[+-]?(?:\\d+(?:[.,]\\d+)?|\\.\\d+)';
  const re = new RegExp(
    `^(plano|pl|${NUM})\\s*(?:dsph|ds|sph|d)?(?:(?:\\s*/\\s*|\\s+|(?=[+-]))(${NUM})\\s*(?:dcyl|dc|cyl|d)?\\s*(?:(?:x|@|axis)\\s*(${NUM}))?)?\\s*(?:ds)?$`,
  );
  const m = s.match(re);
  if (!m) {
    if (/^(plano|pl|[+-]?[\d.,]+)\s*(x|@|axis)\s*[\d.]+$/.test(s)) {
      return {
        ok: false,
        errors: ['Only one power was given before the axis, so it is ambiguous whether it is a sphere or a cylinder. Write sphere, cylinder and axis (e.g. plano / −4.00 × 180).'],
        warnings,
      };
    }
    return { ok: false, errors: ['Could not read this as SPH / CYL × AXIS. Example: plano / −4.00 × 180.'], warnings };
  }
  const [, sphTok, cylTok, axTok] = m;
  let sphere: number | null;
  if (sphTok === 'plano' || sphTok === 'pl') sphere = 0;
  else {
    sphere = parseNumber(sphTok, warnings, 'sphere');
    if (sphere !== null && sphere !== 0 && !/^[+-]/.test(sphTok)) warnings.push(`Sphere "${sphTok}" has no sign; read as plus. Write + or − explicitly.`);
  }
  if (sphere === null) errors.push(`Sphere "${sphTok}" is not a number.`);
  let cyl = 0;
  let axis: number | null = null;
  if (cylTok !== undefined) {
    const c = parseNumber(cylTok, warnings, 'cylinder');
    if (c === null) errors.push(`Cylinder "${cylTok}" is not a number.`);
    else {
      cyl = c;
      if (c !== 0 && !/^[+-]/.test(cylTok)) warnings.push(`Cylinder "${cylTok}" has no sign; read as plus. Write + or − explicitly.`);
    }
    if (axTok === undefined) {
      if (cyl !== 0) errors.push('A cylinder needs an axis (0–180°).');
    } else {
      const a = parseNumber(axTok, warnings, 'axis');
      if (a === null) errors.push(`Axis "${axTok}" is not a number.`);
      else if (a < 0 || a > 180) errors.push(`Axis ${a}° is outside 0–180°.`);
      else {
        axis = a;
        if (a === 0) warnings.push('Axis 0° is the same orientation as 180°; displayed as 180.');
      }
    }
  }
  if (sphere !== null && Math.abs(sphere) > MAX_ABS_D) errors.push(`Sphere magnitude above ${MAX_ABS_D} D is outside this teaching model.`);
  if (Math.abs(cyl) > MAX_ABS_D) errors.push(`Cylinder magnitude above ${MAX_ABS_D} D is outside this teaching model.`);
  if (cylTok !== undefined && cyl === 0 && axTok !== undefined) warnings.push('Zero cylinder: the axis is undefined and has been ignored.');
  if (errors.length || sphere === null) return { ok: false, errors, warnings };
  const lens = makeLens(sphere, cyl, axis);
  return {
    ok: true,
    lens,
    errors,
    warnings,
    fields: { sphere: fmtD(lens.sphereD, { plano: true }), cylinder: lens.cylinderD === 0 ? '—' : fmtD(lens.cylinderD), axis: fmtAxis(lens.axisDeg) || '—' },
  };
}

/** Validate structured numeric fields (UI form) into a lens. */
export function lensFromFields(sphere: string, cylinder: string, axis: string): ParseResult {
  const sph = sphere.trim() === '' ? 'plano' : sphere.trim();
  const cyl = cylinder.trim();
  const ax = axis.trim();
  const cylIsZero = cyl === '' || /^[+-]?0*(\.0*)?$/.test(normaliseRxText(cyl).replace(',', '.'));
  if (cylIsZero) {
    const r = parseRx(sph);
    if (ax !== '') r.warnings.push('No cylinder: the axis is undefined and has been ignored.');
    return r;
  }
  return parseRx(`${sph} ${cyl}${ax !== '' ? ` x ${ax}` : ''}`);
}

// ---------------------------------------------------------------- inverse problems

export interface PowerCross {
  meridianADeg: number;
  powerAD: number;
  meridianBDeg: number;
  powerBD: number;
}

export function fromPowerCross(pc: PowerCross, conv: CylConvention = 'minus'): { ok: true; lens: SpheroCyl } | { ok: false; error: string } {
  if (![pc.meridianADeg, pc.meridianBDeg, pc.powerAD, pc.powerBD].every(Number.isFinite)) return { ok: false, error: 'All power-cross fields must be finite numbers.' };
  if (Math.abs(orientationDiff(pc.meridianADeg, pc.meridianBDeg) - 90) > 1e-6) {
    return { ok: false, error: `Declared principal meridians ${pc.meridianADeg}° and ${pc.meridianBDeg}° are not orthogonal; a regular power cross needs meridians 90° apart.` };
  }
  // F(A) = S, F(A+90) = S + C with A = meridian A.
  const lens = makeLens(pc.powerAD, pc.powerBD - pc.powerAD, pc.meridianADeg);
  return { ok: true, lens: fromMatrix(toMatrix(lens), conv) };
}

export function toPowerCross(rx: SpheroCyl): PowerCross {
  const p = principalMeridians(toMatrix(rx));
  return { meridianADeg: p.maxMeridianDeg, powerAD: p.maxD, meridianBDeg: p.minMeridianDeg, powerBD: p.minD };
}

export interface Sample {
  thetaDeg: number;
  powerD: number;
}

export type FitResult =
  | { status: 'unique'; vector: PowerVector; lens: SpheroCyl; rmsResidualD: number; distinctMeridians: number; exact: boolean }
  | { status: 'underdetermined'; distinctMeridians: number; reason: string }
  | { status: 'invalid'; reason: string };

/** Fit F(θ) = M + J0 cos2θ + J45 sin2θ by least squares after a rank check. */
export function fitMeridionalSamples(samples: Sample[]): FitResult {
  if (!samples.length) return { status: 'invalid', reason: 'No samples.' };
  if (!samples.every((s) => Number.isFinite(s.thetaDeg) && Number.isFinite(s.powerD))) return { status: 'invalid', reason: 'Non-finite sample.' };
  const distinct: number[] = [];
  for (const s of samples) {
    const o = orientation(s.thetaDeg);
    if (!distinct.some((d) => orientationDiff(d, o) < 1e-6)) distinct.push(o);
  }
  if (distinct.length < 3) {
    return {
      status: 'underdetermined',
      distinctMeridians: distinct.length,
      reason: `Only ${distinct.length} distinct meridian${distinct.length === 1 ? '' : 's'} (opposite directions are the same meridian). Three unknowns (M, J0, J45) need at least three distinct meridians; infinitely many lenses fit these samples unless the meridians are declared principal.`,
    };
  }
  // Normal equations AᵀA x = Aᵀb, solved by Cramer's rule (3×3).
  const rows = samples.map((s) => [1, Math.cos(rad(2 * s.thetaDeg)), Math.sin(rad(2 * s.thetaDeg))]);
  const N = [0, 1, 2].map((i) => [0, 1, 2].map((j) => rows.reduce((acc, r) => acc + r[i] * r[j], 0)));
  const rhs = [0, 1, 2].map((i) => rows.reduce((acc, r, k) => acc + r[i] * samples[k].powerD, 0));
  const det3 = (m: number[][]) =>
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
  const D = det3(N);
  if (Math.abs(D) < 1e-9) return { status: 'underdetermined', distinctMeridians: distinct.length, reason: 'Sample geometry is numerically singular.' };
  const x = [0, 1, 2].map((c) => det3(N.map((row, i) => row.map((v, j) => (j === c ? rhs[i] : v)))) / D);
  const vector = { mD: x[0], j0D: x[1], j45D: x[2] };
  const res = samples.map((s, k) => s.powerD - (x[0] * rows[k][0] + x[1] * rows[k][1] + x[2] * rows[k][2]));
  const rms = Math.sqrt(res.reduce((a, r) => a + r * r, 0) / res.length);
  return {
    status: 'unique',
    vector,
    lens: fromMatrix(vectorToMatrix(vector)),
    rmsResidualD: clean(rms, 1e-9),
    distinctMeridians: distinct.length,
    exact: rms < 1e-6,
  };
}

// ---------------------------------------------------------------- classification

export type RefractiveClass =
  | 'emmetropic'
  | 'spherical-myopia'
  | 'spherical-hyperopia'
  | 'simple-myopic-astigmatism'
  | 'compound-myopic-astigmatism'
  | 'simple-hyperopic-astigmatism'
  | 'compound-hyperopic-astigmatism'
  | 'mixed-astigmatism';

export const CLASS_LABEL: Record<RefractiveClass, string> = {
  emmetropic: 'Emmetropic distance refractive state (in the stated model)',
  'spherical-myopia': 'Spherical myopia',
  'spherical-hyperopia': 'Spherical hyperopia',
  'simple-myopic-astigmatism': 'Simple myopic astigmatism',
  'compound-myopic-astigmatism': 'Compound myopic astigmatism',
  'simple-hyperopic-astigmatism': 'Simple hyperopic astigmatism',
  'compound-hyperopic-astigmatism': 'Compound hyperopic astigmatism',
  'mixed-astigmatism': 'Mixed astigmatism',
};

export type ClassContext = 'lens-only' | 'full-distance-correction-relaxed';

export type ClassResult =
  | { status: 'insufficient-context'; reason: string }
  | { status: 'classified'; cls: RefractiveClass; principal: [number, number] };

export function classify(rx: SpheroCyl, context: ClassContext, tol = EXACT_TOL_D): ClassResult {
  if (context !== 'full-distance-correction-relaxed') {
    return {
      status: 'insufficient-context',
      reason: 'An isolated lens does not establish a refractive diagnosis. State that it is the complete distance correction of a regular eye with accommodation relaxed first.',
    };
  }
  const p = principalMeridians(toMatrix(rx), tol);
  const a = Math.abs(p.maxD) < tol ? 0 : p.maxD;
  const b = Math.abs(p.minD) < tol ? 0 : p.minD;
  const sgn = (x: number) => (x === 0 ? 0 : x > 0 ? 1 : -1);
  let cls: RefractiveClass;
  if (p.spherical || Math.abs(a - b) < tol) cls = a === 0 ? 'emmetropic' : a < 0 ? 'spherical-myopia' : 'spherical-hyperopia';
  else if (sgn(a) * sgn(b) < 0) cls = 'mixed-astigmatism';
  else if (a === 0 || b === 0) cls = (a === 0 ? b : a) < 0 ? 'simple-myopic-astigmatism' : 'simple-hyperopic-astigmatism';
  else cls = a < 0 ? 'compound-myopic-astigmatism' : 'compound-hyperopic-astigmatism';
  return { status: 'classified', cls, principal: [clean(a), clean(b)] };
}

/**
 * Orientation of the correcting minus-cylinder axis as WTR / ATR / oblique.
 * Convention (declared, common teaching convention): minus-cyl axis within ±30° of 180 → with-the-rule;
 * within ±30° of 090 → against-the-rule; otherwise oblique. This describes the written correcting
 * cylinder, not corneal topography.
 */
export function astigmatismOrientation(rx: SpheroCyl): 'none' | 'with-the-rule' | 'against-the-rule' | 'oblique' {
  if (rx.cylinderD === 0) return 'none';
  const minus = rx.cylinderD < 0 ? rx : transpose(rx);
  const a = orientation(minus.axisDeg!);
  if (orientationDiff(a, 0) <= 30) return 'with-the-rule';
  if (orientationDiff(a, 90) <= 30) return 'against-the-rule';
  return 'oblique';
}

// ---------------------------------------------------------------- grading & misconceptions

export interface GradeResult {
  opticallyEquivalent: boolean;
  notation: 'as-requested' | 'other-convention' | 'not-applicable';
  residual: PowerMatrix;
  worst: { errorD: number; meridianDeg: number };
  discrepancies: { meridianDeg: number; proposalD: number; targetD: number }[];
  hypotheses: { id: string; message: string }[];
}

export const PROBE_MERIDIANS = [180, 30, 45, 60, 90, 120, 135, 150];

export function gradeLens(proposal: SpheroCyl, target: SpheroCyl, requested: CylConvention | 'any' = 'any', tol = EXACT_TOL_D): GradeResult {
  const qp = toMatrix(proposal);
  const qt = toMatrix(target);
  const residual = subMatrices(qp, qt);
  const eq = matricesEqual(qp, qt, tol);
  const conv = convention(proposal);
  let notation: GradeResult['notation'] = 'not-applicable';
  if (requested !== 'any' && convention(target) !== 'sphere') notation = conv === requested ? 'as-requested' : 'other-convention';
  const discrepancies = PROBE_MERIDIANS.map((m) => ({ meridianDeg: m, proposalD: meridionalPowerQ(qp, m), targetD: meridionalPowerQ(qt, m) }));
  return { opticallyEquivalent: eq, notation, residual, worst: worstMeridian(residual), discrepancies, hypotheses: eq ? [] : diagnoseMisconceptions(proposal, target, tol) };
}

/** Hypotheses only — patterns consistent with a known misconception, not a claim about the learner's mind. */
export function diagnoseMisconceptions(proposal: SpheroCyl, target: SpheroCyl, tol = 1e-6): { id: string; message: string }[] {
  const out: { id: string; message: string }[] = [];
  const same = (a: SpheroCyl, b: SpheroCyl) => opticallyEquivalent(a, b, tol);
  const T = target;
  const qp = toMatrix(proposal);
  const qt = toMatrix(T);
  const pt = principalMeridians(qt);
  const se = sphericalEquivalent(T);
  if (T.cylinderD !== 0 && T.axisDeg !== null) {
    if (proposal.cylinderD === 0 && Math.abs(proposal.sphereD - se) < tol)
      out.push({ id: 'M-SE-AS-EQUIVALENT', message: `Your lens equals the spherical equivalent (${fmtD(se)} D). It matches the average power but not the directional correction: it is wrong by ${fmtD(pt.maxD - se)} D and ${fmtD(pt.minD - se)} D in the two principal meridians.` });
    if (proposal.cylinderD === 0 && (Math.abs(proposal.sphereD - pt.minD) < tol || Math.abs(proposal.sphereD - pt.maxD) < tol))
      out.push({ id: 'M-CYL-AS-SPHERE', message: `A sphere of ${fmtD(proposal.sphereD)} D supplies that power in every meridian, but the target has ${fmtD(pt.maxD)} D at ${fmtAxis(pt.maxMeridianDeg)}° and ${fmtD(pt.minD)} D at ${fmtAxis(pt.minMeridianDeg)}°.` });
    if (same(proposal, makeLens(T.sphereD, T.cylinderD, T.axisDeg + 90)))
      out.push({ id: 'M-AXIS-VS-MERIDIAN', message: `Same sphere and cylinder, axis turned 90°. You moved the meridian with sphere-only power from ${fmtAxis(T.axisDeg)}° to ${fmtAxis(T.axisDeg + 90)}°. The axis is where the cylinder adds no power; full cylinder power lies 90° away.` });
    if (same(proposal, makeLens(T.sphereD + T.cylinderD, -T.cylinderD, T.axisDeg)))
      out.push({ id: 'M-AXIS-NOT-ROTATED', message: 'Sphere and cylinder sign were transposed correctly but the axis was not rotated by 90°.' });
    if (same(proposal, makeLens(T.sphereD, -T.cylinderD, T.axisDeg)) || same(proposal, makeLens(T.sphereD, -T.cylinderD, T.axisDeg + 90)))
      out.push({ id: 'M-SIGN-ONLY-TRANSPOSE', message: 'Only the cylinder sign (and possibly axis) changed; the sphere must also change by the cylinder value (S → S + C).' });
    // Principal power copied as cylinder: written as S = one principal power, C = the other principal power.
    for (const [sp, cp, ax] of [
      [pt.maxD, pt.minD, pt.maxMeridianDeg],
      [pt.minD, pt.maxD, pt.minMeridianDeg],
    ] as const) {
      if (Math.abs(cp) > tol && same(proposal, makeLens(sp, cp, ax)))
        out.push({ id: 'M-PRINCIPAL-AS-CYL', message: `You wrote the second principal power (${fmtD(cp)} D) as the cylinder. The cylinder is the difference between principal powers (${fmtD(pt.minD - pt.maxD)} D in minus form).` });
    }
    const at0 = Math.abs(meridionalPowerQ(qp, 180) - meridionalPowerQ(qt, 180)) < tol;
    const at90 = Math.abs(meridionalPowerQ(qp, 90) - meridionalPowerQ(qt, 90)) < tol;
    if (at0 && at90) {
      const w = worstMeridian(subMatrices(qp, qt));
      out.push({ id: 'M-TWO-SAMPLES-FULL-RX', message: `Your lens matches the target at 90° and 180° only. At ${fmtAxis(w.meridianDeg)}° it differs by ${fmtD(w.errorD)} D. Two samples cannot fix three unknowns.` });
    }
  } else if (proposal.cylinderD !== 0) {
    out.push({ id: 'M-ZERO-CYL-AXIS', message: 'The target is spherical: there is no meaningful axis. Your cylinder adds directional power that is not needed.' });
  }
  return out;
}

// ---------------------------------------------------------------- reduced eye

export interface ReducedEye {
  /** Image-side refractive index n′. */
  nPrime: number;
  /** Distance from the common reference plane to the retina, metres (NOT a measured axial length). */
  retinaDistanceM: number;
}

export const DEFAULT_EYE: ReducedEye = { nPrime: 4 / 3, retinaDistanceM: (4 / 3) / 60 };

export interface FocalLine {
  /** Meridian whose rays converge at this plane. */
  convergingMeridianDeg: number;
  /** Orientation of the resulting line image — perpendicular to the converging meridian. */
  lineOrientationDeg: number;
  vergenceD: number;
  kind: 'real' | 'infinity' | 'virtual';
  depthM: number | null;
}

export interface EyeState {
  effective: PowerMatrix;
  lines: [FocalLine, FocalLine];
  spherical: boolean;
  colcDepthM: number | null;
  retinaDepthM: number;
}

/** Qeye = Dret·I − Qtarget (target = complete correcting lens in the same plane). */
export function eyeMatrixFromCorrection(target: SpheroCyl, eye: ReducedEye = DEFAULT_EYE): PowerMatrix {
  const dret = eye.nPrime / eye.retinaDistanceM;
  return subMatrices(scalarMatrix(dret), toMatrix(target));
}

export function objectVergenceD(distanceM: number | 'infinity'): number {
  if (distanceM === 'infinity') return 0;
  if (!(distanceM > 0)) throw new Error('Object distance must be positive.');
  return -1 / distanceM;
}

export function eyeState(
  target: SpheroCyl,
  trial: SpheroCyl,
  opts: { objectDistanceM?: number | 'infinity'; accommodationD?: number; eye?: ReducedEye } = {},
): EyeState {
  const eye = opts.eye ?? DEFAULT_EYE;
  const L = objectVergenceD(opts.objectDistanceM ?? 'infinity');
  const a = opts.accommodationD ?? 0;
  const eff = addMatrices(eyeMatrixFromCorrection(target, eye), toMatrix(trial), scalarMatrix(L + a));
  const p = principalMeridians(eff, 1e-9);
  const mk = (lambda: number, merid: number): FocalLine => {
    const kind = Math.abs(lambda) < 1e-9 ? 'infinity' : lambda > 0 ? 'real' : 'virtual';
    return {
      convergingMeridianDeg: merid,
      lineOrientationDeg: normalizeAxis(merid + 90),
      vergenceD: clean(lambda),
      kind,
      depthM: kind === 'real' ? eye.nPrime / lambda : null,
    };
  };
  const lines: [FocalLine, FocalLine] = [mk(p.maxD, p.maxMeridianDeg), mk(p.minD, p.minMeridianDeg)];
  const colc = p.maxD > 0 && p.minD > 0 ? (2 * eye.nPrime) / (p.maxD + p.minD) : null;
  return { effective: eff, lines, spherical: p.spherical, colcDepthM: colc, retinaDepthM: eye.retinaDistanceM };
}

/** Geometric blur ellipse semi-axes at depth z for pupil radius r0 (same units as r0). */
export function blurEllipseAt(state: EyeState, zM: number, r0: number, nPrime = DEFAULT_EYE.nPrime) {
  return state.lines.map((l) => ({
    meridianDeg: l.convergingMeridianDeg,
    semiAxis: Math.abs(r0 * (1 - (zM * l.vergenceD) / nPrime)),
  }));
}

// ---------------------------------------------------------------- retinoscopy

export type ReflexMotion = 'with' | 'against' | 'neutral';

export interface RetinoscopyObservation {
  measuredMeridianDeg: number;
  grossNeutralD: number;
  trialD: number;
  residualD: number;
  motion: ReflexMotion;
  /** 0 (dim/slow) … 1 (bright/fast) — schematic teaching cue, not a measurement. */
  brightness: number;
  /** Streak not aligned with a principal meridian of the residual astigmatism. */
  breakPhenomenon: boolean;
}

export const NEUTRAL_TOL_D = 0.125;

/**
 * Plane-mirror static retinoscopy, accommodation relaxed (declared model).
 * Streak orientation φ is swept perpendicular to itself; measured meridian = φ + 90°.
 */
export function retinoscopy(
  target: SpheroCyl,
  trial: SpheroCyl,
  streakDeg: number,
  workingDistanceM: number,
  neutralTolD = NEUTRAL_TOL_D,
): RetinoscopyObservation {
  if (!(workingDistanceM > 0)) throw new Error('Working distance must be positive.');
  const measured = normalizeAxis(streakDeg + 90);
  const R = meridionalPower(target, measured);
  const G = R + 1 / workingDistanceM;
  const T = meridionalPower(trial, measured);
  const res = clean(G - T, 1e-9);
  const motion: ReflexMotion = Math.abs(res) <= neutralTolD ? 'neutral' : res > 0 ? 'with' : 'against';
  const resQ = subMatrices(addMatrices(toMatrix(target), scalarMatrix(1 / workingDistanceM)), toMatrix(trial));
  const rp = principalMeridians(resQ, 1e-6);
  const breakPh = !rp.spherical && rp.maxD - rp.minD > 0.25 && orientationDiff(measured, rp.maxMeridianDeg) > 5 && orientationDiff(measured, rp.minMeridianDeg) > 5;
  return {
    measuredMeridianDeg: measured,
    grossNeutralD: clean(G, 1e-9),
    trialD: T,
    residualD: res,
    motion,
    brightness: motion === 'neutral' ? 1 : Math.max(0.15, 1 - Math.min(Math.abs(res), 6) / 6),
    breakPhenomenon: breakPh,
  };
}

export function workingDistanceLensD(workingDistanceM: number): number {
  return 1 / workingDistanceM;
}

/** Gross → net: subtract working-distance power from sphere (both principal powers) unless already in the frame. */
export function grossToNet(gross: SpheroCyl, workingDistanceM: number, wdLensAlreadyIncluded: boolean): SpheroCyl {
  if (wdLensAlreadyIncluded) return makeLens(gross.sphereD, gross.cylinderD, gross.axisDeg);
  return makeLens(gross.sphereD - 1 / workingDistanceM, gross.cylinderD, gross.axisDeg);
}

export function netToGross(net: SpheroCyl, workingDistanceM: number): SpheroCyl {
  return makeLens(net.sphereD + 1 / workingDistanceM, net.cylinderD, net.axisDeg);
}

// ---------------------------------------------------------------- Jackson cross-cylinder

/** A ±p JCC: +p in one principal meridian, −p in the other; returned in minus-cyl form. */
export function jcc(pD: number, minusAxisDeg: number): SpheroCyl {
  // minus-cyl axis carries the +p meridian; 90° away is −p.
  return makeLens(pD, -2 * pD, minusAxisDeg);
}

/** Thibos blur strength of a residual — a DECLARED teaching metric, not an acuity predictor. */
export function blurStrength(q: PowerMatrix): number {
  const v = matrixToVector(q);
  return Math.sqrt(v.mD * v.mD + v.j0D * v.j0D + v.j45D * v.j45D);
}

export type Preference = 'first' | 'second' | 'same';

/** Fictional patient compares view 1 vs view 2 by residual blur strength with a declared tie zone. */
export function patientPreference(target: SpheroCyl, view1: PowerMatrix, view2: PowerMatrix, tieD = 0.04): Preference {
  const qt = toMatrix(target);
  const b1 = blurStrength(subMatrices(view1, qt));
  const b2 = blurStrength(subMatrices(view2, qt));
  if (Math.abs(b1 - b2) <= tieD) return 'same';
  return b1 < b2 ? 'first' : 'second';
}

// ---------------------------------------------------------------- extensions

/** Vertex conversion applied to both principal powers; d>0 moves the lens closer to the eye by d metres. */
export function vertexConvert(rx: SpheroCyl, dM: number): { ok: true; lens: SpheroCyl } | { ok: false; error: string } {
  const p = principalMeridians(toMatrix(rx));
  const conv = (F: number) => {
    const den = 1 - dM * F;
    if (Math.abs(den) < 1e-6) return NaN;
    return F / den;
  };
  const a = conv(p.maxD);
  const b = conv(p.minD);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return { ok: false, error: 'Singular: the focal point coincides with the new lens plane.' };
  const res = fromPowerCross({ meridianADeg: p.maxMeridianDeg, powerAD: a, meridianBDeg: p.minMeridianDeg, powerBD: b }, rx.cylinderD > 0 ? 'plus' : 'minus');
  return res.ok ? { ok: true, lens: res.lens } : { ok: false, error: res.error };
}

/** Prentice's rule for a spherical lens: prism dioptres = decentration (cm) × power (D). */
export function prenticePrismDioptres(decentrationCm: number, powerD: number): number {
  return Math.abs(decentrationCm * powerD);
}

/** Near addition alters sphere only in the simplified representation. */
export function addNear(rx: SpheroCyl, addD: number): SpheroCyl {
  return makeLens(rx.sphereD + addD, rx.cylinderD, rx.axisDeg);
}

// ---------------------------------------------------------------- acuity notation

export function decimalAcuity(numerator: number, denominator: number): number {
  if (!(numerator > 0 && denominator > 0)) throw new Error('Acuity fraction must be positive.');
  return numerator / denominator;
}

export function logMAR(decimal: number): number {
  if (!(decimal > 0)) throw new Error('Decimal acuity must be positive.');
  return clean(-Math.log10(decimal), 1e-12);
}
