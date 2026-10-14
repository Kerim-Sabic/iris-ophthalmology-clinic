import { describe, expect, it } from 'vitest';
import {
  EYES,
  findingOf,
  gradePupilInterpretation,
  normalPatient,
  patientFor,
  pupilCase,
  PUPIL_ARCHETYPES,
  segmentObservations,
  simulate,
  steadyState,
  swingSequence,
  type LightSegment,
  type PupilPatient,
} from '../src/domain/pupils';

const rapdOS = (): PupilPatient => ({ afferent: { OD: 1, OS: 0.4 }, efferent: { OD: 'normal', OS: 'normal' } });
const rapdOD = (): PupilPatient => ({ afferent: { OD: 0.4, OS: 1 }, efferent: { OD: 'normal', OS: 'normal' } });
const close = (a: number, b: number) => Math.abs(a - b) < 1e-9;

describe('afferent defect (RAPD) is not a permanently large pupil', () => {
  it('isolated afferent defect → equal pupils in ambient light and in dark, no torch', () => {
    for (const p of [rapdOS(), rapdOD()]) {
      for (const amb of ['light', 'dark'] as const) {
        const s = steadyState(p, amb, 'none');
        expect(close(s.OD, s.OS)).toBe(true);
      }
    }
  });
  it('light in the affected eye constricts BOTH pupils less than light in the good eye', () => {
    for (const amb of ['light', 'dark'] as const) {
      const good = steadyState(rapdOS(), amb, 'OD');
      const bad = steadyState(rapdOS(), amb, 'OS');
      expect(bad.OD).toBeGreaterThan(good.OD);
      expect(bad.OS).toBeGreaterThan(good.OS);
    }
  });
  it('direct and consensual responses are equal for an afferent defect (either eye lit)', () => {
    for (const light of ['OD', 'OS'] as const) {
      const s = steadyState(rapdOS(), 'dark', light);
      expect(close(s.OD, s.OS)).toBe(true);
    }
  });
  it('swinging from the good eye to the affected eye dilates both pupils; back to the good eye constricts both', () => {
    const frames = simulate(rapdOS(), swingSequence('OD', 4, 15, 'dark'));
    const obs = segmentObservations(frames);
    // segments: none, OD, OS, OD, OS
    expect(obs.map((o) => o.light)).toEqual(['none', 'OD', 'OS', 'OD', 'OS']);
    expect(obs[1].change).toEqual({ OD: 'constricts', OS: 'constricts' });
    expect(obs[2].change).toEqual({ OD: 'dilates', OS: 'dilates' });
    expect(obs[3].change).toEqual({ OD: 'constricts', OS: 'constricts' });
    expect(obs[4].change).toEqual({ OD: 'dilates', OS: 'dilates' });
  });
  it('rapid swings keep both pupils equal at every tick for a pure afferent defect', () => {
    const frames = simulate(rapdOD(), swingSequence('OS', 12, 3, 'light'));
    for (const f of frames) expect(Math.abs(f.OD - f.OS)).toBeLessThan(1e-9);
  });
  it('normal patient: no change in pupil size when swinging between eyes', () => {
    const obs = segmentObservations(simulate(normalPatient(), swingSequence('OD', 3, 20, 'dark')));
    expect(obs[2].change).toEqual({ OD: 'little change', OS: 'little change' });
    expect(obs[3].change).toEqual({ OD: 'little change', OS: 'little change' });
  });
});

describe('efferent defects', () => {
  it('parasympathetic-type OD: OD constricts poorly to light in EITHER eye; OS responds normally to either', () => {
    const p = patientFor('para-OD');
    const base = steadyState(p, 'dark', 'none');
    const normalBase = steadyState(normalPatient(), 'dark', 'none');
    for (const light of ['OD', 'OS'] as const) {
      const s = steadyState(p, 'dark', light);
      const n = steadyState(normalPatient(), 'dark', light);
      const odChange = base.OD - s.OD;
      const osChange = base.OS - s.OS;
      expect(odChange).toBeLessThan(0.5);
      expect(osChange).toBeCloseTo(normalBase.OS - n.OS, 9);
      expect(osChange).toBeGreaterThan(2);
    }
  });
  it('sympathetic-type OS: OS still constricts to light in either eye', () => {
    const p = patientFor('symp-OS');
    const base = steadyState(p, 'dark', 'none');
    for (const light of ['OD', 'OS'] as const) {
      const s = steadyState(p, 'dark', light);
      expect(base.OS - s.OS).toBeGreaterThan(1);
      expect(base.OD - s.OD).toBeGreaterThan(1);
    }
  });
  it('Horner-type anisocoria is greater in dark; the affected pupil is the smaller one', () => {
    for (const eye of EYES) {
      const p = patientFor(eye === 'OD' ? 'symp-OD' : 'symp-OS');
      const dark = steadyState(p, 'dark', 'none');
      const light = steadyState(p, 'light', 'none');
      const other = eye === 'OD' ? 'OS' : 'OD';
      expect(dark[eye]).toBeLessThan(dark[other]);
      expect(dark[other] - dark[eye]).toBeGreaterThan(light[other] - light[eye]);
    }
  });
  it('parasympathetic-type anisocoria is greater in light; the affected pupil is the larger one', () => {
    for (const eye of EYES) {
      const p = patientFor(eye === 'OD' ? 'para-OD' : 'para-OS');
      const dark = steadyState(p, 'dark', 'none');
      const light = steadyState(p, 'light', 'none');
      const other = eye === 'OD' ? 'OS' : 'OD';
      expect(light[eye]).toBeGreaterThan(light[other]);
      expect(light[eye] - light[other]).toBeGreaterThan(dark[eye] - dark[other]);
    }
  });
  it('physiological anisocoria: equal difference in light and dark', () => {
    const p = patientFor('physio');
    const d = steadyState(p, 'dark', 'none');
    const l = steadyState(p, 'light', 'none');
    expect(d.OS - d.OD).toBeCloseTo(l.OS - l.OD, 9);
    expect(d.OS - d.OD).toBeGreaterThan(0.3);
  });
});

describe('laterality and determinism', () => {
  it('OD/OS are never swapped: a defect in OD affects OD outputs, mirror patient mirrors outputs', () => {
    const a = steadyState(patientFor('para-OD'), 'light', 'OS');
    const b = steadyState(patientFor('para-OS'), 'light', 'OD');
    expect(a.OD).toBeGreaterThan(a.OS);
    expect(b.OS).toBeGreaterThan(b.OD);
    expect(a.OD).toBeCloseTo(b.OS, 9);
    expect(a.OS).toBeCloseTo(b.OD, 9);
    // afferent: lighting OD in an OD-RAPD patient is the weak stimulus
    expect(steadyState(rapdOD(), 'dark', 'OD').OD).toBeGreaterThan(steadyState(rapdOD(), 'dark', 'OS').OD);
  });
  it('findingOf recovers the archetype for every eye-specific finding', () => {
    for (const f of PUPIL_ARCHETYPES) expect(findingOf(patientFor(f))).toBe(f);
  });
  it('replay / scrub determinism: re-simulation gives identical frames; prefix is stable', () => {
    const segs: LightSegment[] = [...swingSequence('OD', 5, 7, 'light'), { light: 'none', ambient: 'dark', ticks: 12 }];
    const p = rapdOS();
    const a = simulate(p, segs);
    const b = simulate(p, segs);
    expect(a).toEqual(b);
    // appending a segment does not change earlier frames (pause/step agree with the model)
    const c = simulate(p, [...segs, { light: 'OS', ambient: 'dark', ticks: 10 }]);
    expect(c.slice(0, a.length)).toEqual(a);
    expect(a.length).toBe(segs.reduce((n, s) => n + s.ticks, 0));
  });
  it('seeded cases are repeatable', () => {
    for (let s = 1; s < 50; s++) expect(pupilCase(s)).toEqual(pupilCase(s));
  });
});

describe('interpretation grading', () => {
  it('flags afferent/efferent confusion', () => {
    const g = gradePupilInterpretation('afferent-OS', 'para-OS');
    expect(g.correct).toBe(false);
    expect(g.misconceptionIds).toContain('M-AFFERENT-VS-EFFERENT');
    expect(gradePupilInterpretation('symp-OD', 'symp-OD').correct).toBe(true);
    const w = gradePupilInterpretation('afferent-OD', 'afferent-OS');
    expect(w.layerCorrect).toBe(true);
    expect(w.eyeCorrect).toBe(false);
  });
});
