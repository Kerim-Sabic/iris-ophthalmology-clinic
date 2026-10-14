import { describe, expect, it } from 'vitest';
import { CASES, expectedClass, validateCase } from '../src/domain/cases';
import { planExam } from '../src/domain/exam';
import type { Attempt } from '../src/domain/learning';
import { classify, makeLens, retinoscopy } from '../src/domain/optics';

describe('refraction cases', () => {
  it('all cases pass coherence checks', () => {
    for (const c of CASES) expect(validateCase(c)).toEqual([]);
  });
  it('cover all five regular astigmatic categories plus spherical, presbyopia, anisometropia and non-refractive loss', () => {
    const cls = new Set(CASES.flatMap((c) => [expectedClass(c.eyes.OD), expectedClass(c.eyes.OS)]));
    for (const k of ['simple-myopic-astigmatism', 'compound-myopic-astigmatism', 'simple-hyperopic-astigmatism', 'compound-hyperopic-astigmatism', 'mixed-astigmatism', 'spherical-myopia'] as const) expect(cls.has(k)).toBe(true);
    expect(CASES.some((c) => c.near)).toBe(true);
    expect(CASES.some((c) => Object.values(c.eyes).some((e) => e.nonRefractiveLoss))).toBe(true);
  });
  it('case identifiers and labels do not leak the diagnosis', () => {
    for (const c of CASES) expect(`${c.id} ${c.label}`).not.toMatch(/myop|hyperop|astig|presby|aniso|mixed|simple|compound/i);
  });
  it('validator rejects an incoherent variant', () => {
    const bad = { ...CASES[0], eyes: { ...CASES[0].eyes, OD: { ...CASES[0].eyes.OD, vaPinhole: '6/12' } } };
    expect(validateCase(bad).join()).toContain('pinhole');
  });
  it('retinoscope on the case target neutralises at gross = target + 1/w in each principal meridian', () => {
    const t = CASES.find((c) => c.label === 'Patient E')!.eyes.OD.target; // +1.00 −3.00 × 045
    const at = (lens: ReturnType<typeof makeLens>, streak: number) => retinoscopy(t, lens, streak, 0.5).motion;
    expect(at(makeLens(3), 135)).toBe('neutral'); // streak 135 → measures 045: power +1 + 2
    expect(at(makeLens(0), 45)).toBe('neutral'); // measures 135: −2 + 2 = 0
    expect(classify(t, 'full-distance-correction-relaxed').status).toBe('classified');
  });
});

const att = (familyId: string): Attempt => ({ id: familyId, profileId: 'p', itemId: familyId, itemVersion: 1, contentVersion: '1', familyId, objectiveIds: [], lectureIds: ['L05'], seed: 1, taskType: 't', mode: 'learning', response: null, correct: true, scores: {}, confidence: null, hintLevel: 0, misconceptionIds: [], startedAt: 0, submittedAt: 0 });

describe('exam planning', () => {
  const mcqs = [
    { id: 'Q1', familyId: 'FA', lectureId: 'L05', pool: 'exam' as const, reviewStatus: 'draft' },
    { id: 'Q2', familyId: 'FA', lectureId: 'L05', pool: 'exam' as const, reviewStatus: 'draft' },
    { id: 'Q3', familyId: 'FB', lectureId: 'L05', pool: 'exam' as const, reviewStatus: 'quarantined' },
    { id: 'Q4', familyId: 'FC', lectureId: 'L05', pool: 'practice' as const, reviewStatus: 'draft' },
    { id: 'Q5', familyId: 'FD', lectureId: 'L09', pool: 'exam' as const, reviewStatus: 'draft' },
  ];
  const optics = [{ id: 'F-COMPOSE', pool: 'exam' as const, lectureIds: ['L05'] }, { id: 'F-MERID-PREDICT', pool: 'practice' as const, lectureIds: ['L05'] }];
  const s = { lectureIds: ['L05'], count: 10, timed: false, minutes: null, allowPracticedFamilies: false, seed: 3 };
  it('uses only exam-pool, non-quarantined, one item per family, warns instead of recycling', () => {
    const p = planExam(s, mcqs, optics, [], []);
    expect(p.items.map((i) => i.familyId).sort()).toEqual(['F-COMPOSE', 'FA']);
    expect(p.warning).toContain('Only 2');
  });
  it('excludes practised families unless allowed; excludes flagged items', () => {
    expect(planExam(s, mcqs, optics, [att('F-COMPOSE')], []).items.map((i) => i.familyId)).toEqual(['FA']);
    expect(planExam({ ...s, allowPracticedFamilies: true }, mcqs, optics, [att('F-COMPOSE')], []).items).toHaveLength(2);
    expect(planExam(s, mcqs, optics, [], ['Q1', 'Q2']).items.map((i) => i.familyId)).toEqual(['F-COMPOSE']);
  });
  it('zero selected lectures → empty with warning; reproducible snapshot', () => {
    const z = planExam({ ...s, lectureIds: [] }, mcqs, optics, [], []);
    expect(z.items).toHaveLength(0);
    expect(z.warning).toContain('No lectures');
    expect(planExam(s, mcqs, optics, [], [])).toEqual(planExam(s, mcqs, optics, [], []));
  });
});
