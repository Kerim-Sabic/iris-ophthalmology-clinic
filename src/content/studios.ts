/**
 * The 18 studios. `status` is the truthful implementation state — updated only after the studio
 * is actually built and tested. Planned studios still expose their concept summary and catalog
 * entries but are never presented as working laboratories.
 */
export type StudioStatus = 'implemented' | 'partial' | 'planned';
export type Fidelity = 'conceptual schematic' | 'constrained procedural simulation' | 'authentic-image interpretation' | 'source-reviewed clinical case';

export interface Studio {
  id: string;
  title: string;
  summary: string;
  lectures: string[];
  status: StudioStatus;
  fidelity: Fidelity[];
  modes: ('explore' | 'guided' | 'challenge' | 'patient')[];
  /** Concrete truthful note about what works and what is missing. */
  statusNote: string;
}

export const STUDIOS: Studio[] = [
  { id: 'LAB01', title: 'Optical bench and refractive mechanisms', summary: 'Meridional power, power crosses, transposition, spherical-equivalent traps, classification in context, reduced-eye line foci, composition.', lectures: ['L03', 'L04', 'L05'], status: 'implemented', fidelity: ['conceptual schematic', 'constrained procedural simulation'], modes: ['explore', 'guided', 'challenge', 'patient'], statusNote: 'Intro mission, explore (focus view, transposition animation, compare, change-one-thing), 22 task families (16 practice, 6 held-out). Not clinically reviewed.' },
  { id: 'LAB02', title: 'Refraction and accommodation suite', summary: 'Streak retinoscopy with declared plane-mirror model, working distance, gross → net, JCC with actual principal powers, fictional patient responses.', lectures: ['L06', 'L04'], status: 'partial', fidelity: ['constrained procedural simulation'], modes: ['explore', 'patient'], statusNote: 'Retinoscopy (T011) and JCC axis/power (T013/T014) on shared patient target state; fogging, duochrome, binocular balance, cycloplegia and autorefraction interpretation not yet built.' },
  { id: 'LAB03', title: 'Prescription, lensometry and refractive-diagnosis desk', summary: 'OD/OS prescription form, notation parsing, equivalence vs requested notation, laterality, bilateral comparison, lensometry.', lectures: ['L05'], status: 'partial', fidelity: ['constrained procedural simulation'], modes: ['explore', 'guided'], statusNote: 'Bilateral OD/OS form with separate scoring dimensions and a focusing lensometer (T020). Prism/Prentice exercise (T081) included. ADD selection is not modelled.' },
  { id: 'LAB04', title: 'Visual function room', summary: 'Virtual-patient acuity, pinhole, low-acuity documentation, near acuity, Amsler mapping.', lectures: ['L07'], status: 'partial', fidelity: ['conceptual schematic', 'constrained procedural simulation'], modes: ['explore', 'guided', 'challenge', 'patient'], statusNote: 'Virtual-patient distance/near acuity, logMAR/decimal conversion, CF/HM/LP/NLP sequence, pinhole, Amsler mapping (T001–T005, T010); colour-plate administration as text only (no plates). Contrast and hue arrangement planned. Never tests the student’s own vision.' },
  { id: 'LAB05', title: 'Pupils and neural light pathways', summary: 'Separate afferent inputs and efferent outputs, movable light, swinging-flashlight test, anisocoria in light/dark.', lectures: ['L09', 'L25'], status: 'partial', fidelity: ['conceptual schematic', 'constrained procedural simulation'], modes: ['explore', 'guided', 'challenge', 'patient'], statusNote: 'Light reflex model with separate afferent/efferent per eye; direct/consensual, swinging flashlight with scrubbable timeline, anisocoria light vs dark (T021–T023). Near response, red desaturation and pharmacological tests not modelled. All pupil numbers are schematic.' },
  { id: 'LAB06', title: 'Motility, alignment and binocular vision', summary: 'Examiner-view face, cover-uncover and alternate cover with explicit covered/observed eye, Hirschberg, gaze positions.', lectures: ['L10', 'L26'], status: 'partial', fidelity: ['conceptual schematic', 'constrained procedural simulation'], modes: ['explore', 'guided', 'challenge', 'patient'], statusNote: 'Horizontal cover–uncover and alternate cover with explicit covered/observed eye, Hirschberg, schematic gaze positions (T027, T029, T030, T025 unscored). Prism cover, Maddox, Worth, stereo, NPC, Hess, Bagolini planned.' },
  { id: 'LAB07', title: 'Visual fields and pathway localization', summary: 'Lesion placement on the visual pathway with field maps in patient-field coordinates, separate from retinal coordinates.', lectures: ['L11', 'L24'], status: 'partial', fidelity: ['conceptual schematic', 'constrained procedural simulation'], modes: ['explore', 'guided', 'challenge', 'patient'], statusNote: 'Lesion placement → field maps in field coordinates (separate from retina), localisation with multiple candidates, confrontation with reliability variant, generic labelled perimetry interpretation (T037, T039). Kinetic and tangent screen planned. Quadrant-level schematic.' },
  { id: 'LAB08', title: 'Slit lamp and anterior segment', summary: 'Beam angle, width, focus and illumination techniques in a constrained anterior-segment scene.', lectures: ['L12', 'L13', 'L17', 'L18'], status: 'planned', fidelity: ['conceptual schematic'], modes: [], statusNote: 'Planned. Requires an original constrained scene; no licensed images held.' },
  { id: 'LAB09', title: 'Cornea, ocular surface and lacrimal system', summary: 'Fluorescein patterns, tear film, Seidel, lid eversion, lacrimal anatomy with pressure-avoidance safeguards.', lectures: ['L14', 'L15'], status: 'planned', fidelity: ['conceptual schematic'], modes: [], statusNote: 'Planned. Authentic-image assessment blocked: no licensed clinical images.' },
  { id: 'LAB10', title: 'Pressure, chamber angle and glaucoma', summary: 'Conceptual aqueous production/outflow model, Goldmann mires, Van Herick and gonioscopy conventions.', lectures: ['L19', 'L12'], status: 'planned', fidelity: ['conceptual schematic'], modes: [], statusNote: 'Planned.' },
  { id: 'LAB11', title: 'Fundus examination and lesion description', summary: 'Limited-field navigation, systematic route, describe before diagnose, unseen regions stay unexamined.', lectures: ['L12', 'L20', 'L21', 'L22', 'L23', 'L24'], status: 'planned', fidelity: ['conceptual schematic'], modes: [], statusNote: 'Planned. Authentic pathology recognition blocked: no licensed fundus images.' },
  { id: 'LAB12', title: 'Retinal imaging suite', summary: 'Fundus-to-OCT linkage, layers, segmentation artefacts, modality selection.', lectures: ['L31', 'L21'], status: 'planned', fidelity: ['conceptual schematic'], modes: [], statusNote: 'Planned. Real OCT data requires permission and provenance.' },
  { id: 'LAB13', title: 'Corneal measurement, ultrasound and electrophysiology', summary: 'Keratometry vs total refraction, topography, pachymetry, B-scan orientation, ERG/VEP concepts.', lectures: ['L31'], status: 'planned', fidelity: ['conceptual schematic'], modes: [], statusNote: 'Planned.' },
  { id: 'LAB14', title: 'Paediatric examination and visual development', summary: 'Age-appropriate assessment, fixation behaviour, red reflex/Brückner, amblyopia context.', lectures: ['L26'], status: 'planned', fidelity: ['conceptual schematic'], modes: [], statusNote: 'Planned.' },
  { id: 'LAB15', title: 'Eyelids, orbit and advanced neuro-ophthalmic assessment', summary: 'Lid/levator measurement in a calibrated virtual scene, exophthalmometry, three-step test, imaging choice.', lectures: ['L14', 'L25', 'L27'], status: 'planned', fidelity: ['conceptual schematic'], modes: [], statusNote: 'Planned.' },
  { id: 'LAB16', title: 'Urgent eye clinic', summary: 'Branching staged presentations: chemical injury, suspected open globe, painful red eye, sudden painless loss.', lectures: ['L28', 'L35'], status: 'planned', fidelity: ['source-reviewed clinical case'], modes: [], statusNote: 'Planned. Management branches need current protocol review before scoring.' },
  { id: 'LAB17', title: 'Treatment and procedure mechanisms', summary: 'Mechanism-level treatment classes linked to the disease mechanisms already studied.', lectures: ['L30', 'L34'], status: 'planned', fidelity: ['conceptual schematic'], modes: [], statusNote: 'Planned. No doses will be shown without verified guidance.' },
  { id: 'LAB18', title: 'Integrated OSCE, diagnosis writing and viva', summary: 'History → targeted examination → investigation → written note from obtained evidence only; offline viva rubric.', lectures: ['L08', 'L36', 'L35'], status: 'planned', fidelity: ['source-reviewed clinical case'], modes: [], statusNote: 'Planned. The refraction patient notebook already generates notes only from obtained evidence.' },
];

export function studioById(id: string) {
  return STUDIOS.find((s) => s.id === id);
}
