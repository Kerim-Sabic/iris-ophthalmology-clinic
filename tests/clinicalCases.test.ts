import { describe, expect, it } from 'vitest';
import { CLINICAL_CASES, clinicalNote, evidenceOf, expectedFieldPattern, expectedLocalisation, gradeClinical, observe, validateClinicalCase, type ClinicalAction, type ClinicalAnswer } from '../src/domain/cases';
import { QUADS } from '../src/domain/fields';

const byLabel = (l: string) => CLINICAL_CASES.find((c) => c.label === l)!;
const fullExam = (): ClinicalAction[] => [
  { kind: 'va', eye: 'OD', pinhole: false }, { kind: 'va', eye: 'OS', pinhole: false },
  { kind: 'pupil', test: 'light-dark' }, { kind: 'pupil', test: 'swing' },
  { kind: 'perimetry' }, { kind: 'cover', sequence: ['OD', 'none', 'OS', 'none'] },
];

describe('clinical case engine', () => {
  it('all cases pass cross-station coherence checks and cover the required families', () => {
    for (const c of CLINICAL_CASES) expect(validateClinicalCase(c)).toEqual([]);
    expect(new Set(CLINICAL_CASES.map((c) => c.family))).toEqual(new Set(['afferent-pathway', 'visual-pathway', 'alignment', 'efferent-pupil']));
  });
  it('validator rejects incoherent variants', () => {
    const I = byLabel('Patient I');
    expect(validateClinicalCase({ ...I, truth: { ...I.truth, pupil: 'none' } }).join()).toContain('afferent defect');
    const J = byLabel('Patient J');
    expect(validateClinicalCase({ ...J, truth: { ...J.truth, pupil: 'afferent-OS' } }).length).toBeGreaterThan(0);
    expect(validateClinicalCase({ ...J, label: 'Hemianopia case' }).join()).toContain('leaks');
  });
  it('afferent case: swinging light shows both pupils dilating when the light reaches OD (same model as LAB05)', () => {
    const t = observe(byLabel('Patient I'), { kind: 'pupil', test: 'swing' });
    expect(t).toMatch(/light to OD: both dilates/);
    expect(t).toMatch(/light to OS: both constricts/);
    // resting pupils equal in an isolated afferent defect
    const r = observe(byLabel('Patient I'), { kind: 'pupil', test: 'light-dark' });
    const nums = [...r.matchAll(/(\d+\.\d) mm/g)].map((m) => m[1]);
    expect(nums[0]).toBe(nums[1]);
    expect(nums[2]).toBe(nums[3]);
  });
  it('Horner-type case: anisocoria greater in the dark', () => {
    const r = observe(byLabel('Patient M'), { kind: 'pupil', test: 'light-dark' });
    const [lOD, lOS, dOD, dOS] = [...r.matchAll(/(\d+\.\d) mm/g)].map((m) => Number(m[1]));
    expect(Math.abs(dOD - dOS)).toBeGreaterThan(Math.abs(lOD - lOS));
    expect(dOD).toBeLessThan(dOS);
  });
  it('right occipital case: left homonymous loss in both eyes; confrontation agrees with perimetry', () => {
    const J = byLabel('Patient J');
    expect(expectedFieldPattern(J)).toMatch(/^Left homonymous/);
    expect(expectedLocalisation(J)).toBe('retro-right');
    expect(observe(J, { kind: 'confrontation', eye: 'OD', quad: 'sup-left' })).toContain('does not see');
    expect(observe(J, { kind: 'confrontation', eye: 'OS', quad: 'sup-right' })).toContain('counts your fingers');
  });
  it('left esotropia: covering the fixing OD makes OS move out (K2 fixture via LAB06 model)', () => {
    const t = observe(byLabel('Patient L'), { kind: 'cover', sequence: ['OD'] });
    expect(t).toMatch(/Cover OD — watch the uncovered OS: OS moves OUT/);
    expect(observe(byLabel('Patient L'), { kind: 'cover', sequence: ['OS'] })).toMatch(/OD no movement/);
  });
  it('grading: full examination + correct answers → all supported', () => {
    for (const c of CLINICAL_CASES) {
      const ans: ClinicalAnswer = { pupil: c.truth.pupil, fieldPattern: expectedFieldPattern(c), motility: c.truth.motility, localisation: expectedLocalisation(c), next: c.nextActions.find((n) => n.correct)!.value };
      const g = gradeClinical(c, fullExam(), ans);
      expect(g.correct, `${c.id} ${JSON.stringify(g.dims)}`).toBe(true);
    }
  });
  it('documenting a normal finding without examining it is unsupported; "not examined" is honest but incomplete for an abnormal system', () => {
    const I = byLabel('Patient I');
    const base: ClinicalAnswer = { pupil: 'none', fieldPattern: 'not-examined', motility: 'ortho', localisation: 'prechiasmal-OD', next: 'urgent' };
    const g = gradeClinical(I, [{ kind: 'va', eye: 'OD', pinhole: true }], base);
    expect(g.dims.Pupils).toMatch(/^unsupported/);
    expect(g.dims.Alignment).toMatch(/^unsupported/);
    expect(g.dims['Visual fields']).toBe('correctly recorded as not examined');
    expect(g.correct).toBe(false);
  });
  it('misconception detection: afferent/efferent, laterality of homonymous loss, phoria/tropia', () => {
    expect(gradeClinical(byLabel('Patient M'), fullExam(), { pupil: 'afferent-OD', fieldPattern: 'x', motility: 'ortho', localisation: 'none', next: '' }).misconceptionIds).toContain('M-AFFERENT-VS-EFFERENT');
    expect(gradeClinical(byLabel('Patient J'), fullExam(), { pupil: 'none', fieldPattern: 'x', motility: 'ortho', localisation: 'retro-left', next: '' }).misconceptionIds).toContain('M-FIELD-VS-RETINA');
    expect(gradeClinical(byLabel('Patient L'), fullExam(), { pupil: 'none', fieldPattern: 'x', motility: 'esophoria', localisation: 'alignment', next: '' }).misconceptionIds).toContain('M-PHORIA-VS-TROPIA');
  });
  it('evidence requirements and note derive only from performed actions', () => {
    const conf: ClinicalAction[] = (['OD', 'OS'] as const).flatMap((eye) => QUADS.map((quad) => ({ kind: 'confrontation' as const, eye, quad })));
    expect(evidenceOf(conf).fields).toBe(true);
    expect(evidenceOf(conf.slice(0, 7)).fields).toBe(false);
    expect(evidenceOf([{ kind: 'cover', sequence: ['OD', 'none'] }]).cover).toBe(false);
    const note = clinicalNote(byLabel('Patient K'), [{ kind: 'va', eye: 'OD', pinhole: false }]);
    expect(note.join(' ')).toContain('OD distance acuity unaided');
    expect(note.join(' ')).not.toMatch(/pupil|field|cover|OS distance/i);
  });
});
