import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS, LAYERS, SCENES, emptyLog, gradeDocumentation, layerAtFocus, logExposure, sceneById, technique, validateScene, visibility, type LampSettings } from '../src/domain/slitlamp';

const S = (o: Partial<LampSettings>): LampSettings => ({ ...DEFAULT_SETTINGS, ...o });
const section = (focusMm: number, extra: Partial<LampSettings> = {}) => S({ beamWidthMm: 0.2, beamHeightMm: 8, angleDeg: 45, focusMm, magnification: 16, ...extra });

describe('slit-lamp technique classification', () => {
  it('maps beam geometry to the declared technique', () => {
    expect(technique(S({}))).toBe('diffuse');
    expect(technique(S({ beamWidthMm: 1.5 }))).toBe('parallelepiped');
    expect(technique(section(0.3))).toBe('optical-section');
    expect(technique(S({ beamWidthMm: 0.2, beamHeightMm: 1, angleDeg: 45 }))).toBe('conical-beam');
    expect(technique(S({ angleDeg: 0, focusMm: 8 }))).toBe('retroillumination');
    expect(technique(S({ beamWidthMm: 0.2, angleDeg: 10 }))).toBe('parallelepiped'); // narrow but angle too small for a section
  });
  it('layer at focus follows the schematic depths', () => {
    expect(layerAtFocus(S({ focusMm: 0.3 }))).toBe('stroma');
    expect(layerAtFocus(S({ focusMm: 1.5 }))).toBe('anterior-chamber');
    expect(layerAtFocus(S({ focusMm: 7 }))).toBe('lens-posterior');
  });
});

describe('visibility depends on the controls, not on the diagnosis', () => {
  const a = sceneById('sl-a3')!.findings[0];
  it('stromal opacity: seen in diffuse light without depth; localised only in an optical section focused on stroma', () => {
    const d = visibility(S({ focusMm: 0.2 }), a);
    expect(d.seen && !d.localised).toBe(true);
    const o = visibility(section(0.3, { beamX: 0.8 }), a);
    expect(o.seen && o.localised).toBe(true);
    if (o.seen) expect(o.text).toContain('corneal stroma');
    expect(visibility(section(0.3, { beamX: -4 }), a).seen).toBe(false); // beam elsewhere
    expect(visibility(section(5, { beamX: 0.8 }), a).seen).toBe(false); // out of focus
  });
  it('anterior-chamber cells need a conical beam, dark room, ≥16× and AC focus; never graded', () => {
    const cells = sceneById('sl-b7')!.findings.find((f) => f.kind === 'cells')!;
    const cone = S({ beamWidthMm: 0.2, beamHeightMm: 1, angleDeg: 45, focusMm: 1.5, magnification: 16, roomDark: true });
    const v = visibility(cone, cells);
    expect(v.seen).toBe(true);
    if (v.seen) expect(v.text).toMatch(/No grade/);
    expect(visibility({ ...cone, roomDark: false }, cells).seen).toBe(false);
    expect(visibility({ ...cone, magnification: 10 }, cells).seen).toBe(false);
    expect(visibility({ ...cone, focusMm: 0.3 }, cells).seen).toBe(false);
    expect(visibility(S({ focusMm: 1.5 }), cells).seen).toBe(false); // diffuse: invisible
  });
  it('posterior lens opacity: retroillumination shows a shadow without depth; section localises it', () => {
    const psc = sceneById('sl-c2')!.findings[0];
    const r = visibility(S({ angleDeg: 0, focusMm: 8 }), psc);
    expect(r.seen && !r.localised).toBe(true);
    const o = visibility(section(7), psc);
    expect(o.seen && o.localised).toBe(true);
  });
  it('a beam change never creates or removes findings in the scene', () => {
    const sc = sceneById('sl-b7')!;
    const before = JSON.stringify(sc);
    for (const w of [0.1, 1, 8]) for (const f of [0, 1, 4, 7]) for (const f2 of sc.findings) visibility(S({ beamWidthMm: w, focusMm: f }), f2);
    expect(JSON.stringify(sc)).toBe(before);
  });
});

describe('documentation from exposed evidence only', () => {
  it('documenting a layer never sectioned is unsupported; exposing it first makes it supported', () => {
    const sc = sceneById('sl-a3')!;
    let log = emptyLog();
    log = logExposure(log, sc, S({ focusMm: 0.2 })); // diffuse only
    const g1 = gradeDocumentation(sc, log, [{ layer: 'stroma', kind: 'opacity' }]);
    expect(g1.rows[0].verdict).toMatch(/^unsupported/);
    log = logExposure(log, sc, section(0.3, { beamX: 0.8 }));
    const g2 = gradeDocumentation(sc, log, [{ layer: 'stroma', kind: 'opacity' }]);
    expect(g2.correct).toBe(true);
    expect(g2.unexamined).toContain('lens-nucleus');
  });
  it('normal scene: "no abnormality" is supported only for sectioned layers; a missed finding fails', () => {
    const d = sceneById('sl-d5')!;
    const log = [0.03, 0.3, 0.51].reduce((l, f) => logExposure(l, d, section(f)), emptyLog());
    expect(gradeDocumentation(d, log, [{ layer: 'stroma', kind: 'normal' }]).correct).toBe(true);
    expect(gradeDocumentation(d, log, [{ layer: 'lens-nucleus', kind: 'normal' }]).rows[0].verdict).toMatch(/^unsupported/);
    const b = sceneById('sl-b7')!;
    const lb = logExposure(emptyLog(), b, section(0.51));
    const gb = gradeDocumentation(b, lb, [{ layer: 'endothelium', kind: 'deposits' }]);
    expect(gb.rows[0].verdict).toMatch(/supported/);
    expect(gb.missed).toContain('b-cells');
    expect(gb.correct).toBe(false);
  });
  it('authored scenes are coherent and do not leak findings in identifiers', () => {
    for (const s of SCENES) expect(validateScene(s)).toEqual([]);
    expect(Object.values(LAYERS).every((l) => l.to > l.from)).toBe(true);
  });
});
