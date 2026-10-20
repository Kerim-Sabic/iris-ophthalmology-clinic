/**
 * Diagnosis writing from lecture visus notation, e.g.
 *   "VOD: sc 0.5, cc -1.00 dsph 1.0 Dg?"
 *   "VOS: sc 0.7, cc -0.50 dsph -1.00 dcyl ax 170 1.0"
 *
 * Teaching convention (declared, see docs/SIMULATION_CONTRACTS.md §8): the cc lens that reaches the
 * stated acuity is treated as the complete distance correction with accommodation relaxed, so the
 * refractive state is classified from the two principal powers of that lens (optics.classify).
 * Pure module — no React.
 */
import {
  classify, fmtAxis, fmtD, formatRx, makeLens, normalizeAxis, orientationDiff, sphericalEquivalent, toPowerCross, transpose,
  type RefractiveClass, type SpheroCyl,
} from './optics';
import { rng } from './random';

export type Eye = 'OD' | 'OS' | 'OU';

export type TokenKind = 'eye' | 'colon' | 'sc' | 'va-sc' | 'comma' | 'cc' | 'sph-power' | 'dsph' | 'cyl-power' | 'dcyl' | 'ax' | 'axis-value' | 'va-cc' | 'dg' | 'add' | 'add-power' | 'near' | 'near-va' | 'age' | 'age-value' | 'unknown';

export interface Token {
  kind: TokenKind;
  text: string;
  start: number;
  end: number;
  value?: number;
}

export interface VisusLine {
  raw: string;
  eye: Eye | null;
  sc: number | null;
  cc: { sphereD: number; cylinderD: number; axisDeg: number | null; va: number | null; lens: SpheroCyl } | null;
  asksDg: boolean;
  /** Near addition written on this line (Add +2.00 dsph). */
  addD: number | null;
  /** true when the cc lens on this line is a NEAR (reading) lens: "za blizu / near". */
  near: boolean;
  ageY: number | null;
  /** distance = a normal VOD/VOS line; context = an Add, near or age line. */
  role: 'distance' | 'context';
  tokens: Token[];
  errors: string[];
  warnings: string[];
}

const NUM = /^[+\-−–]?(?:\d+(?:[.,]\d+)?|[.,]\d+)/;

function toNumber(s: string): number {
  return Number(s.replace(/[−–]/g, '-').replace(',', '.'));
}

/** Tokenise and parse one visus line. Never throws; problems are reported in errors/warnings. */
export function parseVisusLine(raw: string): VisusLine {
  const tokens: Token[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];
  let i = 0;
  const s = raw;
  const skipWs = () => {
    while (i < s.length && /\s/.test(s[i])) i++;
  };
  const push = (kind: TokenKind, start: number, end: number, value?: number) => tokens.push({ kind, text: s.slice(start, end), start, end, value });
  let state: 'start' | 'after-eye' | 'sc' | 'after-sc' | 'cc' = 'start';
  let pendingPower: { v: number; start: number; end: number } | null = null;
  let afterCyl = false;
  while (i < s.length) {
    skipWs();
    if (i >= s.length) break;
    const rest = s.slice(i);
    let m: RegExpMatchArray | null;
    if ((m = rest.match(/^V\s*(OD|OS|OU)\b/i)) || (m = rest.match(/^(OD|OS|OU)\b/i))) {
      push('eye', i, i + m[0].length);
      i += m[0].length;
      state = 'after-eye';
      continue;
    }
    if (rest[0] === ':') {
      push('colon', i, i + 1);
      i++;
      continue;
    }
    if (rest[0] === ',' && !/^,\d/.test(rest)) {
      push('comma', i, i + 1);
      i++;
      continue;
    }
    if ((m = rest.match(/^s\.?\s?c\.?(?![a-z])/i))) {
      push('sc', i, i + m[0].length);
      i += m[0].length;
      state = 'sc';
      continue;
    }
    if ((m = rest.match(/^c\.?\s?c\.?(?![a-z])/i))) {
      push('cc', i, i + m[0].length);
      i += m[0].length;
      state = 'cc';
      continue;
    }
    if ((m = rest.match(/^d\.?\s?sph\.?/i))) {
      if (pendingPower) {
        tokens.push({ kind: 'sph-power', text: s.slice(pendingPower.start, pendingPower.end), start: pendingPower.start, end: pendingPower.end, value: pendingPower.v });
        pendingPower = null;
      } else errors.push('“dsph” without a power in front of it.');
      push('dsph', i, i + m[0].length);
      i += m[0].length;
      continue;
    }
    if ((m = rest.match(/^d\.?\s?cyl\.?/i))) {
      if (pendingPower) {
        tokens.push({ kind: 'cyl-power', text: s.slice(pendingPower.start, pendingPower.end), start: pendingPower.start, end: pendingPower.end, value: pendingPower.v });
        pendingPower = null;
      } else errors.push('“dcyl” without a power in front of it.');
      push('dcyl', i, i + m[0].length);
      i += m[0].length;
      afterCyl = true;
      continue;
    }
    if ((m = rest.match(/^(ax(is)?\.?|x|×)(?=\s*\d)/i))) {
      push('ax', i, i + m[0].length);
      i += m[0].length;
      skipWs();
      const n = s.slice(i).match(/^\d{1,3}(?:[.,]\d+)?/);
      if (n) {
        push('axis-value', i, i + n[0].length, toNumber(n[0]));
        i += n[0].length;
        if (s[i] === '°') i++;
      } else errors.push('Axis without a number.');
      afterCyl = false;
      continue;
    }
    if ((m = rest.match(/^(add\.?|adicija|addition)(?![a-z])\s*:?/i))) {
      push('add', i, i + m[0].length);
      i += m[0].length;
      skipWs();
      const n = s.slice(i).match(/^[+\-−–]?\d+(?:[.,]\d+)?/);
      if (n) {
        push('add-power', i, i + n[0].length, toNumber(n[0]));
        i += n[0].length;
        skipWs();
        const u = s.slice(i).match(/^d\.?\s?sph\.?/i);
        if (u) {
          push('dsph', i, i + u[0].length);
          i += u[0].length;
        }
      } else errors.push('“Add” without a power.');
      continue;
    }
    if ((m = rest.match(/^\(?\s*(za blizu|na blizinu|blizu|near|reading)\s*\)?/i))) {
      push('near', i, i + m[0].length);
      i += m[0].length;
      continue;
    }
    if ((m = rest.match(/^(age|dob|starost)\s*:?\s*(\d{1,3})/i))) {
      push('age', i, i + m[0].length - m[2].length);
      push('age-value', i + m[0].length - m[2].length, i + m[0].length, Number(m[2]));
      i += m[0].length;
      skipWs();
      const y = s.slice(i).match(/^(god(ina)?\.?|years?|y\.?|g\.)/i);
      if (y) i += y[0].length;
      continue;
    }
    if (state === 'cc' && (m = rest.match(/^(J\s?\d{1,2}|N\s?\d{1,2})(?![\d.])/i))) {
      push('near-va', i, i + m[0].length);
      i += m[0].length;
      continue;
    }
    if ((m = rest.match(/^Dg\s*\??/i))) {
      push('dg', i, i + m[0].length);
      i += m[0].length;
      continue;
    }
    if (rest[0] === '?') {
      i++;
      continue;
    }
    // typo such as "-.0.50" → read as -0.50 with a warning
    if ((m = rest.match(/^([+\-−–])\.(\d+[.,]\d+)/))) {
      const v = toNumber(m[1] + m[2]);
      warnings.push(`Read “${m[0]}” as ${fmtD(v)} (a stray dot was ignored) — check the original.`);
      if (state === 'cc') pendingPower = { v, start: i, end: i + m[0].length };
      i += m[0].length;
      continue;
    }
    if ((m = rest.match(NUM))) {
      const v = toNumber(m[0]);
      const start = i;
      i += m[0].length;
      if (state === 'sc') {
        push('va-sc', start, i, v);
        state = 'after-sc';
      } else if (state === 'cc') {
        // a signed number or one followed by a unit is a power; an unsigned number at the end is the acuity
        skipWs();
        const next = s.slice(i);
        if (/^d\.?\s?(sph|cyl)/i.test(next)) pendingPower = { v, start, end: start + m[0].length };
        else if (/^[+\-−–]/.test(m[0])) {
          pendingPower = { v, start, end: start + m[0].length };
          errors.push(`Power ${m[0]} has no unit (dsph or dcyl).`);
        } else tokens.push({ kind: 'va-cc', text: m[0], start, end: start + m[0].length, value: v });
      } else tokens.push({ kind: 'unknown', text: m[0], start, end: start + m[0].length });
      continue;
    }
    // anything else: one unknown word
    const w = rest.match(/^\S+/)![0];
    push('unknown', i, i + w.length);
    i += w.length;
  }
  void afterCyl;
  const eyeTok = tokens.find((t) => t.kind === 'eye');
  const eye = eyeTok ? (eyeTok.text.replace(/^V\s*/i, '').toUpperCase() as Eye) : null;
  const isNear = tokens.some((t) => t.kind === 'near');
  const addTok = tokens.find((t) => t.kind === 'add-power');
  const ageTok = tokens.find((t) => t.kind === 'age-value');
  const role: VisusLine['role'] = isNear || ((addTok || ageTok) && !tokens.some((t) => t.kind === 'va-sc')) ? 'context' : 'distance';
  if (!eye && role === 'distance') errors.push('No eye given (VOD = right eye, VOS = left eye).');
  const scTok = tokens.find((t) => t.kind === 'va-sc');
  const sc = scTok?.value ?? null;
  if (sc === null && role === 'distance') errors.push('No uncorrected acuity (sc …).');
  if (addTok && (addTok.value ?? 0) <= 0) errors.push('A near addition is a plus power (e.g. Add +2.00 dsph).');
  const hasCc = tokens.some((t) => t.kind === 'cc');
  let cc: VisusLine['cc'] = null;
  if (hasCc) {
    const sph = tokens.find((t) => t.kind === 'sph-power')?.value ?? 0;
    const cyl = tokens.find((t) => t.kind === 'cyl-power')?.value ?? 0;
    const ax = tokens.find((t) => t.kind === 'axis-value')?.value ?? null;
    const va = tokens.find((t) => t.kind === 'va-cc')?.value ?? null;
    if (!tokens.some((t) => t.kind === 'sph-power' || t.kind === 'cyl-power')) errors.push('“cc” is not followed by a lens.');
    if (cyl !== 0 && ax === null) errors.push('A cylinder needs an axis (ax …).');
    if (ax !== null && (ax < 0 || ax > 180)) errors.push(`Axis ${ax}° is outside 0–180°.`);
    if (va === null && !isNear) warnings.push('No corrected acuity after the lens.');
    cc = { sphereD: sph, cylinderD: cyl, axisDeg: ax, va, lens: makeLens(sph, cyl, ax) };
  }
  for (const v of [sc, cc?.va]) if (v !== null && v !== undefined && (v <= 0 || v > 2)) errors.push(`Decimal acuity ${v} is outside 0–2.`);
  for (const t of tokens) if (t.kind === 'unknown') warnings.push(`Did not understand “${t.text}”.`);
  return { raw, eye, sc, cc, asksDg: tokens.some((t) => t.kind === 'dg'), tokens, errors, warnings, addD: addTok?.value ?? null, near: isNear, ageY: ageTok?.value ?? null, role };
}

/** Split a block of text into visus lines (one per line, or each "VOD/VOS" starts a new line). */
export function parseVisusBlock(text: string): VisusLine[] {
  return text
    .split(/\n|(?=\bV\s*O[DSU]\b)/i)
    .map((l) => l.trim())
    .filter(Boolean)
    .map(parseVisusLine);
}

// ------------------------------------------------------------------ diagnosis engine

export type Orientation = 'rectus' | 'inversus' | 'obliquus';

export const CLASS_LATIN: Record<RefractiveClass, string> = {
  emmetropic: 'Emmetropia',
  'spherical-myopia': 'Myopia',
  'spherical-hyperopia': 'Hypermetropia',
  'simple-myopic-astigmatism': 'Astigmatismus myopicus simplex',
  'compound-myopic-astigmatism': 'Astigmatismus myopicus compositus',
  'simple-hyperopic-astigmatism': 'Astigmatismus hypermetropicus simplex',
  'compound-hyperopic-astigmatism': 'Astigmatismus hypermetropicus compositus',
  'mixed-astigmatism': 'Astigmatismus mixtus',
};

export const CLASS_ENGLISH: Record<RefractiveClass, string> = {
  emmetropic: 'Emmetropia (no distance refractive error)',
  'spherical-myopia': 'Myopia (short-sightedness)',
  'spherical-hyperopia': 'Hypermetropia / hyperopia (long-sightedness)',
  'simple-myopic-astigmatism': 'Simple myopic astigmatism',
  'compound-myopic-astigmatism': 'Compound myopic astigmatism',
  'simple-hyperopic-astigmatism': 'Simple hyperopic astigmatism',
  'compound-hyperopic-astigmatism': 'Compound hyperopic astigmatism',
  'mixed-astigmatism': 'Mixed astigmatism',
};

export const CLASS_RULE: Record<RefractiveClass, string> = {
  emmetropic: 'Both principal meridians need 0 D.',
  'spherical-myopia': 'Both meridians need the same minus power.',
  'spherical-hyperopia': 'Both meridians need the same plus power.',
  'simple-myopic-astigmatism': 'One meridian needs 0, the other needs minus.',
  'compound-myopic-astigmatism': 'Both meridians need minus, by different amounts.',
  'simple-hyperopic-astigmatism': 'One meridian needs 0, the other needs plus.',
  'compound-hyperopic-astigmatism': 'Both meridians need plus, by different amounts.',
  'mixed-astigmatism': 'One meridian needs plus, the other needs minus.',
};

export const ORIENT_LATIN: Record<Orientation, string> = { rectus: 'rectus', inversus: 'inversus', obliquus: 'obliquus' };
export const ORIENT_ENGLISH: Record<Orientation, string> = {
  rectus: 'with the rule (secundum regulam)',
  inversus: 'against the rule (contra regulam)',
  obliquus: 'oblique',
};

export const EYE_LATIN: Record<Eye, string> = { OD: 'oculi dextri', OS: 'oculi sinistri', OU: 'oculi utriusque' };
export const EYE_ENGLISH: Record<Eye, string> = { OD: 'right eye', OS: 'left eye', OU: 'both eyes' };

export type EyeOutcome =
  | { kind: 'refractive'; cls: RefractiveClass; orientation: Orientation | null; principal: { powerD: number; meridianDeg: number }[]; minusForm: SpheroCyl; seD: number; bcvaReduced: boolean }
  | { kind: 'emmetropic-by-acuity' }
  | { kind: 'insufficient'; reason: string };

export interface EyeDiagnosis {
  eye: Eye;
  outcome: EyeOutcome;
  /** Ready-to-write diagnosis, Latin form, e.g. "Astigmatismus myopicus simplex rectus OS". */
  latin: string;
  english: string;
  notes: string[];
}

/** Minus-cylinder axis within ±30° of 180 → rectus; of 090 → inversus; otherwise obliquus (declared convention). */
export function orientationOf(lens: SpheroCyl): Orientation | null {
  if (lens.cylinderD === 0 || lens.axisDeg === null) return null;
  const minus = lens.cylinderD < 0 ? lens : transpose(lens);
  const a = minus.axisDeg!;
  if (orientationDiff(a, 180) <= 30) return 'rectus';
  if (orientationDiff(a, 90) <= 30) return 'inversus';
  return 'obliquus';
}

export function diagnoseEye(line: VisusLine): EyeDiagnosis {
  const eye = line.eye ?? 'OD';
  const notes: string[] = [];
  if (line.errors.length) return { eye, outcome: { kind: 'insufficient', reason: line.errors.join(' ') }, latin: '—', english: 'Cannot be read', notes };
  if (!line.cc) {
    if (line.sc !== null && line.sc >= 1) {
      notes.push('Acuity is 1.0 without any lens, so no distance refractive error is diagnosed in the lecture convention.');
      notes.push('Caveat: a small hyperopia can be hidden by accommodation in young patients; only a cycloplegic refraction rules it out.');
      return { eye, outcome: { kind: 'emmetropic-by-acuity' }, latin: `Emmetropia ${eye}`, english: `Emmetropia, ${EYE_ENGLISH[eye]}`, notes };
    }
    return {
      eye,
      outcome: { kind: 'insufficient', reason: 'Reduced acuity without a correcting lens: a refraction (cc) is needed before a refractive diagnosis can be written.' },
      latin: 'Dg cannot be stated yet',
      english: 'Needs refraction',
      notes,
    };
  }
  const lens = line.cc.lens;
  const c = classify(lens, 'full-distance-correction-relaxed');
  if (c.status !== 'classified') throw new Error('unreachable');
  const pc = toPowerCross(lens);
  const orientation = orientationOf(lens);
  const minusForm = lens.cylinderD > 0 ? transpose(lens) : lens;
  const bcvaReduced = line.cc.va !== null && line.cc.va < 1;
  if (bcvaReduced)
    notes.push(`With the lens the eye reaches only ${line.cc.va?.toFixed(1)}: the refractive error does not fully explain the reduced vision. Write that the best-corrected acuity is reduced; in a child or with a large interocular difference, think of amblyopia — but a full examination is needed before naming a cause.`);
  if (line.cc.va !== null && line.sc !== null && line.cc.va < line.sc) notes.push('Corrected acuity is worse than uncorrected — check the record for an error.');
  const latin = `${CLASS_LATIN[c.cls]}${orientation ? ' ' + ORIENT_LATIN[orientation] : ''} ${eye}`;
  const english = `${CLASS_ENGLISH[c.cls]}${orientation ? ', ' + ORIENT_ENGLISH[orientation] : ''}, ${EYE_ENGLISH[eye]}`;
  return {
    eye,
    outcome: {
      kind: 'refractive',
      cls: c.cls,
      orientation,
      principal: [
        { powerD: pc.powerAD, meridianDeg: pc.meridianADeg },
        { powerD: pc.powerBD, meridianDeg: pc.meridianBDeg },
      ],
      minusForm,
      seD: sphericalEquivalent(lens),
      bcvaReduced,
    },
    latin,
    english,
    notes,
  };
}

export interface PairDiagnosis {
  eyes: EyeDiagnosis[];
  /** Interocular difference in spherical equivalent (D), when both eyes have a cc lens. */
  seDifferenceD: number | null;
  anisometropia: 'expected' | 'optional' | 'no';
  /** expected: a near addition was needed; age-only: presbyopic age but no near data; no: neither. */
  presbyopia: { status: 'expected' | 'age-only' | 'no'; addD: number | null; ageY: number | null; nearLenses: { eye: Eye; lens: SpheroCyl }[] };
  notes: string[];
  sentence: string;
}

/**
 * Anisometropia: the threshold differs between textbooks (commonly ≥1 D or ≥2 D). Declared policy:
 * ≥2.00 D difference → expected to be mentioned; 1.00–1.99 D → accepted either way; <1.00 D → not expected.
 * An eye without a lens but with VA 1.0 sc counts as 0 D.
 */
export function diagnosePair(lines: VisusLine[]): PairDiagnosis {
  const distance = lines.filter((l) => l.role === 'distance');
  const context = lines.filter((l) => l.role === 'context');
  const eyes = distance.map(diagnoseEye);
  const notes: string[] = [];
  const se = (d: EyeDiagnosis) => (d.outcome.kind === 'refractive' ? d.outcome.seD : d.outcome.kind === 'emmetropic-by-acuity' ? 0 : null);
  let diff: number | null = null;
  const od = eyes.find((e) => e.eye === 'OD');
  const os = eyes.find((e) => e.eye === 'OS');
  if (od && os && se(od) !== null && se(os) !== null) diff = Math.abs(se(od)! - se(os)!);
  const aniso: PairDiagnosis['anisometropia'] = diff === null ? 'no' : diff >= 2 ? 'expected' : diff >= 1 ? 'optional' : 'no';
  if (aniso === 'expected') notes.push(`The eyes differ by ${diff!.toFixed(2)} D (spherical equivalent): name the anisometropia as well.`);
  if (aniso === 'optional') notes.push(`The eyes differ by ${diff!.toFixed(2)} D. Some texts already call ≥1 D anisometropia; mentioning it is accepted but not required here.`);
  const parts = eyes.map((e) => e.latin);
  const same = od && os && od.outcome.kind === 'refractive' && os.outcome.kind === 'refractive' && od.outcome.cls === os.outcome.cls && od.outcome.orientation === os.outcome.orientation;
  let sentence = same ? `${od!.latin.replace(/ OD$/, '')} OU` : parts.join('; ');
  if (aniso === 'expected') sentence += '; Anisometropia';
  // presbyopia: only from near data (an ADD, or a near lens more plus than the distance lens) — never from age alone
  const ageY = lines.map((l) => l.ageY).find((a) => a !== null) ?? null;
  let addD: number | null = lines.map((l) => l.addD).find((a) => a !== null) ?? null;
  for (const l of context.filter((c) => c.near && c.cc)) {
    const dist = distance.find((d) => d.eye === l.eye) ?? distance[0];
    const distLens = dist?.cc?.lens ?? makeLens(0);
    const diffN = sphericalEquivalent(l.cc!.lens) - sphericalEquivalent(distLens);
    if (diffN > 0 && addD === null) addD = Math.round(diffN * 4) / 4;
  }
  const nearLenses: { eye: Eye; lens: SpheroCyl }[] = [];
  if (addD !== null && addD > 0)
    for (const d of distance) if (d.eye) nearLenses.push({ eye: d.eye, lens: d.cc ? makeLens(d.cc.lens.sphereD + addD, d.cc.lens.cylinderD, d.cc.lens.axisDeg) : makeLens(addD) });
  const presStatus: PairDiagnosis['presbyopia']['status'] = addD !== null && addD > 0 ? 'expected' : ageY !== null && ageY >= 45 ? 'age-only' : 'no';
  if (presStatus === 'expected') {
    sentence += '; Presbyopia';
    notes.push(`A near addition of ${fmtD(addD!)} was needed: write Presbyopia. Reading glasses = distance lens + ADD (cylinder and axis unchanged): ${nearLenses.map((n) => `${n.eye} ${formatRx(n.lens)}`).join(', ')}.`);
    if (ageY !== null && ageY < 40) notes.push(`A near addition at age ${ageY} is unusual for presbyopia — accommodation problems or uncorrected hyperopia should be considered.`);
  }
  if (presStatus === 'age-only') notes.push(`The patient is ${ageY}, but no near addition or near test is given: presbyopia is likely at this age but cannot be written from age alone.`);
  if (eyes.some((e) => e.outcome.kind === 'refractive' && e.outcome.bcvaReduced)) sentence += `; reduced best-corrected acuity ${eyes.filter((e) => e.outcome.kind === 'refractive' && e.outcome.bcvaReduced).map((e) => e.eye).join(', ')} (further examination)`;
  return { eyes, seDifferenceD: diff, anisometropia: aniso, presbyopia: { status: presStatus, addD, ageY, nearLenses }, notes, sentence: `Dg: ${sentence}` };
}

// ------------------------------------------------------------------ explanations for each clickable token

export function decimalToSnellen6(v: number): string {
  const den = 6 / v;
  const nice = [6, 7.5, 9, 12, 18, 24, 36, 60, 120].reduce((a, b) => (Math.abs(b - den) < Math.abs(a - den) ? b : a));
  return `≈ 6/${nice} (20/${Math.round((20 * nice) / 6)})`;
}

export interface TokenExplanation {
  title: string;
  body: string[];
}

export function explainToken(t: Token, line: VisusLine): TokenExplanation {
  switch (t.kind) {
    case 'eye': {
      const e = t.text.replace(/^V\s*/i, '').toUpperCase() as Eye;
      return {
        title: `${t.text} — which eye`,
        body: [
          `V = visus (Latin: vision, visual acuity). ${e} = ${EYE_LATIN[e]} — the ${EYE_ENGLISH[e]}.`,
          'VOD = right eye, VOS = left eye, VOU = both eyes together. Each eye is tested and diagnosed separately.',
          'Laterality comes from these letters only — never from a picture of a lens.',
        ],
      };
    }
    case 'sc':
      return { title: 'sc — sine correctione', body: ['Latin for “without correction”: the patient reads the chart without glasses or contact lenses.', 'The number after it is the uncorrected visual acuity.'] };
    case 'va-sc':
      return {
        title: `${t.text} — uncorrected visual acuity (decimal)`,
        body: [
          `Decimal acuity: 1.0 is the normal reference (6/6, 20/20). ${t.value} means the patient needs letters ${(1 / (t.value || 1)).toFixed(1)}× larger than normal ${decimalToSnellen6(t.value || 1)}.`,
          t.value !== undefined && t.value >= 1 ? 'This is normal acuity without glasses.' : 'This is reduced. Reduced acuity alone does not tell you the cause — the correcting lens (cc) does.',
          'Decimal = numerator ÷ denominator of the Snellen fraction; logMAR = −log10(decimal).',
        ],
      };
    case 'comma':
    case 'colon':
      return { title: 'Separator', body: ['Just punctuation between the parts of the record.'] };
    case 'cc':
      return { title: 'cc — cum correctione', body: ['Latin for “with correction”. What follows is the lens put in front of the eye, then the acuity reached with that lens.', 'In the lecture convention this lens is taken as the full distance correction — it is what you classify.'] };
    case 'sph-power':
      return {
        title: `${t.text} — spherical power`,
        body: [
          `${fmtD(t.value ?? 0)} D: the same power in every direction (every meridian).`,
          (t.value ?? 0) < 0 ? 'Minus = diverging lens. A minus correction means the eye focused light in FRONT of the retina (myopic).' : (t.value ?? 0) > 0 ? 'Plus = converging lens. A plus correction means the eye focused light BEHIND the retina (hypermetropic).' : 'Zero = plano.',
          'D = dioptre = 1 / focal length in metres.',
        ],
      };
    case 'dsph':
      return { title: 'dsph — dioptria sphaerica', body: ['“Dioptre sphere”: the number before it is a spherical lens power.', 'In English records you may see DS or SPH.'] };
    case 'cyl-power':
      return {
        title: `${t.text} — cylindrical power`,
        body: [
          `${fmtD(t.value ?? 0)} D acting in ONE meridian only — 90° away from the axis. Along the axis it adds nothing.`,
          'A cylinder corrects astigmatism: the eye has different power in different directions.',
          (t.value ?? 0) > 0 ? 'This is written as a PLUS cylinder. To judge “rectus/inversus”, first rewrite it in minus-cylinder form (transpose).' : 'This is written as a minus cylinder.',
        ],
      };
    case 'dcyl':
      return { title: 'dcyl — dioptria cylindrica', body: ['“Dioptre cylinder”: the number before it is a cylinder power. English: DC or CYL.'] };
    case 'ax':
      return { title: 'ax — axis', body: ['The axis of the cylinder, in degrees (0–180, horizontal written as 180).', 'Angles are read on the standard (TABO) scale for both eyes: 0° at the examiner’s right, counter-clockwise.'] };
    case 'axis-value': {
      const a = normalizeAxis(t.value ?? 180);
      return {
        title: `${t.text}° — the axis direction`,
        body: [
          `At ${fmtAxis(a)}° the cylinder has NO power. Its full power acts at ${fmtAxis(a + 90)}° (90° away).`,
          'Most common student mistake: thinking the power is AT the axis. It is the opposite.',
        ],
      };
    }
    case 'va-cc':
      return {
        title: `${t.text} — best-corrected visual acuity`,
        body: [
          (t.value ?? 0) >= 1 ? 'With the lens the eye sees 1.0: the refractive error fully explains the reduced uncorrected vision.' : `Even with the lens the eye reaches only ${t.value}. Something besides refraction is reducing vision — write it and think of further examination (in children: amblyopia).`,
        ],
      };
    case 'add':
      return { title: 'Add — near addition', body: ['Extra plus power for reading, added on top of the distance lens.', 'Needing an ADD means the eye can no longer accommodate enough for near work: presbyopia (in an age-appropriate patient).'] };
    case 'add-power':
      return {
        title: `${t.text} — the near addition`,
        body: [`${fmtD(t.value ?? 0)} D extra plus for near only. Always plus and spherical; the distance cylinder and axis stay the same.`, 'Reading lens = distance lens + ADD. The ADD comes from a near test — it is never calculated from age alone.'],
      };
    case 'near':
      return { title: `${t.text} — near (reading) correction`, body: ['The lens on this line is for reading distance (about 40 cm), not for distance.', 'If it is more plus than the distance lens, the difference is the near addition (ADD).'] };
    case 'near-va':
      return { title: `${t.text} — near acuity`, body: ['Near-vision notation (Jaeger J… or N-point). J1 / N5 is small print. Different near notations are not interchangeable.'] };
    case 'age':
    case 'age-value':
      return { title: 'Age', body: ['Context only. Presbyopia becomes common from the 40s, but you write it only when a near addition was actually needed — not because of age alone.'] };
    case 'dg':
      return { title: 'Dg? — diagnosis', body: ['Dg = diagnosis. You write the refractive diagnosis for this eye: e.g. “Myopia OD” or “Astigmatismus myopicus simplex rectus OS”.'] };
    default:
      return { title: `“${t.text}”`, body: ['Not recognised. Check the spelling against the usual pattern: VOD: sc 0.5, cc −1.00 dsph 1.0'] };
  }
  void line;
}

// ------------------------------------------------------------------ step-by-step derivation (drives the animation)

export interface DerivationStep {
  id: string;
  title: string;
  text: string;
  highlight: TokenKind[];
}

export function derivationSteps(line: VisusLine): DerivationStep[] {
  const d = diagnoseEye(line);
  const steps: DerivationStep[] = [
    { id: 'eye', title: 'Which eye?', text: `${line.eye ?? '?'} = ${line.eye ? EYE_ENGLISH[line.eye] : 'unknown'}. Your diagnosis must carry this label.`, highlight: ['eye'] },
    { id: 'sc', title: 'Vision without glasses', text: line.sc === null ? 'Missing.' : line.sc >= 1 ? `sc ${line.sc}: normal without correction.` : `sc ${line.sc}: reduced ${decimalToSnellen6(line.sc)}. Something is blurring the image — find out what from the lens.`, highlight: ['sc', 'va-sc'] },
  ];
  if (d.outcome.kind === 'emmetropic-by-acuity') {
    steps.push({ id: 'dg', title: 'Write it', text: `No lens was needed: Dg: ${d.latin}.`, highlight: ['dg'] });
    return steps;
  }
  if (d.outcome.kind === 'insufficient') {
    steps.push({ id: 'dg', title: 'Not enough information', text: d.outcome.reason, highlight: [] });
    return steps;
  }
  const o = d.outcome;
  const lens = line.cc!.lens;
  steps.push({ id: 'lens', title: 'Read the correcting lens', text: `cc ${formatRx(lens)}${lens.cylinderD > 0 ? ` (plus cylinder; same lens as ${formatRx(o.minusForm)})` : ''}.`, highlight: ['cc', 'sph-power', 'dsph', 'cyl-power', 'dcyl', 'ax', 'axis-value'] });
  steps.push({
    id: 'cross',
    title: 'Find the power in each main direction',
    text: lens.cylinderD === 0 ? `A sphere: ${fmtD(lens.sphereD)} D in every meridian.` : `At the axis (${fmtAxis(lens.axisDeg)}°) only the sphere acts: ${fmtD(lens.sphereD)} D. At ${fmtAxis(lens.axisDeg! + 90)}° sphere + cylinder: ${fmtD(lens.sphereD)} + (${fmtD(lens.cylinderD)}) = ${fmtD(lens.sphereD + lens.cylinderD)} D.`,
    highlight: ['sph-power', 'cyl-power', 'axis-value'],
  });
  steps.push({ id: 'classify', title: 'Look at the two signs', text: `Principal corrections ${fmtD(o.principal[0].powerD)} and ${fmtD(o.principal[1].powerD)} D → ${CLASS_RULE[o.cls]} → ${CLASS_LATIN[o.cls]}.`, highlight: [] });
  if (o.orientation)
    steps.push({
      id: 'orient',
      title: 'Which way is the astigmatism?',
      text: `${lens.cylinderD > 0 ? `Rewrite in minus cylinder first: ${formatRx(o.minusForm)}. ` : ''}Minus-cylinder axis ${fmtAxis(o.minusForm.axisDeg)}° → ${o.orientation === 'rectus' ? 'near 180° → rectus (with the rule)' : o.orientation === 'inversus' ? 'near 90° → inversus (against the rule)' : 'oblique → obliquus'}.`,
      highlight: ['cyl-power', 'axis-value'],
    });
  steps.push({ id: 'cc-va', title: 'Does the lens fix the vision?', text: o.bcvaReduced ? `Only ${line.cc!.va} with the lens: note reduced best-corrected acuity (further examination).` : `Yes — ${line.cc!.va ?? '?'} with the lens.`, highlight: ['va-cc'] });
  steps.push({ id: 'dg', title: 'Write the diagnosis', text: `Dg: ${d.latin}${o.bcvaReduced ? '; reduced best-corrected acuity' : ''}`, highlight: ['dg'] });
  return steps;
}

// ------------------------------------------------------------------ learner answers

export interface EyeAnswer {
  cls: RefractiveClass | 'emmetropic' | 'cannot' | '';
  orientation: Orientation | '';
  flagBcva: boolean;
}

export interface PairAnswer {
  eyes: Partial<Record<Eye, EyeAnswer>>;
  anisometropia: boolean;
  /** Terms found in free text that the data do not support (e.g. keratoconus). */
  unsupported: string[];
  presbyopia?: boolean;
}

const TERM_PATTERNS: { re: RegExp; tag: string }[] = [
  { re: /astigm/i, tag: 'astig' },
  { re: /myop|miop|kratkovid/i, tag: 'myop' },
  { re: /hyperm|hyperop|hiperm|hiperop|dalekovid/i, tag: 'hyper' },
  { re: /mixt|mje[sš]ovit|mixed/i, tag: 'mixed' },
  { re: /simpl|jednostav/i, tag: 'simplex' },
  { re: /compos|compound|slo[zž]en/i, tag: 'compositus' },
  { re: /emm?etrop/i, tag: 'emme' },
  { re: /rect|with[- ]the[- ]rule|secundum|po pravilu|wtr/i, tag: 'rectus' },
  { re: /invers|against[- ]the[- ]rule|contra|protiv pravila|atr/i, tag: 'inversus' },
  { re: /obliq|kos[ia]?\b/i, tag: 'obliquus' },
];

const PRESBY = /presbyop|presbiop|staračk|starack/i;

const UNSUPPORTED = [
  { re: /keratokon|keratocon/i, label: 'keratoconus (a cylinder value cannot establish it)' },
  { re: /glaucom|glaukom/i, label: 'glaucoma (not assessable from acuity and refraction)' },
  { re: /catarac|katarakt/i, label: 'cataract (not assessable from acuity and refraction)' },
];

function classFromTags(tags: Set<string>): RefractiveClass | '' {
  if (tags.has('emme')) return 'emmetropic';
  if (tags.has('astig')) {
    if (tags.has('mixed')) return 'mixed-astigmatism';
    const kind = tags.has('myop') ? 'myopic' : tags.has('hyper') ? 'hyperopic' : '';
    const sub = tags.has('compositus') ? 'compound' : tags.has('simplex') ? 'simple' : '';
    if (kind && sub) return `${sub}-${kind}-astigmatism` as RefractiveClass;
    return '';
  }
  if (tags.has('mixed')) return 'mixed-astigmatism';
  if (tags.has('myop')) return 'spherical-myopia';
  if (tags.has('hyper')) return 'spherical-hyperopia';
  return '';
}

/**
 * Parse a written diagnosis such as "Dg: Myopia OD; Astigmatismus myopicus simplex rectus OS".
 * Returns the structured reading, which the UI shows BEFORE grading (not a hidden keyword grader).
 */
export function parseWrittenDiagnosis(text: string): { answer: PairAnswer; readAs: string[]; problems: string[] } {
  const problems: string[] = [];
  const t = text.replace(/^\s*dg\s*[:.]?/i, '');
  const segs: { eye: Eye; text: string }[] = [];
  const re = /\b(OD|OS|OU|oculi dextri|oculi sinistri|oculi utriusque|right eye|left eye|both eyes|desno oko|lijevo oko|oba oka)\b/gi;
  const map = (s: string): Eye => (/OD|dextri|right|desno/i.test(s) ? 'OD' : /OS|sinistri|left|lijevo/i.test(s) ? 'OS' : 'OU');
  // the eye label may come before or after its diagnosis; split on separators then find a label in each part
  const parts = t.split(/[;\n]|,(?=\s*(?:[A-Z]|astig|myop|hyper|emm))/i).map((p) => p.trim()).filter(Boolean);
  for (const p of parts) {
    re.lastIndex = 0;
    const found = [...p.matchAll(re)];
    if (!found.length) {
      if (/aniso/i.test(p) || PRESBY.test(p) || /ambly|slabovid|further|reduced|dalj/i.test(p)) segs.push({ eye: 'OU', text: p });
      else problems.push(`No eye (OD / OS / OU) given for “${p}”.`);
      continue;
    }
    for (const f of found) segs.push({ eye: map(f[0]), text: p });
  }
  const answer: PairAnswer = { eyes: {}, anisometropia: /aniso/i.test(t), unsupported: [], presbyopia: PRESBY.test(t) };
  const readAs: string[] = [];
  for (const s of segs) {
    const tags = new Set(TERM_PATTERNS.filter((p) => p.re.test(s.text)).map((p) => p.tag));
    const cls = classFromTags(tags);
    const orientation: Orientation | '' = tags.has('rectus') ? 'rectus' : tags.has('inversus') ? 'inversus' : tags.has('obliquus') ? 'obliquus' : '';
    const flag = /ambly|slabovid|further|reduced|dalj|bcva|best[- ]corrected/i.test(s.text);
    if (!cls && !flag && !/aniso/i.test(s.text) && !PRESBY.test(s.text)) {
      if (tags.has('astig')) problems.push(`“${s.text}”: say which astigmatism — myopicus/hypermetropicus and simplex/compositus, or mixtus.`);
      else problems.push(`Could not read a diagnosis in “${s.text}”.`);
    }
    if (/\b(no|not|nema|bez|nije)\b/i.test(s.text)) problems.push(`“${s.text}” contains a negation; the reading below may not be what you meant.`);
    const targets: Eye[] = s.eye === 'OU' ? ['OD', 'OS'] : [s.eye];
    for (const e of targets) {
      const prev = answer.eyes[e] ?? { cls: '', orientation: '', flagBcva: false };
      answer.eyes[e] = { cls: (cls || prev.cls) as EyeAnswer['cls'], orientation: orientation || prev.orientation, flagBcva: prev.flagBcva || flag };
    }
  }
  for (const u of UNSUPPORTED) if (u.re.test(t)) answer.unsupported.push(u.label);
  for (const e of ['OD', 'OS'] as Eye[]) {
    const a = answer.eyes[e];
    if (a) readAs.push(`${e}: ${a.cls && a.cls !== 'cannot' ? CLASS_LATIN[a.cls as RefractiveClass] : '—'}${a.orientation ? ' ' + a.orientation : ''}${a.flagBcva ? ' + reduced corrected acuity noted' : ''}`);
  }
  if (answer.anisometropia) readAs.push('Anisometropia mentioned');
  if (answer.presbyopia) readAs.push('Presbyopia mentioned');
  for (const u of answer.unsupported) readAs.push(`Also wrote: ${u}`);
  return { answer, readAs, problems };
}

export interface EyeGrade {
  eye: Eye;
  expected: EyeDiagnosis;
  classOk: boolean;
  orientationOk: boolean | null; // null = not applicable
  bcvaOk: boolean | null;
  swapped: boolean;
  feedback: string[];
  misconceptionIds: string[];
}

export interface PairGrade {
  presbyopiaOk: boolean;
  presbyopiaFeedback: string | null;
  eyes: EyeGrade[];
  anisometropiaOk: boolean;
  unsupported: string[];
  correct: boolean;
  modelAnswer: string;
}

export function gradePair(pair: PairDiagnosis, ans: PairAnswer): PairGrade {
  const grades: EyeGrade[] = [];
  for (const exp of pair.eyes) {
    const a = ans.eyes[exp.eye];
    const fb: string[] = [];
    const mis: string[] = [];
    const o = exp.outcome;
    const expCls = o.kind === 'refractive' ? o.cls : o.kind === 'emmetropic-by-acuity' ? 'emmetropic' : 'cannot';
    const classOk = !!a && a.cls === expCls;
    const other = pair.eyes.find((x) => x.eye !== exp.eye);
    const otherCls = other ? (other.outcome.kind === 'refractive' ? other.outcome.cls : other.outcome.kind === 'emmetropic-by-acuity' ? 'emmetropic' : 'cannot') : null;
    const swapped = !classOk && !!a && otherCls !== null && a.cls === otherCls && otherCls !== expCls;
    if (!a || !a.cls) fb.push(`No diagnosis written for ${exp.eye}.`);
    else if (classOk) fb.push(`${exp.eye}: ${exp.latin.replace(/ (OD|OS|OU)$/, '')} ✓`);
    else {
      if (swapped) {
        fb.push(`${exp.eye}: you wrote the other eye’s diagnosis here — OD and OS look swapped.`);
      } else if (o.kind === 'refractive') {
        const p = o.principal;
        fb.push(`${exp.eye}: the lens has ${fmtD(p[0].powerD)} D at ${fmtAxis(p[0].meridianDeg)}° and ${fmtD(p[1].powerD)} D at ${fmtAxis(p[1].meridianDeg)}° → ${CLASS_RULE[o.cls]} → ${CLASS_LATIN[o.cls]}.`);
        if (a.cls === 'spherical-myopia' || a.cls === 'spherical-hyperopia') {
          if (o.cls.includes('astigmatism')) {
            fb.push('There is a cylinder, so the two meridians differ: it is an astigmatism, not a pure sphere.');
            mis.push('M-SE-AS-EQUIVALENT');
          }
        }
        if ((a.cls.includes('simple') && o.cls.includes('compound')) || (a.cls.includes('compound') && o.cls.includes('simple'))) {
          fb.push('Simple = one meridian is already 0. Compound = both meridians need the same sign of correction.');
          mis.push('M-SIMPLE-VS-COMPOUND');
        }
        if (o.cls === 'mixed-astigmatism') fb.push('Signs differ between the meridians → mixtus, even if the written sphere has only one sign.');
        if (a.cls === 'emmetropic' && o.seD === 0) mis.push('M-MIXED-ZERO-SE');
      } else if (o.kind === 'emmetropic-by-acuity') fb.push(`${exp.eye}: VA 1.0 without correction → Emmetropia.`);
      else fb.push(`${exp.eye}: ${o.reason}`);
    }
    let orientationOk: boolean | null = null;
    if (o.kind === 'refractive' && o.orientation) {
      orientationOk = !!a && a.orientation === o.orientation;
      if (!orientationOk) {
        if (a?.orientation) {
          fb.push(`Orientation: ${a.orientation} is not right — ${o.orientation}. ${o.minusForm.axisDeg !== (pair.eyes.length ? o.minusForm.axisDeg : 0) ? '' : ''}Convert to minus cylinder first (${formatRx(o.minusForm)}), then read the axis.`);
          mis.push('M-AXIS-VS-MERIDIAN');
        } else fb.push(`Orientation not written (optional detail): ${o.orientation} (${ORIENT_ENGLISH[o.orientation]}).`);
      }
    }
    let bcvaOk: boolean | null = null;
    if (o.kind === 'refractive' && o.bcvaReduced) {
      bcvaOk = !!a?.flagBcva;
      if (!bcvaOk) fb.push(`${exp.eye} does not reach 1.0 even with the lens — say so (reduced best-corrected acuity; further examination; in a child think of amblyopia).`);
    }
    grades.push({ eye: exp.eye, expected: exp, classOk, orientationOk, bcvaOk, swapped, feedback: fb, misconceptionIds: mis });
  }
  const anisometropiaOk = pair.anisometropia === 'expected' ? ans.anisometropia : pair.anisometropia === 'no' ? !ans.anisometropia : true;
  const wrotePres = !!ans.presbyopia;
  const ps = pair.presbyopia.status;
  const presbyopiaOk = ps === 'expected' ? wrotePres : !wrotePres;
  const presbyopiaFeedback = presbyopiaOk
    ? ps === 'expected'
      ? 'Presbyopia ✓ — the near addition shows it.'
      : null
    : ps === 'expected'
      ? `A near addition (${fmtD(pair.presbyopia.addD!)}) was needed: add “Presbyopia”.`
      : ps === 'age-only'
        ? `You wrote presbyopia, but only the age (${pair.presbyopia.ageY}) is given — there is no near addition or near test. Do not diagnose it from age alone.`
        : 'Presbyopia is not supported: no near data are given.';
  const correct = grades.every((g) => g.classOk && g.bcvaOk !== false) && anisometropiaOk && presbyopiaOk && ans.unsupported.length === 0;
  return { eyes: grades, anisometropiaOk, presbyopiaOk, presbyopiaFeedback, unsupported: ans.unsupported, correct, modelAnswer: pair.sentence };
}

// ------------------------------------------------------------------ exercise bank

export interface DgExercise {
  id: string;
  source: 'lecture' | 'generated';
  /** Category id used as the review family. */
  familyId: string;
  lines: string[];
  note?: string;
}

/** The professor's lecture examples, exactly as given (including the "-.0.50" typo). */
export const LECTURE_EXAMPLES: DgExercise[] = [
  ['VOD: sc 0.5, cc -1.00 dsph 1.0 Dg?', 'VOS: sc 0.3, cc -1.00 dcyl ax 180 1.0 Dg?'],
  ['VOD: sc 1.0 Dg?', 'VOS: sc 0.5, cc +4.00 dsph 1.0 Dg?'],
  ['VOD: sc 0.4, cc -1.00 dsph 1.0 Dg?', 'VOS: sc 0.7, cc -.0.50 dsph -1.00 dcyl ax 170 1.0?'],
  ['VOD: sc 1.0', 'VOS: sc 0.8, cc -0.50 dsph 1.0'],
  ['VOD: sc 0.5, cc +4.00 dsph 0.9', 'VOS: sc 0.8, cc +1.00 dsph 1.0'],
  ['VOD: sc 0.5, cc +1.00 dsph +1.00 dcyl ax 180 1.0', 'VOS: sc 0.8, cc +1.00 dcyl ax 180 1.0'],
  ['VOD: sc 0.6, cc -1.50 dsph 1.0', 'VOS: sc 0.6, cc -0.50 dsph -1.00 dcyl ax 180 1.0'],
  ['VOD: sc 0.6, cc -1.50 dcyl ax 170 1.0', 'VOS: sc 0.6, cc -0.50 dsph +1.00 dcyl ax 180 1.0'],
].map((lines, i) => {
  const pd = diagnosePair(lines.map(parseVisusLine));
  return { id: `LEC-${i + 1}`, source: 'lecture' as const, familyId: familyFor(pd), lines };
});

export function familyFor(pd: PairDiagnosis): string {
  // family = hardest category present, so reviews revisit the reasoning that was tested
  const order: string[] = ['mixed-astigmatism', 'compound-hyperopic-astigmatism', 'simple-hyperopic-astigmatism', 'compound-myopic-astigmatism', 'simple-myopic-astigmatism', 'spherical-hyperopia', 'spherical-myopia', 'emmetropic'];
  const present = pd.eyes.map((e) => (e.outcome.kind === 'refractive' ? e.outcome.cls : 'emmetropic'));
  const top = order.find((o) => present.includes(o as RefractiveClass)) ?? 'emmetropic';
  return `F-DG-${top}`;
}

const fmtPower = (v: number) => (v > 0 ? '+' : v < 0 ? '-' : '') + Math.abs(v).toFixed(2);

/** Illustrative uncorrected acuity for a generated eye (NOT a validated diopter→acuity formula). */
function illustrativeSc(lens: SpheroCyl, age: 'young' | 'adult', r: ReturnType<typeof rng>): number {
  const pc = toPowerCross(lens);
  const myopicPart = Math.max(0, -Math.min(pc.powerAD, pc.powerBD));
  const cylMag = Math.abs(lens.cylinderD);
  const hyperPart = Math.max(0, Math.max(pc.powerAD, pc.powerBD));
  let blur = myopicPart * 1.0 + cylMag * 0.5 + hyperPart * (age === 'young' ? 0.2 : 0.45);
  blur += (r.next() - 0.5) * 0.3;
  const table = [1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.05];
  const idx = Math.max(0, Math.min(table.length - 1, Math.round(blur * 2.6)));
  return table[idx];
}

function writeLine(eye: 'OD' | 'OS', sc: number, lens: SpheroCyl | null, cc: number | null, style: { plusCyl: boolean; dg: boolean }): string {
  const v = (x: number) => (x >= 1 ? x.toFixed(1) : x < 0.1 ? x.toFixed(2) : x.toFixed(1));
  let s = `V${eye}: sc ${v(sc)}`;
  if (lens && cc !== null) {
    const L = style.plusCyl && lens.cylinderD < 0 ? transpose(lens) : lens;
    const parts: string[] = [];
    if (L.sphereD !== 0 || L.cylinderD === 0) parts.push(`${fmtPower(L.sphereD)} dsph`);
    if (L.cylinderD !== 0) parts.push(`${fmtPower(L.cylinderD)} dcyl ax ${fmtAxis(L.axisDeg)}`.replace(/ax 0*(\d)/, 'ax $1'));
    s += `, cc ${parts.join(' ')} ${v(cc)}`;
  }
  return s + (style.dg ? ' Dg?' : '');
}

const AXES_RECT = [180, 175, 170, 5, 10];
const AXES_INV = [90, 85, 95, 80, 100];
const AXES_OBL = [45, 135, 40, 50, 130, 140];

/** Generate a coherent fictional pair. Deterministic per seed. */
export function generateExercise(seed: number, focus?: RefractiveClass | 'any'): DgExercise {
  const r = rng(seed);
  const cats: RefractiveClass[] = ['spherical-myopia', 'spherical-hyperopia', 'simple-myopic-astigmatism', 'compound-myopic-astigmatism', 'simple-hyperopic-astigmatism', 'compound-hyperopic-astigmatism', 'mixed-astigmatism', 'emmetropic'];
  const pickCat = (): RefractiveClass => (focus && focus !== 'any' && r.next() < 0.7 ? focus : r.pick(cats));
  const axis = () => {
    const x = r.next();
    return r.pick(x < 0.55 ? AXES_RECT : x < 0.85 ? AXES_INV : AXES_OBL);
  };
  const lensFor = (c: RefractiveClass): SpheroCyl | null => {
    const q = (lo: number, hi: number) => r.quarter(lo, hi);
    switch (c) {
      case 'emmetropic':
        return null;
      case 'spherical-myopia':
        return makeLens(-q(0.5, 6));
      case 'spherical-hyperopia':
        return makeLens(q(0.5, 5));
      case 'simple-myopic-astigmatism':
        return makeLens(0, -q(0.5, 3), axis());
      case 'compound-myopic-astigmatism':
        return makeLens(-q(0.5, 4), -q(0.5, 2.5), axis());
      case 'simple-hyperopic-astigmatism': {
        // written either as plano + plus cyl, or as sphere + equal minus cyl
        const c2 = q(0.5, 3);
        return r.next() < 0.6 ? makeLens(0, c2, axis()) : makeLens(c2, -c2, axis());
      }
      case 'compound-hyperopic-astigmatism':
        return makeLens(q(0.5, 3.5), q(0.5, 2), axis());
      case 'mixed-astigmatism': {
        const S = q(0.25, 2);
        const C = -(S + q(0.5, 2.5));
        return r.next() < 0.5 ? makeLens(S, C, axis()) : transpose(makeLens(S, C, axis()));
      }
    }
  };
  const age = r.next() < 0.5 ? 'young' : 'adult';
  const plusCyl = r.next() < 0.35;
  const lensOf: Record<'OD' | 'OS', SpheroCyl | null> = { OD: null, OS: null };
  const mkEye = (eye: 'OD' | 'OS', c: RefractiveClass) => {
    const lens = lensFor(c);
    if (!lens) {
      lensOf[eye] = null;
      return writeLine(eye, 1.0, null, null, { plusCyl, dg: true });
    }
    lensOf[eye] = lens;
    let sc = illustrativeSc(lens, age, r);
    if (sc >= 1 && c !== 'spherical-hyperopia') sc = 0.8;
    const bc = r.next() < 0.08 ? r.pick([0.8, 0.9]) : 1.0;
    if (sc > bc) sc = Math.max(0.1, bc - 0.2);
    return writeLine(eye, Number(sc.toFixed(2)), lens, bc, { plusCyl, dg: true });
  };
  const c1 = pickCat();
  const sameAgain = r.next() < 0.35;
  const c2 = sameAgain ? c1 : pickCat();
  const lines = [mkEye('OD', c1), mkEye('OS', c2)];
  // presbyopia: a fictional MEASURED near addition (never derived from age); plus an age-only trap
  const pr = r.next();
  if (pr < 0.3) {
    const ageY = r.int(44, 72);
    const add = r.pick([1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3]);
    lines.unshift(`Age: ${ageY}`);
    if (r.next() < 0.5) lines.push(`VOU: Add +${add.toFixed(2)} dsph`);
    else
      for (const e of ['OD', 'OS'] as const) {
        const d = lensOf[e] ?? makeLens(0);
        const n = makeLens(d.sphereD + add, d.cylinderD, d.axisDeg);
        const parts = [`${fmtPower(n.sphereD)} dsph`];
        if (n.cylinderD !== 0) parts.push(`${fmtPower(n.cylinderD)} dcyl ax ${fmtAxis(n.axisDeg).replace(/^0+(\d)/, '$1')}`);
        lines.push(`V${e} za blizu: cc ${parts.join(' ')} J1`);
      }
  } else if (pr < 0.4) lines.unshift(`Age: ${r.int(46, 70)}`);
  const pd = diagnosePair(lines.map(parseVisusLine));
  return { id: `GEN-${seed}`, source: 'generated', familyId: familyFor(pd), lines, note: 'Fictional generated case; uncorrected acuities are illustrative, not computed from the lens.' };
}

/** App-authored presbyopia examples in the lecture format (NOT from the lecture). */
export const PRESBYOPIA_EXAMPLES: DgExercise[] = [
  ['Age: 52', 'VOD: sc 1.0', 'VOS: sc 1.0', 'VOU: Add +1.75 dsph'],
  ['Age: 58', 'VOD: sc 0.4, cc -1.25 dsph 1.0', 'VOS: sc 0.4, cc -1.25 dsph 1.0', 'VOU: Add +2.25 dsph'],
  ['Age: 61', 'VOD: sc 0.6, cc +1.50 dsph 1.0', 'VOS: sc 0.6, cc +1.00 dsph +0.50 dcyl ax 90 1.0', 'VOD za blizu: cc +4.00 dsph J1', 'VOS za blizu: cc +3.50 dsph +0.50 dcyl ax 90 J1'],
  ['Age: 55', 'VOD: sc 0.5, cc -0.50 dsph -1.00 dcyl ax 180 1.0', 'VOS: sc 1.0'],
  ['Age: 47', 'VOD: sc 0.8, cc -0.75 dsph 1.0', 'VOS: sc 0.8, cc -0.75 dsph 1.0', 'VOU: Add +1.25 dsph'],
].map((lines, i) => {
  const pd = diagnosePair(lines.map(parseVisusLine));
  return { id: `PRES-${i + 1}`, source: 'generated' as const, familyId: pd.presbyopia.status === 'expected' ? 'F-DG-presbyopia' : familyFor(pd), lines, note: 'App-written example in the lecture format (not from your lecture).' };
});
