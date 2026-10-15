/**
 * Plain-English explanations for jargon, shown when a learner taps a term in lesson text.
 * Short, everyday wording on purpose; the full glossary (reference.ts) keeps the precise definitions.
 * Draft content — not clinically reviewed.
 */
export interface PlainTerm {
  id: string;
  word: string;
  /** Lower-case phrases that should link to this term (longest match wins). */
  match: string[];
  plain: string;
  /** Optional tutorial that shows it. */
  tutorial?: string;
}

export const PLAIN_TERMS: PlainTerm[] = [
  { id: 'dioptre', word: 'Dioptre (D)', match: ['dioptres', 'dioptre', 'diopters', 'diopter'], plain: 'The unit of lens strength. A bigger number means a stronger lens. Minus lenses help short sight; plus lenses help long sight.' },
  { id: 'sphere', word: 'Sphere', match: ['spherical lens', 'sphere'], plain: 'A lens with the same power in every direction.', tutorial: 'cylinder' },
  { id: 'cylinder', word: 'Cylinder', match: ['cylinder lens', 'cylinder', 'cylindrical'], plain: 'A lens with power in one direction only. It corrects astigmatism.', tutorial: 'cylinder' },
  { id: 'axis', word: 'Axis', match: ['axis'], plain: 'The direction (1–180°) where a cylinder lens has no power. Its full power is 90° away.', tutorial: 'cylinder' },
  { id: 'meridian', word: 'Meridian', match: ['meridians', 'meridian'], plain: 'A direction across the lens or eye, like a line drawn through a clock face.', tutorial: 'cylinder' },
  { id: 'plano', word: 'Plano', match: ['plano'], plain: 'Zero power: no correction in that direction.' },
  { id: 'se', word: 'Spherical equivalent', match: ['spherical equivalent'], plain: 'The average power of a lens: sphere plus half the cylinder. It is not the same lens.', tutorial: 'transpose' },
  { id: 'transposition', word: 'Transposition', match: ['transposition', 'transpose'], plain: 'Rewriting a prescription between plus and minus cylinder. The lens itself does not change.', tutorial: 'transpose' },
  { id: 'myopia', word: 'Myopia', match: ['myopia', 'myopic', 'short sight', 'short-sighted'], plain: 'Short sight: far things are blurry because the eye focuses in front of the retina. Minus lenses fix it.', tutorial: 'foci' },
  { id: 'hyperopia', word: 'Hyperopia', match: ['hyperopia', 'hypermetropia', 'hyperopic', 'long sight', 'long-sighted'], plain: 'Long sight: the eye focuses behind the retina. Plus lenses fix it; young people can partly focus it out themselves.', tutorial: 'foci' },
  { id: 'astigmatism', word: 'Astigmatism', match: ['astigmatism', 'astigmatic'], plain: 'The eye focuses different directions at different distances, so it makes two focal lines instead of one point. A cylinder lens corrects it.', tutorial: 'foci' },
  { id: 'presbyopia', word: 'Presbyopia', match: ['presbyopia', 'presbyopic'], plain: 'The age-related loss of near focusing. It can happen together with short or long sight.' },
  { id: 'accommodation', word: 'Accommodation', match: ['accommodation', 'accommodate'], plain: 'The eye focusing for near by changing the shape of its own lens.' },
  { id: 'add', word: 'ADD', match: ['near addition', 'reading addition'], plain: 'Extra plus power added for reading. It is measured, not worked out from age.' },
  { id: 'refraction', word: 'Refraction', match: ['refraction'], plain: 'Finding the lens that gives the clearest vision. In physics it also means light bending.' },
  { id: 'retinoscopy', word: 'Retinoscopy', match: ['retinoscopy', 'retinoscope'], plain: 'An objective test: you sweep a line of light across the pupil and watch the glow to find the lens power.', tutorial: 'retino' },
  { id: 'acuity', word: 'Visual acuity', match: ['visual acuity', 'acuity'], plain: 'How sharp vision is, written like 6/6 (normal) or 6/60 (much worse).' },
  { id: 'pinhole', word: 'Pinhole', match: ['pinhole'], plain: 'Looking through a tiny hole. If vision improves, the blur is probably optical (fixable with glasses) — but it does not prove the eye is healthy.' },
  { id: 'retina', word: 'Retina', match: ['retinas', 'retina', 'retinal'], plain: 'The light-sensitive layer at the back of the eye, like the film in a camera.' },
  { id: 'macula', word: 'Macula', match: ['macula', 'macular'], plain: 'The centre of the retina, used for reading and seeing detail.' },
  { id: 'cornea', word: 'Cornea', match: ['cornea', 'corneal'], plain: 'The clear front window of the eye.' },
  { id: 'lens-eye', word: 'Lens (of the eye)', match: ['crystalline lens'], plain: 'The clear lens inside the eye behind the pupil. When it clouds, it is a cataract.' },
  { id: 'cataract', word: 'Cataract', match: ['cataracts', 'cataract'], plain: 'Clouding of the lens inside the eye.' },
  { id: 'optic-nerve', word: 'Optic nerve', match: ['optic nerves', 'optic nerve'], plain: 'The cable that carries signals from the eye to the brain.', tutorial: 'fields' },
  { id: 'chiasm', word: 'Optic chiasm', match: ['optic chiasm', 'chiasm', 'chiasmal'], plain: 'Where the two optic nerves meet. Fibres from the inner (nose) half of each retina cross here.', tutorial: 'fields' },
  { id: 'field', word: 'Visual field', match: ['visual fields', 'visual field'], plain: 'Everything you can see while keeping your eye still, including the edges.', tutorial: 'fields' },
  { id: 'hemianopia', word: 'Hemianopia', match: ['hemianopia', 'hemianopias'], plain: 'Loss of half of the visual field.', tutorial: 'fields' },
  { id: 'homonymous', word: 'Homonymous', match: ['homonymous'], plain: 'The same side is missing in both eyes (for example, the left half in each eye). Points behind the chiasm.', tutorial: 'fields' },
  { id: 'bitemporal', word: 'Bitemporal', match: ['bitemporal'], plain: 'The outer (temple) side is missing in both eyes. Points to the chiasm.', tutorial: 'fields' },
  { id: 'quadrantanopia', word: 'Quadrantanopia', match: ['quadrantanopia'], plain: 'Loss of a quarter of the visual field.' },
  { id: 'pupil', word: 'Pupil', match: ['pupils', 'pupil'], plain: 'The black opening in the coloured iris that lets light in. It gets smaller in bright light.', tutorial: 'pupils' },
  { id: 'anisocoria', word: 'Anisocoria', match: ['anisocoria'], plain: 'The two pupils are different sizes.', tutorial: 'pupils' },
  { id: 'afferent', word: 'Afferent', match: ['afferent'], plain: 'Incoming: the signal travelling from the eye to the brain.', tutorial: 'pupils' },
  { id: 'efferent', word: 'Efferent', match: ['efferent'], plain: 'Outgoing: the signal from the brain back to the pupil or eye muscles.', tutorial: 'pupils' },
  { id: 'rapd', word: 'RAPD', match: ['relative afferent pupillary defect', 'relative afferent pupil defect', 'rapd'], plain: 'One eye sends a weaker light signal. With the swinging light, both pupils widen when the light reaches that eye. At rest the pupils are equal.', tutorial: 'pupils' },
  { id: 'horner', word: 'Horner syndrome', match: ['horner syndrome', 'horner'], plain: 'The nerve that widens the pupil is interrupted: a smaller pupil (most obvious in the dark) and a slightly droopy lid.' },
  { id: 'strabismus', word: 'Strabismus', match: ['strabismus', 'squint'], plain: 'The eyes do not point in the same direction.', tutorial: 'cover' },
  { id: 'tropia', word: 'Tropia', match: ['tropia', 'heterotropia'], plain: 'A misalignment that is there with both eyes open. Covering the straight eye makes the other one move.', tutorial: 'cover' },
  { id: 'phoria', word: 'Phoria', match: ['phoria', 'heterophoria'], plain: 'A hidden tendency to drift. The eyes look straight until one is covered.', tutorial: 'cover' },
  { id: 'esotropia', word: 'Esotropia', match: ['esotropia', 'esophoria'], plain: 'Eso = the eye turns IN, towards the nose.', tutorial: 'cover' },
  { id: 'exotropia', word: 'Exotropia', match: ['exotropia', 'exophoria'], plain: 'Exo = the eye turns OUT, towards the ear.', tutorial: 'cover' },
  { id: 'amblyopia', word: 'Amblyopia', match: ['amblyopia', 'lazy eye'], plain: 'Reduced vision in one eye because it did not develop normally in childhood. Glasses alone may not fix it.' },
  { id: 'slit-lamp', word: 'Slit lamp', match: ['slit lamp', 'slit-lamp'], plain: 'A microscope with a bright, adjustable beam for looking at the front of the eye.', tutorial: 'slitlamp' },
  { id: 'anterior-chamber', word: 'Anterior chamber', match: ['anterior chamber'], plain: 'The fluid-filled space between the cornea and the iris.', tutorial: 'slitlamp' },
  { id: 'iop', word: 'Intraocular pressure (IOP)', match: ['intraocular pressure', 'iop'], plain: 'The pressure inside the eye, in mmHg. High pressure is a risk factor for glaucoma, not the diagnosis itself.' },
  { id: 'glaucoma', word: 'Glaucoma', match: ['glaucoma'], plain: 'Damage to the optic nerve with a typical pattern of field loss. Pressure is often, but not always, raised.' },
  { id: 'fluorescein', word: 'Fluorescein', match: ['fluorescein'], plain: 'An orange dye that glows green under blue light and shows scratches or damage on the eye surface.' },
  { id: 'fundus', word: 'Fundus', match: ['fundus'], plain: 'The inside back of the eye (retina, optic disc, vessels) seen through the pupil.' },
  { id: 'od-os', word: 'OD / OS', match: ['od', 'os', 'ou'], plain: 'OD = right eye, OS = left eye, OU = both eyes (Latin). Many places write RE / LE instead.' },
];

const byPhrase = new Map<string, PlainTerm>();
for (const t of PLAIN_TERMS) for (const m of t.match) byPhrase.set(m, t);
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** Case-sensitive for short all-caps abbreviations (OD/OS/IOP/RAPD) so ordinary words are not linked. */
const CASE_SENSITIVE = new Set(['od', 'os', 'ou', 'iop', 'rapd']);
const phrases = [...byPhrase.keys()].sort((a, b) => b.length - a.length);
const RE = new RegExp(`\\b(${phrases.map(escape).join('|')})\\b`, 'gi');

export interface Segment {
  text: string;
  term?: PlainTerm;
}

/** Split text into plain and term segments. Each term is linked once; pass a shared `used` set to link once across several paragraphs. */
export function segmentTerms(text: string, used: Set<string> = new Set()): Segment[] {
  const out: Segment[] = [];
  let last = 0;
  for (const m of text.matchAll(RE)) {
    const key = m[0].toLowerCase();
    const t = byPhrase.get(key);
    if (!t || used.has(t.id)) continue;
    if (CASE_SENSITIVE.has(key) && m[0] !== m[0].toUpperCase()) continue;
    used.add(t.id);
    if (m.index! > last) out.push({ text: text.slice(last, m.index) });
    out.push({ text: m[0], term: t });
    last = m.index! + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}
