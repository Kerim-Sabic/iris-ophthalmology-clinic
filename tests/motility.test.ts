import { describe, expect, it } from 'vitest';
import {
  cornealReflex,
  findingOf,
  gazePositions,
  gradeCoverAnswer,
  gradeHirschberg,
  hirschbergTruth,
  initialCoverState,
  MOTILITY_ARCHETYPES,
  motilityCase,
  patientFor,
  runCoverSequence,
  toExaminerX,
  type MotilityPatient,
} from '../src/domain/motility';

/** Left esotropia, right eye fixing (K2 core fixture), written out independently of patientFor. */
const LET: MotilityPatient = { kind: 'eso', manifest: true, preferredEye: 'OD', magnitudePD: 20 };

describe('cover test — tropia', () => {
  it('REQUIRED FIXTURE: left esotropia, RE fixing — covering the RE makes the LE move OUT (abduct) to take up fixation', () => {
    const [start, cover] = runCoverSequence(LET, ['OD']);
    expect(start.after.fixingEye).toBe('OD');
    expect(start.after.inwardPD.OS).toBeGreaterThan(0); // OS turned in at rest
    expect(cover.maneuver).toBe('cover');
    expect(cover.after.occluder).toBe('OD');
    expect(cover.observe).toEqual(['OS']);
    expect(cover.movement.OS.direction).toBe('out');
    expect(cover.movement.OS.visible).toBe(true);
    expect(cover.after.fixingEye).toBe('OS');
    expect(cover.movement.OD.visible).toBe(false); // behind the occluder
  });
  it('covering the deviating eye → no movement of the fixing eye', () => {
    const [, cover] = runCoverSequence(LET, ['OS']);
    expect(cover.observe).toEqual(['OD']);
    expect(cover.movement.OD.direction).toBe('none');
    expect(cover.after.fixingEye).toBe('OD');
    for (const f of ['ET-OD', 'XT-OD', 'XT-OS'] as const) {
      const p = patientFor(f);
      const dev = f.endsWith('OD') ? 'OD' : 'OS';
      const fix = dev === 'OD' ? 'OS' : 'OD';
      const [, c] = runCoverSequence(p, [dev]);
      expect(c.movement[fix].direction).toBe('none');
    }
  });
  it('exotropic eye moves IN to take up fixation when the fixing eye is covered', () => {
    const [, c] = runCoverSequence(patientFor('XT-OD'), ['OS']);
    expect(c.movement.OD.direction).toBe('in');
  });
});

describe('cover-uncover — phoria', () => {
  for (const f of ['esophoria', 'exophoria'] as const) {
    it(`${f}: no movement of the uncovered eye on cover; covered eye shows recovery movement on uncover`, () => {
      const p = patientFor(f, 15);
      const [start, cover, uncover] = runCoverSequence(p, ['OD', 'none']);
      expect(start.after.fused).toBe(true);
      expect(start.after.inwardPD).toEqual({ OD: 0, OS: 0 });
      expect(cover.movement.OS.direction).toBe('none');
      expect(cover.movement.OD.visible).toBe(false);
      expect(uncover.maneuver).toBe('uncover');
      expect(uncover.observe).toEqual(['OD']);
      // eso drifts in under cover → recovers OUT; exo drifts out → recovers IN
      expect(uncover.movement.OD.direction).toBe(f === 'esophoria' ? 'out' : 'in');
      expect(uncover.movement.OD.visible).toBe(true);
      expect(uncover.after.fused).toBe(true);
    });
  }
  it('orthophoria: no movement at any stage', () => {
    const steps = runCoverSequence(patientFor('ortho'), ['OD', 'none', 'OS', 'none', 'OD', 'OS', 'OD', 'none']);
    for (const s of steps) {
      expect(s.movement.OD.direction).toBe('none');
      expect(s.movement.OS.direction).toBe('none');
    }
  });
});

describe('alternate cover', () => {
  it('shows refixation movement for BOTH phoria and tropia (cannot separate the components)', () => {
    for (const f of ['esophoria', 'ET-OS', 'exophoria', 'XT-OD'] as const) {
      const steps = runCoverSequence(patientFor(f), ['OD', 'OS', 'OD', 'OS']);
      const alternates = steps.filter((s) => s.maneuver === 'alternate');
      expect(alternates.length).toBe(3);
      for (const a of alternates) {
        const watched = a.observe[0];
        expect(a.movement[watched].direction).not.toBe('none');
        expect(a.movement[watched].visible).toBe(true);
      }
      // fusion stays broken throughout the alternating sequence
      expect(alternates.every((a) => !a.after.fused)).toBe(true);
    }
  });
  it('alternate-cover direction: eso → newly uncovered eye moves out; exo → in', () => {
    const eso = runCoverSequence(patientFor('esophoria'), ['OD', 'OS']);
    expect(eso[2].movement.OD.direction).toBe('out');
    const exo = runCoverSequence(patientFor('exophoria'), ['OD', 'OS']);
    expect(exo[2].movement.OD.direction).toBe('in');
  });
});

describe('Hirschberg corneal reflex', () => {
  it('esotropic eye → reflex displaced temporally; exotropic eye → nasally; fixing eye central', () => {
    const et = cornealReflex(initialCoverState(patientFor('ET-OD')));
    expect(et.OD?.side).toBe('temporal');
    expect(et.OS?.side).toBe('central');
    const xt = cornealReflex(initialCoverState(patientFor('XT-OS')));
    expect(xt.OS?.side).toBe('nasal');
    expect(xt.OD?.side).toBe('central');
    const etl = cornealReflex(initialCoverState(LET));
    expect(etl.OS?.side).toBe('temporal');
  });
  it('phoria → both reflexes central with both eyes open; covered eye reflex not visible', () => {
    const s = initialCoverState(patientFor('exophoria'));
    const r = cornealReflex(s);
    expect(r.OD?.side).toBe('central');
    expect(r.OS?.side).toBe('central');
    const [, c] = runCoverSequence(patientFor('exophoria'), ['OS']);
    expect(cornealReflex(c.after).OS).toBeNull();
    expect(hirschbergTruth(patientFor('esophoria'))).toEqual({ eye: 'neither', dir: 'none' });
  });
  it('grades the reflex convention', () => {
    expect(gradeHirschberg(patientFor('ET-OD'), { eye: 'OD', dir: 'eso' }).correct).toBe(true);
    expect(gradeHirschberg(patientFor('ET-OD'), { eye: 'OD', dir: 'exo' }).correct).toBe(false);
    expect(gradeHirschberg(patientFor('XT-OS'), { eye: 'OS', dir: 'exo' }).correct).toBe(true);
  });
});

describe('laterality: patient right = viewer left only in rendering', () => {
  it('model outputs are patient-based and mirror-symmetric under swapping OD/OS', () => {
    const a = runCoverSequence(patientFor('ET-OD'), ['OS', 'none', 'OD']);
    const b = runCoverSequence(patientFor('ET-OS'), ['OD', 'none', 'OS']);
    for (let i = 0; i < a.length; i++) {
      expect(a[i].movement.OD).toEqual(b[i].movement.OS);
      expect(a[i].movement.OS).toEqual(b[i].movement.OD);
      expect(a[i].after.inwardPD.OD).toBe(b[i].after.inwardPD.OS);
    }
  });
  it('examiner transform: nasal displacement of OD goes to viewer right, of OS to viewer left', () => {
    expect(toExaminerX('OD', 10)).toBeGreaterThan(0);
    expect(toExaminerX('OS', 10)).toBeLessThan(0);
    // the LET fixture: OS moves out (abducts) → toward the viewer's right on screen
    const [, c] = runCoverSequence(LET, ['OD']);
    expect(toExaminerX('OS', c.movement.OS.deltaPD)).toBeGreaterThan(0);
  });
  it('schematic right abduction deficit limits OD only in right gaze', () => {
    const p: MotilityPatient = { kind: 'ortho', manifest: false, preferredEye: 'OS', magnitudePD: 0, abductionDeficit: 'OD' };
    const right = gazePositions(p, { h: 1, v: 0 }, 'version');
    expect(right.OD?.limited).toBe(true);
    expect(right.OS?.limited).toBe(false);
    expect(right.OD!.hDeg).toBeLessThan(right.OS!.hDeg);
    const left = gazePositions(p, { h: -1, v: 0 }, 'version');
    expect(left.OD?.limited).toBe(false);
    const duc = gazePositions(p, { h: 1, v: 0 }, 'duction', 'OD');
    expect(duc.OS).toBeNull();
    expect(duc.OD?.limited).toBe(true);
  });
});

describe('cases and grading', () => {
  it('findingOf round-trips archetypes; seeded cases repeat', () => {
    for (const f of MOTILITY_ARCHETYPES) expect(findingOf(patientFor(f))).toBe(f);
    for (let s = 1; s < 40; s++) expect(motilityCase(s)).toEqual(motilityCase(s));
  });
  it('flags phoria/tropia confusion', () => {
    const g = gradeCoverAnswer('ET-OS', 'esophoria');
    expect(g.correct).toBe(false);
    expect(g.misconceptionIds).toContain('M-PHORIA-VS-TROPIA');
    expect(g.directionCorrect).toBe(true);
    expect(gradeCoverAnswer('XT-OD', 'XT-OD').correct).toBe(true);
  });
});
