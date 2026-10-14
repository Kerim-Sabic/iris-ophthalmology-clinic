/**
 * Visual function room model (LAB04). The learner examines a VIRTUAL PATIENT whose responses are authored;
 * nothing here measures the learner's own vision. DRAFT — not clinically reviewed.
 *
 * Layers: ground truth (EyeTruth per eye × correction) → examination conditions (eye, correction, distance)
 * → observation (what the patient reads/reports) → learner notation → feedback.
 */
import { decimalAcuity, logMAR } from './optics';

export type Side = 'R' | 'L';
export const SIDE_WORD: Record<Side, string> = { R: 'Right eye', L: 'Left eye' };
export type Correction = 'unaided' | 'own-glasses' | 'pinhole';
export const CORRECTION_LABEL: Record<Correction, string> = { unaided: 'Unaided', 'own-glasses': 'Own glasses', pinhole: 'Pinhole (over own glasses if worn)' };

/** Metric Snellen line designations (metres at which the letter subtends 5′), largest first. */
export const CHART_LINES = [60, 36, 24, 18, 12, 9, 6, 5] as const;
export const TEST_DISTANCES_M = [6, 3, 1] as const;

export type LowVisionCategory = 'CF' | 'HM' | 'LP' | 'NLP';
export const LOW_VISION_ORDER: LowVisionCategory[] = ['CF', 'HM', 'LP', 'NLP'];
export const LOW_VISION_LABEL: Record<LowVisionCategory, string> = { CF: 'Counting fingers', HM: 'Hand movements', LP: 'Light perception', NLP: 'No light perception' };
export const LOW_VISION_NEEDS_DISTANCE: Record<LowVisionCategory, boolean> = { CF: true, HM: true, LP: false, NLP: false };

/** Ground truth for one eye under one correction. equiv6m: the denominator this eye would read at 6 m (may exceed 60). */
export type EyeTruth = { kind: 'chart'; equiv6m: number } | { kind: 'low'; category: LowVisionCategory; distanceM?: number };

export const roundTo = (x: number, dp: number) => Math.round((x + Number.EPSILON) * 10 ** dp) / 10 ** dp;

// ------------------------------------------------------------ distance chart (T001)

export type ChartObservation = { kind: 'line'; distanceM: number; line: number } | { kind: 'none'; distanceM: number };

/** Smallest chart line read at a test distance: a line is read when its 6 m-equivalent size is at least the eye's limit. */
export function chartObservation(t: EyeTruth, distanceM: number): ChartObservation {
  if (t.kind === 'low') return { kind: 'none', distanceM };
  const need = (t.equiv6m * distanceM) / 6;
  const readable = CHART_LINES.filter((l) => l >= need - 1e-9);
  return readable.length ? { kind: 'line', distanceM, line: readable[readable.length - 1] } : { kind: 'none', distanceM };
}
export function describeChartObservation(o: ChartObservation): string {
  return o.kind === 'line'
    ? `At ${o.distanceM} m the patient reads every letter of the line labelled ${o.line}, and none of the next smaller line${o.line === 5 ? ' (this is the smallest line on the chart)' : ''}.`
    : `At ${o.distanceM} m the patient cannot read any letter of the top (60) line.`;
}

export interface Snellen { num: number; den: number }
export function formatSnellen(s: Snellen): string {
  return `${s.num}/${s.den}`;
}
/** Parses "6/12", "6 / 12", "3/60", "20/40". */
export function parseSnellen(raw: string): Snellen | null {
  const m = raw.trim().match(/^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/);
  if (!m) return null;
  const num = Number(m[1]);
  const den = Number(m[2]);
  return num > 0 && den > 0 ? { num, den } : null;
}
export function expectedSnellen(o: ChartObservation): Snellen | null {
  return o.kind === 'line' ? { num: o.distanceM, den: o.line } : null;
}

export interface RecordGrade { correct: boolean; items: string[]; misconceptionIds: string[] }

/** Grade a written distance-acuity record against what was actually observed under the chosen conditions. */
export function gradeSnellenRecord(text: string, o: ChartObservation): RecordGrade {
  const s = parseSnellen(text);
  const exp = expectedSnellen(o);
  if (!exp) {
    const lv = parseLowVision(text);
    return lv || /no letters|cannot read|<|top line/i.test(text)
      ? { correct: true, items: ['No chart line was read at this distance: move closer (3 m, then 1 m) or continue with the low-vision sequence, and document what was tested.'], misconceptionIds: [] }
      : { correct: false, items: [`No line was read at ${o.distanceM} m, so a Snellen fraction cannot be recorded for this distance.`], misconceptionIds: [] };
  }
  if (!s) return { correct: false, items: ['Write the result as test distance / line read, e.g. 6/12.'], misconceptionIds: [] };
  if (s.num === exp.num && s.den === exp.den) return { correct: true, items: [`${formatSnellen(exp)} — numerator = test distance (${exp.num} m), denominator = the line read.`], misconceptionIds: [] };
  const items: string[] = [];
  const mis: string[] = [];
  if (s.num === exp.den && s.den === exp.num) items.push('Numerator and denominator are swapped: the numerator is the test distance.');
  else if (s.num !== exp.num && Math.abs(s.num / s.den - exp.num / exp.den) < 1e-9) {
    items.push(`${formatSnellen(s)} has the same decimal value, but the record must show the distance actually used (${exp.num} m): write ${formatSnellen(exp)}.`);
    mis.push('M-VA-NORMALISED-DISTANCE');
  } else if (s.num !== exp.num) items.push(`The test was done at ${exp.num} m, so the numerator must be ${exp.num}.`);
  if (s.den !== exp.den && !(s.num === exp.den && s.den === exp.num)) items.push(`The smallest line fully read was ${exp.den}.`);
  items.push(`Expected: ${formatSnellen(exp)}.`);
  return { correct: false, items, misconceptionIds: mis };
}

// ------------------------------------------------------------ conversions (T002)

export interface Conversion { decimal: number; logMAR: number; decimal2: number; logMAR2: number; equiv6m: number }
/** Numerical relationships only: decimal = num/den, logMAR = −log10(decimal). Does not make different charts interchangeable. */
export function convertSnellen(s: Snellen): Conversion {
  const decimal = decimalAcuity(s.num, s.den);
  const lm = logMAR(decimal);
  return { decimal, logMAR: lm, decimal2: roundTo(decimal, 2), logMAR2: roundTo(lm, 2) + 0, equiv6m: roundTo((6 * s.den) / s.num, 1) };
}
export const CONVERSION_CAVEAT = 'These are numerical relationships between notations. They do not make a Snellen chart, a logMAR chart and a near card interchangeable: chart design, letter spacing, scoring rules and test distance differ.';

/** Letter-by-letter scoring under a STATED protocol: 5 letters per line, 0.1 logMAR per line → 0.02 per letter. */
export function letterByLetterLogMAR(lastFullLine: number, extraLettersNextLine: number, lettersPerLine = 5): number {
  if (extraLettersNextLine < 0 || extraLettersNextLine >= lettersPerLine) throw new Error('Extra letters must be fewer than a full line.');
  return roundTo(lastFullLine - (0.1 / lettersPerLine) * extraLettersNextLine, 2) + 0;
}

// ------------------------------------------------------------ very low acuity (T004)

export interface LowVisionRecord { category: LowVisionCategory; distanceM?: number }
export function formatLowVision(r: LowVisionRecord): string {
  return LOW_VISION_NEEDS_DISTANCE[r.category] && r.distanceM ? `${r.category} at ${r.distanceM} m` : r.category;
}
export function parseLowVision(raw: string): LowVisionRecord | null {
  const t = raw.trim().toUpperCase().replace(/\bPL\b/, 'LP').replace(/\bNPL\b/, 'NLP');
  const m = t.match(/^(CF|HM|LP|NLP)\b(?:\s*(?:AT|@)?\s*(\d+(?:\.\d+)?)\s*(M|CM)?)?\s*$/);
  if (!m) return null;
  const cat = m[1] as LowVisionCategory;
  const d = m[2] ? Number(m[2]) / (m[3] === 'CM' ? 100 : 1) : undefined;
  return { category: cat, distanceM: d };
}
/** The model deliberately assigns NO numeric logMAR to CF/HM/LP/NLP. */
export function lowVisionLogMAR(_c: LowVisionCategory): null {
  return null;
}
/** logMAR for any record: a number for Snellen fractions, null (with reason) for low-vision categories. */
export function recordLogMAR(r: Snellen | LowVisionRecord): { value: number | null; reason?: string } {
  if ('category' in r) return { value: lowVisionLogMAR(r.category), reason: 'CF, HM, LP and NLP are categories, not chart measurements; this lab assigns no universal logMAR value to them.' };
  return { value: convertSnellen(r).logMAR2 };
}

export type LowVisionTest = 'CF' | 'HM' | 'LP';
export const LV_DISTANCES_M = [2, 1, 0.5] as const;

/** Does the patient respond correctly to this low-vision test? Eyes that read the chart pass every test. */
export function lowVisionResponse(t: EyeTruth, test: LowVisionTest, distanceM?: number): boolean {
  if (t.kind === 'chart') return true;
  const rank = (c: LowVisionCategory) => LOW_VISION_ORDER.indexOf(c);
  if (rank(test) < rank(t.category)) return false;
  if (test === t.category && LOW_VISION_NEEDS_DISTANCE[test]) return (distanceM ?? 0) <= (t.distanceM ?? 0) + 1e-9;
  return true;
}
export function describeLowVisionResponse(test: LowVisionTest, ok: boolean, distanceM?: number): string {
  const at = LOW_VISION_NEEDS_DISTANCE[test] && distanceM ? ` at ${distanceM} m` : '';
  if (test === 'CF') return ok ? `Counts your fingers correctly${at}.` : `Cannot count your fingers${at}.`;
  if (test === 'HM') return ok ? `Reports the direction of your hand movement correctly${at}.` : `Does not detect your hand moving${at}.`;
  return ok ? 'Reports when your light is on and off (other eye fully covered).' : 'Does not perceive your light at all (other eye fully covered, bright source).';
}
export function expectedLowVision(t: EyeTruth): LowVisionRecord | null {
  return t.kind === 'low' ? { category: t.category, distanceM: t.distanceM } : null;
}
export function gradeLowVisionRecord(text: string, t: EyeTruth): RecordGrade {
  const exp = expectedLowVision(t);
  const r = parseLowVision(text);
  if (!exp) return { correct: false, items: ['This eye reads the chart — record a Snellen fraction instead of a low-vision category.'], misconceptionIds: [] };
  if (!r) return { correct: false, items: ['Write the category (CF, HM, LP or NLP), with the distance for CF/HM, e.g. "CF at 1 m".'], misconceptionIds: [] };
  const items: string[] = [];
  if (r.category !== exp.category) items.push(`The best level demonstrated was ${LOW_VISION_LABEL[exp.category]} (${exp.category}).`);
  if (LOW_VISION_NEEDS_DISTANCE[exp.category]) {
    if (r.distanceM === undefined) items.push(`${exp.category} must be documented with the distance (here ${exp.distanceM} m).`);
    else if (r.category === exp.category && Math.abs(r.distanceM - (exp.distanceM ?? 0)) > 1e-9) items.push(`The greatest distance at which it was demonstrated was ${exp.distanceM} m.`);
  }
  return { correct: items.length === 0, items: items.length ? [...items, `Expected: ${formatLowVision(exp)}.`] : [`${formatLowVision(exp)} — no numeric logMAR is assigned to this category.`], misconceptionIds: [] };
}

// ------------------------------------------------------------ pinhole (T005)

export type PinholeChange = 'improved' | 'no-change' | 'worse' | 'not-comparable';
export interface PinholeInterpretation { change: PinholeChange; lines: number; statement: string; excludesDisease: false }

/** Compare baseline and pinhole records. Improvement suggests an optical contribution; it NEVER excludes disease. */
export function interpretPinhole(baseline: Snellen | LowVisionRecord, pinhole: Snellen | LowVisionRecord): PinholeInterpretation {
  if ('category' in baseline || 'category' in pinhole)
    return { change: 'not-comparable', lines: 0, excludesDisease: false, statement: 'At very low acuity the pinhole comparison is of limited value in this model; document the category and examine for non-optical causes.' };
  const lines = Math.round((convertSnellen(baseline).logMAR - convertSnellen(pinhole).logMAR) / 0.1);
  if (lines >= 1)
    return { change: 'improved', lines, excludesDisease: false, statement: 'Improvement with pinhole suggests an uncorrected optical (refractive) contribution. It does not exclude co-existing eye disease: refract, then examine.' };
  if (lines <= -1)
    return { change: 'worse', lines, excludesDisease: false, statement: 'Worse with pinhole: the reduced retinal illumination or a central media opacity can do this. Not diagnostic alone — look for a non-optical cause.' };
  return { change: 'no-change', lines: 0, excludesDisease: false, statement: 'No clear improvement: an optical contribution is not demonstrated. Consider non-refractive causes (media, macula, optic nerve) — and pinhole technique limits.' };
}

// ------------------------------------------------------------ near (T003)

export type NearCorrection = 'unaided' | 'reading-glasses' | 'distance-glasses';
export const NEAR_CORRECTION_LABEL: Record<NearCorrection, string> = { unaided: 'Unaided', 'reading-glasses': 'Own reading glasses', 'distance-glasses': 'Distance glasses only' };
export const NEAR_DISTANCES_CM = [25, 33, 40] as const;
/** The fictional near card of this lab uses N-notation and states a 40 cm working distance. */
export const NEAR_CARD = { notation: 'N', designDistanceCm: 40, sizes: [48, 36, 24, 18, 14, 12, 10, 8, 6, 5] } as const;
export const NEAR_CAVEAT = 'Record the notation of the card actually used (here N-notation) with the working distance and correction. Do not convert N-notation to Jaeger or to a Snellen fraction without a sourced conversion for that card.';

export interface NearRecord { size: number; distanceCm: number }
export function formatNear(r: NearRecord): string {
  return `N${r.size} at ${r.distanceCm} cm`;
}
export function parseNear(raw: string): NearRecord | null {
  const m = raw.trim().toUpperCase().match(/^N\s*(\d+(?:\.\d+)?)\s*(?:AT|@)?\s*(?:(\d+(?:\.\d+)?)\s*(CM|M))?\s*$/);
  if (!m) return null;
  const size = Number(m[1]);
  const distanceCm = m[2] ? Number(m[2]) * (m[3] === 'M' ? 100 : 1) : NaN;
  return { size, distanceCm };
}
export function gradeNearRecord(text: string, expected: NearRecord): RecordGrade {
  if (/^\s*J\s*\d/i.test(text) || /\d\s*\/\s*\d/.test(text)) return { correct: false, items: ['This card uses N-notation. Do not record Jaeger or a Snellen fraction for it.', NEAR_CAVEAT], misconceptionIds: ['M-NEAR-NOTATION-MIX'] };
  const r = parseNear(text);
  if (!r) return { correct: false, items: ['Write e.g. "N8 at 40 cm".'], misconceptionIds: [] };
  const items: string[] = [];
  if (r.size !== expected.size) items.push(`The smallest print read was N${expected.size}.`);
  if (Number.isNaN(r.distanceCm)) items.push('Include the working distance.');
  else if (r.distanceCm !== expected.distanceCm) items.push(`The test was done at ${expected.distanceCm} cm.`);
  return { correct: items.length === 0, items: items.length ? [...items, `Expected: ${formatNear(expected)}.`] : [`${formatNear(expected)} — plus the correction worn.`], misconceptionIds: [] };
}

// ------------------------------------------------------------ Amsler grid (T010)

export const AMSLER_N = 20;
export type AmslerMark = 'missing' | 'distorted';
export type AmslerMap = Map<string, AmslerMark>;
export interface AmslerSpec { cx: number; cy: number; missingR: number; distortR: number }
export const amslerKey = (col: number, row: number) => `${col},${row}`;
/** Offset of a cell centre from the central fixation dot, in squares, patient view (x right, y up). */
export const amslerOffset = (col: number, row: number) => ({ x: col - (AMSLER_N - 1) / 2, y: (AMSLER_N - 1) / 2 - row });

export function amslerArea(s: AmslerSpec | null): AmslerMap {
  const m: AmslerMap = new Map();
  if (!s) return m;
  for (let row = 0; row < AMSLER_N; row++)
    for (let col = 0; col < AMSLER_N; col++) {
      const o = amslerOffset(col, row);
      const d = Math.hypot(o.x - s.cx, o.y - s.cy);
      if (d <= s.missingR) m.set(amslerKey(col, row), 'missing');
      else if (d <= s.distortR) m.set(amslerKey(col, row), 'distorted');
    }
  return m;
}
export interface AmslerGrade { dice: number; typeAgreement: number; centroidOk: boolean; correct: boolean; items: string[] }
const centroid = (m: AmslerMap) => {
  let x = 0, y = 0;
  for (const k of m.keys()) {
    const [c, r] = k.split(',').map(Number);
    const o = amslerOffset(c, r);
    x += o.x;
    y += o.y;
  }
  return { x: x / m.size, y: y / m.size };
};
/** Overlap scoring: Dice coefficient on the marked area, agreement on the type of change, and centroid position. */
export function compareAmsler(marked: AmslerMap, truth: AmslerMap): AmslerGrade {
  if (truth.size === 0) {
    const ok = marked.size === 0;
    return { dice: ok ? 1 : 0, typeAgreement: 1, centroidOk: ok, correct: ok, items: [ok ? 'Correct: the patient reported no missing or distorted area. A normal Amsler result does not exclude macular disease.' : 'The patient reported no abnormal area — mark only what is reported.'] };
  }
  let inter = 0, sameType = 0;
  for (const [k, v] of marked) if (truth.has(k)) { inter++; if (truth.get(k) === v) sameType++; }
  const dice = marked.size + truth.size ? (2 * inter) / (marked.size + truth.size) : 1;
  const typeAgreement = inter ? sameType / inter : 0;
  const a = marked.size ? centroid(marked) : { x: NaN, y: NaN };
  const b = centroid(truth);
  const centroidOk = Math.hypot(a.x - b.x, a.y - b.y) <= 2;
  const items: string[] = [`Overlap (Dice) ${roundTo(dice, 2)}; type agreement in the overlap ${Math.round(typeAgreement * 100)} %.`];
  if (!centroidOk && marked.size) {
    if (Math.sign(a.x) !== Math.sign(b.x) && Math.abs(b.x) > 1) items.push('Your area is on the wrong side horizontally: the grid is drawn as the patient sees it — the patient\'s right is on your right here.');
    if (Math.sign(a.y) !== Math.sign(b.y) && Math.abs(b.y) > 1) items.push('Your area is on the wrong side vertically.');
  }
  if (!marked.size) items.push('Nothing was marked.');
  const correct = dice >= 0.5 && centroidOk && typeAgreement >= 0.5;
  items.push('A mapped Amsler area describes the patient\'s report under steady fixation; it does not by itself establish the cause.');
  return { dice, typeAgreement, centroidOk, correct, items };
}

// ------------------------------------------------------------ colour plates (T007) — text only, no plate images

export const COLOUR_ADMIN_STEPS = [
  'Use the illumination the plate manual specifies (daylight-equivalent)',
  'Patient wears their near correction if needed',
  'Test each eye separately (occlude the other eye)',
  'Hold the book at the distance and angle stated in the manual',
  'Show the demonstration plate first',
  'Allow the viewing time per plate stated in the manual',
  'Record plates read correctly per eye, with test name and edition',
];
export function sequenceScore(order: string[]): { correctPositions: number; total: number } {
  return { correctPositions: order.filter((s, i) => COLOUR_ADMIN_STEPS[i] === s).length, total: COLOUR_ADMIN_STEPS.length };
}
export interface ColourResult { id: string; text: string; options: string[]; answer: number; explanation: string }
export const COLOUR_RESULTS: ColourResult[] = [
  {
    id: 'CR-1',
    text: 'Supplied fictional result (text only): right eye read all screening plates correctly; left eye read the demonstration plate but misread most screening plates. Acuity: right 6/6, left 6/12.',
    options: ['Congenital red–green deficiency', 'Asymmetric, monocular colour deficit — suggests an acquired cause in the left eye (e.g. optic nerve); correlate with other findings', 'Test invalid'],
    answer: 1,
    explanation: 'Congenital deficiency is typically bilateral and symmetric. A one-eye deficit with intact demonstration plate points to an acquired problem; it is not a diagnosis by itself.',
  },
  {
    id: 'CR-2',
    text: 'Supplied fictional result (text only): both eyes misread the same screening plates in the same way; demonstration plate read correctly; acuity 6/6 each eye; no visual complaints.',
    options: ['Bilateral symmetric pattern consistent with a congenital colour-vision deficiency (confirm type with an appropriate test)', 'Acquired optic neuropathy', 'Test invalid'],
    answer: 0,
    explanation: 'Symmetric bilateral misreading with normal acuity is the typical congenital pattern; plate screening alone does not classify type or severity.',
  },
  {
    id: 'CR-3',
    text: 'Supplied fictional result (text only): the patient could not read the demonstration plate with either eye. Acuity: 6/60 each eye.',
    options: ['Severe congenital deficiency', 'Not a valid colour result: the demonstration plate is designed to be readable regardless of colour vision — reduced acuity or task understanding is limiting', 'Bilateral optic neuropathy confirmed'],
    answer: 1,
    explanation: 'Failure on the demonstration plate invalidates the colour interpretation; address acuity/understanding first.',
  },
];

// ------------------------------------------------------------ authored fictional patients

export interface EyeCase {
  distance: Record<Correction, EyeTruth>;
  /** Smallest N-size read at the card's 40 cm; null = cannot read the largest print. */
  near: Record<NearCorrection, number | null>;
  amsler: AmslerSpec | null;
}
export interface VirtualPatient { id: string; label: string; vignette: string; wearsGlasses: boolean; eyes: Record<Side, EyeCase> }

const chart = (equiv6m: number): EyeTruth => ({ kind: 'chart', equiv6m });
const low = (category: LowVisionCategory, distanceM?: number): EyeTruth => ({ kind: 'low', category, distanceM });

export const PATIENTS: VirtualPatient[] = [
  {
    id: 'VP-01', label: 'Fictional patient A (52)', wearsGlasses: true,
    vignette: 'Fictional: 52-year-old office worker, short-sighted since school, now struggles to read small print with distance glasses on.',
    eyes: {
      R: { distance: { unaided: chart(36), 'own-glasses': chart(6), pinhole: chart(9) }, near: { unaided: 8, 'reading-glasses': 5, 'distance-glasses': 14 }, amsler: null },
      L: { distance: { unaided: chart(24), 'own-glasses': chart(6), pinhole: chart(9) }, near: { unaided: 8, 'reading-glasses': 5, 'distance-glasses': 12 }, amsler: null },
    },
  },
  {
    id: 'VP-02', label: 'Fictional patient B (74)', wearsGlasses: true,
    vignette: 'Fictional: 74-year-old notices straight door frames look bent and a grey patch when reading with the right eye.',
    eyes: {
      R: { distance: { unaided: chart(24), 'own-glasses': chart(18), pinhole: chart(18) }, near: { unaided: 24, 'reading-glasses': 12, 'distance-glasses': 18 }, amsler: { cx: 2, cy: 2, missingR: 1.2, distortR: 3 } },
      L: { distance: { unaided: chart(12), 'own-glasses': chart(6), pinhole: chart(6) }, near: { unaided: 18, 'reading-glasses': 5, 'distance-glasses': 14 }, amsler: null },
    },
  },
  {
    id: 'VP-03', label: 'Fictional patient C (63)', wearsGlasses: false,
    vignette: 'Fictional: 63-year-old with markedly reduced vision in the right eye for some months; left eye "fine".',
    eyes: {
      R: { distance: { unaided: low('CF', 1), 'own-glasses': low('CF', 1), pinhole: low('CF', 1) }, near: { unaided: null, 'reading-glasses': null, 'distance-glasses': null }, amsler: null },
      L: { distance: { unaided: chart(9), 'own-glasses': chart(9), pinhole: chart(6) }, near: { unaided: 10, 'reading-glasses': 5, 'distance-glasses': 10 }, amsler: { cx: -3, cy: -1, missingR: 0, distortR: 2 } },
    },
  },
  {
    id: 'VP-04', label: 'Fictional patient D (39)', wearsGlasses: true,
    vignette: 'Fictional: 39-year-old with high short-sightedness; left eye has seen poorly for many years.',
    eyes: {
      R: { distance: { unaided: chart(120), 'own-glasses': chart(12), pinhole: chart(9) }, near: { unaided: 5, 'reading-glasses': 5, 'distance-glasses': 6 }, amsler: null },
      L: { distance: { unaided: low('HM', 0.5), 'own-glasses': low('HM', 0.5), pinhole: low('HM', 0.5) }, near: { unaided: null, 'reading-glasses': null, 'distance-glasses': null }, amsler: null },
    },
  },
  {
    id: 'VP-05', label: 'Fictional patient E (81)', wearsGlasses: true,
    vignette: 'Fictional: 81-year-old; the left eye has had no useful sight for years; the right eye is the "good" eye.',
    eyes: {
      R: { distance: { unaided: chart(18), 'own-glasses': chart(9), pinhole: chart(9) }, near: { unaided: 24, 'reading-glasses': 8, 'distance-glasses': 18 }, amsler: null },
      L: { distance: { unaided: low('LP'), 'own-glasses': low('LP'), pinhole: low('LP') }, near: { unaided: null, 'reading-glasses': null, 'distance-glasses': null }, amsler: null },
    },
  },
];
