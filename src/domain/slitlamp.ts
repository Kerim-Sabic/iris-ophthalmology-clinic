/**
 * LAB08 — constrained slit-lamp model (original schematic, declared teaching assumptions).
 *
 * Ground truth: an authored anterior-segment scene (layers at fixed schematic depths + findings).
 * Examination conditions: beam width/height, illumination angle, focus depth, magnification,
 * lateral beam position, room light. Observations: computed from those conditions only — a finding
 * is visible only when the beam reaches it, the focus is within the depth of field and the
 * technique can reveal that kind of finding. Depth (layer) is only established with an optical
 * section. No cell/flare grades are produced (no verified grading standard is applied).
 */

export type Layer = 'tear-film' | 'epithelium' | 'stroma' | 'endothelium' | 'anterior-chamber' | 'iris' | 'lens-anterior' | 'lens-nucleus' | 'lens-posterior' | 'anterior-vitreous';

/** Schematic depths in mm from the corneal surface (not patient measurements). */
export const LAYERS: Record<Layer, { name: string; from: number; to: number }> = {
  'tear-film': { name: 'Tear film', from: 0, to: 0.01 },
  epithelium: { name: 'Corneal epithelium', from: 0.01, to: 0.06 },
  stroma: { name: 'Corneal stroma', from: 0.06, to: 0.5 },
  endothelium: { name: 'Corneal endothelium', from: 0.5, to: 0.53 },
  'anterior-chamber': { name: 'Anterior chamber (aqueous)', from: 0.53, to: 3.0 },
  iris: { name: 'Iris', from: 3.0, to: 3.4 },
  'lens-anterior': { name: 'Lens: anterior capsule / cortex', from: 3.6, to: 4.6 },
  'lens-nucleus': { name: 'Lens: nucleus', from: 4.6, to: 6.6 },
  'lens-posterior': { name: 'Lens: posterior cortex / capsule', from: 6.6, to: 7.6 },
  'anterior-vitreous': { name: 'Anterior vitreous', from: 7.6, to: 9.5 },
};
export const LAYER_ORDER = Object.keys(LAYERS) as Layer[];
export const layerMid = (l: Layer) => (LAYERS[l].from + LAYERS[l].to) / 2;

export type FindingKind = 'opacity' | 'deposits' | 'cells' | 'flare' | 'red-reflex-shadow';
export const KIND_TEXT: Record<FindingKind, string> = {
  opacity: 'a grey-white opacity',
  deposits: 'fine pigmented dots',
  cells: 'small particles moving in the beam',
  flare: 'a faint haze making the beam path visible through the aqueous',
  'red-reflex-shadow': 'a dark shadow against the red reflex',
};

export interface Finding {
  id: string;
  layer: Layer;
  kind: FindingKind;
  /** Lateral centre and half-width across the cornea, mm (patient-independent schematic x). */
  x: number;
  halfWidth: number;
}

export interface Scene {
  id: string;
  label: string;
  vignette: string;
  findings: Finding[];
  /** What a penlight/external examination can report for this scene (authored). */
  penlight: string[];
  reviewStatus: 'draft';
}

export interface LampSettings {
  beamWidthMm: number; // 0.1–8
  beamHeightMm: number; // 1–10
  angleDeg: number; // 0–60 between illumination and microscope
  focusMm: number; // depth of the focal plane, 0–9.5
  magnification: 6 | 10 | 16 | 25;
  beamX: number; // lateral beam centre, mm (−6..6)
  roomDark: boolean;
}

export const DEFAULT_SETTINGS: LampSettings = { beamWidthMm: 8, beamHeightMm: 10, angleDeg: 45, focusMm: 0, magnification: 10, beamX: 0, roomDark: false };

export type Technique = 'diffuse' | 'parallelepiped' | 'optical-section' | 'conical-beam' | 'retroillumination';
export const TECHNIQUE_NAME: Record<Technique, string> = {
  diffuse: 'Diffuse illumination',
  parallelepiped: 'Parallelepiped (moderately wide beam)',
  'optical-section': 'Optical section (narrow beam, wide angle)',
  'conical-beam': 'Conical / pinpoint beam',
  retroillumination: 'Retroillumination (light returned from behind)',
};

/** Declared classification of the current beam geometry into a technique. */
export function technique(s: LampSettings): Technique {
  if (s.angleDeg <= 5 && s.focusMm >= LAYERS['lens-posterior'].to) return 'retroillumination';
  if (s.beamWidthMm <= 0.3 && s.beamHeightMm <= 2) return 'conical-beam';
  if (s.beamWidthMm <= 0.3 && s.angleDeg >= 30) return 'optical-section';
  if (s.beamWidthMm >= 4) return 'diffuse';
  return 'parallelepiped';
}

/** Declared depth of field (mm) — a teaching parameter, not optical data for any instrument. */
export const depthOfField = (mag: LampSettings['magnification']) => 6 / mag;

export type Visibility = { seen: false; reason: string } | { seen: true; localised: boolean; text: string };

function inFocus(s: LampSettings, l: Layer): boolean {
  const dof = depthOfField(s.magnification);
  return s.focusMm >= LAYERS[l].from - dof && s.focusMm <= LAYERS[l].to + dof;
}

function beamReaches(s: LampSettings, f: Finding, t: Technique): boolean {
  if (t === 'diffuse' || t === 'retroillumination') return true;
  return Math.abs(f.x - s.beamX) <= s.beamWidthMm / 2 + f.halfWidth;
}

export function visibility(s: LampSettings, f: Finding): Visibility {
  const t = technique(s);
  if (!beamReaches(s, f, t)) return { seen: false, reason: 'outside the beam' };
  if (f.kind === 'cells' || f.kind === 'flare') {
    if (t !== 'conical-beam') return { seen: false, reason: 'aqueous particles need a short, narrow (conical) beam' };
    if (!s.roomDark) return { seen: false, reason: 'room light swamps the faint beam' };
    if (s.magnification < 16) return { seen: false, reason: 'magnification too low' };
    if (layerAtFocus(s) !== 'anterior-chamber') return { seen: false, reason: 'focus is not in the anterior chamber' };
    return { seen: true, localised: true, text: `In the aqueous of the anterior chamber: ${KIND_TEXT[f.kind]}. (No grade is assigned in this model.)` };
  }
  if (f.kind === 'red-reflex-shadow') {
    if (t !== 'retroillumination') return { seen: false, reason: 'only visible against the red reflex' };
    return { seen: true, localised: false, text: `Against the red reflex: ${KIND_TEXT[f.kind]} (depth not established by retroillumination alone).` };
  }
  if (t === 'retroillumination') {
    if (f.layer.startsWith('lens') || f.layer === 'stroma') return { seen: true, localised: false, text: `Against the red reflex: a dark shadow (depth not established by retroillumination alone).` };
    return { seen: false, reason: 'not shown up by light returned from behind' };
  }
  if (!inFocus(s, f.layer)) return { seen: false, reason: 'out of focus' };
  if (f.kind === 'deposits' && s.magnification < 16) return { seen: false, reason: 'too fine for this magnification' };
  if (t === 'diffuse') return { seen: true, localised: false, text: `${cap(KIND_TEXT[f.kind])} is visible; its depth cannot be judged in diffuse light.` };
  if (t === 'optical-section') return { seen: true, localised: true, text: `In the optical section the finding lies in the ${LAYERS[f.layer].name.toLowerCase()}: ${KIND_TEXT[f.kind]}.` };
  return { seen: true, localised: false, text: `${cap(KIND_TEXT[f.kind])} in the beam; narrow the beam and widen the angle to judge its depth.` };
}

const cap = (t: string) => t[0].toUpperCase() + t.slice(1);

/** Which layer is in sharp focus inside the beam (what an optical section "cuts" at the focal plane). */
export function layerAtFocus(s: LampSettings): Layer | null {
  return LAYER_ORDER.find((l) => s.focusMm >= LAYERS[l].from && s.focusMm < LAYERS[l].to) ?? null;
}

export interface ExposureLog {
  /** Layers examined in optical section (beam narrow, angle wide, focus in that layer). */
  sectioned: Layer[];
  /** Findings seen (any technique) and findings localised by depth. */
  seen: string[];
  localised: string[];
  techniques: Technique[];
}

export const emptyLog = (): ExposureLog => ({ sectioned: [], seen: [], localised: [], techniques: [] });

/** Fold the current settings into the exposure log (pure). */
export function logExposure(log: ExposureLog, scene: Scene, s: LampSettings): ExposureLog {
  const t = technique(s);
  const out: ExposureLog = { sectioned: [...log.sectioned], seen: [...log.seen], localised: [...log.localised], techniques: log.techniques.includes(t) ? [...log.techniques] : [...log.techniques, t] };
  const l = layerAtFocus(s);
  if ((t === 'optical-section' || (t === 'conical-beam' && l === 'anterior-chamber' && s.roomDark && s.magnification >= 16)) && l && !out.sectioned.includes(l)) out.sectioned.push(l);
  for (const f of scene.findings) {
    const v = visibility(s, f);
    if (v.seen && !out.seen.includes(f.id)) out.seen.push(f.id);
    if (v.seen && v.localised && !out.localised.includes(f.id)) out.localised.push(f.id);
  }
  return out;
}

export interface DocEntry {
  layer: Layer;
  kind: FindingKind | 'normal';
}

export interface SlitGrade {
  correct: boolean;
  rows: { entry: string; verdict: string }[];
  missed: string[];
  unexamined: Layer[];
}

/** Documentation is scored only against what the learner actually exposed. */
export function gradeDocumentation(scene: Scene, log: ExposureLog, entries: DocEntry[]): SlitGrade {
  const rows: SlitGrade['rows'] = [];
  let ok = true;
  for (const e of entries) {
    const label = `${LAYERS[e.layer].name}: ${e.kind === 'normal' ? 'no abnormality seen' : KIND_TEXT[e.kind]}`;
    const exposed = log.sectioned.includes(e.layer) || scene.findings.some((f) => f.layer === e.layer && log.localised.includes(f.id));
    const truth = scene.findings.filter((f) => f.layer === e.layer);
    if (!exposed) {
      rows.push({ entry: label, verdict: 'unsupported — this layer was never exposed in an optical section or conical beam' });
      ok = false;
    } else if (e.kind === 'normal') {
      const v = truth.length ? `incorrect — the exposed layer contains ${KIND_TEXT[truth[0].kind]}` : 'supported';
      if (truth.length) ok = false;
      rows.push({ entry: label, verdict: v });
    } else if (truth.some((f) => f.kind === e.kind)) rows.push({ entry: label, verdict: 'supported by your examination' });
    else {
      rows.push({ entry: label, verdict: truth.length ? `wrong description — ${KIND_TEXT[truth[0].kind]} is present here` : 'not present in this layer' });
      ok = false;
    }
  }
  const documented = new Set(entries.filter((e) => e.kind !== 'normal').map((e) => `${e.layer}:${e.kind}`));
  const missed = scene.findings.filter((f) => f.kind !== 'red-reflex-shadow' && !documented.has(`${f.layer}:${f.kind}`)).map((f) => f.id);
  if (missed.length) ok = false;
  const unexamined = LAYER_ORDER.filter((l) => l !== 'tear-film' && l !== 'anterior-vitreous' && !log.sectioned.includes(l));
  return { correct: ok, rows, missed, unexamined };
}

export const SCENES: Scene[] = [
  {
    id: 'sl-a3', label: 'Scene A', vignette: 'Fictional: 34-year-old, a small white spot noticed in the right cornea, vision slightly reduced.', reviewStatus: 'draft',
    findings: [{ id: 'a-opac', layer: 'stroma', kind: 'opacity', x: 0.8, halfWidth: 0.6 }],
    penlight: ['A small white spot on the cornea, slightly off-centre.', 'Depth and anterior-chamber detail cannot be judged with a penlight.'],
  },
  {
    id: 'sl-b7', label: 'Scene B', vignette: 'Fictional: 41-year-old, painful red right eye with light sensitivity for three days.', reviewStatus: 'draft',
    findings: [
      { id: 'b-cells', layer: 'anterior-chamber', kind: 'cells', x: 0, halfWidth: 4 },
      { id: 'b-kp', layer: 'endothelium', kind: 'deposits', x: 0, halfWidth: 2 },
    ],
    penlight: ['Redness most marked around the cornea.', 'Cornea looks clear; anterior-chamber particles cannot be seen with a penlight.'],
  },
  {
    id: 'sl-c2', label: 'Scene C', vignette: 'Fictional: 58-year-old, glare from headlights and difficulty reading in bright light.', reviewStatus: 'draft',
    findings: [
      { id: 'c-psc', layer: 'lens-posterior', kind: 'opacity', x: 0, halfWidth: 1.5 },
      { id: 'c-shadow', layer: 'lens-posterior', kind: 'red-reflex-shadow', x: 0, halfWidth: 1.5 },
    ],
    penlight: ['Pupils and cornea look unremarkable with a penlight.', 'The lens cannot be assessed properly without a slit lamp or red reflex.'],
  },
  {
    id: 'sl-d5', label: 'Scene D', vignette: 'Fictional: 25-year-old attending for a routine check before contact-lens fitting.', reviewStatus: 'draft',
    findings: [],
    penlight: ['No abnormality seen with a penlight — this does not replace a slit-lamp examination.'],
  },
];

export const sceneById = (id: string) => SCENES.find((s) => s.id === id);

/** Coherence checks for authored scenes. */
export function validateScene(sc: Scene): string[] {
  const errs: string[] = [];
  if (/opac|cell|kp|cataract|uveit|scar|normal/i.test(`${sc.id} ${sc.label}`)) errs.push(`${sc.id}: identifier leaks the finding`);
  for (const f of sc.findings) {
    if ((f.kind === 'cells' || f.kind === 'flare') && f.layer !== 'anterior-chamber') errs.push(`${f.id}: aqueous particles must be in the anterior chamber`);
    if (Math.abs(f.x) + f.halfWidth > 6.5) errs.push(`${f.id}: outside the cornea`);
  }
  return errs;
}
