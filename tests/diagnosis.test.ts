import { describe, expect, it } from 'vitest';
import {
  LECTURE_EXAMPLES, derivationSteps, diagnoseEye, diagnosePair, explainToken, generateExercise, gradePair, parseVisusLine,
  parseWrittenDiagnosis, type PairAnswer,
} from '../src/domain/diagnosis';

// Expected answers worked out by hand from the lens (principal meridian signs), independent of the engine.
const EXPECTED: { od: [string, string | null, boolean?]; os: [string, string | null, boolean?]; aniso: 'expected' | 'optional' | 'no' }[] = [
  { od: ['spherical-myopia', null], os: ['simple-myopic-astigmatism', 'rectus'], aniso: 'no' },
  { od: ['emmetropic', null], os: ['spherical-hyperopia', null], aniso: 'expected' },
  { od: ['spherical-myopia', null], os: ['compound-myopic-astigmatism', 'rectus'], aniso: 'no' },
  { od: ['emmetropic', null], os: ['spherical-myopia', null], aniso: 'no' },
  { od: ['spherical-hyperopia', null, true], os: ['spherical-hyperopia', null], aniso: 'expected' },
  { od: ['compound-hyperopic-astigmatism', 'inversus'], os: ['simple-hyperopic-astigmatism', 'inversus'], aniso: 'optional' },
  { od: ['spherical-myopia', null], os: ['compound-myopic-astigmatism', 'rectus'], aniso: 'no' },
  { od: ['simple-myopic-astigmatism', 'rectus'], os: ['mixed-astigmatism', 'inversus'], aniso: 'no' },
];

const clsOf = (d: ReturnType<typeof diagnoseEye>) => (d.outcome.kind === 'refractive' ? d.outcome.cls : d.outcome.kind === 'emmetropic-by-acuity' ? 'emmetropic' : 'insufficient');
const orOf = (d: ReturnType<typeof diagnoseEye>) => (d.outcome.kind === 'refractive' ? d.outcome.orientation : null);
const bcOf = (d: ReturnType<typeof diagnoseEye>) => (d.outcome.kind === 'refractive' ? d.outcome.bcvaReduced : false);

describe("professor's lecture examples", () => {
  it('there are 8 pairs, exactly as given', () => {
    expect(LECTURE_EXAMPLES).toHaveLength(8);
    expect(LECTURE_EXAMPLES[2].lines[1]).toBe('VOS: sc 0.7, cc -.0.50 dsph -1.00 dcyl ax 170 1.0?');
  });
  LECTURE_EXAMPLES.forEach((ex, i) => {
    it(`pair ${i + 1}: ${ex.lines.join(' | ')}`, () => {
      const lines = ex.lines.map(parseVisusLine);
      for (const l of lines) expect(l.errors).toEqual([]);
      const pd = diagnosePair(lines);
      const [od, os] = pd.eyes;
      expect(od.eye).toBe('OD');
      expect(os.eye).toBe('OS');
      expect(clsOf(od)).toBe(EXPECTED[i].od[0]);
      expect(orOf(od)).toBe(EXPECTED[i].od[1]);
      expect(bcOf(od)).toBe(!!EXPECTED[i].od[2]);
      expect(clsOf(os)).toBe(EXPECTED[i].os[0]);
      expect(orOf(os)).toBe(EXPECTED[i].os[1]);
      expect(pd.anisometropia).toBe(EXPECTED[i].aniso);
      expect(pd.sentence.startsWith('Dg: ')).toBe(true);
    });
  });
  it('the "-.0.50" typo is read as −0.50 with a visible warning', () => {
    const l = parseVisusLine(LECTURE_EXAMPLES[2].lines[1]);
    expect(l.cc?.sphereD).toBe(-0.5);
    expect(l.cc?.cylinderD).toBe(-1);
    expect(l.cc?.axisDeg).toBe(170);
    expect(l.warnings.join()).toMatch(/stray dot/);
  });
  it('plus cylinder ax 180 is inversus (convert to minus cylinder first), a classic trap', () => {
    const d = diagnoseEye(parseVisusLine('VOS: sc 0.8, cc +1.00 dcyl ax 180 1.0'));
    expect(d.latin).toBe('Astigmatismus hypermetropicus simplex inversus OS');
  });
  it('mixed astigmatism even though the written sphere is minus and SE is 0', () => {
    const d = diagnoseEye(parseVisusLine('VOS: sc 0.6, cc -0.50 dsph +1.00 dcyl ax 180 1.0'));
    expect(clsOf(d)).toBe('mixed-astigmatism');
    expect(d.outcome.kind === 'refractive' && d.outcome.seD).toBe(0);
  });
});

describe('parser', () => {
  it('reads tokens in order with positions (for click-to-explain)', () => {
    const l = parseVisusLine('VOD: sc 0.5, cc -1.00 dsph 1.0 Dg?');
    expect(l.tokens.map((t) => t.kind)).toEqual(['eye', 'colon', 'sc', 'va-sc', 'comma', 'cc', 'sph-power', 'dsph', 'va-cc', 'dg']);
    for (const t of l.tokens) expect(l.raw.slice(t.start, t.end)).toBe(t.text);
    expect(l.asksDg).toBe(true);
  });
  it('accepts comma decimals, Unicode minus, "x" for axis, and case', () => {
    const l = parseVisusLine('vos: SC 0,5, CC −0,75 DSPH −1,25 DCYL x 90 1,0');
    expect(l.errors).toEqual([]);
    expect(l.cc).toMatchObject({ sphereD: -0.75, cylinderD: -1.25, axisDeg: 90, va: 1 });
  });
  it('reports missing pieces instead of guessing', () => {
    expect(parseVisusLine('sc 0.5').errors.join()).toMatch(/No eye/);
    expect(parseVisusLine('VOD: sc 0.5, cc -1.00 dcyl 1.0').errors.join()).toMatch(/axis/);
    expect(parseVisusLine('VOD: sc 0.5, cc -1.00 1.0').errors.join()).toMatch(/no unit/);
    expect(parseVisusLine('VOD: sc 0.5, cc -1.00 dcyl ax 200 1.0').errors.join()).toMatch(/outside/);
  });
  it('reduced acuity without a lens → no refractive diagnosis', () => {
    const d = diagnoseEye(parseVisusLine('VOD: sc 0.4'));
    expect(d.outcome.kind).toBe('insufficient');
  });
  it('every token has an explanation and a derivation exists', () => {
    for (const ex of LECTURE_EXAMPLES)
      for (const raw of ex.lines) {
        const l = parseVisusLine(raw);
        for (const t of l.tokens) expect(explainToken(t, l).body.length).toBeGreaterThan(0);
        const steps = derivationSteps(l);
        expect(steps[steps.length - 1].id).toBe('dg');
      }
  });
});

describe('written diagnosis parser and grading', () => {
  const pd = diagnosePair(LECTURE_EXAMPLES[7].lines.map(parseVisusLine));
  it('accepts Latin with eye labels', () => {
    const r = parseWrittenDiagnosis('Dg: Astigmatismus myopicus simplex rectus OD; Astigmatismus mixtus inversus OS');
    expect(r.problems).toEqual([]);
    const g = gradePair(pd, r.answer);
    expect(g.correct).toBe(true);
    expect(g.eyes.every((e) => e.classOk && e.orientationOk)).toBe(true);
  });
  it('accepts English and Bosnian wording', () => {
    expect(gradePair(pd, parseWrittenDiagnosis('right eye: simple myopic astigmatism with the rule, left eye: mixed astigmatism against the rule').answer).correct).toBe(true);
    const b = diagnosePair(LECTURE_EXAMPLES[0].lines.map(parseVisusLine));
    expect(gradePair(b, parseWrittenDiagnosis('Kratkovidnost desno oko; astigmatizam miopni jednostavni lijevo oko').answer).correct).toBe(true);
  });
  it('detects OD/OS swap', () => {
    const g = gradePair(pd, parseWrittenDiagnosis('Astigmatismus mixtus OD; Astigmatismus myopicus simplex OS').answer);
    expect(g.correct).toBe(false);
    expect(g.eyes.every((e) => e.swapped)).toBe(true);
  });
  it('simple vs compound mistake is named', () => {
    const p1 = diagnosePair(LECTURE_EXAMPLES[2].lines.map(parseVisusLine));
    const g = gradePair(p1, parseWrittenDiagnosis('Myopia OD; Astigmatismus myopicus simplex OS').answer);
    expect(g.eyes[1].classOk).toBe(false);
    expect(g.eyes[1].misconceptionIds).toContain('M-SIMPLE-VS-COMPOUND');
  });
  it('requires anisometropia and the reduced corrected acuity in pair 5; flags unsupported additions', () => {
    const p5 = diagnosePair(LECTURE_EXAMPLES[4].lines.map(parseVisusLine));
    expect(gradePair(p5, parseWrittenDiagnosis('Hypermetropia OU').answer).correct).toBe(false);
    expect(gradePair(p5, parseWrittenDiagnosis('Hypermetropia OU; Anisometropia; suspected amblyopia OD').answer).correct).toBe(true);
    const g = gradePair(p5, parseWrittenDiagnosis('Hypermetropia OU; Anisometropia; amblyopia OD; presbyopia').answer);
    expect(g.presbyopiaOk).toBe(false);
    expect(g.correct).toBe(false);
    expect(gradePair(p5, parseWrittenDiagnosis('Hypermetropia OU; Anisometropia; amblyopia OD; keratoconus OD').answer).unsupported.length).toBe(1);
  });
  it('orientation is a separate, optional dimension', () => {
    const g = gradePair(pd, parseWrittenDiagnosis('Astigmatismus myopicus simplex OD; Astigmatismus mixtus OS').answer);
    expect(g.correct).toBe(true);
    expect(g.eyes[0].orientationOk).toBe(false);
  });
  it('a structured answer missing an eye is incorrect', () => {
    const a: PairAnswer = { eyes: { OD: { cls: 'simple-myopic-astigmatism', orientation: 'rectus', flagBcva: false } }, anisometropia: false, unsupported: [] };
    expect(gradePair(pd, a).correct).toBe(false);
  });
});

describe('generated exercise bank', () => {
  it('2000 generated pairs all parse without errors, are deterministic, and cover every category', () => {
    const seen = new Set<string>();
    for (let s = 1; s <= 2000; s++) {
      const ex = generateExercise(s);
      expect(generateExercise(s).lines).toEqual(ex.lines);
      const lines = ex.lines.map(parseVisusLine);
      for (const l of lines) expect(l.errors).toEqual([]);
      const pd = diagnosePair(lines);
      for (const e of pd.eyes) seen.add(clsOf(e));
      // the model answer itself grades as correct (round trip through the written-diagnosis parser)
      const g = gradePair(pd, parseWrittenDiagnosis(pd.sentence).answer);
      expect(g.correct, `${ex.lines.join(' | ')} → ${pd.sentence}`).toBe(true);
    }
    for (const c of ['emmetropic', 'spherical-myopia', 'spherical-hyperopia', 'simple-myopic-astigmatism', 'compound-myopic-astigmatism', 'simple-hyperopic-astigmatism', 'compound-hyperopic-astigmatism', 'mixed-astigmatism']) expect(seen.has(c)).toBe(true);
  });
  it('focus produces mostly the requested category', () => {
    let hits = 0;
    for (let s = 1; s <= 300; s++) {
      const pd = diagnosePair(generateExercise(s, 'mixed-astigmatism').lines.map(parseVisusLine));
      if (pd.eyes.some((e) => clsOf(e) === 'mixed-astigmatism')) hits++;
    }
    expect(hits).toBeGreaterThan(200);
  });
  it('lecture model answers round-trip as correct', () => {
    for (const ex of LECTURE_EXAMPLES) {
      const pd = diagnosePair(ex.lines.map(parseVisusLine));
      expect(gradePair(pd, parseWrittenDiagnosis(pd.sentence).answer).correct, pd.sentence).toBe(true);
    }
  });
});

import { PRESBYOPIA_EXAMPLES } from '../src/domain/diagnosis';

describe('presbyopia', () => {
  const pd = (lines: string[]) => diagnosePair(lines.map(parseVisusLine));
  it('Add line → presbyopia; reading lens = distance + ADD with cylinder and axis unchanged', () => {
    const p = pd(PRESBYOPIA_EXAMPLES[1].lines);
    expect(p.presbyopia.status).toBe('expected');
    expect(p.presbyopia.addD).toBe(2.25);
    expect(p.presbyopia.nearLenses[0].lens).toEqual({ sphereD: 1, cylinderD: 0, axisDeg: null });
    expect(p.sentence).toBe('Dg: Myopia OU; Presbyopia');
    const e = pd(PRESBYOPIA_EXAMPLES[0].lines);
    expect(e.sentence).toBe('Dg: Emmetropia OU; Presbyopia');
    expect(e.presbyopia.nearLenses[0].lens.sphereD).toBe(1.75);
  });
  it('near ("za blizu") lens gives the ADD as near minus distance', () => {
    const p = pd(PRESBYOPIA_EXAMPLES[2].lines);
    expect(p.eyes).toHaveLength(2);
    expect(p.presbyopia.addD).toBe(2.5);
    const os = p.eyes.find((x) => x.eye === 'OS')!;
    expect(os.outcome.kind === 'refractive' && os.outcome.cls).toBe('compound-hyperopic-astigmatism');
  });
  it('age alone does not make presbyopia; writing it is flagged', () => {
    const p = pd(PRESBYOPIA_EXAMPLES[3].lines);
    expect(p.presbyopia.status).toBe('age-only');
    expect(p.sentence).not.toMatch(/Presbyopia/);
    const g = gradePair(p, parseWrittenDiagnosis('Astigmatismus myopicus compositus rectus OD; Emmetropia OS; Presbyopia').answer);
    expect(g.presbyopiaOk).toBe(false);
    expect(g.presbyopiaFeedback).toMatch(/age alone/);
    expect(g.correct).toBe(false);
  });
  it('missing presbyopia is marked; including it is correct', () => {
    const p = pd(PRESBYOPIA_EXAMPLES[4].lines);
    expect(gradePair(p, parseWrittenDiagnosis('Myopia OU').answer).correct).toBe(false);
    expect(gradePair(p, parseWrittenDiagnosis('Myopia OU; Presbyopia').answer).correct).toBe(true);
    expect(gradePair(p, parseWrittenDiagnosis('Kratkovidnost oba oka; presbiopija').answer).correct).toBe(true);
  });
  it('ADD must be plus; tokens explain', () => {
    expect(parseVisusLine('VOU: Add -1.00 dsph').errors.join()).toMatch(/plus/);
    const l = parseVisusLine('VOU: Add +2.00 dsph');
    expect(l.role).toBe('context');
    expect(l.tokens.map((t) => t.kind)).toEqual(['eye', 'colon', 'add', 'add-power', 'dsph']);
    for (const t of l.tokens) expect(explainToken(t, l).body.length).toBeGreaterThan(0);
  });
  it('generator produces presbyopia and age-only cases that round-trip', () => {
    let pres = 0;
    let ageOnly = 0;
    for (let s = 1; s <= 600; s++) {
      const p = pd(generateExercise(s).lines);
      if (p.presbyopia.status === 'expected') pres++;
      if (p.presbyopia.status === 'age-only') ageOnly++;
    }
    expect(pres).toBeGreaterThan(100);
    expect(ageOnly).toBeGreaterThan(20);
  });
});

describe('composer answers', () => {
  it('a structured answer equal to the expected diagnosis grades correct for 2000 generated pairs', () => {
    for (let s = 1; s <= 2000; s++) {
      const pd = diagnosePair(generateExercise(s).lines.map(parseVisusLine));
      const ans: PairAnswer = {
        eyes: Object.fromEntries(pd.eyes.map((e) => [e.eye, {
          cls: e.outcome.kind === 'refractive' ? e.outcome.cls : e.outcome.kind === 'emmetropic-by-acuity' ? 'emmetropic' : 'cannot',
          orientation: e.outcome.kind === 'refractive' && e.outcome.orientation ? e.outcome.orientation : '',
          flagBcva: e.outcome.kind === 'refractive' && e.outcome.bcvaReduced,
        }])),
        anisometropia: pd.anisometropia === 'expected',
        unsupported: [],
        presbyopia: pd.presbyopia.status === 'expected',
      };
      expect(gradePair(pd, ans).correct).toBe(true);
    }
  });
});
