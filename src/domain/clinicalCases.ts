/**
 * Non-refractive clinical cases (pupil / visual pathway / alignment families) for the shared case engine.
 * One immutable case truth drives every test through the LAB05/06/07 domain models; observations are
 * produced only by performed actions; the assessment is scored per dimension against obtained evidence.
 */
import * as Fld from './fields';
import * as Mot from './motility';
import * as Pup from './pupils';

type Eye = 'OD' | 'OS';
const EYES: Eye[] = ['OD', 'OS'];

export type ClinicalFamily = 'afferent-pathway' | 'visual-pathway' | 'alignment' | 'efferent-pupil';

export interface ClinicalCaseDef {
  id: string;
  label: string;
  name: string;
  age: number;
  complaint: string;
  family: ClinicalFamily;
  history: { q: string; a: string }[];
  truth: {
    pupil: Pup.PupilFinding;
    field: Fld.Lesion | null;
    motility: Mot.MotilityFinding;
    /** Authored acuity observations (6 m, Snellen). */
    va: Record<Eye, { unaided: string; pinhole: string }>;
    /** Authored reliability variant for confrontation testing. */
    fixationLoss?: Eye[];
  };
  nextActions: { value: string; label: string; correct: boolean; why: string }[];
  learningPoint: string;
  counterfactual: string;
  sources: string[];
  reviewStatus: 'draft';
}

export const LOCALISATIONS = {
  none: 'No pathway lesion demonstrated',
  'prechiasmal-OD': 'Pre-chiasmal, right eye / optic nerve',
  'prechiasmal-OS': 'Pre-chiasmal, left eye / optic nerve',
  chiasm: 'Optic chiasm',
  'retro-right': 'Right retrochiasmal pathway (tract, radiation or cortex)',
  'retro-left': 'Left retrochiasmal pathway (tract, radiation or cortex)',
  'efferent-OD': 'Efferent pupil pathway, right',
  'efferent-OS': 'Efferent pupil pathway, left',
  alignment: 'Ocular alignment (not a visual-pathway lesion)',
} as const;
export type Localisation = keyof typeof LOCALISATIONS;

const toFieldEye = (e: Eye): Fld.Eye => (e === 'OD' ? 'R' : 'L');
const snellenDen = (s: string) => Number(s.split('/')[1]);

export function expectedLocalisation(c: ClinicalCaseDef): Localisation {
  const f = c.truth.field;
  if (f) {
    if (f.site === 'optic-nerve') return f.side === 'R' ? 'prechiasmal-OD' : 'prechiasmal-OS';
    if (f.site === 'chiasm') return 'chiasm';
    return f.side === 'R' ? 'retro-right' : 'retro-left';
  }
  const p = c.truth.pupil;
  if (p === 'para-OD' || p === 'symp-OD') return 'efferent-OD';
  if (p === 'para-OS' || p === 'symp-OS') return 'efferent-OS';
  if (c.truth.motility !== 'ortho') return 'alignment';
  return 'none';
}

export function expectedFieldPattern(c: ClinicalCaseDef): string {
  return c.truth.field ? Fld.patternName(c.truth.field) : Fld.NO_LOSS;
}

/** Field-pattern answer options: every modelled pattern + no loss (no hint which applies). */
export function fieldPatternOptions(): string[] {
  return [Fld.NO_LOSS, ...new Set(Fld.ALL_LESIONS.map(Fld.patternName))];
}

export const CLINICAL_CASES: ClinicalCaseDef[] = [
  {
    id: 'pt-q1v', label: 'Patient I', name: 'Nermina (fictional)', age: 29, family: 'afferent-pathway',
    complaint: 'Blurred, washed-out vision in the right eye for five days; aching on eye movement.',
    history: [
      { q: 'Onset and course?', a: 'Worsened over several days.' },
      { q: 'Pain?', a: 'Aching behind the right eye, worse when looking around.' },
      { q: 'Colours?', a: 'Colours look faded with the right eye.' },
      { q: 'Other neurological symptoms?', a: 'None reported today.' },
    ],
    truth: { pupil: 'afferent-OD', field: { site: 'optic-nerve', side: 'R', variant: 'central-scotoma' }, motility: 'ortho', va: { OD: { unaided: '6/36', pinhole: '6/36' }, OS: { unaided: '6/6', pinhole: '6/6' } } },
    nextActions: [
      { value: 'urgent', label: 'Urgent same-day ophthalmology / neuro-ophthalmology assessment per local protocol', correct: true, why: 'New monocular visual loss with an afferent defect needs urgent assessment; the cause is not established by these tests.' },
      { value: 'glasses', label: 'Refraction and glasses', correct: false, why: 'Pinhole did not improve acuity: the loss is not refractive.' },
      { value: 'routine', label: 'Routine review in a few months', correct: false, why: 'New visual loss with an afferent defect should not wait.' },
    ],
    learningPoint: 'Reduced acuity not improved by pinhole + a relative afferent defect + central loss in the same eye localise to the anterior visual pathway of that eye. The cause is not established by these findings alone.',
    counterfactual: 'If pinhole had restored 6/6 and the pupils were normal, an optical cause would be favoured instead.',
    sources: ['K1', 'K3'], reviewStatus: 'draft',
  },
  {
    id: 'pt-z7d', label: 'Patient J', name: 'Ibrahim (fictional)', age: 66, family: 'visual-pathway',
    complaint: 'Keeps bumping into door frames on his left side for two weeks.',
    history: [
      { q: 'Onset?', a: 'Noticed suddenly two weeks ago.' },
      { q: 'Reading?', a: 'Loses his place at the start of lines.' },
      { q: 'Medical history?', a: 'Atrial fibrillation, hypertension.' },
      { q: 'Eye pain or redness?', a: 'None.' },
    ],
    truth: { pupil: 'none', field: { site: 'occipital', side: 'R', variant: 'macular-sparing' }, motility: 'ortho', va: { OD: { unaided: '6/9', pinhole: '6/6' }, OS: { unaided: '6/9', pinhole: '6/6' } } },
    nextActions: [
      { value: 'neuro', label: 'Urgent neurological assessment and brain imaging per local stroke/neurology protocol', correct: true, why: 'A homonymous field defect localises behind the chiasm; with this vascular history urgent neurological assessment is appropriate.' },
      { value: 'glasses', label: 'Update glasses', correct: false, why: 'Acuity is near normal; the problem is the field, not refraction.' },
    ],
    learningPoint: 'Left homonymous loss in both eyes localises to the right retrochiasmal pathway; macular sparing favours the occipital cortex in teaching models. Acuity and pupils can be normal.',
    counterfactual: 'If only the right eye had lost field, the lesion would be pre-chiasmal, not homonymous.',
    sources: ['K3'], reviewStatus: 'draft',
  },
  {
    id: 'pt-c4k', label: 'Patient K', name: 'Melisa (fictional)', age: 41, family: 'visual-pathway',
    complaint: 'Clips cars on both sides when driving; headaches for months.',
    history: [
      { q: 'Onset?', a: 'Gradual over many months.' },
      { q: 'Other symptoms?', a: 'Irregular periods; headaches.' },
      { q: 'Eye pain or redness?', a: 'None.' },
    ],
    truth: { pupil: 'none', field: { site: 'chiasm', side: null }, motility: 'ortho', va: { OD: { unaided: '6/6', pinhole: '6/6' }, OS: { unaided: '6/6', pinhole: '6/6' } } },
    nextActions: [
      { value: 'imaging', label: 'Neuro-imaging of the chiasmal region and endocrine/neurosurgical referral per local pathway', correct: true, why: 'Bitemporal loss localises to the chiasm.' },
      { value: 'reassure', label: 'Reassure: acuity is 6/6', correct: false, why: 'Normal acuity does not exclude a serious field defect.' },
    ],
    learningPoint: 'Bitemporal hemianopia localises to the chiasm; acuity may be normal. The coarse grid cannot show early, asymmetric or superior-first patterns.',
    counterfactual: 'If the defect were homonymous instead, the lesion would be retrochiasmal.',
    sources: ['K3'], reviewStatus: 'draft',
  },
  {
    id: 'pt-m2e', label: 'Patient L', name: 'Lana (fictional)', age: 6, family: 'alignment',
    complaint: 'Parents notice the left eye “turns in”, especially when tired.',
    history: [
      { q: 'Since when?', a: 'Noticed over the past year.' },
      { q: 'Family history?', a: 'An uncle had a squint as a child.' },
      { q: 'General health?', a: 'Well; developing normally.' },
    ],
    truth: { pupil: 'none', field: null, motility: 'ET-OS', va: { OD: { unaided: '6/6', pinhole: '6/6' }, OS: { unaided: '6/12', pinhole: '6/12' } } },
    nextActions: [
      { value: 'paeds', label: 'Refer to paediatric ophthalmology/orthoptics, including cycloplegic refraction', correct: true, why: 'A manifest childhood deviation with reduced acuity in the deviating eye needs specialist assessment; amblyopia is possible but not established here.' },
      { value: 'wait', label: 'Reassure: likely to be outgrown', correct: false, why: 'A manifest deviation at this age should be assessed.' },
    ],
    learningPoint: 'Covering the fixing right eye makes the left eye move OUT to take up fixation: a manifest left esotropia. Pupils and fields are normal.',
    counterfactual: 'If neither eye moved on cover–uncover but each moved under alternate cover, it would be a phoria.',
    sources: ['K2', 'C3'], reviewStatus: 'draft',
  },
  {
    id: 'pt-h9s', label: 'Patient M', name: 'Senad (fictional)', age: 54, family: 'efferent-pupil',
    complaint: 'His wife noticed his right pupil looks smaller.',
    history: [
      { q: 'Since when?', a: 'Noticed this week.' },
      { q: 'Pain?', a: 'Some right-sided neck pain after lifting.' },
      { q: 'Vision?', a: 'Vision is unchanged.' },
    ],
    truth: { pupil: 'symp-OD', field: null, motility: 'ortho', va: { OD: { unaided: '6/6', pinhole: '6/6' }, OS: { unaided: '6/6', pinhole: '6/6' } } },
    nextActions: [
      { value: 'urgent', label: 'Same-day assessment per local protocol (new Horner-type pupil with neck pain)', correct: true, why: 'A new sympathetic-type anisocoria with neck pain should be assessed urgently according to current guidance; this is a principle, not a confirmed diagnosis.' },
      { value: 'rapd', label: 'Manage as a right afferent defect', correct: false, why: 'Unequal resting size with normal light reactions is not an afferent defect.' },
    ],
    learningPoint: 'Anisocoria greater in the dark with normal light reactions points to an efferent sympathetic (Horner-type) pupil — not an afferent defect.',
    counterfactual: 'If the larger pupil failed to constrict to light, the anisocoria would be greater in light (parasympathetic-type).',
    sources: ['K1'], reviewStatus: 'draft',
  },
];

export function clinicalCaseById(id: string) {
  return CLINICAL_CASES.find((c) => c.id === id);
}

// ---------------------------------------------------------------- actions → observations

export type ClinicalAction =
  | { kind: 'history'; i: number }
  | { kind: 'va'; eye: Eye; pinhole: boolean }
  | { kind: 'pupil'; test: 'light-dark' | 'direct-OD' | 'direct-OS' | 'swing' }
  | { kind: 'confrontation'; eye: Eye; quad: Fld.QuadKey }
  | { kind: 'perimetry' }
  | { kind: 'cover'; sequence: Mot.Occluder[] };

const mm = (x: number) => `${x.toFixed(1)} mm`;

export const pupilPatientOf = (c: ClinicalCaseDef) => Pup.patientFor(c.truth.pupil);
export const motilityPatientOf = (c: ClinicalCaseDef) => Mot.patientFor(c.truth.motility);

/** The observable result of one action — only what that maneuver can reveal. */
export function observe(c: ClinicalCaseDef, a: ClinicalAction): string {
  switch (a.kind) {
    case 'history':
      return `${c.history[a.i].q} ${c.history[a.i].a}`;
    case 'va':
      return `${a.eye} distance acuity ${a.pinhole ? 'with pinhole' : 'unaided'} (6 m): ${a.pinhole ? c.truth.va[a.eye].pinhole : c.truth.va[a.eye].unaided}`;
    case 'pupil': {
      const p = pupilPatientOf(c);
      if (a.test === 'light-dark') {
        const L = Pup.steadyState(p, 'light', 'none');
        const D = Pup.steadyState(p, 'dark', 'none');
        return `Resting pupils — room light: OD ${mm(L.OD)}, OS ${mm(L.OS)}; dark: OD ${mm(D.OD)}, OS ${mm(D.OS)} (schematic sizes).`;
      }
      if (a.test === 'direct-OD' || a.test === 'direct-OS') {
        const lit: Eye = a.test === 'direct-OD' ? 'OD' : 'OS';
        const o = Pup.segmentObservations(Pup.simulate(p, [{ light: 'none', ambient: 'dark', ticks: 10 }, { light: lit, ambient: 'dark', ticks: 20 }]))[1];
        const d = (e: Eye) => `${e} ${[o.change[e], Pup.strengthOf(o.changeMm[e])].filter(Boolean).join(' ')} to ${mm(o.endMm[e])}`;
        return `Light in ${lit} (dim room): ${d('OD')}; ${d('OS')}.`;
      }
      const segs = Pup.segmentObservations(Pup.simulate(p, Pup.swingSequence('OD', 4)));
      return 'Swinging light (dim room): ' + segs.slice(1).map((s) => `light to ${s.light}: ${s.change.OD === s.change.OS ? `both ${s.change.OD}` : `OD ${s.change.OD}, OS ${s.change.OS}`}`).join('; ') + '.';
    }
    case 'confrontation': {
      const r = Fld.confrontationResponse({ id: c.id, vignette: '', truth: c.truth.field, fixationLoss: (c.truth.fixationLoss ?? []).map(toFieldEye) }, toFieldEye(a.eye), a.quad);
      return `${a.eye} (other eye covered), fingers in the patient's ${Fld.quadName(a.quad)} (${Fld.examinerHand(a.quad)}): fixation ${r.fixation}; patient ${r.report}.`;
    }
    case 'perimetry': {
      const s = Fld.summarizeDefect(Fld.fieldDefect(c.truth.field));
      const desc = (e: Fld.Eye) => {
        const lost = Fld.QUADS.filter((q) => s[e].quads[q]).map(Fld.quadName);
        return lost.length ? `loss in the ${lost.join(', ')}` : 'no loss on this coarse grid';
      };
      return `Generic automated field (teaching plot; reliability authored as good): left eye ${desc('L')}; right eye ${desc('R')}.`;
    }
    case 'cover': {
      const steps = Mot.runCoverSequence(motilityPatientOf(c), a.sequence).slice(1);
      return steps.map((st) => `${st.label}: ${st.observe.map((e) => `${e} ${st.movement[e].visible ? Mot.DIRECTION_TEXT[st.movement[e].direction] : 'not visible'}`).join(', ')}`).join(' | ');
    }
  }
}

// ---------------------------------------------------------------- evidence & grading

export interface ClinicalAnswer {
  pupil: Pup.PupilFinding | 'not-examined' | '';
  fieldPattern: string; // a pattern name, 'not-examined' or ''
  motility: Mot.MotilityFinding | 'not-examined' | '';
  localisation: Localisation | '';
  next: string;
}

export function evidenceOf(actions: ClinicalAction[]) {
  const pupilTests = new Set(actions.flatMap((a) => (a.kind === 'pupil' ? [a.test] : [])));
  const conf = actions.flatMap((a) => (a.kind === 'confrontation' ? [a] : []));
  const covers = actions.flatMap((a) => (a.kind === 'cover' ? a.sequence : []));
  return {
    pupils: pupilTests.has('swing') || (pupilTests.has('direct-OD') && pupilTests.has('direct-OS')),
    anisocoria: pupilTests.has('light-dark'),
    fields: actions.some((a) => a.kind === 'perimetry') || EYES.every((e) => Fld.QUADS.every((q) => conf.some((x) => x.eye === e && x.quad === q))),
    cover: covers.includes('OD') && covers.includes('OS'),
    va: EYES.every((e) => actions.some((a) => a.kind === 'va' && a.eye === e)),
  };
}

export interface ClinicalGrade {
  correct: boolean;
  dims: Record<string, string>;
  feedback: string[];
  misconceptionIds: string[];
}

export function gradeClinical(c: ClinicalCaseDef, actions: ClinicalAction[], ans: ClinicalAnswer): ClinicalGrade {
  const ev = evidenceOf(actions);
  const dims: Record<string, string> = {};
  const fb: string[] = [];
  const mis: string[] = [];
  let ok = true;
  const dim = (name: string, examined: boolean, given: string, expected: string, label: (v: string) => string) => {
    if (!given) {
      dims[name] = 'not answered';
      ok = false;
    } else if (given === 'not-examined') {
      dims[name] = examined ? 'examined but not documented' : 'correctly recorded as not examined';
      if (examined) ok = false;
      else fb.push(`${name}: not examined — the note must not claim a normal result, and the gap limits the assessment.`);
      if (!examined && given !== expected && expected !== 'none' && expected !== 'ortho' && expected !== Fld.NO_LOSS) ok = false;
    } else if (!examined) {
      dims[name] = `unsupported: “${label(given)}” documented without the examination`;
      ok = false;
    } else if (given === expected) dims[name] = 'supported by your findings';
    else {
      dims[name] = `not supported (your findings fit: ${label(expected)})`;
      ok = false;
    }
  };
  const anisoCase = c.truth.pupil.startsWith('symp') || c.truth.pupil === 'physio';
  dim('Pupils', anisoCase ? ev.anisocoria && ev.pupils : ev.pupils, ans.pupil, c.truth.pupil, (v) => Pup.PUPIL_FINDING_LABELS[v as Pup.PupilFinding] ?? v);
  dim('Visual fields', ev.fields, ans.fieldPattern, expectedFieldPattern(c), (v) => v);
  dim('Alignment', ev.cover, ans.motility, c.truth.motility, (v) => Mot.MOTILITY_FINDING_LABELS[v as Mot.MotilityFinding] ?? v);
  const loc = expectedLocalisation(c);
  if (ans.localisation === loc) dims['Localisation'] = 'supported';
  else {
    dims['Localisation'] = ans.localisation ? `not supported (expected: ${LOCALISATIONS[loc]})` : 'not answered';
    ok = false;
  }
  const isAff = (v: string) => v.startsWith('afferent');
  const isEff = (v: string) => v.startsWith('symp') || v.startsWith('para');
  if ((isAff(ans.pupil) && isEff(c.truth.pupil)) || (isEff(ans.pupil) && isAff(c.truth.pupil))) mis.push('M-AFFERENT-VS-EFFERENT');
  if ((ans.localisation === 'retro-left' && loc === 'retro-right') || (ans.localisation === 'retro-right' && loc === 'retro-left')) {
    mis.push('M-FIELD-VS-RETINA');
    fb.push('Homonymous loss lies on the side OPPOSITE the lesion: left-field loss → right retrochiasmal pathway.');
  }
  if ((ans.motility === 'esophoria' || ans.motility === 'exophoria') && /T-/.test(c.truth.motility)) mis.push('M-PHORIA-VS-TROPIA');
  if (/T-/.test(ans.motility) && (c.truth.motility === 'esophoria' || c.truth.motility === 'exophoria')) mis.push('M-PHORIA-VS-TROPIA');
  const na = c.nextActions.find((n) => n.value === ans.next);
  dims['Next action'] = na ? (na.correct ? 'defensible' : 'not supported') : 'not answered';
  if (!na?.correct) ok = false;
  if (na) fb.push(na.why);
  dims['Baseline acuity'] = ev.va ? 'documented in both eyes' : 'missing in at least one eye';
  fb.push(c.learningPoint, `Counterfactual: ${c.counterfactual}`);
  return { correct: ok, dims, feedback: fb, misconceptionIds: mis };
}

/** Note lines generated ONLY from performed actions. */
export function clinicalNote(c: ClinicalCaseDef, actions: ClinicalAction[]): string[] {
  const lines = [`${c.label} (${c.name}), ${c.age} y. Presenting complaint: ${c.complaint}`];
  for (const a of actions) lines.push(observe(c, a));
  lines.push('Not examined (not documented): anything not listed above.');
  return lines;
}

/** Coherence checks across stations before a clinical case is eligible for assessment. */
export function validateClinicalCase(c: ClinicalCaseDef): string[] {
  const errs: string[] = [];
  if (/afferent|rapd|hemianop|chiasm|tropia|phoria|horner|optic|occipital|scotoma/i.test(`${c.id} ${c.label}`)) errs.push(`${c.id}: identifier leaks the finding`);
  const f = c.truth.field;
  const p = c.truth.pupil;
  for (const e of EYES) {
    const ua = snellenDen(c.truth.va[e].unaided);
    const ph = snellenDen(c.truth.va[e].pinhole);
    if (!(ua > 0 && ph > 0)) errs.push(`${c.id} ${e}: bad acuity notation`);
    if (ph > ua) errs.push(`${c.id} ${e}: pinhole worse than unaided`);
  }
  if (f?.site === 'optic-nerve') {
    const e: Eye = f.side === 'R' ? 'OD' : 'OS';
    if (p !== `afferent-${e}`) errs.push(`${c.id}: unilateral optic-nerve field loss requires a ${e} relative afferent defect`);
    if (!(snellenDen(c.truth.va[e].pinhole) > 6)) errs.push(`${c.id}: optic-nerve case should have reduced acuity not corrected by pinhole`);
  }
  if (p.startsWith('afferent') && f?.site !== 'optic-nerve') errs.push(`${c.id}: afferent defect without a matching anterior-pathway lesion in this teaching set`);
  if (f && f.site !== 'optic-nerve') {
    if (p !== 'none') errs.push(`${c.id}: chiasmal/retrochiasmal teaching cases here keep pupils normal`);
    for (const e of EYES) if (snellenDen(c.truth.va[e].pinhole) > 6) errs.push(`${c.id} ${e}: chiasmal/retrochiasmal case should have preserved acuity`);
  }
  if ((p.startsWith('symp') || p.startsWith('para')) && f) errs.push(`${c.id}: efferent pupil cases have no field defect`);
  const fixer: Eye | null = /-OS$/.test(c.truth.motility) ? 'OD' : /-OD$/.test(c.truth.motility) ? 'OS' : null;
  if (fixer && snellenDen(c.truth.va[fixer].pinhole) > snellenDen(c.truth.va[fixer === 'OD' ? 'OS' : 'OD'].pinhole)) errs.push(`${c.id}: fixing eye should not have worse acuity than the deviating eye`);
  if (!c.nextActions.some((n) => n.correct)) errs.push(`${c.id}: no defensible next action`);
  return errs;
}
