/**
 * Optics task families. A family is a reasoning structure; seeds produce numerical variants.
 * Numerical variants within a family are NOT independent transfer evidence — held-out families
 * (pool 'exam') use different task structures.
 */
import {
  CLASS_LABEL, type CylConvention, type RefractiveClass, type SpheroCyl, classify, eyeState, fmtAxis, fmtD, formatRx,
  fromMatrix, fromPowerCross, gradeLens, makeLens, meridionalPower, addMatrices, subMatrices, toMatrix, toPowerCross,
  transpose, sphericalEquivalent, addNear, opticallyEquivalent, normalizeAxis,
} from './optics';
import { rng } from './random';

export const ANSWER_TOL_D = 0.005; // answer-rounding tolerance for quarter-step answers (not a dispensing standard)
export const NUMBER_TOL_D = 0.01; // two-decimal meridional predictions

export const OPTICS_OBJECTIVES: Record<string, { text: string; lectureIds: string[] }> = {
  'OPT-MERIDIAN': { text: 'Predict the meridional power of a spherocylinder at any meridian.', lectureIds: ['L03', 'L05'] },
  'OPT-WRITE': { text: 'Write a spherocylindrical prescription from a declared power cross, and vice versa.', lectureIds: ['L05'] },
  'OPT-TRANSPOSE': { text: 'Transpose between plus- and minus-cylinder notation without changing the lens.', lectureIds: ['L05'] },
  'OPT-SE': { text: 'Distinguish spherical equivalent from an optically equivalent correction.', lectureIds: ['L05', 'L04'] },
  'OPT-CLASSIFY': { text: 'Classify a refractive state from both principal powers, only in a stated full-correction context.', lectureIds: ['L04'] },
  'OPT-SUFFICIENT': { text: 'Decide whether meridional data are sufficient to determine a lens uniquely.', lectureIds: ['L05', 'L03'] },
  'OPT-COMPOSE': { text: 'Combine and compare thin lenses in the same plane using power matrices.', lectureIds: ['L03', 'L05'] },
  'OPT-RETINOSCOPY': { text: 'Convert gross retinoscopy findings to net refraction without double subtraction.', lectureIds: ['L06'] },
  'OPT-NEAR': { text: 'Apply a near addition while preserving cylinder and axis.', lectureIds: ['L04', 'L06'] },
  'OPT-FOCI': { text: 'Place the two line foci relative to the retina for each refractive category.', lectureIds: ['L03', 'L04'] },
};

export type AnswerKind = 'number' | 'rx' | 'choice' | 'cross';

export type TaskResponse =
  | { kind: 'number'; value: number }
  | { kind: 'rx'; lens: SpheroCyl; text?: string }
  | { kind: 'choice'; value: string }
  | { kind: 'cross'; m1: number; p1: number; m2: number; p2: number };

export interface TaskGrade {
  correct: boolean;
  scores: Record<string, boolean | number | string>;
  feedback: string[];
  misconceptionIds: string[];
  /** Lens implied by the response, for overlaying on the canvas. */
  proposal?: SpheroCyl;
}

export interface OpticsTask {
  familyId: string;
  itemId: string;
  itemVersion: number;
  seed: number;
  title: string;
  prompt: string;
  kind: AnswerKind;
  choices?: { value: string; label: string }[];
  /** Hidden target model used for grading and (after submission) for overlays. */
  target?: SpheroCyl;
  /** What the canvas may show while answering. */
  display: { lens?: SpheroCyl; hideLabels: boolean; probeDeg?: number; note?: string };
  requested?: CylConvention | 'any';
  objectiveIds: string[];
  lectureIds: string[];
  isTransfer: boolean;
  pool: 'practice' | 'exam';
  taskType: string;
  hints: [string, string, string];
  explanation: string;
  grade(r: TaskResponse): TaskGrade;
}

export interface Family {
  id: string;
  title: string;
  pool: 'practice' | 'exam';
  objectiveIds: string[];
  taskType: string;
  make(seed: number): OpticsTask;
}

const AXES = [180, 90, 45, 135, 30, 60, 120, 150, 15, 165, 75, 105, 10, 170, 20, 160];
const OBLIQUE = [45, 135, 30, 60, 120, 150, 15, 165, 75, 105, 20, 160, 35, 145];

function genLens(seed: number, opts: { oblique?: boolean; minusCyl?: boolean; sph?: [number, number] } = {}): SpheroCyl {
  const r = rng(seed);
  const [lo, hi] = opts.sph ?? [-4, 3];
  const S = r.quarter(lo, hi);
  const Cmag = r.quarter(0.5, 4);
  const C = opts.minusCyl === false ? Cmag : -Cmag;
  const A = r.pick(opts.oblique ? OBLIQUE : AXES);
  return makeLens(S, C, A);
}

function lectureIdsFor(objs: string[]) {
  return [...new Set(objs.flatMap((o) => OPTICS_OBJECTIVES[o].lectureIds))];
}

function rxGrade(target: SpheroCyl, requested: CylConvention | 'any', r: TaskResponse): TaskGrade {
  if (r.kind !== 'rx') return { correct: false, scores: {}, feedback: ['Enter a prescription.'], misconceptionIds: [] };
  const g = gradeLens(r.lens, target, requested, ANSWER_TOL_D);
  const fb: string[] = [];
  const ok = g.opticallyEquivalent && g.notation !== 'other-convention';
  if (g.opticallyEquivalent) {
    fb.push('Optically equivalent to the target: the power matrix matches in every meridian.');
    if (g.notation === 'other-convention') fb.push(`Optically correct but not in the requested ${requested}-cylinder notation. Transpose: ${formatRx(requested === 'plus' ? fromMatrix(toMatrix(target), 'plus') : fromMatrix(toMatrix(target), 'minus'))}.`);
  } else {
    fb.push(`Not equivalent. Largest discrepancy: ${fmtD(g.worst.errorD)} D at ${fmtAxis(g.worst.meridianDeg)}° (your lens minus target).`);
    for (const h of g.hypotheses) fb.push(h.message);
  }
  return {
    correct: ok,
    scores: { opticallyEquivalent: g.opticallyEquivalent, notation: g.notation, worstErrorD: Number(g.worst.errorD.toFixed(3)) },
    feedback: fb,
    misconceptionIds: g.hypotheses.map((h) => h.id),
    proposal: r.lens,
  };
}

function choiceGrade(correctValue: string, r: TaskResponse, right: string, wrong: Record<string, { msg: string; mis?: string }>): TaskGrade {
  if (r.kind !== 'choice') return { correct: false, scores: {}, feedback: ['Choose an answer.'], misconceptionIds: [] };
  if (r.value === correctValue) return { correct: true, scores: { choice: r.value }, feedback: [right], misconceptionIds: [] };
  const w = wrong[r.value];
  return { correct: false, scores: { choice: r.value }, feedback: [w?.msg ?? 'Not supported by the data given.', right], misconceptionIds: w?.mis ? [w.mis] : [] };
}

const CLASS_CHOICES = (Object.keys(CLASS_LABEL) as RefractiveClass[]).map((k) => ({ value: k, label: CLASS_LABEL[k] }));
const CANNOT = { value: 'cannot-establish', label: 'Cannot be established from the isolated lens' };

function classWrongMap(target: SpheroCyl): Record<string, { msg: string; mis?: string }> {
  const pc = toPowerCross(target);
  const m: Record<string, { msg: string; mis?: string }> = {};
  for (const c of CLASS_CHOICES) m[c.value] = { msg: `The principal corrective powers are ${fmtD(pc.powerAD)} D and ${fmtD(pc.powerBD)} D; ${CLASS_LABEL[c.value as RefractiveClass].toLowerCase()} requires a different combination.` };
  m['simple-myopic-astigmatism'].mis = 'M-SIMPLE-VS-COMPOUND';
  m['compound-myopic-astigmatism'].mis = 'M-SIMPLE-VS-COMPOUND';
  m['spherical-myopia'].mis = 'M-SE-AS-EQUIVALENT';
  m['emmetropic'].mis = 'M-MIXED-ZERO-SE';
  m[CANNOT.value] = { msg: 'Here the full-distance-correction context is stated, so classification is supported.' };
  return m;
}

function base(fam: Omit<Family, 'make'>, seed: number) {
  return {
    familyId: fam.id,
    itemId: `${fam.id}#${seed}`,
    itemVersion: 1,
    seed,
    objectiveIds: fam.objectiveIds,
    lectureIds: lectureIdsFor(fam.objectiveIds),
    isTransfer: fam.pool === 'exam',
    pool: fam.pool,
    taskType: fam.taskType,
  };
}

function def(f: Omit<Family, 'make'>, make: (b: ReturnType<typeof base>, seed: number) => Omit<OpticsTask, keyof ReturnType<typeof base>>): Family {
  return { ...f, make: (seed) => ({ ...base(f, seed), ...make(base(f, seed), seed) }) };
}

export const FAMILIES: Family[] = [
  def({ id: 'F-MERID-PREDICT', title: 'Predict a meridional power', pool: 'practice', objectiveIds: ['OPT-MERIDIAN'], taskType: 'numerical-production' }, (_, seed) => {
    const r = rng(seed);
    const A = r.pick([180, 90]);
    const t = makeLens(r.quarter(-3, 2), -r.quarter(1, 4), A);
    const theta = normalizeAxis(A + r.pick([30, 45, 60, 90]));
    const ans = meridionalPower(t, theta);
    return {
      title: 'Predict a meridional power',
      prompt: `Lens ${formatRx(t)}. Predict the total power in the ${fmtAxis(theta)}° meridian (to two decimals).`,
      kind: 'number', target: t, display: { lens: t, hideLabels: true, probeDeg: theta },
      hints: ['How far is this meridian from the axis? The cylinder adds nothing at the axis and its full value 90° away.', `Angle from axis = ${orientationDelta(theta, A)}°; sin² of that angle = ${(Math.sin((orientationDelta(theta, A) * Math.PI) / 180) ** 2).toFixed(3)}.`, `F = S + C·sin²(θ−A) = ${fmtD(t.sphereD)} + (${fmtD(t.cylinderD)})·${(Math.sin((orientationDelta(theta, A) * Math.PI) / 180) ** 2).toFixed(3)} = ${fmtD(ans)} D.`],
      explanation: `F(θ) = S + C·sin²(θ − A). At ${fmtAxis(theta)}° this gives ${fmtD(ans)} D.`,
      grade: (resp) => numberGrade(ans, resp, t, theta),
    };
  }),
  def({ id: 'F-MERID-OBLIQUE', title: 'Meridional power, oblique axis', pool: 'practice', objectiveIds: ['OPT-MERIDIAN'], taskType: 'numerical-production' }, (_, seed) => {
    const r = rng(seed);
    const t = genLens(seed, { oblique: true });
    const theta = r.pick([0, 90, 45, 135, 30, 60, 120, 150].filter((x) => orientationDelta(x, t.axisDeg!) !== 0));
    const ans = meridionalPower(t, theta);
    return {
      title: 'Meridional power, oblique axis',
      prompt: `Lens ${formatRx(t)}. What is the power in the ${fmtAxis(theta)}° meridian? Two decimals.`,
      kind: 'number', target: t, display: { lens: t, hideLabels: true, probeDeg: theta },
      hints: ['Measure the angle between the probe meridian and the axis — not between the probe and horizontal.', `The angle from the axis is ${orientationDelta(theta, t.axisDeg!)}°.`, `F = ${fmtD(t.sphereD)} + (${fmtD(t.cylinderD)})·sin²(${orientationDelta(theta, t.axisDeg!)}°) = ${fmtD(ans)} D.`],
      explanation: `Oblique axes behave the same way: only the angle from the axis matters. F(${fmtAxis(theta)}°) = ${fmtD(ans)} D.`,
      grade: (resp) => numberGrade(ans, resp, t, theta),
    };
  }),
  def({ id: 'F-CROSS-TO-RX', title: 'Power cross → prescription', pool: 'practice', objectiveIds: ['OPT-WRITE'], taskType: 'numerical-production' }, (_, seed) => {
    const t = genLens(seed);
    const pc = toPowerCross(t);
    return {
      title: 'Write the lens from a power cross',
      prompt: `Declared principal meridians: ${fmtD(pc.powerAD)} D at ${fmtAxis(pc.meridianADeg)}° and ${fmtD(pc.powerBD)} D at ${fmtAxis(pc.meridianBDeg)}°. Write the spherocylinder (either notation).`,
      kind: 'rx', target: t, requested: 'any', display: { hideLabels: true, note: 'Lens hidden until you submit.' },
      hints: ['Choose one principal meridian as the axis; its power is the sphere.', `If the axis is ${fmtAxis(pc.meridianADeg)}°, sphere = ${fmtD(pc.powerAD)}. The cylinder is the difference to the other meridian.`, `Cylinder = ${fmtD(pc.powerBD)} − (${fmtD(pc.powerAD)}) = ${fmtD(pc.powerBD - pc.powerAD)}: ${formatRx(t)}.`],
      explanation: `Sphere = power at the axis meridian; cylinder = the difference to the perpendicular meridian. ${formatRx(t)} ≡ ${formatRx(transpose(t))}.`,
      grade: (resp) => rxGrade(t, 'any', resp),
    };
  }),
  def({ id: 'F-CROSS-OBLIQUE', title: 'Oblique power cross → prescription', pool: 'practice', objectiveIds: ['OPT-WRITE'], taskType: 'numerical-production' }, (_, seed) => {
    const t = genLens(seed, { oblique: true });
    const pc = toPowerCross(t);
    return {
      title: 'Oblique power cross',
      prompt: `Principal meridians: ${fmtD(pc.powerAD)} D at ${fmtAxis(pc.meridianADeg)}°, ${fmtD(pc.powerBD)} D at ${fmtAxis(pc.meridianBDeg)}°. Write the lens in minus-cylinder form.`,
      kind: 'rx', target: t, requested: 'minus', display: { hideLabels: true },
      hints: ['In minus-cylinder form the axis is the more plus meridian.', `More plus: ${fmtD(pc.powerAD)} at ${fmtAxis(pc.meridianADeg)}° → sphere ${fmtD(pc.powerAD)}, axis ${fmtAxis(pc.meridianADeg)}.`, `Cylinder = ${fmtD(pc.powerBD - pc.powerAD)} → ${formatRx(t)}.`],
      explanation: `Minus-cylinder form: ${formatRx(t)}.`,
      grade: (resp) => rxGrade(t, 'minus', resp),
    };
  }),
  def({ id: 'F-RX-TO-CROSS', title: 'Prescription → power cross', pool: 'practice', objectiveIds: ['OPT-WRITE', 'OPT-MERIDIAN'], taskType: 'numerical-production' }, (_, seed) => {
    const t = genLens(seed, { minusCyl: rng(seed + 1).next() > 0.5 });
    const pc = toPowerCross(t);
    return {
      title: 'Fill the power cross',
      prompt: `Draw the power cross for ${formatRx(t)}: give both principal meridians and their total powers.`,
      kind: 'cross', target: t, display: { hideLabels: true },
      hints: ['The axis meridian carries the sphere only.', `At ${fmtAxis(t.axisDeg)}°: ${fmtD(t.sphereD)} D.`, `At ${fmtAxis(t.axisDeg! + 90)}°: ${fmtD(t.sphereD)} + (${fmtD(t.cylinderD)}) = ${fmtD(t.sphereD + t.cylinderD)} D.`],
      explanation: `${fmtD(pc.powerAD)} D at ${fmtAxis(pc.meridianADeg)}°, ${fmtD(pc.powerBD)} D at ${fmtAxis(pc.meridianBDeg)}°.`,
      grade: (resp) => {
        if (resp.kind !== 'cross') return { correct: false, scores: {}, feedback: ['Fill all four fields.'], misconceptionIds: [] };
        const built = fromPowerCross({ meridianADeg: resp.m1, powerAD: resp.p1, meridianBDeg: resp.m2, powerBD: resp.p2 });
        if (!built.ok) return { correct: false, scores: { orthogonal: false }, feedback: [built.error], misconceptionIds: [] };
        const g = rxGrade(t, 'any', { kind: 'rx', lens: built.lens });
        if (!g.correct && (Math.abs(resp.p2 - t.cylinderD) < ANSWER_TOL_D || Math.abs(resp.p1 - t.cylinderD) < ANSWER_TOL_D)) {
          g.feedback.push('You entered the cylinder value as a meridional power. The power 90° from the axis is sphere + cylinder.');
          g.misconceptionIds.push('M-SPHERE-FORGOTTEN');
        }
        return g;
      },
    };
  }),
  def({ id: 'F-TRANSPOSE-PLUS', title: 'Transpose to plus cylinder', pool: 'practice', objectiveIds: ['OPT-TRANSPOSE'], taskType: 'notation' }, (_, seed) => {
    const t = genLens(seed);
    const p = transpose(t);
    return {
      title: 'Transpose to plus cylinder',
      prompt: `Write ${formatRx(t)} in plus-cylinder notation.`,
      kind: 'rx', target: t, requested: 'plus', display: { lens: t, hideLabels: false },
      hints: ['Three changes: new sphere, cylinder sign, axis.', 'New sphere = old sphere + old cylinder; cylinder changes sign; axis rotates 90°.', `${fmtD(t.sphereD)} + (${fmtD(t.cylinderD)}) = ${fmtD(p.sphereD)}; ${fmtD(p.cylinderD)}; ${fmtAxis(t.axisDeg)} → ${fmtAxis(p.axisDeg)}: ${formatRx(p)}.`],
      explanation: `${formatRx(t)} ≡ ${formatRx(p)}. Transposition changes the description, not the lens.`,
      grade: (resp) => rxGrade(t, 'plus', resp),
    };
  }),
  def({ id: 'F-TRANSPOSE-MINUS', title: 'Transpose to minus cylinder', pool: 'practice', objectiveIds: ['OPT-TRANSPOSE'], taskType: 'notation' }, (_, seed) => {
    const t = genLens(seed, { minusCyl: false });
    const m = transpose(t);
    return {
      title: 'Transpose to minus cylinder',
      prompt: `Write ${formatRx(t)} in minus-cylinder notation.`,
      kind: 'rx', target: t, requested: 'minus', display: { lens: t, hideLabels: false },
      hints: ['Same three steps in reverse direction.', 'Sphere + cylinder; flip the cylinder sign; rotate the axis by 90°.', `${formatRx(m)}.`],
      explanation: `${formatRx(t)} ≡ ${formatRx(m)}.`,
      grade: (resp) => rxGrade(t, 'minus', resp),
    };
  }),
  def({ id: 'F-REPAIR-TRANSPOSE', title: 'Repair a faulty transposition', pool: 'exam', objectiveIds: ['OPT-TRANSPOSE'], taskType: 'error-correction' }, (_, seed) => {
    const t = genLens(seed);
    const r = rng(seed + 7);
    const kind = r.pick(['sign-only', 'no-rotate', 'no-sphere'] as const);
    const wrong = kind === 'sign-only' ? makeLens(t.sphereD, -t.cylinderD, t.axisDeg) : kind === 'no-rotate' ? makeLens(t.sphereD + t.cylinderD, -t.cylinderD, t.axisDeg) : makeLens(t.sphereD, -t.cylinderD, t.axisDeg! + 90);
    return {
      title: 'Repair a transposition',
      prompt: `A colleague transposed ${formatRx(t)} as ${formatRx(wrong)}. Write the correct plus-cylinder form.`,
      kind: 'rx', target: t, requested: 'plus', display: { hideLabels: true },
      hints: ['Check each of the three steps separately.', 'Which step was skipped: sphere change, sign change or axis rotation?', `Correct: ${formatRx(transpose(t))}.`],
      explanation: `${formatRx(t)} ≡ ${formatRx(transpose(t))}; the colleague's version is a different lens.`,
      grade: (resp) => rxGrade(t, 'plus', resp),
    };
  }),
  def({ id: 'F-SE-TRAP', title: 'Spherical equivalent trap', pool: 'practice', objectiveIds: ['OPT-SE'], taskType: 'conceptual-discrimination' }, (_, seed) => {
    const t = genLens(seed);
    const se = sphericalEquivalent(t);
    const pc = toPowerCross(t);
    return {
      title: 'Spherical equivalent',
      prompt: `For ${formatRx(t)}, the spherical equivalent is ${fmtD(se)} D. Does a ${fmtD(se)} DS lens provide the same correction?`,
      kind: 'choice', target: t, display: { lens: t, hideLabels: false },
      choices: [
        { value: 'no', label: `No — it matches only the average; it errs by ${fmtD(pc.powerAD - se)} / ${fmtD(pc.powerBD - se)} D in the principal meridians` },
        { value: 'yes', label: 'Yes — equal spherical equivalent means equivalent correction' },
        { value: 'only-axis', label: 'Yes, provided the axis is kept the same' },
      ],
      hints: ['Compare the two lenses meridian by meridian.', `Target principal powers: ${fmtD(pc.powerAD)} and ${fmtD(pc.powerBD)}.`, 'A sphere has the same power in every meridian, so it cannot match both.'],
      explanation: 'The spherical equivalent is the mean power M. Two lenses are equivalent only when M, J0 and J45 all match.',
      grade: (resp) => choiceGrade('no', resp, 'Correct: the SE matches M but not the astigmatic components J0/J45.', { yes: { msg: 'Equal mean power does not mean equal power in every meridian.', mis: 'M-SE-AS-EQUIVALENT' }, 'only-axis': { msg: 'A sphere has no axis; the directional component is missing.', mis: 'M-ZERO-CYL-AXIS' } }),
    };
  }),
  def({ id: 'F-CLASSIFY', title: 'Classify from principal powers', pool: 'practice', objectiveIds: ['OPT-CLASSIFY'], taskType: 'classification' }, (_, seed) => {
    const r = rng(seed);
    const pool: SpheroCyl[] = [makeLens(0, -r.quarter(0.75, 3), r.pick(AXES)), makeLens(-r.quarter(0.5, 3), -r.quarter(0.5, 2), r.pick(AXES)), makeLens(0, r.quarter(0.75, 3), r.pick(AXES)), makeLens(r.quarter(0.5, 3), r.quarter(0.5, 2), r.pick(AXES)), makeLens(r.quarter(0.5, 2), -r.quarter(2.75, 5), r.pick(AXES)), makeLens(-r.quarter(0.5, 4)), makeLens(r.quarter(0.5, 4))];
    const t = r.pick(pool);
    const c = classify(t, 'full-distance-correction-relaxed');
    const cls = c.status === 'classified' ? c.cls : 'emmetropic';
    const shown = r.next() > 0.5 && t.cylinderD !== 0 ? transpose(t) : t;
    return {
      title: 'Classify the refractive state',
      prompt: `Fictional patient: ${formatRx(shown)} is the complete distance correction of a regular eye with accommodation relaxed. Classify the distance refractive state.`,
      kind: 'choice', target: t, display: { lens: t, hideLabels: true }, choices: [...CLASS_CHOICES, CANNOT],
      hints: ['Ignore the notation: find both principal corrective powers.', `Principal powers: ${fmtD(toPowerCross(t).powerAD)} and ${fmtD(toPowerCross(t).powerBD)} D.`, `Signs of the two principal powers → ${CLASS_LABEL[cls]}.`],
      explanation: `Principal powers ${fmtD(toPowerCross(t).powerAD)} / ${fmtD(toPowerCross(t).powerBD)} D → ${CLASS_LABEL[cls]}.`,
      grade: (resp) => choiceGrade(cls, resp, `${CLASS_LABEL[cls]}: decided by both principal powers.`, classWrongMap(t)),
    };
  }),
  def({ id: 'F-CLASSIFY-CONTEXT', title: 'Lens or diagnosis?', pool: 'practice', objectiveIds: ['OPT-CLASSIFY'], taskType: 'conceptual-discrimination' }, (_, seed) => {
    const t = genLens(seed);
    return {
      title: 'Lens or diagnosis?',
      prompt: `A lens on the bench reads ${formatRx(t)}. Nothing else is known. What is the wearer's refractive diagnosis?`,
      kind: 'choice', target: t, display: { lens: t, hideLabels: false }, choices: [...CLASS_CHOICES, CANNOT],
      hints: ['What does a lens measurement tell you about the person?', 'Is it their current, complete, distance correction with accommodation relaxed?', 'Without that context, classification is unsupported.'],
      explanation: 'A measured lens establishes lens properties, not the wearer’s current refractive state, laterality or eye health.',
      grade: (resp) => choiceGrade(CANNOT.value, resp, 'Correct: the isolated lens does not establish a diagnosis.', Object.fromEntries(CLASS_CHOICES.map((c) => [c.value, { msg: 'This classifies the lens as if it were a known full correction. That context was not given.', mis: 'M-RX-VS-DIAGNOSIS' }]))),
    };
  }),
  def({ id: 'F-MIXED-ZERO-SE', title: 'Mixed astigmatism with zero SE', pool: 'exam', objectiveIds: ['OPT-CLASSIFY', 'OPT-SE'], taskType: 'classification' }, (_, seed) => {
    const r = rng(seed);
    const S = r.quarter(0.5, 2.5);
    const t = makeLens(S, -2 * S, r.pick(AXES));
    return {
      title: 'Zero spherical equivalent',
      prompt: `Full distance correction (accommodation relaxed): ${formatRx(transpose(t))}. Its spherical equivalent is ${fmtD(sphericalEquivalent(t))}. Classify.`,
      kind: 'choice', target: t, display: { hideLabels: true }, choices: [...CLASS_CHOICES, CANNOT],
      hints: ['SE zero does not mean both meridians are zero.', 'Compute both principal powers.', `They are ${fmtD(S)} and ${fmtD(-S)} → opposite signs.`],
      explanation: 'Opposite-signed principal powers define mixed astigmatism even when the mean is zero.',
      grade: (resp) => choiceGrade('mixed-astigmatism', resp, 'Mixed astigmatism: one meridian needs plus, the other minus.', classWrongMap(t)),
    };
  }),
  def({ id: 'F-ALIAS', title: '45° vs 135°', pool: 'practice', objectiveIds: ['OPT-MERIDIAN', 'OPT-SUFFICIENT'], taskType: 'conceptual-discrimination' }, (_, seed) => {
    const r = rng(seed);
    const C = -r.quarter(1, 4);
    const S = r.quarter(-2, 1);
    const a = makeLens(S, C, 45);
    const b = makeLens(S, C, 135);
    return {
      title: 'Same at 90° and 180° — same lens?',
      prompt: `Lens A: ${formatRx(a)}. Lens B: ${formatRx(b)}. Both read ${fmtD(meridionalPower(a, 180))} D at 180° and ${fmtD(meridionalPower(a, 90))} D at 90°. Are they the same lens?`,
      kind: 'choice', target: a, display: { lens: a, hideLabels: false, probeDeg: 45 },
      choices: [
        { value: 'no', label: `No — at 45° A has ${fmtD(meridionalPower(a, 45))} D and B has ${fmtD(meridionalPower(b, 45))} D` },
        { value: 'yes', label: 'Yes — they agree in the horizontal and vertical meridians' },
        { value: 'unknown', label: 'Cannot be decided from the written prescriptions' },
      ],
      hints: ['Two meridians cannot fix three unknowns.', 'Check the 45° meridian of each.', `A at 45°: ${fmtD(meridionalPower(a, 45))}; B: ${fmtD(meridionalPower(b, 45))}.`],
      explanation: 'J45 differs in sign. A grader using only 90°/180° would wrongly accept them as equal.',
      grade: (resp) => choiceGrade('no', resp, 'Different lenses: their oblique (J45) components are opposite.', { yes: { msg: 'They agree only at 90° and 180°.', mis: 'M-TWO-SAMPLES-FULL-RX' }, unknown: { msg: 'The written prescriptions fully specify both lenses; compare them at 45°.' } }),
    };
  }),
  def({ id: 'F-UNDERDETERMINED', title: 'Enough information?', pool: 'practice', objectiveIds: ['OPT-SUFFICIENT'], taskType: 'conceptual-discrimination' }, (_, seed) => {
    const r = rng(seed);
    const p180 = r.quarter(-3, 1);
    const p90 = p180 - r.quarter(0.5, 3);
    return {
      title: 'Enough information?',
      prompt: `An unknown lens measures ${fmtD(p180)} D in the 180° meridian and ${fmtD(p90)} D in the 90° meridian. Nobody says these are principal meridians. Can you write the lens?`,
      kind: 'choice', display: { hideLabels: true },
      choices: [
        { value: 'no', label: 'No — another distinct meridian (or a declaration that these are principal) is needed' },
        { value: 'yes', label: `Yes — ${formatRx(makeLens(p180, p90 - p180, 180))}` },
        { value: 'se', label: `Only the spherical equivalent ${fmtD((p180 + p90) / 2)} is unknown` },
      ],
      hints: ['How many unknowns does a regular spherocylinder have?', 'M, J0 and J45. Samples at 90° and 180° fix M and J0 only.', 'J45 is undetermined: many oblique lenses fit.'],
      explanation: 'With two meridional samples, J45 is free. Declared principal meridians, or a third distinct meridian, are required.',
      grade: (resp) => choiceGrade('no', resp, 'Correct: underdetermined.', { yes: { msg: 'That assumes the meridians are principal. An oblique lens can give the same two readings.', mis: 'M-TWO-SAMPLES-FULL-RX' }, se: { msg: 'The mean of the two samples is the mean power, but J45 remains unknown.' } }),
    };
  }),
  def({ id: 'F-FIT-THREE', title: 'Three meridians → lens', pool: 'exam', objectiveIds: ['OPT-SUFFICIENT', 'OPT-WRITE'], taskType: 'inverse-problem' }, (_, seed) => {
    const t = genLens(seed, { oblique: true });
    const s = [180, 45, 90].map((m) => ({ m, p: meridionalPower(t, m) }));
    return {
      title: 'Reconstruct from three meridians',
      prompt: `A regular lens has ${s.map((x) => `${fmtD(x.p)} D at ${fmtAxis(x.m)}°`).join(', ')}. Write it (any notation).`,
      kind: 'rx', target: t, requested: 'any', display: { hideLabels: true },
      hints: ['M = mean of the 180° and 90° values; J0 = half their difference.', `J45 = F(45°) − M = ${fmtD(s[1].p - (s[0].p + s[2].p) / 2)}.`, `Result: ${formatRx(t)}.`],
      explanation: `F(θ) = M + J0 cos2θ + J45 sin2θ; three distinct meridians determine it: ${formatRx(t)}.`,
      grade: (resp) => rxGrade(t, 'any', resp),
    };
  }),
  def({ id: 'F-COMPOSE', title: 'Combine two lenses', pool: 'exam', objectiveIds: ['OPT-COMPOSE'], taskType: 'inverse-problem' }, (_, seed) => {
    const r = rng(seed);
    const a = makeLens(r.quarter(-2, 1), -r.quarter(0.5, 2), 180);
    const b = makeLens(0, -r.quarter(0.5, 2), 90);
    const sum = fromMatrix(addMatrices(toMatrix(a), toMatrix(b)));
    return {
      title: 'Combine thin lenses (same plane)',
      prompt: `Thin lenses ${formatRx(a)} and ${formatRx(b)} are placed together in one plane. Write the single equivalent lens.`,
      kind: 'rx', target: sum, requested: 'any', display: { hideLabels: true },
      hints: ['Add powers meridian by meridian — not cylinders and axes.', `At 180°: ${fmtD(meridionalPower(a, 180) + meridionalPower(b, 180))}; at 90°: ${fmtD(meridionalPower(a, 90) + meridionalPower(b, 90))}.`, `Equivalent: ${formatRx(sum)}.`],
      explanation: `Matrix sum → ${formatRx(sum)}.`,
      grade: (resp) => rxGrade(sum, 'any', resp),
    };
  }),
  def({ id: 'F-RESIDUAL', title: 'What is still missing?', pool: 'practice', objectiveIds: ['OPT-COMPOSE'], taskType: 'numerical-production' }, (_, seed) => {
    const r = rng(seed);
    const t = makeLens(r.quarter(-3, 1), -r.quarter(1, 3), r.pick([180, 90]));
    const trial = makeLens(t.sphereD, 0);
    const res = fromMatrix(subMatrices(toMatrix(t), toMatrix(trial)));
    return {
      title: 'Residual correction',
      prompt: `Target correction ${formatRx(t)}. A trial lens ${formatRx(trial)} is already in place (same plane). What additional lens completes the correction?`,
      kind: 'rx', target: res, requested: 'any', display: { hideLabels: true },
      hints: ['Residual = target − trial, meridian by meridian.', 'The sphere is already fully supplied.', `Residual: ${formatRx(res)}.`],
      explanation: `Residual matrix = target − trial → ${formatRx(res)}.`,
      grade: (resp) => rxGrade(res, 'any', resp),
    };
  }),
  def({ id: 'F-WD-NET', title: 'Gross → net retinoscopy', pool: 'practice', objectiveIds: ['OPT-RETINOSCOPY'], taskType: 'numerical-production' }, (_, seed) => {
    const r = rng(seed);
    const w = r.pick([0.5, 2 / 3, 0.5]);
    const net = genLens(seed);
    const gross = makeLens(net.sphereD + 1 / w, net.cylinderD, net.axisDeg);
    const wTxt = w === 0.5 ? '0.50 m' : '2/3 m';
    return {
      title: 'Remove working distance',
      prompt: `Retinoscopy at ${wTxt} (no working-distance lens in the frame). Gross neutralising lens: ${formatRx(gross)}. Write the net refraction.`,
      kind: 'rx', target: net, requested: 'any', display: { hideLabels: true },
      hints: ['Working-distance lens power = 1 / distance in metres.', `1 / ${wTxt} = ${fmtD(1 / w)} D; remove it from both principal powers (i.e. from the sphere).`, `Net: ${formatRx(net)}.`],
      explanation: `Net = gross − ${fmtD(1 / w)} D sphere → ${formatRx(net)}. Cylinder and axis do not change.`,
      grade: (resp) => {
        const g = rxGrade(net, 'any', resp);
        if (!g.correct && resp.kind === 'rx' && opticallyEquivalent(resp.lens, gross, ANSWER_TOL_D)) {
          g.feedback.push('You reported the gross result. The working-distance power must be removed.');
          g.misconceptionIds.push('M-GROSS-VS-NET');
        }
        return g;
      },
    };
  }),
  def({ id: 'F-WD-DOUBLE', title: 'Working-distance lens already in place', pool: 'exam', objectiveIds: ['OPT-RETINOSCOPY'], taskType: 'error-correction' }, (_, seed) => {
    const t = genLens(seed);
    return {
      title: 'Working-distance lens in the frame',
      prompt: `Retinoscopy at 0.50 m with a +2.00 D working-distance lens already in the trial frame. The additional lenses that neutralise both meridians are ${formatRx(t)}. What is the net refraction?`,
      kind: 'rx', target: t, requested: 'any', display: { hideLabels: true },
      hints: ['Has the working distance already been compensated?', 'Yes — the +2.00 lens did that. Do not subtract it again.', `Net = ${formatRx(t)}.`],
      explanation: 'With a working-distance lens in place, the additional neutralising lens is already the net result.',
      grade: (resp) => {
        const g = rxGrade(t, 'any', resp);
        if (!g.correct && resp.kind === 'rx' && opticallyEquivalent(resp.lens, makeLens(t.sphereD - 2, t.cylinderD, t.axisDeg), ANSWER_TOL_D)) {
          g.feedback.push('You subtracted the working distance twice.');
          g.misconceptionIds.push('M-DOUBLE-WD');
        }
        return g;
      },
    };
  }),
  def({ id: 'F-NEAR-ADD', title: 'Near prescription from distance + ADD', pool: 'practice', objectiveIds: ['OPT-NEAR'], taskType: 'numerical-production' }, (_, seed) => {
    const r = rng(seed);
    const d = genLens(seed);
    const add = r.pick([1, 1.5, 2, 2.5]);
    const near = addNear(d, add);
    return {
      title: 'Apply a given near ADD',
      prompt: `Distance correction ${formatRx(d)}. A near addition of +${add.toFixed(2)} D has already been determined for this fictional patient. Write the near-only lens.`,
      kind: 'rx', target: near, requested: 'minus', display: { hideLabels: true },
      hints: ['The ADD is spherical.', 'Add it to the sphere; keep cylinder and axis.', `${formatRx(near)}.`],
      explanation: `Near = distance + ADD (sphere only): ${formatRx(near)}. The ADD value itself came from a separate assessment, not from age or the distance lens.`,
      grade: (resp) => rxGrade(near, 'minus', resp),
    };
  }),
  def({ id: 'F-FOCI', title: 'Where are the line foci?', pool: 'exam', objectiveIds: ['OPT-FOCI', 'OPT-CLASSIFY'], taskType: 'model-prediction' }, (_, seed) => {
    const r = rng(seed);
    const opts = [makeLens(0, -r.quarter(1, 3), 180), makeLens(-r.quarter(0.5, 2), -r.quarter(0.5, 2), 90), makeLens(0, r.quarter(1, 3), 90), makeLens(r.quarter(0.5, 2), r.quarter(0.5, 2), 180), makeLens(r.quarter(0.5, 1.5), -r.quarter(2, 4), 180)];
    const t = r.pick(opts);
    const s = eyeState(t, makeLens(0));
    const rel = s.lines.map((l) => Math.sign(Number(((l.depthM ?? Infinity) - s.retinaDepthM).toFixed(9)))).sort().join(',');
    const map: Record<string, string> = { '-1,-1': 'both-front', '-1,0': 'one-on-one-front', '-1,1': 'straddle', '0,1': 'one-on-one-behind', '1,1': 'both-behind' };
    const ans = map[rel];
    return {
      title: 'Line foci and the retina',
      prompt: `Uncorrected eye whose complete distance correction is ${formatRx(t)} (reduced-eye model, accommodation relaxed, distant object). Where are the two line foci relative to the retina?`,
      kind: 'choice', target: t, display: { hideLabels: true },
      choices: [
        { value: 'both-front', label: 'Both in front of the retina' },
        { value: 'one-on-one-front', label: 'One on the retina, one in front' },
        { value: 'straddle', label: 'One in front, one behind' },
        { value: 'one-on-one-behind', label: 'One on the retina, one behind' },
        { value: 'both-behind', label: 'Both behind the retina' },
      ],
      hints: ['A meridian needing minus correction focuses in front of the retina.', `Principal corrections: ${fmtD(toPowerCross(t).powerAD)} and ${fmtD(toPowerCross(t).powerBD)} D.`, 'Zero correction → that focus is on the retina; plus correction → behind.'],
      explanation: 'Each principal meridian focuses in front (needs minus), on (needs nothing) or behind (needs plus) the retina.',
      grade: (resp) => choiceGrade(ans, resp, 'Matches the reduced-eye focal positions.', { 'both-front': { msg: 'Check the sign of each principal correction.', mis: 'M-SIMPLE-VS-COMPOUND' }, 'one-on-one-front': { msg: 'Check the sign of each principal correction.', mis: 'M-SIMPLE-VS-COMPOUND' } }),
    };
  }),
  def({ id: 'F-PRINCIPAL-COPY', title: 'Principal power vs cylinder', pool: 'practice', objectiveIds: ['OPT-WRITE'], taskType: 'numerical-production' }, (_, seed) => {
    const r = rng(seed);
    const p1 = r.quarter(0.5, 2);
    const p2 = p1 + r.quarter(0.5, 2);
    const built = fromPowerCross({ meridianADeg: 90, powerAD: p1, meridianBDeg: 180, powerBD: p2 }, 'plus');
    const t = built.ok ? built.lens : makeLens(p1);
    return {
      title: 'Power cross with two plus meridians',
      prompt: `Power cross: +${p1.toFixed(2)} D at 90° and +${p2.toFixed(2)} D at 180°. Write the plus-cylinder prescription.`,
      kind: 'rx', target: t, requested: 'plus', display: { hideLabels: true },
      hints: ['In plus-cylinder form the axis is the less plus meridian.', `Sphere +${p1.toFixed(2)} at axis 090. Cylinder = difference.`, `${formatRx(t)} — not +${p1.toFixed(2)} +${p2.toFixed(2)} × 090.`],
      explanation: `Cylinder is the difference between principal powers: ${formatRx(t)}.`,
      grade: (resp) => rxGrade(t, 'plus', resp),
    };
  }),
];

function orientationDelta(a: number, b: number) {
  const d = Math.abs((((a - b) % 180) + 180) % 180);
  return Math.round(Math.min(d, 180 - d) * 1000) / 1000;
}

function numberGrade(ans: number, resp: TaskResponse, t: SpheroCyl, theta: number): TaskGrade {
  if (resp.kind !== 'number' || !Number.isFinite(resp.value)) return { correct: false, scores: {}, feedback: ['Enter a number in dioptres.'], misconceptionIds: [] };
  const ok = Math.abs(resp.value - ans) <= NUMBER_TOL_D;
  const fb: string[] = [];
  const mis: string[] = [];
  if (ok) fb.push(`Correct: ${fmtD(ans)} D at ${fmtAxis(theta)}°.`);
  else {
    fb.push(`The model gives ${fmtD(ans)} D at ${fmtAxis(theta)}°; you entered ${fmtD(resp.value)} D.`);
    const at90away = meridionalPower(t, theta + 90);
    if (Math.abs(resp.value - at90away) <= NUMBER_TOL_D) {
      fb.push(`${fmtD(resp.value)} D is the power 90° away. The axis is where the cylinder adds nothing.`);
      mis.push('M-AXIS-VS-MERIDIAN');
    }
    if (Math.abs(resp.value - (ans - t.sphereD)) <= NUMBER_TOL_D && t.sphereD !== 0) {
      fb.push('You gave the cylinder contribution only; add the sphere.');
      mis.push('M-SPHERE-FORGOTTEN');
    }
  }
  return { correct: ok, scores: { valueD: resp.value, expectedD: ans }, feedback: fb, misconceptionIds: mis };
}

export function familyById(id: string): Family | undefined {
  return FAMILIES.find((f) => f.id === id);
}

export function taskFor(familyId: string, seed: number): OpticsTask | undefined {
  return familyById(familyId)?.make(seed);
}
