import { describe, expect, it } from 'vitest';
import fx from '../reference/optics_fixtures.json';
import {
  addMatrices, blurEllipseAt, classify, diagnoseMisconceptions, eyeState, fitMeridionalSamples, formatRx, fromMatrix,
  fromPowerCross, gradeLens, grossToNet, jcc, lensFromFields, makeLens, meridionalPower, meridionalPowerQ, netToGross,
  normalizeAxis, opticallyEquivalent, parseRx, patientPreference, principalMeridians, retinoscopy, sphericalEquivalent,
  toMatrix, toPowerCross, toVector, transpose, vertexConvert, prenticePrismDioptres, addNear, logMAR, decimalAcuity,
  astigmatismOrientation, worstMeridian, subMatrices,
} from '../src/domain/optics';

type L = { S: number; C: number; A: number | null };
const lens = (l: L) => makeLens(l.S, l.C, l.A);
const close = (a: number, b: number, tol = 1e-9) => expect(Math.abs(a - b)).toBeLessThan(tol);

describe('supplied cylinder image', () => {
  const rx = lens(fx.image_lens.lens);
  it.each(fx.image_lens.meridians)('power at $theta° is $power D (both formula paths)', ({ theta, power }) => {
    close(meridionalPower(rx, theta), power);
    close(meridionalPowerQ(toMatrix(rx), theta), power);
  });
  it('plus-cyl form −4.00 +4.00 × 090 is optically identical', () => {
    const plus = transpose(rx);
    expect(plus).toEqual({ sphereD: -4, cylinderD: 4, axisDeg: 90 });
    expect(opticallyEquivalent(rx, plus)).toBe(true);
    for (let t = 0; t < 180; t += 1) close(meridionalPower(rx, t), meridionalPower(plus, t));
  });
  it('spherical equivalent −2.00 is not an equivalent correction', () => {
    expect(sphericalEquivalent(rx)).toBe(-2);
    expect(opticallyEquivalent(rx, makeLens(-2))).toBe(false);
  });
  it('lens-only context refuses a diagnosis; full-correction context gives simple myopic astigmatism', () => {
    expect(classify(rx, 'lens-only').status).toBe('insufficient-context');
    const c = classify(rx, 'full-distance-correction-relaxed');
    expect(c.status === 'classified' && c.cls).toBe('simple-myopic-astigmatism');
  });
  it('formats as plano / −4.00 × 180', () => {
    expect(formatRx(rx)).toBe('plano / −4.00 × 180');
  });
});

describe('classification fixtures', () => {
  it.each(fx.classification)('$S / $C × $A → $cls', (c) => {
    const rx = lens(c);
    const r = classify(rx, 'full-distance-correction-relaxed');
    expect(r.status).toBe('classified');
    if (r.status === 'classified') expect(r.cls).toBe(c.cls);
    if ('T' in c && c.T) {
      const t = transpose(rx);
      expect(opticallyEquivalent(t, lens(c.T))).toBe(true);
      close(t.sphereD, c.T.S);
      close(t.cylinderD, c.T.C);
      expect(normalizeAxis(t.axisDeg!)).toBe(normalizeAxis(c.T.A!));
      expect(opticallyEquivalent(transpose(t), rx)).toBe(true);
      // plus-form also classifies identically
      const r2 = classify(lens(c.T), 'full-distance-correction-relaxed');
      expect(r2.status === 'classified' && r2.cls).toBe(c.cls);
    } else {
      expect(rx.axisDeg).toBeNull();
    }
  });
  it('mixed astigmatism despite zero SE', () => {
    const rx = makeLens(1, -2, 180);
    expect(sphericalEquivalent(rx)).toBe(0);
    const r = classify(rx, 'full-distance-correction-relaxed');
    expect(r.status === 'classified' && r.cls).toBe('mixed-astigmatism');
  });
});

describe('45 vs 135 alias trap', () => {
  const a = lens(fx.alias_pair.a);
  const b = lens(fx.alias_pair.b);
  it('share 0° and 90° powers', () => {
    for (const s of fx.alias_pair.shared) {
      close(meridionalPower(a, s.theta), s.power);
      close(meridionalPower(b, s.theta), s.power);
    }
  });
  it('differ at 45°', () => {
    close(meridionalPower(a, 45), 0);
    close(meridionalPower(b, 45), -4);
  });
  it('are NOT graded equivalent, and the two-sample misconception is detected', () => {
    const g = gradeLens(b, a);
    expect(g.opticallyEquivalent).toBe(false);
    expect(g.hypotheses.map((h) => h.id)).toContain('M-TWO-SAMPLES-FULL-RX');
    expect(Math.abs(g.worst.errorD)).toBeCloseTo(4, 9);
    expect([45, 135]).toContain(g.worst.meridianDeg);
  });
});

describe('axis periodicity, zero cylinder, -0', () => {
  it('0° and 180° are the same axis', () => {
    expect(opticallyEquivalent(makeLens(0, -4, 0), makeLens(0, -4, 180))).toBe(true);
    expect(makeLens(0, -4, 0).axisDeg).toBe(180);
    expect(opticallyEquivalent(makeLens(-1, -1, 10), makeLens(-1, -1, 190))).toBe(true);
  });
  it('zero cylinder has undefined axis and any axis is irrelevant', () => {
    expect(makeLens(-2, 0, 45).axisDeg).toBeNull();
    expect(opticallyEquivalent(makeLens(-2, 0, 45), makeLens(-2, 0, 120))).toBe(true);
    expect(transpose(makeLens(-2, 0, null))).toEqual({ sphereD: -2, cylinderD: 0, axisDeg: null });
  });
  it('negative zero is normalised', () => {
    const t = transpose(makeLens(-4, 4, 90));
    expect(Object.is(t.sphereD, -0)).toBe(false);
    expect(t.sphereD).toBe(0);
  });
  it('fromMatrix round trip in both conventions', () => {
    for (const [S, C, A] of [[0, -4, 180], [1, -3, 45], [-2.25, -1.5, 17], [3, 0.75, 163]] as const) {
      const rx = makeLens(S, C, A);
      const m = fromMatrix(toMatrix(rx), 'minus');
      const p = fromMatrix(toMatrix(rx), 'plus');
      expect(m.cylinderD).toBeLessThanOrEqual(0);
      expect(p.cylinderD).toBeGreaterThanOrEqual(0);
      expect(opticallyEquivalent(m, rx)).toBe(true);
      expect(opticallyEquivalent(p, rx)).toBe(true);
    }
  });
  it('power vector J0 / J45 follow the documented signs', () => {
    const v = toVector(makeLens(0, -4, 180));
    close(v.mD, -2);
    close(v.j0D, 2); // -(C/2)cos(2A) = 2
    close(v.j45D, 0);
    const w = toVector(makeLens(0, -4, 45));
    close(w.j0D, 0);
    close(w.j45D, 2); // -(C/2) sin(90°) = 2
  });
});

describe('grading and notation', () => {
  const target = makeLens(0, -4, 180);
  it('plus form is optically correct but flagged when minus notation is requested', () => {
    const g = gradeLens(makeLens(-4, 4, 90), target, 'minus');
    expect(g.opticallyEquivalent).toBe(true);
    expect(g.notation).toBe('other-convention');
    expect(gradeLens(makeLens(-4, 4, 90), target, 'plus').notation).toBe('as-requested');
  });
  it('−4.00 DS: supplies −4 at 180 where target is plano', () => {
    const g = gradeLens(makeLens(-4), target);
    expect(g.opticallyEquivalent).toBe(false);
    const at180 = g.discrepancies.find((d) => d.meridianDeg === 180)!;
    expect(at180.proposalD).toBe(-4);
    expect(at180.targetD).toBe(0);
    expect(g.hypotheses.map((h) => h.id)).toContain('M-CYL-AS-SPHERE');
  });
  it('plano −4.00 × 090: axis moved to vertical', () => {
    const g = gradeLens(makeLens(0, -4, 90), target);
    expect(g.hypotheses.map((h) => h.id)).toContain('M-AXIS-VS-MERIDIAN');
  });
  it('−2.00 DS: spherical equivalent trap', () => {
    const g = gradeLens(makeLens(-2), target);
    expect(g.hypotheses.map((h) => h.id)).toContain('M-SE-AS-EQUIVALENT');
  });
  it('sign-only and missed-axis-rotation transpositions', () => {
    const t = makeLens(-2, -1, 180);
    expect(gradeLens(makeLens(-2, 1, 180), t).hypotheses.map((h) => h.id)).toContain('M-SIGN-ONLY-TRANSPOSE');
    expect(gradeLens(makeLens(-3, 1, 180), t).hypotheses.map((h) => h.id)).toContain('M-AXIS-NOT-ROTATED');
  });
  it('principal power copied as cylinder (+1.00 +2.00 × 090 vs cross +1@90 / +2@180)', () => {
    const cross = fromPowerCross({ meridianADeg: 90, powerAD: 1, meridianBDeg: 180, powerBD: 2 }, 'plus');
    expect(cross.ok).toBe(true);
    if (!cross.ok) return;
    expect(opticallyEquivalent(cross.lens, makeLens(1, 1, 90))).toBe(true);
    const bad = makeLens(1, 2, 90);
    close(meridionalPower(bad, 90), 1);
    close(meridionalPower(bad, 180), 3);
    expect(gradeLens(bad, cross.lens).hypotheses.map((h) => h.id)).toContain('M-PRINCIPAL-AS-CYL');
  });
  it('zero-cylinder target: cylinder in proposal flagged', () => {
    expect(diagnoseMisconceptions(makeLens(-2, -0.5, 90), makeLens(-2)).map((h) => h.id)).toContain('M-ZERO-CYL-AXIS');
  });
  it('worst meridian of a residual', () => {
    const w = worstMeridian(subMatrices(toMatrix(makeLens(0, -4, 90)), toMatrix(makeLens(0, -4, 180))));
    close(Math.abs(w.errorD), 4);
  });
});

describe('parser', () => {
  it.each([
    ['plano −4.00 × 180', 0, -4, 180],
    ['pl/-4.00x180', 0, -4, 180],
    ['-4.00 +4.00 x 90', -4, 4, 90],
    ['−4.00 +4.00 × 090°', -4, 4, 90],
    ['+1,00 -3,00 x 045', 1, -3, 45],
    ['-2.00 DS', -2, 0, null],
    ['Plano DS', 0, 0, null],
    ['+2.00/-2.00x0', 2, -2, 180],
    ['  -0.25   -0.50  @  12 ', -0.25, -0.5, 12],
  ])('%s', (text, S, C, A) => {
    const r = parseRx(text);
    expect(r.errors).toEqual([]);
    expect(r.ok).toBe(true);
    expect(r.lens).toEqual({ sphereD: S, cylinderD: C, axisDeg: A });
  });
  it.each([
    ['', 'Empty'],
    ['plano -4.00', 'axis'],
    ['-2.00 x 90', 'ambiguous'],
    ['plano -4 x 200', 'outside'],
    ['abc', 'Could not read'],
    ['1e400', 'Could not read'],
    ['-4.00 + alert(1)', 'Unrecognised'],
    ['NaN', 'Unrecognised'],
    ['-40 DS', 'outside this teaching model'],
  ])('rejects "%s"', (text, frag) => {
    const r = parseRx(text);
    expect(r.ok).toBe(false);
    expect(r.errors.join(' ')).toContain(frag);
  });
  it('warns on unsigned powers and comma decimals', () => {
    const r = parseRx('4.00 -1,00 x 90');
    expect(r.ok).toBe(true);
    expect(r.warnings.length).toBeGreaterThanOrEqual(2);
  });
  it('structured fields', () => {
    expect(lensFromFields('', '-4.00', '180').lens).toEqual({ sphereD: 0, cylinderD: -4, axisDeg: 180 });
    expect(lensFromFields('-2', '', '90').warnings.join()).toContain('axis is undefined');
    expect(lensFromFields('-2', '0', '90').lens).toEqual({ sphereD: -2, cylinderD: 0, axisDeg: null });
    expect(lensFromFields('0', '-1', '').ok).toBe(false);
  });
});

describe('inverse problems', () => {
  it('reconstructs from declared principal meridians in any order', () => {
    const a = fromPowerCross({ meridianADeg: 180, powerAD: 0, meridianBDeg: 90, powerBD: -4 });
    const b = fromPowerCross({ meridianADeg: 90, powerAD: -4, meridianBDeg: 0, powerBD: 0 });
    expect(a.ok && b.ok).toBe(true);
    if (a.ok && b.ok) {
      expect(a.lens).toEqual({ sphereD: 0, cylinderD: -4, axisDeg: 180 });
      expect(opticallyEquivalent(a.lens, b.lens)).toBe(true);
    }
  });
  it('rejects non-orthogonal principal meridians', () => {
    const r = fromPowerCross({ meridianADeg: 30, powerAD: 0, meridianBDeg: 100, powerBD: -2 });
    expect(r.ok).toBe(false);
  });
  it('power cross of oblique lens', () => {
    const pc = toPowerCross(makeLens(1, -3, 45));
    close(pc.powerAD, 1);
    expect(pc.meridianADeg).toBeCloseTo(45, 9);
    close(pc.powerBD, -2);
  });
  it('two meridians (90/180) are underdetermined for an oblique lens; opposite meridians do not add rank', () => {
    expect(fitMeridionalSamples([{ thetaDeg: 90, powerD: -2 }, { thetaDeg: 180, powerD: -2 }]).status).toBe('underdetermined');
    expect(fitMeridionalSamples([{ thetaDeg: 30, powerD: -1 }, { thetaDeg: 210, powerD: -1 }, { thetaDeg: 90, powerD: -4 }]).status).toBe('underdetermined');
  });
  it('three distinct meridians give a unique exact fit', () => {
    const rx = makeLens(0, -4, 45);
    const s = [0, 45, 90].map((t) => ({ thetaDeg: t, powerD: meridionalPower(rx, t) }));
    const f = fitMeridionalSamples(s);
    expect(f.status).toBe('unique');
    if (f.status === 'unique') {
      expect(f.exact).toBe(true);
      expect(opticallyEquivalent(f.lens, rx, 1e-9)).toBe(true);
    }
  });
  it('noisy over-determined fit reports residual', () => {
    const rx = makeLens(-1, -2, 30);
    const s = [0, 30, 60, 90, 120, 150].map((t, i) => ({ thetaDeg: t, powerD: meridionalPower(rx, t) + (i % 2 ? 0.1 : -0.1) }));
    const f = fitMeridionalSamples(s);
    expect(f.status === 'unique' && f.rmsResidualD > 0.05).toBe(true);
  });
});

describe('composition, vertex, prism, near add', () => {
  it('matrix addition, not cylinder/axis arithmetic', () => {
    // Two crossed −1 cylinders at 180 and 090 = −1 DS.
    const sum = fromMatrix(addMatrices(toMatrix(makeLens(0, -1, 180)), toMatrix(makeLens(0, -1, 90))));
    expect(sum).toEqual({ sphereD: -1, cylinderD: 0, axisDeg: null });
    // Oblique: naive arithmetic would give plano −2 × 067.5; the true result differs.
    const ob = fromMatrix(addMatrices(toMatrix(makeLens(0, -1, 45)), toMatrix(makeLens(0, -1, 90))));
    expect(opticallyEquivalent(ob, makeLens(0, -2, 67.5))).toBe(false);
    close(ob.cylinderD, -Math.SQRT2, 1e-9);
  });
  it('vertex conversion applies to both principal powers and guards singularity', () => {
    const r = vertexConvert(makeLens(-10, -2, 180), 0.012);
    expect(r.ok).toBe(true);
    if (r.ok) {
      close(r.lens.sphereD, -10 / (1 + 0.12), 1e-9);
      close(r.lens.sphereD + r.lens.cylinderD, -12 / (1 + 0.144), 1e-9);
    }
    expect(vertexConvert(makeLens(10), 0.1).ok).toBe(false);
  });
  it('Prentice and near ADD', () => {
    expect(prenticePrismDioptres(0.5, -4)).toBe(2);
    expect(addNear(makeLens(0, -4, 180), 2)).toEqual({ sphereD: 2, cylinderD: -4, axisDeg: 180 });
  });
  it('acuity notation', () => {
    expect(decimalAcuity(6, 12)).toBe(0.5);
    close(logMAR(decimalAcuity(6, 60)), 1);
    close(logMAR(1), 0);
  });
  it('WTR/ATR is about the written minus-cyl axis', () => {
    expect(astigmatismOrientation(makeLens(0, -4, 180))).toBe('with-the-rule');
    expect(astigmatismOrientation(makeLens(-4, 4, 90))).toBe('with-the-rule');
    expect(astigmatismOrientation(makeLens(0, -1, 90))).toBe('against-the-rule');
    expect(astigmatismOrientation(makeLens(0, -1, 45))).toBe('oblique');
  });
});

describe('retinoscopy', () => {
  const target = makeLens(0, -4, 180);
  it('0.50 m gross +2.00 −4.00 × 180 → net plano −4.00 × 180', () => {
    const net = grossToNet(makeLens(2, -4, 180), 0.5, false);
    expect(net).toEqual({ sphereD: 0, cylinderD: -4, axisDeg: 180 });
    expect(netToGross(net, 0.5)).toEqual({ sphereD: 2, cylinderD: -4, axisDeg: 180 });
  });
  it('no double subtraction when a working-distance lens is already in the frame', () => {
    expect(grossToNet(makeLens(0, -4, 180), 0.5, true)).toEqual({ sphereD: 0, cylinderD: -4, axisDeg: 180 });
  });
  it('0.67 m vs 2/3 m', () => {
    close(1 / 0.67, 1.492537, 1e-6);
    close(1 / (2 / 3), 1.5, 1e-12);
  });
  it('vertical streak measures horizontal meridian; with/against/neutral', () => {
    const plano = makeLens(0);
    const o = retinoscopy(target, plano, 90, 0.5);
    expect(o.measuredMeridianDeg).toBe(180);
    close(o.grossNeutralD, 2);
    expect(o.motion).toBe('with');
    const n = retinoscopy(target, makeLens(2), 90, 0.5);
    expect(n.motion).toBe('neutral');
    const v = retinoscopy(target, makeLens(2), 180, 0.5); // horizontal streak → vertical meridian
    expect(v.measuredMeridianDeg).toBe(90);
    close(v.grossNeutralD, -2);
    expect(v.motion).toBe('against');
  });
  it('changing working distance changes gross neutral, not the patient target', () => {
    const a = retinoscopy(target, makeLens(0), 90, 0.5);
    const b = retinoscopy(target, makeLens(0), 90, 2 / 3);
    close(a.grossNeutralD - b.grossNeutralD, 0.5);
    expect(target).toEqual({ sphereD: 0, cylinderD: -4, axisDeg: 180 });
  });
  it('break phenomenon when streak is off the principal meridians', () => {
    expect(retinoscopy(target, makeLens(0), 120, 0.5).breakPhenomenon).toBe(true);
    expect(retinoscopy(target, makeLens(0), 90, 0.5).breakPhenomenon).toBe(false);
  });
});

describe('JCC', () => {
  it('±0.25 has +0.25/−0.25 principal powers, zero SE, 0.50 difference', () => {
    const j = jcc(0.25, 90);
    const p = principalMeridians(toMatrix(j));
    close(p.maxD, 0.25);
    close(p.minD, -0.25);
    close(sphericalEquivalent(j), 0);
    close(p.maxD - p.minD, 0.5);
  });
  it('flip swaps meridians; preference follows declared residual metric', () => {
    const target = makeLens(0, -1, 180);
    const trial = makeLens(0, -0.5, 180); // under-corrected cylinder
    const m = toMatrix(trial);
    // JCC minus-cyl axis at 180 adds minus cylinder at 180 axis → closer to target.
    const v1 = addMatrices(m, toMatrix(jcc(0.25, 180)));
    const v2 = addMatrices(m, toMatrix(jcc(0.25, 90)));
    expect(patientPreference(target, v1, v2)).toBe('first');
    expect(patientPreference(target, toMatrix(target), toMatrix(target))).toBe('same');
  });
});

describe('reduced eye', () => {
  it('target correction neutralises: both foci on the retina', () => {
    const t = makeLens(1, -3, 45);
    const s = eyeState(t, t);
    for (const l of s.lines) {
      expect(l.kind).toBe('real');
      close(l.depthM!, s.retinaDepthM, 1e-12);
    }
    expect(s.spherical).toBe(true);
  });
  it('simple myopic astigmatism uncorrected: one focus on retina, one in front; line orientation ⟂ converging meridian', () => {
    const s = eyeState(makeLens(0, -4, 180), makeLens(0));
    const onRetina = s.lines.find((l) => Math.abs(l.depthM! - s.retinaDepthM) < 1e-12)!;
    const front = s.lines.find((l) => l !== onRetina)!;
    expect(onRetina.convergingMeridianDeg).toBe(180);
    expect(onRetina.lineOrientationDeg).toBe(90);
    expect(front.convergingMeridianDeg).toBe(90);
    expect(front.depthM!).toBeLessThan(s.retinaDepthM);
  });
  it('categories place retina correctly relative to the foci', () => {
    const rel = (t: ReturnType<typeof makeLens>) => {
      const s = eyeState(t, makeLens(0));
      return s.lines.map((l) => Math.sign(Number((l.depthM! - s.retinaDepthM).toFixed(12)))).sort();
    };
    expect(rel(makeLens(-2, -1, 180))).toEqual([-1, -1]); // both in front
    expect(rel(makeLens(2, 1, 90))).toEqual([1, 1]); // both behind
    expect(rel(makeLens(1, -2, 180))).toEqual([-1, 1]); // straddle
    expect(rel(makeLens(0, 2, 90))).toEqual([0, 1]);
  });
  it('real / infinity / virtual focus', () => {
    const dret = (4 / 3) / ((4 / 3) / 60);
    // Trial lens of −60 D removes all eye power: focus at infinity.
    expect(eyeState(makeLens(0), makeLens(-dret)).lines[0].kind).toBe('infinity');
    expect(eyeState(makeLens(0), makeLens(-dret - 5)).lines[0].kind).toBe('virtual');
  });
  it('near object and accommodation', () => {
    const s = eyeState(makeLens(0), makeLens(0), { objectDistanceM: 0.4 });
    expect(s.lines[0].depthM!).toBeGreaterThan(s.retinaDepthM);
    const s2 = eyeState(makeLens(0), makeLens(0), { objectDistanceM: 0.4, accommodationD: 2.5 });
    close(s2.lines[0].depthM!, s2.retinaDepthM, 1e-12);
  });
  it('circle of least confusion uses vergence midpoint, not arithmetic midpoint', () => {
    const c = fx.colc;
    // Build an eye with principal vergences 60 and 64 D.
    const t = makeLens(0, -4, 180); // Qeye = 60I − Q → 60 at 180, 64 at 90
    const s = eyeState(t, makeLens(0));
    close(s.colcDepthM!, c.z_colc, 1e-12);
    const mid = (s.lines[0].depthM! + s.lines[1].depthM!) / 2;
    close(mid, c.z_arith_mid, 1e-12);
    expect(Math.abs(mid - s.colcDepthM!)).toBeGreaterThan(1e-6);
    // At COLC the blur ellipse is circular.
    const b = blurEllipseAt(s, s.colcDepthM!, 1);
    close(b[0].semiAxis, b[1].semiAxis, 1e-12);
  });
});
