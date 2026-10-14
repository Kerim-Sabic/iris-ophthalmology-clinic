/**
 * Visual-field / pathway localization model (LAB07). Conceptual schematic, teaching level (source K3).
 * DRAFT — not clinically reviewed.
 *
 * Coordinate frames are explicit and never derived from screen/CSS orientation:
 *  - FIELD coordinates (per eye, "as the patient sees"): x > 0 = patient's RIGHT, y > 0 = SUPERIOR, degrees from fixation.
 *  - RETINA coordinates (per eye, anatomical frame): x > 0 = toward the patient's RIGHT side of that eye, y > 0 = SUPERIOR retina.
 *  The optics of the eye invert and reverse the image: field (x, y) → retina (−x, −y).
 *  So temporal field → nasal retina and superior field → inferior retina.
 */

export type Eye = 'R' | 'L';
export const EYES: Eye[] = ['L', 'R'];
export const EYE_WORD: Record<Eye, string> = { R: 'Right', L: 'Left' };

/** Coarse grid: 10 × 10 cells of 6° covering ±30°. */
export const GRID_N = 10;
export const CELL_DEG = 6;
export const FIELD_EXTENT_DEG = 30;
/** Cells whose centre lies within this eccentricity count as "central" (schematic macular region). */
export const CENTRAL_RADIUS_DEG = 10;

export interface FieldPoint { x: number; y: number }
export interface RetinaPoint { x: number; y: number }
/** [row][col]; row 0 = most superior, col 0 = patient's far left. true = stimulus NOT seen (field lost). */
export type Grid = boolean[][];
export interface FieldDefect { R: Grid; L: Grid }

export function cellCenter(col: number, row: number): FieldPoint {
  const half = FIELD_EXTENT_DEG - CELL_DEG / 2;
  return { x: -half + CELL_DEG * col, y: half - CELL_DEG * row };
}
export function cellOf(p: FieldPoint): { col: number; row: number } {
  const col = Math.floor((p.x + FIELD_EXTENT_DEG) / CELL_DEG);
  const row = Math.floor((FIELD_EXTENT_DEG - p.y) / CELL_DEG);
  return { col: Math.min(GRID_N - 1, Math.max(0, col)), row: Math.min(GRID_N - 1, Math.max(0, row)) };
}
const ecc = (p: FieldPoint) => Math.hypot(p.x, p.y);

// ------------------------------------------------------------ field ↔ retina

/** The eye's optics invert and reverse: field point → retinal point (anatomical frame). */
export function fieldToRetina(p: FieldPoint): RetinaPoint {
  return { x: -p.x + 0, y: -p.y + 0 };
}
export function retinaToField(r: RetinaPoint): FieldPoint {
  return { x: -r.x + 0, y: -r.y + 0 };
}

export type Horizontal = 'nasal' | 'temporal';
export type Vertical = 'superior' | 'inferior';

/** Field half for a field x coordinate. Right eye: temporal field is on the patient's right. Left eye: on the patient's left. */
export function fieldHalf(eye: Eye, x: number): Horizontal {
  if (x === 0) throw new Error('Vertical meridian is the boundary, not a half.');
  return (eye === 'R') === x > 0 ? 'temporal' : 'nasal';
}
/** Retinal half for a retinal x coordinate. Right eye: the nasal retina faces the nose, i.e. the patient's left (x < 0). */
export function retinaHalf(eye: Eye, x: number): Horizontal {
  if (x === 0) throw new Error('Vertical meridian is the boundary, not a half.');
  return (eye === 'R') === x < 0 ? 'nasal' : 'temporal';
}
/** Map a named field quadrant to the retinal quadrant that receives it. */
export function fieldQuadrantToRetina(eye: Eye, q: { h: Horizontal; v: Vertical }): { h: Horizontal; v: Vertical } {
  const fx = (eye === 'R') === (q.h === 'temporal') ? 1 : -1;
  const r = fieldToRetina({ x: fx, y: q.v === 'superior' ? 1 : -1 });
  return { h: retinaHalf(eye, r.x), v: r.y > 0 ? 'superior' : 'inferior' };
}

// ------------------------------------------------------------ lesions

export type Site = 'optic-nerve' | 'chiasm' | 'optic-tract' | 'lgn' | 'meyer' | 'parietal' | 'occipital';
export type Variant = 'complete' | 'central-scotoma' | 'macular-sparing';
export interface Lesion { site: Site; side: Eye | null; variant?: Variant }

export const SITE_INFO: Record<Site, { name: string; note: string; variants?: Variant[] }> = {
  'optic-nerve': { name: 'Retina / optic nerve', note: 'Pre-chiasmal: affects only the eye on that side. A complete lesion gives monocular loss; a lesion of the central (papillomacular) fibres gives a central scotoma.', variants: ['complete', 'central-scotoma'] },
  chiasm: { name: 'Optic chiasm (midline)', note: 'Crossing fibres from both NASAL retinas carry the TEMPORAL fields → bitemporal hemianopia. Real compressive defects are often incomplete or asymmetric.' },
  'optic-tract': { name: 'Optic tract', note: 'Retrochiasmal: carries the ipsilateral temporal and contralateral nasal retina → contralateral homonymous hemianopia, classically incongruous (incongruity is a label here; the coarse grid draws both eyes alike).' },
  lgn: { name: 'Lateral geniculate nucleus', note: 'Retrochiasmal → contralateral homonymous defect. LGN-specific sectoral patterns are NOT modelled; drawn here as a hemianopia.' },
  meyer: { name: "Temporal radiation (Meyer's loop)", note: "Inferior retinal fibres loop through the temporal lobe → contralateral SUPERIOR homonymous quadrantanopia (\"pie in the sky\"). Real defects are wedge-shaped and may be incongruous." },
  parietal: { name: 'Parietal radiation', note: 'Superior retinal fibres → contralateral INFERIOR homonymous quadrantanopia. Schematic quadrant.' },
  occipital: { name: 'Occipital cortex', note: 'Contralateral homonymous hemianopia, typically congruous. Macular sparing is an authored variant often taught for occipital lesions — suggestive, not an absolute rule.', variants: ['complete', 'macular-sparing'] },
};

export const ALL_LESIONS: Lesion[] = [
  ...(['R', 'L'] as Eye[]).flatMap((s) => [
    { site: 'optic-nerve' as Site, side: s, variant: 'complete' as Variant },
    { site: 'optic-nerve' as Site, side: s, variant: 'central-scotoma' as Variant },
  ]),
  { site: 'chiasm', side: null },
  ...(['optic-tract', 'lgn', 'meyer', 'parietal'] as Site[]).flatMap((site) => (['R', 'L'] as Eye[]).map((side) => ({ site, side }))),
  ...(['R', 'L'] as Eye[]).flatMap((s) => [
    { site: 'occipital' as Site, side: s, variant: 'complete' as Variant },
    { site: 'occipital' as Site, side: s, variant: 'macular-sparing' as Variant },
  ]),
];

export function lesionKey(l: Lesion): string {
  return `${l.site}|${l.side ?? '-'}|${l.variant ?? 'complete'}`;
}
export function lesionLabel(l: Lesion): string {
  const side = l.side ? `${EYE_WORD[l.side]} ` : '';
  const v = l.variant && l.variant !== 'complete' ? ` (${l.variant === 'central-scotoma' ? 'central fibres' : 'macular-sparing variant'})` : '';
  const n = SITE_INFO[l.site].name;
  return `${side}${side ? n[0].toLowerCase() + n.slice(1) : n}${v}`;
}

const other = (e: Eye): Eye => (e === 'R' ? 'L' : 'R');
/** Is field x on the side contralateral to a lesion side? Right brain lesion → patient's LEFT field (x < 0). */
const contraHemifield = (side: Eye, x: number) => (side === 'R' ? x < 0 : x > 0);

function lost(l: Lesion, eye: Eye, p: FieldPoint): boolean {
  const side = l.side;
  switch (l.site) {
    case 'optic-nerve':
      if (eye !== side) return false;
      return l.variant === 'central-scotoma' ? ecc(p) < CENTRAL_RADIUS_DEG : true;
    case 'chiasm':
      return fieldHalf(eye, p.x) === 'temporal';
    case 'optic-tract':
    case 'lgn':
      return contraHemifield(side!, p.x);
    case 'occipital':
      return contraHemifield(side!, p.x) && (l.variant === 'macular-sparing' ? ecc(p) >= CENTRAL_RADIUS_DEG : true);
    case 'meyer':
      return contraHemifield(side!, p.x) && p.y > 0;
    case 'parietal':
      return contraHemifield(side!, p.x) && p.y < 0;
  }
}

export function emptyGrid(): Grid {
  return Array.from({ length: GRID_N }, () => Array.from({ length: GRID_N }, () => false));
}
export function gridFrom(pred: (p: FieldPoint) => boolean): Grid {
  return Array.from({ length: GRID_N }, (_, row) => Array.from({ length: GRID_N }, (_, col) => pred(cellCenter(col, row))));
}

/** Field defect produced by a lesion, per eye, in FIELD coordinates. */
export function fieldDefect(l: Lesion | null): FieldDefect {
  if (!l) return { R: emptyGrid(), L: emptyGrid() };
  if (l.site !== 'chiasm' && !l.side) throw new Error('Lesion side required.');
  return { R: gridFrom((p) => lost(l, 'R', p)), L: gridFrom((p) => lost(l, 'L', p)) };
}

/** Retinal map of a field grid: cell (col,row) in RETINA coordinates is lost when the field point it receives is lost. */
export function retinaGrid(g: Grid): Grid {
  return gridFrom((r) => {
    const f = retinaToField(r);
    const c = cellOf(f);
    return g[c.row][c.col];
  });
}

export function gridsEqual(a: Grid, b: Grid): boolean {
  return a.every((row, i) => row.every((v, j) => v === b[i][j]));
}
export function defectsEqual(a: FieldDefect, b: FieldDefect): boolean {
  return gridsEqual(a.R, b.R) && gridsEqual(a.L, b.L);
}
const anyLost = (g: Grid) => g.some((r) => r.some(Boolean));

export function patternName(l: Lesion): string {
  const contra = l.side ? EYE_WORD[other(l.side)] : '';
  switch (l.site) {
    case 'optic-nerve':
      return `${EYE_WORD[l.side!]} eye only: ${l.variant === 'central-scotoma' ? 'central scotoma' : 'monocular field loss'}`;
    case 'chiasm':
      return 'Bitemporal hemianopia';
    case 'optic-tract':
    case 'lgn':
      return `${contra} homonymous hemianopia`;
    case 'occipital':
      return `${contra} homonymous hemianopia${l.variant === 'macular-sparing' ? ' with macular sparing' : ''}`;
    case 'meyer':
      return `${contra} homonymous superior quadrantanopia`;
    case 'parietal':
      return `${contra} homonymous inferior quadrantanopia`;
  }
}

export const NO_LOSS = 'No field loss on this coarse grid';
export const UNCLASSIFIED = 'Unclassified pattern (not one of the modelled teaching patterns)';

export function classify(d: FieldDefect): { name: string; matched: boolean } {
  if (!anyLost(d.R) && !anyLost(d.L)) return { name: NO_LOSS, matched: true };
  const hit = ALL_LESIONS.find((l) => defectsEqual(fieldDefect(l), d));
  return hit ? { name: patternName(hit), matched: true } : { name: UNCLASSIFIED, matched: false };
}

/** All modelled lesion sites consistent with a pattern. Several may fit — the model says so instead of inventing certainty. */
export function localize(d: FieldDefect): { candidates: Lesion[]; note: string } {
  const candidates = ALL_LESIONS.filter((l) => defectsEqual(fieldDefect(l), d));
  let note: string;
  if (!anyLost(d.R) && !anyLost(d.L)) note = 'No loss on this coarse grid — a normal schematic result does not exclude a small or subtle defect.';
  else if (candidates.length === 0) note = 'No single modelled lesion produces this pattern: consider more than one lesion, an artifact, or unreliable testing.';
  else if (candidates.length === 1) {
    const c = candidates[0];
    note = c.variant === 'macular-sparing' ? 'Macular sparing points towards the occipital cortex in teaching models; it is suggestive, not an absolute rule.' : `Only one modelled site produces this pattern${c.site === 'optic-nerve' ? ' (pre-chiasmal: one eye only)' : ''}.`;
  } else note = `${candidates.length} modelled sites produce this same pattern. Congruity (tract: classically incongruous; occipital: congruous) and associated findings help separate them; the coarse grid does not.`;
  return { candidates, note };
}

// ------------------------------------------------------------ quadrant summaries (prediction / confrontation)

export type QuadKey = 'sup-left' | 'sup-right' | 'inf-left' | 'inf-right';
export const QUADS: QuadKey[] = ['sup-left', 'sup-right', 'inf-left', 'inf-right'];
export interface Summary { quads: Record<QuadKey, boolean>; central: boolean }
export type SummaryPair = Record<Eye, Summary>;

export const quadOf = (p: FieldPoint): QuadKey => `${p.y > 0 ? 'sup' : 'inf'}-${p.x > 0 ? 'right' : 'left'}` as QuadKey;

/** Quadrant "lost" when ≥ 50 % of its peripheral cells (beyond the central region) are lost; central = any central cell lost. */
export function summarize(g: Grid): Summary {
  const cnt: Record<QuadKey, [number, number]> = { 'sup-left': [0, 0], 'sup-right': [0, 0], 'inf-left': [0, 0], 'inf-right': [0, 0] };
  let central = false;
  g.forEach((r, row) =>
    r.forEach((v, col) => {
      const p = cellCenter(col, row);
      if (ecc(p) < CENTRAL_RADIUS_DEG) central ||= v;
      else {
        cnt[quadOf(p)][1]++;
        if (v) cnt[quadOf(p)][0]++;
      }
    }),
  );
  const quads = Object.fromEntries(QUADS.map((q) => [q, cnt[q][0] / cnt[q][1] >= 0.5])) as Record<QuadKey, boolean>;
  return { quads, central };
}
export const summarizeDefect = (d: FieldDefect): SummaryPair => ({ R: summarize(d.R), L: summarize(d.L) });
export const blankSummary = (): Summary => ({ quads: { 'sup-left': false, 'sup-right': false, 'inf-left': false, 'inf-right': false }, central: false });

const sumEq = (a: Summary, b: Summary) => a.central === b.central && QUADS.every((q) => a.quads[q] === b.quads[q]);
const rot180 = (s: Summary): Summary => ({ central: s.central, quads: { 'sup-left': s.quads['inf-right'], 'sup-right': s.quads['inf-left'], 'inf-left': s.quads['sup-right'], 'inf-right': s.quads['sup-left'] } });
const mirrorLR = (s: Summary): Summary => ({ central: s.central, quads: { 'sup-left': s.quads['sup-right'], 'sup-right': s.quads['sup-left'], 'inf-left': s.quads['inf-right'], 'inf-right': s.quads['inf-left'] } });

export function quadName(q: QuadKey): string {
  return `${q.startsWith('sup') ? 'superior' : 'inferior'} patient-${q.endsWith('left') ? 'left' : 'right'}`;
}
export function quadHalf(eye: Eye, q: QuadKey): Horizontal {
  return fieldHalf(eye, q.endsWith('right') ? 1 : -1);
}

export interface PredictionGrade {
  correct: boolean;
  matches: number;
  total: number;
  items: string[];
  misconceptionIds: string[];
}
/** Compare a learner's predicted map with the model. Detects a retina-frame (inverted) or mirrored answer. */
export function comparePrediction(pred: SummaryPair, truth: FieldDefect): PredictionGrade {
  const t = summarizeDefect(truth);
  let matches = 0;
  const items: string[] = [];
  for (const e of ['R', 'L'] as Eye[]) {
    for (const q of QUADS) {
      if (pred[e].quads[q] === t[e].quads[q]) matches++;
      else items.push(`${EYE_WORD[e]} eye, ${quadName(q)} (${quadHalf(e, q)}) quadrant: model says ${t[e].quads[q] ? 'lost' : 'seen'}.`);
    }
    if (pred[e].central === t[e].central) matches++;
    else items.push(`${EYE_WORD[e]} eye, central field: model says ${t[e].central ? 'involved' : 'spared'}.`);
  }
  const correct = items.length === 0;
  const mis: string[] = [];
  if (!correct) {
    const inverted = (['R', 'L'] as Eye[]).every((e) => sumEq(pred[e], rot180(t[e])));
    const mirrored = (['R', 'L'] as Eye[]).every((e) => sumEq(pred[e], mirrorLR(t[e])));
    if (inverted || mirrored) {
      mis.push('M-FIELD-VS-RETINA');
      items.unshift(inverted ? 'Your map matches the RETINAL image (inverted and reversed), not the field as the patient sees it.' : 'Your map is the mirror image of the field (patient left/right swapped) — as if drawn from the examiner\'s side.');
    }
  }
  return { correct, matches, total: 10, items, misconceptionIds: mis };
}

// ------------------------------------------------------------ confrontation (T037)

export interface ConfrontationCase {
  id: string;
  vignette: string;
  truth: Lesion | null;
  /** Authored reliability variant: in these eyes the patient keeps glancing toward the stimulus. */
  fixationLoss: Eye[];
}
export interface ConfrontationObs { fixation: 'steady' | 'shifted toward your hand'; report: 'counts your fingers correctly' | 'does not see your fingers' }

export function confrontationResponse(c: ConfrontationCase, eye: Eye, q: QuadKey): ConfrontationObs {
  if (c.fixationLoss.includes(eye)) return { fixation: 'shifted toward your hand', report: 'counts your fingers correctly' };
  const s = summarize(fieldDefect(c.truth)[eye]);
  return { fixation: 'steady', report: s.quads[q] ? 'does not see your fingers' : 'counts your fingers correctly' };
}
/** Face to face, the patient's left is on the examiner's right. */
export function examinerHand(q: QuadKey): string {
  return `your ${q.endsWith('left') ? 'right' : 'left'} side, ${q.startsWith('sup') ? 'upper' : 'lower'}`;
}

export const CONFRONTATION_CASES: ConfrontationCase[] = [
  { id: 'CF-1', vignette: 'Fictional: a 66-year-old reports walking into door frames on the left for two weeks.', truth: { site: 'occipital', side: 'R', variant: 'complete' }, fixationLoss: [] },
  { id: 'CF-2', vignette: 'Fictional: a 45-year-old with months of headache notices clipping cars on both sides when driving.', truth: { site: 'chiasm', side: null }, fixationLoss: [] },
  { id: 'CF-3', vignette: 'Fictional: a 71-year-old with a vague sense of "something missing" on the left; anxious and keeps looking around.', truth: { site: 'meyer', side: 'R' }, fixationLoss: ['R'] },
  { id: 'CF-4', vignette: 'Fictional: a 58-year-old reports the lower right of the world "disappearing" when reading.', truth: { site: 'parietal', side: 'L' }, fixationLoss: [] },
];

// ------------------------------------------------------------ static perimetry teaching plot (T039)

/** Generic teaching plot levels: 0 = seen, 1 = relatively depressed, 2 = not seen. Not an instrument printout. */
export type LevelGrid = (0 | 1 | 2)[][];
export interface PerimetryReport {
  id: string;
  levels: Record<Eye, LevelGrid>;
  /** Authored qualitative statements — no numeric cutoffs, no normative database. */
  reliability: string[];
  technicianNote?: string;
  reliable: boolean;
  /** Expected interpretation key: a pattern name, ARTIFACT or REPEAT. */
  answer: string;
  explanation: string;
}
export const ARTIFACT = 'Peripheral ring consistent with a lens-rim artifact — repeat with the lens correctly placed';
export const REPEAT = 'Not interpretable: reliability is poor — repeat the test before localizing';

const toLevels = (g: Grid): LevelGrid => g.map((r) => r.map((v) => (v ? 2 : 0)));

export function perimetryFromLesion(id: string, l: Lesion | null, explanation: string): PerimetryReport {
  const d = fieldDefect(l);
  return { id, levels: { R: toLevels(d.R), L: toLevels(d.L) }, reliability: ['Fixation: authored as steady throughout.', 'Responses with no stimulus shown: authored as rare.', 'Missed brighter stimuli in seen areas: authored as rare.'], reliable: true, answer: l ? patternName(l) : NO_LOSS, explanation };
}

export const PERIMETRY_REPORTS: PerimetryReport[] = [
  perimetryFromLesion('PR-A', { site: 'occipital', side: 'R', variant: 'macular-sparing' }, 'Left hemifield lost in both eyes, respecting the vertical meridian, with the central region spared: congruous left homonymous hemianopia with macular sparing → right retrochiasmal, most suggestive of occipital cortex.'),
  perimetryFromLesion('PR-B', { site: 'chiasm', side: null }, 'Temporal hemifield lost in each eye, respecting the vertical meridian: bitemporal hemianopia → chiasm.'),
  {
    id: 'PR-C',
    levels: {
      R: gridFrom((p) => (Math.round(p.x * 7 + p.y * 3) % 5 === 0)).map((r) => r.map((v) => (v ? 2 : 0))),
      L: gridFrom((p) => (Math.round(p.x * 3 - p.y * 5) % 4 === 0)).map((r) => r.map((v) => (v ? 1 : 0))),
    },
    reliability: ['Fixation: authored as frequently lost — the patient often looked toward stimuli.', 'Responses with no stimulus shown: authored as frequent (trigger-happy responding).', 'Missed brighter stimuli in seen areas: authored as occasional.'],
    reliable: false,
    answer: REPEAT,
    explanation: 'Scattered defects that do not respect a meridian, with poor fixation and many responses without a stimulus: the result is unreliable. Document that, explain the task again and repeat — do not localize from it.',
  },
  {
    id: 'PR-D',
    levels: { R: gridFrom((p) => Math.max(Math.abs(p.x), Math.abs(p.y)) > 25).map((r) => r.map((v) => (v ? 2 : 0))), L: toLevels(emptyGrid()) },
    reliability: ['Fixation: authored as steady.', 'Responses with no stimulus shown: authored as rare.', 'Missed brighter stimuli in seen areas: authored as rare.'],
    technicianNote: 'Right eye tested with a trial lens; the lens holder was noted to sit further from the eye than usual.',
    reliable: true,
    answer: ARTIFACT,
    explanation: 'A sharp ring of loss at the edge of the tested area in one eye, with a lens placement note: consistent with a lens-rim artifact rather than a pathway lesion. Repeat with correct lens position.',
  },
];
