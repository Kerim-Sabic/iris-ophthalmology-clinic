/**
 * Authored refraction patient cases (fictional). Immutable case truth is separated from
 * examination actions, revealed observations and the learner's assessment.
 * Acuity strings are AUTHORED observations, not computed from dioptres.
 */
import { blurStrength, classify, makeLens, toMatrix, type RefractiveClass, type SpheroCyl } from './optics';

export type Eye = 'OD' | 'OS';
export type RetinoQuality = 'clear' | 'small-pupil' | 'media-haze' | 'fluctuating-accommodation';

export interface EyeTruth {
  target: SpheroCyl;
  /** Authored acuity observations under stated conditions (6 m chart, Snellen notation). */
  vaUnaided: string;
  vaPinhole: string;
  vaBestCorrected: string;
  retinoQuality: RetinoQuality;
  /** true when the visual loss is not explained by refraction (pinhole/correction do not restore). */
  nonRefractiveLoss?: boolean;
}

export interface CaseDef {
  id: string; // opaque, never reveals the classification
  label: string;
  name: string;
  age: number;
  complaint: string;
  history: { q: string; a: string }[];
  eyes: Record<Eye, EyeTruth>;
  near?: { addD: number; observation: string };
  autorefraction?: { text: string; caveat: string };
  nextActions: { value: string; label: string; correct: boolean; why: string }[];
  learningPoint: string;
  counterfactual: string;
  sources: string[];
  reviewStatus: 'draft';
}

const L = makeLens;

export const CASES: CaseDef[] = [
  {
    id: 'pt-4k2', label: 'Patient A', name: 'Lejla (fictional)', age: 22, complaint: 'Distance blur: lecture-slide text looks smeared, worse for horizontal lines.',
    history: [
      { q: 'Onset and course?', a: 'Gradually noticed over a year; no sudden change.' },
      { q: 'Pain, redness or flashes?', a: 'None.' },
      { q: 'Current glasses?', a: 'Never worn glasses.' },
      { q: 'Medical history and medications?', a: 'Healthy; no regular medications.' },
    ],
    eyes: {
      OD: { target: L(0, -2, 180), vaUnaided: '6/12', vaPinhole: '6/6', vaBestCorrected: '6/5', retinoQuality: 'clear' },
      OS: { target: L(0, -1.75, 180), vaUnaided: '6/12', vaPinhole: '6/6', vaBestCorrected: '6/5', retinoQuality: 'clear' },
    },
    nextActions: [
      { value: 'rx', label: 'Issue the refraction result for spectacle consideration; routine review', correct: true, why: 'Refractive blur explains the findings (pinhole and correction restore acuity).' },
      { value: 'urgent', label: 'Same-day urgent referral', correct: false, why: 'Nothing in the history or examination suggests an urgent cause.' },
      { value: 'mri', label: 'Order neuro-imaging', correct: false, why: 'No neurological features; refractive explanation is complete.' },
    ],
    learningPoint: 'One principal meridian (180°) needs no correction, the other needs minus: simple myopic astigmatism in the stated full-correction context.',
    counterfactual: 'If pinhole had NOT improved acuity, refraction alone would not explain the loss and further examination would be required.',
    sources: ['O1', 'O3', 'O4'], reviewStatus: 'draft',
  },
  {
    id: 'pt-9q7', label: 'Patient B', name: 'Tarik (fictional)', age: 19, complaint: 'Cannot read the bus number until it is close.',
    history: [
      { q: 'Onset and course?', a: 'Worse over the last two years.' },
      { q: 'Pain, redness or flashes?', a: 'None.' },
      { q: 'Current glasses?', a: 'Lost his glasses a year ago; prescription unknown.' },
      { q: 'Family history?', a: 'Both parents short-sighted.' },
    ],
    eyes: {
      OD: { target: L(-2, -1, 180), vaUnaided: '6/36', vaPinhole: '6/9', vaBestCorrected: '6/5', retinoQuality: 'clear' },
      OS: { target: L(-2.25, -0.75, 170), vaUnaided: '6/36', vaPinhole: '6/9', vaBestCorrected: '6/5', retinoQuality: 'clear' },
    },
    autorefraction: { text: 'R: −2.25 −1.00 × 179   L: −2.50 −0.75 × 171   (quality: good)', caveat: 'Autorefraction is a starting point; accommodation can bias it toward more minus. It is not automatically the final prescription.' },
    nextActions: [
      { value: 'rx', label: 'Issue the refraction result; routine review', correct: true, why: 'Refractive explanation with full recovery of acuity.' },
      { value: 'urgent', label: 'Same-day urgent referral', correct: false, why: 'No urgent features.' },
      { value: 'auto', label: 'Prescribe the autorefractor printout unchanged', correct: false, why: 'An autorefraction is not automatically the final prescription.' },
    ],
    learningPoint: 'Both principal meridians need minus and they differ: compound myopic astigmatism.',
    counterfactual: 'If the cylinder were 0.00, both meridians would be equal: spherical myopia.',
    sources: ['O1', 'O3', 'O4'], reviewStatus: 'draft',
  },
  {
    id: 'pt-2m8', label: 'Patient C', name: 'Amina (fictional)', age: 30, complaint: 'Eyestrain after screen work; distance vision feels “almost fine”.',
    history: [
      { q: 'When are symptoms worst?', a: 'End of the working day.' },
      { q: 'Pain, redness or flashes?', a: 'None.' },
      { q: 'Current glasses?', a: 'None.' },
    ],
    eyes: {
      OD: { target: L(0, 1.5, 90), vaUnaided: '6/9', vaPinhole: '6/6', vaBestCorrected: '6/5', retinoQuality: 'clear' },
      OS: { target: L(0, 1.25, 90), vaUnaided: '6/9', vaPinhole: '6/6', vaBestCorrected: '6/5', retinoQuality: 'clear' },
    },
    nextActions: [
      { value: 'rx', label: 'Issue the refraction result; discuss symptoms and review', correct: true, why: 'A small refractive error is a plausible contributor.' },
      { value: 'urgent', label: 'Urgent referral', correct: false, why: 'No urgent features.' },
    ],
    learningPoint: 'One meridian needs no correction, the other needs plus: simple hyperopic astigmatism.',
    counterfactual: 'Written in minus-cylinder form (+1.50 −1.50 × 180) the same eye is still simple hyperopic astigmatism: notation does not change the classification.',
    sources: ['O1', 'O3', 'O4'], reviewStatus: 'draft',
  },
  {
    id: 'pt-7h3', label: 'Patient D', name: 'Emir (fictional)', age: 35, complaint: 'Headaches after reading; distance blur late in the day.',
    history: [
      { q: 'When are symptoms worst?', a: 'After long reading sessions.' },
      { q: 'Pain, redness or flashes?', a: 'None.' },
      { q: 'Current glasses?', a: 'None.' },
    ],
    eyes: {
      OD: { target: L(2, 1, 90), vaUnaided: '6/9', vaPinhole: '6/6', vaBestCorrected: '6/5', retinoQuality: 'fluctuating-accommodation' },
      OS: { target: L(2.25, 0.75, 90), vaUnaided: '6/9', vaPinhole: '6/6', vaBestCorrected: '6/5', retinoQuality: 'fluctuating-accommodation' },
    },
    nextActions: [
      { value: 'cyclo', label: 'Consider a cycloplegic refraction to uncover accommodation-masked hyperopia', correct: true, why: 'A fluctuating reflex and hyperopic findings mean active accommodation may hide part of the error.' },
      { value: 'rx', label: 'Issue the non-cycloplegic result unchanged', correct: false, why: 'Possible, but the fluctuating reflex makes the end-point uncertain; this should be recognised.' },
      { value: 'urgent', label: 'Urgent referral', correct: false, why: 'No urgent features.' },
    ],
    learningPoint: 'Both principal meridians need plus, unequally: compound hyperopic astigmatism. Accommodation can mask hyperopia; cycloplegia (not merely dilation) relaxes it.',
    counterfactual: 'With accommodation fully relaxed, the fluctuation would disappear and the end-point would be steadier.',
    sources: ['O1', 'O3', 'O4'], reviewStatus: 'draft',
  },
  {
    id: 'pt-5x1', label: 'Patient E', name: 'Selma (fictional)', age: 27, complaint: 'Blur at all distances; oblique lines look tilted.',
    history: [
      { q: 'Onset?', a: 'Long-standing.' },
      { q: 'Pain, redness or flashes?', a: 'None.' },
      { q: 'Contact lenses or eye rubbing?', a: 'No contact lenses; no habitual rubbing.' },
    ],
    eyes: {
      OD: { target: L(1, -3, 45), vaUnaided: '6/18', vaPinhole: '6/7.5', vaBestCorrected: '6/6', retinoQuality: 'clear' },
      OS: { target: L(0.75, -2.5, 135), vaUnaided: '6/18', vaPinhole: '6/7.5', vaBestCorrected: '6/6', retinoQuality: 'clear' },
    },
    nextActions: [
      { value: 'rx', label: 'Issue the refraction result; routine review including corneal assessment if indicated', correct: true, why: 'Regular astigmatism explains the findings; total refractive cylinder alone does not establish corneal disease.' },
      { value: 'kc', label: 'Diagnose keratoconus from the cylinder', correct: false, why: 'A cylinder value does not establish keratoconus; corneal imaging would be needed.' },
    ],
    learningPoint: 'Principal powers of opposite sign: mixed astigmatism. Oblique axes in both eyes (045 / 135).',
    counterfactual: 'If only the 90° and 180° meridians were measured, OD and OS would look identical at those two meridians even though their axes differ.',
    sources: ['O1', 'O2', 'O3'], reviewStatus: 'draft',
  },
  {
    id: 'pt-3c6', label: 'Patient F', name: 'Mirsad (fictional)', age: 52, complaint: 'Has to hold the phone further away; distance blur with old glasses.',
    history: [
      { q: 'Near difficulty?', a: 'Yes, worse over two years, needs more light.' },
      { q: 'Pain, redness or flashes?', a: 'None.' },
      { q: 'Current glasses?', a: 'Distance glasses from 5 years ago.' },
    ],
    eyes: {
      OD: { target: L(-1.5), vaUnaided: '6/18', vaPinhole: '6/7.5', vaBestCorrected: '6/6', retinoQuality: 'clear' },
      OS: { target: L(-1.25, -0.5, 90), vaUnaided: '6/18', vaPinhole: '6/7.5', vaBestCorrected: '6/6', retinoQuality: 'clear' },
    },
    near: { addD: 1.75, observation: 'Near assessment at 40 cm over the distance correction: comfortable print reading with +1.75 D added (authored finding from the near assessment, not from age).' },
    nextActions: [
      { value: 'rx-add', label: 'Issue distance correction with the measured near addition', correct: true, why: 'Distance myopia and reduced near focus coexist; the ADD came from a near assessment.' },
      { value: 'age-add', label: 'Calculate the ADD from age alone', correct: false, why: 'Age does not determine an individual ADD.' },
    ],
    learningPoint: 'Presbyopia coexists with a distance refractive error: OD spherical myopia, OS compound myopic astigmatism, plus a separately measured ADD.',
    counterfactual: 'Without the near assessment, no ADD could be stated even though the patient is 52.',
    sources: ['O1', 'K8', 'O4'], reviewStatus: 'draft',
  },
  {
    id: 'pt-8n4', label: 'Patient G', name: 'Dino (fictional)', age: 16, complaint: 'School screening noted reduced vision in one eye.',
    history: [
      { q: 'Symptoms?', a: 'Not aware of a problem.' },
      { q: 'Pain, redness or flashes?', a: 'None.' },
      { q: 'Previous eye care?', a: 'None.' },
    ],
    eyes: {
      OD: { target: L(-0.5), vaUnaided: '6/7.5', vaPinhole: '6/6', vaBestCorrected: '6/5', retinoQuality: 'clear' },
      OS: { target: L(-3.5, -0.5, 180), vaUnaided: '6/36', vaPinhole: '6/9', vaBestCorrected: '6/6', retinoQuality: 'clear' },
    },
    nextActions: [
      { value: 'rx', label: 'Issue both monocular results; note the interocular difference and arrange follow-up', correct: true, why: 'Each eye is documented separately; the difference matters for comfort and follow-up.' },
      { value: 'se', label: 'Record a single binocular spherical equivalent', correct: false, why: 'Monocular results must stay separate; SE alone hides the difference.' },
    ],
    learningPoint: 'Interocular refractive difference (anisometropia): each eye has its own classification — OD spherical myopia, OS compound myopic astigmatism.',
    counterfactual: 'If OS were +2.00 DS instead, the eyes would be of opposite sign (antimetropia).',
    sources: ['O1'], reviewStatus: 'draft',
  },
  {
    id: 'pt-6r9', label: 'Patient H', name: 'Hasan (fictional)', age: 68, complaint: 'Reduced vision in the right eye for some months.',
    history: [
      { q: 'Onset?', a: 'Gradual over months, right eye.' },
      { q: 'Pain, redness or flashes?', a: 'None.' },
      { q: 'Distortion of straight lines?', a: 'Not sure.' },
      { q: 'Medical history?', a: 'Hypertension, treated.' },
    ],
    eyes: {
      OD: { target: L(-0.75), vaUnaided: '6/24', vaPinhole: '6/24', vaBestCorrected: '6/24', retinoQuality: 'media-haze', nonRefractiveLoss: true },
      OS: { target: L(-0.5), vaUnaided: '6/9', vaPinhole: '6/6', vaBestCorrected: '6/6', retinoQuality: 'clear' },
    },
    nextActions: [
      { value: 'further', label: 'Refraction does not explain OD loss: arrange a full ocular examination (anterior segment and dilated fundus)', correct: true, why: 'Pinhole and best correction did not restore OD acuity: a non-refractive cause must be sought.' },
      { value: 'rx', label: 'Issue glasses and reassure', correct: false, why: 'Glasses do not explain or correct the OD loss.' },
    ],
    learningPoint: 'Optical versus non-refractive visual loss: when pinhole and correction fail to restore acuity, refraction is not the explanation. The cause cannot be named from these tests alone.',
    counterfactual: 'If pinhole had improved OD to 6/6, an optical explanation would be supported.',
    sources: ['O1'], reviewStatus: 'draft',
  },
];

export function caseById(id: string) {
  return CASES.find((c) => c.id === id);
}

/** Expected classification per eye in the stated full-distance-correction context. */
export function expectedClass(e: EyeTruth): RefractiveClass {
  const c = classify(e.target, 'full-distance-correction-relaxed');
  if (c.status !== 'classified') throw new Error('unreachable');
  return c.cls;
}

const snellenDen = (s: string) => Number(s.split('/')[1]);

/** Coherence checks a case must pass before it is eligible for assessment. */
export function validateCase(c: CaseDef): string[] {
  const errs: string[] = [];
  if (/myop|hyperop|astig|presby|aniso/i.test(c.id + c.label)) errs.push(`${c.id}: identifier leaks the diagnosis`);
  for (const eye of ['OD', 'OS'] as Eye[]) {
    const e = c.eyes[eye];
    const ua = snellenDen(e.vaUnaided);
    const ph = snellenDen(e.vaPinhole);
    const bc = snellenDen(e.vaBestCorrected);
    if (![ua, ph, bc].every((x) => Number.isFinite(x) && x > 0)) errs.push(`${c.id} ${eye}: bad acuity notation`);
    if (bc > ph || ph > ua) errs.push(`${c.id} ${eye}: acuity order must be unaided ≥ pinhole ≥ best-corrected denominator`);
    const blur = blurStrength(toMatrix(e.target));
    if (!e.nonRefractiveLoss) {
      if (blur >= 0.75 && ph >= ua) errs.push(`${c.id} ${eye}: significant refractive error but pinhole does not improve`);
      if (bc > 6) errs.push(`${c.id} ${eye}: purely refractive case should correct to at least 6/6`);
    } else if (bc <= 6) errs.push(`${c.id} ${eye}: non-refractive loss but corrects to 6/6`);
  }
  if (!c.nextActions.some((n) => n.correct)) errs.push(`${c.id}: no defensible next action`);
  return errs;
}

// Non-refractive case families share this engine entry point.
export * from './clinicalCases';
