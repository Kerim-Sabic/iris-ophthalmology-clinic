import { describe, expect, it } from 'vitest';
import {
  COLOUR_ADMIN_STEPS, LOW_VISION_ORDER, PATIENTS, amslerArea, amslerKey, chartObservation, compareAmsler, convertSnellen, gradeLowVisionRecord,
  gradeNearRecord, gradeSnellenRecord, interpretPinhole, letterByLetterLogMAR, lowVisionLogMAR, lowVisionResponse, parseLowVision, parseNear,
  parseSnellen, recordLogMAR, sequenceScore, type AmslerMap,
} from '../src/domain/acuity';

describe('Snellen conversions', () => {
  it('6/6 → decimal 1 → logMAR 0', () => {
    const c = convertSnellen({ num: 6, den: 6 });
    expect(c.decimal).toBe(1);
    expect(c.logMAR).toBe(0);
    expect(Object.is(c.logMAR2, -0)).toBe(false);
  });
  it('6/60 → logMAR 1.0, decimal 0.1', () => {
    const c = convertSnellen({ num: 6, den: 60 });
    expect(c.decimal).toBeCloseTo(0.1, 12);
    expect(c.logMAR).toBeCloseTo(1, 12);
  });
  it('3/60 recorded at 3 m equals decimal 0.05 (6/120 equivalent), logMAR 1.3', () => {
    const c = convertSnellen({ num: 3, den: 60 });
    expect(c.decimal).toBeCloseTo(0.05, 12);
    expect(c.equiv6m).toBe(120);
    expect(c.logMAR2).toBe(1.3);
  });
  it('rounds conversions to two decimals', () => {
    expect(convertSnellen({ num: 6, den: 9 }).decimal2).toBe(0.67);
    expect(convertSnellen({ num: 6, den: 9 }).logMAR2).toBe(0.18);
    expect(convertSnellen({ num: 6, den: 18 }).logMAR2).toBe(0.48);
    expect(convertSnellen({ num: 6, den: 5 }).logMAR2).toBe(-0.08);
    expect(convertSnellen({ num: 20, den: 40 }).logMAR2).toBe(0.3);
  });
  it('letter-by-letter scoring under the stated 5-letter protocol', () => {
    expect(letterByLetterLogMAR(0.3, 2)).toBe(0.26);
    expect(letterByLetterLogMAR(0, 0)).toBe(0);
    expect(() => letterByLetterLogMAR(0.3, 5)).toThrow();
  });
});

describe('distance recording (T001)', () => {
  it('records test distance as numerator: an eye equivalent to 6/120 reads 3/60 at 3 m and nothing at 6 m', () => {
    const t = { kind: 'chart' as const, equiv6m: 120 };
    expect(chartObservation(t, 6).kind).toBe('none');
    expect(chartObservation(t, 3)).toEqual({ kind: 'line', distanceM: 3, line: 60 });
    expect(gradeSnellenRecord('3/60', chartObservation(t, 3)).correct).toBe(true);
    const g = gradeSnellenRecord('6/120', chartObservation(t, 3));
    expect(g.correct).toBe(false);
    expect(g.misconceptionIds).toContain('M-VA-NORMALISED-DISTANCE');
  });
  it('detects swapped fractions and parses notation', () => {
    const o = chartObservation({ kind: 'chart', equiv6m: 12 }, 6);
    expect(gradeSnellenRecord('6 / 12', o).correct).toBe(true);
    expect(gradeSnellenRecord('12/6', o).items[0]).toMatch(/swapped/);
    expect(parseSnellen('abc')).toBeNull();
  });
});

describe('very low acuity (T004)', () => {
  it('has no numeric logMAR for CF/HM/LP/NLP', () => {
    for (const c of LOW_VISION_ORDER) {
      expect(lowVisionLogMAR(c)).toBeNull();
      expect(recordLogMAR({ category: c, distanceM: 1 }).value).toBeNull();
    }
    expect(recordLogMAR({ num: 6, den: 60 }).value).toBe(1);
  });
  it('requires distance for CF and HM, parses notation', () => {
    expect(parseLowVision('CF at 1 m')).toEqual({ category: 'CF', distanceM: 1 });
    expect(parseLowVision('hm 50cm')).toEqual({ category: 'HM', distanceM: 0.5 });
    expect(parseLowVision('PL')).toEqual({ category: 'LP', distanceM: undefined });
    const t = { kind: 'low' as const, category: 'CF' as const, distanceM: 1 };
    expect(gradeLowVisionRecord('CF at 1 m', t).correct).toBe(true);
    expect(gradeLowVisionRecord('CF', t).correct).toBe(false);
    expect(gradeLowVisionRecord('HM at 1 m', t).correct).toBe(false);
  });
  it('responses follow the hierarchy CF → HM → LP → NLP', () => {
    const t = { kind: 'low' as const, category: 'HM' as const, distanceM: 0.5 };
    expect(lowVisionResponse(t, 'CF', 0.5)).toBe(false);
    expect(lowVisionResponse(t, 'HM', 1)).toBe(false);
    expect(lowVisionResponse(t, 'HM', 0.5)).toBe(true);
    expect(lowVisionResponse(t, 'LP')).toBe(true);
    expect(lowVisionResponse({ kind: 'low', category: 'NLP' }, 'LP')).toBe(false);
  });
});

describe('pinhole (T005)', () => {
  it('never returns "no disease"', () => {
    const pairs = [[{ num: 6, den: 36 }, { num: 6, den: 9 }], [{ num: 6, den: 18 }, { num: 6, den: 18 }], [{ num: 6, den: 9 }, { num: 6, den: 18 }], [{ category: 'CF' as const, distanceM: 1 }, { category: 'CF' as const, distanceM: 1 }]] as const;
    for (const [a, b] of pairs) {
      const r = interpretPinhole(a, b);
      expect(r.excludesDisease).toBe(false);
      expect(r.statement).not.toMatch(/no (eye )?disease|normal eye|excludes disease/i);
    }
    expect(interpretPinhole({ num: 6, den: 36 }, { num: 6, den: 9 }).change).toBe('improved');
    expect(interpretPinhole({ num: 6, den: 36 }, { num: 6, den: 9 }).statement).toMatch(/does not exclude/);
    expect(interpretPinhole({ num: 6, den: 18 }, { num: 6, den: 18 }).change).toBe('no-change');
  });
});

describe('near (T003)', () => {
  it('requires N-notation with working distance; rejects mixed notations', () => {
    expect(parseNear('N8 at 40 cm')).toEqual({ size: 8, distanceCm: 40 });
    expect(gradeNearRecord('N5 at 40 cm', { size: 5, distanceCm: 40 }).correct).toBe(true);
    expect(gradeNearRecord('N5', { size: 5, distanceCm: 40 }).correct).toBe(false);
    expect(gradeNearRecord('J2', { size: 5, distanceCm: 40 }).misconceptionIds).toContain('M-NEAR-NOTATION-MIX');
  });
});

describe('Amsler (T010)', () => {
  const truth = amslerArea({ cx: 2, cy: 2, missingR: 1.2, distortR: 3 });
  it('perfect marking scores 1 and passes', () => {
    const g = compareAmsler(new Map(truth), truth);
    expect(g.dice).toBe(1);
    expect(g.correct).toBe(true);
  });
  it('mirrored marking (wrong side) fails with a laterality message', () => {
    const mirrored: AmslerMap = new Map();
    for (const [k, v] of truth) {
      const [c, r] = k.split(',').map(Number);
      mirrored.set(amslerKey(19 - c, r), v);
    }
    const g = compareAmsler(mirrored, truth);
    expect(g.correct).toBe(false);
    expect(g.items.join(' ')).toMatch(/wrong side horizontally/);
  });
  it('partial overlap gives an intermediate Dice', () => {
    const half: AmslerMap = new Map([...truth].slice(0, Math.ceil(truth.size / 2)));
    const g = compareAmsler(half, truth);
    expect(g.dice).toBeGreaterThan(0.5);
    expect(g.dice).toBeLessThan(1);
    expect(compareAmsler(new Map(), new Map()).correct).toBe(true);
  });
});

describe('authored patients and colour sequence', () => {
  it('each patient has both eyes with all corrections', () => {
    for (const p of PATIENTS) for (const e of ['R', 'L'] as const) expect(Object.keys(p.eyes[e].distance).sort()).toEqual(['own-glasses', 'pinhole', 'unaided']);
  });
  it('colour administration sequence scoring', () => {
    expect(sequenceScore([...COLOUR_ADMIN_STEPS]).correctPositions).toBe(COLOUR_ADMIN_STEPS.length);
    expect(sequenceScore([...COLOUR_ADMIN_STEPS].reverse()).correctPositions).toBeLessThan(COLOUR_ADMIN_STEPS.length);
  });
});
