# IRIS — Full Ophthalmology Learning Clinic
## Standalone master implementation prompt, version 2

Prepared 14 October 2026 for fifth-year medical students. Working title only; no name clearance is implied.

**Use this specification instead of the earlier master prompt.** It retains the 36-lecture curriculum, expands the product to 18 interconnected learning studios, and defines an 88-entry catalog of examination methods, refraction activities and investigations. These are proposed educational activities, not 88 clinically validated diagnostic instruments. This document specifies an application to build; it does not claim the application exists, has been clinically reviewed, or guarantees examination results.

The supplied source register distinguishes material actually consulted from implementation retrieval targets. The optional Python module and fixtures are an educational mathematical reference, not a validated clinical prescribing system. The numerical exercises concern fictional patients or lenses.

---

## 1. Build the application described here

You are the implementation agent operating in Claude Code with the available Opus model. Build a functioning browser-based ophthalmology teaching clinic, not another plan, a marketing page, a slide deck, a flashcard-only tool, or an attractive interface backed by hardcoded answers.

The primary learners are fifth-year medical students preparing for demanding written, visual, practical and oral ophthalmology examinations. They do not yet have an institutional syllabus. The most important immediate problem is understanding optics, cylinder axes, meridional powers, refractive diagnoses and prescription writing. The full application must also teach the broader ophthalmology curriculum through manipulable models, virtual examination methods, coherent patient cases and durable retrieval practice.

Optimize for accurate mental models and transfer to unfamiliar problems. The learner must be able to produce an answer and explain it, not merely recognize a familiar question. Excellent exam performance is a goal, not a guaranteed claim. A browser laboratory prepares interpretation and procedural reasoning; it does not certify real-world clinical or manual competence.

The experience should feel like working through an increasingly challenging teaching clinic. Make the learning canvas, instrument controls, patient observations and diagnostic notebook the center of the product. Gamification is subordinate to understanding. Do not add points, animations and badges to a textbook and call that an interactive laboratory.

Inspect the existing repository and available tools first. Preserve sound existing code and all unrelated user work. If there is an earlier implementation, audit it against this specification and extend it; do not rewrite for aesthetic preference. Produce a brief execution plan and start implementation. Ask only for genuinely blocking permissions or information that cannot be resolved from the environment or reliable sources. Do not silently install unknown plugins, acquire paid assets, deploy publicly or use private data externally.

## 2. What makes this a laboratory rather than a book

Every principal concept must support at least one meaningful action: predict an outcome, manipulate a parameter, perform a virtual maneuver, observe a result, interpret evidence, write notation, choose an investigation, identify uncertainty, or explain a counterfactual. Reading remains available as a reference, but it must not be the only interaction.

All important visualizations must be connected to a domain model or a reviewed scenario. Moving a control must change the relevant simulated state. Do not move a decorative cylinder while the prescription answer comes from an unrelated lookup table. Do not run pupil animations that are independent of the lesion and light position. Do not show disease-specific test results simply because the learner selected a diagnosis.

Separate these layers:

1. **Ground truth:** optical parameters or a constrained, source-reviewed fictional case.
2. **Examination conditions:** instrument, eye, illumination, working distance, correction, fixation and technique.
3. **Observable findings:** only what that maneuver can reveal under those conditions.
4. **Learner interpretation:** diagnosis, notation, differential, confidence and explanation.
5. **Feedback:** differences between the learner's interpretation and supported conclusions.

This separation is mandatory. A finding can be unavailable, unreliable, equivocal or insufficiently specific. The application must be able to say so without revealing an invented certainty.

Give each studio four modes: **Explore**, **Guided practice**, **Independent challenge**, and **Patient case**. Explore exposes the mechanism. Guided practice adds progressive scaffolding. Independent challenge hides decisive answers. Patient case embeds the same instrument into a coherent clinical problem. Include a reset and repeatable seed.

A shared “Explain this change” control should connect an observation to a concise causal explanation, the relevant anatomy, and its source. A “Change one thing” control should produce an explicitly hypothetical counterfactual. A “Compare” mode should place normal/abnormal or two confusable conditions side by side without spoiling independent assessments.

## 3. Scope, navigation and learner control

Default language: English suitable for medical education. Offer optional reviewed local-language/Latin terminology aliases without making translations a blocker. Maintain a glossary for terms such as hyperopia/hypermetropia, myopia, astigmatism, phoria/tropia, OD/OS/OU, SPH/CYL/AXIS and examination abbreviations. Preserve standard notation and permit reviewed synonyms; never silently translate numerical prescriptions.

Begin with immediate guest access. Let the student select lectures individually, search them, select groups, and mark each lecture **included**, **excluded**, or **uncertain**. The exam date, available time and prior familiarity are optional. Default presets are application study plans, not purported university syllabi. Include optics-intensive, broad medical-student, neuro-ophthalmology, emergency, and mixed revision presets.

Maintain the 36-lecture catalog below. Recommend prerequisites through a graph, but allow bypassing them. Opening a difficult lesson should offer a short bridge rather than force the learner through the entire course. Changing scope must preserve all history and create a new study-plan snapshot with a visible denominator.

Use six primary destinations: **Today, Lectures, Laboratory, Patients, Exam Room, Review**. Global search finds tests, symptoms, diseases, formulas, notation, misconceptions and personal notes. A student studying a disease can jump to its investigation and return to the same case. A student making an optics error can open the exact model with their erroneous answer already loaded.

Keep three separate progress indicators: selected-scope coverage, publication/review status of content, and demonstrated learning evidence. A planned laboratory card is not an implemented laboratory. An excluded lecture is not mastered. Immediate quiz success is not delayed retention.

## 4. First required experience: the user's cylinder diagram

The reference image shows a horizontal cylinder axis and these meridional lens powers:

| Meridian | Total lens power |
|---|---:|
| 180° / 0° | 0.00 D, plano |
| 30° | −1.00 D |
| 45° | −2.00 D |
| 60° | −3.00 D |
| 90° | −4.00 D |

Recreate the *teaching relationship* with an original interactive SVG, not an unlicensed tracing of the original artwork. The image represents **plano / −4.00 CYL × 180°** in the thin-lens meridional-power model. The equivalent plus-cylinder form is **−4.00 SPH / +4.00 CYL × 090°**. The spherical equivalent is **−2.00 D**, which is not an equivalent astigmatic correction.

Start in **lens mode**, labeled “This is a correcting lens, not an eye diagnosis.” Switch to **fictional patient mode** only after supplying context: this is the complete distance correction for a regular astigmatic eye with accommodation relaxed. Under that stated assumption, the corresponding refractive classification is **simple myopic astigmatism**. The image alone does not establish patient laterality, corneal disease, symptoms, accommodation, visual acuity or whether a real prescription is appropriate. Sources O1–O2 support the notation/model background; the table is a worked calculation from the model.

### 4.1 Required linked panels

On desktop, use a large central optical canvas, a compact instrument panel and a result/answer notebook. On mobile, stack the same information in coordinated views; do not make the learning task depend on tiny drag targets.

The canvas must show the cylinder axis, a separately labeled movable measurement meridian, a zero reference, units, the orthogonal principal meridians, and a live numerical readout. Add a synchronized Cartesian graph of meridional power against angle. A signed power plot must not misleadingly use a negative radial distance as an anatomical direction; an optional polar visualization needs a clearly explained radial encoding.

Controls: sphere, cylinder, axis, probe meridian, lens/patient context, plus/minus-cylinder display, reveal/hide labels, comparison, reset and challenge. Support dragging and exact keyboard entry. Quarter-diopter steps are the default exercise increment, not the only mathematically permissible values. Keep axis and probe angle separate.

The notebook contains the student-completed power cross, prescription fields, refractive-classification fields, and one explanation prompt. In challenge mode, changing the student answer must not overwrite the hidden target model. Maintain separate target, student-proposal and explanatory-overlay states.

### 4.2 The exact introductory mission

Show the reference lens with one or more labels hidden. Ask the student to predict the power at 30°, 45°, 60° and 90°. Reveal each value only after a committed prediction, then let the learner rotate the measurement meridian.

Next ask for sphere, cylinder and axis without multiple-choice answers. If they enter `−4.00 DS`, show that their proposed lens supplies −4.00 D even at 180°, whereas the target is plano there. If they enter `plano −4.00 × 090`, show that they have moved the zero-cylinder-power meridian from horizontal to vertical. If they enter `−2.00 DS`, show that the spherical equivalent matches the average but not the directional correction.

Then request plus-cylinder notation. Accept `−4.00 +4.00 × 090`. Animate a *change in representation while keeping the physical power field unchanged*. Do not animate a physical rotation as though transposition alters the lens.

After supplying the full-distance-correction context, ask the learner to classify the refractive state and explain which principal meridian requires no correction and which requires minus correction. They should be allowed to say “patient diagnosis cannot be established from the isolated lens image” before that context is provided.

Finally, give a new oblique-axis case, remove labels, require a fresh construction, save the misconception evidence, and schedule a delayed retrieval variant. Do not label the introductory case mastered just because the learner followed hints.

## 5. Optical model and prescription engine — correctness contract

Keep all computation in pure, typed domain modules independent of React and animation timing. Use radians explicitly inside trigonometric functions. Use units in field names and schemas. Separate display rounding from internal computation.

### 5.1 Canonical lens representation

Use `{sphereD, cylinderD, axisDeg}` as an input/output representation, plus a sign-independent power matrix or power-vector representation internally for comparison and composition. Axis is an undirected orientation with 180° periodicity. Accept equivalent horizontal 0°/180° input; normalize prescription display to 180°. With zero cylinder, the axis is undefined and must not be required or graded.

For sphere S, cylinder C, axis A and meridian theta:

```text
F(theta) = S + C * sin(theta - A)^2
F(A) = S
F(A + 90°) = S + C
M = S + C/2
Transposition: (S, C, A) -> (S+C, -C, A+90° mod 180°)
```

This is meridional lens power, not a claim that each oblique ray has an independent true line focus at `1/F(theta)`. Keep full bundle propagation separate from meridional-power displays.

With mathematical x horizontal and y upward, let `n=(-sin A, cos A)` and define the symmetric power matrix `Q = S*I + C*n*n^T`. Equivalently:

```text
Qxx = S + C*sin(A)^2
Qxy = -C*sin(A)*cos(A)
Qyy = S + C*cos(A)^2
M   = (Qxx + Qyy)/2
J0  = (Qxx - Qyy)/2 = -(C/2)*cos(2A)
J45 = Qxy            = -(C/2)*sin(2A)
F(theta) = M + J0*cos(2theta) + J45*sin(2theta)
```

Document the one transformation from these coordinates to screen coordinates; do not fix inconsistent signs independently in individual components. Power-vector treatment is supported conceptually by O2. The implementation must independently derive and test its chosen conventions.

### 5.2 Correct grading, including the non-obvious failures

Compare the complete matrix or all three power-vector components within a documented numerical tolerance. Never grade equivalence from the prescription string, spherical equivalent alone, or only horizontal and vertical meridional powers.

Critical counterexample: `plano −4.00 × 045` and `plano −4.00 × 135` both have −2.00 D at 0° and 90°, but they are different lenses. At 45°, their powers are 0.00 D and −4.00 D respectively. They must fail an equivalence test even though a two-meridian shortcut would accept them.

Use a tight numerical tolerance for exact educational fixtures, e.g. 1e−6 D, separate from any stated measurement or answer-rounding tolerance. Tolerance is not a clinical dispensing standard. A requested sign convention is a separate scoring dimension: “optically equivalent but not the requested notation” must be distinguishable from “optically incorrect.”

Validate plus/minus signs, Unicode minus, spaces, explicit decimal separators, optional degree symbol, missing axis, ambiguous pasted strings, non-finite values and out-of-range inputs. Show parsed fields before accepting an ambiguous pasted prescription. Never use `eval`. For error feedback, identify actual numerical discrepancies; a classifier of common misconceptions is a helpful hypothesis, not a mind-reading claim.

### 5.3 Inverse problems and sufficient information

Allow the learner to reconstruct a lens from a *declared pair of orthogonal principal meridians*. Either plus- or minus-cylinder notation can describe the result. Arbitrary powers measured at 90° and 180° are not automatically the principal meridians of an oblique lens.

For arbitrary meridional samples, the Fourier representation has three unknowns. Require sufficient independent information and check the rank of the system before claiming a unique solution. Include an advanced “not enough information” exercise. With noisy data, report the fitting assumption and residual; a poor fit is not automatically a clinical diagnosis of irregular astigmatism.

Normalize opposite meridians, swapped principal-meridian order, zero cylinder and negative zero. Reject a purported regular power cross whose declared principal meridians are not orthogonal rather than silently inventing an axis.

### 5.4 Refractive classification: inspect both principal powers

Classification is permitted only in an explicit fictional full-distance-correction context with accommodation relaxed, or another clearly specified teaching context. Use the two principal corrective powers, not sphere or average alone.

| Principal corrective powers | Supported educational classification |
|---|---|
| Both zero | Emmetropic distance refractive state in the stated model |
| Equal and negative | Spherical myopia |
| Equal and positive | Spherical hyperopia |
| One zero, one negative | Simple myopic astigmatism |
| Both negative, unequal | Compound myopic astigmatism |
| One zero, one positive | Simple hyperopic astigmatism |
| Both positive, unequal | Compound hyperopic astigmatism |
| Opposite signs | Mixed astigmatism |

Treat these as orthogonal dimensions where appropriate: spherical component; magnitude/orientation of regular astigmatism; distance versus near needs; accommodation status; and interocular difference. Do not force “myopia, hyperopia, astigmatism, presbyopia” into mutually exclusive radio buttons. Presbyopia concerns accommodation and can coexist with a distance refractive error. Near ADD must not be inferred from age or a distance power cross alone. Sources O1 and K8 support these distinctions.

Teach with-the-rule, against-the-rule and oblique orientation as a separate, convention-aware extension. Distinguish the written correcting-cylinder axis from the eye's stronger meridian and from corneal topography. State any angular category boundaries and the cited convention. Total refractive astigmatism does not uniquely determine corneal astigmatism or establish keratoconus.

Include anisometropia, antimetropia, regular/irregular astigmatism and accommodation-related contexts without classifying every interocular difference from spherical equivalent alone. A three-parameter cylinder is not a full representation of irregular optical aberration.

### 5.5 Required classification and representation fixtures

All examples below are full-distance-correction educational cases where classification is requested. An unrestricted equivalent-prescription answer accepts either notation.

| Input S / C × A | Equivalent transposition | Classification |
|---|---|---|
| plano / −4.00 × 180 | −4.00 / +4.00 × 090 | Simple myopic astigmatism |
| −2.00 / −1.00 × 180 | −3.00 / +1.00 × 090 | Compound myopic astigmatism |
| plano / +2.00 × 090 | +2.00 / −2.00 × 180 | Simple hyperopic astigmatism |
| +2.00 / +1.00 × 090 | +3.00 / −1.00 × 180 | Compound hyperopic astigmatism |
| +1.00 / −3.00 × 045 | −2.00 / +3.00 × 135 | Mixed astigmatism |
| +1.00 / −2.00 × 180 | −1.00 / +2.00 × 090 | Mixed astigmatism despite M=0 |
| −2.00 DS | Axis absent | Spherical myopia |
| +2.00 DS | Axis absent | Spherical hyperopia |
| Plano DS | Axis absent | Emmetropic distance state; not proof of a healthy eye |

Also retain the original confusion pair: `+1.00 +2.00 × 090` has +1.00 D at 90° and +3.00 D at 180°; a principal power cross of +1.00 D at 90° and +2.00 D at 180° is instead `+1.00 +1.00 × 090`.

### 5.6 Reduced eye, focal lines and simulated blur

Use a declared paraxial reduced-eye model, not anatomical claims derived from a decorative eye. Make reference planes, refractive index, axial distance, object distance and accommodation explicit. Distinguish optical-axis depth from cylinder-axis angle.

An acceptable educational implementation places the equivalent eye and correcting lens in one reference plane. For image-side refractive index n' and retinal distance l from that plane, define retinal vergence demand `Dret=n'/l`. Let the complete correcting lens be `Qtarget`; derive `Qeye=Dret*I-Qtarget`. With trial lens `Qtrial`, object vergence L and scalar accommodation a:

```text
Qeffective = Qeye + Qtrial + (L+a)*I
L = 0 for a distant on-axis object at infinity
L = -1/d for a real object d metres away in air
For a positive eigenvalue lambda: focal depth z = n'/lambda
For a zero eigenvalue: focus at infinity
For a negative eigenvalue: virtual focus, not a real point behind the eye
```

This is a deliberately simplified same-plane model, not a clinical eye or spectacle-to-cornea prescription calculation. Do not quietly use spectacle vertex distance as though it were already incorporated. Do not call l the patient's measured axial length without explaining its reference plane.

For an on-axis ray bundle with initial transverse ray position r0 at the common lens plane, a compatible propagation rule is `r(z)=(I-(z/n')*Qeffective)*r0`; if deriving a pupil cross-section, validate it from the eigen-directions of the model. Explain that a focal line is perpendicular to the meridian whose rays have converged. The two principal meridians give two line foci in regular astigmatism; a sphere gives a shared focus under these assumptions.

For a circular pupil and two positive principal vergences lambda1 and lambda2, the geometric circle-of-least-confusion plane is `z=2*n'/(lambda1+lambda2)`. It is the midpoint in vergence, not generally the arithmetic midpoint of the two focal distances. Test this distinction. Show the retina relative to the two foci for the five astigmatic categories.

Allow the student to move the retina, change eye power, change object distance, alter accommodation within a declared scenario and add a correcting lens. A schematic eye must not physically morph into implausible anatomy merely to explain a two-diopter change.

A perceived-image preview is optional and must be labeled an approximation. A geometric point-spread function can illustrate direction-dependent blur, but it does not predict an individual's Snellen acuity, neural adaptation, scattering, diffraction, higher-order aberrations or subjective experience. Never use generic CSS blur as the optical answer engine. Keep patient-reported acuity as an independently authored, coherent observation, not a universal formula from diopters.

### 5.7 Lens composition, near addition and advanced extensions

In the same-plane thin-lens model, combine lenses by adding power matrices; do not add written cylinder powers and average axes. Subtract matrices to compare a proposal with a target and identify the residual correction. Teach same-plane assumptions before allowing this tool.

A near addition changes sphere in the simplified prescription representation while preserving cylinder and axis; selecting a clinically suitable ADD is a different task requiring context. Prism/base fields are separate from sphere/cylinder. Prism diopters, lens diopters and angular degrees must not be conflated.

As optional extensions, implement source-verified vertex-distance conversion, scalar Prentice-rule exercises, lensometry and irregular-aberration illustrations. Apply vertex conversion to both principal powers, with explicit direction and units, not just sphere. Guard singularities. Do not expand into a real IOL or contact-lens prescribing system as a shortcut to appearing comprehensive.

## 6. Refraction suite — not “click until correct”

The virtual retinoscope and phoropter must use the same target lens state as the optical workbench. Separate target refraction, current trial lenses, instrument convention, working distance, streak orientation, measured meridian, accommodation context and observation quality. Source O3 establishes the teaching workflow; older hardware descriptions must not be generalized to every device.

For a declared plane-mirror static-retinoscopy model with relaxed accommodation, let R(theta) be the target net corrective power and w the working distance in metres. The gross neutralizing power is `G(theta)=R(theta)+1/w`. Compare it to trial power T(theta): a positive residual `G−T` requires more plus and a negative residual more minus. Make the simulated with/against behavior consistent with the declared mode. Neutrality tolerance is a teaching parameter, not a claim of exact clinical resolution.

A vertical streak swept horizontally measures the horizontal meridian. Explicitly label the streak and sweep; never let their visual orientation quietly switch. Changing working distance changes gross neutrality, not the underlying patient's target refraction. Remove working-distance power from both principal gross powers, equivalently from sphere in the same spherocylinder representation. Track whether a dedicated working-distance lens is already included to prevent double subtraction.

At 0.50 m, the working-distance contribution is exactly +2.00 D. A gross result `+2.00 −4.00 × 180` becomes net `plano −4.00 × 180`. At an exactly entered 0.67 m, the mathematical reciprocal is about 1.492537 D; label the familiar 1.50 D convention as rounded or use 2/3 m for its exact reciprocal.

Provide correct synthetic reflexes, adjustable lens controls, a comparison of gross and net records and a readout of remaining error in teaching mode. Include authored examples of changing accommodation, poor fixation, small pupils, media opacity and irregular reflexes at the selected depth. Do not diagnose a specific disease from reflex appearance alone.

For JCC, model the actual pair of equal-and-opposite principal powers. A ±0.25 D JCC has principal powers +0.25 and −0.25 D, zero spherical equivalent and a 0.50 D principal-power difference. Separate axis and cylinder-power refinement. State the selected plus/minus-cylinder workflow and label actual powers in addition to colors. Compose the JCC and trial correction mathematically; do not follow a memorized red-dot rule across inconsistent conventions.

A deterministic fictional patient's lens preference can be driven by a declared residual-optics teaching metric or by reviewed scenario responses. Label the approximation. Do not present a residual-vector norm as a validated patient preference or acuity model. Use source-checked subjective-refraction logic and account for uncertainty at the endpoint rather than promising one universally exact button sequence. Source O4 is a reference for the workflow.

## 7. The 18 interconnected studios

The laboratories are reusable instruments serving many lectures and cases. They are not 18 independent miniature apps. Share the patient model, notation system, timeline, assessment interfaces, source panel and progress database.

### LAB01 — Optical bench and refractive mechanisms

Implement Sections 4–5 fully. Include lens power, vergence, axis/meridian distinction, power crosses, sine-squared meridional variation, focus relative to the retina, astigmatic line foci, accommodation and correction. Offer reverse challenges: build a lens to match a power cross; construct a fictional refractive state with one focus on the retina; repair an incorrect transposition; demonstrate why identical average power does not mean identical correction.

Provide at least 18 original optics mission families spanning reading notation, meridional prediction, power-cross reconstruction, plus/minus transposition, spherical-equivalent traps, diagnosis, oblique axes, underdetermined data, lens composition, working-distance errors and near/distance distinctions. Numerical variants within a family are not separate independent clinical cases. Reserve genuinely different families or task structures for transfer assessment.

### LAB02 — Refraction and accommodation suite

Implement Section 6 plus the appropriate T011–T019 and T082 activities. Students choose a virtual instrument, control it, collect observations, derive a refraction, explain a discrepancy and write a result. Permit objective and subjective results to differ in reviewed cases. Give a complete workflow from observed reflex to gross correction to net correction to further refinement; do not skip calculation by displaying the final prescription on the instrument.

In advanced cases, let the student decide whether a routine workflow is appropriate before operating the equipment. Include accommodation and near-work scenarios without making an age slider directly prescribe an ADD. Distinguish learning how a method works from performing it on a real patient.

### LAB03 — Prescription, lensometry and refractive-diagnosis desk

Present a realistic but clean OD/OS prescription form with SPH, CYL, AXIS, optional ADD and separately specified prism/base. Teach plano, DS, full-eye names, and local/Latin equivalents. Do not force monocular fields into one binocular shorthand when they differ.

Support lens-to-prescription, prescription-to-power-cross, power-cross-to-classification, equivalent-notation, error-correction, and bilateral comparison exercises. Lensometry needs a true virtual focusing/reading interaction or an explicitly labeled interpretation exercise, not a photograph with a “measure” button. A measured pair of glasses establishes lens properties, not the person's current diagnosis.

Assessment separates arithmetic, optical equivalence, requested notation, laterality, supported refractive classification and explanation. A learner can be numerically correct but clinically overconfident, or optically correct but use the wrong requested format; feedback must state which.

### LAB04 — Visual function room

Cover distance/near acuity, low-acuity documentation, pinhole, color, contrast and Amsler. The student examines a **virtual patient**. The application's rendered charts are not advertised as validated self-tests of the student's eyesight. Provide supplied patient responses rather than evaluating how many real letters the student can personally see.

Teach acuity conversions with explicit units and protocols; `decimal acuity = numerator/denominator` and `logMAR = −log10(decimal acuity)` describe numerical relationships, not interchangeability of every chart. Do not assign one universal numeric logMAR to CF/HM/LP/NLP. Require test distance and correction status where relevant.

Use legitimate licensed assets for authentic plates or clearly labeled original illustrations. Let a student with color-vision differences learn the method through equivalent numerical and textual observations. Treat a symptom-preview image as an illustration rather than proof of what every patient experiences. K7 is a starting reference for color-testing methods.

### LAB05 — Pupils and neural light pathways

Build a stateful light-pathway model with separate afferent inputs and efferent outputs. Show both eyes, a movable light, current illumination and optional pathway visualization. The learner predicts the response before swinging the light. Support normal responses, relative afferent asymmetry, a constrained efferent defect and selected anisocoria examples. Do not represent RAPD as a permanently large pupil. Source K1 supports the core distinction.

Use a clearly schematic response curve; do not claim patient-specific pupil diameter, latency or drug response unless backed by the relevant data. Near response, sympathetic dysfunction and pharmacological interpretation require their own source-reviewed scenarios, not arbitrary reuse of the light-reflex model. Observation and laterality must remain consistent during pause, replay and fast light movements.

### LAB06 — Motility, alignment and binocular vision

Provide an examiner-view face with explicit patient right/left, a fixation target, cover tool, optional prism and a timing/replay strip. Implement ductions/versions and the specific cover-test stages. During each stage, label the covered eye and the eye that must be observed. Tropia/phoria should emerge from the modeled fixation/fusion state, not a text label alone. A left esotropic eye moving outward to take fixation when the right fixing eye is covered is a required core fixture. K2 supports this example.

Compare cover-uncover, alternate-cover, simultaneous prism-cover and alternate prism-cover rather than pretending all quantify the same component. The AAPOS description of the AAO simulator provides a useful reference for these distinctions, not permission to copy it. Add binocular extensions with declared filter assignments, rod orientation, distance and response semantics. Do not require actual colored glasses or intact student stereopsis to complete the educational task.

### LAB07 — Visual fields and pathway localization

Link a patient-centered scene, monocular field maps, retinal mapping and neural pathway. Allow marking a field defect, placing a hypothetical lesion, or interpreting a supplied report. Separate field coordinates from retinal coordinates and UI mirroring. Use current source-checked localization relationships; a right retrochiasmal lesion affecting the relevant hemifield should produce left homonymous loss in a standard teaching case. K3 provides a localization reference.

Include confrontation, kinetic and automated-perimetry interpretation. Show test reliability, fixation and artifacts before allowing a confident diagnosis. Do not invent proprietary instrument probability plots or normative databases. When a generic teaching plot is used, label it. For a real licensed report, preserve its scale and metadata while protecting patient privacy. Do not impose outdated universal reliability cutoffs without verifying the actual protocol.

### LAB08 — Slit lamp and anterior segment

Provide an original, constrained anterior-segment scene with meaningful light angle, beam width, focus and magnification controls. The student must expose the correct layer or region before documenting a finding. Teach diffuse illumination, optical section, retroillumination and appropriate anterior-chamber observations. Tie every label to a coherent spatial structure; beam motion must not create or erase a disease randomly.

Support a schematic teaching mode and an authentic-image interpretation mode. These are different evidence levels. Grade only what the scene actually makes observable. If applying a formal grading system such as cells/flare, obtain and verify the precise standard and viewing protocol before publishing numeric grades. A virtual slit-lamp interaction does not demonstrate safe physical use of a real instrument.

### LAB09 — Cornea, ocular surface and lacrimal system

Combine fluorescein patterns, virtual blinking/tear film, supplied tear-test results, corneal sensation, lid eversion and tear-drainage anatomy. The learner observes, documents and forms a differential. In paired cases, change one discriminating feature while keeping other findings plausible. Teach the difference between an epithelial observation and an etiological diagnosis.

Use licensed clips or original schematics for Seidel and tear-break-up demonstrations. Teach negative-test limitations. A suspected open-globe case must not reward pressure or manipulation merely to finish the station. Source K5 supports the pressure-avoidance principle. Advanced lacrimal irrigation and microbiology are mechanism/interpretation activities with supervised-procedure boundaries, not directions for students to practice invasively on themselves.

### LAB10 — Pressure, chamber angle and glaucoma

Connect a simplified aqueous-flow model, virtual tonometry, angle visualization, optic-disc findings and visual fields. A student adjusts a conceptual production/outflow variable and predicts the directional effect, then interprets a supplied clinical case. A conceptual animation is not an individual pressure predictor.

For Goldmann teaching, mires, controls and the observation must interact coherently. Include common technique artifacts using reviewed examples. Add Van Herick, gonioscopy and indentation with explicit viewing conventions and the chosen grading system. Do not classify glaucoma from IOP alone or automatically exclude it with a nominally normal reading. Source K4 supports this caution. Do not add an unvalidated universal corneal-thickness correction calculator.

### LAB11 — Fundus examination and lesion description

Build a navigable examination view with a limited field, clear orientation and a systematic route through disc, vessels, macula and available periphery. Compare direct, indirect and slit-lamp-based viewing principles. Require students to locate and describe findings before selecting a diagnosis. Normal variation, image quality and incomplete views must be represented, not only dramatic textbook examples.

Authentic pathology recognition requires properly licensed clinical images with correct metadata. Original diagrams may teach morphology, but must be labeled schematics and must not be credited as authentic-image competence. In the grading rubric, distinguish finding detection, description, localization, inference and unsupported staging. An unseen region must remain unexamined in the generated note.

### LAB12 — Retinal imaging suite

Link a fundus location to an OCT slice or stack, and let the learner inspect layers, structural findings and segmentation artifacts. Add RNFL/ganglion-cell context and relevant angiographic/autofluorescence interpretation. Teach modality selection and what each modality can and cannot reveal.

A schematic stack must be generated from a coherent authored volume or validated sequence, not unrelated random cross-sections. Real OCT data needs permission, correct scale and provenance. Do not fabricate a scanner report, normal database percentile or automated diagnosis. Include cases where a red/green normative label is insufficient, a segmentation artifact matters, or image quality prevents grading. Separate hypothetical treatment-mechanism demonstrations from real longitudinal clinical evidence.

### LAB13 — Corneal measurement, ultrasound and electrophysiology

Cover keratometry, topography/tomography, pachymetry, biometry, B-scan and selected ERG/VEP interpretation. Link map features to anatomy and quality checks. Show why total refraction is not identical to anterior corneal measurements. Include regular and irregular optical examples, but do not declare keratoconus from a generic cylinder value.

A B-scan station may use a constrained anatomy model plus licensed dynamic examples. Teach probe orientation and interpretation without implying physical safety or competence. Biometrics and waveforms must have units, protocols, sources and explicit validity boundaries. Do not invent a clinical IOL-power prediction engine or waveform reference range to fill a feature card.

### LAB14 — Pediatric examination and visual development

Teach choosing age-appropriate visual assessment, fixation behavior, red reflex, alignment and relevant refractive context. Connect amblyopia, strabismus and refractive differences without treating “lazy eye” as one precise diagnosis. Allow pediatric cases with incomplete cooperation and show how this limits the evidence.

A white pupil/reflex is a finding, not an automatic single-cause diagnosis. Include source-reviewed differential and urgency tasks. Do not calculate pediatric prescriptions from adult rules or derive cycloplegic medication regimens. Advanced details are independently selectable. Use appropriate clinical sources, not game stereotypes, to determine age-dependent cases.

### LAB15 — Eyelids, orbit and advanced neuro-ophthalmic assessment

Implement meaningful lid/levator measurement, proptosis/exophthalmometry interpretation, ptosis-pupil-motility integration, selected fatigability/head-tilt tasks and orbital/visual-pathway imaging. A virtual ruler can grade distance only in a declared calibrated *virtual scene*, not a webcam photograph of the learner.

Do not reduce a diagnostic test to “positive means disease X.” Teach sensitivity to context, mimics and limitations, with supported next steps. Use current guidance for dangerous pupil/motility and orbital presentations rather than obsolete blanket rules. Keep invasive and pharmacological actions conceptual unless a properly reviewed educational protocol is present.

### LAB16 — Urgent eye clinic

Use branching fictional presentations with staged evidence and task-relative time, not arcade reaction speed. Cases should include chemical injury, suspected open globe, acute painful red eye, severe keratitis, sudden painless loss, flashes/floaters, orbital disease and relevant postoperative concerns. Source-check every management branch and protocol date before scoring it.

A sensible action can be to stop a routine examination and prioritize urgent care. In an ordinary isolated chemical-exposure case, a long routine history must not be a required prerequisite to initial irrigation; K6 supports that principle. In an open-globe scenario, pressure/tonometry must not be a rewarded routine step. Complex combined injuries need distinct reviewed branches. Do not invent precise irreversible-harm timers or show a catastrophic animation as though it predicts outcome.

### LAB17 — Treatment and procedure mechanisms

Teach treatment classes, anatomy, mechanisms, indications, major risks and why a procedure is chosen at medical-student depth. Connect a treatment mechanism to the same disease mechanism previously studied. Examples may include cataract extraction, trabecular outflow treatments, iridotomy, retinal treatment principles and corneal procedures where source-checked.

This is a conceptual laboratory, not a real surgical trainer or prescription generator. Do not claim that virtual dragging demonstrates surgical skill. Drug regimens, contraindications and urgent treatment pathways require current primary or professional guidance. When specific doses cannot be verified, teach mechanism and escalation rather than inventing a number. Scope approval is separate from code passing tests.

### LAB18 — Integrated OSCE, diagnosis writing and viva

Bring a patient through history, targeted examination, investigation interpretation, assessment and a written note. The same patient state must drive all selected tests. The learner writes condition, laterality, subtype/location where supported, uncertainty, relevant findings and next action. A symptom, observed sign, refractive classification, differential and confirmed diagnosis are different output types.

Generate documentation only from obtained evidence. Do not prefill normal pupils, normal retina or a pressure measurement the learner never assessed. Provide a diagnostic composer for beginners and increasingly open responses for advanced users. Score structure and evidence separately from English wording. Allow a defensible provisional diagnosis and the missing investigation when certainty is not justified.

Viva mode should ask “why?”, “what would change your answer?”, and “what cannot be concluded?”. An offline rubric-comparison route must work without speech recognition or an AI API. Optional AI feedback is formative and source-grounded; it is not the answer authority or a clinician review.

## 8. Contract for every test and investigation activity

The 88-entry catalog is a *minimum proposed coverage registry*, not a claim that every conceivable ophthalmic test exists in version 1. Extend it when a selected lecture justifies an omitted method. Keep extension depth out of the default path when it distracts from undergraduate essentials.

Every published entry must contain: purpose; prerequisites; anatomy/mechanism; patient preparation; required equipment; a declared protocol; meaningful learner-controlled steps; the resulting observations; interpretation; plausible alternative explanations; common errors; limitations; safety boundaries; documentation; source references; and a scored task or an explicitly labeled self-assessment rubric.

Maintain independent capability flags: `conceptExplanation`, `interactiveMechanism`, `sequencePractice`, `resultInterpretation`, `documentationPractice`, `assessedTransfer`, and `requiresSupervisedPhysicalPractice`. A text description must not set `interactiveMechanism=true`. A dropdown returning a fixed result does not establish procedural simulation. A scored sequence does not establish physical competence.

Define source and fidelity levels: conceptual schematic, constrained procedural simulation, authentic-image interpretation, and source-reviewed clinical case. Show these levels to the learner. If an authentic asset is missing, keep the concept lesson available but mark the corresponding authentic-image assessment gap rather than quietly substituting synthetic photography.

The catalog appears below and is duplicated in `TEST_REGISTRY.json`. That JSON intentionally starts all implementation states as planned and all human-review states as not reviewed. Update status only after actual work and evidence.

| ID | Activity | Studio | Depth | Required student action | Critical safeguard |
|---|---|---|---|---|---|
| T001 | Distance acuity: Snellen | LAB04 | Core | Choose eye, correction and test distance; record the supplied result | Do not equate acuity with a percentage of total vision |
| T002 | LogMAR / ETDRS-style acuity interpretation | LAB04 | Core | Interpret chart structure and a supplied letter score under a stated protocol | Do not claim an arbitrary font is a standardized chart |
| T003 | Near visual acuity | LAB04 | Core | Set working distance and document near notation with correction | Do not mix incompatible near-chart notations without a source |
| T004 | Very low acuity: CF, HM, LP and NLP | LAB04 | Core | Sequence a fictional low-vision assessment and document distance where relevant | Do not assign universal exact logMAR values to these categories |
| T005 | Pinhole acuity | LAB04 | Core | Compare baseline and pinhole results and justify the next step | Improvement is evidence of an optical contribution, not proof that no disease exists |
| T006 | Contrast sensitivity | LAB04 | Extension | Interpret a supplied contrast chart and compare with acuity | An illustrative display is not a calibrated clinical measurement |
| T007 | Pseudoisochromatic color plates | LAB04 | Core | Teach administration and interpret supplied validated results | Do not copy unlicensed plates or diagnose the student's color vision |
| T008 | Hue arrangement: D-15 / 100-hue principles | LAB04 | Extension | Arrange illustrative tiles and interpret sourced example error patterns | Screen rendering is educational, not a standardized personal test |
| T009 | Red desaturation / brightness comparison | LAB05 | Core | Compare fictional monocular reports and correlate with other findings | Subjective asymmetry alone is not a complete diagnosis |
| T010 | Amsler grid | LAB04 | Core | Map a virtual patient's central distortion or missing area | A normal illustrative grid result does not exclude macular disease |
| T011 | Static retinoscopy | LAB02 | Core | Sweep a streak, change trial lenses, neutralize and remove working-distance power | The streak orientation and measured meridian are different |
| T012 | Subjective sphere refinement and fogging | LAB02 | Core | Compare lenses with a fictional patient and state the endpoint | Do not reward indiscriminate over-minus correction |
| T013 | Jackson cross-cylinder: axis | LAB02 | Extension | Position, flip and refine axis using an explicitly labeled convention | Do not use dot color as the only indication of power or axis |
| T014 | Jackson cross-cylinder: cylinder power | LAB02 | Extension | Compare flips and maintain the required spherical-equivalent relationship | A ±0.25 D cross-cylinder does not mean 0.25 D cylinder magnitude |
| T015 | Duochrome | LAB02 | Extension | Interpret fictional responses and connect them to chromatic focus | Do not treat a color response as a sufficient clinical endpoint |
| T016 | Binocular balance | LAB02 | Extension | Choose an appropriate case and interpret dissociated responses | Do not apply one protocol to every acuity or binocular-status combination |
| T017 | Near addition assessment | LAB02 | Core | Use working distance, distance correction and provided accommodation context | Age alone is not an automatic ADD prescription |
| T018 | Cycloplegic versus non-cycloplegic refraction | LAB02 | Core | Compare results and explain when accommodation matters | Dilation and cycloplegia are not interchangeable concepts |
| T019 | Autorefraction report interpretation | LAB02 | Core | Check laterality, notation, quality and differences from other findings | An autorefractor printout is not automatically the final prescription |
| T020 | Lensometry / focimetry | LAB03 | Extension | Focus simulated principal line sets and write a lens prescription | Measurement of an existing lens is not diagnosis of the wearer |
| T021 | Pupil size and anisocoria in light and dark | LAB05 | Core | Compare both pupils under controlled illumination | Do not infer RAPD merely from unequal resting sizes |
| T022 | Direct and consensual pupil responses | LAB05 | Core | Illuminate one eye and record both responses | Model afferent input and efferent response independently |
| T023 | Swinging-flashlight / RAPD assessment | LAB05 | Core | Swing the light and compare the relative response | A RAPD is not a permanently dilated pupil |
| T024 | Near response and light-near dissociation | LAB05 | Extension | Switch targets and compare distinct response contexts | Do not reuse the light-reflex animation as a near-response model |
| T025 | Ductions, versions and gaze positions | LAB06 | Core | Move the target and document limitation with patient laterality | Muscle actions and test positions must not be conflated |
| T026 | Saccades, pursuit and nystagmus observation | LAB06 | Extension | Control target behavior and describe supplied eye-movement patterns | Do not create physiologic waveforms from arbitrary easing curves |
| T027 | Hirschberg corneal light reflex | LAB06 | Core | Inspect reflex positions and describe alignment | Reflex displacement must use the correct coordinate convention |
| T028 | Krimsky prism reflex method | LAB06 | Extension | Adjust a virtual prism to a defined reflex endpoint | State the precise variant and which eye carries the prism |
| T029 | Cover-uncover test | LAB06 | Core | Cover the fixing eye, watch the fellow eye, then observe uncovering | Specify the observed eye at each stage |
| T030 | Alternate-cover test | LAB06 | Core | Break fusion and observe refixation as the cover alternates | Do not call the total dissociated deviation a pure manifest deviation |
| T031 | Prism cover testing | LAB06 | Extension | Distinguish simultaneous from alternate prism-cover methods and neutralize | The selected method determines which deviation component is measured |
| T032 | Maddox rod | LAB06 | Extension | Rotate the rod and align a reported line and light using a declared convention | The observed line and rod cylinder orientation are perpendicular |
| T033 | Worth four-dot | LAB06 | Extension | Set filter assignment and interpret a virtual patient's reports | Filter eye, distance and diplopia geometry must be explicit |
| T034 | Stereoacuity | LAB06 | Extension | Explain disparity and interpret age-appropriate example results | A flat illustration without appropriate apparatus is not a validated stereo test |
| T035 | Near point of convergence | LAB06 | Extension | Move a near target and record provided break and recovery observations | Do not turn a mouse-position threshold into a diagnostic cutoff |
| T036 | Hess / Lancaster interpretation | LAB06 | Extension | Interpret a sourced or clearly schematic motility plot | Do not reduce every pattern to one diagnostic lookup label |
| T037 | Confrontation visual fields | LAB07 | Core | Maintain fixation, test monocular quadrants and document findings | Keep patient field coordinates distinct from retinal coordinates |
| T038 | Kinetic perimetry | LAB07 | Extension | Move stimuli of specified properties and construct illustrative isopters | App stimulus parameters are not real instrument calibration |
| T039 | Static automated perimetry | LAB07 | Core | Assess reliability, inspect plots and interpret a supplied pattern | Do not generate proprietary probability maps without normative data |
| T040 | Tangent screen / central-field mapping | LAB07 | Extension | Map a fictional patient's reported boundary with fixation controlled | Do not confuse a response artifact with an established lesion |
| T041 | External and penlight examination | LAB08 | Core | Inspect lids, conjunctiva, sclera, cornea and pupil systematically | Observation is not equivalent to a complete slit-lamp examination |
| T042 | Slit lamp: diffuse illumination | LAB08 | Core | Adjust light and identify the visible region | An illumination control must change what can actually be observed |
| T043 | Slit lamp: optical section | LAB08 | Core | Adjust beam angle, width and focus to identify depth | A slit graphic pasted over a photo is not a depth model |
| T044 | Retroillumination | LAB08 | Extension | Choose illumination and identify a supplied media abnormality | Do not alter clinical-image pathology through cosmetic effects |
| T045 | Van Herick assessment | LAB10 | Core | Compare peripheral chamber depth in a source-defined view | Do not present it as a replacement for gonioscopy |
| T046 | Anterior chamber cells and flare | LAB08 | Core | Describe a standardized illustrative field and apply a verified grading system | Do not invent cell counts or grade boundaries |
| T047 | Corneal fluorescein staining | LAB09 | Core | Inspect a pattern, locate the epithelial finding and form a differential | A staining pattern alone must not force an unsupported diagnosis |
| T048 | Tear-break-up time | LAB09 | Extension | Control a virtual blink and measure a defined tear-film interval | Timing is an authored simulation, not a measurement of the user |
| T049 | Schirmer test | LAB09 | Extension | Compare protocols and interpret a supplied strip result | Anesthetic status and protocol must be stated |
| T050 | Corneal sensation | LAB09 | Core | Choose a safe examination sequence and interpret supplied asymmetry | Do not invite unsupervised testing of the student's cornea |
| T051 | Lid eversion | LAB09 | Core | Sequence the maneuver in a virtual patient and inspect the hidden surface | Do not reward manipulation when the case requires avoiding pressure |
| T052 | Seidel assessment | LAB09 | Core | Interpret a licensed clip or schematic leakage pattern | A negative result does not independently exclude open-globe injury |
| T053 | Fluorescein dye disappearance | LAB09 | Extension | Compare timed virtual tear clearance and document the observation | Do not equate all delayed clearance with one precise obstruction level |
| T054 | Lacrimal irrigation: interpretation and principles | LAB09 | Extension | Trace anatomy and interpret supplied reflux or passage observations | Conceptual training is not authorization for an invasive procedure |
| T055 | Goldmann applanation tonometry | LAB10 | Core | Align virtual mires and interpret a supplied pressure with artifacts | Do not use measured pressure alone to diagnose or exclude glaucoma |
| T056 | Rebound / handheld tonometry | LAB10 | Core | Compare use cases, technique prerequisites and supplied results | Do not assume every device shares an identical bias or scale |
| T057 | Noncontact tonometry | LAB10 | Extension | Explain the measurement principle and interpret screening context | A screening value does not establish a complete glaucoma assessment |
| T058 | Static gonioscopy | LAB10 | Core | Identify angle landmarks in a labeled original scene | Viewing geometry and angle-grading system must be declared |
| T059 | Indentation gonioscopy | LAB10 | Extension | Compare appositional and synechial example behavior | Use a reviewed constrained model, not arbitrary opening animations |
| T060 | Pachymetry | LAB13 | Core | Interpret a supplied thickness value with the clinical context | Do not use a universal linear IOP correction formula |
| T061 | Red reflex and Brückner comparison | LAB14 | Core | Compare virtual pupils and describe asymmetry or leukocoria | A white reflex is a finding requiring evaluation, not one automatic diagnosis |
| T062 | Direct ophthalmoscopy | LAB11 | Core | Select the view, navigate landmarks and record observed findings | A limited view does not establish a normal unseen retinal periphery |
| T063 | Binocular indirect ophthalmoscopy | LAB11 | Core | Navigate a wider illustrative view and learn image orientation | Do not confuse virtual navigation with verified physical competence |
| T064 | Slit-lamp fundus examination with condensing lenses | LAB11 | Extension | Compare viewing geometry and identify landmarks | Keep image orientation explicit rather than silently mirroring the retina |
| T065 | Fundus photographs and optic-disc assessment | LAB11 | Core | Localize findings before naming disease and document only supported detail | Do not grade a disease stage from insufficient image coverage |
| T066 | Macular OCT | LAB12 | Core | Scroll an authored stack, locate layers and correlate findings | Schematic slices are not real patient scans |
| T067 | RNFL / ganglion-cell OCT | LAB12 | Core | Inspect segmentation, scan quality and structure-function context | An isolated red sector is not an automatic glaucoma diagnosis |
| T068 | Fluorescein angiography | LAB12 | Extension | Interpret sourced phases and compare leakage, staining and blockage | Timelines and patterns must come from an approved case |
| T069 | Indocyanine-green angiography | LAB12 | Extension | Select an appropriate teaching indication and interpret supplied findings | Do not swap its information with fluorescein angiography |
| T070 | OCT angiography | LAB12 | Extension | Compare structural and flow information and inspect artifacts | Do not present it as identical to dye leakage imaging |
| T071 | Fundus autofluorescence | LAB12 | Extension | Describe a supplied signal pattern and correlate modalities | Signal appearance alone must not identify one disease universally |
| T072 | Corneal topography and tomography | LAB13 | Core | Compare maps and regular versus irregular patterns with quality checks | A spectacle cylinder axis is not automatically a corneal steep axis |
| T073 | Keratometry | LAB13 | Core | Read principal corneal measurements and distinguish them from refraction | Corneal and total refractive astigmatism are not interchangeable |
| T074 | Ocular biometry | LAB13 | Extension | Compare axial and anterior-segment measurements in authored examples | Do not fabricate a clinically usable IOL calculator |
| T075 | B-scan ocular ultrasonography | LAB13 | Core | Position a virtual probe and interpret an approved dynamic scene | Avoid pressure in scenarios where globe integrity is uncertain |
| T076 | Electroretinography | LAB13 | Extension | Compare supplied waveforms and explain which tissue response is assessed | Do not invent normal reference intervals or a screening diagnosis |
| T077 | Visual evoked potentials | LAB13 | Extension | Interpret a supplied waveform in its protocol and clinical context | A waveform alone is not a universal lesion diagnosis |
| T078 | Pediatric fixation and preferential-looking assessment | LAB14 | Core | Choose an age-appropriate method and interpret fixation behavior | Adult letter-chart logic does not apply to every child |
| T079 | Ptosis, lid measurements and levator function | LAB15 | Core | Measure a defined virtual scene and integrate pupil and motility findings | Do not infer the cause from lid height alone |
| T080 | Exophthalmometry | LAB15 | Extension | Place virtual landmarks and interpret supplied values and asymmetry | Reference ranges depend on method and population |
| T081 | Prism units and Prentice-rule exercises | LAB03 | Extension | Calculate a constrained educational prism example and specify base direction | Distinguish prism diopters from lens diopters and degrees |
| T082 | Accommodation amplitude and facility | LAB02 | Extension | Compare protocol-specific fictional near responses | Do not claim a single age formula diagnoses presbyopia |
| T083 | Bagolini striated-lens test | LAB06 | Extension | Interpret a virtual report with explicit lens orientation | A diagram of lines is not itself a binocular test on the student |
| T084 | Head tilt and three-step localization | LAB15 | Extension | Change gaze and head position and compare a constrained case | The three-step pattern is not universally specific for one muscle disorder |
| T085 | Fatigability and ice-pack interpretation | LAB15 | Extension | Compare supplied pre/post observations in a reviewed scenario | Do not turn one response into definitive ocular-myasthenia diagnosis |
| T086 | Corneal microbiology: test selection and specimen principles | LAB09 | Extension | Choose investigations from case context and interpret supplied findings | Do not simulate unsupervised sampling as an actionable procedure |
| T087 | Orbital / visual-pathway CT and MRI interpretation | LAB15 | Extension | Select a modality for a sourced case and correlate anatomy | Do not give MRI as a default when a metallic foreign body is a concern |
| T088 | Pharmacologic pupil-test interpretation | LAB05 | Extension | Interpret a source-reviewed protocol and its limitations | Do not provide unverified doses, pediatric use or timing assumptions |


## 9. Lecture curriculum and depth contract

Retain these stable lecture IDs. Every lecture can be selected independently. The grouping is a product proposal informed by undergraduate teaching resources C1–C3, not a claim about the student's university examination. Core, detailed and specialist views can share an objective graph while exposing different depths. Do not force all 88 activities into every learner's default plan.

| ID | Selectable module | Required learning emphasis | Signature interaction |
|---|---|---|---|
| L01 | Eye and orbital anatomy | Ocular coats, chambers, lens, retina, optic nerve, vessels, adnexa and orientation | Build and label an eye; switch cross-section and external views |
| L02 | Visual and ocular physiology | Accommodation, aqueous production/outflow, retinal function and visual development | Manipulate a mechanism and predict the downstream change |
| L03 | Basic geometrical optics | Diopters, focal length, vergence, spherical/cylindrical lenses and simplified image formation | Ray-and-lens workbench |
| L04 | Refractive errors | Myopia, hyperopia, presbyopia, regular/irregular astigmatism, anisometropia and corrective principles | Compare mechanisms and choose a correction category |
| L05 | Prescription notation and power crosses | OD/OS/OU, SPH/CYL/AXIS, plus/minus cylinder, principal meridians, transposition, spherical equivalent | Write and repair a prescription from a power cross |
| L06 | Refraction methods | Retinoscopy, working distance, subjective refinement, Jackson cross-cylinder, duochrome and cycloplegia principles | Guided refraction with explicit instrument conventions |
| L07 | Visual acuity and clinical notation | Distance/near acuity, pinhole, corrected/uncorrected acuity, Snellen/decimal/logMAR concepts and documentation | Examine a virtual patient and record findings |
| L08 | Ophthalmic history and examination sequence | Symptom characterization, relevant history, systematic examination and prioritization | Choose the next question or examination maneuver |
| L09 | Pupils and light pathways | Direct/consensual response, afferent/efferent defects, RAPD and anisocoria | Swing a virtual light and localize the defect |
| L10 | Ocular motility and alignment examination | Extraocular movements, cover tests, corneal reflex, phoria/tropia and prism concepts | Cover/uncover a virtual patient's eyes |
| L11 | Visual fields and pathway localization | Confrontation, perimetry, monocular/binocular defects, chiasmal/retrochiasmal localization | Map a lesion to the visual fields |
| L12 | Instruments and core examination techniques | Penlight, slit lamp, red reflex, direct/indirect ophthalmoscopy, tonometry and gonioscopy principles | Select an instrument and interpret what it can reveal |
| L13 | Conjunctiva and common red eye | Conjunctivitis types, subconjunctival hemorrhage, pterygium and important differentials | Contrast similar red-eye presentations |
| L14 | Eyelids and lacrimal system | Blepharitis, chalazion/hordeolum, lid malposition, ptosis and lacrimal obstruction/infection | Match anatomy, findings and appropriate next evaluation |
| L15 | Cornea and ocular surface | Dry eye, epithelial defects, microbial/herpetic keratitis, contact-lens risk and keratoconus | Interpret fluorescein patterns and corneal findings |
| L16 | Episclera and sclera | Episcleritis/scleritis mechanisms, distinguishing features and systemic associations | Compare cases using pain, examination and context |
| L17 | Uveitis | Anatomic classification, signs, complications and selected associations | Localize inflammation and connect signs to anatomy |
| L18 | Lens and cataract | Cataract types, symptoms, examination, complications and surgery principles | Relate the opacity's location to symptoms and examination |
| L19 | Glaucoma | Open-angle and angle-closure mechanisms, risk, disc/field assessment and treatment principles | Explore aqueous flow, angle anatomy, disc and fields |
| L20 | Diabetic and hypertensive eye disease | Retinal findings, staging principles, macular involvement and systemic context | Identify findings and grade only when sufficient evidence exists |
| L21 | Macula and age-related disease | Dry/wet AMD, edema, epiretinal membrane, macular hole and metamorphopsia | Correlate fundus, OCT and symptoms |
| L22 | Retinal vascular disease and sudden painless loss | Arterial/venous occlusions, transient loss and urgent systemic implications | Interpret a case and select an appropriate urgent pathway |
| L23 | Vitreous and retinal detachment | Flashes/floaters, posterior vitreous detachment, retinal breaks, detachment and hemorrhage | Distinguish risk patterns without relying on a single symptom |
| L24 | Optic nerve disorders and disc swelling | Optic neuritis, ischemic neuropathy, papilledema, pseudopapilledema and atrophy | Combine disc appearance, function and systemic clues |
| L25 | Neuro-ophthalmology and diplopia | Cranial nerve palsies, Horner syndrome, ocular myasthenia and neurologic localization | Localize from pupils, ptosis, motility and history |
| L26 | Pediatric ophthalmology | Amblyopia, strabismus, visual development, leukocoria and congenital disorders | Age-sensitive case reasoning and screening principles |
| L27 | Orbit and thyroid eye disease | Preseptal/orbital disease, proptosis, thyroid eye disease and compressive risk | Distinguish location and identify threatening findings |
| L28 | Trauma and chemical injury | Abrasion, foreign body, hyphema, open globe, chemical injury and orbital trauma | Prioritize safe immediate actions in a branching case |
| L29 | Systemic disease and the eye | Diabetes, vascular disease, autoimmune/infectious disease and relevant systemic evaluation | Connect an ocular presentation to a systemic differential |
| L30 | Ocular pharmacology and adverse effects | Drug classes, mechanisms, indications, important contraindications, delivery and toxicity | Choose a class and explain mechanism/risk; use current sources |
| L31 | Imaging and extended investigations | OCT, angiography, ultrasound, topography, pachymetry, biometry, ERG and VEP | Select and interpret the appropriate investigation |
| L32 | Ocular and periocular tumors | Recognition of retinoblastoma, melanoma and important lid lesions at student depth | Spot suspicious features and choose the next assessment |
| L33 | Prevention, low vision and communication | Screening principles, rehabilitation, patient communication and public-health context | Explain a condition and practical support without jargon |
| L34 | Procedures and surgery principles | Cataract, laser, intravitreal, retinal, corneal and glaucoma procedures at conceptual depth | Match a procedure to anatomy, rationale and major risks |
| L35 | Integrated presentations and emergency reasoning | Painful/painless loss, red eye, diplopia, leukocoria, flashes/floaters and postoperative concerns | Unseen mixed cases with staged information |
| L36 | Documentation, viva and examination integration | Supported diagnosis, differential, laterality, notation, plan, referral and oral defense | Write a note; defend the reasoning; complete a mock exam |

For every published lecture, implement an actual learning journey: measurable objectives; a short entry challenge; mechanisms; manipulable demonstration or a meaningful investigation/decision task; a worked example; progressively reduced help; independent questions; a contrasting case; documentation where appropriate; a transfer check; and scheduled retrieval. Include a readable reference view for the student who needs a coherent deeper explanation, not only fragmented cards.

The reference view should have three levels: essentials, full explanation, and optional deeper detail. It must explain causal links, confusing contrasts, relevant anatomy, common mistakes and limits. A test or disease must not be reduced to a list of isolated buzzwords. A learner can expand a term, navigate to its prerequisite model and return without losing the current task.

Do not fill a lesson with activities simply to increase interaction count. A well-constructed interpretation task can be more useful than an irrelevant drag gesture. Use the smallest interaction that teaches the relationship. State prerequisites and estimated task time as adjustable design estimates, not proven optimal study durations.

Every disease lesson should connect **mechanism → presentation → observed signs → appropriate test → interpretation → differential → urgency/management principles → documentation**. Not every patient needs every test. Missing or conflicting evidence should be represented honestly. Normal variation and atypical examples belong alongside representative cases once the foundation is understood.

## 10. One coherent virtual patient across all stations

Implement a shared case engine. A patient is not a collection of independent disease flashcards. A patient's laterality, refraction, acuity, pupils, fields, motility, anterior segment and investigations must be coherent with the authored scenario and with each other.

Use source-reviewed case archetypes with bounded, checked variants. Do not generate arbitrary combinations by independently randomizing every finding. Physiological plausibility constraints and evidence consistency must be validated before a variant becomes eligible for assessment. Explicitly support comorbidity where an authored case justifies it; do not assume all findings always have one explanation.

Separate immutable initial case truth, evolving examination conditions, performed actions, revealed observations and the student's assessment. A hidden diagnosis must not leak through the route name, filename, image caption, alt text, patient identifier, tooltips, achievement title or next question. Accessibility descriptions in challenge mode should describe observable findings without disclosing the diagnosis; explanatory labels become available after submission.

A learner can choose history questions, select a test, perform the permitted maneuver and document the actual result. Wrong technique may make a result uninterpretable in a declared simulation rather than magically returning the same perfect finding. A missed test is not automatically a failure; the key question is whether the learner obtained enough evidence and prioritized appropriately. Penalize unnecessary dangerous actions and unsupported conclusions through a visible rubric, not arbitrary hidden deductions.

Allow hypothesis comparison: the student proposes a differential, identifies a discriminating observation and updates the assessment after new evidence. Do not display precise disease probabilities, sensitivity, specificity or likelihood ratios unless appropriate data and applicability are actually sourced. Clinical reasoning does not require invented numerical confidence.

The “Change one thing” feature clones a case into an explicitly hypothetical state. Explain what changed and what stayed fixed. Do not imply that toggling diabetes instantly produces a specific retinal photograph or that changing a label causes anatomy to evolve. Complex disease changes need authored alternatives, not unsupported continuous physiology.

An advanced case constructor may let learners assemble refractive cases from valid parameters and compare predicted observations. It must reject incompatible constraints or clearly identify uncertainty. General clinical cases should remain authored and source-checked; free-form generative patient invention must not enter scored exams without review.

### 10.1 Required case families

Create multiple independent reasoning families, not just number variants, spanning the chosen scope. At minimum the full product should include: spherical refractive errors; all five regular astigmatic categories; presbyopia with and without distance ametropia; interocular refractive differences; optical versus nonrefractive visual loss; common and concerning red eye; cataract; glaucoma assessment; retinal vascular/macular disease; flashes and floaters; optic nerve and visual-pathway problems; pupil and ocular-motility localization; childhood misalignment/amblyopia concerns; orbital presentations; trauma; and urgent postoperative or infectious presentations at the selected depth.

This is a coverage requirement, not permission to fabricate large numbers of superficial cases. Each published case needs an original narrative, coherent findings, sources, task-specific answer keys, counterfactual reasoning and a review state. Maintain held-out families for exam use.

### 10.2 The diagnosis and prescription notebook

Start with structured fields and fade scaffolding. Support free entry of sphere/cylinder/axis with an adjacent notation parser; a separate diagnosis composer; a power cross; a finding log; and an explanation box. Keep OD and OS independent. Never infer right or left from a lens diagram without a supplied label.

Distinguish exact numeric correctness, optical equivalence, notation convention, supported clinical classification, documentation completeness and reasoning quality. These are separate scores. A learner can have an optically equivalent answer but fail a specifically requested notation convention; explain that distinction rather than marking the whole answer simply wrong.

For diagnoses, require only what the evidence supports. Do not force subtype, stage, severity or etiology when not established. A correct statement of uncertainty and the next appropriate assessment may be the strongest answer. Optional Latin/local terminology should map through reviewed aliases, not brittle spelling matching.

Examples of separate notebook fields include: presenting symptom; observed finding; refractive classification; working diagnosis; differential; missing evidence; urgency; and next action. Do not train students to write a comprehensive normal examination they did not perform. Exported notes are fictional educational notes, not real clinical records or usable prescriptions.

## 11. Assessment, misconception diagnosis and retention

The learning cycle is **predict → act → observe → explain → apply to a different problem → retrieve after a delay**. Experimental work on repeated testing supports retrieval and feedback as design inputs (E1); it does not validate this app, these scheduling choices or a guaranteed examination result.

Provide different evidence channels: numerical production, visual interpretation, manipulation, procedural sequence, key-feature case decisions, short explanations, diagnosis writing, viva and conventional question formats. Include MCQs but do not make them the primary evidence for every objective. Challenge difficulty should come from a new representation, a confusable alternative, a missing datum or a deeper causal chain—not obscure vocabulary or deliberately ambiguous wording.

### 11.1 Original questions and honest exam pools

Each item must have a stable ID, version, objective IDs, family ID, mode, difficulty estimate, answer/rubric, explanation, distractor rationale where relevant, misconception links, sources and review status. Use original items. Consult the current NBME item-writing guide when available (E2); do not imply endorsement or copy protected question banks.

A question family is a reasoning structure, not an exact prompt string. Separate practice, review and unseen examination families. Changing a patient's name or a cylinder value does not make a memorized family an independent transfer test. Show the actual available pool and warn when the requested mock exam exceeds it. Do not manufacture “unseen” status by silently recycling.

Mock-exam settings must include selected lectures, objective weighting, modalities, count, timing, whether prior families are allowed, and scoring policy. Defaults are application choices. Timed exams may provide approved accommodations and pause rules. Learning-mode timing must not punish slower readers or users of assistive technology.

During an exam, withhold corrective feedback until submission at the appropriate section boundary. Do not let a later task reveal an earlier answer before it is submitted. Use a reproducible exam snapshot and persist interrupted sessions. Since the learner owns the browser, do not market this as tamper-resistant professional proctoring.

### 11.2 Specific error diagnosis

At minimum define stable misconception IDs for: cylinder axis versus power meridian; sphere contribution forgotten; principal power copied as cylinder; incorrect sign-only transposition; missed axis rotation; zero-cylinder axis treated as meaningful; SE mistaken for equivalent correction; only two oblique samples treated as a full prescription; simple versus compound astigmatism; mixed astigmatism despite zero SE; prescription versus disease diagnosis; gross versus net retinoscopy; double working-distance subtraction; streak versus measured meridian; plus/minus JCC convention; afferent versus efferent pupil defect; phoria versus tropia; visual field versus retina coordinates; IOP versus glaucoma diagnosis; and a test finding mistaken for certainty.

Feedback must identify the learner's actual error. In optics, compare the proposal and target models and expose the meridian where they differ. In clinical cases, show the missing or contradictory evidence. Never paste a generic explanation unrelated to the submitted answer.

Use a three-stage hint ladder: direct attention to the relevant relationship; reveal one intermediate step; demonstrate a worked solution. Record hint use. An assisted correction is progress, but not independent mastery. Offer a near-transfer problem immediately after correction and a different representation later.

The personal error notebook records the submitted answer, model/case state, confidence, misconception, explanation, hint level, source and next review. A corrected item must preserve the original attempt. Allow students to flag ambiguous questions; disputed items can be quarantined from scoring until resolved.

### 11.3 A transparent evidence model

Track explanation, application and delayed retention separately. Proposed learner statuses: not attempted, practicing, immediate check passed, delayed check passed, transfer demonstrated and needs review. Viewing a lesson, dragging a slider or collecting points must never count as demonstrated understanding.

Use configurable, transparent starting policies rather than a fake scientifically precise mastery algorithm. For example, require unhinted success across multiple families and at least two task types, a transfer problem, and successful later review before showing strong evidence. The exact number of items, delay and pass threshold are product hypotheses to evaluate, not universal facts.

Scheduling may use a maintained spaced-repetition implementation behind an adapter after verifying its current API. Separate factual-card scheduling from complex skill/case evidence. A scheduler's estimated recall probability is not a probability of passing an ophthalmology examination. Use controlled-clock tests, stable time-zone handling and a manageable daily workload.

Confidently wrong answers should trigger contrasting cases and explanation. Correct-but-unsure answers should reinforce discrimination. Correct-with-help answers need independent retry. A failed delayed check should reduce the evidence status and create targeted review without shaming the learner or deleting prior progress.

Show selected coverage, unresolved misconceptions, immediate versus delayed results, unseen-family performance and missing evidence. Do not display an invented chance of scoring 10/A/100%. Offer short review sessions and recovery plans after missed days. Exam-date compression can alter practice frequency but cannot manufacture evidence of long-term retention overnight.

### 11.4 Free responses and optional tutor

Use deterministic numerical graders and transparent structured clinical rubrics first. Never treat keyword presence as a reliable free-text clinical grader: negation, contradictory statements and unsupported additions matter. An offline viva can let the learner reveal the rubric, compare their reasoning and record self-assessed evidence explicitly as self-assessed.

An optional AI tutor must retrieve the relevant source-checked content, expose uncertainty and distinguish formative feedback from authoritative scoring. It must not invent patient findings, sources, reviewer approval or new drug regimens. Core learning, grading, review and exam functions must work without any paid API or AI account. Audio is optional, with text alternatives and a clear data path.

## 12. Visual design, scientific animation and game structure

Design a restrained, premium teaching instrument: clear hierarchy, readable type, generous space, precise numerical typography and one dominant problem per screen. Keep navigation quiet and the laboratory canvas large. Prefer a bright, comfortable study surface with an optional darker instrument mode. Clinical photographs must preserve diagnostic colors and must not be recolored for branding.

Use a consistent visual grammar for inputs, hidden targets, learner proposals, measured observations and feedback. Do not rely on color alone. Keep signs, units, laterality, axes and reference planes visible. Use tabular numbers for prescriptions and measurements. Explain every abbreviation on demand.

The initial screen should invite a concrete action such as “Solve this lens” or “Examine this patient,” not force a marketing tour or giant rotating 3D eye. No fake endorsements, testimonials, grade guarantees or university affiliations. Avoid excessive glass effects, tiny pastel labels, ornate dashboards, scroll hijacking and permanent background motion.

Scientific animation must show causal changes. Provide pause, reset, step forward/backward, speed control and meaningful scrubbing. A paused or scrubbed state must agree with the domain model. During cylinder transposition, the physical lens-power distribution must stay unchanged. During a cover test, the occlusion and observed eye must remain unambiguous throughout the motion.

Treat native SVG as the default for labeled mechanisms and diagrams. Use Canvas only when computational image/ray work justifies it. Add 3D only for a spatial relationship that students actually need to rotate, with a 2D fallback. Optional authored videos may use suitable tools, but video cannot replace instrument control or answer production.

Use Motion or native transitions for presentation, not as the clinical state engine. Respect reduced-motion settings and provide equivalent discrete states. W3C's interaction-animation criterion is Level AAA; target WCAG 2.2 AA plus this additional reduced-motion behavior rather than claiming this particular criterion is AA. See T3.

Test keyboard-only operation, visible focus, touch controls, non-drag alternatives, zoom, narrow screens, dark mode where offered, long terminology, minus signs, degree symbols and numerical input. Accessibility must preserve the educational problem without revealing the answer. Provide descriptive alternatives for visual tasks while acknowledging when the learning objective is specifically image recognition.

Use mission-based progression: discover a mechanism, solve a case, correct a misconception, return for a later check and pass a new challenge. Rewards should recognize learning evidence, not rapid clicking. No energy meters, pay-to-retry, punitive streak resets, compulsory leaderboards or forced confetti. Let users disable celebrations and sound. A clinic progression map can show meaningful competence milestones without pretending to award professional qualification.

## 13. Engineering architecture and durable learner data

Use a simple, coherent TypeScript architecture. For an empty repository, React with Vite is a reasonable default; preserve a sound existing framework. Choose compatible dependencies, verify installed APIs against current official docs, commit the lockfile and document setup. Do not introduce a backend, microservices or a large 3D engine before a real requirement exists.

Separate modules for: units and coordinates; optical mathematics; simulation state machines; case definitions; observations; content schemas; answer grading; misconception feedback; review scheduling; persistence; and rendering. A simulation must be reproducible from a definition version, validated parameters, seed, action history and timeline position.

Suggested conceptual entities:

```text
Lecture / Objective / LessonBlock / SourceClaim / Asset
SimulationDefinition / InstrumentState / ScenarioDefinition
PatientState / ExamAction / Observation / LearnerAssessment
Question / QuestionFamily / AnswerRubric / Attempt
Misconception / ReviewState / StudyPlan / Profile / ExportBundle
```

Use runtime validation as well as static types. Distinguish diopters, prism diopters, degrees, metres, millimetres and mmHg through named fields and conversion helpers. A `PatientState` must not be accidentally accepted where an `Observation` is expected. A submitted answer must not mutate the hidden target. Do not render arbitrary uploaded HTML/MDX as code.

Begin with local guest profiles and IndexedDB for substantial progress data. Small preferences may use local storage. Display that local data is not a cloud backup. Implement versioned, validated export/import, migration, duplicate-attempt prevention and recoverable save errors before describing progress as durable. Preserve event/attempt history and derive current summaries from it.

The study-plan snapshot includes selected/excluded/uncertain lectures, scope version, weights, exam settings and optional deadline. Attempts include item and content version, family, seed, response, confidence, assistance, task type, learning/exam mode and timestamps. If content corrections change scoring, preserve the original record and recompute visibly.

Core laboratory, lessons, assessment and review must work without a paid API. Cache only permitted assets and selected offline content. Show exactly what is available offline; external resources may remain unavailable. Handle no network, missing images, unavailable WebGL, quota exhaustion, private-mode storage restrictions, interrupted saves and malformed imports gracefully.

Accounts and synchronization are optional later features. Do not show a fake sign-in or cloud-sync badge. If implemented, require real authentication/authorization, ownership rules, conflict handling, deletion/export and server-side secrets. Never put private keys in frontend code. Do not collect actual patient information. Minimize learner analytics and keep sensitive optional audio out of external services without explicit consent.

For optional lecture import, start with genuine text/Markdown and validated JSON support. Add PDF/slides only when real parsers and source-location review exist. Extracted text does not establish that diagrams and equations were read correctly. Imported material creates a private draft mapped to objectives and gaps; it must not silently overwrite published medical content or the student's study scope. Display conflicts between course wording and current sources.

Performance is a measured property. Lazy-load heavy studios, stop off-screen animation, keep interactions responsive and measure representative desktop/mobile flows. Declare device/browser conditions for reported timings; do not invent frame rates or perfect accessibility scores. Use visible, recoverable loading and error states instead of silent stubs.

## 14. Content, sources, clinical review and image integrity

The source register appended below is a starting map, not complete support for every proposed activity. Before publishing an objective, explanation, numerical rule, clinical answer or management branch, attach a claim-level source and exact relevant section/page. Record title, organization/author, URL, publication/update date if available, access date, supported claim IDs and applicability. Do not treat an organization homepage as evidence for a specific assertion.

Use university/professional teaching for stable mechanisms and current authoritative guidance for time-sensitive management. Older educational material can inform scope without serving as a current treatment protocol. Where sources conflict or a simplified statement is misleading, preserve the nuance and do not score a contestable absolute as uniquely correct.

Use content states: draft, source-checked, human-review-pending, human-reviewed and quarantined. Human-reviewed requires an actual qualified reviewer, an attributable review record and permission to describe that review. AI review is not human review. A source-checked personal-study beta can be useful, but must not be marketed as clinically validated.

Create original diagrams and explanatory text. For each external image/video, record author, source, exact license/permission, allowed reuse/modification and attribution. Free online access is not redistribution permission. In particular, Moran CORE's terms restrict reuse (R1). Do not scrape its image library into this app. Link to authorized external material when embedding/rehosting is not permitted.

Do not use generated clinical photographs as diagnostic gold standards. A synthetic fundus, corneal stain, OCT or color plate must be visibly labeled as a schematic/illustration and cannot silently substitute for the authentic-image assessment pool. Do not alter a clinical image in ways that create, erase or distort diagnostic signs. Cropping, overlays and transformations require attention to both permission and educational validity.

The reference image supplied by the user motivates the original optical model; its attachment does not prove publication rights to the artwork. Recreate the mathematical relationship in original SVG rather than redistributing the image unless permission is established.

Safety-critical decisions require separate source review and regression tests. Numerical tests cannot validate a medical management protocol. A beautiful animation cannot establish physiological accuracy. Browser completion cannot establish hands-on skill. Do not bury these distinctions in a disclaimer while presenting unsupported functionality as real.

Prepare an honest educational evaluation after the software works: baseline performance, usability/task completion, independent immediate problems, delayed parallel-form tasks, and clinician review of content where available. Report uncertainty and distinguish satisfaction from learning. Do not call a few positive comments proof of superior exam performance or claim the app is better than every book.

## 15. Verification requirements and adversarial cases

Build tests before relying on the visual output. Expected values must come from fixed independently specified fixtures or a different derivation, not the same production function being tested. The companion Python reference is a useful check, not a universal oracle or clinical certification. Port it deliberately and test the actual application implementation.

### 15.1 Optical and numerical checks

Required checks include the exact supplied image values; all classification fixtures; axis periodicity; zero cylinder; plus/minus transposition and round trip; preserved full meridional distribution; full-matrix grading; explicit notation requirements; mixed astigmatism despite zero spherical equivalent; principal-power reconstruction; nonprincipal underdetermination; and invalid input handling.

Include the oblique alias regression: `plano −4 × 045` versus `plano −4 × 135` share the same horizontal/vertical sampled powers but must not grade as equivalent. At 45° their powers are 0 and −4 D. A test suite checking only 90° and 180° is insufficient.

Retinoscopy checks must include working-distance change without patient-state change, gross/net round trip, exact versus rounded distance, no double subtraction and instrument convention. JCC checks include zero mean power, equal-and-opposite principal powers and flip behavior. Same-plane lens composition must use matrices, not naive cylinder-axis arithmetic.

Reduced-eye checks must include correct neutralization by the target correction; line-focus orientation; scalar spherical focus; real/infinite/virtual cases; focal planes versus retinal position; and the circle-of-least-confusion vergence/distance distinction. If perceived blur is not physically implemented, label it conceptual and do not use it for answer grading.

### 15.2 Clinical state and content checks

Validate laterality and coordinate transforms independently: patient right/left, visual field versus retina, pupil pathways, gaze and corneal reflexes. A relative afferent defect must not be implemented as an isolated permanently dilated pupil. Cover-test steps must specify which eye is covered and which eye's movement is assessed. Field localization must not change with a CSS mirror transform.

Every case variant must pass coherence checks. Test unavailable findings, poor technique, insufficient evidence, alternative defensible answers and stopping an unsafe routine maneuver. Check that all documentation derives from obtained observations. Do not make every urgent case solvable by the same dramatic button.

Content validation must detect missing sources, undefined prerequisite IDs, orphan objectives, missing answer explanations, draft/quarantined exam leakage, unsupported management claims, missing image permissions, duplicate families and incomplete activities mislabeled as implemented. A catalog row cannot pass a release gate without its declared functional capabilities.

### 15.3 Browser and end-to-end checks

Use unit tests, component tests and a real browser automation tool available in the environment. Inspect the actual app, not only its source. Test initial, middle and final states of important scientific animations. Check pause/scrub/reset, simultaneous panels, rapid parameter changes, pointer cancellation and multiple independent laboratory instances.

Mandatory first journey: guest profile → select L05 and one clinical lecture → complete the exact cylinder mission → submit an equivalent prescription → inspect targeted feedback → solve an oblique variant → save → reload → retain the attempt → advance a controlled test clock → complete a due review → create a selected-scope exam → export → import into a fresh profile → verify scope and history.

Also test a keyboard-only and reduced-motion version of that journey, narrow-screen numerical entry, missing images, unavailable storage, malformed import, changed lecture scope, zero selected lectures, no due reviews, too few unseen families, interrupted exam, content-version correction and data migration. The application must not fabricate progress or answers to hide an error.

Measure real visual/layout issues: labels overlapping at oblique angles; plus/minus signs clipped; controls too small; hidden left/right indicators; incorrectly mirrored axes; stale predictions after state changes; and animations visually changing an equivalent lens. Do not accept a screenshot merely because it looks sophisticated.

## 16. Execution sequence and release gates

Keep a concise CLAUDE.md with repository commands, architectural conventions and links to detailed documents. Store this specification in docs and maintain `PRODUCT.md`, `SIMULATION_CONTRACTS.md`, `CONTENT_STATUS.md`, `SOURCES.md`, `TEST_PLAN.md` and `BUILD_STATUS.md`. Do not stuff the entire document into every agent's permanent context. Official Claude Code guidance emphasizes testable goals and verification feedback (T1).

Use focused subagents only when available and beneficial, with bounded responsibilities and no conflicting file ownership. Appropriate roles are optics implementation, source research, learning content, interaction design and independent test review. Their agreement is not a substitute for external clinical review. Do not invent installed skills or commands. Read actual available skills and current package documentation before use.

**Gate A: functioning foundation.** Create the source/content/attempt schemas, lecture selector, laboratory shell, basic notebook, persistence and test harness. Show truthful planned states. No placeholder can be represented as a completed lab.

**Gate B: complete optical learning journey.** Finish the exact supplied diagram, all linked representations, numerical grading, conditional refractive classification, relevant bridges, original task families, explanation, error notebook, saved attempts, review and a real small exam. Run the reference and application tests, then inspect desktop/mobile browser output. This must be a finished learning experience, not just a slider demo.

**Gate C: one coherent refraction patient.** Add retinoscopy, working-distance handling, trial lenses, JCC and documentation using shared state. Connect diagnosis and correction. Explain the model's limits and test technique-dependent observations. Extend coverage to all regular refractive categories and transfer families.

**Gate D: clinical mechanisms.** Add visual function, pupils, motility/alignment, fields, slit lamp and core interpretation. Verify laterality and clinical state transitions independently. Connect those instruments to cases and the same learner record.

**Gate E: full curriculum and selected extensions.** Complete the 36 lectures and 88 catalog entries in reviewed, tested batches, respecting source and asset availability. Build authentic-image pools only where rights and metadata permit. Complete disease, emergency, imaging, diagnosis-writing and mixed exam journeys.

**Gate F: reliability and refinement.** Finish accessibility, recovery, offline packs where permitted, genuine lecture import, performance and visual polish. Optional synchronization or AI tutoring comes after the core is dependable, not before.

These gates define build order, not permission to quietly abandon the later scope. Maintain machine-readable status per lecture, objective, laboratory and test activity: planned, implemented, tested, source-checked, human-review-pending, blocked and published as appropriate. Keep capability flags separate. Count only actual evidence.

If a session or external dependency prevents completion, leave a runnable milestone, exact commands/results, the next unresolved task and a resumable status file. Continue through unblocked work without repeatedly asking whether to proceed. Do not claim the complete clinic is done while required content is still empty or tests are failing. Missing assets or clinical review are real blockers for the affected publication mode, not reasons to fabricate content or stop unrelated engineering.

## 17. Implementation deliverables and final report

Deliver a usable repository with real run/setup instructions, pinned dependencies, original content and asset registers, validated data schemas, a full coverage matrix, independent numerical fixtures, actual test output, screenshots from real implemented journeys and documented limitations.

Report separately: implemented and tested; implemented but untested; source-checked; actually human-reviewed; missing licensed assets; blocked; and not yet implemented. State whether a browser build actually ran. Do not invent a deployment URL, test count, source approval, educator endorsement or student outcome.

The standard for completion is that a student can choose lectures, learn a mechanism, manipulate the related instrument, interpret a new finding, write a defensible answer, receive specific feedback, retain progress and succeed on a different problem after a delay. A beautiful screenshot, a menu of 88 tests or a large question count is not sufficient.

Begin with the repository audit and the exact cylinder mission. Build, test, inspect and correct each complete journey, then continue through the remaining gates.

---

## Appendix A. Source register and implementation retrieval limits

# Source register — research and implementation boundaries

Prepared 14 October 2026. URLs identify sources, not permission to republish their content. The register supports selected mechanisms and design inputs; it does **not** establish that every one of the 88 proposed activities has been researched, clinically reviewed or implemented. Every published claim and asset still needs its own support and permissions record. Verify current management and software APIs during implementation.

## Optics and refraction

**O1 — University of Iowa / EyeRounds: Introduction to Optics and Refractive Errors of the Eye.** Mark E. Wilkinson; page updated 19 October 2015. Transcript reviewed, especially slides 12–17 and 21–22. Supports principal-meridian notation, transposition, refractive categories and spherical equivalent. Use stable concepts, not every simplified model statement as a universal clinical fact. The new matrix and reduced-eye specifications include explicit original mathematical derivations; they are not copied slides.
`https://eyerounds.org/video/Refraction/Intro-Optics-Refract-Errors/index.htm`

**O2 — Thibos, Wheeler and Horner: Power vectors: an application of Fourier analysis to the description and statistical analysis of refractive error.** Optometry and Vision Science, 1997;74(6):367–375. DOI 10.1097/00006324-199706000-00019. PubMed abstract reviewed, not the full paper. Supports the three-parameter Fourier/power-vector representation and its use in comparing/composing thin spherocylindrical lenses. Coordinate conventions and reference calculations in the pack are explicit and independently tested educational derivations.
`https://pubmed.ncbi.nlm.nih.gov/9255814/`

**O3 — University of Iowa / EyeRounds: Retinoscopy.** Teaching transcript reviewed. Relevant to instrument mode, working distance, neutralization and gross/net correction. Match the simulated instrument convention explicitly. A historical description of a device is not a universal description of all instruments.
`https://eyerounds.org/video/Refraction/retinoscopy/index.htm`

**O4 — University of Iowa / EyeRounds: Subjective Refraction.** Teaching page/transcript consulted for refinement workflow. Recheck the exact cylinder convention and JCC labeling before implementing a maneuver. A virtual patient's preference function is a declared simulation assumption, not a clinically validated substitute for actual subjective responses.
`https://webeye.ophth.uiowa.edu/eyeforum/video/Refraction/subj-refract/index.htm`

## Curriculum and examination scope

**C1 — University of Iowa: Online Ophthalmology Curriculum.** University teaching curriculum, 2020; page reviewed. Provides an academic scope/reference for teaching cases, examination practice and documentation. The new 36-lecture/18-studio/88-activity organization is an original product proposal, not an official university syllabus.
`https://webeye.ophth.uiowa.edu/eyeforum/article/online-ophthalmology-curriculum/index.htm`

**C2 — University of Utah, Moran CORE: Basic Ophthalmology Review.** Topic index reviewed. Useful for discovering medical-student topics and individual teaching pages. Individual content varies in age/depth and requires claim-level checking; reading access does not grant reuse rights.
`https://morancore.utah.edu/basic-ophthalmology-review/`

**C3 — AAPOS: Educational Resources.** Official index reviewed; describes AAO's basic strabismus simulator and distinguishes the cover-test maneuvers it teaches. This establishes a useful instructional reference, not that the external simulator was fully executed, benchmarked or reproduced. The AAO basic-eye-exam page encountered access restrictions during research.
`https://www.aapos.org/resource-catalog/educational-resources`

## Selected clinical mechanisms and limitations

**K1 — Moran CORE: Relative Afferent Pupillary Defect.** Teaching page reviewed for asymmetric afferent response. Supports distinguishing afferent dysfunction from an isolated efferent pupil problem. This source does not validate a quantitative dynamic pupil model.
`https://morancore.utah.edu/basic-ophthalmology-review/relative-afferent-pupillary-defect-rapd/`

**K2 — Moran CORE: Strabismus.** Teaching page reviewed for alignment and refixation. Specify which eye is occluded and observed at every stage; cross-check any detailed quantitative prism protocol before publication.
`https://morancore.utah.edu/basic-ophthalmology-review/strabismus/`

**K3 — Stanford Neuro-Ophthalmology: Illustrated Chapter 3, Visual Fields.** University teaching page reviewed for visual-pathway localization. Keep field/retinal and patient/screen coordinates separate. Do not reproduce book figures without permission or promote historical simplifications into absolute rules.
`https://neuro-ophthalmology.stanford.edu/2018/12/neuro-ophthalmology-illustrated-chapter-3-visual-fields/`

**K4 — Moran CORE: Intraocular Pressure.** Teaching page reviewed for pressure assessment and its limitations. Pressure is not by itself a complete glaucoma diagnosis. Disease definitions, thresholds and management require current applicable sources.
`https://morancore.utah.edu/basic-ophthalmology-review/intraocular-pressure/`

**K5 — Moran CORE: How to Assess Whether a Globe Is Ruptured.** Teaching page reviewed for recognition and avoiding pressure/manipulation in suspected open-globe injury. Use as support for a limited safety principle; source-check the precise clinical pathway separately.
`https://morancore.utah.edu/basic-ophthalmology-review/how-to-assess-whether-a-globe-is-ruptured/`

**K6 — Moran CORE: Chemical Burns.** Teaching page reviewed for timely irrigation principles. Do not copy an entire regimen or generalize a simple exposure case to combined injuries. Detailed contemporary protocols and contraindications need separate review.
`https://morancore.utah.edu/basic-ophthalmology-review/chemical-burns/`

**K7 — National Eye Institute: Testing for Color Vision Deficiency.** Official patient-education page reviewed for types of evaluation. An illustrative screen exercise is not a licensed, standardized and calibrated clinical test of the learner.
`https://www.nei.nih.gov/eye-health-information/eye-conditions-and-diseases/color-blindness/testing-color-vision-deficiency`

**K8 — National Eye Institute: Presbyopia.** Official page reviewed for accommodation-related near focusing changes and coexistence with other refractive errors. This does not support determining an individual ADD from age alone.
`https://www.nei.nih.gov/eye-health-information/eye-conditions-and-diseases/presbyopia`

## Learning and assessment

**E1 — Larsen, Butler and Roediger: Repeated testing improves long-term retention relative to repeated study: a randomised controlled trial.** Medical Education, 2009; DOI 10.1111/j.1365-2923.2009.03518.x. Indexed publisher/abstract material consulted; no claim of full-paper review. Supports retrieval with feedback as a learning-design input, not the effectiveness of this app, its game mechanics or an exact mastery schedule.
`https://asmepublications.onlinelibrary.wiley.com/doi/abs/10.1111/j.1365-2923.2009.03518.x`
`https://pubmed.ncbi.nlm.nih.gov/19930508/`

**E2 — NBME: Item-Writing Guide.** Official landing page reviewed; it identifies the guide's scope and access route. The complete gated guide was not obtained. Retrieve the permitted current guide during content development; do not pretend its complete contents were reviewed or claim NBME endorsement.
`https://www.nbme.org/institutions/nbme-item-writing-guide/`

## Implementation, accessibility and rights

**T1 — Anthropic: Best practices for Claude Code.** Current official documentation reviewed. Supports explicit verification goals and iterative feedback. Available commands/tools depend on the installed environment. The specification does not claim any particular Opus version automatically creates correct medical animations.
`https://code.claude.com/docs/en/best-practices`

**T2 — Motion: Motion for React.** Official documentation reviewed as an implementation option. Use animation for presentation driven by tested state. Verify the installed version; no performance benchmark is inferred from documentation or marketing.
`https://motion.dev/docs/react`

**T3 — W3C: Understanding SC 2.3.3, Animation from Interactions.** Official accessibility explanation reviewed. This is Level AAA. The proposed target is WCAG 2.2 AA plus additional reduced-motion support, not a mislabeled AA requirement or a claim of conformance already achieved.
`https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html`

**R1 — Moran CORE: Terms of Use.** Terms reviewed; page states an update of 15 January 2025. Free reading access does not grant blanket permission to reproduce or redistribute illustrations, photographs or course content. Record permissions per asset and use lawful external references where necessary.
`https://morancore.utah.edu/terms-of-use/`

## Retrieval targets during implementation, not claims of completed review

Use the official documentation of the actual installed React, TypeScript, browser-testing, database and scheduling libraries. Verify available Claude Code skills before invoking them. Optional video/3D tooling must serve a specific learning need; do not add it solely because a social-media demonstration looked impressive.

Each advanced catalog entry still needs a precise clinical teaching source and, where relevant, current professional guidance. Particular gaps to close include detailed prism-test protocols; perimetry reliability conventions; gonioscopy; topography/tomography; biometry; imaging interpretation; electrophysiology; pharmacologic tests; microbiology; and management branches. The registry intentionally does not label these activities source-reviewed or clinically validated.

For every published claim record its source location and review status. For every asset record its separate permissions. For every simulation record its assumptions and numerical/clinical validation evidence. None of those three records substitutes for the others.
