/**
 * LAB05 pupil light-reflex model. CONCEPTUAL SCHEMATIC + constrained simulation (draft, not clinically reviewed).
 *
 * Layers:
 *  - ground truth: PupilPatient (per-eye afferent transmission, per-eye efferent state)
 *  - examination conditions: LightSegment[] (light position + ambient illumination over time)
 *  - observations: PupilFrame[] / SegmentObservation (diameters and responses only)
 *  - interpretation / feedback: gradePupilInterpretation
 *
 * Mechanism (K1): light in either eye drives BOTH pupils equally (pretectal → both Edinger–Westphal
 * nuclei → both CN III), so the shared drive depends only on the afferent signal of the illuminated
 * eye(s); each pupil's constriction is that drive × its OWN efferent function. A relative afferent
 * defect therefore never makes one pupil permanently larger.
 *
 * All diameters, latencies and rates are schematic teaching numbers, NOT patient data.
 * Laterality is always patient-based ('OD' = patient's right eye); mirroring belongs to rendering only.
 */

import { rng } from './random';

export type Eye = 'OD' | 'OS';
export const EYES: readonly Eye[] = ['OD', 'OS'];
export const otherEye = (e: Eye): Eye => (e === 'OD' ? 'OS' : 'OD');

/** Schematic efferent states. 'parasympathetic' = CN III-type constrictor weakness; 'sympathetic' = Horner-type dilator weakness. */
export type EfferentState = 'normal' | 'parasympathetic' | 'sympathetic';
export type LightPos = 'none' | Eye;
export type Ambient = 'light' | 'dark';

export interface PupilPatient {
  /** Relative afferent transmission 0..1 (1 = normal). */
  afferent: Record<Eye, number>;
  efferent: Record<Eye, EfferentState>;
  /** Constant additive size difference with normal reactions (physiological anisocoria). */
  physiologicalAniso?: { eye: Eye; mm: number } | null;
}

export const PUPIL_MODEL = {
  minMm: 2,
  /** Diameter with zero light drive (dark) for each efferent state. */
  baseMm: { normal: 7, sympathetic: 5, parasympathetic: 7.5 } as Record<EfferentState, number>,
  /** Fraction of the shared drive that reaches the sphincter. */
  capacity: { normal: 1, sympathetic: 1, parasympathetic: 0.15 } as Record<EfferentState, number>,
  ambientDrive: { light: 0.45, dark: 0 } as Record<Ambient, number>,
  torchDrive: 0.5,
  tickMs: 100,
  latencyTicks: 2,
  alphaConstrict: 0.4,
  alphaDilate: 0.2,
  changeThresholdMm: 0.2,
  briskThresholdMm: 1.0,
} as const;

const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));

export function normalPatient(): PupilPatient {
  return { afferent: { OD: 1, OS: 1 }, efferent: { OD: 'normal', OS: 'normal' }, physiologicalAniso: null };
}

/** Shared light drive delivered to both Edinger–Westphal nuclei. */
export function lightDrive(p: PupilPatient, ambient: Ambient, light: LightPos): number {
  const amb = PUPIL_MODEL.ambientDrive[ambient] * ((clamp(p.afferent.OD, 0, 1) + clamp(p.afferent.OS, 0, 1)) / 2);
  const torch = light === 'none' ? 0 : PUPIL_MODEL.torchDrive * clamp(p.afferent[light], 0, 1);
  return clamp(amb + torch, 0, 1);
}

/** Steady-state (schematic) diameter of one pupil. */
export function steadyDiameter(p: PupilPatient, eye: Eye, ambient: Ambient, light: LightPos): number {
  const e = p.efferent[eye];
  const base = PUPIL_MODEL.baseMm[e];
  const d = lightDrive(p, ambient, light);
  let mm = PUPIL_MODEL.minMm + (base - PUPIL_MODEL.minMm) * (1 - PUPIL_MODEL.capacity[e] * d);
  if (p.physiologicalAniso && p.physiologicalAniso.eye === eye) mm += p.physiologicalAniso.mm;
  return mm;
}

export function steadyState(p: PupilPatient, ambient: Ambient, light: LightPos): Record<Eye, number> {
  return { OD: steadyDiameter(p, 'OD', ambient, light), OS: steadyDiameter(p, 'OS', ambient, light) };
}

// ------------------------------------------------------------ time course (explicit ticks)

export interface LightSegment {
  light: LightPos;
  ambient: Ambient;
  ticks: number;
}

export interface PupilFrame {
  t: number;
  ms: number;
  segment: number;
  light: LightPos;
  ambient: Ambient;
  OD: number;
  OS: number;
}

/**
 * Deterministic discrete simulation. Frame 0 is the steady state of the first segment's conditions.
 * Each later tick moves each pupil a fixed fraction toward the steady state of the conditions
 * `latencyTicks` earlier (constriction faster than redilation). Pure: replay/scrub = index into frames.
 */
export function simulate(p: PupilPatient, segments: readonly LightSegment[]): PupilFrame[] {
  const timeline: { seg: number; light: LightPos; ambient: Ambient }[] = [];
  segments.forEach((s, i) => {
    for (let k = 0; k < Math.max(1, Math.round(s.ticks)); k++) timeline.push({ seg: i, light: s.light, ambient: s.ambient });
  });
  if (!timeline.length) return [];
  const frames: PupilFrame[] = [];
  const first = timeline[0];
  let cur = steadyState(p, first.ambient, first.light);
  for (let t = 0; t < timeline.length; t++) {
    const now = timeline[t];
    if (t > 0) {
      const cause = timeline[Math.max(0, t - PUPIL_MODEL.latencyTicks)];
      const target = steadyState(p, cause.ambient, cause.light);
      const next = { ...cur };
      for (const e of EYES) {
        const a = target[e] < cur[e] ? PUPIL_MODEL.alphaConstrict : PUPIL_MODEL.alphaDilate;
        next[e] = cur[e] + a * (target[e] - cur[e]);
      }
      cur = next;
    }
    frames.push({ t, ms: t * PUPIL_MODEL.tickMs, segment: now.seg, light: now.light, ambient: now.ambient, OD: cur.OD, OS: cur.OS });
  }
  return frames;
}

export type PupilChange = 'constricts' | 'dilates' | 'little change';

export function classifyChange(beforeMm: number, afterMm: number): PupilChange {
  const d = afterMm - beforeMm;
  if (d < -PUPIL_MODEL.changeThresholdMm) return 'constricts';
  if (d > PUPIL_MODEL.changeThresholdMm) return 'dilates';
  return 'little change';
}

/** Display-only strength descriptor for a constriction (schematic thresholds). */
export function strengthOf(changeMm: number): 'brisk' | 'reduced' | '' {
  if (changeMm <= -PUPIL_MODEL.briskThresholdMm) return 'brisk';
  if (changeMm < -PUPIL_MODEL.changeThresholdMm) return 'reduced';
  return '';
}

export interface SegmentObservation {
  segment: number;
  light: LightPos;
  ambient: Ambient;
  startMm: Record<Eye, number>;
  endMm: Record<Eye, number>;
  change: Record<Eye, PupilChange>;
  changeMm: Record<Eye, number>;
}

/** Observation for one segment: from the last frame before it to its last frame. */
export function segmentObservations(frames: readonly PupilFrame[]): SegmentObservation[] {
  const out: SegmentObservation[] = [];
  let prevEnd: PupilFrame | null = null;
  for (let i = 0; i < frames.length; i++) {
    const f = frames[i];
    const last = i === frames.length - 1 || frames[i + 1].segment !== f.segment;
    if (!last) continue;
    const start = prevEnd ?? frames[0];
    out.push({
      segment: f.segment,
      light: f.light,
      ambient: f.ambient,
      startMm: { OD: start.OD, OS: start.OS },
      endMm: { OD: f.OD, OS: f.OS },
      change: { OD: classifyChange(start.OD, f.OD), OS: classifyChange(start.OS, f.OS) },
      changeMm: { OD: f.OD - start.OD, OS: f.OS - start.OS },
    });
    prevEnd = f;
  }
  return out;
}

/** Swinging-flashlight sequence: a dark/dim baseline, then alternate eyes. */
export function swingSequence(start: Eye, swings: number, dwellTicks = 15, ambient: Ambient = 'dark'): LightSegment[] {
  const segs: LightSegment[] = [{ light: 'none', ambient, ticks: 10 }];
  let e = start;
  for (let i = 0; i < swings; i++) {
    segs.push({ light: e, ambient, ticks: dwellTicks });
    e = otherEye(e);
  }
  return segs;
}

// ------------------------------------------------------------ cases & interpretation

export type PupilFinding = 'none' | 'afferent-OD' | 'afferent-OS' | 'para-OD' | 'para-OS' | 'symp-OD' | 'symp-OS' | 'physio';

export const PUPIL_FINDING_LABELS: Record<PupilFinding, string> = {
  none: 'No pupil abnormality demonstrated',
  'afferent-OD': 'Relative afferent defect, OD (patient’s right)',
  'afferent-OS': 'Relative afferent defect, OS (patient’s left)',
  'para-OD': 'Efferent: OD pupil fails to constrict (parasympathetic / CN III-type, schematic)',
  'para-OS': 'Efferent: OS pupil fails to constrict (parasympathetic / CN III-type, schematic)',
  'symp-OD': 'Efferent: OD pupil fails to dilate (sympathetic / Horner-type, schematic)',
  'symp-OS': 'Efferent: OS pupil fails to dilate (sympathetic / Horner-type, schematic)',
  physio: 'Physiological anisocoria (equal difference in light and dark, normal reactions)',
};

export function patientFor(f: PupilFinding, afferentLevel = 0.4): PupilPatient {
  const p = normalPatient();
  if (f === 'afferent-OD') p.afferent.OD = afferentLevel;
  if (f === 'afferent-OS') p.afferent.OS = afferentLevel;
  if (f === 'para-OD') p.efferent.OD = 'parasympathetic';
  if (f === 'para-OS') p.efferent.OS = 'parasympathetic';
  if (f === 'symp-OD') p.efferent.OD = 'sympathetic';
  if (f === 'symp-OS') p.efferent.OS = 'sympathetic';
  if (f === 'physio') p.physiologicalAniso = { eye: 'OS', mm: 0.6 };
  return p;
}

/** Ground-truth finding of a patient (single-defect patients only; combined defects → first match). */
export function findingOf(p: PupilPatient): PupilFinding {
  for (const e of EYES) if (p.afferent[e] < p.afferent[otherEye(e)] - 0.05) return `afferent-${e}` as PupilFinding;
  for (const e of EYES) if (p.efferent[e] === 'parasympathetic') return `para-${e}` as PupilFinding;
  for (const e of EYES) if (p.efferent[e] === 'sympathetic') return `symp-${e}` as PupilFinding;
  if (p.physiologicalAniso && p.physiologicalAniso.mm > 0) return 'physio';
  return 'none';
}

const layerOf = (f: PupilFinding) => (f.startsWith('afferent') ? 'afferent' : f.startsWith('para') || f.startsWith('symp') ? 'efferent' : f === 'physio' ? 'physio' : 'none');
const eyeOf = (f: PupilFinding): Eye | null => (f.endsWith('OD') ? 'OD' : f.endsWith('OS') ? 'OS' : null);

export interface PupilGrade {
  correct: boolean;
  layerCorrect: boolean;
  eyeCorrect: boolean;
  mechanismCorrect: boolean;
  misconceptionIds: string[];
  items: string[];
  isAnisocoriaTask: boolean;
}

export function gradePupilInterpretation(truth: PupilFinding, answer: PupilFinding): PupilGrade {
  const lt = layerOf(truth);
  const la = layerOf(answer);
  const et = eyeOf(truth);
  const ea = eyeOf(answer);
  const layerCorrect = lt === la;
  const eyeCorrect = et === ea;
  const mechanismCorrect = truth === answer || (layerCorrect && lt !== 'efferent');
  const correct = truth === answer;
  const mis: string[] = [];
  const items: string[] = [];
  if ((lt === 'afferent' && la === 'efferent') || (lt === 'efferent' && la === 'afferent')) {
    mis.push('M-AFFERENT-VS-EFFERENT');
    items.push(lt === 'afferent'
      ? 'An afferent defect changes the drive to BOTH pupils equally: resting pupils are equal and both dilate when the light swings to the affected eye. An efferent defect affects only one pupil whichever eye is lit.'
      : 'Here one pupil responded poorly whichever eye was lit, while the fellow pupil responded normally — that is an efferent (output) problem, not reduced input.');
  }
  if (lt === 'physio' && la === 'afferent') {
    mis.push('M-AFFERENT-VS-EFFERENT');
    items.push('Unequal resting size is not evidence of an afferent defect; check the swinging-flashlight response.');
  }
  if (layerCorrect && et && ea && et !== ea) items.push('Right layer, wrong eye — re-check which pupil (or which illuminated eye) behaved differently. OD = patient’s right eye, shown on the viewer’s left.');
  if (layerCorrect && lt === 'efferent' && eyeCorrect && !correct) items.push('Right eye, wrong efferent type: compare the anisocoria in light versus dark. Larger in light → the larger pupil fails to constrict; larger in dark → the smaller pupil fails to dilate.');
  if (correct) items.push('Your interpretation matches the modelled finding.');
  items.push(`Modelled finding: ${PUPIL_FINDING_LABELS[truth]}.`);
  return { correct, layerCorrect, eyeCorrect, mechanismCorrect, misconceptionIds: mis, items, isAnisocoriaTask: lt === 'efferent' || lt === 'physio' };
}

/** Seeded draw from a bounded archetype list (not independent random findings). */
export const PUPIL_ARCHETYPES: readonly PupilFinding[] = ['none', 'afferent-OD', 'afferent-OS', 'para-OD', 'para-OS', 'symp-OD', 'symp-OS', 'physio'];

export function pupilCase(seed: number): { finding: PupilFinding; patient: PupilPatient } {
  const r = rng(seed);
  const finding = r.pick(PUPIL_ARCHETYPES);
  const level = r.pick([0.3, 0.45, 0.6]);
  return { finding, patient: patientFor(finding, level) };
}

/** Prediction comparison for predict-then-observe. */
export function comparePrediction(pred: Record<Eye, PupilChange>, obs: SegmentObservation): { correct: boolean; perEye: Record<Eye, boolean> } {
  const perEye = { OD: pred.OD === obs.change.OD, OS: pred.OS === obs.change.OS };
  return { correct: perEye.OD && perEye.OS, perEye };
}
