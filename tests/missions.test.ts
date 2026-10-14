import { describe, expect, it } from 'vitest';
import { FAMILIES, OPTICS_OBJECTIVES, type TaskResponse } from '../src/domain/missions';
import { fromMatrix, makeLens, toMatrix, toPowerCross, transpose } from '../src/domain/optics';

describe('optics task families', () => {
  it('has at least 18 families, with held-out exam families', () => {
    expect(FAMILIES.length).toBeGreaterThanOrEqual(18);
    expect(new Set(FAMILIES.map((f) => f.id)).size).toBe(FAMILIES.length);
    expect(FAMILIES.filter((f) => f.pool === 'exam').length).toBeGreaterThanOrEqual(5);
    for (const f of FAMILIES) for (const o of f.objectiveIds) expect(OPTICS_OBJECTIVES[o]).toBeDefined();
  });
  for (const fam of FAMILIES) {
    it(`${fam.id}: deterministic per seed and solvable`, () => {
      for (let seed = 1; seed <= 120; seed++) {
        const a = fam.make(seed);
        const b = fam.make(seed);
        expect(a.prompt).toBe(b.prompt);
        expect(a.itemId).toBe(`${fam.id}#${seed}`);
        expect(a.hints).toHaveLength(3);
        if (a.kind === 'rx') {
          const conv = a.requested === 'plus' ? 'plus' : 'minus';
          const ans = fromMatrix(toMatrix(a.target!), conv);
          expect(a.grade({ kind: 'rx', lens: ans }).correct).toBe(true);
          // transposed answer is optically equivalent; graded wrong only if a convention was requested
          if (ans.cylinderD !== 0) {
            const g = a.grade({ kind: 'rx', lens: transpose(ans) });
            expect(g.scores.opticallyEquivalent).toBe(true);
            expect(g.correct).toBe(a.requested === 'any' || a.requested === undefined);
          }
          expect(a.grade({ kind: 'rx', lens: makeLens(ans.sphereD + 0.5, ans.cylinderD, ans.axisDeg) }).correct).toBe(false);
        } else if (a.kind === 'number') {
          // independent: brute force from S + C sin^2
          const t = a.target!;
          const theta = a.display.probeDeg!;
          const expected = t.sphereD + t.cylinderD * Math.sin(((theta - (t.axisDeg ?? 0)) * Math.PI) / 180) ** 2;
          expect(a.grade({ kind: 'number', value: Number(expected.toFixed(2)) }).correct).toBe(true);
          expect(a.grade({ kind: 'number', value: expected + 0.25 }).correct).toBe(false);
        } else if (a.kind === 'choice') {
          const right = a.choices!.filter((c) => a.grade({ kind: 'choice', value: c.value } as TaskResponse).correct);
          expect(right).toHaveLength(1);
        } else if (a.kind === 'cross') {
          const pc = toPowerCross(a.target!);
          expect(a.grade({ kind: 'cross', m1: pc.meridianADeg, p1: pc.powerAD, m2: pc.meridianBDeg, p2: pc.powerBD }).correct).toBe(true);
          expect(a.grade({ kind: 'cross', m1: pc.meridianBDeg, p1: pc.powerBD, m2: pc.meridianADeg, p2: pc.powerAD }).correct).toBe(true);
          expect(a.grade({ kind: 'cross', m1: 30, p1: 0, m2: 100, p2: -1 }).correct).toBe(false);
        }
      }
    });
  }
  it('detects double working-distance subtraction', () => {
    const fam = FAMILIES.find((f) => f.id === 'F-WD-DOUBLE')!;
    const t = fam.make(5);
    const g = t.grade({ kind: 'rx', lens: makeLens(t.target!.sphereD - 2, t.target!.cylinderD, t.target!.axisDeg) });
    expect(g.correct).toBe(false);
    expect(g.misconceptionIds).toContain('M-DOUBLE-WD');
  });
  it('detects gross reported as net', () => {
    const fam = FAMILIES.find((f) => f.id === 'F-WD-NET')!;
    for (let s = 1; s < 30; s++) {
      const t = fam.make(s);
      const m = t.prompt.match(/2\/3 m/) ? 1.5 : 2;
      const g = t.grade({ kind: 'rx', lens: makeLens(t.target!.sphereD + m, t.target!.cylinderD, t.target!.axisDeg) });
      expect(g.misconceptionIds).toContain('M-GROSS-VS-NET');
    }
  });
});
