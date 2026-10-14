"""Set implementation status for catalog entries that are actually built and tested.
Every change here must correspond to working code + tests; humanReview stays 'not-reviewed'."""
import json, sys
p = 'src/content/TEST_REGISTRY.json'
d = json.load(open(p, encoding='utf-8'))
C = lambda **k: k
BUILT = {
  # id: (status, implementedIn, fidelity, capabilities, evidence)
  'T011': ('tested', 'lab/LAB02', 'constrained procedural simulation', C(conceptExplanation=True, interactiveMechanism=True, sequencePractice=True, resultInterpretation=True, documentationPractice=True, assessedTransfer=False), ['tests/optics.test.ts retinoscopy', 'tests/missions.test.ts F-WD-*', 'e2e refraction patient']),
  'T012': ('partial', 'lab/LAB02', 'constrained procedural simulation', C(conceptExplanation=True, interactiveMechanism=True, sequencePractice=True, resultInterpretation=True), ['JccTool sphere check with declared over-minus response; fogging not modelled']),
  'T013': ('implemented', 'lab/LAB02', 'constrained procedural simulation', C(conceptExplanation=True, interactiveMechanism=True, sequencePractice=True, resultInterpretation=True), ['tests/optics.test.ts JCC']),
  'T014': ('implemented', 'lab/LAB02', 'constrained procedural simulation', C(conceptExplanation=True, interactiveMechanism=True, sequencePractice=True, resultInterpretation=True), ['tests/optics.test.ts JCC']),
  'T019': ('partial', 'patients/pt-9q7', 'conceptual schematic', C(conceptExplanation=True, resultInterpretation=True), ['one authored printout in Patient B with caveat']),
  'T020': ('implemented', 'lab/LAB03', 'constrained procedural simulation', C(conceptExplanation=True, interactiveMechanism=True, sequencePractice=True, resultInterpretation=True, documentationPractice=True), ['Lab03 lensometer graded by matrix']),
  'T081': ('implemented', 'lab/LAB03', 'constrained procedural simulation', C(conceptExplanation=True, resultInterpretation=True), ['Lab03 Prentice exercise']),
  'T021': ('tested', 'lab/LAB05', 'constrained procedural simulation', C(conceptExplanation=True, interactiveMechanism=True, sequencePractice=True, resultInterpretation=True), ['tests/pupils.test.ts']),
  'T022': ('tested', 'lab/LAB05', 'constrained procedural simulation', C(conceptExplanation=True, interactiveMechanism=True, sequencePractice=True, resultInterpretation=True), ['tests/pupils.test.ts']),
  'T023': ('tested', 'lab/LAB05', 'constrained procedural simulation', C(conceptExplanation=True, interactiveMechanism=True, sequencePractice=True, resultInterpretation=True), ['tests/pupils.test.ts']),
  'T027': ('tested', 'lab/LAB06', 'constrained procedural simulation', C(conceptExplanation=True, interactiveMechanism=True, resultInterpretation=True), ['tests/motility.test.ts']),
  'T029': ('tested', 'lab/LAB06', 'constrained procedural simulation', C(conceptExplanation=True, interactiveMechanism=True, sequencePractice=True, resultInterpretation=True), ['tests/motility.test.ts K2 fixture']),
  'T030': ('tested', 'lab/LAB06', 'constrained procedural simulation', C(conceptExplanation=True, interactiveMechanism=True, sequencePractice=True, resultInterpretation=True), ['tests/motility.test.ts']),
  'T025': ('partial', 'lab/LAB06', 'conceptual schematic', C(conceptExplanation=True, interactiveMechanism=True), ['schematic gaze grid, unscored']),
}
extra = json.load(open(sys.argv[1], encoding='utf-8')) if len(sys.argv) > 1 else {}
for k, v in extra.items(): BUILT[k] = tuple(v)
for e in d['entries']:
  if e['id'] in BUILT:
    st, where, fid, caps, ev = BUILT[e['id']]
    e['implementation'] = st; e['implementedIn'] = where; e['fidelity'] = fid; e['evidence'] = ev
    e['capabilities'].update(caps)
json.dump(d, open(p, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
print(sum(e['implementation'] != 'planned' for e in d['entries']), 'non-planned entries')
