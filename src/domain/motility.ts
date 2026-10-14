/**
 * LAB06 ocular alignment / cover-test model. CONCEPTUAL SCHEMATIC + constrained procedural simulation
 * (draft, not clinically reviewed). Horizontal deviations only.
 *
 * Layers:
 *  - ground truth: MotilityPatient (deviation type, manifest vs latent, fixation preference)
 *  - examination conditions: occluder position sequence (cover / uncover / alternate)
 *  - observations: CoverStep movements of each eye (visible only when that eye is uncovered)
 *  - interpretation / feedback: gradeCoverAnswer, gradeHirschberg
 *
 * Coordinates are ALWAYS patient-based: `inwardPD` > 0 means the eye is turned IN (adducted, nasal),
 * < 0 means turned OUT (abducted, temporal). Viewer-side mirroring is only done by `toExaminerX`,
 * which rendering code calls; nothing in the model depends on screen direction.
 * Prism-dioptre magnitudes are schematic teaching numbers.
 */
import { rng } from './random';

export type Eye = 'OD' | 'OS';
export const EYES: readonly Eye[] = ['OD', 'OS'];
export const otherEye = (e: Eye): Eye => (e === 'OD' ? 'OS' : 'OD');

export type DeviationKind = 'ortho' | 'eso' | 'exo';

export interface MotilityPatient {
  kind: DeviationKind;
  /** true = tropia (manifest), false = phoria (latent, controlled by fusion). Ignored for ortho. */
  manifest: boolean;
  /** Fixing-eye preference. For a tropia the OTHER eye is the deviating eye. */
  preferredEye: Eye;
  /** Schematic magnitude in prism dioptres. */
  magnitudePD: number;
  /** Alternating fixation: after uncovering, fixation stays with whichever eye was fixing. Default false. */
  alternating?: boolean;
  /** Fictional schematic abduction limitation (gaze positions only). */
  abductionDeficit?: Eye | null;
}

export type Occluder = 'none' | Eye;

export interface CoverState {
  occluder: Occluder;
  fixingEye: Eye;
  fused: boolean;
  /** Horizontal position per eye, patient terms, prism dioptres (+ = in/adducted, − = out/abducted). */
  inwardPD: Record<Eye, number>;
}

const sign = (k: DeviationKind) => (k === 'eso' ? 1 : k === 'exo' ? -1 : 0);

export function isTropia(p: MotilityPatient) {
  return p.kind !== 'ortho' && p.manifest;
}

function positions(p: MotilityPatient, occluder: Occluder, fixingEye: Eye): CoverState {
  const fused = occluder === 'none' && !isTropia(p);
  const dev = sign(p.kind) * p.magnitudePD;
  const inwardPD = { OD: 0, OS: 0 } as Record<Eye, number>;
  const nonFix = otherEye(fixingEye);
  inwardPD[nonFix] = fused ? 0 : dev;
  return { occluder, fixingEye, fused, inwardPD };
}

export function initialCoverState(p: MotilityPatient): CoverState {
  return positions(p, 'none', p.preferredEye);
}

/** Transition: the occluder moves to `occluder`; the uncovered eye (if only one) must fixate. */
export function nextCoverState(p: MotilityPatient, prev: CoverState, occluder: Occluder): CoverState {
  let fixing: Eye;
  if (occluder !== 'none') fixing = otherEye(occluder);
  else if (isTropia(p)) fixing = p.alternating ? prev.fixingEye : p.preferredEye;
  else fixing = prev.fixingEye;
  return positions(p, occluder, fixing);
}

export type Direction = 'in' | 'out' | 'none';
export type Maneuver = 'start' | 'cover' | 'uncover' | 'alternate' | 'repeat';

export interface EyeMovement {
  deltaPD: number;
  direction: Direction;
  /** Whether the examiner can see this eye after the maneuver (not behind the occluder). */
  visible: boolean;
}

export interface CoverStep {
  index: number;
  maneuver: Maneuver;
  label: string;
  before: CoverState;
  after: CoverState;
  /** Eye(s) the examiner must watch at this stage. */
  observe: Eye[];
  movement: Record<Eye, EyeMovement>;
}

export const DIRECTION_TEXT: Record<Direction, string> = {
  in: 'moves IN (adducts, toward the nose)',
  out: 'moves OUT (abducts, toward the ear)',
  none: 'no movement',
};

function classifyManeuver(before: Occluder, after: Occluder): Maneuver {
  if (before === after) return 'repeat';
  if (before === 'none') return 'cover';
  if (after === 'none') return 'uncover';
  return 'alternate';
}

export function step(p: MotilityPatient, prev: CoverState, occluder: Occluder, index: number): CoverStep {
  const after = nextCoverState(p, prev, occluder);
  const m = classifyManeuver(prev.occluder, occluder);
  const movement = {} as Record<Eye, EyeMovement>;
  for (const e of EYES) {
    const d = after.inwardPD[e] - prev.inwardPD[e];
    movement[e] = { deltaPD: d, direction: Math.abs(d) < 1e-9 ? 'none' : d > 0 ? 'in' : 'out', visible: after.occluder !== e };
  }
  let observe: Eye[] = [];
  let label = '';
  if (m === 'cover') {
    observe = [otherEye(occluder as Eye)];
    label = `Cover ${occluder} — watch the uncovered ${observe[0]}`;
  } else if (m === 'uncover') {
    observe = [prev.occluder as Eye];
    label = `Uncover ${prev.occluder} — watch ${prev.occluder} as it is uncovered`;
  } else if (m === 'alternate') {
    observe = [prev.occluder as Eye];
    label = `Move cover ${prev.occluder} → ${occluder} (no binocular interval) — watch the newly uncovered ${prev.occluder}`;
  } else if (m === 'repeat') {
    observe = EYES.filter((e) => e !== occluder);
    label = 'No change of cover';
  }
  return { index, maneuver: m, label, before: prev, after, observe, movement };
}

/** Run a sequence of occluder positions from the binocular start state. Step 0 = start. */
export function runCoverSequence(p: MotilityPatient, occluders: readonly Occluder[]): CoverStep[] {
  const s0 = initialCoverState(p);
  const steps: CoverStep[] = [{ index: 0, maneuver: 'start', label: 'Both eyes open, fixing the target', before: s0, after: s0, observe: [...EYES], movement: { OD: { deltaPD: 0, direction: 'none', visible: true }, OS: { deltaPD: 0, direction: 'none', visible: true } } }];
  let cur = s0;
  occluders.forEach((o, i) => {
    const st = step(p, cur, o, i + 1);
    steps.push(st);
    cur = st.after;
  });
  return steps;
}

/**
 * RENDERING TRANSFORM ONLY. Examiner faces the patient: patient's right eye (OD) is on the viewer's left.
 * Returns viewer-x sign for an inward (nasal) displacement: OD nasal → viewer's right (+), OS nasal → viewer's left (−).
 */
export function toExaminerX(eye: Eye, inwardPD: number): number {
  return eye === 'OD' ? inwardPD : -inwardPD;
}

// ------------------------------------------------------------ Hirschberg (T027)

/** Schematic conversion; published values vary (~12–22 PD per mm). */
export const HIRSCHBERG_PD_PER_MM = 15;

export interface ReflexPosition {
  /** + = displaced TEMPORALLY on that cornea, − = nasally (patient terms). */
  temporalMm: number;
  side: 'central' | 'temporal' | 'nasal';
}

/**
 * Corneal light reflex with a light at the fixation point. An eye turned IN (eso) shows the reflex
 * displaced TEMPORALLY; an eye turned OUT (exo) shows it NASALLY. Covered eye → null (not visible).
 * Simplification: the normal small nasal offset (angle kappa) is ignored — aligned reflexes are drawn central.
 */
export function cornealReflex(state: CoverState): Record<Eye, ReflexPosition | null> {
  const out = {} as Record<Eye, ReflexPosition | null>;
  for (const e of EYES) {
    if (state.occluder === e) {
      out[e] = null;
      continue;
    }
    const mm = state.inwardPD[e] / HIRSCHBERG_PD_PER_MM;
    out[e] = { temporalMm: mm, side: Math.abs(mm) < 1e-9 ? 'central' : mm > 0 ? 'temporal' : 'nasal' };
  }
  return out;
}

// ------------------------------------------------------------ gaze positions (T025, schematic)

/** h: +1 = toward the PATIENT'S right, −1 = patient's left; v: +1 up, −1 down. */
export interface Gaze {
  h: -1 | 0 | 1;
  v: -1 | 0 | 1;
}

export const GAZE_DEG = 30;
export const LIMITED_ABDUCTION_DEG = 8;

export interface EyeRotation {
  /** Degrees toward the patient's right (+) / left (−). */
  hDeg: number;
  vDeg: number;
  limited: boolean;
}

/**
 * Versions (both eyes open) or a duction (fellow eye covered). A fictional abduction deficit caps
 * abduction of that eye: OD abducts toward the patient's right, OS toward the patient's left.
 * Muscle-action teaching is schematic; secondary deviation and vertical actions are not modelled.
 */
export function gazePositions(p: MotilityPatient, gaze: Gaze, mode: 'version' | 'duction', ductionEye: Eye = 'OD'): Record<Eye, EyeRotation | null> {
  const s = initialCoverState(p);
  const out = {} as Record<Eye, EyeRotation | null>;
  for (const e of EYES) {
    if (mode === 'duction' && e !== ductionEye) {
      out[e] = null;
      continue;
    }
    let h = gaze.h * GAZE_DEG;
    const abductSign = e === 'OD' ? 1 : -1;
    let limited = false;
    if (p.abductionDeficit === e && h * abductSign > LIMITED_ABDUCTION_DEG) {
      h = abductSign * LIMITED_ABDUCTION_DEG;
      limited = true;
    }
    // primary-position tropia of the non-fixing eye (versions only); PD ≈ 2 × degrees (schematic)
    const inwardDeg = mode === 'version' ? s.inwardPD[e] / 2 : 0;
    h += e === 'OD' ? -inwardDeg : inwardDeg;
    out[e] = { hDeg: h, vDeg: gaze.v * GAZE_DEG * 0.7, limited };
  }
  return out;
}

// ------------------------------------------------------------ cases & grading

export type MotilityFinding = 'ortho' | 'esophoria' | 'exophoria' | 'ET-OD' | 'ET-OS' | 'XT-OD' | 'XT-OS';

export const MOTILITY_FINDING_LABELS: Record<MotilityFinding, string> = {
  ortho: 'Orthophoria (no deviation found)',
  esophoria: 'Esophoria (latent, eye drifts in under cover)',
  exophoria: 'Exophoria (latent, eye drifts out under cover)',
  'ET-OD': 'Right esotropia (OD turned in, manifest)',
  'ET-OS': 'Left esotropia (OS turned in, manifest)',
  'XT-OD': 'Right exotropia (OD turned out, manifest)',
  'XT-OS': 'Left exotropia (OS turned out, manifest)',
};

export function findingOf(p: MotilityPatient): MotilityFinding {
  if (p.kind === 'ortho' || p.magnitudePD === 0) return 'ortho';
  if (!p.manifest) return p.kind === 'eso' ? 'esophoria' : 'exophoria';
  const dev = otherEye(p.preferredEye);
  return `${p.kind === 'eso' ? 'ET' : 'XT'}-${dev}` as MotilityFinding;
}

export function patientFor(f: MotilityFinding, magnitudePD = 20): MotilityPatient {
  switch (f) {
    case 'ortho': return { kind: 'ortho', manifest: false, preferredEye: 'OD', magnitudePD: 0 };
    case 'esophoria': return { kind: 'eso', manifest: false, preferredEye: 'OD', magnitudePD };
    case 'exophoria': return { kind: 'exo', manifest: false, preferredEye: 'OD', magnitudePD };
    case 'ET-OD': return { kind: 'eso', manifest: true, preferredEye: 'OS', magnitudePD };
    case 'ET-OS': return { kind: 'eso', manifest: true, preferredEye: 'OD', magnitudePD };
    case 'XT-OD': return { kind: 'exo', manifest: true, preferredEye: 'OS', magnitudePD };
    case 'XT-OS': return { kind: 'exo', manifest: true, preferredEye: 'OD', magnitudePD };
  }
}

export const MOTILITY_ARCHETYPES: readonly MotilityFinding[] = ['ortho', 'esophoria', 'exophoria', 'ET-OD', 'ET-OS', 'XT-OD', 'XT-OS'];

export function motilityCase(seed: number): { finding: MotilityFinding; patient: MotilityPatient } {
  const r = rng(seed);
  const finding = r.pick(MOTILITY_ARCHETYPES);
  const mag = r.pick([10, 15, 20, 25, 30]);
  const patient = patientFor(finding, mag);
  if (finding.includes('phoria')) patient.preferredEye = r.pick(EYES);
  return { finding, patient };
}

export interface CoverEvidence {
  coveredOD: boolean;
  coveredOS: boolean;
  uncoverWatched: boolean;
  alternateDone: boolean;
}

export function coverEvidence(steps: readonly CoverStep[]): CoverEvidence {
  return {
    coveredOD: steps.some((s) => s.maneuver === 'cover' && s.after.occluder === 'OD'),
    coveredOS: steps.some((s) => s.maneuver === 'cover' && s.after.occluder === 'OS'),
    uncoverWatched: steps.some((s) => s.maneuver === 'uncover'),
    alternateDone: steps.some((s) => s.maneuver === 'alternate'),
  };
}

export interface MotilityGrade {
  correct: boolean;
  tropiaPhoriaCorrect: boolean;
  directionCorrect: boolean;
  eyeCorrect: boolean;
  misconceptionIds: string[];
  items: string[];
}

const typeOf = (f: MotilityFinding) => (f === 'ortho' ? 'ortho' : f.includes('phoria') ? 'phoria' : 'tropia');
const dirOf = (f: MotilityFinding) => (f === 'ortho' ? 'none' : f.startsWith('eso') || f.startsWith('ET') ? 'eso' : 'exo');
const devEye = (f: MotilityFinding): Eye | null => (f.endsWith('OD') ? 'OD' : f.endsWith('OS') ? 'OS' : null);

export function gradeCoverAnswer(truth: MotilityFinding, answer: MotilityFinding, ev?: CoverEvidence): MotilityGrade {
  const tropiaPhoriaCorrect = typeOf(truth) === typeOf(answer);
  const directionCorrect = dirOf(truth) === dirOf(answer);
  const eyeCorrect = devEye(truth) === devEye(answer);
  const correct = truth === answer;
  const mis: string[] = [];
  const items: string[] = [];
  if ((typeOf(truth) === 'phoria' && typeOf(answer) === 'tropia') || (typeOf(truth) === 'tropia' && typeOf(answer) === 'phoria')) {
    mis.push('M-PHORIA-VS-TROPIA');
    items.push(typeOf(truth) === 'tropia'
      ? 'A tropia shows on the COVER test: covering the fixing eye makes the fellow (deviating) eye move to take up fixation.'
      : 'In a phoria the uncovered eye does not move when the other eye is covered; the covered eye moves back (recovery) when the cover is removed. Alternate cover shows movement in both phoria and tropia, so it cannot separate them.');
  }
  if (tropiaPhoriaCorrect && !directionCorrect) items.push('Direction: an eye that moves OUT to take up fixation was turned IN (eso); an eye that moves IN was turned OUT (exo).');
  if (tropiaPhoriaCorrect && directionCorrect && !eyeCorrect && typeOf(truth) === 'tropia') items.push('Laterality: the deviating eye is the one that moves when the fellow (fixing) eye is covered. OD is the patient’s right eye, on the viewer’s left.');
  if (ev && typeOf(answer) === 'phoria' && !ev.uncoverWatched) items.push('Evidence gap: you did not watch an eye being uncovered, which is where a phoria shows its recovery movement.');
  if (ev && !(ev.coveredOD && ev.coveredOS)) items.push('Evidence gap: cover each eye in turn — covering only one eye can miss a tropia of that eye.');
  if (correct) items.push('Your interpretation matches the modelled alignment.');
  items.push(`Modelled finding: ${MOTILITY_FINDING_LABELS[truth]}.`);
  return { correct, tropiaPhoriaCorrect, directionCorrect, eyeCorrect, misconceptionIds: mis, items };
}

export interface HirschbergAnswer {
  eye: Eye | 'neither';
  dir: 'eso' | 'exo' | 'none';
}

export function hirschbergTruth(p: MotilityPatient): HirschbergAnswer {
  const r = cornealReflex(initialCoverState(p));
  for (const e of EYES) {
    const x = r[e];
    if (x && x.side !== 'central') return { eye: e, dir: x.side === 'temporal' ? 'eso' : 'exo' };
  }
  return { eye: 'neither', dir: 'none' };
}

export function gradeHirschberg(p: MotilityPatient, a: HirschbergAnswer): { correct: boolean; items: string[]; misconceptionIds: string[] } {
  const t = hirschbergTruth(p);
  const correct = t.eye === a.eye && t.dir === a.dir;
  const items: string[] = [];
  const mis: string[] = [];
  if (!correct) {
    if (t.eye !== 'neither' && a.eye === t.eye && a.dir !== t.dir) items.push('Convention: a reflex displaced TEMPORALLY means the eye is turned IN (eso); displaced NASALLY means turned OUT (exo).');
    if (t.eye === 'neither' && a.eye !== 'neither') items.push('Both reflexes were centred. A phoria is controlled by fusion with both eyes open, so the Hirschberg test cannot show it.');
    if (t.eye !== 'neither' && a.eye === 'neither') {
      items.push('One reflex was displaced from the pupil centre — look again at each cornea separately.');
      mis.push('M-PHORIA-VS-TROPIA');
    }
    if (t.eye !== 'neither' && a.eye !== 'neither' && a.eye !== t.eye) items.push('Laterality: the eye with the displaced reflex is the deviating eye. The patient’s right eye (OD) is on your left.');
  } else items.push('Correct reading of the corneal reflexes.');
  items.push(t.eye === 'neither' ? 'Modelled: both reflexes central.' : `Modelled: ${t.eye} reflex displaced ${t.dir === 'eso' ? 'temporally (eye turned in)' : 'nasally (eye turned out)'}.`);
  return { correct, items, misconceptionIds: mis };
}
