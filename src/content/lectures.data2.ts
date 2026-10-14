import type { LectureContent } from './schema';

// Draft learning content for lectures L19–L36. All items and lectures are reviewStatus 'draft'
// and require human clinical review before use in scored assessment. No doses, regimens or
// numeric thresholds are given; time-sensitive management is described as principles only.
export const LECTURES_B: LectureContent[] = [
  {
    id: "L19",
    title: "Glaucoma",
    group: "Anterior segment",
    emphasis: "Open-angle and angle-closure mechanisms, risk, disc/field assessment and treatment principles",
    signature: "Explore aqueous flow, angle anatomy, disc and fields",
    prerequisites: ["L02", "L11", "L12"],
    studios: ["LAB10", "LAB07", "LAB11", "LAB12", "LAB17"],
    activities: ["T039", "T045", "T055", "T056", "T057", "T058", "T059", "T060", "T065", "T067"],
    estMinutes: 55,
    objectives: [
      { id: "L19-O1", text: "Explain how aqueous production and outflow determine intraocular pressure, and contrast the open-angle and angle-closure mechanisms." },
      { id: "L19-O2", text: "Describe the optic-disc and visual-field changes of glaucomatous optic neuropathy and explain why they must correspond." },
      { id: "L19-O3", text: "Explain why a single intraocular pressure value can neither diagnose nor exclude glaucoma." },
      { id: "L19-O4", text: "Recognise acute angle closure as an emergency and state the principles of urgent management and safe examination." },
      { id: "L19-O5", text: "Match the main treatment classes (medical, laser, surgical) to the part of the aqueous pathway they act on." }
    ],
    bridge: "L02 described aqueous made by the ciliary body, flowing through the pupil into the anterior chamber and leaving through the trabecular meshwork and the uveoscleral route. L11 showed how nerve-fibre damage maps to field defects, and L12 introduced tonometry and gonioscopy. Glaucoma joins these: a characteristic optic neuropathy in which pressure is the main modifiable risk factor.",
    essentials: [
      "Glaucoma is a progressive optic neuropathy: retinal ganglion cell axons are lost, the neuroretinal rim thins, the cup enlarges and matching visual-field defects develop.",
      "Intraocular pressure reflects the balance between aqueous production and outflow. Raised pressure is the major modifiable risk factor, but glaucoma can occur with pressures in the usual population range, and many people with raised pressure never develop glaucoma.",
      "Primary open-angle glaucoma is usually painless and asymptomatic until late; peripheral field is lost first while central acuity is often preserved, which is why case finding and examination of the disc matter.",
      "In angle closure the peripheral iris blocks the trabecular meshwork. Acute angle closure causes a painful red eye, blurred vision with haloes, headache, nausea, a hazy cornea and a mid-dilated, poorly reactive pupil: an emergency needing immediate ophthalmic care.",
      "Diagnosis combines disc appearance, field testing, pressure, angle assessment and often imaging (RNFL OCT). No single test establishes the diagnosis.",
      "Treatment lowers pressure by reducing aqueous production or increasing outflow, with drops, laser or surgery. Lost nerve fibres do not recover, so the aim is to slow or stop further loss."
    ],
    full: [
      "Mechanism: aqueous is secreted by the ciliary epithelium into the posterior chamber, passes through the pupil and drains mainly via the trabecular meshwork into Schlemm's canal, with a smaller uveoscleral component. Pressure rises if outflow resistance increases (as in open-angle glaucoma, where the angle looks open on gonioscopy) or if the route to the meshwork is physically blocked by iris (angle closure).",
      "Angle closure most often follows relative pupil block: resistance to flow through the pupil lets pressure build behind the iris, which bows forward and closes a narrow angle. Risk features include hyperopia (a shorter eye with a crowded anterior segment), increasing age as the lens enlarges, and certain ancestries. Pupil dilation, for example in dim light or with dilating drops, can precipitate an attack in a predisposed eye.",
      "Presentation: open-angle glaucoma is typically silent and found on examination; angle closure may be acute (severe pain, haloes, systemic upset) or intermittent and subacute, or chronic and painless. Secondary glaucomas arise from another cause, such as steroid use, inflammation, pigment dispersion, pseudoexfoliation, trauma or neovascularisation.",
      "Signs: the disc shows thinning or notching of the neuroretinal rim (classically at the superior and inferior poles), an enlarged or asymmetric cup, disc haemorrhages, and loss of the nerve fibre layer. Fields show defects that follow nerve-fibre arcs: nasal steps, paracentral and arcuate scotomas that respect the horizontal midline. Structure and function should correspond; a mismatch prompts a search for another cause.",
      "Tests and interpretation: tonometry (Goldmann applanation is the usual reference) measures pressure at one moment and is influenced by corneal properties and technique. Gonioscopy determines whether the angle is open or closed and is essential for classifying mechanism; Van Herick estimation is a screening aid, not a replacement. RNFL OCT and standard automated perimetry document structure and function and are compared over time to detect progression, always checking reliability and image quality.",
      "Differential: large physiological cups (often in large discs, symmetrical, with a healthy rim), optic nerve compression, previous ischaemic optic neuropathy and other causes of disc pallor can mimic glaucomatous cupping. Pallor of the remaining rim out of proportion to cupping should raise suspicion of a non-glaucomatous cause.",
      "Urgency and management principles: suspected acute angle closure needs immediate same-day ophthalmic care to lower pressure and then relieve pupil block, typically with laser peripheral iridotomy, and the fellow eye is assessed because it is often at risk. Chronic open-angle glaucoma is managed with a target-based plan agreed by the specialist, monitored with repeated fields, imaging and pressures, with attention to adherence and side effects.",
      "Documentation: record pressure with method, time and eye; angle findings with the grading system used; disc description (cup, rim, haemorrhage) for each eye; field test type and reliability; and the provisional diagnosis with its supporting evidence."
    ],
    deeper: [
      "Central corneal thickness influences applanation readings: thinner corneas tend to give lower readings and thicker corneas higher readings. Thin corneas are also associated with glaucoma risk in some studies. No universal correction formula should be applied to individual readings.",
      "Normal-tension glaucoma describes glaucomatous neuropathy without documented raised pressure; it remains pressure-sensitive in many patients but prompts consideration of vascular factors and of compressive or other optic neuropathies.",
      "Pressure fluctuates through the day, so one normal reading may miss periods of elevation; conversely, isolated ocular hypertension carries a risk that is assessed and monitored rather than treated as established disease automatically."
    ],
    misconceptions: [
      "Mistake: a normal pressure rules out glaucoma. Correction: glaucoma is diagnosed from the optic nerve and corresponding field; it can occur with pressures in the usual range.",
      "Mistake: raised pressure equals glaucoma. Correction: ocular hypertension without optic neuropathy is a risk state, not established glaucoma.",
      "Mistake: glaucoma causes early loss of central vision that the patient will notice. Correction: open-angle glaucoma usually affects peripheral field first and is often asymptomatic until advanced.",
      "Mistake: dilating drops are always safe for a better view. Correction: in an eye with a narrow angle, dilation can precipitate angle closure; assess the angle and risk first."
    ],
    entryChallenge: {
      prompt: "Name the two main outflow routes for aqueous and the structure that blocks them in angle closure.",
      answer: "The trabecular meshwork to Schlemm's canal (conventional) and the uveoscleral route; in angle closure the peripheral iris covers the trabecular meshwork."
    },
    contrast: {
      a: "Primary open-angle glaucoma: painless, open angle on gonioscopy, gradual rim thinning with arcuate field loss, often found on routine examination.",
      b: "Acute angle closure: painful red eye, haloes, nausea, hazy cornea, mid-dilated poorly reactive pupil, closed angle and markedly raised pressure.",
      discriminator: "Gonioscopic angle status and the acute symptom complex; the open-angle disease is silent, the acute closure is an emergency."
    },
    workedExample: {
      problem: "A 63-year-old has a pressure in the usual range in both eyes on one visit. The right disc shows an inferior rim notch and a disc haemorrhage; automated perimetry shows a superior arcuate defect in the right eye with acceptable reliability. Interpret.",
      steps: [
        "Structure: inferior rim notch and disc haemorrhage suggest glaucomatous damage at the inferior pole.",
        "Function: inferior disc damage affects inferior retinal fibres, which serve the superior field; a superior arcuate defect therefore corresponds.",
        "Pressure: a single reading in the usual range does not exclude glaucoma and pressure fluctuates.",
        "Check: confirm angle status with gonioscopy, repeat pressures, image the RNFL and consider non-glaucomatous causes if anything does not fit.",
        "Assessment: suspected right open-angle glaucoma (possibly normal-tension), for specialist confirmation and management planning."
      ]
    },
    transfer: {
      prompt: "Draw the aqueous pathway as a flow diagram from ciliary body to venous drainage. Mark where pupil block, trabecular resistance and a laser iridotomy act.",
      modelAnswer: "Ciliary body → posterior chamber → pupil → anterior chamber → trabecular meshwork → Schlemm's canal → aqueous and episcleral veins, with a side branch through the ciliary muscle (uveoscleral). Pupil block acts at the pupil; open-angle resistance at the meshwork; an iridotomy creates a bypass from posterior to anterior chamber through the peripheral iris."
    },
    items: [
      {
        id: "Q-L19-01", version: 1, objectiveIds: ["L19-O3"], familyId: "F-L19-iop-diagnosis", pool: "practice", difficulty: 2,
        stem: "A patient has a cupped disc with an inferior rim notch and a matching superior arcuate field defect. Today's pressure is in the usual population range. Which statement is correct?",
        options: ["Glaucoma is excluded because the pressure is normal", "Glaucoma remains likely; the disc and field findings matter more than one pressure reading", "The findings must be artefact because pressure is normal", "Only a repeat pressure is needed before discharge"],
        answerIndex: 1,
        explanation: "Glaucoma is defined by optic neuropathy with corresponding field loss. Pressure varies and glaucoma can occur within the usual range, so a single value cannot exclude it.",
        distractorRationale: ["Pressure alone does not exclude glaucoma.", "", "Corresponding structure and function argue against artefact.", "Discharging on a pressure reading ignores the disc and field evidence."],
        misconceptionIds: ["M-IOP-AS-GLAUCOMA"], sources: ["K4", "C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L19-02", version: 1, objectiveIds: ["L19-O1"], familyId: "F-L19-angle-mechanism", pool: "practice", difficulty: 2,
        stem: "In relative pupil block, why does the angle close?",
        options: ["The trabecular meshwork thickens", "Aqueous production stops", "Pressure behind the iris pushes the peripheral iris forward against the meshwork", "The lens moves backward"],
        answerIndex: 2,
        explanation: "Resistance at the pupil lets aqueous accumulate in the posterior chamber; the peripheral iris bows forward and closes a narrow angle.",
        distractorRationale: ["Meshwork resistance describes open-angle disease.", "Production continues; that is why pressure rises.", "", "Forward, not backward, lens-iris crowding contributes."],
        misconceptionIds: [], sources: ["C1", "C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L19-03", version: 1, objectiveIds: ["L19-O2"], familyId: "F-L19-disc-signs", pool: "practice", difficulty: 1,
        stem: "Which disc finding most supports glaucomatous optic neuropathy?",
        options: ["Focal thinning (notching) of the neuroretinal rim at a pole", "A large disc with a proportionally large cup and a healthy pink rim in both eyes", "Diffuse pallor of the rim with little cupping", "Blurred disc margins with elevated disc"],
        answerIndex: 0,
        explanation: "Glaucoma thins the rim, often first at the superior and inferior poles. Cup size must be judged relative to disc size and rim health.",
        distractorRationale: ["", "This pattern suggests a physiological large cup.", "Pallor out of proportion to cupping suggests a non-glaucomatous neuropathy.", "Elevation and blurred margins suggest disc swelling."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L19-04", version: 1, objectiveIds: ["L19-O2"], familyId: "F-L19-field-pattern", pool: "practice", difficulty: 2,
        stem: "Which field pattern is most typical of early glaucoma?",
        options: ["Bitemporal hemianopia", "Homonymous hemianopia respecting the vertical midline", "Central scotoma with normal periphery", "A nasal step or arcuate defect respecting the horizontal midline"],
        answerIndex: 3,
        explanation: "Ganglion cell axons arc around the fovea and meet at the temporal horizontal raphe, so glaucomatous loss follows arcs and respects the horizontal midline.",
        distractorRationale: ["Bitemporal loss localises to the chiasm.", "Homonymous loss localises behind the chiasm.", "Central scotoma suggests macular or optic neuritis-type disease.", ""],
        misconceptionIds: ["M-FIELD-VS-RETINA"], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L19-05", version: 1, objectiveIds: ["L19-O4"], familyId: "F-L19-acute-closure-priority", pool: "exam", difficulty: 2,
        stem: "A hyperopic 68-year-old has a painful red eye, haloes, vomiting, a hazy cornea and a mid-dilated, poorly reactive pupil. Which action is inappropriate?",
        options: ["Arrange immediate same-day ophthalmic assessment", "Check acuity and the fellow eye's angle", "Instil dilating drops to examine the fundus", "Measure pressure"],
        answerIndex: 2,
        explanation: "This is suspected acute angle closure. Dilation can worsen closure; management focuses on urgent pressure lowering and then relieving pupil block, with assessment of the fellow eye.",
        distractorRationale: ["Immediate ophthalmic care is appropriate.", "The fellow eye is often at risk and needs assessment.", "", "Pressure measurement supports the diagnosis and is appropriate here (no open-globe concern)."],
        misconceptionIds: [], sources: ["C1", "C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L19-06", version: 1, objectiveIds: ["L19-O5", "L19-O1"], familyId: "F-L19-treatment-mechanism", pool: "exam", difficulty: 2,
        stem: "How does a laser peripheral iridotomy help in pupil-block angle closure?",
        options: ["It reduces aqueous production by the ciliary body", "It creates an opening in the peripheral iris so aqueous bypasses the pupil, letting the iris fall back", "It opens Schlemm's canal directly", "It shrinks the lens"],
        answerIndex: 1,
        explanation: "An iridotomy equalises pressure between posterior and anterior chambers, relieving forward bowing of the iris and reopening an appositionally closed angle.",
        distractorRationale: ["That is the action of some drops or cyclodestructive procedures.", "", "Iridotomy acts at the iris, not the canal.", "The lens is unchanged by iridotomy; lens extraction is a separate option."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      }
    ],
    sources: ["K4", "C1", "C2"],
    reviewStatus: "draft"
  },
  {
    id: "L20",
    title: "Diabetic and hypertensive eye disease",
    group: "Posterior segment",
    emphasis: "Retinal findings, staging principles, macular involvement and systemic context",
    signature: "Identify findings and grade only when sufficient evidence exists",
    prerequisites: ["L01", "L12"],
    studios: ["LAB11", "LAB12", "LAB18"],
    activities: ["T062", "T063", "T065", "T066", "T068", "T070"],
    estMinutes: 50,
    objectives: [
      { id: "L20-O1", text: "Identify and explain the mechanism of microaneurysms, haemorrhages, hard exudates, cotton-wool spots, venous beading and neovascularisation." },
      { id: "L20-O2", text: "Distinguish non-proliferative from proliferative diabetic retinopathy and explain why macular oedema is assessed separately." },
      { id: "L20-O3", text: "Describe hypertensive retinal changes and recognise findings that indicate a hypertensive emergency." },
      { id: "L20-O4", text: "Given a limited image or examination, state whether the evidence is sufficient to grade retinopathy and what is missing." }
    ],
    bridge: "L01 described the retinal circulation and layers; L12 introduced ophthalmoscopy and fundus imaging. Diabetes damages retinal capillaries, causing leakage and closure; hypertension damages arterioles. Both are visible signs of systemic vascular disease in a tissue we can inspect directly.",
    essentials: [
      "Diabetic retinopathy results from microvascular damage: leaky capillaries cause haemorrhages, exudates and oedema; closed capillaries cause ischaemia that drives new vessel growth.",
      "Non-proliferative retinopathy includes microaneurysms, dot and blot haemorrhages, hard exudates and cotton-wool spots, with venous beading and intraretinal microvascular abnormalities indicating more severe ischaemia.",
      "Proliferative retinopathy is defined by neovascularisation (on the disc, elsewhere on the retina or on the iris). New vessels can bleed into the vitreous or contract and cause tractional detachment.",
      "Diabetic macular oedema can occur at any stage and is a major cause of reduced central vision; OCT shows retinal thickening and fluid.",
      "Retinopathy is often asymptomatic until advanced, which is why people with diabetes are offered regular retinal screening; good acuity does not exclude sight-threatening disease.",
      "Hypertensive retinopathy shows arteriolar narrowing, arteriovenous crossing changes, flame haemorrhages and cotton-wool spots. Bilateral disc swelling with these signs in severely raised blood pressure is a medical emergency."
    ],
    full: [
      "Mechanism: chronic hyperglycaemia damages pericytes and capillary basement membrane. Weakened walls bulge as microaneurysms; leakage of plasma lipids leaves hard exudates; deeper intraretinal bleeds appear as dot and blot haemorrhages. Capillary closure produces ischaemia, nerve fibre layer infarcts (cotton-wool spots) and release of vascular growth factors such as VEGF.",
      "Progression: as ischaemia increases, veins become beaded and intraretinal microvascular abnormalities appear. Growth factor drive leads to neovascularisation of the disc or elsewhere and occasionally the iris and angle, where it can cause neovascular glaucoma. Fragile new vessels bleed into the vitreous; their fibrous component can contract and pull the retina off.",
      "Macular involvement: leakage near the fovea thickens the retina (macular oedema) and can reduce acuity at any stage of retinopathy. Macular ischaemia can also reduce vision and is not reversed by treating oedema. Oedema is therefore recorded separately from the retinopathy grade.",
      "Examination and tests: dilated fundus examination or retinal photography covering an adequate field is the basis of grading; OCT assesses macular thickness and fluid; fluorescein angiography shows leakage, non-perfusion and neovascular activity when needed; OCT angiography shows flow without dye but not leakage.",
      "Hypertensive changes: chronic hypertension narrows and stiffens arterioles, producing focal or generalised narrowing and changes where arteries cross veins. Acute severe hypertension can cause flame haemorrhages, cotton-wool spots, exudates and disc swelling. Hypertension also increases the risk of retinal vein and artery occlusions (L22).",
      "Differential: retinal haemorrhages and cotton-wool spots also occur in vein occlusion (usually one eye, one distribution), anaemia, leukaemia, HIV retinopathy and radiation retinopathy. Distribution, laterality and systemic context help separate them.",
      "Urgency and management principles: proliferative disease with haemorrhage or traction, and centre-involving oedema with reduced vision, need prompt specialist assessment. Treatments include intravitreal anti-VEGF therapy, laser photocoagulation and vitrectomy. Systemic control of glucose, blood pressure and lipids is shared with the patient's medical team. Severe hypertension with disc swelling requires urgent medical assessment.",
      "Documentation: record each eye separately, the field examined (and whether the periphery was seen), lesion types and their locations relative to the fovea and disc, presence or absence of new vessels and macular oedema, and the grading scheme used if a grade is assigned."
    ],
    deeper: [
      "Formal grading systems define stages using combinations of lesion types and their distribution across standard fields. Applying them requires the specified field coverage; a single small image may under-call severity because peripheral new vessels or venous beading are outside the frame.",
      "Retinopathy can worsen in pregnancy and sometimes after rapid improvement in glucose control, so such periods may justify closer retinal monitoring according to local guidance.",
      "Hard exudates often form rings (circinate patterns) around a leaking focus; their position relative to the fovea matters more for vision than their number."
    ],
    misconceptions: [
      "Mistake: normal acuity means no sight-threatening retinopathy. Correction: proliferative disease and some oedema can be present with good acuity; that is why screening is offered.",
      "Mistake: one central photograph is enough to stage retinopathy. Correction: grading requires adequate field coverage; peripheral lesions may be missed and the record should say what was not seen.",
      "Mistake: cotton-wool spots are exudates. Correction: cotton-wool spots are nerve fibre layer infarcts; hard exudates are lipid deposits from leakage."
    ],
    entryChallenge: {
      prompt: "Which single type of lesion separates proliferative from non-proliferative diabetic retinopathy?",
      answer: "Neovascularisation (new vessels on the disc, elsewhere on the retina or on the iris)."
    },
    contrast: {
      a: "Hard exudate: yellow, sharply defined lipid deposit in the outer retina from vascular leakage.",
      b: "Cotton-wool spot: pale, fluffy, ill-defined swelling in the nerve fibre layer from local ischaemia.",
      discriminator: "Mechanism and edge: leakage leaves crisp yellow lipid; ischaemia produces a fluffy white infarct."
    },
    workedExample: {
      problem: "A 50-year-old with type 2 diabetes has acuity that is normal in both eyes. A single macula-centred photograph of the left eye shows scattered microaneurysms and two blot haemorrhages. The periphery was not imaged. What can be concluded?",
      steps: [
        "Describe: microaneurysms and blot haemorrhages indicate diabetic retinopathy is present.",
        "Coverage: the periphery was not seen, so new vessels or venous beading outside the frame cannot be excluded.",
        "Macula: normal acuity does not exclude oedema; OCT or stereoscopic assessment would be needed.",
        "Conclusion: retinopathy present; final grade not assignable from this evidence.",
        "Next step: complete dilated examination or wider-field imaging of both eyes, and document what was and was not examined."
      ]
    },
    transfer: {
      prompt: "Draw a cause-and-effect chain from capillary closure to vitreous haemorrhage, naming each visible sign along the way.",
      modelAnswer: "Capillary closure → retinal ischaemia (cotton-wool spots, venous beading, IRMA) → growth factor release → neovascularisation of disc or elsewhere → fragile vessels bleed → vitreous haemorrhage (and fibrovascular contraction can cause tractional detachment)."
    },
    items: [
      {
        id: "Q-L20-01", version: 1, objectiveIds: ["L20-O1"], familyId: "F-L20-lesion-id", pool: "practice", difficulty: 1,
        stem: "A fluffy, pale, ill-defined superficial retinal lesion in a patient with diabetes most likely represents:",
        options: ["A hard exudate", "A drusen deposit", "A cotton-wool spot from nerve fibre layer ischaemia", "A microaneurysm"],
        answerIndex: 2,
        explanation: "Cotton-wool spots are swellings of the nerve fibre layer caused by local ischaemia; they have soft, fluffy edges.",
        distractorRationale: ["Hard exudates are crisp yellow lipid deposits.", "Drusen are deposits beneath the RPE, typical of age-related macular change.", "", "Microaneurysms are small red dots."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L20-02", version: 1, objectiveIds: ["L20-O2"], familyId: "F-L20-proliferative-sign", pool: "practice", difficulty: 1,
        stem: "Which finding defines proliferative diabetic retinopathy?",
        options: ["Hard exudates near the fovea", "Neovascularisation of the disc", "Dot haemorrhages in four quadrants", "Macular oedema on OCT"],
        answerIndex: 1,
        explanation: "New vessel growth driven by ischaemia defines proliferative disease. Exudates and oedema indicate leakage and can occur at any stage.",
        distractorRationale: ["Exudates reflect leakage, not proliferation.", "", "Haemorrhages indicate non-proliferative severity.", "Oedema is assessed separately and can occur at any stage."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L20-03", version: 1, objectiveIds: ["L20-O2"], familyId: "F-L20-macular-oedema", pool: "practice", difficulty: 2,
        stem: "A patient with only a few microaneurysms complains of blurred central vision. OCT shows central retinal thickening with intraretinal fluid. What is the best interpretation?",
        options: ["Macular oedema can be present at any stage of retinopathy and explains the blur", "Oedema is impossible without proliferative disease", "The blur must be refractive", "OCT findings are irrelevant if retinopathy is mild"],
        answerIndex: 0,
        explanation: "Macular oedema is graded separately because it can occur with mild retinopathy and directly affects central vision.",
        distractorRationale: ["", "Oedema does not require proliferation.", "The structural change on OCT explains the symptom.", "Oedema determines visual prognosis and management regardless of retinopathy grade."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L20-04", version: 1, objectiveIds: ["L20-O3"], familyId: "F-L20-hypertensive", pool: "practice", difficulty: 2,
        stem: "A patient with headache has bilateral disc swelling, flame haemorrhages and cotton-wool spots, and a very high blood pressure reading. What is the priority?",
        options: ["Routine retinal review", "Glasses check", "Topical eye drops only", "Urgent medical assessment for a hypertensive emergency"],
        answerIndex: 3,
        explanation: "These signs in severely raised blood pressure indicate target-organ damage; systemic assessment is urgent. Other causes of disc swelling are also considered.",
        distractorRationale: ["This is not routine.", "This is not a refractive problem.", "The problem is systemic, not topical.", ""],
        misconceptionIds: [], sources: ["C1", "C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L20-05", version: 1, objectiveIds: ["L20-O4"], familyId: "F-L20-grade-insufficient", pool: "exam", difficulty: 3,
        stem: "Only a single macula-centred photograph of one eye is available. It shows microaneurysms and haemorrhages; the periphery is not imaged. What is the most defensible record?",
        options: ["Mild non-proliferative retinopathy, no further imaging needed", "Proliferative retinopathy", "Retinopathy present; grade cannot be assigned without adequate field coverage and the other eye", "No retinopathy"],
        answerIndex: 2,
        explanation: "Lesions are present, but grading needs the specified field coverage and both eyes. Peripheral new vessels or venous beading may lie outside the frame.",
        distractorRationale: ["The image cannot exclude more severe peripheral disease.", "No neovascularisation is seen.", "", "Lesions are clearly present."],
        misconceptionIds: ["M-FINDING-AS-CERTAINTY"], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L20-06", version: 1, objectiveIds: ["L20-O2", "L20-O1"], familyId: "F-L20-screening-asymptomatic", pool: "exam", difficulty: 2,
        stem: "Why are people with diabetes offered regular retinal screening even when they see well?",
        options: ["Because acuity tests are unreliable in diabetes", "Because sight-threatening retinopathy can be present before symptoms, when treatment is most useful", "Because screening replaces glucose control", "Because all patients develop proliferative disease"],
        answerIndex: 1,
        explanation: "Proliferative disease and some oedema can be asymptomatic; detecting them earlier allows treatment before irreversible loss.",
        distractorRationale: ["Acuity is valid but insensitive to peripheral disease.", "", "Systemic control remains essential.", "Many patients never develop proliferative disease."],
        misconceptionIds: [], sources: ["C1", "C2"], reviewStatus: "draft"
      }
    ],
    sources: ["C1", "C2"],
    reviewStatus: "draft"
  },
  {
    id: "L21",
    title: "Macula and age-related disease",
    group: "Posterior segment",
    emphasis: "Dry/wet AMD, edema, epiretinal membrane, macular hole and metamorphopsia",
    signature: "Correlate fundus, OCT and symptoms",
    prerequisites: ["L01", "L07", "L20"],
    studios: ["LAB11", "LAB12", "LAB04"],
    activities: ["T001", "T010", "T065", "T066", "T068", "T069", "T070", "T071"],
    estMinutes: 50,
    objectives: [
      { id: "L21-O1", text: "Distinguish non-neovascular (dry) from neovascular (wet) age-related macular degeneration by mechanism, tempo and signs." },
      { id: "L21-O2", text: "Explain why metamorphopsia and central scotoma localise to the macula, and the limits of Amsler testing." },
      { id: "L21-O3", text: "Identify epiretinal membrane and full-thickness macular hole from symptoms and OCT appearance." },
      { id: "L21-O4", text: "State which presentations of macular disease need urgent assessment and the treatment principles involved." }
    ],
    bridge: "L07 linked central acuity to the fovea; L20 introduced macular oedema and OCT. The macula is where cones are densest, so small structural changes produce disproportionate symptoms: blur, distortion and central missing areas. OCT shows the layers directly.",
    essentials: [
      "Age-related macular degeneration (AMD) involves the photoreceptors, retinal pigment epithelium (RPE), Bruch's membrane and choriocapillaris. Drusen (deposits beneath the RPE) are the hallmark of early disease.",
      "Non-neovascular (dry) AMD progresses slowly; advanced disease forms geographic atrophy with gradual central loss.",
      "Neovascular (wet) AMD occurs when abnormal vessels grow beneath or into the retina and leak or bleed, causing relatively sudden distortion or central blur. It needs prompt specialist assessment because treatment with intravitreal anti-VEGF can limit loss.",
      "Metamorphopsia (straight lines looking bent) indicates distortion of the photoreceptor layer and is a classic macular symptom.",
      "An epiretinal membrane is a thin fibrocellular sheet on the inner retinal surface that wrinkles the macula and causes distortion; a macular hole is a full-thickness defect at the fovea causing a central scotoma.",
      "OCT is the key test to correlate symptoms with structure; an Amsler grid can detect some distortion but a normal result does not exclude macular disease."
    ],
    full: [
      "Mechanism of AMD: age-related changes in the RPE and Bruch's membrane impair support of photoreceptors. Drusen accumulate between the RPE and Bruch's membrane; pigment changes follow. In atrophic disease, RPE and photoreceptors are lost in patches that can expand. In neovascular disease, growth factors (notably VEGF) drive new vessels from the choroid or retinal circulation, which leak fluid and blood.",
      "Presentation: dry AMD causes gradual difficulty reading, needing more light and slower dark adaptation. Wet AMD often presents with new distortion, a central smudge or a sudden drop in acuity in one eye; the fellow eye may already be affected. Risk factors include age, smoking and family history.",
      "Signs: drusen and pigment change; in wet disease, subretinal fluid, haemorrhage, exudate or a grey-green membrane may be visible. Signs may be subtle, so symptoms plus OCT drive the assessment.",
      "Tests and interpretation: OCT shows drusen as RPE elevations, fluid within or beneath the retina, and atrophy. Fluorescein angiography and indocyanine-green angiography characterise leakage and choroidal lesions; OCT angiography shows abnormal flow without dye but cannot show leakage. Fundus autofluorescence maps RPE health and the extent of atrophy.",
      "Epiretinal membrane and macular hole: a membrane contracts on the retinal surface, causing wrinkling, thickening and distortion; many are mild and observed. A macular hole often follows vitreous traction at the fovea; it produces a central missing spot and on OCT a full-thickness defect. Surgical options (vitrectomy with membrane peeling, or hole closure techniques) are considered by a retinal specialist depending on symptoms.",
      "Differential of central distortion or blur: diabetic or other macular oedema, central serous chorioretinopathy, vein occlusion, inherited maculopathies, drug toxicity and optic nerve disease (which gives reduced colour vision and an afferent defect rather than distortion).",
      "Urgency and management principles: new distortion or sudden central loss in a person at risk of AMD needs prompt specialist assessment for possible neovascular disease. Management of wet AMD is with repeated intravitreal anti-VEGF injections under a specialist plan. For dry AMD, advise smoking cessation and low-vision support; specific supplement recommendations depend on current evidence and disease stage.",
      "Documentation: record acuity with correction status for each eye, symptoms (distortion, scotoma, onset), Amsler findings with their limitations, fundus findings, OCT findings with scan location and quality, and the provisional diagnosis."
    ],
    deeper: [
      "Central serous chorioretinopathy produces a dome of subretinal fluid, often in younger to middle-aged adults and associated with corticosteroid exposure and stress; it is a differential for new distortion with fluid on OCT.",
      "OCT findings must be read with scan position and quality: a scan line that misses the fovea can falsely appear normal, and segmentation errors can produce false thickness values.",
      "Charles Bonnet syndrome (visual hallucinations with insight in people with significant vision loss) is common in advanced macular disease and should be asked about and explained (L33)."
    ],
    misconceptions: [
      "Mistake: a normal Amsler grid excludes macular disease. Correction: Amsler testing is insensitive to some lesions; OCT and examination are needed when symptoms or risk warrant.",
      "Mistake: wet and dry AMD progress at the same pace. Correction: neovascular disease can cause rapid loss and needs prompt assessment; atrophic disease is usually slow.",
      "Mistake: an epiretinal membrane and a macular hole are the same. Correction: a membrane is tissue on the surface causing wrinkling; a hole is a full-thickness foveal defect causing a central gap."
    ],
    entryChallenge: {
      prompt: "Why does a small macular lesion often reduce acuity more than a much larger peripheral one?",
      answer: "The fovea has the highest cone density and supports fine detail; peripheral retina has low spatial resolution, so loss there barely affects acuity."
    },
    contrast: {
      a: "Dry AMD: drusen, pigment change, slowly expanding atrophy, gradual reading difficulty, no fluid on OCT.",
      b: "Wet AMD: new distortion or sudden central blur, subretinal or intraretinal fluid or haemorrhage on OCT and examination.",
      discriminator: "Presence of exudative activity (fluid, haemorrhage) and the tempo of symptoms."
    },
    workedExample: {
      problem: "A 78-year-old smoker notices over a week that door frames look wavy in the right eye. Right acuity has dropped from the previous visit. There is a small haemorrhage near the fovea. OCT shows subretinal fluid. Interpret and plan.",
      steps: [
        "Symptom localisation: metamorphopsia points to the macula.",
        "Signs: haemorrhage and subretinal fluid indicate exudative activity.",
        "Provisional diagnosis: right neovascular AMD, with angiography as needed to characterise it.",
        "Urgency: prompt specialist referral for consideration of intravitreal anti-VEGF therapy.",
        "Also: examine and image the left eye, advise smoking cessation, and document acuity, OCT location and quality."
      ]
    },
    transfer: {
      prompt: "Sketch an OCT cross-section for (A) drusen, (B) subretinal fluid, (C) full-thickness macular hole. Label the layer involved in each.",
      modelAnswer: "A: bumps elevating the RPE band above Bruch's membrane. B: a dark (hyporeflective) space between neurosensory retina and RPE. C: a gap through all retinal layers at the foveal centre, often with cystic edges."
    },
    items: [
      {
        id: "Q-L21-01", version: 1, objectiveIds: ["L21-O1", "L21-O4"], familyId: "F-L21-wet-vs-dry", pool: "practice", difficulty: 2,
        stem: "An older patient has new distortion over a few days, a small macular haemorrhage and subretinal fluid on OCT. What is the most appropriate step?",
        options: ["Routine review in a year", "Prompt specialist assessment for suspected neovascular AMD", "New glasses", "Reassurance that this is dry AMD"],
        answerIndex: 1,
        explanation: "Haemorrhage and fluid indicate exudative (neovascular) activity, which can cause rapid loss and is treated with intravitreal anti-VEGF.",
        distractorRationale: ["Delay risks irreversible loss.", "", "Distortion with fluid is not refractive.", "Fluid and haemorrhage are not features of dry AMD."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L21-02", version: 1, objectiveIds: ["L21-O3"], familyId: "F-L21-oct-hole", pool: "practice", difficulty: 1,
        stem: "OCT shows a defect through all retinal layers at the foveal centre. The patient reports a central missing spot. What is the diagnosis?",
        options: ["Epiretinal membrane", "Drusen", "Central serous chorioretinopathy", "Full-thickness macular hole"],
        answerIndex: 3,
        explanation: "A full-thickness foveal defect on OCT with a central scotoma is a macular hole.",
        distractorRationale: ["A membrane wrinkles the surface without a full-thickness gap.", "Drusen elevate the RPE.", "CSC shows subretinal fluid.", ""],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L21-03", version: 1, objectiveIds: ["L21-O2"], familyId: "F-L21-amsler", pool: "practice", difficulty: 2,
        stem: "A patient with intermediate AMD reports a normal Amsler grid at home. What does this establish?",
        options: ["No macular disease is present", "Neovascular disease is excluded", "Only that no distortion was noticed on this test; it does not exclude macular disease", "That OCT is unnecessary forever"],
        answerIndex: 2,
        explanation: "Amsler testing is a simple screen with limited sensitivity; a normal result does not exclude pathology.",
        distractorRationale: ["Drusen are already known to be present.", "Some neovascular lesions are missed by Amsler.", "", "Imaging remains indicated if symptoms or risk change."],
        misconceptionIds: ["M-FINDING-AS-CERTAINTY"], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L21-04", version: 1, objectiveIds: ["L21-O1"], familyId: "F-L21-drusen", pool: "practice", difficulty: 1,
        stem: "Where do drusen accumulate?",
        options: ["Between the RPE and Bruch's membrane", "In the nerve fibre layer", "In the vitreous", "Within the choroidal veins"],
        answerIndex: 0,
        explanation: "Drusen are extracellular deposits beneath the RPE, on Bruch's membrane; OCT shows them as RPE elevations.",
        distractorRationale: ["", "Nerve fibre layer lesions include cotton-wool spots.", "Vitreous opacities are floaters.", "Drusen are not intravascular."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L21-05", version: 1, objectiveIds: ["L21-O3"], familyId: "F-L21-erm", pool: "exam", difficulty: 2,
        stem: "A patient has slowly progressive distortion. OCT shows a thin hyperreflective layer on the inner retinal surface with wrinkling and thickening but no full-thickness defect or subretinal fluid. Most likely diagnosis?",
        options: ["Macular hole", "Epiretinal membrane", "Neovascular AMD", "Geographic atrophy"],
        answerIndex: 1,
        explanation: "A contracting membrane on the inner surface wrinkles and thickens the macula, causing distortion.",
        distractorRationale: ["There is no full-thickness defect.", "", "There is no fluid or haemorrhage.", "Atrophy shows outer retinal and RPE loss, not surface wrinkling."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L21-06", version: 1, objectiveIds: ["L21-O2", "L21-O4"], familyId: "F-L21-modality-choice", pool: "exam", difficulty: 2,
        stem: "Which statement about OCT angiography in suspected neovascular AMD is correct?",
        options: ["It shows dye leakage exactly like fluorescein angiography", "It shows abnormal flow without dye but does not show leakage", "It measures intraocular pressure", "It replaces clinical examination entirely"],
        answerIndex: 1,
        explanation: "OCTA detects motion contrast from blood flow; it can show neovascular networks but not leakage, which dye angiography demonstrates.",
        distractorRationale: ["Leakage requires dye-based imaging.", "", "OCTA is a retinal imaging method.", "Imaging complements, not replaces, examination."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      }
    ],
    sources: ["C1", "C2"],
    reviewStatus: "draft"
  },
  {
    id: "L22",
    title: "Retinal vascular disease and sudden painless loss",
    group: "Posterior segment",
    emphasis: "Arterial/venous occlusions, transient loss and urgent systemic implications",
    signature: "Interpret a case and select an appropriate urgent pathway",
    prerequisites: ["L09", "L20"],
    studios: ["LAB16", "LAB11", "LAB12", "LAB05"],
    activities: ["T023", "T062", "T065", "T066", "T068", "T070"],
    estMinutes: 50,
    objectives: [
      { id: "L22-O1", text: "Distinguish central retinal artery occlusion from central retinal vein occlusion by mechanism and fundus appearance." },
      { id: "L22-O2", text: "Explain why transient monocular vision loss and retinal artery occlusion are treated as urgent vascular events." },
      { id: "L22-O3", text: "Recognise when giant cell arteritis must be considered in sudden visual loss in an older person and state the urgency principle." },
      { id: "L22-O4", text: "Predict the pupil findings and later complications of retinal vascular occlusions." }
    ],
    bridge: "L09 explained that a relative afferent pupillary defect reflects asymmetric retinal or optic nerve input; L20 introduced retinal vascular damage. The central retinal artery supplies the inner retina; the central retinal vein drains it. Blocking either causes sudden painless loss, but the appearance and implications differ.",
    essentials: [
      "Sudden painless loss of vision in one eye has a short differential: retinal artery occlusion, retinal vein occlusion, vitreous haemorrhage, retinal detachment, ischaemic optic neuropathy and acute macular disease (such as neovascular AMD).",
      "Central retinal artery occlusion (CRAO) causes sudden profound loss, a marked relative afferent pupillary defect, a pale swollen inner retina and a cherry-red spot at the fovea.",
      "Retinal artery occlusion and transient monocular vision loss are often embolic and indicate a risk of stroke; they need urgent assessment through a stroke or vascular pathway according to local protocol.",
      "In anyone older presenting with sudden loss, consider giant cell arteritis (headache, scalp tenderness, jaw claudication, systemic symptoms); it threatens both eyes and needs same-day assessment and treatment per protocol.",
      "Central retinal vein occlusion (CRVO) shows widespread haemorrhages in all quadrants, dilated tortuous veins, cotton-wool spots and often disc swelling. Branch occlusions affect one sector.",
      "Vein occlusions are associated with age, hypertension, diabetes, raised eye pressure and some blood disorders; complications include macular oedema and neovascularisation."
    ],
    full: [
      "Mechanism of artery occlusion: an embolus (often from carotid plaque or the heart) or thrombosis, or arteritic inflammation in giant cell arteritis, stops inner retinal perfusion. The inner retina becomes oedematous and opaque within hours; the fovea, which lacks inner layers and is supplied from the choroid, stands out as a cherry-red spot. A cilioretinal artery, when present, can spare a zone of central vision.",
      "Mechanism of vein occlusion: thrombosis at or near the lamina cribrosa (central) or at an arteriovenous crossing (branch) raises venous pressure. Blood and fluid leak, producing haemorrhages, oedema and, in ischaemic forms, capillary non-perfusion.",
      "Presentation and signs: CRAO is abrupt and severe, with a marked RAPD and attenuated arterioles, sometimes with a visible embolus. CRVO ranges from mild blur to severe loss with haemorrhages in all quadrants. Branch occlusions cause sectoral loss that may go unnoticed if the macula is spared. Transient monocular loss (often described as a curtain lasting minutes) may leave a normal examination.",
      "Tests and interpretation: acuity, pupils (swinging light test), dilated fundus examination and OCT for macular oedema. Fluorescein angiography shows delayed filling and non-perfusion. Systemic evaluation follows the presumed mechanism: vascular risk assessment for emboli; urgent inflammatory markers and clinical assessment for giant cell arteritis; blood pressure, glucose and other tests in vein occlusion.",
      "Differential: ischaemic optic neuropathy (disc swelling, altitudinal defect), vitreous haemorrhage (no red reflex, poor fundal view), retinal detachment (curtain with visible detached retina), and neovascular AMD (distortion with macular fluid).",
      "Urgency and management principles: treat retinal artery occlusion and transient monocular loss as stroke-equivalent events requiring same-day assessment per local pathway. Suspected giant cell arteritis needs immediate assessment and treatment per local protocol without waiting for confirmation, because the fellow eye is at risk. Vein occlusion needs specialist assessment, management of risk factors and surveillance for oedema and new vessels.",
      "Complications: ischaemic vein occlusions can lead to iris and angle neovascularisation and neovascular glaucoma; macular oedema is treated by retinal specialists, often with intravitreal therapy. Both artery and vein occlusions raise the question of the patient's overall cardiovascular risk.",
      "Documentation: onset and duration, laterality, acuity, RAPD (and which eye), fundus findings with distribution, systemic symptoms asked about (including giant cell arteritis features), and the urgent pathway initiated."
    ],
    deeper: [
      "Branch retinal artery occlusion can produce a sectoral field defect with whitening along the affected arteriole; a visible refractile embolus at a bifurcation supports an embolic source.",
      "Not every elevated inflammatory marker indicates giant cell arteritis and normal values do not exclude it; clinical features and temporal artery assessment (biopsy or imaging per local practice) are combined."
    ],
    misconceptions: [
      "Mistake: transient monocular loss that has resolved needs no urgent action. Correction: it can herald stroke and needs urgent vascular assessment per local protocol.",
      "Mistake: the eye with CRAO has a fixed dilated pupil. Correction: the pupils are usually equal in size; the afferent defect is detected by comparing responses with the swinging light test.",
      "Mistake: giant cell arteritis only causes headache. Correction: it can cause sudden irreversible visual loss and threatens the fellow eye."
    ],
    entryChallenge: {
      prompt: "List four causes of sudden painless monocular visual loss.",
      answer: "Any four of: retinal artery occlusion, retinal vein occlusion, vitreous haemorrhage, retinal detachment, ischaemic optic neuropathy, neovascular AMD."
    },
    contrast: {
      a: "CRAO: abrupt profound loss, pale opaque retina, cherry-red spot, attenuated arterioles, marked RAPD.",
      b: "CRVO: variable loss, widespread haemorrhages in all quadrants, dilated tortuous veins, disc swelling.",
      discriminator: "Retinal whitening with a cherry-red spot (arterial) versus diffuse haemorrhage with venous engorgement (venous)."
    },
    workedExample: {
      problem: "A 74-year-old woman reports sudden painless loss of vision in the left eye this morning. She has had headaches and pain when chewing for two weeks. Left acuity is very poor, there is a left RAPD and the left disc is swollen and pale. Plan.",
      steps: [
        "Localise: optic nerve dysfunction (RAPD, disc swelling) in the left eye.",
        "Mechanism: jaw claudication and headache in an older adult raise strong suspicion of arteritic ischaemic optic neuropathy from giant cell arteritis.",
        "Urgency: the fellow eye is at risk; immediate same-day assessment with inflammatory markers and treatment per local protocol, without waiting for biopsy.",
        "Arrange confirmation (temporal artery assessment) and systemic review.",
        "Document symptoms, both eyes' findings, the RAPD and the time the pathway was started."
      ]
    },
    transfer: {
      prompt: "Make a two-column table of the first three questions and first three examination steps you would use to triage sudden painless loss of vision.",
      modelAnswer: "Questions: exact onset and duration (transient or persistent), giant cell arteritis symptoms (headache, scalp tenderness, jaw claudication), preceding flashes/floaters or curtain. Examination: acuity each eye, swinging light test for RAPD, dilated fundus examination (or B-scan if no view)."
    },
    items: [
      {
        id: "Q-L22-01", version: 1, objectiveIds: ["L22-O1"], familyId: "F-L22-crao-signs", pool: "practice", difficulty: 1,
        stem: "Sudden profound painless loss with a pale opaque retina and a red spot at the fovea suggests:",
        options: ["Central retinal vein occlusion", "Central retinal artery occlusion", "Retinal detachment", "Vitreous haemorrhage"],
        answerIndex: 1,
        explanation: "Inner retinal ischaemia makes the retina opaque; the fovea, supplied by the choroid and lacking inner layers, stands out as a cherry-red spot.",
        distractorRationale: ["Vein occlusion shows widespread haemorrhages.", "", "Detachment shows elevated mobile retina.", "Haemorrhage obscures the fundal view."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L22-02", version: 1, objectiveIds: ["L22-O1"], familyId: "F-L22-crvo-pattern", pool: "practice", difficulty: 1,
        stem: "Which fundus picture is most typical of central retinal vein occlusion?",
        options: ["Haemorrhages in all four quadrants with dilated tortuous veins", "A single sector of whitening", "Drusen at the macula", "A horseshoe tear"],
        answerIndex: 0,
        explanation: "Venous outflow obstruction raises pressure throughout the retina, causing widespread haemorrhages and venous engorgement.",
        distractorRationale: ["", "Sectoral whitening suggests branch artery occlusion.", "Drusen indicate age-related macular change.", "A tear relates to vitreous traction."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L22-03", version: 1, objectiveIds: ["L22-O2"], familyId: "F-L22-transient", pool: "practice", difficulty: 2,
        stem: "A 66-year-old describes a curtain over one eye that lasted a few minutes and fully resolved. Examination today is normal. Best next step?",
        options: ["Reassure and discharge", "Routine glasses test", "Urgent vascular/stroke assessment per local protocol", "Repeat check in six months"],
        answerIndex: 2,
        explanation: "Transient monocular vision loss is often embolic and signals a stroke risk; a normal examination afterwards does not remove that risk.",
        distractorRationale: ["A normal examination does not exclude an embolic source.", "This is not refractive.", "", "The risk is time-sensitive."],
        misconceptionIds: ["M-FINDING-AS-CERTAINTY"], sources: ["C1", "C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L22-04", version: 1, objectiveIds: ["L22-O3"], familyId: "F-L22-gca", pool: "practice", difficulty: 2,
        stem: "A 78-year-old with sudden visual loss reports scalp tenderness and jaw pain on chewing. What principle applies?",
        options: ["Wait for biopsy before any treatment", "Treat as an emergency: same-day assessment and treatment per protocol because the fellow eye is at risk", "Arrange routine neurology review", "Prescribe reading glasses"],
        answerIndex: 1,
        explanation: "Giant cell arteritis can cause rapid bilateral blindness; treatment is started urgently while confirmation proceeds.",
        distractorRationale: ["Delaying treatment risks the fellow eye.", "", "This is too slow.", "Irrelevant to the mechanism."],
        misconceptionIds: [], sources: ["C1", "C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L22-05", version: 1, objectiveIds: ["L22-O4"], familyId: "F-L22-rapd-meaning", pool: "exam", difficulty: 2,
        stem: "A patient with right CRAO is examined. Which pupil finding is expected?",
        options: ["A fixed, dilated right pupil in room light", "A smaller right pupil with ptosis", "No pupil abnormality is possible", "Equal pupil sizes, with both pupils dilating when the light swings to the right eye"],
        answerIndex: 3,
        explanation: "An afferent defect reduces the signal from the right eye; both pupils constrict less when it is lit, so they dilate as the light swings to it. Resting sizes remain equal because efferent pathways are intact.",
        distractorRationale: ["An afferent defect does not produce a fixed dilated pupil; that suggests an efferent problem.", "Ptosis and miosis suggest Horner syndrome.", "Severe inner retinal loss typically produces a marked RAPD.", ""],
        misconceptionIds: ["M-AFFERENT-VS-EFFERENT"], sources: ["K1", "C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L22-06", version: 1, objectiveIds: ["L22-O4"], familyId: "F-L22-crvo-complication", pool: "exam", difficulty: 3,
        stem: "Months after an ischaemic central retinal vein occlusion, a patient develops a painful red eye with high pressure. Which mechanism is most likely?",
        options: ["Neovascularisation of the iris and angle causing neovascular glaucoma", "Pupil block from a large lens only", "Viral conjunctivitis", "Posterior vitreous detachment"],
        answerIndex: 0,
        explanation: "Retinal ischaemia drives growth factor release; new vessels on the iris and angle obstruct outflow, causing neovascular glaucoma. Surveillance after ischaemic occlusion aims to detect this early.",
        distractorRationale: ["", "Pupil block is a different mechanism without the ischaemic history.", "Conjunctivitis does not raise pressure.", "PVD does not cause raised pressure and pain."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      }
    ],
    sources: ["K1", "C1", "C2"],
    reviewStatus: "draft"
  },
  {
    id: "L23",
    title: "Vitreous and retinal detachment",
    group: "Posterior segment",
    emphasis: "Flashes/floaters, posterior vitreous detachment, retinal breaks, detachment and hemorrhage",
    signature: "Distinguish risk patterns without relying on a single symptom",
    prerequisites: ["L01", "L12"],
    studios: ["LAB11", "LAB16", "LAB13", "LAB12"],
    activities: ["T062", "T063", "T064", "T066", "T075"],
    estMinutes: 45,
    objectives: [
      { id: "L23-O1", text: "Explain how posterior vitreous detachment produces flashes and floaters and how it can cause a retinal tear." },
      { id: "L23-O2", text: "Distinguish rhegmatogenous, tractional and exudative retinal detachment by mechanism and typical context." },
      { id: "L23-O3", text: "Identify features that raise the risk of a retinal break and the examination needed to look for one." },
      { id: "L23-O4", text: "Select ultrasound when the fundus cannot be seen and state what it can show." }
    ],
    bridge: "L01 described the gel vitreous attached most firmly at the vitreous base, disc and vessels; L12 introduced indirect ophthalmoscopy. With age the vitreous liquefies and separates. Usually this is harmless, but where it pulls on the retina it can tear it, and fluid passing through a tear can detach the retina.",
    essentials: [
      "Posterior vitreous detachment (PVD) is common with age: the vitreous separates from the retina, causing new floaters and brief flashes (photopsia) from traction on the retina.",
      "A minority of symptomatic PVDs cause a retinal tear. Retinal tears can let fluid pass under the retina, causing rhegmatogenous retinal detachment.",
      "Symptoms of detachment include a shadow or curtain spreading across the field and, if the macula detaches, reduced central vision.",
      "New flashes or floaters need a dilated examination of the peripheral retina by someone able to detect tears, with urgency set by local protocol; normal acuity does not exclude a tear.",
      "Features that increase concern include a shower of new floaters, field loss, vitreous haemorrhage, pigment cells in the anterior vitreous, high myopia, previous retinal detachment and recent eye surgery or trauma.",
      "Tractional detachment results from contracting fibrovascular tissue (such as in proliferative diabetic retinopathy); exudative detachment results from fluid accumulating under an intact retina (inflammation, tumour)."
    ],
    full: [
      "Mechanism: the vitreous gel liquefies with age and collapses forward, separating from the retina. Traction where it remains adherent (especially at the vitreous base and around lattice degeneration or vessels) can tear the retina. A tear, particularly a horseshoe tear with persistent traction, lets liquefied vitreous enter the subretinal space.",
      "Presentation: floaters (cobwebs, rings or dots) and flashes at the edge of vision, often more noticeable in dim light. A sudden shower of dots can indicate vitreous haemorrhage from a torn vessel. A progressive field shadow suggests detachment; central blur suggests macular involvement.",
      "Signs: a Weiss ring may be visible after PVD. Pigment cells in the anterior vitreous on slit-lamp examination raise suspicion of a tear. Detached retina looks elevated, grey and mobile with folds; tears are found with indirect ophthalmoscopy and scleral indentation by an experienced examiner.",
      "Tests and interpretation: dilated fundus examination is the key test. If vitreous haemorrhage or cataract prevents a view, B-scan ultrasound shows whether the retina is attached, whether the vitreous is detached and whether there is a mass. OCT can show shallow macular detachment and vitreomacular traction.",
      "Detachment types: rhegmatogenous (from a break; most common), tractional (pulled off by membranes, often in proliferative diabetic retinopathy), and exudative (fluid accumulates beneath the retina because of inflammation, tumour or vascular leakage, with no break). Exudative fluid tends to shift with posture.",
      "Differential of flashes and floaters: migraine aura (bilateral, scintillating, evolving over minutes), vitreous inflammation (vitritis), and vitreous haemorrhage from diabetic disease or vein occlusion.",
      "Urgency and management principles: symptomatic PVD needs timely examination to look for tears; a tear may be sealed with laser or cryotherapy; a rhegmatogenous detachment needs urgent retinal referral, with priority influenced by whether the macula is still attached. Repair options include pneumatic retinopexy, scleral buckling and vitrectomy. Patients should be told which new symptoms mean they must return at once.",
      "Documentation: symptom onset, laterality, presence of field loss, acuity, anterior vitreous pigment, fundus findings including the extent of any detachment and whether the macula is on or off, and the safety-net advice given."
    ],
    deeper: [
      "Lattice degeneration is a peripheral retinal thinning with firm vitreous attachment at its edges; it increases tear risk in some eyes but is common and most never cause detachment.",
      "In high myopia the retina is stretched and thinner, and detachments may occur at younger ages; after cataract surgery, detachment risk is also increased.",
      "A detached macula reduces visual prognosis; this is why examiners specifically document macular status and why a macula-on detachment is often prioritised to prevent macular involvement."
    ],
    misconceptions: [
      "Mistake: good acuity with new flashes means nothing is wrong. Correction: a peripheral tear can exist with normal acuity; a dilated peripheral examination is required.",
      "Mistake: all floaters indicate retinal detachment. Correction: most are due to uncomplicated PVD; the task is to identify the minority with tears or detachment.",
      "Mistake: if the fundus cannot be seen, attachment status is unknowable. Correction: B-scan ultrasound can show whether the retina is attached through opaque media."
    ],
    entryChallenge: {
      prompt: "Why do flashes occur in posterior vitreous detachment?",
      answer: "Mechanical traction on the retina by the separating vitreous stimulates photoreceptors, perceived as brief flashes of light."
    },
    contrast: {
      a: "Uncomplicated PVD: floaters and flashes, no field loss, no retinal break on dilated examination.",
      b: "Rhegmatogenous detachment: often preceded by the same symptoms but followed by a spreading field shadow and elevated retina with a break.",
      discriminator: "Field loss and the dilated retinal examination, not the presence of floaters alone."
    },
    workedExample: {
      problem: "A 58-year-old myope has new floaters and flashes in the right eye for two days. Acuity is normal. Slit lamp shows pigment cells in the anterior vitreous. What follows?",
      steps: [
        "Symptoms: consistent with PVD.",
        "Risk features: myopia and vitreous pigment raise suspicion of a retinal tear.",
        "Normal acuity does not exclude a peripheral tear.",
        "Action: dilated indirect examination with indentation by an experienced examiner, urgency per local protocol.",
        "Document findings and give clear advice to return immediately if a shadow or more floaters develop."
      ]
    },
    transfer: {
      prompt: "Draw three sketches of a detached retina: one with a break, one pulled by a membrane, one with fluid under an intact retina. Label each type and give one typical context.",
      modelAnswer: "Break: rhegmatogenous (after PVD, myopia, trauma). Membrane: tractional (proliferative diabetic retinopathy). Intact retina with fluid: exudative (inflammation, tumour)."
    },
    items: [
      {
        id: "Q-L23-01", version: 1, objectiveIds: ["L23-O1", "L23-O3"], familyId: "F-L23-pvd-workup", pool: "practice", difficulty: 1,
        stem: "A 60-year-old has new floaters and flashes in one eye with normal acuity. What examination is needed?",
        options: ["None, because acuity is normal", "Dilated examination of the peripheral retina to look for a tear", "Intraocular pressure only", "Colour vision testing"],
        answerIndex: 1,
        explanation: "PVD can cause peripheral tears that do not affect acuity; dilated peripheral examination is required.",
        distractorRationale: ["Normal acuity does not exclude a tear.", "", "Pressure does not detect tears.", "Colour vision does not assess the periphery."],
        misconceptionIds: ["M-FINDING-AS-CERTAINTY"], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L23-02", version: 1, objectiveIds: ["L23-O2"], familyId: "F-L23-curtain", pool: "practice", difficulty: 1,
        stem: "A patient describes a dark shadow spreading from the upper field over a day after floaters. Which part of the retina is likely detached?",
        options: ["Superior retina", "Inferior retina", "Macula only", "Optic disc"],
        answerIndex: 1,
        explanation: "The optics of the eye invert the image: an upper field defect corresponds to inferior retina.",
        distractorRationale: ["Superior retina maps to the inferior field.", "", "Macular detachment causes central loss.", "The disc is the blind spot."],
        misconceptionIds: ["M-FIELD-VS-RETINA"], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L23-03", version: 1, objectiveIds: ["L23-O2"], familyId: "F-L23-detachment-types", pool: "practice", difficulty: 2,
        stem: "A patient with proliferative diabetic retinopathy has contracting fibrovascular membranes and an elevated retina without a break. Which type of detachment is this?",
        options: ["Rhegmatogenous", "Exudative", "Tractional", "Posterior vitreous detachment"],
        answerIndex: 2,
        explanation: "Contracting membranes pull the retina off without a primary break: tractional detachment.",
        distractorRationale: ["Rhegmatogenous requires a break.", "Exudative arises from fluid under an intact retina without traction.", "", "PVD is vitreous separation, not retinal detachment."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L23-04", version: 1, objectiveIds: ["L23-O3"], familyId: "F-L23-risk", pool: "practice", difficulty: 2,
        stem: "Which finding most increases suspicion of a retinal tear in a patient with symptomatic PVD?",
        options: ["Pigment cells in the anterior vitreous", "Bilateral itchy eyes", "A small chalazion", "Mild presbyopia"],
        answerIndex: 0,
        explanation: "Pigment cells in the anterior vitreous suggest RPE cells released through a retinal break.",
        distractorRationale: ["", "Allergy is unrelated.", "Lid lesions are unrelated.", "Presbyopia is unrelated."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L23-05", version: 1, objectiveIds: ["L23-O4"], familyId: "F-L23-bscan", pool: "exam", difficulty: 2,
        stem: "A patient has dense vitreous haemorrhage and no fundal view. Which test best determines whether the retina is attached?",
        options: ["Goldmann tonometry", "Fluorescein angiography", "Corneal topography", "B-scan ultrasound"],
        answerIndex: 3,
        explanation: "Ultrasound is not blocked by blood or opaque media and can show retinal position, vitreous separation and masses.",
        distractorRationale: ["Pressure does not show retinal position.", "Angiography needs a clear view.", "Topography measures the cornea.", ""],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L23-06", version: 1, objectiveIds: ["L23-O2", "L23-O1"], familyId: "F-L23-macula-status", pool: "exam", difficulty: 3,
        stem: "Two patients have rhegmatogenous detachment. In A, central acuity is preserved; in B it has fallen sharply. What best explains the difference and why is it recorded?",
        options: ["A has a tractional detachment", "B has migraine", "In B the macula is likely detached; macular status affects prognosis and urgency planning", "Acuity is irrelevant in detachment"],
        answerIndex: 2,
        explanation: "When the detachment involves the macula, central acuity falls and the visual prognosis is worse; documenting macular status supports prioritisation.",
        distractorRationale: ["Mechanism is stated as rhegmatogenous.", "Migraine does not cause detachment.", "", "Acuity helps judge macular involvement."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      }
    ],
    sources: ["C1", "C2"],
    reviewStatus: "draft"
  },
  {
    id: "L24",
    title: "Optic nerve disorders and disc swelling",
    group: "Neuro-ophthalmology",
    emphasis: "Optic neuritis, ischemic neuropathy, papilledema, pseudopapilledema and atrophy",
    signature: "Combine disc appearance, function and systemic clues",
    prerequisites: ["L09", "L11"],
    studios: ["LAB05", "LAB07", "LAB11", "LAB12", "LAB15"],
    activities: ["T007", "T009", "T023", "T039", "T062", "T065", "T067", "T077", "T087"],
    estMinutes: 55,
    objectives: [
      { id: "L24-O1", text: "Identify the functional signs of optic nerve dysfunction (reduced acuity, colour desaturation, RAPD, field defect) and explain why they occur." },
      { id: "L24-O2", text: "Distinguish optic neuritis from non-arteritic and arteritic ischaemic optic neuropathy by age, pain, tempo and systemic features." },
      { id: "L24-O3", text: "Define papilloedema, distinguish it from other disc swelling and pseudopapilloedema, and state the urgency principle." },
      { id: "L24-O4", text: "Interpret optic disc pallor as a sign of prior damage and list causes to consider." }
    ],
    bridge: "L09 showed that a relative afferent pupillary defect reflects asymmetric optic nerve or retinal input; L11 mapped field defects to the pathway. The optic nerve carries ganglion cell axons from the retina to the chiasm. Swelling, ischaemia, inflammation, compression and raised intracranial pressure each leave a different combination of disc appearance and function.",
    essentials: [
      "Optic nerve dysfunction typically causes reduced acuity, reduced colour vision (red desaturation), a field defect and, if unilateral or asymmetric, a relative afferent pupillary defect.",
      "Optic neuritis usually affects young adults, causing subacute visual loss over days with pain on eye movement; the disc may look normal (retrobulbar) or swollen. It is associated with demyelinating disease.",
      "Non-arteritic anterior ischaemic optic neuropathy typically causes sudden painless loss in an older adult with vascular risk factors, a swollen disc and often an altitudinal field defect.",
      "Arteritic ischaemic optic neuropathy from giant cell arteritis is an emergency because the fellow eye is at risk.",
      "Papilloedema means optic disc swelling caused by raised intracranial pressure; it is usually bilateral, vision is often preserved early, and it requires urgent assessment including neuroimaging.",
      "Pseudopapilloedema (for example from disc drusen or a crowded disc) mimics swelling but is not caused by raised pressure. Optic atrophy (pallor) indicates previous axonal loss and its cause must be sought."
    ],
    full: [
      "Mechanism: any process that blocks axonal transport at the disc (ischaemia, inflammation, raised pressure transmitted along the nerve sheath) causes swelling. Function falls when axons are damaged; with raised intracranial pressure axons are initially compressed but still conducting, so acuity is often preserved early.",
      "Optic neuritis: inflammatory demyelination causes reduced acuity and colour vision, pain on eye movement (from traction on the inflamed sheath), a central or other field defect and an RAPD. Most patients recover substantially over weeks. MRI of brain and orbits helps assess demyelination risk; atypical features (no pain, very severe loss, no recovery, bilateral simultaneous involvement, older age) prompt consideration of other causes.",
      "Ischaemic optic neuropathy: non-arteritic forms occur in small crowded discs with vascular risk factors and cause painless loss, disc swelling (often sectoral) and altitudinal defects. Arteritic forms in giant cell arteritis tend to cause severe loss and a pale swollen disc, with headache, jaw claudication and systemic symptoms; urgent treatment per protocol protects the other eye.",
      "Papilloedema: raised intracranial pressure from a mass, hydrocephalus, venous sinus thrombosis or idiopathic intracranial hypertension causes bilateral disc swelling. Symptoms include headache, transient visual obscurations, pulsatile tinnitus and diplopia from sixth nerve palsy; fields show enlarged blind spots. Urgent neuroimaging and, where appropriate, further investigation follow local pathways. Blood pressure is checked because severe hypertension can also cause disc swelling.",
      "Tests and interpretation: acuity, colour plates or red desaturation comparison, swinging light test, fields and dilated disc examination. OCT of the RNFL documents swelling and later thinning; imaging of the orbit and brain is chosen for the suspected cause (avoid MRI where a metallic foreign body is possible). VEP can support conduction delay but is not a standalone diagnosis.",
      "Differential of a swollen-looking disc: papilloedema, optic neuritis (papillitis), ischaemic neuropathy, hypertensive disc swelling, infiltration, and pseudopapilloedema from drusen or congenitally crowded discs. Laterality, function, haemorrhages, and the absence or presence of visible disc drusen help separate them.",
      "Optic atrophy: pallor follows axon loss from any cause (previous neuritis, ischaemia, compression, glaucoma, toxic or hereditary neuropathies). Progressive pallor with a slowly worsening field must prompt imaging for compression.",
      "Documentation: each eye's acuity, colour vision, RAPD (side), field defect pattern, disc appearance (swelling, haemorrhages, pallor, cup), systemic features asked about, and the provisional diagnosis with the urgency of the plan."
    ],
    deeper: [
      "Optic disc drusen can be buried in younger people and become more visible with age; ultrasound, autofluorescence and OCT are used to identify them, avoiding unnecessary invasive investigation but without dismissing true papilloedema.",
      "Leber hereditary optic neuropathy and toxic/nutritional neuropathies often cause bilateral sequential or simultaneous central loss with relatively symmetrical findings, so an RAPD may be absent.",
      "In optic neuritis the disc swelling, when present, lies at the nerve head; in papilloedema the swelling is driven from behind by pressure and function is usually preserved until late."
    ],
    misconceptions: [
      "Mistake: any swollen disc is papilloedema. Correction: papilloedema is reserved for swelling from raised intracranial pressure; neuritis, ischaemia and hypertension also swell the disc.",
      "Mistake: papilloedema always causes poor acuity. Correction: acuity is often preserved early; enlarged blind spots and transient obscurations are more typical.",
      "Mistake: a normal-looking disc excludes optic nerve disease. Correction: retrobulbar neuritis and early compression may leave the disc normal; function tests reveal the problem.",
      "Mistake: an RAPD means the pupil on that side is dilated. Correction: pupil sizes are equal; the defect is a relative difference in response seen with the swinging light."
    ],
    entryChallenge: {
      prompt: "Name three bedside signs of unilateral optic nerve dysfunction.",
      answer: "Reduced acuity, reduced colour vision or red desaturation, an RAPD and a field defect (any three)."
    },
    contrast: {
      a: "Optic neuritis: young adult, subacute loss, pain on eye movement, RAPD, disc normal or swollen, typical recovery.",
      b: "Non-arteritic ischaemic optic neuropathy: older adult with vascular risk, sudden painless loss, swollen disc, altitudinal defect.",
      discriminator: "Age, pain on eye movement and tempo; the field pattern and disc appearance support the distinction."
    },
    workedExample: {
      problem: "A 28-year-old woman has headache worse lying down, brief greying of vision on standing, and bilateral swollen discs. Acuity and colour vision are normal; fields show enlarged blind spots; there is no RAPD. Interpret.",
      steps: [
        "Bilateral disc swelling with preserved function suggests papilloedema rather than bilateral neuritis.",
        "Symptoms (positional headache, transient obscurations) support raised intracranial pressure.",
        "Check blood pressure to exclude hypertensive disc swelling.",
        "Urgent neuroimaging per local protocol to exclude a mass or venous sinus thrombosis; further assessment for idiopathic intracranial hypertension follows if imaging is unremarkable.",
        "Document both discs, fields, absence of RAPD and the pathway initiated."
      ]
    },
    transfer: {
      prompt: "Complete a table with columns Pain, Age, Laterality, Acuity early, Disc for: optic neuritis, NAION, arteritic AION, papilloedema.",
      modelAnswer: "Neuritis: pain on eye movement, young, usually unilateral, reduced, normal or swollen. NAION: painless, older, unilateral, reduced (often altitudinal), swollen. Arteritic: headache/jaw claudication, older, unilateral initially with fellow-eye risk, severely reduced, pale swollen. Papilloedema: headache, any age, bilateral, often preserved, swollen."
    },
    items: [
      {
        id: "Q-L24-01", version: 1, objectiveIds: ["L24-O2"], familyId: "F-L24-neuritis", pool: "practice", difficulty: 1,
        stem: "A 26-year-old has blurred vision in the left eye over four days, pain on moving the eye, reduced colour vision and a left RAPD. The disc looks normal. Most likely diagnosis?",
        options: ["Retrobulbar optic neuritis", "Papilloedema", "Central retinal artery occlusion", "Cataract"],
        answerIndex: 0,
        explanation: "Subacute loss with pain on eye movement, colour desaturation and an RAPD in a young adult with a normal disc fits retrobulbar optic neuritis.",
        distractorRationale: ["", "Papilloedema causes bilateral swelling with preserved early function.", "Artery occlusion is abrupt, painless and shows retinal whitening.", "Cataract does not cause pain or an RAPD."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L24-02", version: 1, objectiveIds: ["L24-O3"], familyId: "F-L24-papilloedema-def", pool: "practice", difficulty: 1,
        stem: "The term papilloedema should be used for:",
        options: ["Any swollen optic disc", "Optic disc swelling caused by raised intracranial pressure", "A pale optic disc", "Disc drusen"],
        answerIndex: 1,
        explanation: "Papilloedema specifically denotes disc swelling from raised intracranial pressure; other swelling is described by its cause.",
        distractorRationale: ["Other causes produce disc swelling too.", "", "Pallor indicates atrophy.", "Drusen cause pseudopapilloedema."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L24-03", version: 1, objectiveIds: ["L24-O2"], familyId: "F-L24-naion-field", pool: "practice", difficulty: 2,
        stem: "Which field defect is most typical of non-arteritic anterior ischaemic optic neuropathy?",
        options: ["Bitemporal hemianopia", "Homonymous quadrantanopia", "Altitudinal defect (upper or lower half)", "Ring scotoma"],
        answerIndex: 2,
        explanation: "Ischaemia often affects the superior or inferior half of the disc, producing an altitudinal defect.",
        distractorRationale: ["Bitemporal loss localises to the chiasm.", "Homonymous loss is retrochiasmal.", "", "Ring scotomas suggest retinal dystrophy."],
        misconceptionIds: [], sources: ["K3", "C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L24-04", version: 1, objectiveIds: ["L24-O1"], familyId: "F-L24-colour", pool: "practice", difficulty: 2,
        stem: "Why is red desaturation useful at the bedside?",
        options: ["It measures intraocular pressure", "It diagnoses cataract", "It proves demyelinating disease", "Colour perception is often affected early in optic nerve dysfunction, so asymmetry supports an optic nerve cause"],
        answerIndex: 3,
        explanation: "Optic nerve disease often reduces colour saturation more than acuity; an interocular difference supports nerve involvement but is not a full diagnosis.",
        distractorRationale: ["It does not assess pressure.", "Cataract affects brightness differently and is seen on examination.", "Asymmetry supports a nerve problem, not a specific cause.", ""],
        misconceptionIds: ["M-FINDING-AS-CERTAINTY"], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L24-05", version: 1, objectiveIds: ["L24-O2"], familyId: "F-L24-gca-ischaemic", pool: "exam", difficulty: 2,
        stem: "A 76-year-old with severe sudden loss in one eye has a pale swollen disc and reports jaw pain when chewing. What is the priority?",
        options: ["Same-day assessment and treatment for suspected giant cell arteritis per protocol", "MRI for demyelination next month", "Reassure that ischaemic neuropathy is untreatable", "Spectacle review"],
        answerIndex: 0,
        explanation: "Arteritic ischaemic optic neuropathy threatens the fellow eye; urgent treatment per protocol is started while the diagnosis is confirmed.",
        distractorRationale: ["", "Demyelination does not fit the age and features, and delay is dangerous.", "Treatment aims to protect the other eye.", "Not refractive."],
        misconceptionIds: [], sources: ["C1", "C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L24-06", version: 1, objectiveIds: ["L24-O3", "L24-O1"], familyId: "F-L24-bilateral-swelling-workup", pool: "exam", difficulty: 3,
        stem: "A patient has bilateral swollen discs with normal acuity and colour vision, and no RAPD. Which conclusion is best supported?",
        options: ["Bilateral optic neuritis is confirmed", "Function is preserved, which fits papilloedema; check blood pressure and arrange urgent neuroimaging per protocol", "No further action because vision is normal", "Unilateral optic neuropathy is present"],
        answerIndex: 1,
        explanation: "Bilateral swelling with preserved function is the typical early pattern of papilloedema; normal vision does not reduce urgency. Hypertensive disc swelling must be considered.",
        distractorRationale: ["Neuritis usually reduces acuity and colour vision.", "", "Preserved function does not exclude raised intracranial pressure.", "Bilateral symmetric involvement explains the absent RAPD; nothing suggests unilateral disease."],
        misconceptionIds: ["M-AFFERENT-VS-EFFERENT"], sources: ["K1", "C2"], reviewStatus: "draft"
      }
    ],
    sources: ["K1", "K3", "C1", "C2"],
    reviewStatus: "draft"
  },
  {
    id: "L25",
    title: "Neuro-ophthalmology and diplopia",
    group: "Neuro-ophthalmology",
    emphasis: "Cranial nerve palsies, Horner syndrome, ocular myasthenia and neurologic localization",
    signature: "Localize from pupils, ptosis, motility and history",
    prerequisites: ["L09", "L10"],
    studios: ["LAB06", "LAB05", "LAB15"],
    activities: ["T021", "T022", "T025", "T029", "T030", "T031", "T032", "T079", "T084", "T085", "T087", "T088"],
    estMinutes: 55,
    objectives: [
      { id: "L25-O1", text: "Distinguish monocular from binocular diplopia and explain what each implies about the cause." },
      { id: "L25-O2", text: "Predict the motility, lid and pupil findings of third, fourth and sixth cranial nerve palsies." },
      { id: "L25-O3", text: "Recognise a pupil-involving third nerve palsy and acute painful Horner syndrome as emergencies and state why." },
      { id: "L25-O4", text: "Use the dark–light anisocoria comparison to decide which pupil is abnormal, separating efferent from afferent problems." },
      { id: "L25-O5", text: "Describe the variable, fatigable pattern of ocular myasthenia and why normal pupils matter in its recognition." }
    ],
    bridge: "L09 separated afferent (input) from efferent (output) pupil pathways; L10 taught ductions, versions and cover tests. Diplopia, ptosis and pupil asymmetry are clues that can be combined to localise a lesion to a muscle, the neuromuscular junction, a cranial nerve or the sympathetic chain.",
    essentials: [
      "Diplopia that persists when one eye is covered is monocular and usually optical (refractive error, cornea, lens); diplopia that resolves when either eye is covered is binocular and indicates misalignment.",
      "Third nerve palsy: ptosis, an eye that is typically down and out, limited elevation, depression and adduction, with or without a dilated pupil. A pupil-involving or painful third nerve palsy raises concern for a compressive lesion such as an aneurysm and is an emergency.",
      "Fourth nerve palsy: vertical (often torsional) diplopia, worse looking down and toward the opposite side, for example when reading or descending stairs; patients often tilt the head away from the affected side.",
      "Sixth nerve palsy: horizontal diplopia worse at distance and when looking toward the affected side, with limited abduction. Raised intracranial pressure can cause it without a local lesion.",
      "Horner syndrome: mild ptosis, a smaller pupil and anisocoria greater in dim light, sometimes reduced sweating. New painful Horner syndrome can indicate carotid dissection and needs urgent assessment.",
      "Ocular myasthenia: variable, fatigable ptosis and diplopia that does not fit one nerve, with normal pupils."
    ],
    full: [
      "Mechanism of diplopia: when visual axes are misaligned, the object falls on non-corresponding retinal points and is seen twice. The separation is greatest in the direction of action of the weak muscle. Monocular diplopia arises within one eye's optics and is not a neurological sign.",
      "Third nerve: supplies medial, superior and inferior recti, inferior oblique, levator and (via parasympathetic fibres on its surface) the pupil sphincter. Compression from outside (for example a posterior communicating artery aneurysm) tends to affect the superficial pupillary fibres early, giving a dilated pupil; microvascular ischaemia affects the core of the nerve and often spares the pupil. Pupil sparing, however, does not make every third nerve palsy safe, and new third nerve palsies are assessed urgently according to local guidance.",
      "Fourth nerve: supplies the superior oblique, which depresses the eye most in adduction and intorts it. Palsy gives vertical diplopia with hypertropia of the affected eye that increases in contralateral gaze and on head tilt toward the affected side. Common causes include congenital palsy (which can decompensate), head trauma and microvascular disease.",
      "Sixth nerve: supplies the lateral rectus. Palsy gives an esotropia worse at distance and in gaze toward the affected side. Because of its long intracranial course it can be affected by raised intracranial pressure; disc examination is therefore part of the assessment.",
      "Horner syndrome: interruption of the sympathetic pathway (central, preganglionic in chest or neck, or postganglionic along the carotid) causes mild ptosis from Müller muscle weakness, miosis and a dilation lag. Anisocoria is greater in the dark because the affected pupil fails to dilate. Pharmacological tests can confirm and sometimes localise, but they require source-reviewed protocols.",
      "Ocular myasthenia: antibodies impair neuromuscular transmission, so weakness worsens with use and improves with rest. Ptosis may increase with sustained upgaze; motility patterns can mimic any nerve palsy. Pupils are spared. Supportive bedside tests (such as ice-pack response) are interpreted alongside antibody testing and electrophysiology; a single response is not definitive.",
      "Urgency and localisation principles: combinations localise. Third, fourth and sixth nerve palsies with trigeminal sensory loss and Horner syndrome suggest the cavernous sinus; multiple cranial nerve signs or other neurological deficits prompt urgent neuroimaging. Imaging choice depends on the question (vascular imaging for aneurysm; MRI for brainstem or orbit when no metallic foreign body concern exists).",
      "Documentation: monocular or binocular, horizontal or vertical, direction of maximal separation, measured deviation in gaze positions, lid position, pupil sizes in light and dark, fatigability, associated neurological signs and the urgency pathway."
    ],
    deeper: [
      "The three-step test (which eye is higher, worse in which horizontal gaze, worse on which head tilt) helps identify a weak cyclovertical muscle, classically the superior oblique, but restrictive and skew deviations can mimic its pattern.",
      "Giant cell arteritis can cause diplopia from ischaemia of nerves or muscles in older adults, so its symptoms are asked about in new diplopia in this age group.",
      "Physiological anisocoria is common and usually similar in light and dark; anisocoria greater in light suggests an abnormally large pupil (efferent parasympathetic problem, pharmacological dilation or iris damage)."
    ],
    misconceptions: [
      "Mistake: a dilated pupil indicates an afferent defect. Correction: anisocoria reflects efferent pathways; afferent defects cause an RAPD with equal pupil sizes.",
      "Mistake: a pupil-sparing third nerve palsy never needs urgent assessment. Correction: pupil sparing makes compression less likely but does not exclude it; new palsies follow urgent local pathways.",
      "Mistake: myasthenia causes pupil abnormalities. Correction: pupils are normal in myasthenia; pupil involvement points elsewhere.",
      "Mistake: monocular diplopia indicates a cranial nerve palsy. Correction: monocular diplopia persists with the other eye covered and is usually optical."
    ],
    entryChallenge: {
      prompt: "A patient sees double. What single manoeuvre separates monocular from binocular diplopia?",
      answer: "Cover each eye in turn: if diplopia disappears with either eye covered it is binocular; if it persists in one eye alone, it is monocular."
    },
    contrast: {
      a: "Horner syndrome: mild ptosis, small pupil, anisocoria greater in the dark, normal motility.",
      b: "Third nerve palsy with pupil involvement: marked ptosis, large pupil, anisocoria greater in the light, limited elevation, depression and adduction.",
      discriminator: "Which pupil fails (dilation versus constriction), the degree of ptosis and the presence of motility limitation."
    },
    workedExample: {
      problem: "A 52-year-old has sudden headache, a drooping right lid and double vision. The right eye rests down and out; the right pupil is larger and reacts poorly to light. Localise and set urgency.",
      steps: [
        "Motility: limitation of elevation, depression and adduction with ptosis indicates a right third nerve palsy.",
        "Pupil: large and poorly reactive pupil indicates involvement of the parasympathetic fibres.",
        "Mechanism: pupil involvement with headache raises concern for compression, such as a posterior communicating artery aneurysm.",
        "Urgency: emergency vascular neuroimaging and neurosurgical/neurological pathway per local protocol.",
        "Document lid, pupils in light and dark, motility in each gaze position and the time of referral."
      ]
    },
    transfer: {
      prompt: "Given a 9-position gaze diagram showing the right eye higher, worse on left gaze and on right head tilt, state the probable weak muscle and one caveat.",
      modelAnswer: "Right superior oblique (right fourth nerve palsy). Caveat: restrictive disease, skew deviation and myasthenia can mimic the pattern, so the three-step result is supportive, not definitive."
    },
    items: [
      {
        id: "Q-L25-01", version: 1, objectiveIds: ["L25-O1"], familyId: "F-L25-monocular", pool: "practice", difficulty: 1,
        stem: "A patient's double vision persists when the left eye is covered and disappears when the right eye is covered. What does this indicate?",
        options: ["Binocular diplopia from a sixth nerve palsy", "Myasthenia", "Monocular diplopia arising in the right eye, usually optical", "Fourth nerve palsy"],
        answerIndex: 2,
        explanation: "Diplopia that persists with only the right eye viewing originates within that eye's optics (for example cataract or corneal irregularity).",
        distractorRationale: ["Binocular diplopia resolves with either eye covered.", "Myasthenia causes binocular diplopia.", "", "Fourth nerve palsy is binocular."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L25-02", version: 1, objectiveIds: ["L25-O2"], familyId: "F-L25-cn6", pool: "practice", difficulty: 2,
        stem: "Horizontal double vision is worst at distance and when looking to the left. The left eye does not abduct fully. Which nerve is affected?",
        options: ["Left sixth nerve", "Right sixth nerve", "Left fourth nerve", "Left third nerve"],
        answerIndex: 0,
        explanation: "The left lateral rectus (sixth nerve) abducts the left eye; weakness gives esotropia worse in left gaze and at distance.",
        distractorRationale: ["", "A right sixth palsy is worse in right gaze.", "Fourth nerve palsy causes vertical diplopia.", "Third nerve palsy limits adduction, not abduction."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L25-03", version: 1, objectiveIds: ["L25-O4"], familyId: "F-L25-horner-anisocoria", pool: "practice", difficulty: 2,
        stem: "Anisocoria is greater in dim light, the smaller left pupil dilates slowly and the left lid is slightly lower. Which interpretation is best?",
        options: ["Left RAPD", "Right third nerve palsy", "Left pharmacological dilation", "Left Horner syndrome (sympathetic, efferent problem)"],
        answerIndex: 3,
        explanation: "Anisocoria greater in the dark means the smaller pupil fails to dilate: a sympathetic (efferent) defect, consistent with Horner syndrome, especially with mild ptosis.",
        distractorRationale: ["RAPD does not change resting pupil size.", "A third nerve palsy enlarges the pupil on the same side and anisocoria is greater in light.", "Pharmacological dilation would make the pupil larger.", ""],
        misconceptionIds: ["M-AFFERENT-VS-EFFERENT"], sources: ["K1", "C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L25-04", version: 1, objectiveIds: ["L25-O5"], familyId: "F-L25-myasthenia", pool: "practice", difficulty: 2,
        stem: "A patient has ptosis that worsens through the day and with sustained upgaze, variable diplopia not fitting one nerve and normal pupils. Most likely category?",
        options: ["Third nerve palsy", "Neuromuscular junction disorder such as ocular myasthenia", "Horner syndrome", "Optic neuritis"],
        answerIndex: 1,
        explanation: "Fatigable, variable weakness with normal pupils suggests ocular myasthenia; confirmation uses several tests, not a single response.",
        distractorRationale: ["Third nerve palsy is not typically variable through the day.", "", "Horner gives a small pupil and mild constant ptosis.", "Neuritis affects vision, not lid and motility."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L25-05", version: 1, objectiveIds: ["L25-O3"], familyId: "F-L25-pupil-third", pool: "exam", difficulty: 3,
        stem: "A new painful third nerve palsy has a dilated, poorly reactive pupil. Why is this an emergency?",
        options: ["Because it proves myasthenia", "Because the pupil fibres on the surface of the nerve are affected early by compression, such as from an aneurysm", "Because it indicates angle closure", "Because the pupil will remain fixed forever"],
        answerIndex: 1,
        explanation: "External compression affects the superficial parasympathetic fibres; a pupil-involving third nerve palsy needs emergency vascular imaging per local protocol.",
        distractorRationale: ["Myasthenia spares the pupil.", "", "Angle closure gives a red painful eye with corneal haze, not a motility pattern.", "Prognosis is not the reason for urgency."],
        misconceptionIds: ["M-AFFERENT-VS-EFFERENT"], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L25-06", version: 1, objectiveIds: ["L25-O2"], familyId: "F-L25-cn4", pool: "exam", difficulty: 2,
        stem: "After head trauma, a patient has vertical double vision worse when reading and going downstairs, with a habitual head tilt to the left. Which nerve is most likely affected?",
        options: ["Left fourth nerve", "Right sixth nerve", "Right fourth nerve", "Left third nerve"],
        answerIndex: 2,
        explanation: "Superior oblique weakness causes vertical diplopia worse in downgaze; patients tilt the head away from the affected side, so a left tilt suggests a right fourth nerve palsy.",
        distractorRationale: ["A left palsy usually produces a right head tilt.", "Sixth nerve palsy is horizontal.", "", "Third nerve palsy causes ptosis and broader limitation."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      }
    ],
    sources: ["K1", "C1", "C2"],
    reviewStatus: "draft"
  },
  {
    id: "L26",
    title: "Pediatric ophthalmology",
    group: "Paediatrics, orbit & tumours",
    emphasis: "Amblyopia, strabismus, visual development, leukocoria and congenital disorders",
    signature: "Age-sensitive case reasoning and screening principles",
    prerequisites: ["L04", "L10"],
    studios: ["LAB14", "LAB06", "LAB04", "LAB02"],
    activities: ["T011", "T018", "T027", "T029", "T030", "T034", "T061", "T078"],
    estMinutes: 50,
    objectives: [
      { id: "L26-O1", text: "Define amblyopia and explain how strabismus, anisometropia and visual deprivation each cause it." },
      { id: "L26-O2", text: "Distinguish true strabismus from pseudostrabismus using the corneal reflex and cover test." },
      { id: "L26-O3", text: "Recognise an abnormal red reflex or leukocoria as a finding that requires urgent specialist evaluation, and list its main causes." },
      { id: "L26-O4", text: "Explain why cycloplegic refraction and age-appropriate acuity methods are used in children." }
    ],
    bridge: "L04 described refractive errors and anisometropia; L10 taught cover tests and the corneal light reflex. In children the visual system is still developing; a blurred or misaligned image during this sensitive period can permanently reduce vision in an otherwise healthy eye.",
    essentials: [
      "Amblyopia is reduced best-corrected vision caused by abnormal visual experience during development, not by a structural defect that explains the loss. It is usually unilateral.",
      "Causes: strabismus (one eye's image is suppressed), anisometropia (one eye is persistently blurred) and deprivation (for example congenital cataract or dense ptosis).",
      "Treatment principles: correct significant refractive error, remove any obstruction, then encourage use of the weaker eye (occlusion or penalisation of the better eye) under specialist supervision. Response is generally better when treatment begins earlier.",
      "A child can have straight-looking eyes and still have amblyopia (for example from anisometropia), so acuity testing of each eye matters.",
      "An abnormal or white red reflex (leukocoria) is a finding, not a diagnosis. Causes include retinoblastoma, congenital cataract, retinopathy of prematurity and other retinal disease; it needs urgent specialist evaluation.",
      "Pseudostrabismus, often from broad epicanthic folds, looks like a turn but the corneal reflexes are symmetrical and the cover test shows no movement."
    ],
    full: [
      "Mechanism: the visual cortex develops in response to clear, aligned input from both eyes. If one eye's input is blurred, misaligned or blocked, cortical connections from that eye are under-developed. The earlier and more severe the disturbance, the greater the risk; deprivation in early infancy is particularly harmful.",
      "Strabismus: esotropia (inward turn) and exotropia (outward turn) are the common horizontal forms. Accommodative esotropia is linked to hyperopia: focusing effort drives convergence; correcting the hyperopia with glasses can reduce or eliminate the deviation. A new strabismus may also be the presenting sign of serious disease (retinoblastoma, cataract, neurological disease), so the fundus and red reflex are examined.",
      "Assessment: choose an age-appropriate method of measuring vision (fixation and following, preferential looking, picture or letter-matching charts). Check fixation, corneal light reflexes, cover tests, motility, red reflex and fundus. Refraction in children is usually performed with cycloplegia because active accommodation can hide hyperopia.",
      "Interpretation: unequal acuity that does not improve with refractive correction, in the absence of structural disease, suggests amblyopia. A cover test movement indicates manifest deviation; symmetrical reflexes with no movement suggest pseudostrabismus. Incomplete cooperation limits what can be concluded and should be recorded.",
      "Leukocoria differential: retinoblastoma (a malignant tumour that must not be missed), congenital cataract, persistent fetal vasculature, Coats disease, retinopathy of prematurity, toxocariasis and large colobomas. A parent's photograph showing a white pupil should be taken seriously.",
      "Other congenital and developmental conditions: congenital cataract needs timely surgery to avoid deprivation amblyopia; congenital glaucoma can present with watering, light sensitivity and enlarged hazy corneas; premature infants at risk are screened for retinopathy of prematurity under national programmes.",
      "Urgency principles: leukocoria, suspected congenital cataract or glaucoma, and new strabismus with abnormal red reflex need urgent specialist referral. Amblyopia and refractive error need timely, not emergency, assessment, with treatment supervised by paediatric eye services.",
      "Documentation: age, method of acuity testing and result for each eye, cooperation level, red reflex description, alignment findings with the test used, cycloplegic refraction where done, and the referral urgency."
    ],
    deeper: [
      "Brückner testing compares both red reflexes simultaneously with a direct ophthalmoscope; asymmetry can indicate strabismus, anisometropia or media opacity, but it does not identify which.",
      "Stereoacuity tests are interpreted with age-appropriate expectations and the specific test used; a reduced result supports, but does not by itself diagnose, amblyopia or strabismus.",
      "Retinopathy of prematurity screening criteria and treatment timing are set nationally and change with evidence; they should be taken from current guidance."
    ],
    misconceptions: [
      "Mistake: lazy eye is one precise diagnosis. Correction: amblyopia (reduced vision) and strabismus (misalignment) are different, can occur separately and have different causes.",
      "Mistake: a white reflex means retinoblastoma. Correction: leukocoria is a finding with several causes; it requires urgent evaluation because retinoblastoma is one of them.",
      "Mistake: children grow out of a squint. Correction: true strabismus and amblyopia need assessment; delayed treatment reduces the chance of good vision.",
      "Mistake: a child's refraction can be taken without cycloplegia like an adult's. Correction: strong accommodation can mask hyperopia; cycloplegic refraction is usually needed."
    ],
    entryChallenge: {
      prompt: "Give three causes of amblyopia.",
      answer: "Strabismus, anisometropia (or high bilateral refractive error) and visual deprivation (for example congenital cataract or ptosis covering the pupil)."
    },
    contrast: {
      a: "Pseudostrabismus: broad epicanthic folds make the eyes look turned in; corneal reflexes are symmetrical and cover test shows no movement.",
      b: "True esotropia: corneal reflex displaced in the deviating eye; cover test shows the uncovered eye moving to take up fixation.",
      discriminator: "Corneal light reflex symmetry and movement on cover testing."
    },
    workedExample: {
      problem: "A 4-year-old fails a school vision check. Eyes appear straight. Acuity is reduced in the right eye. Cycloplegic refraction shows much more hyperopia in the right eye than the left. Fundus and red reflex are normal. Interpret.",
      steps: [
        "Alignment: straight eyes on cover test, so strabismus is not the cause.",
        "Refraction: significant anisometropia, with the right eye persistently blurred.",
        "Structure: normal media and fundus exclude deprivation or structural causes.",
        "Assessment: probable right anisometropic amblyopia.",
        "Plan principle: full refractive correction then supervised treatment to encourage use of the right eye; document method of acuity testing and cooperation."
      ]
    },
    transfer: {
      prompt: "A parent sends a flash photograph where one pupil looks white and the other red. Write a two-line message to a colleague stating the finding, the differential and the urgency.",
      modelAnswer: "Finding: unilateral abnormal (white) pupillary reflex in a photograph. Differential includes retinoblastoma, cataract, Coats disease and other retinal causes; needs urgent paediatric ophthalmology examination with dilated fundus assessment."
    },
    items: [
      {
        id: "Q-L26-01", version: 1, objectiveIds: ["L26-O1"], familyId: "F-L26-amblyopia-def", pool: "practice", difficulty: 1,
        stem: "Which statement best defines amblyopia?",
        options: ["Any misalignment of the eyes", "Reduced best-corrected vision from abnormal visual experience during development, without a structural cause sufficient to explain it", "Any refractive error in a child", "A congenital cataract"],
        answerIndex: 1,
        explanation: "Amblyopia is a developmental cortical deficit; strabismus, anisometropia and deprivation are causes, not the definition.",
        distractorRationale: ["Misalignment is strabismus, a possible cause.", "", "Refractive error may cause amblyopia but is not the same.", "Cataract can cause deprivation amblyopia."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L26-02", version: 1, objectiveIds: ["L26-O2"], familyId: "F-L26-pseudostrabismus", pool: "practice", difficulty: 1,
        stem: "An infant appears to have an inward turn. Corneal reflexes are symmetrical and the cover test shows no movement. Broad epicanthic folds are present. Most likely?",
        options: ["Pseudostrabismus", "Esotropia", "Sixth nerve palsy", "Retinoblastoma"],
        answerIndex: 0,
        explanation: "Symmetrical reflexes and no refixation movement indicate the eyes are aligned; the appearance comes from the lid folds.",
        distractorRationale: ["", "Esotropia would show reflex displacement and cover-test movement.", "A palsy would limit abduction and show deviation.", "No red reflex abnormality is described."],
        misconceptionIds: ["M-PHORIA-VS-TROPIA"], sources: ["K2", "C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L26-03", version: 1, objectiveIds: ["L26-O4"], familyId: "F-L26-accommodative", pool: "practice", difficulty: 2,
        stem: "A hyperopic 3-year-old develops an inward turn when focusing on near objects. What is the logical first assessment step?",
        options: ["Immediate squint surgery", "Patch the turning eye", "Cycloplegic refraction to reveal the full hyperopia", "Reassure that it will resolve"],
        answerIndex: 2,
        explanation: "Accommodative esotropia is driven by focusing effort in hyperopia; cycloplegic refraction reveals the full error so correction can be assessed.",
        distractorRationale: ["Refractive correction is assessed first.", "Patching the turning eye would penalise the wrong eye and is not a first step.", "", "True strabismus needs assessment."],
        misconceptionIds: [], sources: ["K2", "C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L26-04", version: 1, objectiveIds: ["L26-O1"], familyId: "F-L26-anisometropia", pool: "practice", difficulty: 2,
        stem: "A child's eyes look straight. Why might amblyopia still be present?",
        options: ["Straight eyes exclude amblyopia", "Anisometropia can blur one eye persistently without causing a visible turn", "Amblyopia only follows trauma", "Amblyopia only affects both eyes equally"],
        answerIndex: 1,
        explanation: "Unequal refractive error can cause amblyopia with normal alignment, so each eye's acuity is tested.",
        distractorRationale: ["Alignment does not exclude anisometropic amblyopia.", "", "Trauma is not a usual cause.", "Amblyopia is usually unilateral."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L26-05", version: 1, objectiveIds: ["L26-O3"], familyId: "F-L26-leukocoria", pool: "exam", difficulty: 2,
        stem: "During a routine check, a toddler has a white reflex in the left eye. What is the correct interpretation and action?",
        options: ["Diagnose retinoblastoma and inform the family", "Recheck at the next routine visit", "Record it as normal variation", "Record leukocoria as a finding and refer urgently for specialist dilated examination"],
        answerIndex: 3,
        explanation: "Leukocoria has several causes including retinoblastoma and cataract; it is a finding requiring urgent evaluation, not a diagnosis.",
        distractorRationale: ["A single finding does not establish a diagnosis.", "Delay is unsafe.", "A white reflex is abnormal.", ""],
        misconceptionIds: ["M-FINDING-AS-CERTAINTY"], sources: ["C1", "C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L26-06", version: 1, objectiveIds: ["L26-O1", "L26-O3"], familyId: "F-L26-deprivation", pool: "exam", difficulty: 2,
        stem: "Why is a dense congenital cataract in an infant treated as urgent?",
        options: ["It causes acute glaucoma in all cases", "It is always malignant", "Blocked visual input in the sensitive period can cause dense deprivation amblyopia", "It causes immediate retinal detachment"],
        answerIndex: 2,
        explanation: "A dense opacity prevents a clear image reaching the retina during development; timely surgery and optical rehabilitation reduce deprivation amblyopia.",
        distractorRationale: ["Glaucoma is a possible complication, not universal.", "Cataract is not malignant.", "", "Detachment is not the immediate risk."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      }
    ],
    sources: ["K2", "C1", "C2", "C3"],
    reviewStatus: "draft"
  },
  {
    id: "L27",
    title: "Orbit and thyroid eye disease",
    group: "Paediatrics, orbit & tumours",
    emphasis: "Preseptal/orbital disease, proptosis, thyroid eye disease and compressive risk",
    signature: "Distinguish location and identify threatening findings",
    prerequisites: ["L01", "L14"],
    studios: ["LAB15", "LAB16", "LAB06"],
    activities: ["T007", "T009", "T023", "T025", "T079", "T080", "T087"],
    estMinutes: 45,
    objectives: [
      { id: "L27-O1", text: "Distinguish preseptal from orbital cellulitis using the orbital septum as the anatomical boundary and the signs that cross it." },
      { id: "L27-O2", text: "Describe the lid, orbital and motility features of thyroid eye disease and explain their mechanism." },
      { id: "L27-O3", text: "Identify signs of compressive optic neuropathy and other sight-threatening orbital findings and state the urgency principle." },
      { id: "L27-O4", text: "Select appropriate imaging for suspected orbital disease and state its purpose." }
    ],
    bridge: "L01 described the orbit as a bony cone containing the globe, muscles, fat and optic nerve, with the orbital septum separating lids from orbital contents. L14 covered eyelid disease. Disease behind the septum can compress the optic nerve or spread intracranially, so location determines urgency.",
    essentials: [
      "Preseptal cellulitis affects lid tissues in front of the orbital septum: swollen red lids with normal vision, pupils and eye movements, and no proptosis.",
      "Orbital cellulitis involves tissues behind the septum and is an emergency: pain on eye movement, restricted movements, proptosis, chemosis, reduced vision or colour vision, or an RAPD. It often spreads from the sinuses.",
      "Suspected orbital cellulitis needs urgent hospital assessment, imaging and intravenous treatment per local protocol, with joint care from ophthalmology and ENT where appropriate.",
      "Thyroid eye disease is an autoimmune orbital inflammation, usually with Graves disease, causing lid retraction, lid lag, proptosis, restricted eye movements and ocular surface exposure.",
      "Compressive optic neuropathy in thyroid eye disease (reduced acuity or colour vision, RAPD, field defect) is sight-threatening and needs urgent specialist care.",
      "Smoking increases the risk and severity of thyroid eye disease; stopping is an important part of management."
    ],
    full: [
      "Anatomy and mechanism: the orbital septum, extending from the orbital rim to the tarsal plates, limits spread of infection from lids into the orbit. Orbital infection often arises from adjacent ethmoid sinusitis through thin bone; it can form subperiosteal or orbital abscesses and, rarely, extend to the cavernous sinus or brain.",
      "Presentation and signs: both preseptal and orbital cellulitis cause red swollen lids. Signs that indicate orbital involvement are proptosis, painful or limited eye movement, chemosis, reduced acuity, reduced colour vision and an RAPD. Children may be difficult to examine, which itself lowers the threshold for urgent assessment.",
      "Imaging: contrast-enhanced CT of orbits and sinuses is commonly used to confirm orbital involvement, detect abscess and assess sinuses. MRI is used for some soft tissue and intracranial questions, avoiding it when a metallic foreign body is a concern.",
      "Thyroid eye disease mechanism: autoimmune activation of orbital fibroblasts causes inflammation, enlargement of extraocular muscles and expansion of orbital fat. Lid retraction (upper lid above its usual level) and lid lag are characteristic. Restrictive myopathy commonly affects the inferior and medial recti, producing diplopia, especially on upgaze. Proptosis can expose the cornea, causing dryness and keratopathy.",
      "Activity and severity: thyroid eye disease typically has an active inflammatory phase followed by a stable inactive phase. Activity (pain, redness, swelling) and severity (proptosis, diplopia, optic nerve and corneal threat) are assessed separately because they guide different treatments.",
      "Differential of proptosis: thyroid eye disease (a common cause in adults, often bilateral but can be asymmetric), orbital cellulitis, orbital tumours (lymphoma, vascular lesions, metastases; rhabdomyosarcoma in children), idiopathic orbital inflammation and carotid-cavernous fistula. Rapid progression, pain, a mass or atypical features prompt imaging.",
      "Urgency and management principles: orbital cellulitis and compressive optic neuropathy are emergencies. Sight-threatening corneal exposure needs urgent protection. Management of thyroid eye disease is coordinated with endocrinology; treatment ranges from lubrication and smoking cessation to immunosuppression, orbital radiotherapy or surgery decided by specialists.",
      "Documentation: lid position and measurements, exophthalmometry with the method used, motility in each direction, acuity, colour vision, pupils (RAPD), corneal staining, and signs that distinguish preseptal from orbital involvement."
    ],
    deeper: [
      "Exophthalmometry readings depend on the instrument, the examiner and the population; an asymmetry between eyes, or change over time with the same method, is often more informative than a single absolute reading.",
      "Idiopathic orbital inflammation can mimic infection with pain and swelling; imaging and response to treatment are interpreted carefully, and biopsy may be needed if atypical.",
      "Carotid-cavernous fistula can cause pulsatile proptosis, dilated corkscrew episcleral vessels, raised pressure and an orbital bruit; it is a vascular cause of a red, proptotic eye."
    ],
    misconceptions: [
      "Mistake: red swollen lids always mean orbital cellulitis. Correction: preseptal cellulitis also causes this; look for proptosis, painful or limited movement, reduced vision and RAPD.",
      "Mistake: thyroid eye disease only occurs when thyroid tests are abnormal. Correction: it can precede, accompany or follow thyroid dysfunction and can occur when the patient is euthyroid.",
      "Mistake: proptosis measurement alone determines danger in thyroid eye disease. Correction: compressive optic neuropathy can occur without marked proptosis; test optic nerve function."
    ],
    entryChallenge: {
      prompt: "Which anatomical structure separates preseptal from orbital cellulitis?",
      answer: "The orbital septum."
    },
    contrast: {
      a: "Preseptal cellulitis: lid swelling and redness; vision, pupils and movements normal; no proptosis.",
      b: "Orbital cellulitis: lid swelling plus proptosis, painful restricted movements, chemosis, possibly reduced vision and RAPD.",
      discriminator: "Signs of orbital involvement: proptosis, ophthalmoplegia, optic nerve dysfunction."
    },
    workedExample: {
      problem: "A 45-year-old with Graves disease reports gradually reduced vision in the right eye. Both eyes are proptosed with lid retraction. Right acuity and colour vision are reduced and there is a right RAPD. Interpret.",
      steps: [
        "Context: thyroid eye disease with bilateral proptosis and lid retraction.",
        "Function: reduced acuity, colour vision and an RAPD indicate right optic nerve dysfunction.",
        "Mechanism: enlarged muscles at the orbital apex compressing the optic nerve.",
        "Urgency: sight-threatening compressive optic neuropathy; urgent specialist orbital care per protocol.",
        "Also: assess corneal exposure and motility, document measurements and advise smoking cessation."
      ]
    },
    transfer: {
      prompt: "Draw an axial sketch of the orbit showing the septum, globe, extraocular muscles and optic nerve. Mark where infection, muscle enlargement and an abscess each cause their key signs.",
      modelAnswer: "Infection anterior to the septum gives lid signs only; posterior to it gives proptosis and restricted motility. Enlarged muscles crowd the apex and compress the optic nerve. A subperiosteal abscess adjacent to the ethmoid sinus displaces the globe and limits movement."
    },
    items: [
      {
        id: "Q-L27-01", version: 1, objectiveIds: ["L27-O1"], familyId: "F-L27-preseptal-vs-orbital", pool: "practice", difficulty: 1,
        stem: "A child has a red, swollen upper lid. Which finding indicates orbital rather than preseptal cellulitis?",
        options: ["Lid tenderness", "Painful restricted eye movement with proptosis", "Mild fever", "Recent insect bite"],
        answerIndex: 1,
        explanation: "Proptosis and painful or limited eye movement indicate involvement behind the orbital septum.",
        distractorRationale: ["Tenderness occurs in both.", "", "Fever can occur in both.", "A bite suggests a preseptal source but does not exclude orbital spread."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L27-02", version: 1, objectiveIds: ["L27-O2"], familyId: "F-L27-ted-lid", pool: "practice", difficulty: 1,
        stem: "Which lid sign is characteristic of thyroid eye disease?",
        options: ["Upper lid retraction with lid lag on downgaze", "Ptosis with a small pupil", "Fatigable ptosis", "A painless lid lump"],
        answerIndex: 0,
        explanation: "Lid retraction and lag on downgaze are characteristic of thyroid eye disease.",
        distractorRationale: ["", "That suggests Horner syndrome.", "That suggests myasthenia.", "That suggests a chalazion or tumour."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L27-03", version: 1, objectiveIds: ["L27-O3"], familyId: "F-L27-don", pool: "practice", difficulty: 2,
        stem: "In thyroid eye disease, which combination suggests compressive optic neuropathy?",
        options: ["Gritty eyes and redness", "Lid retraction alone", "Reduced colour vision, reduced acuity and an RAPD", "Diplopia in upgaze alone"],
        answerIndex: 2,
        explanation: "Optic nerve dysfunction signs indicate compression at the orbital apex, a sight-threatening complication.",
        distractorRationale: ["These suggest surface exposure.", "Lid retraction does not indicate nerve compression.", "", "Restrictive diplopia reflects muscle involvement, not nerve compression."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L27-04", version: 1, objectiveIds: ["L27-O4"], familyId: "F-L27-imaging", pool: "practice", difficulty: 2,
        stem: "Suspected orbital cellulitis with sinus disease is being assessed for a subperiosteal abscess. Which imaging is commonly used first?",
        options: ["Plain skull radiograph", "Corneal topography", "Contrast-enhanced CT of orbits and sinuses", "Fundus photography"],
        answerIndex: 2,
        explanation: "CT shows orbital and sinus involvement and abscesses quickly; MRI may be used for some questions where safe.",
        distractorRationale: ["Plain films do not adequately show orbital soft tissue.", "Topography measures the cornea.", "", "Fundus images do not show the orbit."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L27-05", version: 1, objectiveIds: ["L27-O1", "L27-O3"], familyId: "F-L27-child-swelling", pool: "exam", difficulty: 2,
        stem: "A 7-year-old with a cold has a swollen red lid, pain on eye movement, mild proptosis and reduced colour vision in the same eye. What is the priority?",
        options: ["Oral treatment and routine review", "Warm compresses", "Reassure as preseptal cellulitis", "Emergency hospital assessment with imaging and intravenous treatment per protocol"],
        answerIndex: 3,
        explanation: "Proptosis, painful movement and optic nerve dysfunction indicate orbital cellulitis threatening sight; this is an emergency.",
        distractorRationale: ["Inadequate for orbital involvement.", "Not sufficient.", "Orbital signs are present.", ""],
        misconceptionIds: [], sources: ["C1", "C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L27-06", version: 1, objectiveIds: ["L27-O2"], familyId: "F-L27-ted-exposure", pool: "exam", difficulty: 2,
        stem: "A patient with marked thyroid eye disease cannot fully close the eyes and has a painful red eye. Which examination is most important next?",
        options: ["Fluorescein staining to look for exposure keratopathy", "Gonioscopy", "Colour plate testing only", "Lacrimal irrigation"],
        answerIndex: 0,
        explanation: "Proptosis and lid retraction can expose the cornea; staining identifies epithelial damage that may progress to ulceration.",
        distractorRationale: ["", "The angle is not the main concern here.", "Optic nerve testing is important but does not assess the cornea.", "Drainage is not the problem."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      }
    ],
    sources: ["C1", "C2"],
    reviewStatus: "draft"
  },
  {
    id: "L28",
    title: "Trauma and chemical injury",
    group: "Emergency & integration",
    emphasis: "Abrasion, foreign body, hyphema, open globe, chemical injury and orbital trauma",
    signature: "Prioritize safe immediate actions in a branching case",
    prerequisites: ["L08", "L15"],
    studios: ["LAB16", "LAB09", "LAB08", "LAB13", "LAB15"],
    activities: ["T001", "T041", "T047", "T051", "T052", "T075", "T087"],
    estMinutes: 55,
    objectives: [
      { id: "L28-O1", text: "State why chemical injury requires immediate copious irrigation before detailed history or examination." },
      { id: "L28-O2", text: "Recognise signs of a suspected open globe and list actions that must be avoided (pressure, tonometry, manipulation)." },
      { id: "L28-O3", text: "Identify when an intraocular foreign body should be suspected and choose safe imaging." },
      { id: "L28-O4", text: "Describe the assessment of corneal abrasion, hyphema and orbital floor fracture and their warning signs." }
    ],
    bridge: "L08 taught prioritisation in history and examination; L15 described the corneal epithelium and fluorescein. In trauma the order of actions matters: some injuries need treatment before history, and some must not be examined in the usual way.",
    essentials: [
      "Chemical injury is an emergency: irrigate immediately and copiously, before a detailed history, and continue until the surface pH is neutral according to local protocol. Alkalis penetrate deeply and are often more damaging.",
      "Suspected open globe: protect the eye with a rigid shield, avoid any pressure on the globe, do not perform tonometry or lid eversion, and arrange emergency ophthalmic care.",
      "High-velocity injuries (for example hammering metal on metal) can leave an intraocular foreign body with little to see; imaging is needed and MRI is contraindicated when a metallic foreign body is possible.",
      "Corneal abrasion stains with fluorescein; a vertical linear pattern suggests a foreign body under the upper lid.",
      "Hyphema is blood in the anterior chamber after blunt trauma; it needs specialist assessment because pressure can rise and rebleeding can occur.",
      "Orbital floor fracture may cause restricted upgaze, double vision, numbness of the cheek and enophthalmos; in children, entrapment can occur with little external bruising and is urgent."
    ],
    full: [
      "Chemical injury mechanism: alkalis saponify cell membranes and penetrate into the anterior chamber; acids coagulate surface proteins, which can limit penetration. Damage to limbal stem cells and vessels (limbal ischaemia) predicts poor healing. Immediate irrigation dilutes and removes the agent; the fornices are swept and particles removed, then pH is checked and irrigation continued as needed. A full history and examination follow, and the injury is graded by a specialist.",
      "Open globe signs: a full-thickness wound of cornea or sclera; an irregular or peaked pupil pointing toward the wound; prolapsed uveal tissue; a shallow or flat anterior chamber; extensive subconjunctival haemorrhage with chemosis; markedly reduced vision; and a positive Seidel test (aqueous diluting fluorescein). A negative Seidel result does not exclude an open globe.",
      "Open globe principles: any pressure can extrude intraocular contents, so tonometry, lid eversion and forcing the lids are avoided. A rigid shield (not a pressure patch) is applied; topical medications are avoided unless directed by ophthalmology; analgesia, antiemesis, fasting and tetanus status are addressed per protocol; CT imaging is used to look for foreign bodies and fractures.",
      "Foreign bodies: superficial corneal foreign bodies are common in metalwork and may leave a rust ring. A history of high-velocity metal fragments, a small entry wound, iris transillumination defect, localised lens opacity or vitreous haemorrhage raises suspicion of an intraocular foreign body. CT is the usual imaging; MRI is contraindicated if metal is possible. B-scan may help but is avoided or done with great care if globe integrity is uncertain.",
      "Corneal abrasion: pain, watering and photophobia after a scratch, with fluorescein staining in the defect. Lid eversion looks for a retained subtarsal foreign body (if the globe is intact). Contact lens wearers with an epithelial defect need consideration of infection. Abrasions with an infiltrate are managed as possible keratitis.",
      "Hyphema: blood from torn iris or ciliary vessels settles inferiorly. Concerns include raised pressure, rebleeding, corneal blood staining and associated injuries (angle recession, lens or retinal damage). Patients with sickle cell disease or trait are at increased risk of pressure-related damage. Specialist management follows local protocol.",
      "Orbital trauma: blowout fractures of the thin orbital floor or medial wall can trap the inferior rectus or orbital tissue, limiting upgaze and causing diplopia, with infraorbital nerve numbness. In children, a trapdoor fracture can entrap muscle with a white, quiet eye and vagal symptoms (nausea, bradycardia) and needs urgent surgical assessment. Retrobulbar haemorrhage, with a tense proptotic eye, rising pressure and an RAPD, is an emergency requiring immediate decompression by trained clinicians.",
      "Documentation: mechanism and time of injury, chemical type if known, time irrigation started and pH checks, acuity, findings with and without examination limitations (for example tonometry deliberately not performed due to suspected open globe), imaging requested and why."
    ],
    deeper: [
      "Combined injuries (for example chemical splash with a penetrating fragment) need branch-specific reasoning; a simple-exposure protocol should not be applied blindly.",
      "Angle recession after blunt trauma can lead to glaucoma years later, so patients with significant hyphema or angle injury may need long-term pressure surveillance.",
      "Sympathetic ophthalmia, a rare bilateral granulomatous uveitis after penetrating injury to one eye, is one reason open-globe injuries receive careful long-term follow-up."
    ],
    misconceptions: [
      "Mistake: take a full history and measure acuity before irrigating a chemical injury. Correction: irrigate first; history and acuity follow once irrigation is under way.",
      "Mistake: measuring pressure is part of every trauma examination. Correction: in a suspected open globe, tonometry and any pressure on the eye must be avoided.",
      "Mistake: a negative Seidel test excludes an open globe. Correction: a wound can self-seal or be posterior; clinical suspicion and imaging still guide management.",
      "Mistake: MRI is the best scan for any eye injury. Correction: MRI is contraindicated when a metallic foreign body is possible; CT is used."
    ],
    entryChallenge: {
      prompt: "A worker splashes an alkaline cleaner into one eye. What is the first action?",
      answer: "Immediate copious irrigation, before a detailed history, continuing per protocol until pH is neutral."
    },
    contrast: {
      a: "Corneal abrasion: epithelial defect staining with fluorescein, round pupil, deep anterior chamber, intact globe.",
      b: "Open globe: full-thickness wound, peaked pupil, shallow chamber, uveal prolapse, possible positive Seidel.",
      discriminator: "Pupil shape, chamber depth and full-thickness signs; the second forbids pressure and tonometry."
    },
    workedExample: {
      problem: "A man was hammering a steel chisel and felt something hit his right eye. Vision is slightly reduced. There is a tiny corneal wound and a small focal lens opacity. Plan safe assessment.",
      steps: [
        "Mechanism: high-velocity metal raises suspicion of an intraocular foreign body.",
        "Signs: corneal wound and lens opacity support penetration; treat as suspected open globe.",
        "Avoid: tonometry, lid eversion and pressure; apply a rigid shield.",
        "Imaging: CT of orbits; MRI is contraindicated because metal is possible.",
        "Arrange emergency ophthalmic care, address tetanus, analgesia and fasting per protocol, and document what was deliberately not performed."
      ]
    },
    transfer: {
      prompt: "Write the first five actions, in order, for an isolated alkali splash in a triage note format.",
      modelAnswer: "1. Start immediate copious irrigation. 2. Instil topical anaesthetic if available to aid irrigation, without delaying it. 3. Sweep fornices and remove particles. 4. Check pH and continue irrigation until neutral per protocol. 5. Then measure acuity, examine, document limbal findings and arrange urgent ophthalmic review."
    },
    items: [
      {
        id: "Q-L28-01", version: 1, objectiveIds: ["L28-O1"], familyId: "F-L28-chemical-first", pool: "practice", difficulty: 1,
        stem: "A patient arrives seconds after a chemical splash to the eye. What should happen first?",
        options: ["Take a full history of the chemical", "Measure visual acuity", "Start immediate copious irrigation", "Arrange imaging"],
        answerIndex: 2,
        explanation: "Delay increases tissue damage; irrigation starts at once and history and acuity follow.",
        distractorRationale: ["History can be taken during or after irrigation.", "Acuity follows initial irrigation in chemical injury.", "", "Imaging is not a first step for an isolated chemical splash."],
        misconceptionIds: [], sources: ["K6", "C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L28-02", version: 1, objectiveIds: ["L28-O2"], familyId: "F-L28-open-globe-signs", pool: "practice", difficulty: 2,
        stem: "After a penetrating injury, which sign most suggests an open globe?",
        options: ["A teardrop-shaped (peaked) pupil pointing toward a wound", "Watery discharge", "Itching", "A small subconjunctival haemorrhage without other signs"],
        answerIndex: 0,
        explanation: "Iris drawn toward a full-thickness wound distorts the pupil; with a shallow chamber or uveal prolapse it strongly suggests an open globe.",
        distractorRationale: ["", "Non-specific.", "Suggests allergy.", "A small haemorrhage alone is non-specific, though extensive haemorrhage with chemosis is a concern."],
        misconceptionIds: [], sources: ["K5", "C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L28-03", version: 1, objectiveIds: ["L28-O3"], familyId: "F-L28-hammering", pool: "practice", difficulty: 2,
        stem: "A patient felt something strike the eye while hammering metal on metal. Which imaging approach is appropriate if an intraocular foreign body is suspected?",
        options: ["MRI of the orbits", "CT of the orbits, avoiding MRI", "No imaging if the eye looks quiet", "Corneal topography"],
        answerIndex: 1,
        explanation: "A metallic foreign body may move in a magnetic field; CT is the safe first imaging. A quiet-looking eye does not exclude a small entry wound.",
        distractorRationale: ["MRI is contraindicated when metal may be present.", "", "Small fragments can enter with minimal signs.", "Topography does not detect foreign bodies."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L28-04", version: 1, objectiveIds: ["L28-O4"], familyId: "F-L28-abrasion", pool: "practice", difficulty: 1,
        stem: "A patient with an intact globe has several vertical linear fluorescein-staining scratches on the upper cornea. What should be checked?",
        options: ["Intraocular pressure only", "The fundus only", "Colour vision", "Under the upper lid for a retained foreign body (lid eversion)"],
        answerIndex: 3,
        explanation: "Vertical linear abrasions suggest a subtarsal foreign body scratching with each blink; lid eversion is appropriate when the globe is intact.",
        distractorRationale: ["Pressure does not explain the pattern.", "The pattern points to the lid.", "Colour vision is unrelated.", ""],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L28-05", version: 1, objectiveIds: ["L28-O2"], familyId: "F-L28-open-globe-avoid", pool: "exam", difficulty: 2,
        stem: "A suspected open-globe injury is being assessed. Which action is appropriate?",
        options: ["Measure pressure with applanation tonometry", "Evert the upper lid to look for foreign bodies", "Apply a rigid shield without pressure and arrange emergency ophthalmic care", "Apply a firm pressure patch"],
        answerIndex: 2,
        explanation: "Any pressure risks extrusion of intraocular contents; protect with a rigid shield and avoid tonometry, eversion and pressure patches.",
        distractorRationale: ["Tonometry applies pressure to the globe.", "Eversion can press on the globe.", "", "Pressure patches compress the eye."],
        misconceptionIds: [], sources: ["K5", "C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L28-06", version: 1, objectiveIds: ["L28-O4"], familyId: "F-L28-orbital-floor", pool: "exam", difficulty: 2,
        stem: "After a punch to the eye, a patient has double vision on looking up, limited upgaze and numbness of the cheek. Most likely injury?",
        options: ["Orbital floor (blowout) fracture", "Sixth nerve palsy", "Retinal detachment", "Corneal abrasion"],
        answerIndex: 0,
        explanation: "Floor fracture can trap the inferior rectus or orbital tissue (limited upgaze) and injure the infraorbital nerve (cheek numbness).",
        distractorRationale: ["", "Sixth nerve palsy limits abduction.", "Detachment does not restrict motility or cause numbness.", "Abrasion causes pain and watering, not motility restriction."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      }
    ],
    sources: ["K5", "K6", "C1", "C2"],
    reviewStatus: "draft"
  },
  {
    id: "L29",
    title: "Systemic disease and the eye",
    group: "Therapeutics & systemic",
    emphasis: "Diabetes, vascular disease, autoimmune/infectious disease and relevant systemic evaluation",
    signature: "Connect an ocular presentation to a systemic differential",
    prerequisites: ["L16", "L17", "L20", "L22"],
    studios: ["LAB18", "LAB11", "LAB08", "LAB12"],
    activities: ["T037", "T043", "T046", "T062", "T065", "T066"],
    estMinutes: 45,
    objectives: [
      { id: "L29-O1", text: "Link common ocular findings (uveitis, scleritis, retinal haemorrhages, vasculitis) to systemic disease categories." },
      { id: "L29-O2", text: "Explain why some systemic conditions require eye screening even when the patient has no symptoms." },
      { id: "L29-O3", text: "Recognise infectious causes of intraocular inflammation in immunosuppressed and other at-risk patients." },
      { id: "L29-O4", text: "Interpret an ocular finding as supportive rather than diagnostic of a systemic disease, and choose the next systemic evaluation." }
    ],
    bridge: "L16 and L17 covered scleritis and uveitis; L20 and L22 showed how diabetes and vascular disease change the retina. Many systemic conditions first declare themselves in the eye, and many ocular inflammations need a systemic search for their cause.",
    essentials: [
      "The eye shows vascular disease directly: diabetes, hypertension, emboli and vasculitis produce visible retinal changes.",
      "Anterior uveitis is associated with HLA-B27-related conditions (axial spondyloarthritis, reactive arthritis, inflammatory bowel disease) and sarcoidosis; juvenile idiopathic arthritis-associated uveitis is often painless and found only by screening.",
      "Scleritis is associated with systemic autoimmune disease such as rheumatoid arthritis and vasculitides; necrotising scleritis can indicate active systemic disease.",
      "Infections can cause ocular inflammation: syphilis, tuberculosis, herpes viruses, toxoplasmosis and, in immunosuppressed patients, cytomegalovirus retinitis.",
      "Several systemic medications have ocular toxicity requiring monitoring (L30).",
      "An ocular finding usually narrows a systemic differential rather than confirming a diagnosis; the systemic evaluation is targeted by the ocular pattern and the history."
    ],
    full: [
      "Mechanism: the eye has a dense vascular supply, immune-privileged compartments and tissues (uvea, sclera, retina) that share antigens or vascular structure with joints, skin, kidneys and the nervous system. Systemic inflammation, infection and vascular disease therefore express themselves in recognisable ocular patterns.",
      "Uveitis associations: acute unilateral recurrent anterior uveitis with back pain and stiffness suggests HLA-B27-associated spondyloarthritis. Granulomatous uveitis with lung or skin findings suggests sarcoidosis. Uveitis with oral and genital ulcers suggests Behçet disease. Uveitis in juvenile idiopathic arthritis is often asymptomatic, so affected children are screened according to risk-based schedules.",
      "Scleritis and surface disease: rheumatoid arthritis causes dry eye, scleritis and peripheral ulcerative keratitis; granulomatosis with polyangiitis can cause scleritis and orbital disease. Severe or necrotising scleritis warrants urgent coordination with rheumatology because it can signal active systemic vasculitis.",
      "Infections: syphilis can mimic many uveitis patterns and is tested for in many uveitis work-ups; tuberculosis can cause choroiditis and other patterns; toxoplasmosis typically causes a focal retinochoroiditis near an old scar; cytomegalovirus retinitis (with haemorrhagic necrotic retinitis) occurs with severe immunosuppression. Endogenous endophthalmitis can follow bloodstream infection.",
      "Haematological and vascular: retinal haemorrhages, including white-centred haemorrhages, can occur in anaemia, leukaemia and endocarditis; none of these signs is specific. Sickle cell disease can cause peripheral retinal ischaemia and neovascularisation. Carotid disease can cause emboli and ocular ischaemia.",
      "Neurological and endocrine: multiple sclerosis (optic neuritis, internuclear ophthalmoplegia), myasthenia (ptosis, diplopia), thyroid disease (L27) and pituitary tumours (bitemporal field loss) present to eye services.",
      "Approach and urgency: identify the ocular pattern precisely (location of inflammation, granulomatous or not, unilateral or bilateral), take a targeted systemic history, and choose systemic investigations that answer specific questions. Infectious causes must be considered before immunosuppression. Urgent pathways apply to suspected endophthalmitis, CMV retinitis, giant cell arteritis and necrotising scleritis.",
      "Documentation: the ocular pattern, the systemic features sought and found, investigations requested with their purpose, and the working diagnosis labelled as associated, suspected or confirmed."
    ],
    deeper: [
      "Masquerade syndromes (for example intraocular lymphoma in older adults) can mimic uveitis and should be considered when inflammation is atypical or unresponsive.",
      "In pregnancy, pre-existing diabetic retinopathy can progress, and hypertensive disorders of pregnancy can cause retinal changes; monitoring follows local guidance."
    ],
    misconceptions: [
      "Mistake: a characteristic ocular sign confirms a systemic disease. Correction: most signs are supportive; systemic diagnosis requires clinical and laboratory confirmation.",
      "Mistake: children with arthritis would complain if they had uveitis. Correction: JIA-associated uveitis is often painless and white; screening is essential.",
      "Mistake: start immunosuppression for all uveitis. Correction: infectious causes such as syphilis, tuberculosis and herpes viruses must be considered first."
    ],
    entryChallenge: {
      prompt: "Name two systemic conditions associated with recurrent acute anterior uveitis.",
      answer: "Examples: HLA-B27-associated axial spondyloarthritis, reactive arthritis, inflammatory bowel disease, psoriatic arthritis, sarcoidosis."
    },
    contrast: {
      a: "HLA-B27-associated uveitis: acute, unilateral, recurrent, painful red eye, non-granulomatous.",
      b: "JIA-associated uveitis: chronic, often bilateral, painless and white, detected by screening.",
      discriminator: "Symptom pattern and the need for screening; the second is silent until complications occur."
    },
    workedExample: {
      problem: "A 30-year-old man has a second episode of painful photophobic red left eye with anterior chamber cells. He reports low back pain and morning stiffness that improve with exercise. Plan.",
      steps: [
        "Ocular pattern: recurrent acute unilateral non-granulomatous anterior uveitis.",
        "Systemic clue: inflammatory back pain suggests axial spondyloarthritis.",
        "Targeted evaluation: HLA-B27 testing and rheumatology assessment with appropriate imaging, per local practice.",
        "Treat uveitis under ophthalmology supervision and monitor pressure.",
        "Document the association as suspected until systemically confirmed."
      ]
    },
    transfer: {
      prompt: "Make a mind map with the eye in the centre and four branches: vascular, inflammatory, infectious, neurological. Add two ocular signs and one systemic condition to each.",
      modelAnswer: "Vascular: cotton-wool spots, emboli → hypertension/carotid disease. Inflammatory: anterior uveitis, scleritis → spondyloarthritis/rheumatoid arthritis. Infectious: necrotising retinitis, focal retinochoroiditis → CMV/toxoplasmosis. Neurological: optic neuritis, bitemporal field loss → multiple sclerosis/pituitary tumour."
    },
    items: [
      {
        id: "Q-L29-01", version: 1, objectiveIds: ["L29-O2"], familyId: "F-L29-jia", pool: "practice", difficulty: 1,
        stem: "Why are children with juvenile idiopathic arthritis offered regular eye screening?",
        options: ["Because they always have painful red eyes", "Because associated uveitis is often painless and white and can cause damage before symptoms", "Because they need glasses", "Because arthritis causes cataract directly"],
        answerIndex: 1,
        explanation: "JIA-associated anterior uveitis is often asymptomatic; screening detects it before complications such as cataract, glaucoma and band keratopathy.",
        distractorRationale: ["The uveitis is typically quiet.", "", "Refraction is not the reason.", "Cataract is a complication of uveitis and its treatment."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L29-02", version: 1, objectiveIds: ["L29-O1"], familyId: "F-L29-hla-b27", pool: "practice", difficulty: 2,
        stem: "A young man has recurrent acute unilateral anterior uveitis and inflammatory low back pain. Which systemic association is most likely?",
        options: ["HLA-B27-associated axial spondyloarthritis", "Diabetes", "Graves disease", "Migraine"],
        answerIndex: 0,
        explanation: "This pattern is classically associated with HLA-B27-related spondyloarthritis.",
        distractorRationale: ["", "Diabetes does not typically cause this pattern.", "Graves disease causes orbital disease.", "Migraine does not cause uveitis."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L29-03", version: 1, objectiveIds: ["L29-O3"], familyId: "F-L29-cmv", pool: "practice", difficulty: 2,
        stem: "A severely immunosuppressed patient has areas of white necrotic retina with haemorrhage. Which diagnosis must be considered urgently?",
        options: ["Dry AMD", "Cytomegalovirus retinitis", "Hypertensive retinopathy", "Retinitis pigmentosa"],
        answerIndex: 1,
        explanation: "Haemorrhagic necrotising retinitis in severe immunosuppression suggests CMV retinitis, which threatens sight and needs urgent treatment.",
        distractorRationale: ["Dry AMD lacks necrosis and haemorrhage.", "", "Hypertensive changes are vascular, not necrotising retinitis.", "Retinitis pigmentosa is an inherited degeneration."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L29-04", version: 1, objectiveIds: ["L29-O3", "L29-O4"], familyId: "F-L29-syphilis", pool: "practice", difficulty: 2,
        stem: "Before starting immunosuppressive treatment for an atypical uveitis, which principle is most important?",
        options: ["Immunosuppression is always safe", "Only HLA-B27 needs testing", "Consider and test for infectious causes such as syphilis and tuberculosis", "No investigation is needed in uveitis"],
        answerIndex: 2,
        explanation: "Infections can mimic non-infectious uveitis and can worsen with immunosuppression; targeted testing comes first.",
        distractorRationale: ["Immunosuppression can worsen infection.", "Other causes must be considered.", "", "Atypical uveitis needs targeted investigation."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L29-05", version: 1, objectiveIds: ["L29-O4"], familyId: "F-L29-roth", pool: "exam", difficulty: 3,
        stem: "A febrile patient has several white-centred retinal haemorrhages. Which statement is most defensible?",
        options: ["The finding confirms endocarditis", "The finding is normal", "The finding excludes leukaemia", "The finding is non-specific but supports a search for systemic causes such as endocarditis or haematological disease"],
        answerIndex: 3,
        explanation: "White-centred haemorrhages occur in several systemic conditions; they guide systemic evaluation but do not confirm one diagnosis.",
        distractorRationale: ["A sign is not diagnostic certainty.", "Retinal haemorrhages are abnormal.", "Leukaemia is one possible cause.", ""],
        misconceptionIds: ["M-FINDING-AS-CERTAINTY"], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L29-06", version: 1, objectiveIds: ["L29-O1"], familyId: "F-L29-scleritis-ra", pool: "exam", difficulty: 2,
        stem: "A patient with rheumatoid arthritis develops severe boring eye pain with an area of scleral thinning. What does this imply?",
        options: ["Possible necrotising scleritis linked to active systemic disease, needing urgent ophthalmic and rheumatology care", "Simple episcleritis that can be ignored", "Dry eye only", "Conjunctivitis"],
        answerIndex: 0,
        explanation: "Necrotising scleritis is sight-threatening and can indicate systemic vasculitic activity; coordinated urgent care is needed.",
        distractorRationale: ["", "Episcleritis is mild and does not thin the sclera.", "Dry eye does not cause scleral thinning or deep pain.", "Conjunctivitis is superficial."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      }
    ],
    sources: ["C1", "C2"],
    reviewStatus: "draft"
  },
  {
    id: "L30",
    title: "Ocular pharmacology and adverse effects",
    group: "Therapeutics & systemic",
    emphasis: "Drug classes, mechanisms, indications, important contraindications, delivery and toxicity",
    signature: "Choose a class and explain mechanism/risk; use current sources",
    prerequisites: ["L02", "L19"],
    studios: ["LAB17", "LAB05", "LAB10", "LAB02"],
    activities: ["T018", "T055", "T088"],
    estMinutes: 45,
    objectives: [
      { id: "L30-O1", text: "Distinguish mydriatics from cycloplegics by receptor mechanism and state the main risk of pupil dilation." },
      { id: "L30-O2", text: "Match glaucoma drug classes to their mechanism of pressure lowering and a key systemic or local adverse effect." },
      { id: "L30-O3", text: "Explain the risks of topical corticosteroids and topical anaesthetics." },
      { id: "L30-O4", text: "Identify systemic drugs with important ocular toxicity and the principle of monitoring." }
    ],
    bridge: "L02 explained autonomic control of the pupil and ciliary muscle and the balance of aqueous production and outflow; L19 applied that to glaucoma. Ocular drugs act on these same mechanisms, and topical drugs can be absorbed systemically through the nasolacrimal mucosa.",
    essentials: [
      "Sympathomimetic drops (for example phenylephrine) dilate the pupil via the dilator muscle without paralysing accommodation. Antimuscarinic drops (for example tropicamide, cyclopentolate, atropine) dilate the pupil and also cause cycloplegia.",
      "Dilation can precipitate acute angle closure in an eye with a narrow angle; the risk is assessed before dilating.",
      "Glaucoma drops lower pressure by reducing aqueous production (beta-blockers, alpha-agonists, carbonic anhydrase inhibitors) or increasing outflow (prostaglandin analogues via the uveoscleral route, miotics via the trabecular route).",
      "Topical beta-blockers are absorbed systemically and can worsen asthma or cause bradycardia; ask about these conditions before use.",
      "Topical corticosteroids can raise pressure, cause cataract and worsen herpetic or fungal infection; they need ophthalmic supervision.",
      "Topical anaesthetics are for examination only; repeated use delays healing and can damage the cornea, so they should not be supplied for home use."
    ],
    full: [
      "Pupil and accommodation pharmacology: the sphincter pupillae and ciliary muscle receive parasympathetic (muscarinic) input; the dilator receives sympathetic (alpha-adrenergic) input. Antimuscarinics block both sphincter and ciliary muscle, giving mydriasis and cycloplegia; alpha-agonists stimulate the dilator, giving mydriasis only. Cycloplegia is used for refraction in children and to relieve ciliary spasm in uveitis.",
      "Glaucoma classes and mechanisms: prostaglandin analogues increase uveoscleral outflow; local effects include iris darkening, eyelash growth and periocular changes. Beta-blockers reduce production; systemic absorption can cause bronchospasm, bradycardia and fatigue. Alpha-2 agonists reduce production and increase outflow; they can cause allergy and are avoided in infants because of central nervous system depression. Carbonic anhydrase inhibitors reduce production; systemic forms have more adverse effects. Miotics increase trabecular outflow but cause brow ache and small pupils.",
      "Delivery: most drops are partly absorbed through the nasolacrimal mucosa, bypassing first-pass metabolism; closing the eyes or occluding the punctum after instillation can reduce systemic absorption. Preservatives can damage the ocular surface with long-term use. Intravitreal injection delivers drugs such as anti-VEGF agents directly to the retina but carries a risk of endophthalmitis.",
      "Corticosteroids: they suppress inflammation but can raise pressure (steroid response), promote posterior subcapsular cataract and worsen infections, notably herpes simplex epithelial keratitis and fungal keratitis. They are started and monitored by ophthalmology; non-specialists should not start topical steroids for an undiagnosed red eye.",
      "Antimicrobials: topical antibiotics treat bacterial conjunctivitis and keratitis; antivirals treat herpetic disease; choice and intensity depend on diagnosis and microbiology and are set by current guidance, not by a fixed rule.",
      "Systemic drug toxicity: hydroxychloroquine can cause retinal toxicity, so long-term users are screened according to national guidance; ethambutol can cause optic neuropathy with reduced acuity and colour vision; amiodarone causes corneal deposits and rarely optic neuropathy; systemic corticosteroids cause cataract and raised pressure; tamsulosin and similar drugs are associated with intraoperative floppy iris syndrome; topiramate can cause bilateral secondary angle closure; some drugs with anticholinergic effects can precipitate angle closure in predisposed eyes.",
      "Principles for safe prescribing: confirm the diagnosis and mechanism, check contraindications and interactions, choose the least toxic effective option, consider systemic absorption, educate on technique and adherence, and use current formularies for any dose or regimen.",
      "Documentation: drug, eye(s), indication, relevant contraindications checked, monitoring plan (pressure, retina, optic nerve) and advice given."
    ],
    deeper: [
      "Pharmacological pupil tests (for example to confirm Horner syndrome or a tonic pupil) depend on specific agents, concentrations and timing that must come from source-reviewed protocols; their interpretation is part of L25 and LAB05.",
      "Fluorescein and other diagnostic dyes are drugs too: they can cause allergic reactions, and intravenous fluorescein for angiography carries a small risk of serious reactions."
    ],
    misconceptions: [
      "Mistake: dilation and cycloplegia are the same. Correction: phenylephrine dilates without cycloplegia; antimuscarinics do both.",
      "Mistake: eye drops have no systemic effects. Correction: topical beta-blockers can cause bronchospasm and bradycardia through systemic absorption.",
      "Mistake: topical anaesthetic drops are a good pain treatment for abrasion at home. Correction: repeated use delays healing and can damage the cornea.",
      "Mistake: steroid drops are a safe first treatment for any red eye. Correction: they can worsen herpetic and fungal infection and raise pressure; use under ophthalmic supervision."
    ],
    entryChallenge: {
      prompt: "Which receptor class mediates pupil constriction and accommodation?",
      answer: "Muscarinic (parasympathetic) receptors on the sphincter pupillae and ciliary muscle."
    },
    contrast: {
      a: "Prostaglandin analogue: increases uveoscleral outflow; iris darkening and lash growth.",
      b: "Topical beta-blocker: reduces aqueous production; systemic risk in asthma and bradycardia.",
      discriminator: "Mechanism (outflow versus production) and the type of adverse effect (local versus systemic)."
    },
    workedExample: {
      problem: "A patient with asthma has newly diagnosed open-angle glaucoma. Reason through choosing a drug class.",
      steps: [
        "Mechanism goal: lower pressure by reducing production or increasing outflow.",
        "Contraindication: topical beta-blockers can cause bronchospasm through systemic absorption, so they are avoided in asthma.",
        "Alternative: a prostaglandin analogue increases uveoscleral outflow and has mainly local effects.",
        "Counsel: local side effects, instillation technique, punctal occlusion and adherence.",
        "Document the class chosen, the contraindication considered and the monitoring plan; take regimen details from current formularies."
      ]
    },
    transfer: {
      prompt: "Draw the aqueous pathway again and attach each glaucoma drug class to the point it acts on.",
      modelAnswer: "Ciliary body production: beta-blockers, alpha-2 agonists, carbonic anhydrase inhibitors. Trabecular outflow: miotics (and alpha-2 agonists partly). Uveoscleral outflow: prostaglandin analogues (and alpha-2 agonists partly)."
    },
    items: [
      {
        id: "Q-L30-01", version: 1, objectiveIds: ["L30-O1"], familyId: "F-L30-cycloplegia", pool: "practice", difficulty: 1,
        stem: "Which drop dilates the pupil without paralysing accommodation?",
        options: ["Cyclopentolate", "Atropine", "Phenylephrine", "Tropicamide"],
        answerIndex: 2,
        explanation: "Phenylephrine stimulates the dilator via alpha receptors; it does not block the ciliary muscle, so accommodation is preserved.",
        distractorRationale: ["Cyclopentolate is an antimuscarinic causing cycloplegia.", "Atropine is a strong antimuscarinic causing cycloplegia.", "", "Tropicamide is an antimuscarinic with some cycloplegic effect."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L30-02", version: 1, objectiveIds: ["L30-O2"], familyId: "F-L30-beta-blocker", pool: "practice", difficulty: 2,
        stem: "Why should a topical beta-blocker for glaucoma generally be avoided in a patient with asthma?",
        options: ["It causes iris darkening", "Systemic absorption can cause bronchospasm", "It increases uveoscleral outflow too much", "It is a mydriatic"],
        answerIndex: 1,
        explanation: "Topical drugs reach the circulation via the nasolacrimal mucosa; beta-blockade can precipitate bronchospasm.",
        distractorRationale: ["Iris darkening is a prostaglandin effect.", "", "Beta-blockers reduce production, not outflow.", "Beta-blockers are not mydriatics."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L30-03", version: 1, objectiveIds: ["L30-O3"], familyId: "F-L30-anaesthetic", pool: "practice", difficulty: 1,
        stem: "A patient with a corneal abrasion asks for anaesthetic drops to use at home. What is the correct response?",
        options: ["Supply them for frequent use", "Supply them for use until pain stops", "Supply them only at night", "Decline: repeated use delays healing and can damage the cornea"],
        answerIndex: 3,
        explanation: "Topical anaesthetics are for examination and procedures; repeated use is toxic to the epithelium and masks worsening.",
        distractorRationale: ["Unsafe.", "Unsafe.", "Unsafe.", ""],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L30-04", version: 1, objectiveIds: ["L30-O3"], familyId: "F-L30-steroid-risk", pool: "practice", difficulty: 2,
        stem: "Which pair of adverse effects is most associated with prolonged topical corticosteroid use?",
        options: ["Raised intraocular pressure and cataract", "Ptosis and miosis", "Retinal detachment and myopia", "Lid retraction and proptosis"],
        answerIndex: 0,
        explanation: "Steroids can reduce trabecular outflow (steroid response) and promote posterior subcapsular cataract; they can also worsen certain infections.",
        distractorRationale: ["", "These suggest Horner syndrome.", "Not typical steroid effects.", "These suggest thyroid eye disease."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L30-05", version: 1, objectiveIds: ["L30-O2"], familyId: "F-L30-pg-mechanism", pool: "exam", difficulty: 2,
        stem: "A patient notices one iris has darkened after starting a glaucoma drop in that eye. Which drug class and mechanism fit?",
        options: ["Beta-blocker reducing production", "Prostaglandin analogue increasing uveoscleral outflow", "Carbonic anhydrase inhibitor reducing production", "Miotic increasing trabecular outflow"],
        answerIndex: 1,
        explanation: "Prostaglandin analogues increase uveoscleral outflow; iris pigmentation change and eyelash growth are recognised local effects.",
        distractorRationale: ["Beta-blockers do not darken the iris.", "", "Not associated with iris darkening.", "Miotics cause small pupils and brow ache, not iris darkening."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L30-06", version: 1, objectiveIds: ["L30-O4"], familyId: "F-L30-systemic-toxicity", pool: "exam", difficulty: 2,
        stem: "A patient on treatment for tuberculosis reports reduced vision and colour vision in both eyes. Which drug is the most likely cause?",
        options: ["Ethambutol, causing optic neuropathy", "Hydroxychloroquine", "Tamsulosin", "Topical prostaglandin"],
        answerIndex: 0,
        explanation: "Ethambutol is associated with toxic optic neuropathy affecting acuity and colour vision; the prescriber and eye services should be involved promptly.",
        distractorRationale: ["", "Hydroxychloroquine causes retinal toxicity and is not a tuberculosis drug.", "Tamsulosin affects the iris during surgery.", "Not related to tuberculosis treatment."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      }
    ],
    sources: ["C1", "C2"],
    reviewStatus: "draft"
  },
  {
    id: "L31",
    title: "Imaging and extended investigations",
    group: "Examination",
    emphasis: "OCT, angiography, ultrasound, topography, pachymetry, biometry, ERG and VEP",
    signature: "Select and interpret the appropriate investigation",
    prerequisites: ["L12", "L21"],
    studios: ["LAB12", "LAB13", "LAB15"],
    activities: ["T060", "T066", "T067", "T068", "T069", "T070", "T071", "T072", "T073", "T074", "T075", "T076", "T077", "T087"],
    estMinutes: 55,
    objectives: [
      { id: "L31-O1", text: "Given a clinical question, select the investigation that answers it and state one thing it cannot show." },
      { id: "L31-O2", text: "Interpret fluorescein angiography patterns of leakage, staining, pooling and blocked fluorescence at a conceptual level." },
      { id: "L31-O3", text: "Distinguish the tissue assessed by ERG from that assessed by VEP." },
      { id: "L31-O4", text: "Explain why image quality, segmentation and normative labels must be checked before drawing conclusions from automated reports." },
      { id: "L31-O5", text: "Explain why keratometry and topography describe the cornea rather than the whole eye's refraction." }
    ],
    bridge: "L12 introduced clinical examination instruments and L21 used OCT to correlate macular symptoms with structure. Extended investigations answer specific questions that examination cannot. Each has a physical principle that determines what it can and cannot reveal.",
    essentials: [
      "OCT produces cross-sectional images of retina, optic nerve head and anterior segment using reflected light; it shows layers, fluid and thickness but depends on clear media and correct scan placement.",
      "Fluorescein angiography uses intravenous dye to show retinal circulation, leakage and non-perfusion; ICG angiography better shows the choroid; OCT angiography maps flow without dye but cannot show leakage.",
      "Fundus autofluorescence maps signals from the retinal pigment epithelium; it is useful for atrophy and some dystrophies.",
      "B-scan ultrasound images the posterior segment through opaque media and helps assess detachment, masses and foreign bodies, while avoiding pressure when the globe may be open.",
      "Keratometry measures central corneal curvature; topography and tomography map the corneal surface and thickness and detect irregular astigmatism such as keratoconus; pachymetry measures corneal thickness; biometry measures axial length and other dimensions for lens implant planning.",
      "ERG measures the electrical response of the retina; VEP measures the cortical response to visual stimulation and tests conduction along the whole visual pathway."
    ],
    full: [
      "Selecting a test: start with the question. Is the retina attached behind a dense cataract? (B-scan.) Is there macular fluid? (OCT.) Is a neovascular membrane leaking or is there capillary non-perfusion? (Fluorescein angiography.) Is a corneal irregularity causing poor spectacle acuity? (Topography/tomography.) Is reduced vision retinal or post-retinal? (ERG versus VEP, with clinical context.) Choosing a test without a question produces uninterpretable findings.",
      "OCT interpretation: identify the scan location and quality first, then the layers, then abnormalities (fluid, thickening, thinning, membranes, holes). RNFL and ganglion cell analyses compare the patient with a normative database; colour codes indicate statistical rarity, not disease. Segmentation errors, poor signal, high myopia and unusual discs can all produce misleading colour flags.",
      "Fluorescein angiography concepts: hyperfluorescence from leakage increases in size and intensity over time; staining increases in intensity but keeps its shape; pooling fills a defined space; window defects show early and fade with the background; hypofluorescence occurs when fluorescence is blocked (blood, pigment) or when vessels are not filled (non-perfusion). Patterns are interpreted with the phase of the study.",
      "ICG and OCTA: indocyanine green binds to proteins and remains in choroidal vessels, helping assess choroidal disease. OCT angiography detects moving blood cells to map vessels in layers, without dye; it does not show leakage and is susceptible to motion and projection artefacts.",
      "Ultrasound: B-scan gives a two-dimensional image of the globe and orbit; it distinguishes retinal from vitreous membranes, shows masses and their internal characteristics, and detects foreign bodies. It requires gentle contact; when an open globe is suspected the decision to scan, and how, is made by ophthalmology.",
      "Corneal measurement: keratometry gives the curvature of two principal corneal meridians; topography maps the anterior surface; tomography adds posterior surface and thickness. Total refractive astigmatism also includes the lens and other factors, so spectacle cylinder need not match corneal astigmatism. Pachymetry values are interpreted in context and influence the interpretation of applanation pressure, without a universal correction formula. Biometry provides inputs for intraocular lens planning by specialists using validated methods.",
      "Electrophysiology: full-field ERG assesses generalised rod and cone function and is important in inherited retinal disease; pattern and multifocal ERGs assess macular function. VEP depends on the whole pathway from retina to occipital cortex; a delayed VEP supports conduction delay (for example after optic neuritis) but is not specific on its own. Protocols and reference intervals are laboratory-specific.",
      "Documentation: the question asked, the test and protocol, quality indicators, the findings described in the test's own terms, and how they change the clinical assessment."
    ],
    deeper: [
      "Normative databases are built from selected populations; patients outside those characteristics (high myopia, unusual discs, some ethnic groups) may be flagged abnormally or missed, so structure is always correlated with function and examination.",
      "Topographic patterns such as inferior steepening and asymmetric bow-tie appearances raise suspicion of keratoconus, but diagnosis integrates tomography, thickness and clinical findings rather than relying on a cylinder value."
    ],
    misconceptions: [
      "Mistake: a red sector on an RNFL printout diagnoses glaucoma. Correction: check scan quality and segmentation, then correlate with disc appearance and fields.",
      "Mistake: OCT angiography shows leakage like fluorescein angiography. Correction: OCTA shows flow without dye and cannot demonstrate leakage.",
      "Mistake: corneal astigmatism from keratometry equals the spectacle cylinder. Correction: total refraction includes the lens and other components; they need not match.",
      "Mistake: an abnormal VEP pinpoints a lesion. Correction: VEP tests the whole pathway and must be interpreted with clinical and imaging findings."
    ],
    entryChallenge: {
      prompt: "A dense cataract prevents a fundus view in a patient with sudden loss. Which investigation shows whether the retina is attached?",
      answer: "B-scan ultrasound."
    },
    contrast: {
      a: "Fluorescein angiography: dye-based, shows retinal circulation timing, leakage, staining and non-perfusion.",
      b: "OCT angiography: dye-free, shows layered flow maps, no leakage information, prone to motion and projection artefacts.",
      discriminator: "Whether leakage information is needed, and whether dye injection is acceptable."
    },
    workedExample: {
      problem: "An automated RNFL report shows one red inferior sector in the right eye. Signal quality is flagged as low; the disc looks healthy and the field is normal. Interpret.",
      steps: [
        "Quality first: low signal quality can cause segmentation errors and false thinning.",
        "Correlate: a healthy disc and normal field do not support glaucomatous damage.",
        "Normative label: red means statistically uncommon compared with the database, not diagnosis.",
        "Action: repeat the scan with better quality and review segmentation; follow up per clinical risk.",
        "Document: finding with quality caveat, and that it is not currently supported by other evidence."
      ]
    },
    transfer: {
      prompt: "Fill a table with columns Question, Best first test, One limitation for: macular fluid; retinal attachment behind haemorrhage; suspected keratoconus; generalised rod dysfunction; leakage from a neovascular membrane.",
      modelAnswer: "Macular fluid: OCT; needs clear media and correct scan location. Retinal attachment: B-scan; operator-dependent and avoid pressure if globe integrity uncertain. Keratoconus: corneal tomography/topography; needs good tear film and quality checks. Rod dysfunction: full-field ERG; protocol-specific reference ranges. Leakage: fluorescein angiography; invasive dye with small risk of reactions."
    },
    items: [
      {
        id: "Q-L31-01", version: 1, objectiveIds: ["L31-O1"], familyId: "F-L31-modality-opaque", pool: "practice", difficulty: 1,
        stem: "A patient has a mature cataract and no fundal view. Which test assesses the posterior segment?",
        options: ["OCT", "Fluorescein angiography", "Fundus autofluorescence", "B-scan ultrasound"],
        answerIndex: 3,
        explanation: "Ultrasound passes through opaque media; light-based imaging requires clear media.",
        distractorRationale: ["OCT is light-based and blocked by dense opacity.", "Angiography needs a view.", "Autofluorescence needs a view.", ""],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L31-02", version: 1, objectiveIds: ["L31-O2"], familyId: "F-L31-fa-leakage", pool: "practice", difficulty: 2,
        stem: "On fluorescein angiography, an area of hyperfluorescence enlarges and brightens with fuzzy edges through the late phase. What does this represent?",
        options: ["Leakage", "Staining", "Blocked fluorescence", "A window defect"],
        answerIndex: 0,
        explanation: "Leakage increases in both size and intensity as dye escapes; staining brightens but keeps its shape; window defects fade with background.",
        distractorRationale: ["", "Staining keeps a fixed boundary.", "Blocking causes hypofluorescence.", "Window defects appear early and fade."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L31-03", version: 1, objectiveIds: ["L31-O3"], familyId: "F-L31-erg-vs-vep", pool: "practice", difficulty: 2,
        stem: "Which statement correctly contrasts ERG and VEP?",
        options: ["Both test only the optic nerve", "ERG measures the retina's electrical response; VEP measures the cortical response and depends on the whole pathway", "VEP measures retinal thickness", "ERG measures intraocular pressure"],
        answerIndex: 1,
        explanation: "ERG reflects photoreceptor and inner retinal activity; VEP reflects the signal reaching the occipital cortex.",
        distractorRationale: ["ERG is retinal.", "", "Thickness is measured by OCT.", "Pressure is measured by tonometry."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L31-04", version: 1, objectiveIds: ["L31-O1"], familyId: "F-L31-octa-limits", pool: "practice", difficulty: 2,
        stem: "A clinician wants to know whether a choroidal neovascular membrane is leaking. What is the limitation of OCT angiography for this question?",
        options: ["It cannot image the retina", "It requires dye injection", "It shows flow but not leakage", "It cannot be repeated"],
        answerIndex: 2,
        explanation: "OCTA uses motion contrast to show flow; leakage requires dye-based angiography, though structural OCT can show fluid.",
        distractorRationale: ["It images retinal and choroidal vessels.", "It is dye-free.", "", "It is non-invasive and repeatable."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L31-05", version: 1, objectiveIds: ["L31-O4"], familyId: "F-L31-rnfl-red", pool: "exam", difficulty: 3,
        stem: "An RNFL OCT shows a red sector, but signal strength is poor and segmentation is misplaced. Disc and fields are normal. Best conclusion?",
        options: ["Glaucoma confirmed", "Artefact likely; repeat a good-quality scan and correlate before any conclusion", "Ignore all OCT findings in future", "Raise pressure-lowering treatment immediately"],
        answerIndex: 1,
        explanation: "Normative colour codes are statistical flags. Poor quality and segmentation errors commonly create false thinning; structure must correlate with function and examination.",
        distractorRationale: ["A single flagged sector is not diagnosis.", "", "Good-quality scans remain valuable.", "Treatment is not based on an unreliable scan."],
        misconceptionIds: ["M-FINDING-AS-CERTAINTY"], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L31-06", version: 1, objectiveIds: ["L31-O5"], familyId: "F-L31-k-vs-refraction", pool: "exam", difficulty: 2,
        stem: "Keratometry shows corneal astigmatism, yet the spectacle refraction has less cylinder at a different axis. Why can both be correct?",
        options: ["Keratometry measures only the anterior cornea; total refraction includes the posterior cornea and lens", "One measurement must be wrong", "Spectacle cylinder is always zero", "Keratometry measures axial length"],
        answerIndex: 0,
        explanation: "Total refractive astigmatism combines anterior and posterior corneal and lenticular contributions; they can partly cancel or add.",
        distractorRationale: ["", "Different quantities are being measured.", "Not true.", "Axial length is measured by biometry."],
        misconceptionIds: [], sources: ["O1", "C2"], reviewStatus: "draft"
      }
    ],
    sources: ["O1", "C1", "C2"],
    reviewStatus: "draft"
  },
  {
    id: "L32",
    title: "Ocular and periocular tumors",
    group: "Paediatrics, orbit & tumours",
    emphasis: "Recognition of retinoblastoma, melanoma and important lid lesions at student depth",
    signature: "Spot suspicious features and choose the next assessment",
    prerequisites: ["L14", "L26"],
    studios: ["LAB14", "LAB11", "LAB12", "LAB13", "LAB15"],
    activities: ["T041", "T061", "T062", "T063", "T065", "T071", "T075", "T087"],
    estMinutes: 45,
    objectives: [
      { id: "L32-O1", text: "Identify features of eyelid lesions that suggest malignancy and the common malignant lid tumours." },
      { id: "L32-O2", text: "Describe the presentation of retinoblastoma and the implications of heritable disease for the family." },
      { id: "L32-O3", text: "List features that distinguish a suspicious choroidal melanocytic lesion from a typical naevus." },
      { id: "L32-O4", text: "Choose an appropriate next assessment for a suspicious ocular or orbital mass." }
    ],
    bridge: "L14 covered benign eyelid lesions such as chalazion; L26 introduced leukocoria in children. Most lumps on and in the eye are benign, but a small number are malignant and early recognition affects sight and survival. The skill is recognising suspicious features and referring appropriately.",
    essentials: [
      "Basal cell carcinoma is the most common malignant eyelid tumour; it is often a pearly nodule with rolled edges, telangiectasia or central ulceration, commonly on the lower lid.",
      "Features suggesting a malignant lid lesion include loss of lashes, destruction of the normal lid margin, ulceration, bleeding, irregular pigmentation, induration and growth.",
      "A recurrent chalazion in the same place, or chronic one-sided blepharitis, in an older adult can be a sebaceous gland carcinoma and should be biopsied.",
      "Retinoblastoma is the most common primary intraocular malignancy of childhood; it presents most often with leukocoria or strabismus and needs urgent referral.",
      "Uveal melanoma is the most common primary intraocular malignancy in adults; choroidal naevi are common and usually benign, so suspicious features are sought and lesions are monitored or referred.",
      "Rapidly progressive proptosis in a child needs urgent imaging and specialist assessment to exclude malignancy such as rhabdomyosarcoma."
    ],
    full: [
      "Lid tumours: basal cell carcinoma grows locally and can invade the orbit, especially at the medial canthus; it rarely metastasises. Squamous cell carcinoma can spread to lymph nodes. Sebaceous carcinoma can masquerade as chalazion or blepharitis and is aggressive. Melanoma is uncommon on the lids. Management principles include biopsy for diagnosis and excision with margin control by appropriate specialists.",
      "Conjunctival lesions: ocular surface squamous neoplasia often appears as a gelatinous or leukoplakic limbal lesion; conjunctival melanoma may arise from acquired pigmentation. New, growing, vascularised or elevated pigmented lesions warrant referral.",
      "Retinoblastoma: arises from developing retina due to mutations affecting the RB1 gene. Heritable forms are often bilateral or multifocal and carry implications for siblings and future children; genetic counselling and screening of at-risk relatives are part of care. Presentation includes leukocoria, strabismus, a red painful eye or poor vision. Diagnosis is by specialist examination and imaging; treatment aims to save life first, then the eye and vision.",
      "Choroidal melanocytic lesions: a naevus is usually flat or slightly elevated, stable and often has drusen on its surface. Features increasing concern for melanoma include greater thickness, subretinal fluid, orange pigment (lipofuscin), symptoms, a margin near the disc and an ultrasound pattern of low internal reflectivity. Fundus photography, OCT, autofluorescence and B-scan document these features. Uveal melanoma can metastasise, particularly to the liver, so suspected lesions are referred to specialist centres.",
      "Metastases and other intraocular masses: in adults, metastatic disease to the choroid (often from breast or lung) is an important differential; lymphoma can masquerade as uveitis. In children, other masses mimic retinoblastoma, such as Coats disease and toxocariasis.",
      "Orbital tumours: in adults, lymphoma, vascular lesions and metastases are among the causes of a slowly progressive orbital mass; a salmon-coloured conjunctival patch can indicate lymphoma. In children, rapid proptosis suggests rhabdomyosarcoma, needing urgent imaging and biopsy.",
      "Urgency principles: leukocoria and rapidly progressive childhood proptosis need urgent referral; suspicious lid or conjunctival lesions need prompt specialist assessment with biopsy; suspicious choroidal lesions need specialist assessment with imaging.",
      "Documentation: lesion location, size, colour, surface, margins, effect on lashes or lid margin, photographs, growth history, and the reason for referral."
    ],
    deeper: [
      "Choroidal naevi are common in adults and most remain stable; mnemonic risk-factor lists exist for clinicians, but they support referral decisions rather than determining diagnosis.",
      "Retinoblastoma survival is high where diagnosis is early and treatment available, and much lower where presentation is late; this is why public and professional awareness of leukocoria matters."
    ],
    misconceptions: [
      "Mistake: a recurrent chalazion is always benign. Correction: recurrence at the same site in an older adult should prompt biopsy to exclude sebaceous carcinoma.",
      "Mistake: every pigmented choroidal lesion is a melanoma. Correction: naevi are common; specific features and growth determine concern.",
      "Mistake: a white reflex is always retinoblastoma. Correction: it is a finding with several causes, but retinoblastoma must be excluded urgently."
    ],
    entryChallenge: {
      prompt: "Name three features that make an eyelid lesion suspicious for malignancy.",
      answer: "Any three of: loss of lashes, destruction of the lid margin, ulceration, bleeding, pearly rolled edge with telangiectasia, irregular pigmentation, induration, progressive growth, recurrence."
    },
    contrast: {
      a: "Chalazion: firm, painless nodule in the tarsus, lashes intact, lid margin preserved, often resolves.",
      b: "Basal cell carcinoma: pearly nodule with rolled edge and telangiectasia, possible central ulceration and lash loss, slowly growing.",
      discriminator: "Lash loss, lid margin destruction, ulceration and progressive growth."
    },
    workedExample: {
      problem: "A 72-year-old has a slowly enlarging pearly lesion on the left lower lid with telangiectasia, a small central ulcer and loss of lashes. Plan.",
      steps: [
        "Describe: location, size, surface features, lash loss and margin involvement.",
        "Interpret: features suggest a malignant lid tumour, most likely basal cell carcinoma.",
        "Differential: squamous cell carcinoma, sebaceous carcinoma, keratoacanthoma.",
        "Next step: refer for specialist assessment and biopsy; photograph to document.",
        "Document the suspicious features and the referral pathway."
      ]
    },
    transfer: {
      prompt: "Sort these into 'routine', 'prompt specialist' and 'urgent': stable flat choroidal naevus with drusen; elevated choroidal lesion with subretinal fluid and orange pigment; white pupil in a toddler's photo; recurrent same-site chalazion in a 70-year-old.",
      modelAnswer: "Routine monitoring: stable flat naevus with drusen. Prompt specialist: elevated lesion with fluid and orange pigment; recurrent chalazion for biopsy. Urgent: white pupil in a toddler."
    },
    items: [
      {
        id: "Q-L32-01", version: 1, objectiveIds: ["L32-O1"], familyId: "F-L32-bcc", pool: "practice", difficulty: 1,
        stem: "A pearly lower lid nodule with rolled edges and telangiectasia in an older adult is most likely:",
        options: ["Chalazion", "Basal cell carcinoma", "Hordeolum", "Xanthelasma"],
        answerIndex: 1,
        explanation: "These features are characteristic of basal cell carcinoma, the most common malignant lid tumour.",
        distractorRationale: ["A chalazion is a smooth tarsal nodule without telangiectatic pearly edge.", "", "A hordeolum is acute and painful.", "Xanthelasma is a yellow plaque, usually medial upper lid."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L32-02", version: 1, objectiveIds: ["L32-O1"], familyId: "F-L32-lash-loss", pool: "practice", difficulty: 1,
        stem: "Which feature of an eyelid lump most raises concern for malignancy?",
        options: ["Lashes intact over the lesion", "Rapid resolution with warm compresses", "Loss of lashes and distortion of the lid margin", "Tenderness after a few days"],
        answerIndex: 2,
        explanation: "Tumours infiltrate follicles and the margin, causing lash loss and margin destruction.",
        distractorRationale: ["Intact lashes are reassuring.", "Resolution suggests chalazion.", "", "Tenderness suggests inflammation."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L32-03", version: 1, objectiveIds: ["L32-O1", "L32-O4"], familyId: "F-L32-sebaceous", pool: "practice", difficulty: 2,
        stem: "A 75-year-old has had three chalazion-like lesions at the same upper lid site in a year. What is the best next step?",
        options: ["Repeat incision and curettage without histology", "Warm compresses only", "Reassure", "Biopsy with histology to exclude sebaceous carcinoma"],
        answerIndex: 3,
        explanation: "Same-site recurrence in an older adult can be sebaceous carcinoma masquerading as chalazion; histology is needed.",
        distractorRationale: ["Without histology the diagnosis may be missed.", "Insufficient.", "Unsafe.", ""],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L32-04", version: 1, objectiveIds: ["L32-O3"], familyId: "F-L32-naevus-vs-melanoma", pool: "practice", difficulty: 2,
        stem: "Which feature of a pigmented choroidal lesion increases concern for melanoma?",
        options: ["Overlying subretinal fluid and orange pigment", "Surface drusen", "Flat profile with long-term stability", "Small size far from the disc with no symptoms"],
        answerIndex: 0,
        explanation: "Subretinal fluid and orange pigment (lipofuscin) are features associated with melanoma; drusen and stability suggest a chronic naevus.",
        distractorRationale: ["", "Drusen suggest chronicity.", "Stability is reassuring.", "These are lower-risk features."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L32-05", version: 1, objectiveIds: ["L32-O2"], familyId: "F-L32-retinoblastoma-family", pool: "exam", difficulty: 2,
        stem: "A child is diagnosed with bilateral retinoblastoma. What important implication follows for the family?",
        options: ["None; it is never inherited", "Heritable disease is likely, so genetic counselling and screening of at-risk relatives are needed", "Only the parents need eye tests", "It means the child will develop melanoma"],
        answerIndex: 1,
        explanation: "Bilateral disease usually indicates a germline RB1 mutation; siblings and offspring are at risk and need counselling and screening.",
        distractorRationale: ["Many cases are heritable.", "", "Siblings and future children are the main concern.", "Retinoblastoma is not melanoma, though heritable forms carry other cancer risks."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L32-06", version: 1, objectiveIds: ["L32-O4"], familyId: "F-L32-child-proptosis", pool: "exam", difficulty: 3,
        stem: "A 6-year-old has proptosis that has progressed over two weeks without fever or skin redness. What is the priority?",
        options: ["Routine review in three months", "Treat as preseptal cellulitis", "Urgent orbital imaging and specialist assessment to exclude malignancy such as rhabdomyosarcoma", "Prescribe glasses"],
        answerIndex: 2,
        explanation: "Rapid painless proptosis in a child raises concern for an orbital tumour; urgent imaging and biopsy planning are needed.",
        distractorRationale: ["Delay is unsafe.", "Preseptal cellulitis does not cause proptosis and the picture is not infective.", "", "Not refractive."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      }
    ],
    sources: ["C1", "C2"],
    reviewStatus: "draft"
  },
  {
    id: "L33",
    title: "Prevention, low vision and communication",
    group: "Therapeutics & systemic",
    emphasis: "Screening principles, rehabilitation, patient communication and public-health context",
    signature: "Explain a condition and practical support without jargon",
    prerequisites: ["L07", "L19", "L20"],
    studios: ["LAB18", "LAB04"],
    activities: ["T001", "T002", "T003", "T004", "T006", "T010"],
    estMinutes: 40,
    objectives: [
      { id: "L33-O1", text: "Explain the general principles of a screening programme and why a positive screen is not a diagnosis." },
      { id: "L33-O2", text: "Describe low-vision rehabilitation options and when to refer, including for conditions without curative treatment." },
      { id: "L33-O3", text: "Use plain language and teach-back to explain a diagnosis, its uncertainty and safety-net advice." },
      { id: "L33-O4", text: "State the leading global causes of visual impairment and the principle that much of it is preventable or treatable." }
    ],
    bridge: "L07 covered how acuity is measured and recorded; L19 and L20 showed diseases that are silent until advanced. Prevention depends on finding disease early, rehabilitation helps people use remaining vision, and communication determines whether patients understand and act on advice.",
    essentials: [
      "Screening looks for disease in people without symptoms. A good programme targets an important condition with a detectable early stage, an acceptable test and effective treatment, with a clear pathway for positive results.",
      "A screening result is not a diagnosis: false positives and false negatives occur, and positive screens need diagnostic assessment.",
      "Globally, uncorrected refractive error and cataract are leading causes of visual impairment; both are largely treatable.",
      "Low-vision rehabilitation (magnifiers, lighting, contrast enhancement, electronic aids, training and mobility support) improves function even when the eye disease cannot be cured. Saying 'nothing more can be done' is rarely correct.",
      "Charles Bonnet syndrome, visual hallucinations with preserved insight in people with significant visual loss, is common and should be asked about and explained.",
      "Use plain language, check understanding with teach-back, give clear safety-net advice and document what was explained."
    ],
    full: [
      "Screening principles: classical criteria emphasise that the condition is an important health problem, its natural history is understood, there is a latent or early stage, a suitable and acceptable test exists, treatment is effective and agreed, and the programme's benefits outweigh harms and costs. Diabetic retinopathy screening and newborn red reflex checks are examples; the details of who, how and how often are set by national programmes.",
      "Test performance: sensitivity is the proportion of people with disease correctly detected; specificity is the proportion without disease correctly cleared. In a low-prevalence population, even a specific test produces many false positives, which is why confirmation is needed. A negative screen does not exclude disease if symptoms develop.",
      "Low vision: assessment explores the patient's goals (reading, recognising faces, mobility, work), measures distance and near acuity, contrast and fields, and matches aids to tasks. Lighting and contrast changes are often as effective as magnification. Referral to low-vision and social support services, and certification of visual impairment where the patient meets local criteria, can unlock help.",
      "Psychological and social impact: vision loss is associated with depression, falls and social isolation. Asking about these and signposting support is part of care. Charles Bonnet syndrome is explained as a consequence of reduced visual input; atypical features (no insight, other neurological signs) need further assessment.",
      "Communication: avoid jargon (say 'the light-sensitive layer at the back of the eye' rather than 'retina' until defined), check understanding with teach-back, give written information, be explicit about uncertainty and laterality, and give specific return advice (for example a new shadow or sudden worsening). Shared decision-making respects the patient's values.",
      "Driving and occupational standards: these depend on local law and licensing authorities; clinicians advise patients of their duty to inform the authority where required and document the advice, using the applicable standard rather than a remembered number.",
      "Public health: preventable blindness is reduced by access to refractive correction and cataract surgery, screening for diabetic retinopathy, childhood vision screening, and programmes addressing infectious causes (trachoma, onchocerciasis) and vitamin A deficiency in some regions.",
      "Documentation: what was explained, in what format, the patient's understanding, safety-net advice, referrals (low vision, social care, certification) and driving advice."
    ],
    deeper: [
      "Lead-time and length-time biases can make screening look more beneficial than it is; programme evaluation uses appropriate study designs to show real benefit.",
      "Interpreters should be professional rather than family members for important clinical discussions where possible, to preserve accuracy and confidentiality."
    ],
    misconceptions: [
      "Mistake: a positive screening test means the patient has the disease. Correction: positive screens require diagnostic confirmation.",
      "Mistake: if the eye disease cannot be cured, there is nothing to offer. Correction: low-vision rehabilitation and support improve function and quality of life.",
      "Mistake: patients with hallucinations and vision loss must have psychiatric disease. Correction: Charles Bonnet syndrome is common in visual loss; insight is preserved.",
      "Mistake: telling the patient once is sufficient communication. Correction: check understanding with teach-back and provide written information."
    ],
    entryChallenge: {
      prompt: "Name two leading causes of visual impairment worldwide that are largely treatable.",
      answer: "Uncorrected refractive error and cataract."
    },
    contrast: {
      a: "Screening test: applied to people without symptoms to identify those who need diagnostic assessment.",
      b: "Diagnostic test: applied to people with symptoms or a positive screen to establish or exclude a diagnosis.",
      discriminator: "Population and purpose: risk sorting versus diagnostic decision."
    },
    workedExample: {
      problem: "An 82-year-old with advanced dry AMD in both eyes says she can no longer read her mail and has started seeing patterned shapes that she knows are not real. Plan the conversation and support.",
      steps: [
        "Acknowledge the impact and ask about goals (reading, safety, independence).",
        "Explain Charles Bonnet syndrome in plain language; check she has insight and no other neurological features.",
        "Refer to low-vision services for magnifiers, lighting and electronic aids; discuss certification and social support as applicable.",
        "Ask about mood, falls and driving; give appropriate advice per local rules.",
        "Use teach-back, give written information and document what was explained."
      ]
    },
    transfer: {
      prompt: "Write a three-sentence plain-language explanation of glaucoma for a patient who has just been diagnosed, followed by one teach-back question.",
      modelAnswer: "Glaucoma is damage to the nerve that carries signals from the eye to the brain, usually without pain, and it affects side vision first. The damage cannot be reversed, but treatment that lowers eye pressure can slow or stop it. Using your drops every day and attending check-ups is how we protect your sight. Teach-back: 'Can you tell me in your own words why the drops matter even when your eyes feel fine?'"
    },
    items: [
      {
        id: "Q-L33-01", version: 1, objectiveIds: ["L33-O1"], familyId: "F-L33-screen-vs-diagnose", pool: "practice", difficulty: 1,
        stem: "A retinal screening programme flags a photograph as possibly abnormal. What does this mean?",
        options: ["The patient has proliferative retinopathy", "The patient needs a diagnostic assessment; screening sorts risk rather than diagnosing", "The patient needs no further action", "Treatment should start immediately"],
        answerIndex: 1,
        explanation: "A positive screen identifies people needing diagnostic evaluation; false positives occur.",
        distractorRationale: ["Screening does not establish the diagnosis.", "", "A positive screen requires follow-up.", "Treatment depends on diagnostic confirmation."],
        misconceptionIds: ["M-FINDING-AS-CERTAINTY"], sources: ["C1"], reviewStatus: "draft"
      },
      {
        id: "Q-L33-02", version: 1, objectiveIds: ["L33-O2"], familyId: "F-L33-cbs", pool: "practice", difficulty: 2,
        stem: "A patient with severe macular disease sees vivid patterns and faces but knows they are not real, with no other neurological symptoms. Most likely explanation?",
        options: ["Charles Bonnet syndrome", "Psychosis", "Migraine with aura only", "Retinal detachment"],
        answerIndex: 0,
        explanation: "Complex hallucinations with insight in significant visual loss are typical of Charles Bonnet syndrome; explanation and reassurance help.",
        distractorRationale: ["", "Insight is preserved and there are no other features.", "Migraine aura is typically transient and evolving.", "Detachment causes field loss, not formed images."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L33-03", version: 1, objectiveIds: ["L33-O3"], familyId: "F-L33-teach-back", pool: "practice", difficulty: 1,
        stem: "Which is the best way to check a patient has understood instructions for new eye drops?",
        options: ["Ask 'Do you understand?'", "Give a leaflet only", "Ask the patient to explain in their own words when and how they will use the drops", "Repeat the instructions faster"],
        answerIndex: 2,
        explanation: "Teach-back reveals misunderstandings that yes/no questions miss.",
        distractorRationale: ["Patients often answer yes regardless.", "Helpful but does not check understanding.", "", "Does not check understanding."],
        misconceptionIds: [], sources: ["C1"], reviewStatus: "draft"
      },
      {
        id: "Q-L33-04", version: 1, objectiveIds: ["L33-O4"], familyId: "F-L33-global-causes", pool: "practice", difficulty: 1,
        stem: "Which pair are leading global causes of visual impairment that are largely treatable?",
        options: ["Retinoblastoma and uveal melanoma", "Optic neuritis and papilloedema", "Keratoconus and macular hole", "Uncorrected refractive error and cataract"],
        answerIndex: 3,
        explanation: "Refractive correction and cataract surgery address a large share of global visual impairment.",
        distractorRationale: ["These are serious but uncommon.", "These are not the leading global causes.", "These are not the leading global causes.", ""],
        misconceptionIds: [], sources: ["C1"], reviewStatus: "draft"
      },
      {
        id: "Q-L33-05", version: 1, objectiveIds: ["L33-O2"], familyId: "F-L33-low-vision-referral", pool: "exam", difficulty: 2,
        stem: "A patient has stable, untreatable visual loss and is struggling to read and cook. What is the most appropriate response?",
        options: ["Explain that nothing more can be done", "Refer for low-vision rehabilitation and social support", "Discharge from all services", "Prescribe stronger distance glasses only"],
        answerIndex: 1,
        explanation: "Rehabilitation (aids, lighting, contrast, training) improves function even without curative treatment.",
        distractorRationale: ["Support is available.", "", "Discharge without support neglects function.", "Refraction alone rarely addresses task needs."],
        misconceptionIds: [], sources: ["C1"], reviewStatus: "draft"
      },
      {
        id: "Q-L33-06", version: 1, objectiveIds: ["L33-O3"], familyId: "F-L33-driving", pool: "exam", difficulty: 2,
        stem: "A patient with significant bilateral field loss asks whether they can still drive. What is the best practice?",
        options: ["Say it is fine if acuity is good", "Avoid the topic", "Quote a remembered number from training", "Explain the applicable local licensing standard, the patient's duty to inform the authority where required, and document the advice"],
        answerIndex: 3,
        explanation: "Driving standards are set locally and include fields as well as acuity; advice and documentation should follow the applicable standard.",
        distractorRationale: ["Field loss can make driving unsafe regardless of acuity.", "Avoiding it leaves the patient and public at risk.", "Standards vary and change; check the current applicable rule.", ""],
        misconceptionIds: [], sources: [], reviewStatus: "draft"
      }
    ],
    sources: ["C1", "C2"],
    reviewStatus: "draft"
  },
  {
    id: "L34",
    title: "Procedures and surgery principles",
    group: "Therapeutics & systemic",
    emphasis: "Cataract, laser, intravitreal, retinal, corneal and glaucoma procedures at conceptual depth",
    signature: "Match a procedure to anatomy, rationale and major risks",
    prerequisites: ["L18", "L19", "L21", "L23"],
    studios: ["LAB17", "LAB10", "LAB13"],
    activities: ["T045", "T055", "T058", "T066", "T074"],
    estMinutes: 50,
    objectives: [
      { id: "L34-O1", text: "Describe the principle of cataract surgery and recognise its main early and late complications." },
      { id: "L34-O2", text: "Match glaucoma lasers and operations to the part of the aqueous pathway they change." },
      { id: "L34-O3", text: "Explain the rationale and trade-offs of panretinal photocoagulation and intravitreal injections." },
      { id: "L34-O4", text: "Describe retinal detachment repair options and the precautions after intraocular gas." },
      { id: "L34-O5", text: "Match corneal procedures (keratoplasty types, cross-linking, refractive surgery) to the corneal problem addressed." }
    ],
    bridge: "L18 described cataract, L19 the aqueous pathway, L21 macular disease and L23 retinal detachment. Each procedure is a mechanical answer to a mechanism already studied: remove an opacity, create a drainage route, reduce an ischaemic drive, close a break, or replace or reshape corneal tissue.",
    essentials: [
      "Cataract surgery (usually phacoemulsification) removes the opaque lens through a small incision and places an intraocular lens in the capsular bag; biometry is used to choose its power.",
      "Endophthalmitis after intraocular surgery or injection (pain, redness, reduced vision, often hypopyon) is an emergency.",
      "Posterior capsule opacification, a common late cause of blur after cataract surgery, is treated with laser capsulotomy.",
      "Laser iridotomy relieves pupil block in angle closure; laser trabeculoplasty improves trabecular outflow; trabeculectomy and drainage devices create a new outflow route.",
      "Panretinal photocoagulation treats ischaemic peripheral retina to reduce the growth-factor drive for new vessels, at the cost of some peripheral and night vision; intravitreal anti-VEGF injections treat neovascular and oedematous macular disease.",
      "Retinal detachment is repaired by closing breaks and relieving traction (pneumatic retinopexy, scleral buckle or vitrectomy); after intraocular gas, patients must not fly or receive nitrous oxide anaesthesia until the gas has resolved."
    ],
    full: [
      "Cataract surgery: the anterior capsule is opened, the lens nucleus emulsified and aspirated, and an intraocular lens placed. Indications are visual impairment affecting function, or clinical reasons (for example lens-related angle closure or the need to view the fundus). Early complications include raised pressure, corneal oedema, wound leak and endophthalmitis; later ones include cystoid macular oedema, posterior capsule opacification and retinal detachment. Refractive outcome depends on biometry and lens choice.",
      "Glaucoma procedures: laser peripheral iridotomy creates a hole in the peripheral iris to bypass pupil block. Selective laser trabeculoplasty targets the trabecular meshwork to improve outflow in open-angle glaucoma. Trabeculectomy creates a guarded fistula from the anterior chamber to the subconjunctival space, forming a bleb; risks include hypotony, bleb leak and bleb-related infection. Drainage tubes and minimally invasive procedures offer alternative routes. Cyclodestructive procedures reduce aqueous production.",
      "Retinal lasers and injections: panretinal photocoagulation reduces ischaemic tissue in proliferative diabetic retinopathy and ischaemic vein occlusion, causing regression of new vessels. Intravitreal injections (anti-VEGF agents, steroids) are given under aseptic technique; rare but serious complications include endophthalmitis, raised pressure and retinal detachment. Patients are told to report pain or worsening vision urgently.",
      "Retinal detachment repair: pneumatic retinopexy uses an intravitreal gas bubble with positioning and retinopexy to seal a break; scleral buckling indents the wall to relieve traction; vitrectomy removes vitreous and uses gas or silicone oil as a tamponade. Gas expands with reduced ambient pressure and with nitrous oxide, so flying and nitrous oxide anaesthesia are avoided until it has gone; patients often wear a warning wristband.",
      "Corneal procedures: penetrating keratoplasty replaces the full thickness; lamellar procedures replace only the diseased layers (anterior for stromal disease, endothelial keratoplasty for endothelial failure). Corneal cross-linking uses riboflavin and ultraviolet light to stiffen the cornea and aims to halt keratoconus progression rather than reverse it. Laser refractive surgery reshapes the cornea to correct refractive error; candidacy depends on corneal thickness and topography.",
      "Consent and risk communication: explain the purpose, alternatives (including no treatment), common and serious risks, and what to report afterwards. Specific risk figures should come from current local data and guidance.",
      "Postoperative red flags: increasing pain, reduced vision, increasing redness or discharge, new floaters with a shadow, and a soft or leaking eye. These require urgent review rather than routine follow-up.",
      "Documentation: procedure, eye, indication, consent discussion, postoperative instructions and specific warnings (gas precautions, endophthalmitis symptoms)."
    ],
    deeper: [
      "Choice between procedures depends on anatomy and risk: for example, in angle closure with a large lens, lens extraction itself can open the angle; in neovascular glaucoma, treating the ischaemic drive is as important as the pressure procedure.",
      "Silicone oil tamponade does not expand like gas and does not impose the same flying restriction, but usually needs a second operation for removal and can raise pressure."
    ],
    misconceptions: [
      "Mistake: blurred vision months after cataract surgery means the cataract has grown back. Correction: the lens has been removed; posterior capsule opacification is the usual cause and is treated with laser.",
      "Mistake: panretinal photocoagulation improves vision. Correction: its aim is to prevent further loss from neovascular complications, with some peripheral field cost.",
      "Mistake: cross-linking cures keratoconus. Correction: it aims to halt progression; existing irregularity usually needs optical correction."
    ],
    entryChallenge: {
      prompt: "What tissue does a laser capsulotomy open, and why is it needed after cataract surgery?",
      answer: "The posterior lens capsule, which can opacify after surgery and blur vision; the laser clears the visual axis."
    },
    contrast: {
      a: "Laser iridotomy: hole in peripheral iris, treats pupil-block angle closure.",
      b: "Trabeculectomy: new drainage channel to a subconjunctival bleb, lowers pressure in glaucoma not controlled by other measures.",
      discriminator: "The site of the problem: pupil block at the iris versus outflow resistance at the meshwork."
    },
    workedExample: {
      problem: "Three days after uneventful cataract surgery, a patient reports increasing pain and worsening vision. The eye is red and there is a layer of white cells in the anterior chamber. Interpret and act.",
      steps: [
        "Timing and signs: early postoperative pain, reduced vision and hypopyon.",
        "Provisional diagnosis: postoperative endophthalmitis.",
        "Urgency: emergency same-day ophthalmic care; sampling and intravitreal treatment are specialist decisions per protocol.",
        "Do not reassure as normal postoperative inflammation without urgent assessment.",
        "Document symptom onset, acuity and findings, and the time of referral."
      ]
    },
    transfer: {
      prompt: "Draw a schematic eye and place each procedure where it acts: phacoemulsification, laser iridotomy, trabeculectomy, panretinal photocoagulation, scleral buckle, endothelial keratoplasty.",
      modelAnswer: "Lens: phacoemulsification. Peripheral iris: iridotomy. Superior limbus to subconjunctival space: trabeculectomy. Peripheral retina: PRP. Outer sclera indenting the wall at a break: buckle. Posterior cornea: endothelial keratoplasty."
    },
    items: [
      {
        id: "Q-L34-01", version: 1, objectiveIds: ["L34-O1"], familyId: "F-L34-pco", pool: "practice", difficulty: 1,
        stem: "A year after cataract surgery, a patient notices gradual blur. The intraocular lens is in place and the posterior capsule appears hazy. What is the usual treatment?",
        options: ["Repeat cataract surgery", "Laser capsulotomy", "Topical steroids", "Panretinal photocoagulation"],
        answerIndex: 1,
        explanation: "Posterior capsule opacification is treated by creating an opening in the capsule with a laser.",
        distractorRationale: ["The lens has already been removed.", "", "Steroids do not clear the capsule.", "PRP treats retinal ischaemia."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L34-02", version: 1, objectiveIds: ["L34-O3"], familyId: "F-L34-prp", pool: "practice", difficulty: 2,
        stem: "What is the rationale for panretinal photocoagulation in proliferative diabetic retinopathy?",
        options: ["To sharpen central vision", "To lower intraocular pressure directly", "To reduce ischaemic peripheral retina and thereby the drive for new vessels", "To remove the vitreous"],
        answerIndex: 2,
        explanation: "Treating ischaemic retina reduces growth factor production, promoting regression of new vessels, at some cost to peripheral and night vision.",
        distractorRationale: ["It does not improve central vision.", "It does not act on aqueous dynamics directly.", "", "That is vitrectomy."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L34-03", version: 1, objectiveIds: ["L34-O2"], familyId: "F-L34-glaucoma-procedure", pool: "practice", difficulty: 2,
        stem: "Which procedure creates a new outflow route from the anterior chamber to a subconjunctival bleb?",
        options: ["Trabeculectomy", "Laser iridotomy", "Selective laser trabeculoplasty", "Cyclodestruction"],
        answerIndex: 0,
        explanation: "Trabeculectomy forms a guarded fistula draining aqueous under the conjunctiva.",
        distractorRationale: ["", "Iridotomy bypasses pupil block within the eye.", "Trabeculoplasty treats the existing meshwork.", "Cyclodestruction reduces production."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L34-04", version: 1, objectiveIds: ["L34-O4"], familyId: "F-L34-gas", pool: "practice", difficulty: 2,
        stem: "After retinal detachment surgery with intraocular gas, which instruction is essential?",
        options: ["Avoid reading", "Avoid flying and inform anaesthetists to avoid nitrous oxide until the gas has resolved", "Wear contact lenses", "Stop all eye drops"],
        answerIndex: 1,
        explanation: "Gas expands with reduced cabin pressure and with nitrous oxide, which can raise eye pressure dangerously.",
        distractorRationale: ["Reading is not the key risk.", "", "Unrelated.", "Postoperative drops are usually prescribed."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L34-05", version: 1, objectiveIds: ["L34-O1"], familyId: "F-L34-endophthalmitis", pool: "exam", difficulty: 2,
        stem: "A few days after an intravitreal injection, a patient has increasing pain, redness and reduced vision with a hypopyon. What is the correct interpretation?",
        options: ["Expected discomfort", "Dry eye", "Allergic reaction to drops only", "Suspected endophthalmitis requiring emergency ophthalmic care"],
        answerIndex: 3,
        explanation: "Pain, reduced vision and hypopyon after an intraocular procedure indicate possible endophthalmitis, a sight-threatening emergency.",
        distractorRationale: ["Increasing pain and reduced vision are not expected.", "Dry eye does not cause hypopyon.", "Allergy does not cause hypopyon and reduced vision.", ""],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L34-06", version: 1, objectiveIds: ["L34-O5"], familyId: "F-L34-match-cornea", pool: "exam", difficulty: 2,
        stem: "A young patient's keratoconus is progressing on serial tomography. Which procedure aims to halt progression?",
        options: ["Endothelial keratoplasty", "Laser trabeculoplasty", "Corneal cross-linking", "Panretinal photocoagulation"],
        answerIndex: 2,
        explanation: "Cross-linking stiffens the corneal stroma and aims to stop further ectasia; it does not reverse existing irregularity.",
        distractorRationale: ["This replaces failed endothelium, not ectatic stroma.", "A glaucoma laser.", "", "A retinal laser."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      }
    ],
    sources: ["C1", "C2"],
    reviewStatus: "draft"
  },
  {
    id: "L35",
    title: "Integrated presentations and emergency reasoning",
    group: "Emergency & integration",
    emphasis: "Painful/painless loss, red eye, diplopia, leukocoria, flashes/floaters and postoperative concerns",
    signature: "Unseen mixed cases with staged information",
    prerequisites: ["L13", "L19", "L22", "L23", "L24", "L25", "L28"],
    studios: ["LAB16", "LAB18", "LAB05", "LAB11"],
    activities: ["T001", "T023", "T047", "T052", "T055", "T061", "T062", "T075", "T087"],
    estMinutes: 60,
    objectives: [
      { id: "L35-O1", text: "Sort a presentation into a working category (painful red eye, sudden painless loss, diplopia, flashes and floaters, leukocoria, postoperative) using the first key questions." },
      { id: "L35-O2", text: "Identify which piece of missing information would most change urgency in a staged case." },
      { id: "L35-O3", text: "Choose safe first actions that differ by presentation, including when routine examination steps must be skipped or deferred." },
      { id: "L35-O4", text: "Justify an urgency level using findings and explicitly state remaining uncertainty." }
    ],
    bridge: "Earlier lectures taught each disease. Emergencies arrive as symptoms, not diagnoses, and information arrives in stages. This lecture practises sorting, asking the question that changes urgency and choosing the safest next step.",
    essentials: [
      "Start with the presentation category and laterality, then acuity, then the key discriminating question for that category.",
      "Painful red eye with reduced vision, photophobia, corneal opacity or an abnormal pupil suggests keratitis, uveitis, angle closure, scleritis or endophthalmitis rather than conjunctivitis.",
      "Sudden painless loss: think vascular occlusion, ischaemic optic neuropathy, vitreous haemorrhage, detachment and neovascular macular disease; ask about giant cell arteritis symptoms in older patients.",
      "New diplopia with a dilated pupil, pain or other neurological signs needs emergency assessment.",
      "Chemical injury means irrigate first; suspected open globe means shield and avoid pressure. Some presentations change the order of the routine examination.",
      "Postoperative pain with reduced vision is endophthalmitis until proven otherwise."
    ],
    full: [
      "Approach: a structured sequence (presentation, onset, laterality, pain, vision, discharge, photophobia, trauma, contact lens wear, recent surgery, systemic symptoms) narrows the differential quickly. Examination follows the most informative order: acuity, pupils, external and slit-lamp findings, fluorescein, pressure where safe, and fundus.",
      "Painful red eye discriminators: contact lens wear with pain and a corneal infiltrate suggests microbial keratitis; photophobia with cells suggests anterior uveitis; haloes, a mid-dilated pupil and corneal haze suggest angle closure; deep boring pain suggests scleritis. Each needs same-day ophthalmic assessment, and specific actions (for example avoiding steroids before excluding infection, avoiding dilation in suspected angle closure) follow from the mechanism.",
      "Sudden painless loss: an RAPD with a pale retina suggests artery occlusion; haemorrhages in all quadrants suggest vein occlusion; no red reflex with a poor view suggests vitreous haemorrhage (B-scan if no view); a curtain suggests detachment; distortion suggests macular disease. Giant cell arteritis is considered in older patients.",
      "Diplopia: determine monocular versus binocular, then pattern. Pupil-involving third nerve palsy, multiple cranial nerve signs, papilloedema with sixth nerve palsy or other neurological deficits are emergencies.",
      "Flashes and floaters: dilated peripheral examination is required; field loss, vitreous haemorrhage or pigment increase concern. Leukocoria in a child needs urgent specialist review.",
      "Trauma: separate chemical injury (irrigate first), suspected open globe (shield, no pressure, CT not MRI if metal possible), and closed injuries (abrasion, hyphema, orbital fracture, retrobulbar haemorrhage).",
      "Urgency language: use the local pathway's categories (immediate, same day, soon, routine) rather than invented time limits, and state why the case fits. Missing data that would change urgency should be sought or explicitly flagged.",
      "Documentation: presentation, key positives and negatives, tests deliberately not performed and why, provisional diagnosis with differential, urgency and the pathway used."
    ],
    deeper: [
      "Cognitive traps in emergencies include anchoring on the first diagnosis, premature closure when a common diagnosis seems to fit, and failing to recheck when new information arrives. Re-ranking the differential after each stage reduces these errors.",
      "Bilateral simultaneous presentations (for example bilateral vision loss or bilateral disc swelling) often point to systemic, toxic or intracranial causes and change the first investigations."
    ],
    misconceptions: [
      "Mistake: the same routine examination order applies to every eye emergency. Correction: chemical injury requires irrigation first, and suspected open globe forbids tonometry and pressure.",
      "Mistake: a single reassuring finding settles a case. Correction: a normal pressure, normal acuity or negative Seidel test does not exclude serious disease when other features point to it.",
      "Mistake: urgency equals how distressed the patient seems. Correction: urgency is set by the threat to sight or life suggested by the findings."
    ],
    entryChallenge: {
      prompt: "For a patient with a painful red eye, list the four observations that most quickly separate conjunctivitis from sight-threatening causes.",
      answer: "Visual acuity, pupil shape and reaction, corneal clarity and fluorescein staining, and photophobia or ciliary flush (with pressure where safe)."
    },
    contrast: {
      a: "Microbial keratitis in a contact lens wearer: pain, photophobia, corneal infiltrate with an epithelial defect.",
      b: "Anterior uveitis: photophobia, ciliary flush, anterior chamber cells, clear cornea without an infiltrate.",
      discriminator: "A corneal infiltrate with staining defect versus anterior chamber cells with a clear cornea."
    },
    workedExample: {
      problem: "Stage 1: a 71-year-old reports blurred vision in the right eye since this morning. Stage 2: no pain; acuity is reduced; there is a right RAPD. Stage 3: she mentions scalp tenderness and jaw pain. Reason through each stage.",
      steps: [
        "Stage 1: sudden painless loss category; the differential includes vascular, optic nerve, vitreous, retinal and macular causes.",
        "Stage 2: RAPD localises to the optic nerve or extensive retinal disease; check the fundus for disc swelling or retinal whitening.",
        "Stage 3: giant cell arteritis symptoms raise the urgency to immediate same-day assessment with treatment per protocol to protect the fellow eye.",
        "State uncertainty: arteritic ischaemic optic neuropathy or artery occlusion; confirmation follows but treatment is not delayed.",
        "Document the staged findings and the time the pathway was started."
      ]
    },
    transfer: {
      prompt: "Write a one-line triage decision for each: (A) post-cataract surgery day 3, pain and hypopyon; (B) worker with alkali splash; (C) child with white pupil on photo; (D) young adult with itchy watery eyes every spring.",
      modelAnswer: "A: emergency, suspected endophthalmitis. B: irrigate immediately, then urgent ophthalmic assessment. C: urgent specialist referral for leukocoria. D: routine, likely allergic conjunctivitis with safety-net advice."
    },
    items: [
      {
        id: "Q-L35-01", version: 1, objectiveIds: ["L35-O1"], familyId: "F-L35-painful-red-triage", pool: "practice", difficulty: 2,
        stem: "A patient has a painful red eye with photophobia, a clear cornea without staining, a small pupil and cells in the anterior chamber. Which category fits best?",
        options: ["Viral conjunctivitis", "Anterior uveitis", "Subconjunctival haemorrhage", "Allergic conjunctivitis"],
        answerIndex: 1,
        explanation: "Photophobia, a small pupil and anterior chamber cells with a clear cornea suggest anterior uveitis, needing same-day ophthalmic care.",
        distractorRationale: ["Conjunctivitis does not produce anterior chamber cells.", "", "Painless and without photophobia.", "Itch dominates and there are no cells."],
        misconceptionIds: [], sources: ["C1", "C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L35-02", version: 1, objectiveIds: ["L35-O1"], familyId: "F-L35-painless-loss-sort", pool: "practice", difficulty: 2,
        stem: "Sudden painless loss with no red reflex and no fundal view in a diabetic patient. What is the most appropriate next test?",
        options: ["Gonioscopy", "Corneal topography", "B-scan ultrasound", "Colour plates"],
        answerIndex: 2,
        explanation: "Likely vitreous haemorrhage; ultrasound shows whether the retina is attached when the view is obscured.",
        distractorRationale: ["The angle is not the immediate question.", "Not relevant to the posterior segment.", "", "Does not assess the posterior segment."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L35-03", version: 1, objectiveIds: ["L35-O3"], familyId: "F-L35-chemical-sequence", pool: "practice", difficulty: 1,
        stem: "In an isolated chemical splash, which step comes before measuring visual acuity?",
        options: ["Irrigation", "Fundus examination", "Tonometry", "Refraction"],
        answerIndex: 0,
        explanation: "Irrigation is started immediately; acuity and full examination follow.",
        distractorRationale: ["", "Not a first step.", "Not a first step.", "Not relevant."],
        misconceptionIds: [], sources: ["K6", "C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L35-04", version: 1, objectiveIds: ["L35-O4"], familyId: "F-L35-diplopia-red-flag", pool: "practice", difficulty: 2,
        stem: "Which diplopia presentation most clearly needs emergency assessment?",
        options: ["Long-standing small phoria with occasional strain", "Monocular ghosting from cataract", "Intermittent diplopia when very tired with normal examination", "New ptosis and diplopia with a dilated pupil and headache"],
        answerIndex: 3,
        explanation: "A pupil-involving third nerve palsy with headache raises concern for compression such as an aneurysm.",
        distractorRationale: ["Routine.", "Optical and routine.", "Usually routine, though monitored.", ""],
        misconceptionIds: ["M-PHORIA-VS-TROPIA"], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L35-05", version: 1, objectiveIds: ["L35-O3", "L35-O1"], familyId: "F-L35-contact-lens-keratitis", pool: "exam", difficulty: 2,
        stem: "A contact lens wearer has a painful red eye, photophobia and a white corneal infiltrate with overlying fluorescein staining. Which action is safest?",
        options: ["Start topical steroid", "Advise continued lens wear", "Same-day ophthalmic assessment for suspected microbial keratitis, with lens wear stopped", "Routine review next month"],
        answerIndex: 2,
        explanation: "An infiltrate with an epithelial defect in a lens wearer suggests microbial keratitis; urgent assessment and microbiology guide treatment.",
        distractorRationale: ["Steroids can worsen infection.", "Lens wear should stop.", "", "Delay risks corneal perforation and scarring."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L35-06", version: 1, objectiveIds: ["L35-O2"], familyId: "F-L35-missing-datum", pool: "exam", difficulty: 3,
        stem: "A 76-year-old has sudden painless loss in one eye with a swollen disc. Which additional piece of history most changes urgency?",
        options: ["Headache, scalp tenderness or jaw claudication", "Recent change in reading glasses", "Family history of myopia", "Seasonal itching"],
        answerIndex: 0,
        explanation: "Giant cell arteritis symptoms make arteritic ischaemic optic neuropathy likely and demand immediate treatment per protocol to protect the fellow eye.",
        distractorRationale: ["", "Not relevant to urgency here.", "Not relevant to urgency here.", "Irrelevant."],
        misconceptionIds: ["M-FINDING-AS-CERTAINTY"], sources: ["C2"], reviewStatus: "draft"
      }
    ],
    sources: ["K5", "K6", "C1", "C2"],
    reviewStatus: "draft"
  },
  {
    id: "L36",
    title: "Documentation, viva and examination integration",
    group: "Emergency & integration",
    emphasis: "Supported diagnosis, differential, laterality, notation, plan, referral and oral defense",
    signature: "Write a note; defend the reasoning; complete a mock exam",
    prerequisites: ["L05", "L07", "L08", "L35"],
    studios: ["LAB18", "LAB03"],
    activities: ["T001", "T020", "T023", "T029", "T037", "T039", "T055", "T062", "T065"],
    estMinutes: 50,
    objectives: [
      { id: "L36-O1", text: "Write a clinical note that records laterality, method and correction status, and only findings actually obtained." },
      { id: "L36-O2", text: "Distinguish a symptom, a sign, a refractive classification, a differential diagnosis and a confirmed diagnosis in written assessments." },
      { id: "L36-O3", text: "Formulate a provisional diagnosis with supporting evidence, uncertainty and the investigation that would resolve it." },
      { id: "L36-O4", text: "Answer viva questions of the form 'why?', 'what would change your answer?' and 'what cannot be concluded?'." }
    ],
    bridge: "L05 taught prescription notation, L07 acuity recording, L08 the history and examination sequence and L35 emergency reasoning. Documentation is where all of these meet: the note must show what was done, what was found, what it means and what happens next, in a form another clinician can trust.",
    essentials: [
      "Every finding is recorded per eye (right/left, OD/OS) with the method and conditions (for example acuity with correction or pinhole, pressure with instrument and time).",
      "Record only what was examined. Never write 'normal fundus' or 'pupils equal and reactive' if the test was not done; write 'not examined' with the reason.",
      "A prescription (for example −2.00 DS) records an optical correction; it is not a disease diagnosis. Refractive classification (myopia) is different from a disease (for example myopic maculopathy).",
      "Write a provisional diagnosis with its supporting evidence, a short differential and the investigation that would confirm or exclude it.",
      "State the plan, urgency and safety-net advice, and who is responsible for the next step.",
      "In a viva, explain the reasoning chain, what would change your answer and what cannot be concluded from the evidence available."
    ],
    full: [
      "Structure: presenting complaint and history; examination findings by eye; investigations with method and quality; assessment (provisional diagnosis, differential, uncertainty); plan (tests, treatment principles, referral, urgency); advice given. A consistent structure helps others find information quickly and exposes gaps.",
      "Laterality and notation: write 'right' and 'left' or OD and OS consistently; avoid ambiguous abbreviations. Prescriptions follow SPH/CYL × AXIS notation per eye; a near addition is recorded separately. Monocular findings should not be merged into a binocular shorthand when the eyes differ.",
      "Evidence-limited documentation: a note should not imply that an unexamined structure is normal. If tonometry was deliberately withheld (for example suspected open globe) or the fundus could not be seen, record this and why. Generated text must be derived from what was obtained.",
      "Levels of statement: 'reports flashes' is a symptom; 'pigment in anterior vitreous' is a sign; '−3.00 DS' is a refraction; 'suspected retinal tear' is a provisional diagnosis; 'horseshoe tear at 1 o'clock seen on indirect examination' is a confirmed finding. Writing a confirmed diagnosis from a single finding overstates certainty.",
      "Pressure and glaucoma example: 'IOP within the usual range' does not support 'glaucoma excluded'; a defensible note links disc, field and angle findings to the assessment and lists what is still needed.",
      "Viva technique: state the answer, then the evidence; explain the mechanism; name the most important differential and the discriminating test; say what new finding would change the answer (for example an RAPD, a dilated pupil, a positive Seidel); and say plainly what the evidence cannot establish.",
      "Referral letters: include the question being asked, key findings with laterality, urgency, relevant history and medications, and what has already been done.",
      "Common errors: missing laterality, unspecified correction status, copying a previous note's normal findings, grading disease without sufficient evidence, and failure to record safety-net advice."
    ],
    deeper: [
      "Clinical notes are legal documents; corrections should be made transparently (struck through and dated or tracked electronically), not by overwriting.",
      "Diagnostic composer tools can help beginners structure notes, but they must not insert findings that were not obtained; free-text explanation remains important for reasoning."
    ],
    misconceptions: [
      "Mistake: document 'normal' for routine structures to save time. Correction: record only what was examined; write 'not examined' with the reason otherwise.",
      "Mistake: a normal pressure in the note justifies 'glaucoma excluded'. Correction: glaucoma assessment requires the disc, field and angle; pressure alone neither diagnoses nor excludes it.",
      "Mistake: a spectacle prescription is a diagnosis. Correction: a prescription is an optical correction; disease diagnoses require supporting clinical evidence.",
      "Mistake: one striking finding justifies a confirmed diagnosis. Correction: write a provisional diagnosis with the evidence and the confirming investigation."
    ],
    entryChallenge: {
      prompt: "Rewrite this note fragment correctly: 'VA 6/9, IOP normal, fundus normal' for a patient whose fundus was not examined.",
      answer: "Example: 'VA right 6/9 with spectacles; left 6/6 with spectacles. IOP right and left with method and time recorded. Fundus not examined (undilated, patient declined); to be examined at follow-up.'"
    },
    contrast: {
      a: "Provisional diagnosis: the most likely explanation, stated with its supporting evidence and remaining uncertainty.",
      b: "Confirmed diagnosis: established by sufficient evidence, often including a specific confirming test.",
      discriminator: "Whether the evidence would satisfy another clinician that alternatives have been reasonably excluded."
    },
    workedExample: {
      problem: "Write the assessment and plan for: a 60-year-old with new floaters in the left eye for one day, normal acuity, pigment cells in the left anterior vitreous, and dilated examination not yet performed.",
      steps: [
        "Findings: left new floaters; acuity normal both eyes (state correction); left anterior vitreous pigment; fundus not yet examined.",
        "Assessment: left symptomatic posterior vitreous detachment with suspected retinal tear (provisional).",
        "Differential: uncomplicated PVD, retinal tear, early detachment, vitreous haemorrhage.",
        "Plan: dilated indirect examination with indentation, urgency per local protocol.",
        "Advice: return immediately if a shadow, more floaters or reduced vision occur; document advice given."
      ]
    },
    transfer: {
      prompt: "In viva format, answer: 'You diagnosed right optic neuritis. Why? What would change your answer? What cannot you conclude?'",
      modelAnswer: "Why: young adult, subacute right visual loss, pain on eye movement, reduced colour vision and right RAPD. What would change it: no pain with an older vascular profile (ischaemic), bilateral swelling with preserved function (papilloedema), systemic features of giant cell arteritis, or a compressive lesion on imaging. Cannot conclude: whether demyelinating disease is present without MRI and follow-up, or the eventual visual outcome."
    },
    items: [
      {
        id: "Q-L36-01", version: 1, objectiveIds: ["L36-O1"], familyId: "F-L36-laterality", pool: "practice", difficulty: 1,
        stem: "Which acuity entry is best documented?",
        options: ["VA 6/12", "Right 6/12 with spectacles at 6 m; left 6/6 with spectacles at 6 m", "Good vision", "VA 6/12 both"],
        answerIndex: 1,
        explanation: "Laterality, correction status and test distance make the entry interpretable and comparable.",
        distractorRationale: ["Missing eye, correction and distance.", "", "Not a measurement.", "Implies both eyes are identical without stating conditions."],
        misconceptionIds: [], sources: ["C1"], reviewStatus: "draft"
      },
      {
        id: "Q-L36-02", version: 1, objectiveIds: ["L36-O1"], familyId: "F-L36-unexamined", pool: "practice", difficulty: 1,
        stem: "The fundus was not examined because the pupils were not dilated. What should the note say?",
        options: ["Fundus normal", "Leave the fundus section blank without comment", "Fundus not examined (undilated), with the plan to examine", "Copy the fundus findings from the last visit"],
        answerIndex: 2,
        explanation: "Notes record only obtained findings; stating that a test was not done, and why, prevents false reassurance.",
        distractorRationale: ["Implies an examination that did not happen.", "Ambiguous; readers cannot tell if it was missed or normal.", "", "Old findings may no longer be true."],
        misconceptionIds: ["M-FINDING-AS-CERTAINTY"], sources: ["C1"], reviewStatus: "draft"
      },
      {
        id: "Q-L36-03", version: 1, objectiveIds: ["L36-O2"], familyId: "F-L36-rx-vs-dx", pool: "practice", difficulty: 2,
        stem: "A student writes 'Diagnosis: −4.00 DS right eye'. What is the main problem?",
        options: ["A prescription is an optical correction, not a disease diagnosis; the refractive classification and any disease must be stated separately", "The sphere should be written as a cylinder", "Prescriptions cannot be negative", "Nothing; this is complete"],
        answerIndex: 0,
        explanation: "−4.00 DS describes a corrective lens. The refractive state (myopia) is a classification, and any associated disease needs its own evidence.",
        distractorRationale: ["", "A spherical lens is correctly written as DS.", "Minus lenses correct myopia.", "It confuses notation with diagnosis."],
        misconceptionIds: ["M-RX-VS-DIAGNOSIS"], sources: ["O1", "C1"], reviewStatus: "draft"
      },
      {
        id: "Q-L36-04", version: 1, objectiveIds: ["L36-O3"], familyId: "F-L36-provisional", pool: "practice", difficulty: 2,
        stem: "Which assessment statement is best supported when a key confirming test has not been done?",
        options: ["Confirmed diagnosis with no differential", "No diagnosis can be written", "A list of every possible eye disease", "Provisional diagnosis with supporting findings, a short differential and the test that would confirm it"],
        answerIndex: 3,
        explanation: "A defensible provisional diagnosis shows reasoning, acknowledges uncertainty and names the next step.",
        distractorRationale: ["Overstates certainty.", "A provisional assessment is still expected.", "Unfocused and unhelpful.", ""],
        misconceptionIds: ["M-FINDING-AS-CERTAINTY"], sources: ["C1"], reviewStatus: "draft"
      },
      {
        id: "Q-L36-05", version: 1, objectiveIds: ["L36-O2", "L36-O3"], familyId: "F-L36-iop-note", pool: "exam", difficulty: 2,
        stem: "A note reads: 'IOP within normal range both eyes, glaucoma excluded.' The discs were not examined. What correction is needed?",
        options: ["None", "Replace 'glaucoma excluded' with a statement that glaucoma cannot be assessed without disc and field evaluation, and plan those", "Add 'pressure confirms no disease'", "Remove the pressure reading"],
        answerIndex: 1,
        explanation: "Pressure alone neither diagnoses nor excludes glaucoma; the note should reflect what was and was not assessed.",
        distractorRationale: ["The conclusion is unsupported.", "", "This repeats the error.", "The pressure reading itself is valid information."],
        misconceptionIds: ["M-IOP-AS-GLAUCOMA"], sources: ["K4", "C1"], reviewStatus: "draft"
      },
      {
        id: "Q-L36-06", version: 1, objectiveIds: ["L36-O4"], familyId: "F-L36-viva-what-changes", pool: "exam", difficulty: 3,
        stem: "In a viva you propose anterior uveitis for a painful photophobic red eye with anterior chamber cells. The examiner asks what finding would most change your management priority. Best answer?",
        options: ["A family history of myopia", "A slightly lower acuity in the other eye from known amblyopia", "A corneal infiltrate with epithelial defect, suggesting microbial keratitis that must be excluded before steroid treatment", "Mild morning crusting"],
        answerIndex: 2,
        explanation: "A corneal infiltrate shifts the leading diagnosis toward infection, changing tests and making steroids potentially harmful; naming such a finding shows reasoning about what would change the answer.",
        distractorRationale: ["Irrelevant to the acute decision.", "Pre-existing and explained.", "", "Non-specific."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      }
    ],
    sources: ["O1", "K4", "C1", "C2"],
    reviewStatus: "draft"
  },
];
