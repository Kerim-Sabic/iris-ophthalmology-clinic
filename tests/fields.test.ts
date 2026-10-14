import { describe, expect, it } from 'vitest';
import {
  ALL_LESIONS, ARTIFACT, CONFRONTATION_CASES, PERIMETRY_REPORTS, REPEAT, cellCenter, classify, comparePrediction, confrontationResponse,
  examinerHand, fieldDefect, fieldHalf, fieldQuadrantToRetina, fieldToRetina, lesionKey, localize, retinaGrid, retinaHalf, retinaToField,
  summarize, summarizeDefect, type Eye, type Grid, type Lesion,
} from '../src/domain/fields';

const allCells = (g: Grid, pred: (x: number, y: number) => boolean) => g.every((r, row) => r.every((v, col) => { const p = cellCenter(col, row); return v === pred(p.x, p.y); }));
const none = (g: Grid) => g.every((r) => r.every((v) => !v));
const keys = (ls: Lesion[]) => ls.map(lesionKey).sort();

describe('field ↔ retina coordinates', () => {
  it('temporal field maps to nasal retina, superior field to inferior retina, in both eyes', () => {
    for (const eye of ['R', 'L'] as Eye[]) {
      expect(fieldQuadrantToRetina(eye, { h: 'temporal', v: 'superior' })).toEqual({ h: 'nasal', v: 'inferior' });
      expect(fieldQuadrantToRetina(eye, { h: 'nasal', v: 'inferior' })).toEqual({ h: 'temporal', v: 'superior' });
    }
  });
  it('right eye temporal field is the patient-right side; left eye temporal field is patient-left', () => {
    expect(fieldHalf('R', 10)).toBe('temporal');
    expect(fieldHalf('L', 10)).toBe('nasal');
    expect(fieldHalf('L', -10)).toBe('temporal');
    expect(retinaHalf('R', fieldToRetina({ x: 10, y: 0.5 }).x)).toBe('nasal');
    expect(retinaHalf('L', fieldToRetina({ x: -10, y: 0.5 }).x)).toBe('nasal');
  });
  it('round trips field → retina → field', () => {
    for (const p of [{ x: 3, y: -21 }, { x: -27, y: 15 }, { x: 0.5, y: 0.25 }]) {
      expect(retinaToField(fieldToRetina(p))).toEqual(p);
      expect(fieldToRetina(retinaToField(p))).toEqual(p);
    }
  });
  it('retinal map of a left hemianopia lies on the patient-right side of each retina', () => {
    const d = fieldDefect({ site: 'occipital', side: 'R', variant: 'complete' });
    expect(allCells(retinaGrid(d.R), (x) => x > 0)).toBe(true);
    expect(allCells(retinaGrid(d.L), (x) => x > 0)).toBe(true);
  });
});

describe('lesion → field defect', () => {
  it('RIGHT retrochiasmal lesions give LEFT homonymous loss in BOTH eyes', () => {
    for (const l of [{ site: 'optic-tract', side: 'R' }, { site: 'lgn', side: 'R' }, { site: 'occipital', side: 'R', variant: 'complete' }] as Lesion[]) {
      const d = fieldDefect(l);
      expect(allCells(d.R, (x) => x < 0)).toBe(true);
      expect(allCells(d.L, (x) => x < 0)).toBe(true);
      expect(classify(d).name).toBe('Left homonymous hemianopia');
    }
    for (const site of ['meyer', 'parietal'] as const) {
      const d = fieldDefect({ site, side: 'R' });
      for (const e of ['R', 'L'] as Eye[]) expect(d[e].every((r, row) => r.every((v, col) => !v || cellCenter(col, row).x < 0))).toBe(true);
    }
  });
  it('laterality is never swapped for any retrochiasmal lesion', () => {
    for (const l of ALL_LESIONS.filter((l) => !['optic-nerve', 'chiasm'].includes(l.site))) {
      const d = fieldDefect(l);
      const sideSign = l.side === 'R' ? -1 : 1;
      for (const e of ['R', 'L'] as Eye[]) d[e].forEach((r, row) => r.forEach((v, col) => v && expect(Math.sign(cellCenter(col, row).x)).toBe(sideSign)));
    }
  });
  it('chiasm → bitemporal hemianopia', () => {
    const d = fieldDefect({ site: 'chiasm', side: null });
    expect(allCells(d.R, (x) => x > 0)).toBe(true);
    expect(allCells(d.L, (x) => x < 0)).toBe(true);
    expect(classify(d).name).toBe('Bitemporal hemianopia');
  });
  it('right optic nerve → right eye only', () => {
    const d = fieldDefect({ site: 'optic-nerve', side: 'R', variant: 'complete' });
    expect(allCells(d.R, () => true)).toBe(true);
    expect(none(d.L)).toBe(true);
    const c = fieldDefect({ site: 'optic-nerve', side: 'R', variant: 'central-scotoma' });
    expect(none(c.L)).toBe(true);
    expect(summarize(c.R).central).toBe(true);
    expect(Object.values(summarize(c.R).quads).some(Boolean)).toBe(false);
  });
  it("Meyer's loop → superior quadrant; parietal → inferior quadrant", () => {
    const m = summarizeDefect(fieldDefect({ site: 'meyer', side: 'R' }));
    const p = summarizeDefect(fieldDefect({ site: 'parietal', side: 'R' }));
    for (const e of ['R', 'L'] as Eye[]) {
      expect(m[e].quads).toEqual({ 'sup-left': true, 'sup-right': false, 'inf-left': false, 'inf-right': false });
      expect(p[e].quads).toEqual({ 'sup-left': false, 'sup-right': false, 'inf-left': true, 'inf-right': false });
    }
    expect(classify(fieldDefect({ site: 'meyer', side: 'R' })).name).toBe('Left homonymous superior quadrantanopia');
    expect(classify(fieldDefect({ site: 'parietal', side: 'L' })).name).toBe('Right homonymous inferior quadrantanopia');
  });
  it('macular-sparing variant spares the centre of the affected hemifield', () => {
    const s = summarizeDefect(fieldDefect({ site: 'occipital', side: 'R', variant: 'macular-sparing' }));
    expect(s.R.central).toBe(false);
    expect(s.R.quads['sup-left'] && s.R.quads['inf-left']).toBe(true);
  });
});

describe('localize', () => {
  it('returns all consistent sites for a homonymous hemianopia', () => {
    const r = localize(fieldDefect({ site: 'optic-tract', side: 'R' }));
    expect(keys(r.candidates)).toEqual(keys([{ site: 'optic-tract', side: 'R' }, { site: 'lgn', side: 'R' }, { site: 'occipital', side: 'R', variant: 'complete' }]));
    expect(r.note).toMatch(/3 modelled sites/);
  });
  it('macular sparing and chiasm localize uniquely; unmodelled patterns return none', () => {
    expect(localize(fieldDefect({ site: 'occipital', side: 'L', variant: 'macular-sparing' })).candidates).toHaveLength(1);
    expect(keys(localize(fieldDefect({ site: 'chiasm', side: null })).candidates)).toEqual(['chiasm|-|complete']);
    const odd = fieldDefect({ site: 'meyer', side: 'R' });
    odd.R[9][9] = true;
    expect(localize(odd).candidates).toHaveLength(0);
    expect(classify(odd).matched).toBe(false);
  });
  it('every modelled lesion localizes back to a candidate set that includes itself', () => {
    for (const l of ALL_LESIONS) expect(keys(localize(fieldDefect(l)).candidates)).toContain(lesionKey(l));
  });
});

describe('prediction grading and confrontation', () => {
  it('accepts the correct map and flags an inverted (retinal) or mirrored map', () => {
    const d = fieldDefect({ site: 'meyer', side: 'R' });
    expect(comparePrediction(summarizeDefect(d), d).correct).toBe(true);
    const retinal = summarizeDefect({ R: retinaGrid(d.R), L: retinaGrid(d.L) });
    const g = comparePrediction(retinal, d);
    expect(g.correct).toBe(false);
    expect(g.misconceptionIds).toContain('M-FIELD-VS-RETINA');
    const hemi = fieldDefect({ site: 'optic-tract', side: 'R' });
    const mirrored = summarizeDefect(fieldDefect({ site: 'optic-tract', side: 'L' }));
    expect(comparePrediction(mirrored, hemi).misconceptionIds).toContain('M-FIELD-VS-RETINA');
  });
  it('confrontation responses follow the field model; fixation loss makes them unreliable, not diagnostic', () => {
    const c = CONFRONTATION_CASES[0];
    expect(confrontationResponse(c, 'R', 'sup-left').report).toBe('does not see your fingers');
    expect(confrontationResponse(c, 'L', 'inf-right').report).toBe('counts your fingers correctly');
    const unreliable = CONFRONTATION_CASES.find((x) => x.fixationLoss.length)!;
    const o = confrontationResponse(unreliable, unreliable.fixationLoss[0], 'sup-left');
    expect(o.fixation).toBe('shifted toward your hand');
    expect(examinerHand('sup-left')).toMatch(/your right side, upper/);
  });
  it('perimetry reports: reliable ones have pattern answers; unreliable/artifact ones do not localize', () => {
    for (const r of PERIMETRY_REPORTS) {
      if (!r.reliable) expect(r.answer).toBe(REPEAT);
      if (r.technicianNote) expect(r.answer).toBe(ARTIFACT);
    }
    expect(PERIMETRY_REPORTS[0].answer).toBe('Left homonymous hemianopia with macular sparing');
  });
});
