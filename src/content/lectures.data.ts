import type { LectureContent } from './schema';

// Draft learning content for lectures L01–L18. All items and lectures are reviewStatus 'draft'
// and require human clinical review before use in scored assessment.
export const LECTURES_A: LectureContent[] = [
  {
    id: "L01",
    title: "Eye and orbital anatomy",
    group: "Foundations",
    emphasis: "Ocular coats, chambers, lens, retina, optic nerve, vessels, adnexa and orientation",
    signature: "Build and label an eye; switch cross-section and external views",
    prerequisites: [],
    studios: ["LAB08", "LAB11", "LAB15"],
    activities: ["T041", "T062"],
    estMinutes: 40,
    objectives: [
      { id: "L01-O1", text: "Name the three coats of the globe and assign the cornea, sclera, iris, ciliary body, choroid and retina to the correct coat." },
      { id: "L01-O2", text: "Trace the path of aqueous humour from its site of production to its main exit and name the spaces it passes through." },
      { id: "L01-O3", text: "Distinguish the blood supply of the inner retina from that of the outer retina and predict which layers suffer when each fails." },
      { id: "L01-O4", text: "Given a clinical sign (for example an orbital floor fracture or spread of ethmoid infection), identify the orbital wall or structure involved." },
      { id: "L01-O5", text: "Use patient-centred laterality (right/left, nasal/temporal, superior/inferior) consistently when describing a finding." }
    ],
    bridge: "This lecture assumes only general human anatomy. The eye is a fluid-filled sphere wrapped in three layers, sitting in a bony cone (the orbit) together with muscles, nerves, vessels and fat. Every later lecture names structures from this map, so it is worth learning the layers and spaces before the diseases.",
    essentials: [
      "The globe has three coats. The outer fibrous coat is the transparent cornea in front and the white sclera elsewhere. The middle vascular coat, the uvea, is the iris, ciliary body and choroid. The inner neural coat is the retina.",
      "The eye has three internal spaces. The anterior chamber lies between cornea and iris, the posterior chamber is the narrow ring between iris and lens, and the vitreous cavity fills the space behind the lens. Aqueous fills both chambers; vitreous gel fills the vitreous cavity.",
      "The crystalline lens hangs from the ciliary body by zonular fibres. Changing zonular tension changes the lens shape, which is the anatomical basis of accommodation.",
      "The retina contains photoreceptors in its outer part and ganglion cells in its inner part. Ganglion cell axons run across the retinal surface to the optic disc and leave as the optic nerve. The disc has no photoreceptors and corresponds to the physiological blind spot. The fovea at the centre of the macula is cone-rich and gives the finest detail.",
      "The inner retina is supplied mainly by the central retinal artery, a branch of the ophthalmic artery. The outer retina, including the photoreceptors, depends on the choroidal circulation fed by the posterior ciliary arteries.",
      "The orbit is a bony cone. Its medial wall and floor are thin, which explains why ethmoid sinus infection can spread into the orbit and why blunt trauma commonly fractures the floor. The adnexa include the eyelids, conjunctiva and lacrimal apparatus."
    ],
    full: [
      "Function follows the coats. The cornea is the main refracting surface because the air-to-cornea interface has the largest change in refractive index along the visual axis; it must stay transparent, which depends on regularly spaced collagen, absence of blood vessels and active pumping of water out of the stroma by the endothelium. The sclera is tough and opaque and gives the eye its shape and muscle attachments.",
      "The uvea is pigmented and vascular. The iris is a diaphragm that controls the pupil: the sphincter (parasympathetic) constricts and the dilator (sympathetic) widens it. The ciliary body has two roles — its muscle drives accommodation and its processes secrete aqueous. The choroid is a dense vascular bed nourishing the outer retina; this is why inflammation in the uvea (uveitis) can affect both the front and the back of the eye.",
      "Aqueous humour is made by the ciliary processes into the posterior chamber, flows through the pupil into the anterior chamber, and drains mainly through the trabecular meshwork at the angle between iris and cornea into Schlemm's canal, with a smaller uveoscleral route. The balance of production and outflow sets intraocular pressure, which matters for glaucoma (L19) and is the reason the angle is examined with gonioscopy (L12).",
      "The retina is layered. Light passes through the inner layers before reaching photoreceptors, whose outer segments interdigitate with the retinal pigment epithelium (RPE). The RPE recycles visual pigment and supports photoreceptors. A retinal detachment separates the neurosensory retina from the RPE, cutting the outer retina off from its choroidal support — anatomy that explains why detachment threatens vision.",
      "Dual blood supply predicts patterns of injury. Occlusion of the central retinal artery makes the inner retina pale and swollen while the fovea, which has no inner retinal layers and is fed from the choroid beneath, stands out as a red spot. Some people have a cilioretinal artery from the choroidal system that can spare part of the macula in such an occlusion.",
      "The orbit is formed by seven bones (frontal, zygomatic, maxilla, ethmoid, sphenoid, lacrimal and palatine). At its apex, the optic canal carries the optic nerve and ophthalmic artery, and the superior orbital fissure carries the nerves to the extraocular muscles (oculomotor, trochlear, abducens) and branches of the ophthalmic division of the trigeminal nerve. Disease at the apex can therefore combine visual loss with ophthalmoplegia.",
      "Orientation conventions prevent documentation errors. Right and left always mean the patient's right and left. Nasal is toward the nose, temporal toward the ear. When an examiner faces a patient, the patient's right eye is on the examiner's left; drawings and images can be mirrored, so labels must be explicit rather than inferred from the picture."
    ],
    deeper: [
      "The extraocular muscles (four recti and two obliques) arise mostly from the annulus of Zinn at the orbital apex, except the inferior oblique, which arises from the anterior orbital floor. Their actions depend on gaze position; this is developed in L10.",
      "The eyelid has an anterior lamella (skin and orbicularis) and a posterior lamella (tarsus and conjunctiva). The orbital septum, a fibrous sheet from the orbital rim to the tarsus, is the boundary that separates preseptal from orbital infection (L27).",
      "The tear drainage path is punctum, canaliculus, common canaliculus, lacrimal sac and nasolacrimal duct, which opens into the inferior meatus of the nose. Knowing each stage helps localise obstruction (L14)."
    ],
    misconceptions: [
      "Mistake: the posterior chamber is the space behind the lens. Correction: the posterior chamber is the small aqueous-filled space between the back of the iris and the lens; the space behind the lens is the vitreous cavity.",
      "Mistake: the whole retina is fed by the central retinal artery. Correction: the central retinal artery supplies the inner retina; photoreceptors depend on the choroid.",
      "Mistake: the eye on the left of a photograph is the left eye. Correction: in an examiner-view image the patient's right eye usually appears on the viewer's left; always label laterality explicitly."
    ],
    entryChallenge: {
      prompt: "A drop of dye placed where aqueous is produced would first appear in which space, and which structure would it pass through next?",
      answer: "It would appear in the posterior chamber (made by the ciliary processes) and pass through the pupil into the anterior chamber before draining at the angle."
    },
    contrast: {
      a: "Central retinal artery occlusion: inner retina whitens; fovea looks red by contrast.",
      b: "Choroidal circulation compromise: outer retina and RPE are affected; the inner retinal pattern is different.",
      discriminator: "Which layer depends on which circulation — inner retina on the central retinal artery, outer retina on the choroid."
    },
    workedExample: {
      problem: "After a punch to the eye, a patient has numbness of the cheek below the eye and limited upgaze on the injured side. Which orbital wall is most likely broken and why do these signs occur?",
      steps: [
        "Recall that the orbital floor is thin and is a common site of fracture after blunt trauma.",
        "The infraorbital nerve runs in the floor; injury to it causes numbness of the cheek and upper lip.",
        "Tissue around the inferior rectus can be trapped in the floor fracture, restricting upward movement.",
        "Conclude: orbital floor fracture is the leading anatomical explanation, to be confirmed clinically and with imaging (L28)."
      ]
    },
    transfer: {
      prompt: "Draw (or describe) a horizontal cross-section of the right eye seen from above. Label the nasal and temporal sides, the cornea, iris, lens, ciliary body, vitreous, retina, choroid, sclera and optic nerve. Where does the optic nerve leave relative to the fovea?",
      modelAnswer: "In the right eye viewed from above, nasal is toward the midline (the patient's left side of the drawing for a right eye). From outside in: sclera/cornea, choroid/ciliary body/iris, retina. The optic nerve leaves nasal to the fovea, which is why the blind spot lies in the temporal visual field."
    },
    items: [
      {
        id: "Q-L01-01", version: 1, objectiveIds: ["L01-O1"], familyId: "F-L01-coats", pool: "practice", difficulty: 1,
        stem: "Which structure belongs to the middle (vascular) coat of the eye?",
        options: ["Sclera", "Ciliary body", "Retinal pigment epithelium", "Cornea"],
        answerIndex: 1,
        explanation: "The uvea — iris, ciliary body and choroid — is the vascular middle coat. Cornea and sclera form the outer fibrous coat; the RPE is part of the inner retinal coat.",
        distractorRationale: ["The sclera is part of the outer fibrous coat.", "", "The RPE is the outermost layer of the retina, the inner coat, even though it lies against the choroid.", "The cornea is the transparent front of the outer fibrous coat."],
        misconceptionIds: [], sources: ["C1", "C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L01-02", version: 1, objectiveIds: ["L01-O2"], familyId: "F-L01-aqueous-path", pool: "practice", difficulty: 2,
        stem: "Which sequence correctly describes the main route of aqueous humour?",
        options: ["Ciliary processes → anterior chamber → pupil → posterior chamber → trabecular meshwork", "Choroid → vitreous → posterior chamber → trabecular meshwork", "Ciliary processes → posterior chamber → pupil → anterior chamber → trabecular meshwork", "Lens → anterior chamber → posterior chamber → Schlemm's canal"],
        answerIndex: 2,
        explanation: "Aqueous is secreted into the posterior chamber, passes through the pupil into the anterior chamber and leaves mainly via the trabecular meshwork into Schlemm's canal.",
        distractorRationale: ["The order of the chambers is reversed; aqueous is made behind the iris.", "The choroid and vitreous are not the source of aqueous.", "", "The lens does not secrete aqueous, and the chamber order is reversed."],
        misconceptionIds: [], sources: ["C1", "C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L01-03", version: 1, objectiveIds: ["L01-O3"], familyId: "F-L01-blood-supply", pool: "practice", difficulty: 2,
        stem: "In an eye with a sudden blockage of the central retinal artery, why does the fovea appear red against a pale retina?",
        options: ["The fovea has extra retinal vessels that remain open", "The fovea lacks inner retinal layers, so the underlying choroidal colour shows through", "Blood leaks from the fovea into the vitreous", "The fovea is supplied by the vortex veins"],
        answerIndex: 1,
        explanation: "The inner retina swells and whitens when its arterial supply fails. At the fovea the inner layers are absent, so the intact choroidal circulation beneath shows as a red spot by contrast.",
        distractorRationale: ["The central fovea is avascular; it has no extra retinal vessels.", "", "The appearance is not caused by haemorrhage into the vitreous.", "Vortex veins drain the choroid; they do not explain the red appearance."],
        misconceptionIds: [], sources: ["C1", "C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L01-04", version: 1, objectiveIds: ["L01-O5"], familyId: "F-L01-laterality", pool: "practice", difficulty: 1,
        stem: "You face a patient and see a lesion on the side of their right eye nearest to their nose. How should it be documented?",
        options: ["Right eye, temporal", "Left eye, nasal", "Right eye, nasal", "Examiner's left, medial"],
        answerIndex: 2,
        explanation: "Laterality and direction are always patient-centred. The side toward the nose is nasal, and the eye is the patient's right eye regardless of where it sits in the examiner's view.",
        distractorRationale: ["Temporal is toward the ear, not the nose.", "This uses the examiner's left rather than the patient's right eye.", "", "Examiner-centred descriptions are ambiguous and should not be used."],
        misconceptionIds: [], sources: ["C1"], reviewStatus: "draft"
      },
      {
        id: "Q-L01-05", version: 1, objectiveIds: ["L01-O4"], familyId: "F-L01-orbit-walls", pool: "exam", difficulty: 2,
        stem: "A child with sinusitis develops eyelid swelling and painful, restricted eye movement. Through which thin orbital wall did infection most likely spread from the sinus?",
        options: ["Lateral wall (zygomatic)", "Roof (frontal)", "Medial wall (lamina papyracea of the ethmoid)", "Orbital floor (maxilla) only"],
        answerIndex: 2,
        explanation: "The medial wall is very thin where the ethmoid forms it, and the ethmoid sinuses lie immediately medial. This is the classic route for sinus infection to reach the orbit.",
        distractorRationale: ["The lateral wall is the thickest wall and does not border an air sinus.", "The roof borders the frontal sinus and brain but is not the usual route described.", "", "The floor is thin and borders the maxillary sinus, but the ethmoid route is the most common in orbital cellulitis."],
        misconceptionIds: [], sources: ["C1", "C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L01-06", version: 1, objectiveIds: ["L01-O1", "L01-O3"], familyId: "F-L01-retinal-layer-function", pool: "exam", difficulty: 3,
        stem: "A disease separates the neurosensory retina from the retinal pigment epithelium. Which cells are most directly deprived of their normal metabolic support?",
        options: ["Ganglion cells", "Photoreceptors", "Corneal endothelial cells", "Ciliary epithelium"],
        answerIndex: 1,
        explanation: "Photoreceptors lie in the outer retina against the RPE and depend on the RPE and choroid. Separation (as in retinal detachment) removes that support.",
        distractorRationale: ["Ganglion cells are inner retinal and rely mainly on the retinal circulation.", "", "The corneal endothelium is in the anterior segment and unrelated.", "The ciliary epithelium makes aqueous and is not part of the retina-RPE interface."],
        misconceptionIds: [], sources: ["C1", "C2"], reviewStatus: "draft"
      }
    ],
    sources: ["C1", "C2"],
    reviewStatus: "draft"
  },
  {
    id: "L02",
    title: "Visual and ocular physiology",
    group: "Foundations",
    emphasis: "Accommodation, aqueous production/outflow, retinal function and visual development",
    signature: "Manipulate a mechanism and predict the downstream change",
    prerequisites: ["L01"],
    studios: ["LAB01", "LAB02", "LAB10", "LAB14"],
    activities: ["T018", "T082"],
    estMinutes: 40,
    objectives: [
      { id: "L02-O1", text: "Explain the sequence ciliary muscle contraction → zonular relaxation → increased lens power during accommodation." },
      { id: "L02-O2", text: "Predict the direction of change in intraocular pressure when aqueous production or outflow is altered." },
      { id: "L02-O3", text: "Distinguish rod and cone function by lighting condition, retinal distribution and colour vision." },
      { id: "L02-O4", text: "Explain why abnormal visual input during early childhood can cause lasting visual loss (amblyopia) in a structurally normal eye." }
    ],
    bridge: "From L01 you know the ciliary body, lens, zonules, aqueous pathway and retinal layers. This lecture asks what each structure does and how a change in one step changes the next. Thinking in cause-and-effect chains is the skill you will reuse for disease.",
    essentials: [
      "Accommodation adds focusing power for near objects. When the ciliary muscle contracts, the ring it forms gets smaller, zonular tension falls and the elastic lens becomes more curved, so its power increases.",
      "The near response links three actions: accommodation, convergence of the eyes and pupil constriction. They usually occur together but are controlled by distinct pathways.",
      "With age the lens becomes less able to change shape, so the maximum accommodation falls. This is presbyopia; it affects near focus and can coexist with any distance refractive error.",
      "Intraocular pressure reflects a balance between aqueous production by the ciliary body and outflow through the trabecular meshwork and uveoscleral route. Reduced outflow or increased production tends to raise pressure.",
      "Rods are very sensitive, dominate in dim light and are absent from the central fovea; cones work in brighter light, provide colour and fine detail, and are concentrated at the fovea.",
      "The visual system develops after birth. A clear, focused and aligned image in each eye during a sensitive period is needed for normal cortical development; otherwise amblyopia may result."
    ],
    full: [
      "Accommodation is best understood as a chain. Parasympathetic signals via the oculomotor nerve contract the ciliary muscle; the ciliary ring moves inward; zonules slacken; the lens capsule moulds the lens into a rounder, more powerful shape. Relaxation reverses each step. Cycloplegic drugs block the muscle and therefore abolish accommodation, which is why they are used to reveal the full refractive error in children (L06).",
      "Presbyopia follows from loss of lens elasticity rather than from failure of the ciliary muscle alone. The result is a near-point that recedes with age. Because it concerns accommodation, a myope, hyperope or emmetrope can all become presbyopic, and the near correction needed depends on the distance correction, working distance and remaining accommodation — not on age alone.",
      "Aqueous is actively secreted by the ciliary epithelium, a process that involves ion transport and the enzyme carbonic anhydrase; drugs that inhibit this enzyme reduce production. Outflow occurs mainly through the trabecular meshwork into Schlemm's canal (pressure-sensitive) and partly through the uveoscleral route. Anything that narrows or closes the angle, or increases resistance in the meshwork, raises pressure if production is unchanged.",
      "Pressure itself is only one link in glaucoma. Raised pressure is a major modifiable risk factor for optic nerve damage, but optic neuropathy can occur at statistically normal pressures and some eyes tolerate higher pressures without damage. Physiology predicts direction, not an individual diagnosis.",
      "Phototransduction converts light into an electrical signal. Photoreceptors are depolarised in darkness and hyperpolarise in response to light, reducing transmitter release. Signals pass via bipolar cells to ganglion cells, with horizontal and amacrine cells shaping contrast. The RPE regenerates visual pigment, so diseases of the RPE affect photoreceptor function.",
      "Dark adaptation is slower than light adaptation and is dominated by rod recovery. Impaired night vision suggests rod dysfunction (for example some inherited retinal dystrophies), whereas loss of central acuity and colour suggests cone or macular dysfunction.",
      "Visual development depends on experience. Constant blur in one eye (unequal refractive error), a misaligned eye or an opacity blocking the image can make the brain favour the other eye. If this persists during the sensitive period, the disadvantaged eye can stay poorly seeing even after the optical problem is fixed. Early detection is the logic behind childhood vision screening (L26, L33)."
    ],
    deeper: [
      "Tear film physiology: the outer lipid layer from meibomian glands slows evaporation, the aqueous component from the lacrimal glands carries nutrients and antimicrobial proteins, and mucins from goblet cells help the film spread. Each component maps onto a type of dry eye (L15).",
      "Corneal transparency depends on endothelial pump function. When endothelial cells are lost and the pump fails, the stroma takes up water and becomes hazy; human corneal endothelium has very limited capacity to regenerate."
    ],
    misconceptions: [
      "Mistake: during accommodation the zonules tighten to pull the lens rounder. Correction: the ciliary muscle contracts, zonules relax and the elastic lens rounds up on its own.",
      "Mistake: a normal pressure reading means the optic nerve is safe. Correction: pressure is a risk factor; glaucoma is defined by optic nerve structure and function.",
      "Mistake: amblyopia means the eye itself is damaged. Correction: amblyopia is a developmental visual deficit in the brain's processing of an eye's input, often with a structurally normal eye."
    ],
    entryChallenge: {
      prompt: "If a drug paralyses the ciliary muscle, what happens to the lens power for near objects, and why?",
      answer: "Near focusing power falls because the muscle cannot contract, the zonules stay tense and the lens cannot round up; accommodation is lost."
    },
    contrast: {
      a: "Decreased trabecular outflow with normal production: pressure tends to rise.",
      b: "Decreased production with normal outflow: pressure tends to fall.",
      discriminator: "Ask which side of the balance changed — inflow (ciliary body) or outflow (angle/meshwork)."
    },
    workedExample: {
      problem: "Predict what happens to a patient's ability to read when a cycloplegic drop is instilled, and what happens to the pupil.",
      steps: [
        "A cycloplegic agent blocks the ciliary muscle, so accommodation is lost and near vision blurs unless a near correction is used.",
        "Most cycloplegic agents are antimuscarinic and also block the iris sphincter, so the pupil dilates.",
        "Note the distinction: a drug can dilate the pupil without paralysing accommodation (a sympathomimetic), so dilation and cycloplegia are not the same concept.",
        "State the expected observation: blurred near vision and a large pupil until the drug wears off."
      ]
    },
    transfer: {
      prompt: "A schematic graph shows near-point distance on the vertical axis and age on the horizontal axis for an emmetropic eye. Describe its shape and explain why a myopic person of the same age may still read without glasses.",
      modelAnswer: "The near point moves further away as age increases because accommodation amplitude falls. An uncorrected myope already has a far point at a finite near distance, so they may read without glasses by using their myopia — but that does not mean they are not presbyopic; the distance and near needs are separate dimensions."
    },
    items: [
      {
        id: "Q-L02-01", version: 1, objectiveIds: ["L02-O1"], familyId: "F-L02-accommodation-chain", pool: "practice", difficulty: 1,
        stem: "During accommodation for a near target, which combination occurs?",
        options: ["Ciliary muscle relaxes, zonules tighten, lens flattens", "Ciliary muscle contracts, zonules relax, lens becomes more curved", "Ciliary muscle contracts, zonules tighten, lens becomes more curved", "Iris dilator contracts, lens moves forward"],
        answerIndex: 1,
        explanation: "Contraction of the ciliary muscle reduces zonular tension, allowing the elastic lens to become more curved and more powerful.",
        distractorRationale: ["This is the state for distance viewing.", "", "Zonules relax, not tighten, during accommodation.", "Pupil constriction (not dilation) accompanies the near response."],
        misconceptionIds: [], sources: ["C1"], reviewStatus: "draft"
      },
      {
        id: "Q-L02-02", version: 1, objectiveIds: ["L02-O2"], familyId: "F-L02-iop-balance", pool: "practice", difficulty: 1,
        stem: "If trabecular outflow resistance increases while aqueous production is unchanged, the expected direction of intraocular pressure change is:",
        options: ["Increase", "Decrease", "No change, because uveoscleral flow always compensates fully", "Unpredictable in principle"],
        answerIndex: 0,
        explanation: "With production constant, greater resistance to outflow raises pressure until a new balance is reached. Physiology predicts the direction, not the size, in an individual.",
        distractorRationale: ["", "Lower pressure would follow reduced production or increased outflow.", "The uveoscleral route does not fully compensate for raised trabecular resistance.", "The direction is predictable from the balance even though magnitude varies."],
        misconceptionIds: [], sources: ["C1"], reviewStatus: "draft"
      },
      {
        id: "Q-L02-03", version: 1, objectiveIds: ["L02-O3"], familyId: "F-L02-rods-cones", pool: "practice", difficulty: 1,
        stem: "A patient reports difficulty seeing in dim light but normal reading acuity in daylight. Which photoreceptor system is most likely impaired?",
        options: ["Foveal cones", "Rods", "Retinal ganglion cells only", "Corneal endothelium"],
        answerIndex: 1,
        explanation: "Rods dominate vision in dim light and are concentrated outside the fovea. Normal daytime acuity points away from a foveal cone problem.",
        distractorRationale: ["Foveal cone dysfunction typically reduces daylight acuity and colour vision.", "", "Ganglion cell disease does not selectively cause night blindness.", "The endothelium is not a photoreceptor and affects corneal clarity."],
        misconceptionIds: [], sources: ["C1"], reviewStatus: "draft"
      },
      {
        id: "Q-L02-04", version: 1, objectiveIds: ["L02-O1"], familyId: "F-L02-cyclo-vs-dilation", pool: "practice", difficulty: 2,
        stem: "Which statement correctly distinguishes dilation from cycloplegia?",
        options: ["They are the same effect described in two ways", "Cycloplegia is pupil constriction", "A drug can dilate the pupil without paralysing the ciliary muscle", "Cycloplegia increases accommodation"],
        answerIndex: 2,
        explanation: "Mydriasis (pupil dilation) and cycloplegia (paralysis of accommodation) are separate effects. A sympathomimetic agent dilates via the dilator muscle without blocking accommodation, whereas antimuscarinic agents do both.",
        distractorRationale: ["They are different effects on different muscles.", "Cycloplegia refers to the ciliary muscle, not pupil constriction.", "", "Cycloplegia abolishes accommodation."],
        misconceptionIds: [], sources: ["C1"], reviewStatus: "draft"
      },
      {
        id: "Q-L02-05", version: 1, objectiveIds: ["L02-O4"], familyId: "F-L02-amblyopia-mechanism", pool: "exam", difficulty: 2,
        stem: "A 4-year-old has a much higher hyperopia in the left eye than the right; both eyes are structurally normal. Why may left visual acuity remain reduced even with full glasses?",
        options: ["The left retina has degenerated from blur", "Abnormal input during development led to amblyopia in the visual pathway", "Glasses cannot correct hyperopia in children", "The left optic nerve is necessarily hypoplastic"],
        answerIndex: 1,
        explanation: "Persistent blur in one eye during the sensitive period can cause amblyopia — a developmental deficit in cortical processing. Correcting the optics is necessary but may not alone restore acuity; additional treatment and monitoring may be needed.",
        distractorRationale: ["Blur does not cause retinal degeneration; the eye is structurally normal.", "", "Plus lenses correct hyperopia in children as in adults.", "Optic nerve hypoplasia is a separate structural condition that must not be assumed."],
        misconceptionIds: ["M-RX-VS-DIAGNOSIS"], sources: ["C1"], reviewStatus: "draft"
      },
      {
        id: "Q-L02-06", version: 1, objectiveIds: ["L02-O2"], familyId: "F-L02-production-drug", pool: "exam", difficulty: 2,
        stem: "A drug inhibits carbonic anhydrase in the ciliary epithelium. Which part of the pressure balance does it change, and in which direction should pressure move?",
        options: ["Increases outflow; pressure falls", "Reduces production; pressure falls", "Reduces outflow; pressure rises", "Increases production; pressure rises"],
        answerIndex: 1,
        explanation: "Carbonic anhydrase supports aqueous secretion. Inhibiting it reduces production, so pressure tends to fall when outflow is unchanged.",
        distractorRationale: ["The mechanism is on the production side, not outflow.", "", "Neither outflow nor the direction is correct.", "Inhibition reduces rather than increases production."],
        misconceptionIds: [], sources: ["C1"], reviewStatus: "draft"
      }
    ],
    sources: ["C1", "C2", "K8"],
    reviewStatus: "draft"
  },
  {
    id: "L03",
    title: "Basic geometrical optics",
    group: "Optics & refraction",
    emphasis: "Diopters, focal length, vergence, spherical/cylindrical lenses and simplified image formation",
    signature: "Ray-and-lens workbench",
    prerequisites: [],
    studios: ["LAB01", "LAB03"],
    activities: ["T081"],
    estMinutes: 45,
    objectives: [
      { id: "L03-O1", text: "Given a focal length in metres, state the lens power in dioptres (F = 1/f) and vice versa." },
      { id: "L03-O2", text: "Given an object distance, calculate the vergence of light at the lens with the correct sign, and the image vergence after a thin lens (L′ = L + F)." },
      { id: "L03-O3", text: "Explain how a cylindrical lens differs from a spherical lens, including why it has an axis of zero power and maximum power perpendicular to it." },
      { id: "L03-O4", text: "Using F(θ) = S + C·sin²(θ − A), state the meridional power of a spherocylinder at a given meridian." },
      { id: "L03-O5", text: "Distinguish prism dioptres from lens dioptres and from degrees." }
    ],
    bridge: "You need only basic algebra and the idea that lenses bend light. A dioptre measures how strongly a lens converges or diverges light. Everything in refraction — refractive errors, prescriptions and retinoscopy — is built on vergence arithmetic introduced here.",
    essentials: [
      "Lens power in dioptres is the reciprocal of focal length in metres: F = 1/f. A +2.00 D lens focuses parallel light 0.5 m behind it; a −2.00 D lens makes parallel light diverge as if from a point 0.5 m in front of it.",
      "Vergence describes how light is spreading or converging at a point: L = 1/l in air, with l in metres. Light diverging from a real object is given negative vergence (an object 0.5 m away gives −2.00 D at the lens); converging light has positive vergence.",
      "A thin lens adds its power to the incoming vergence: L′ = L + F. If the result is positive, light converges to a real image at 1/L′ metres behind the lens.",
      "A spherical lens has the same power in every meridian. A cylindrical lens has zero power along its axis and its full power in the meridian 90° away from the axis.",
      "A spherocylinder with sphere S, cylinder C and axis A has meridional power F(θ) = S + C·sin²(θ − A). At the axis the power is S; 90° away it is S + C. These two meridians are the principal meridians.",
      "A prism deviates light without focusing it. One prism dioptre deviates a ray by 1 cm at 1 m. Prism dioptres, lens dioptres and degrees are three different units."
    ],
    full: [
      "Start with sign conventions, because most optics errors are sign errors. Measure distances from the lens, with light travelling left to right. A real object to the left gives diverging light at the lens and a negative vergence. A plus lens adds convergence; a minus lens adds divergence. The image is where the outgoing vergence would bring the rays to a point.",
      "Worked arithmetic: an object 0.25 m in front of a +6.00 D lens gives L = −4.00 D, so L′ = +2.00 D and the image is 0.5 m behind the lens. If the lens were +4.00 D, L′ would be 0 and the light would leave parallel — the object is at the focal point.",
      "A cylinder is a slice of a cylinder of glass. Along its axis the surface is flat, so there is no focusing in that meridian; perpendicular to the axis the surface is curved and focusing is maximal. A point source viewed through a cylinder forms a line image parallel to the axis, because only one meridian is focused.",
      "Combining a sphere and a cylinder gives a spherocylinder. Using F(θ) = S + C·sin²(θ − A): at θ = A, sin² = 0, so the power is S; at θ = A + 90°, sin² = 1, so the power is S + C. In between, the power varies smoothly. For example, plano −4.00 × 180 has 0.00 D at 180°, −2.00 D at 45° and 135°, and −4.00 D at 90°.",
      "The axis is therefore the meridian of sphere-only power, not the meridian of the cylinder's effect. Writing the power cross — the two principal meridians with their powers — is the safest check before any further step.",
      "Regular astigmatic systems produce two line foci at different distances, one for each principal meridian. Between them, the blur patch is smallest at the circle of least confusion. This is why an astigmatic eye has blur that varies with orientation rather than a single focus.",
      "Prisms are described separately. A prism dioptre is a displacement of 1 cm at 1 m. Decentring a lens produces prism; Prentice's rule states that prism in dioptres equals decentration in centimetres multiplied by lens power in dioptres. Prism and base direction are recorded in separate prescription fields."
    ],
    deeper: [
      "Power vectors express a spherocylinder as three numbers: M (the spherical equivalent, S + C/2), J0 and J45. Unlike sphere/cylinder/axis, these components add and subtract linearly, which makes them the correct tool for comparing or combining lenses mathematically.",
      "For two thin lenses in contact in the same plane, powers add. For separated lenses, or a spectacle lens in front of the eye, separation matters (vertex effects); IRIS teaches the same-plane model first and labels it as a simplification.",
      "The circle of least confusion lies at the dioptric midpoint of the two line foci — at the average vergence — which is generally not the arithmetic midpoint of the two focal distances."
    ],
    misconceptions: [
      "Mistake: the axis of a cylinder is where its power acts. Correction: the axis is the meridian of zero cylinder power; the full cylinder power acts 90° away.",
      "Mistake: an object 50 cm away gives +2.00 D of vergence. Correction: light from a real object diverges, so its vergence is −2.00 D at the lens.",
      "Mistake: prism dioptres and lens dioptres are interchangeable. Correction: lens dioptres measure focusing power; prism dioptres measure angular deviation (1 cm at 1 m)."
    ],
    entryChallenge: {
      prompt: "What is the power of a lens that focuses parallel light 25 cm behind it?",
      answer: "+4.00 D, because F = 1/f = 1/0.25 m."
    },
    contrast: {
      a: "Spherical lens +2.00 DS: +2.00 D in every meridian; a point images to a point.",
      b: "Cylinder plano +2.00 × 090: 0.00 D at 90°, +2.00 D at 180°; a point images to a line parallel to the axis.",
      discriminator: "Whether power varies with meridian — check F(θ) at the axis and 90° away."
    },
    workedExample: {
      problem: "Find the meridional power of +1.00 +2.00 × 090 at 90°, 180° and 135°.",
      steps: [
        "Write S = +1.00, C = +2.00, A = 90°.",
        "At 90°: sin²(0°) = 0, so F = +1.00 D.",
        "At 180°: sin²(90°) = 1, so F = +1.00 + 2.00 = +3.00 D.",
        "At 135°: sin²(45°) = 0.5, so F = +1.00 + 1.00 = +2.00 D.",
        "Power cross: +1.00 D at 90°, +3.00 D at 180°. Note this differs from a power cross of +1.00 at 90° and +2.00 at 180°, which would be written +1.00 +1.00 × 090."
      ]
    },
    transfer: {
      prompt: "A graph shows meridional power against meridian angle from 0° to 180°: it is a smooth curve whose least-minus value is −1.00 D at 30° and whose most-minus value is −3.00 D at 120°. Write a spherocylindrical prescription that matches it in minus-cylinder form.",
      modelAnswer: "The sphere-only (least minus) meridian is 30° with −1.00 D, so the axis is 030 and S = −1.00. The meridian 90° away has −3.00 D, so C = −2.00. Prescription: −1.00 −2.00 × 030. Check: F(120°) = −1.00 + (−2.00)·sin²(90°) = −3.00 D."
    },
    items: [
      {
        id: "Q-L03-01", version: 1, objectiveIds: ["L03-O1"], familyId: "F-L03-power-focal", pool: "practice", difficulty: 1,
        stem: "A lens has a focal length of −0.40 m. What is its power?",
        options: ["−0.40 D", "−2.50 D", "+2.50 D", "−4.00 D"],
        answerIndex: 1,
        explanation: "F = 1/f = 1/(−0.40 m) = −2.50 D. The sign is carried through: a negative focal length means a diverging lens.",
        distractorRationale: ["Focal length and power are reciprocals, not the same number.", "", "The sign has been lost; a negative focal length gives a minus lens.", "This divides incorrectly (1/0.25 would be 4)."],
        misconceptionIds: [], sources: ["O1"], reviewStatus: "draft"
      },
      {
        id: "Q-L03-02", version: 1, objectiveIds: ["L03-O2"], familyId: "F-L03-vergence-image", pool: "practice", difficulty: 2,
        stem: "An object is 0.50 m in front of a +5.00 D thin lens in air. Where is the image?",
        options: ["0.20 m behind the lens", "0.33 m behind the lens", "0.50 m behind the lens", "There is no real image"],
        answerIndex: 1,
        explanation: "Object vergence L = −1/0.50 = −2.00 D. L′ = L + F = −2.00 + 5.00 = +3.00 D, so the image is 1/3 m ≈ 0.33 m behind the lens.",
        distractorRationale: ["This ignores the object vergence and uses 1/F only.", "", "This treats the image as at the object distance without calculation.", "The outgoing vergence is positive, so a real image forms."],
        misconceptionIds: [], sources: ["O1"], reviewStatus: "draft"
      },
      {
        id: "Q-L03-03", version: 1, objectiveIds: ["L03-O4"], familyId: "F-L03-meridional-power", pool: "practice", difficulty: 2,
        stem: "What is the power of plano −4.00 × 180 in the 90° meridian?",
        options: ["0.00 D", "−2.00 D", "−4.00 D", "+4.00 D"],
        answerIndex: 2,
        explanation: "F(90°) = 0 + (−4.00)·sin²(90° − 180°) = −4.00 D. The axis (180°) is the meridian with sphere-only power, here 0.00 D; the full cylinder acts 90° away.",
        distractorRationale: ["0.00 D is the power along the axis (180°), not at 90°.", "−2.00 D is the power at 45° or 135°, or the spherical equivalent.", "", "The sign of the cylinder has been reversed."],
        misconceptionIds: ["M-AXIS-VS-MERIDIAN"], sources: ["O1"], reviewStatus: "draft"
      },
      {
        id: "Q-L03-04", version: 1, objectiveIds: ["L03-O3"], familyId: "F-L03-cyl-line-image", pool: "practice", difficulty: 2,
        stem: "A point of light is viewed through a pure cylinder plano +3.00 × 090. What shape and orientation of image forms at its focal plane?",
        options: ["A point", "A vertical line", "A horizontal line", "A circle of least confusion"],
        answerIndex: 1,
        explanation: "The 90° meridian (the axis) has no power, so rays spread vertically are not focused; the horizontal meridian is focused. The image is a line parallel to the axis — vertical.",
        distractorRationale: ["Only a spherical lens (equal power in all meridians) gives a point.", "", "The line is parallel to the axis, not perpendicular to it.", "A circle of least confusion needs two different focusing meridians, as in a spherocylinder."],
        misconceptionIds: ["M-AXIS-VS-MERIDIAN"], sources: ["O1"], reviewStatus: "draft"
      },
      {
        id: "Q-L03-05", version: 1, objectiveIds: ["L03-O4"], familyId: "F-L03-oblique-meridian", pool: "exam", difficulty: 3,
        stem: "What is the power of −1.00 −2.00 × 030 in the 75° meridian?",
        options: ["−1.00 D", "−2.00 D", "−3.00 D", "−1.50 D"],
        answerIndex: 1,
        explanation: "θ − A = 45°, and sin²(45°) = 0.5. F = −1.00 + (−2.00)(0.5) = −2.00 D. Oblique meridians lie between the two principal powers.",
        distractorRationale: ["This is the power at the axis (30°).", "", "This is the power at 120°, 90° from the axis.", "This uses a quarter of the cylinder instead of half."],
        misconceptionIds: ["M-SPHERE-FORGOTTEN", "M-AXIS-VS-MERIDIAN"], sources: ["O1"], reviewStatus: "draft"
      },
      {
        id: "Q-L03-06", version: 1, objectiveIds: ["L03-O5"], familyId: "F-L03-prism-units", pool: "exam", difficulty: 2,
        stem: "A ray passing through a prism is displaced 3 cm at a distance of 1 m. How is this prism described?",
        options: ["3 prism dioptres", "3 lens dioptres", "3 degrees", "0.33 prism dioptres"],
        answerIndex: 0,
        explanation: "One prism dioptre deviates a ray 1 cm at 1 m, so 3 cm at 1 m is 3 prism dioptres. Prism dioptres are not lens power and not degrees.",
        distractorRationale: ["", "Lens dioptres measure focusing power, not deviation.", "Degrees are a different angular unit; the values are not equal.", "This inverts the definition."],
        misconceptionIds: [], sources: ["O1"], reviewStatus: "draft"
      }
    ],
    sources: ["O1", "O2", "C1"],
    reviewStatus: "draft"
  },
  {
    id: "L04",
    title: "Refractive errors",
    group: "Optics & refraction",
    emphasis: "Myopia, hyperopia, presbyopia, regular/irregular astigmatism, anisometropia and corrective principles",
    signature: "Compare mechanisms and choose a correction category",
    prerequisites: ["L02", "L03"],
    studios: ["LAB01", "LAB02", "LAB03"],
    activities: ["T005", "T017", "T018", "T082"],
    estMinutes: 50,
    objectives: [
      { id: "L04-O1", text: "Explain where distant light focuses relative to the retina in unaccommodated myopia, hyperopia and emmetropia, and which lens sign corrects each." },
      { id: "L04-O2", text: "Given a full-distance-correction prescription, classify the refractive state from both principal corrective powers (spherical, simple, compound or mixed astigmatism)." },
      { id: "L04-O3", text: "Explain why presbyopia can coexist with any distance refractive error and why a near addition is not determined by age alone." },
      { id: "L04-O4", text: "Distinguish regular from irregular astigmatism and define anisometropia without relying on spherical equivalent alone." },
      { id: "L04-O5", text: "Interpret improvement with a pinhole as evidence of an optical contribution rather than proof that no disease exists." }
    ],
    bridge: "L03 gave you vergence and meridional power: F(θ) = S + C·sin²(θ − A). L02 showed that accommodation adds plus power. Here those ideas are applied to the eye: a refractive error is a mismatch between the eye's optical power and its length, described by the corrective lens that cancels it.",
    essentials: [
      "In emmetropia, with accommodation relaxed, distant light focuses on the retina. In myopia it focuses in front of the retina (the eye is too powerful for its length) and is corrected with minus lenses. In hyperopia it focuses behind the retina and is corrected with plus lenses.",
      "Young hyperopes can partly overcome their error by accommodating, which can cause eye strain or, in children, convergent misalignment. Some hyperopia is hidden (latent) until accommodation is relaxed with a cycloplegic drug.",
      "In regular astigmatism the eye has two principal meridians at right angles with different powers, giving two line foci. Classification uses both principal corrective powers: one zero and one minus is simple myopic astigmatism; both minus and unequal is compound myopic; one zero and one plus is simple hyperopic; both plus and unequal is compound hyperopic; opposite signs is mixed.",
      "Classification is only meaningful for a stated full distance correction with accommodation relaxed. A prescription describes a lens; it is not by itself a disease diagnosis.",
      "Presbyopia is the age-related loss of accommodation for near. It concerns near focus and can occur together with myopia, hyperopia or astigmatism. The near addition depends on the distance correction, working distance and measured near needs — not on age alone.",
      "Anisometropia is a clinically significant difference in refraction between the two eyes. Irregular astigmatism (for example from corneal scarring or keratoconus) cannot be fully described by sphere, cylinder and axis.",
      "A pinhole reduces the blur from refractive error. Improvement suggests an optical contribution; it does not prove the eye is otherwise healthy."
    ],
    full: [
      "Mechanism: refractive error arises from a mismatch between axial length and the combined power of cornea and lens. Most myopia is axial (the eye is long); refractive myopia can also arise from increased lens power, as in nuclear cataract (L18). Hyperopia is often axial (a short eye). The far point of a myopic eye lies at a finite distance in front of the eye, which is why an uncorrected myope sees near objects clearly.",
      "Presentation follows the mechanism. Myopes report blurred distance vision. Hyperopes may have blurred near vision, headaches with near work, or no symptoms if young and able to accommodate. Astigmatism gives orientation-dependent blur and distortion at all distances. Presbyopia gives difficulty with near tasks, often noticed as needing to hold reading material further away or needing more light.",
      "Signs and tests: distance and near acuity, pinhole acuity, objective refraction (retinoscopy or autorefraction) and subjective refraction (L06). In children and in suspected latent hyperopia, cycloplegic refraction relaxes accommodation and reveals the full error. Keratometry and topography measure the front corneal surface; total refractive astigmatism also includes the lens and other surfaces, so corneal and total astigmatism are not interchangeable.",
      "Classification uses both principal powers in a full-distance-correction context. For example, plano −4.00 × 180 has 0.00 D at 180° and −4.00 D at 90°: one meridian emmetropic and one myopic, so simple myopic astigmatism. +1.00 −2.00 × 180 has +1.00 D at 180° and −1.00 D at 90°: opposite signs, so mixed astigmatism, even though its spherical equivalent is zero.",
      "Treat the dimensions separately rather than as one exclusive label: spherical component, regular astigmatism (magnitude and orientation), distance versus near needs, accommodation status, and differences between the eyes. A person can be myopic, astigmatic and presbyopic at once.",
      "Correction principles: spectacles, contact lenses and refractive surgery all change the vergence of light reaching the retina. Correcting a refractive error does not treat amblyopia by itself in a child, and a new symptom of blurred vision is not assumed refractive until acuity improves appropriately with correction or pinhole and other causes are considered.",
      "Interpretation and documentation: record each eye separately, state whether results are cycloplegic, and state the context (full distance correction, near working distance). Write 'refractive classification' as a separate field from 'diagnosis', so an emmetropic plano result is not mistaken for a healthy eye."
    ],
    deeper: [
      "Antimetropia is the special case of anisometropia where one eye is myopic and the other hyperopic. Large interocular differences in spectacle correction can produce unequal retinal image sizes (aniseikonia), which is one reason contact lenses may be preferred in some cases.",
      "With-the-rule, against-the-rule and oblique astigmatism describe orientation and depend on a stated convention (corrective cylinder axis versus the eye's steeper meridian). Learn the categories only after the meridian/axis distinction is secure.",
      "Irregular astigmatism includes higher-order aberrations that a spherocylindrical lens cannot neutralise. A poor fit of a spherocylinder to measured data is a hint, not a diagnosis; corneal imaging is used to characterise it (L31)."
    ],
    misconceptions: [
      "Mistake: a spherical equivalent of zero means no refractive error. Correction: +1.00 −2.00 × 180 has SE 0 but is mixed astigmatism; classify from both principal powers.",
      "Mistake: plano −4.00 × 180 is compound myopic astigmatism because there is −4.00 of cylinder. Correction: its principal powers are 0.00 and −4.00 D, so it is simple myopic astigmatism in a full-correction context.",
      "Mistake: a 45-year-old needs a specific ADD because of their age. Correction: the ADD depends on measured near needs, distance correction and working distance; age only indicates likelihood.",
      "Mistake: improvement with pinhole proves the eye is healthy. Correction: pinhole improvement indicates an optical component; coexisting disease is still possible."
    ],
    entryChallenge: {
      prompt: "A person can read small print without glasses but cannot see road signs. Where is their far point, and which lens sign corrects them?",
      answer: "Their far point lies at a finite distance in front of the eye (myopia); minus lenses correct the distance blur."
    },
    contrast: {
      a: "Simple myopic astigmatism: plano −4.00 × 180 (principal powers 0.00 and −4.00 D).",
      b: "Compound myopic astigmatism: −2.00 −1.00 × 180 (principal powers −2.00 and −3.00 D).",
      discriminator: "Whether one principal corrective power is exactly zero or both are minus."
    },
    workedExample: {
      problem: "In a full-distance-correction teaching case, classify +2.00 +1.00 × 090.",
      steps: [
        "Find the principal powers: at the axis (90°) the power is S = +2.00 D.",
        "At 180° the power is S + C = +3.00 D.",
        "Both principal corrective powers are plus and unequal.",
        "Classification: compound hyperopic astigmatism (in this stated context). The equivalent plus/minus transposition is +3.00 −1.00 × 180."
      ]
    },
    transfer: {
      prompt: "A ray diagram shows an eye viewing a distant point: horizontal-meridian rays focus exactly on the retina, vertical-meridian rays focus behind the retina. Name the refractive classification and the sign of the correcting lens power in each principal meridian.",
      modelAnswer: "One meridian is emmetropic and the other hyperopic: simple hyperopic astigmatism. The meridian focused on the retina needs 0.00 D; the meridian focused behind needs plus power. The correcting lens therefore has zero power in one principal meridian and plus in the other (for example plano +x.xx cylinder with the axis along the meridian that needs no correction)."
    },
    items: [
      {
        id: "Q-L04-01", version: 1, objectiveIds: ["L04-O2"], familyId: "F-L04-classify-simple", pool: "practice", difficulty: 2,
        stem: "In a full-distance-correction teaching case with accommodation relaxed, the prescription is plano −4.00 × 180. What is the refractive classification?",
        options: ["Compound myopic astigmatism", "Simple myopic astigmatism", "Mixed astigmatism", "Spherical myopia of −2.00 D"],
        answerIndex: 1,
        explanation: "Principal corrective powers are 0.00 D at 180° and −4.00 D at 90°. One zero and one minus meridian define simple myopic astigmatism.",
        distractorRationale: ["Compound myopic astigmatism needs both principal powers to be minus.", "", "Mixed astigmatism needs principal powers of opposite sign.", "−2.00 D is the spherical equivalent, which does not describe the astigmatism or the classification."],
        misconceptionIds: ["M-SIMPLE-VS-COMPOUND", "M-SE-AS-EQUIVALENT"], sources: ["O1"], reviewStatus: "draft"
      },
      {
        id: "Q-L04-02", version: 1, objectiveIds: ["L04-O2"], familyId: "F-L04-mixed-zero-se", pool: "practice", difficulty: 3,
        stem: "A full distance correction is +1.00 −2.00 × 180. A student says the eye has no net refractive error because the spherical equivalent is zero. What is the best response?",
        options: ["Agree; SE zero means emmetropia", "Disagree; the principal powers are +1.00 and −1.00 D, so this is mixed astigmatism", "Disagree; it is simple myopic astigmatism", "Agree, but only if acuity is normal"],
        answerIndex: 1,
        explanation: "At 180° the power is +1.00 D; at 90° it is −1.00 D. Opposite-sign principal powers define mixed astigmatism regardless of the average.",
        distractorRationale: ["The average hides the two non-zero principal powers.", "", "Simple astigmatism requires one principal power to be zero.", "Classification is optical and does not depend on an acuity reading."],
        misconceptionIds: ["M-MIXED-ZERO-SE"], sources: ["O1"], reviewStatus: "draft"
      },
      {
        id: "Q-L04-03", version: 1, objectiveIds: ["L04-O3"], familyId: "F-L04-presbyopia-coexist", pool: "practice", difficulty: 2,
        stem: "A 52-year-old with a distance correction of −3.00 DS in each eye reports difficulty reading through their glasses. Which statement is most accurate?",
        options: ["A myope cannot be presbyopic", "The required ADD can be read from a table using age alone", "Presbyopia can coexist with myopia; the near addition must be assessed from near needs and working distance", "The distance prescription should be increased in minus to help near vision"],
        answerIndex: 2,
        explanation: "Presbyopia is loss of accommodation and coexists with distance ametropia. Removing the glasses may let this myope read, but the near correction is determined by assessment, not by age.",
        distractorRationale: ["Myopes become presbyopic like everyone else; they may simply read without their distance glasses.", "Age suggests likelihood but does not determine an individual ADD.", "", "More minus would increase the accommodative demand and worsen near vision."],
        misconceptionIds: ["M-RX-VS-DIAGNOSIS"], sources: ["K8", "O1"], reviewStatus: "draft"
      },
      {
        id: "Q-L04-04", version: 1, objectiveIds: ["L04-O1"], familyId: "F-L04-focus-location", pool: "practice", difficulty: 1,
        stem: "With accommodation relaxed, distant light focuses behind the retina. Which correction moves the focus onto the retina?",
        options: ["A minus spherical lens", "A plus spherical lens", "A pinhole worn permanently", "No lens; accommodation is the definitive correction"],
        answerIndex: 1,
        explanation: "Focus behind the retina means insufficient converging power for the eye's length (hyperopia). A plus lens adds convergence.",
        distractorRationale: ["Minus lenses move the focus further back and suit myopia.", "", "A pinhole reduces blur but is not a corrective lens for daily use.", "Accommodation can compensate in the young but costs effort and is lost with age."],
        misconceptionIds: [], sources: ["O1"], reviewStatus: "draft"
      },
      {
        id: "Q-L04-05", version: 1, objectiveIds: ["L04-O2"], familyId: "F-L04-classify-compound", pool: "exam", difficulty: 2,
        stem: "A full distance correction is written −3.00 +1.00 × 090. What is its refractive classification?",
        options: ["Simple myopic astigmatism", "Mixed astigmatism", "Compound myopic astigmatism", "Compound hyperopic astigmatism"],
        answerIndex: 2,
        explanation: "At 90° the power is −3.00 D; at 180° it is −2.00 D. Both principal powers are minus and unequal: compound myopic astigmatism. It is the plus-cylinder form of −2.00 −1.00 × 180.",
        distractorRationale: ["Neither principal power is zero.", "The plus cylinder does not make the principal powers opposite in sign; both are minus.", "", "Both principal powers are minus, not plus."],
        misconceptionIds: ["M-SIMPLE-VS-COMPOUND", "M-PRINCIPAL-AS-CYL"], sources: ["O1"], reviewStatus: "draft"
      },
      {
        id: "Q-L04-06", version: 1, objectiveIds: ["L04-O5"], familyId: "F-L04-pinhole-interpretation", pool: "exam", difficulty: 2,
        stem: "A patient's right acuity improves substantially with a pinhole. What is the most defensible conclusion?",
        options: ["The eye has no ocular disease", "There is an optical (likely refractive) contribution to the reduced acuity; other causes are not excluded", "The patient has cataract", "Refraction is unnecessary because pinhole acuity is recorded"],
        answerIndex: 1,
        explanation: "Pinhole improvement suggests that part of the blur is optical. It does not identify the cause or exclude coexisting disease, and it does not replace refraction.",
        distractorRationale: ["A pinhole cannot exclude disease such as early macular or optic nerve problems.", "", "Cataract is one possible cause of optical blur but is not established by a pinhole.", "Pinhole acuity is a screening clue; refraction determines the correction."],
        misconceptionIds: ["M-FINDING-AS-CERTAINTY"], sources: ["C1"], reviewStatus: "draft"
      }
    ],
    sources: ["O1", "K8", "C1", "C2"],
    reviewStatus: "draft"
  },
  {
    id: "L05",
    title: "Prescription notation and power crosses",
    group: "Optics & refraction",
    emphasis: "OD/OS/OU, SPH/CYL/AXIS, plus/minus cylinder, principal meridians, transposition, spherical equivalent",
    signature: "Write and repair a prescription from a power cross",
    prerequisites: ["L03"],
    studios: ["LAB01", "LAB03"],
    activities: ["T019", "T020", "T081"],
    estMinutes: 50,
    objectives: [
      { id: "L05-O1", text: "Read a prescription form, including OD/OS/OU, SPH, CYL, AXIS, ADD and separate prism/base fields, and state what each field means." },
      { id: "L05-O2", text: "Convert a spherocylindrical prescription to a power cross and a power cross back to a prescription in either cylinder form." },
      { id: "L05-O3", text: "Transpose between plus- and minus-cylinder forms using (S, C, A) → (S + C, −C, A ± 90°)." },
      { id: "L05-O4", text: "Calculate the spherical equivalent and explain why lenses with equal spherical equivalent are not equivalent corrections." },
      { id: "L05-O5", text: "Explain why two meridional samples at 90° and 180° do not uniquely identify an oblique lens." }
    ],
    bridge: "L03 introduced F(θ) = S + C·sin²(θ − A): at the axis the power is S, and 90° away it is S + C. This lecture turns that formula into a reliable writing and checking routine. The power cross is your safety net — draw it before transposing or classifying.",
    essentials: [
      "OD means right eye, OS left eye and OU both eyes. Each eye's prescription is written separately even if they are similar. SPH is sphere, CYL cylinder and AXIS the cylinder axis in degrees from 1 to 180. 'Plano' means zero sphere; 'DS' marks a purely spherical lens.",
      "The axis is the meridian where the lens has sphere-only power. The power 90° away from the axis equals sphere plus cylinder. These two meridians and their powers form the power cross.",
      "Any regular spherocylinder can be written in minus-cylinder or plus-cylinder form. Transpose by adding the cylinder to the sphere, reversing the cylinder sign and rotating the axis by 90°: (S, C, A) → (S + C, −C, A ± 90°). Example: plano −4.00 × 180 = −4.00 +4.00 × 090.",
      "The spherical equivalent (SE) is S + C/2. For plano −4.00 × 180 the SE is −2.00 D. SE is the average power; it is not a replacement for the full prescription.",
      "When the cylinder is zero, the axis has no meaning and should not be recorded or graded.",
      "ADD is a near addition of plus sphere on top of the distance prescription, keeping cylinder and axis. Prism and its base direction are separate fields, not part of sphere or cylinder."
    ],
    full: [
      "Reading to a power cross: take S at the axis meridian and S + C at the perpendicular meridian. For −2.00 −1.00 × 180: −2.00 D at 180° and −3.00 D at 90°. For +1.00 +2.00 × 090: +1.00 D at 90° and +3.00 D at 180°. Notice that the cylinder is the difference between the principal powers, not either principal power itself.",
      "Writing from a power cross: choose which meridian becomes the sphere. In minus-cylinder form, use the more plus (less minus) meridian as the sphere and its meridian as the axis; the cylinder is the more minus power minus the sphere. In plus-cylinder form, do the opposite. A power cross of +1.00 D at 90° and +2.00 D at 180° is +1.00 +1.00 × 090 or +2.00 −1.00 × 180.",
      "Transposition errors come in three kinds: changing only the cylinder sign (forgetting to add the cylinder to the sphere), forgetting to rotate the axis, and adding the cylinder with the wrong sign. Checking the power cross before and after transposition catches all three, because both forms must give identical powers in every meridian.",
      "Spherical equivalent is useful for estimating average defocus or for a first guess when a cylinder cannot be prescribed, but lenses with the same SE can differ greatly. Plano −4.00 × 180 and −2.00 DS share an SE of −2.00 D, yet one has 4 D of astigmatism and the other none.",
      "Only principal meridians determine a lens simply. For an oblique lens, powers at 90° and 180° are not the principal powers. Plano −4.00 × 045 and plano −4.00 × 135 both have −2.00 D at 0° and 90°, but at 45° their powers are 0.00 D and −4.00 D respectively. Comparing only two horizontal/vertical samples would wrongly call them equal.",
      "Documentation conventions: record axis as a three-digit number where local practice does (e.g. 090), normalise 0° to 180°, use the real minus sign, and keep OD and OS independent. A measured pair of glasses (lensometry) describes the lens; it does not prove what the wearer currently needs.",
      "Classification belongs to the clinical context: a prescription can be classified (L04) only in a stated full-distance-correction context. The notation itself is optical and says nothing about disease."
    ],
    deeper: [
      "Power vectors give a sign-independent representation: M = S + C/2, J0 = −(C/2)·cos 2A and J45 = −(C/2)·sin 2A, with meridional power F(θ) = M + J0·cos 2θ + J45·sin 2θ. Two prescriptions are equivalent only if all three components match.",
      "Lenses in the same plane combine by adding their power matrices or power vectors, not by adding written cylinders and averaging axes. Subtracting a proposal from a target gives the residual lens needed.",
      "Three independent meridional measurements are needed to determine a regular spherocylinder from arbitrary samples; two samples leave the lens underdetermined."
    ],
    misconceptions: [
      "Mistake: transposing −2.00 −1.00 × 180 gives −2.00 +1.00 × 180. Correction: add the cylinder to the sphere and rotate the axis: −3.00 +1.00 × 090.",
      "Mistake: a power cross of +1.00 at 90° and +2.00 at 180° is +1.00 +2.00 × 090. Correction: the cylinder is the difference (+1.00), so it is +1.00 +1.00 × 090; +1.00 +2.00 × 090 would put +3.00 at 180°.",
      "Mistake: −2.00 DS × 090 has an axis of 90°. Correction: with zero cylinder the axis is undefined.",
      "Mistake: same spherical equivalent means the same correction. Correction: lenses are equivalent only if every meridian has the same power."
    ],
    entryChallenge: {
      prompt: "Write the power cross for plano −4.00 × 180, then its plus-cylinder form and spherical equivalent.",
      answer: "0.00 D at 180°, −4.00 D at 90°. Plus-cylinder form: −4.00 +4.00 × 090. SE = −2.00 D."
    },
    contrast: {
      a: "plano −4.00 × 045: 0.00 D at 45°, −4.00 D at 135°.",
      b: "plano −4.00 × 135: 0.00 D at 135°, −4.00 D at 45°.",
      discriminator: "Both give −2.00 D at 0° and 90°; only the oblique principal meridians separate them."
    },
    workedExample: {
      problem: "Transpose +1.00 −3.00 × 045 and verify with a power cross.",
      steps: [
        "Power cross of the original: +1.00 D at 45°, and +1.00 + (−3.00) = −2.00 D at 135°.",
        "Transpose: new sphere = +1.00 + (−3.00) = −2.00; new cylinder = +3.00; new axis = 045 + 90 = 135.",
        "Result: −2.00 +3.00 × 135.",
        "Verify: at 135° the power is −2.00 D; at 45° it is −2.00 + 3.00 = +1.00 D — the same power cross.",
        "In a full-correction context, principal powers of +1.00 and −2.00 D have opposite signs: mixed astigmatism."
      ]
    },
    transfer: {
      prompt: "A lensometer reading is recorded only as a sketch: one set of lines focuses at −0.50 D when oriented along 20°, the other at −2.50 D along 110°. Write the lens in minus-cylinder form and state what this does and does not tell you about the wearer.",
      modelAnswer: "Principal powers: −0.50 D at 20° and −2.50 D at 110°. Minus-cylinder form uses the less-minus meridian as sphere and axis: −0.50 −2.00 × 020 (plus-cylinder form −2.50 +2.00 × 110). This describes the spectacle lens; it does not establish the wearer's current refraction or any diagnosis."
    },
    items: [
      {
        id: "Q-L05-01", version: 1, objectiveIds: ["L05-O3"], familyId: "F-L05-transpose", pool: "practice", difficulty: 2,
        stem: "Which is the correct plus-cylinder transposition of −2.00 −1.00 × 180?",
        options: ["−2.00 +1.00 × 180", "−3.00 +1.00 × 090", "−2.00 +1.00 × 090", "−1.00 +1.00 × 090"],
        answerIndex: 1,
        explanation: "(S, C, A) → (S + C, −C, A ± 90°): −2.00 + (−1.00) = −3.00, cylinder +1.00, axis 090. Both forms give −2.00 D at 180° and −3.00 D at 90°.",
        distractorRationale: ["Only the cylinder sign changed; the sphere and axis were not updated.", "", "The axis was rotated but the cylinder was not added to the sphere.", "The cylinder was subtracted rather than added to the sphere."],
        misconceptionIds: ["M-SIGN-ONLY-TRANSPOSE", "M-AXIS-NOT-ROTATED", "M-SPHERE-FORGOTTEN"], sources: ["O1"], reviewStatus: "draft"
      },
      {
        id: "Q-L05-02", version: 1, objectiveIds: ["L05-O2"], familyId: "F-L05-rx-to-powercross", pool: "practice", difficulty: 2,
        stem: "What is the power cross of +1.00 +2.00 × 090?",
        options: ["+1.00 D at 90° and +2.00 D at 180°", "+1.00 D at 90° and +3.00 D at 180°", "+3.00 D at 90° and +1.00 D at 180°", "+2.00 D at 90° and +1.00 D at 180°"],
        answerIndex: 1,
        explanation: "At the axis (90°) the power is the sphere, +1.00 D. At 180° it is sphere plus cylinder, +3.00 D.",
        distractorRationale: ["This copies the cylinder value as a principal power instead of adding it to the sphere.", "", "The meridians are swapped; the sphere belongs to the axis meridian.", "This places the cylinder at the axis."],
        misconceptionIds: ["M-PRINCIPAL-AS-CYL", "M-AXIS-VS-MERIDIAN"], sources: ["O1"], reviewStatus: "draft"
      },
      {
        id: "Q-L05-03", version: 1, objectiveIds: ["L05-O4"], familyId: "F-L05-se-trap", pool: "practice", difficulty: 2,
        stem: "plano −4.00 × 180 and −2.00 DS have the same spherical equivalent. Which statement is correct?",
        options: ["They are optically equivalent corrections", "They differ: the first has 0.00 and −4.00 D principal powers, the second −2.00 D in every meridian", "They differ only in notation convention", "They are equivalent if the patient's acuity is the same"],
        answerIndex: 1,
        explanation: "SE = S + C/2 = −2.00 D for both, but equivalence requires equal power in every meridian. One is astigmatic and one is spherical.",
        distractorRationale: ["Equal averages do not mean equal lenses.", "", "Notation convention differences (plus vs minus cylinder) preserve every meridian; these do not.", "Acuity is not a test of optical equivalence."],
        misconceptionIds: ["M-SE-AS-EQUIVALENT"], sources: ["O1", "O2"], reviewStatus: "draft"
      },
      {
        id: "Q-L05-04", version: 1, objectiveIds: ["L05-O1"], familyId: "F-L05-zero-cyl", pool: "practice", difficulty: 1,
        stem: "A form reads 'OS −2.00 DS'. A student adds 'axis 090' to the left eye. What is the problem?",
        options: ["None; every lens needs an axis", "With zero cylinder the axis is undefined and should not be recorded", "DS means the lens is for distance only, so axis 180 is required", "OS should be the right eye"],
        answerIndex: 1,
        explanation: "DS denotes a spherical lens with equal power in all meridians. No meridian is special, so an axis has no meaning.",
        distractorRationale: ["Only lenses with cylinder have an axis.", "", "DS means dioptre sphere, not distance only.", "OS is the left eye; OD is the right."],
        misconceptionIds: ["M-ZERO-CYL-AXIS"], sources: ["O1"], reviewStatus: "draft"
      },
      {
        id: "Q-L05-05", version: 1, objectiveIds: ["L05-O5"], familyId: "F-L05-two-sample-trap", pool: "exam", difficulty: 3,
        stem: "Two lenses both measure −2.00 D at 0° and −2.00 D at 90°. Which conclusion is valid?",
        options: ["They must be identical spheres of −2.00 DS", "They may differ; for example plano −4.00 × 045 and plano −4.00 × 135 both give these readings", "They must both be plano −4.00 × 045", "Their spherical equivalent proves they are equivalent"],
        answerIndex: 1,
        explanation: "Two samples at 0° and 90° cannot determine an oblique lens. plano −4.00 × 045 has 0.00 D at 45°, whereas plano −4.00 × 135 has −4.00 D at 45°.",
        distractorRationale: ["A −2.00 DS lens is one possibility, but oblique cylinders give the same two readings.", "", "Several different lenses fit these two samples.", "Equal SE does not establish equal power in every meridian."],
        misconceptionIds: ["M-TWO-SAMPLES-FULL-RX", "M-SE-AS-EQUIVALENT"], sources: ["O1", "O2"], reviewStatus: "draft"
      },
      {
        id: "Q-L05-06", version: 1, objectiveIds: ["L05-O2"], familyId: "F-L05-powercross-to-rx", pool: "exam", difficulty: 3,
        stem: "A power cross shows −0.50 D at 20° and −2.50 D at 110°. Which minus-cylinder prescription matches?",
        options: ["−0.50 −2.50 × 020", "−0.50 −2.00 × 020", "−2.50 −2.00 × 110", "−0.50 −2.00 × 110"],
        answerIndex: 1,
        explanation: "In minus-cylinder form the sphere is the less-minus principal power (−0.50 D) at its meridian (020). The cylinder is the difference: −2.50 − (−0.50) = −2.00.",
        distractorRationale: ["The principal power −2.50 was copied as the cylinder.", "", "Using −2.50 as sphere needs a plus cylinder (−2.50 +2.00 × 110).", "The axis must be the meridian of the sphere power (020), not the perpendicular one."],
        misconceptionIds: ["M-PRINCIPAL-AS-CYL", "M-AXIS-VS-MERIDIAN"], sources: ["O1"], reviewStatus: "draft"
      }
    ],
    sources: ["O1", "O2", "C1"],
    reviewStatus: "draft"
  },
  {
    id: "L06",
    title: "Refraction methods",
    group: "Optics & refraction",
    emphasis: "Retinoscopy, working distance, subjective refinement, Jackson cross-cylinder, duochrome and cycloplegia principles",
    signature: "Guided refraction with explicit instrument conventions",
    prerequisites: ["L04", "L05"],
    studios: ["LAB02", "LAB03"],
    activities: ["T011", "T012", "T013", "T014", "T015", "T016", "T017", "T018", "T019", "T082"],
    estMinutes: 60,
    objectives: [
      { id: "L06-O1", text: "Convert a gross retinoscopy result to a net result by removing the working-distance power (1/w) once, from the sphere." },
      { id: "L06-O2", text: "State which meridian is measured by a given streak orientation and sweep direction." },
      { id: "L06-O3", text: "Interpret with and against motion in a declared plane-mirror retinoscopy model and choose the direction of lens change." },
      { id: "L06-O4", text: "Describe the principal powers of a Jackson cross-cylinder and the purpose of fogging, duochrome and binocular balance as refinements." },
      { id: "L06-O5", text: "Explain when cycloplegic refraction is useful and why objective, subjective and autorefractor results may differ." }
    ],
    bridge: "L05 taught you to move between prescriptions and power crosses, and L04 why accommodation matters. Refraction is the process of measuring the correcting lens — first objectively (retinoscopy, autorefraction), then subjectively with the patient's responses. Keep the instrument convention explicit at every step.",
    essentials: [
      "Retinoscopy observes the reflex from the patient's pupil while sweeping a streak of light. Trial lenses are changed until the reflex is neutral. The lens power that neutralises a meridian at the examiner's working distance is the gross result.",
      "Neutralising at a working distance w adds +1/w to what the eye needs. Net = gross − 1/w. At 0.50 m the working-distance power is 2.00 D: gross +2.00 −4.00 × 180 becomes net plano −4.00 × 180. At 0.67 m the exact value is about 1.49 D; 1.50 D is a rounded convention.",
      "If a working-distance lens is already in the trial frame, do not subtract the working distance again.",
      "A vertical streak swept horizontally measures the horizontal meridian. Streak orientation and measured meridian are perpendicular and must be labelled separately.",
      "In a plane-mirror model with accommodation relaxed, with motion means more plus is needed and against motion means more minus is needed.",
      "Subjective refinement uses the patient's comparisons: fogging with plus to relax accommodation, sphere refinement, Jackson cross-cylinder (JCC) for cylinder axis and power, duochrome as a sphere check and binocular balance where appropriate.",
      "Cycloplegia relaxes accommodation and can reveal latent hyperopia, which is why it is often used in children. Dilation and cycloplegia are not the same concept."
    ],
    full: [
      "Retinoscopy mechanism: the retinoscope illuminates the fundus and the examiner views the light returning through the patient's pupil. If the patient's far point (with trial lens) is behind the examiner, the reflex moves with the sweep; if it lies between patient and examiner, it moves against; at neutrality the far point coincides with the examiner's pupil and the pupil fills or empties with light all at once. Mathematically, the gross neutralising power G(θ) equals the net correction R(θ) plus 1/w.",
      "Measuring meridians: the streak is a line of light; sweeping it across the pupil perpendicular to its length tests the meridian parallel to the sweep. A vertical streak swept horizontally tests the horizontal (180°) meridian; rotating the streak to find the brightest, thinnest reflex orientation identifies the principal meridians. Neutralise each principal meridian, record the gross power cross, then remove the working distance from both principal powers (equivalently, from the sphere).",
      "Worked conversion: at 0.50 m, horizontal neutralises with +2.00 D and vertical with −2.00 D. Gross power cross: +2.00 at 180°, −2.00 at 90°, i.e. +2.00 −4.00 × 180. Subtract +2.00 from the sphere: net plano −4.00 × 180, which in a full-correction context is simple myopic astigmatism.",
      "Common errors are subtracting the working distance from only one meridian, subtracting it twice when a working-distance lens was already in place, and recording the streak orientation instead of the meridian measured. Small pupils, media opacities, poor fixation and changing accommodation make the reflex harder to interpret; an irregular or scissoring reflex suggests irregular optics but is not by itself a diagnosis.",
      "Subjective refinement: start from the objective result, fog with plus so accommodation relaxes, then reduce plus until the best acuity is reached without unnecessary minus. Over-minus correction stimulates accommodation and is not rewarded. The duochrome uses chromatic aberration: if letters on red are clearer, the focus is in front of the retina and more minus may be needed; if green is clearer, more plus may be needed. It is a cross-check, not a sufficient endpoint.",
      "The Jackson cross-cylinder is a lens with equal and opposite principal powers. A ±0.25 D JCC has +0.25 D in one principal meridian and −0.25 D in the other, a spherical equivalent of zero and a 0.50 D difference between its principal powers. It is flipped in front of the trial correction so the patient compares two images — first to refine axis (handle aligned with the cylinder axis), then power (principal meridians aligned with the axis). The direction of change depends on whether a plus- or minus-cylinder workflow is used, so the convention must be stated.",
      "Cycloplegic refraction blocks accommodation pharmacologically, revealing the full hyperopia, and is standard in many paediatric assessments and in suspected accommodative problems. Autorefractors give a quick objective estimate, but their printout is not automatically the final prescription; laterality, notation, reliability and agreement with other findings must be checked.",
      "Documentation: record each eye's result, the method (retinoscopy gross/net, autorefraction, subjective), whether cycloplegia was used, the working distance, and the best corrected acuity achieved with the final lens."
    ],
    deeper: [
      "Binocular balance techniques aim to equalise accommodative state between the eyes after monocular refraction; the appropriate method depends on acuity and binocular status, and it is not applied identically in every patient.",
      "A near addition is assessed with the distance correction in place, using the patient's working distance and accommodation measurements. Age-based tables are rough guides, not prescriptions.",
      "Retinoscopy instruments differ (plane-mirror versus concave-mirror effect and sleeve settings); the direction rules above apply to the declared plane-mirror mode only."
    ],
    misconceptions: [
      "Mistake: the streak orientation is the meridian being measured. Correction: a vertical streak swept horizontally measures the horizontal meridian.",
      "Mistake: gross equals net. Correction: subtract the working-distance power (1/w) from the sphere once; at 0.50 m that is 2.00 D.",
      "Mistake: subtracting working distance again after a working-distance lens was already in the frame. Correction: if the lens compensating 1/w is in place, the neutralising lenses already represent the net result.",
      "Mistake: a ±0.25 D JCC is a 0.25 D cylinder. Correction: its principal powers are +0.25 and −0.25 D, a 0.50 D difference with zero spherical equivalent."
    ],
    entryChallenge: {
      prompt: "At a working distance of 0.50 m, a meridian neutralises with +3.00 D. What is the net power in that meridian?",
      answer: "+1.00 D, because net = gross − 1/w = +3.00 − 2.00."
    },
    contrast: {
      a: "Gross retinoscopy: lens powers that neutralise the reflex at the examiner's working distance.",
      b: "Net retinoscopy: the correction for distance after removing 1/w once.",
      discriminator: "Whether the working-distance power has been removed — and only once."
    },
    workedExample: {
      problem: "At 0.67 m, the horizontal meridian neutralises at +1.00 D and the vertical at +2.50 D (no working-distance lens in the frame). Find the net prescription in minus-cylinder form.",
      steps: [
        "Working-distance power = 1/0.67 ≈ 1.49 D; the familiar 1.50 D value is rounded. Use 1.50 D only if the protocol states the convention.",
        "Gross power cross: +1.00 D at 180°, +2.50 D at 90°.",
        "Net power cross (using 1.50 D): −0.50 D at 180°, +1.00 D at 90°.",
        "Minus-cylinder form: sphere is the more plus meridian, +1.00 at 090, cylinder −1.50: +1.00 −1.50 × 090.",
        "Check: at 180° the power is +1.00 − 1.50 = −0.50 D. Principal powers of opposite sign indicate mixed astigmatism in a full-correction context; the result still needs subjective refinement."
      ]
    },
    transfer: {
      prompt: "A table of observations reads: 'streak vertical, sweep horizontal: with motion with +1.00, neutral with +3.00; streak horizontal, sweep vertical: neutral with +1.00. Working distance 0.50 m, no working-distance lens.' Write the net prescription and say which meridian each observation measured.",
      modelAnswer: "The vertical streak swept horizontally measured the horizontal (180°) meridian: gross +3.00 D. The horizontal streak swept vertically measured the vertical (90°) meridian: gross +1.00 D. Net (subtract 2.00 D): +1.00 D at 180°, −1.00 D at 90°. Minus-cylinder form: +1.00 −2.00 × 180 — mixed astigmatism despite a spherical equivalent of zero."
    },
    items: [
      {
        id: "Q-L06-01", version: 1, objectiveIds: ["L06-O1"], familyId: "F-L06-gross-net", pool: "practice", difficulty: 2,
        stem: "Retinoscopy at 0.50 m, without a working-distance lens, gives a gross result of +2.00 −4.00 × 180. What is the net result?",
        options: ["+2.00 −4.00 × 180", "plano −4.00 × 180", "plano −2.00 × 180", "+4.00 −4.00 × 180"],
        answerIndex: 1,
        explanation: "The working-distance power is 1/0.50 = 2.00 D. Removing it from the sphere (equivalently from both principal powers) gives plano −4.00 × 180; the cylinder is unchanged.",
        distractorRationale: ["This is the gross result without the working-distance correction.", "", "The working distance was wrongly removed from the cylinder as well.", "The working distance was added instead of subtracted."],
        misconceptionIds: ["M-GROSS-VS-NET"], sources: ["O3"], reviewStatus: "draft"
      },
      {
        id: "Q-L06-02", version: 1, objectiveIds: ["L06-O2"], familyId: "F-L06-streak-meridian", pool: "practice", difficulty: 2,
        stem: "The retinoscope streak is vertical and is swept from side to side. Which meridian is being measured?",
        options: ["The vertical (90°) meridian", "The horizontal (180°) meridian", "The 45° meridian", "Both principal meridians at once"],
        answerIndex: 1,
        explanation: "The meridian measured is parallel to the sweep and perpendicular to the streak. A vertical streak swept horizontally measures the horizontal meridian.",
        distractorRationale: ["This records the streak orientation rather than the meridian measured.", "", "Nothing in this setup tests an oblique meridian.", "Each streak orientation tests one meridian at a time."],
        misconceptionIds: ["M-STREAK-VS-MERIDIAN"], sources: ["O3"], reviewStatus: "draft"
      },
      {
        id: "Q-L06-03", version: 1, objectiveIds: ["L06-O1"], familyId: "F-L06-wd-reciprocal", pool: "practice", difficulty: 2,
        stem: "A protocol enters the working distance as exactly 0.67 m. What working-distance power should be removed?",
        options: ["Exactly 1.50 D", "About 1.49 D (1/0.67); 1.50 D is the rounded convention", "0.67 D", "2.00 D"],
        answerIndex: 1,
        explanation: "The working-distance power is the reciprocal of the distance in metres: 1/0.67 ≈ 1.4925 D. The familiar 1.50 D corresponds exactly to 2/3 m.",
        distractorRationale: ["1.50 D is exact only for 2/3 m; for 0.67 m it is a rounding.", "", "The distance itself is not the power; take the reciprocal.", "2.00 D corresponds to 0.50 m."],
        misconceptionIds: ["M-GROSS-VS-NET"], sources: ["O3"], reviewStatus: "draft"
      },
      {
        id: "Q-L06-04", version: 1, objectiveIds: ["L06-O4"], familyId: "F-L06-jcc-powers", pool: "practice", difficulty: 2,
        stem: "What are the properties of a ±0.25 D Jackson cross-cylinder?",
        options: ["A 0.25 D cylinder with plano sphere", "Principal powers +0.25 and −0.25 D, spherical equivalent zero, 0.50 D difference between principal powers", "Principal powers +0.25 and +0.50 D", "Sphere −0.25 D with no cylinder"],
        answerIndex: 1,
        explanation: "A JCC combines equal and opposite principal powers. For ±0.25 D, the principal powers are +0.25 and −0.25 D, so the average is zero and the cylinder (difference) is 0.50 D.",
        distractorRationale: ["The label refers to each principal power, not the cylinder magnitude.", "", "Both principal powers would then be plus, changing the spherical equivalent.", "A JCC has cylinder by definition."],
        misconceptionIds: ["M-JCC-CONVENTION"], sources: ["O4"], reviewStatus: "draft"
      },
      {
        id: "Q-L06-05", version: 1, objectiveIds: ["L06-O1"], familyId: "F-L06-double-wd", pool: "exam", difficulty: 3,
        stem: "At 0.50 m, an examiner places a +2.00 D working-distance lens in the frame, then neutralises all meridians with an additional −1.00 DS. What is the net distance correction?",
        options: ["−1.00 DS", "−3.00 DS", "+1.00 DS", "+3.00 DS"],
        answerIndex: 0,
        explanation: "The working-distance lens already compensates the 1/w term, so the additional lenses represent the net correction: −1.00 DS. Subtracting 2.00 D again would double-count it.",
        distractorRationale: ["", "This subtracts the working distance a second time.", "This combines the working-distance lens with the neutralising lens and treats the total as net.", "This adds instead of removing a working-distance correction that was already accounted for."],
        misconceptionIds: ["M-DOUBLE-WD", "M-GROSS-VS-NET"], sources: ["O3"], reviewStatus: "draft"
      },
      {
        id: "Q-L06-06", version: 1, objectiveIds: ["L06-O5"], familyId: "F-L06-cycloplegic-difference", pool: "exam", difficulty: 2,
        stem: "A 6-year-old has a non-cycloplegic refraction of +0.50 DS in each eye and a cycloplegic refraction of +3.00 DS in each eye. What best explains the difference?",
        options: ["The autorefractor malfunctioned", "Active accommodation masked part of the hyperopia until it was relaxed pharmacologically", "Cycloplegia artificially creates hyperopia", "Dilation alone increased the refractive error"],
        answerIndex: 1,
        explanation: "Children have large accommodation, which can hide hyperopia (latent hyperopia). Cycloplegia relaxes accommodation and reveals the fuller error. How much to prescribe is a separate clinical decision.",
        distractorRationale: ["A consistent bilateral difference of this kind is the expected effect of accommodation, not evidence of malfunction.", "", "Cycloplegia reveals rather than creates hyperopia.", "Pupil dilation is not the mechanism; relaxation of the ciliary muscle is."],
        misconceptionIds: ["M-RX-VS-DIAGNOSIS"], sources: ["O3", "O4"], reviewStatus: "draft"
      }
    ],
    sources: ["O3", "O4", "K8", "C1"],
    reviewStatus: "draft"
  },
  {
    id: "L07",
    title: "Visual acuity and clinical notation",
    group: "Examination",
    emphasis: "Distance/near acuity, pinhole, corrected/uncorrected acuity, Snellen/decimal/logMAR concepts and documentation",
    signature: "Examine a virtual patient and record findings",
    prerequisites: ["L01"],
    studios: ["LAB04"],
    activities: ["T001", "T002", "T003", "T004", "T005", "T006", "T007", "T008", "T010"],
    estMinutes: 45,
    objectives: [
      { id: "L07-O1", text: "Record visual acuity with eye, test distance, correction status (unaided, habitual, pinhole, best corrected) and chart notation." },
      { id: "L07-O2", text: "Convert between Snellen fraction, decimal acuity and logMAR using decimal = numerator/denominator and logMAR = −log10(decimal)." },
      { id: "L07-O3", text: "Document very low vision (counting fingers, hand movements, light perception, no light perception) with the relevant distance and without inventing a universal logMAR value." },
      { id: "L07-O4", text: "State what colour-vision plates, contrast charts and the Amsler grid can and cannot show." }
    ],
    bridge: "L01 located the fovea, which supports the finest detail. Acuity measures the smallest detail an eye can resolve under a stated protocol. It is usually the first measurement in any eye examination because it is the baseline against which every later change is judged.",
    essentials: [
      "Acuity is tested one eye at a time, with the other covered. Record which eye, the test distance, and whether the patient was unaided, wearing their own correction, looking through a pinhole or wearing a best correction.",
      "A Snellen fraction is test distance over the distance at which a standard eye would read the same line. 6/6 (20/20 in feet) is the reference standard; 6/12 means the patient read at 6 m what a standard eye reads at 12 m.",
      "Decimal acuity = numerator ÷ denominator, so 6/12 = 0.5. logMAR = −log10(decimal), so 6/6 is 0.0, 6/12 is about 0.3 and 6/60 is 1.0. Higher logMAR means worse acuity.",
      "When the top line cannot be read, the sequence is counting fingers (record the distance), hand movements, light perception and no light perception. These categories do not have one universal logMAR value.",
      "Near acuity is recorded with its working distance and chart notation, and with or without near correction.",
      "Colour plates, contrast charts and the Amsler grid each test a different function. A normal result on one test does not exclude disease detectable by another."
    ],
    full: [
      "Mechanism: acuity reflects optical image quality (refraction, media clarity, pupil size) and neural resolution (macula, optic nerve, pathway). Because both contribute, reduced acuity is a finding, not a diagnosis. Pinhole testing partly separates them: improvement suggests an optical cause, persistent reduction suggests that something beyond simple refractive blur is present.",
      "Chart design matters. Snellen-type charts have unequal numbers of letters per line and irregular size steps. LogMAR (ETDRS-style) charts use equal numbers of letters per line and equal logarithmic size steps, allowing letter-by-letter scoring under a defined protocol. An arbitrary font on a screen is not a standardised chart.",
      "Adjusting for distance: if a patient is tested at 3 m, the numerator is 3. Reading the line labelled for 18 m at 3 m gives 3/18, which has the same decimal value (about 0.17) as 6/36. Record what was actually done rather than silently converting.",
      "Very low acuity is documented descriptively. For counting fingers, record the distance (for example 'CF at 1 m'). Hand movements and light perception are tested with appropriate illumination; for light perception it can be useful to test projection (which direction the light comes from). Do not convert these categories to a single numeric logMAR in notes unless a specific validated protocol is being used.",
      "Colour vision: pseudoisochromatic plates are mainly used to screen for congenital red–green deficiency; arrangement tests describe the type and severity of a deficiency. Acquired colour loss, as in optic neuropathy, is often asymmetric and can be compared between the eyes. A screen image is an illustration, not a calibrated personal test.",
      "Amsler grid: a central grid viewed at near with one eye covered maps distortion (metamorphopsia) or missing areas near fixation, which can indicate macular disease. Patients may not notice small defects, so a normal grid does not exclude macular disease.",
      "Documentation example: 'RE: 6/12 unaided, 6/6 with pinhole; LE: 6/9 unaided, 6/9 with pinhole; distance 6 m, Snellen chart.' Each element allows another clinician to repeat and compare the measurement."
    ],
    deeper: [
      "Acuity in percentage terms is not a measure of 'how much vision' a person has. Visual function also includes fields, contrast, colour, binocularity and adaptation.",
      "Crowding — the reduced recognition of letters surrounded by other letters — is one reason single-optotype acuity can overestimate line acuity, particularly in amblyopia.",
      "Near acuity notations (N-point, Jaeger, M-units, reduced Snellen) are not freely interchangeable without a defined conversion and distance."
    ],
    misconceptions: [
      "Mistake: 6/12 means half of normal vision. Correction: it describes resolution at one distance; it is not a percentage of total visual function.",
      "Mistake: hand movements is equal to a fixed logMAR value. Correction: very low acuity categories are descriptive; record the category and distance.",
      "Mistake: a normal Amsler grid rules out macular disease. Correction: small or slowly developing defects may be missed; it is a screening aid."
    ],
    entryChallenge: {
      prompt: "Convert 6/60 to decimal acuity and logMAR.",
      answer: "Decimal 0.1; logMAR = −log10(0.1) = 1.0."
    },
    contrast: {
      a: "Reduced acuity that improves with pinhole: suggests an optical (often refractive) contribution.",
      b: "Reduced acuity that does not improve with pinhole: suggests something beyond simple refractive blur, such as macular, optic nerve or dense media disease.",
      discriminator: "Change with pinhole — but neither result is a diagnosis on its own."
    },
    workedExample: {
      problem: "A patient reads the 6/9 line with the right eye but misses two letters on it; the left eye reads 6/6. Record the result.",
      steps: [
        "Record each eye separately: RE and LE.",
        "Record the test distance (6 m) and the chart type (Snellen).",
        "State correction: here with habitual spectacles.",
        "Record partial lines in the convention used locally, e.g. 'RE 6/9 −2 (habitual), LE 6/6 (habitual)'.",
        "If acuity is reduced, add the pinhole result for the affected eye."
      ]
    },
    transfer: {
      prompt: "A referral letter states only 'vision 0.3 logMAR'. List what information is missing and convert the value to an approximate Snellen equivalent at 6 m.",
      modelAnswer: "Missing: which eye, test distance, chart type, correction status (unaided, habitual, pinhole, best corrected) and near or distance. 0.3 logMAR corresponds to a decimal acuity of about 0.5, i.e. about 6/12."
    },
    items: [
      {
        id: "Q-L07-01", version: 1, objectiveIds: ["L07-O2"], familyId: "F-L07-snellen-to-logmar", pool: "practice", difficulty: 1,
        stem: "A patient reads 6/12. What are the decimal acuity and logMAR?",
        options: ["Decimal 2.0; logMAR −0.3", "Decimal 0.5; logMAR about 0.3", "Decimal 0.5; logMAR 0.5", "Decimal 0.12; logMAR 1.2"],
        answerIndex: 1,
        explanation: "Decimal = 6/12 = 0.5; logMAR = −log10(0.5) ≈ 0.30.",
        distractorRationale: ["The fraction was inverted.", "", "logMAR is not equal to the decimal value; it is the negative logarithm.", "The fraction was read as a decimal number rather than divided."],
        misconceptionIds: [], sources: ["C1"], reviewStatus: "draft"
      },
      {
        id: "Q-L07-02", version: 1, objectiveIds: ["L07-O3"], familyId: "F-L07-low-vision-doc", pool: "practice", difficulty: 1,
        stem: "A patient cannot read the top line at 6 m but counts fingers at 1 m. What is the best documentation?",
        options: ["logMAR 2.0", "CF at 1 m, with the eye and correction status stated", "Blind", "6/60"],
        answerIndex: 1,
        explanation: "Very low acuity is recorded descriptively with the relevant distance. Eye and correction status are still required.",
        distractorRationale: ["There is no universal logMAR value for counting fingers.", "", "'Blind' is not a measurement and is inaccurate when fingers can be counted.", "6/60 means the top line was read at 6 m, which it was not."],
        misconceptionIds: [], sources: ["C1"], reviewStatus: "draft"
      },
      {
        id: "Q-L07-03", version: 1, objectiveIds: ["L07-O1"], familyId: "F-L07-correction-status", pool: "practice", difficulty: 2,
        stem: "Which acuity record allows another clinician to repeat the measurement most reliably?",
        options: ["'Vision OK'", "'6/9'", "'LE 6/9 at 6 m, habitual spectacles, Snellen; 6/6 with pinhole'", "'Vision 70%'"],
        answerIndex: 2,
        explanation: "A reproducible record includes eye, distance, correction status, chart and pinhole result where relevant.",
        distractorRationale: ["This is not a measurement.", "Missing eye, correction status and distance.", "", "Percentage descriptions are not acuity measurements."],
        misconceptionIds: [], sources: ["C1"], reviewStatus: "draft"
      },
      {
        id: "Q-L07-04", version: 1, objectiveIds: ["L07-O4"], familyId: "F-L07-colour-tests", pool: "practice", difficulty: 2,
        stem: "What are pseudoisochromatic colour plates mainly designed to do?",
        options: ["Measure visual acuity", "Screen for congenital red–green colour deficiency", "Grade the severity of every acquired colour defect precisely", "Diagnose optic neuritis"],
        answerIndex: 1,
        explanation: "Plate tests are primarily screening tools for congenital red–green deficiency. Arrangement tests and clinical context help characterise type and severity, and acquired loss needs interpretation with other findings.",
        distractorRationale: ["Plates test colour discrimination, not resolution.", "", "Plates are screening tools; they do not precisely grade all acquired defects.", "Reduced colour vision can occur in optic neuritis, but plates alone do not diagnose it."],
        misconceptionIds: ["M-FINDING-AS-CERTAINTY"], sources: ["K7"], reviewStatus: "draft"
      },
      {
        id: "Q-L07-05", version: 1, objectiveIds: ["L07-O2", "L07-O1"], familyId: "F-L07-test-distance", pool: "exam", difficulty: 3,
        stem: "Tested at 3 m because of room size, a patient reads the line labelled for 18 m. Which statement is correct?",
        options: ["Record 6/18 because charts are always 6 m", "Record 3/18, which has the same decimal acuity (about 0.17) as 6/36", "Record 3/18, equivalent to 6/9", "Record 18/3"],
        answerIndex: 1,
        explanation: "The numerator is the actual test distance. 3/18 ≈ 0.17, the same decimal value as 6/36. Record what was done.",
        distractorRationale: ["The test distance was 3 m, so 6/18 overstates acuity.", "", "Halving the distance halves the equivalent acuity; 6/9 overstates it.", "The fraction is inverted."],
        misconceptionIds: [], sources: ["C1"], reviewStatus: "draft"
      },
      {
        id: "Q-L07-06", version: 1, objectiveIds: ["L07-O4"], familyId: "F-L07-amsler-limits", pool: "exam", difficulty: 2,
        stem: "An older patient with drusen reports a normal Amsler grid in each eye. What is the most appropriate interpretation?",
        options: ["Macular disease is excluded", "No distortion was reported; this does not exclude macular disease, and other findings and new symptoms still matter", "The patient must have glaucoma instead", "Amsler testing is only for peripheral fields"],
        answerIndex: 1,
        explanation: "The Amsler grid detects some central distortion or missing areas but can miss small or gradual changes. It is a self-monitoring and screening aid, not an exclusion test.",
        distractorRationale: ["A normal grid does not exclude macular disease.", "", "A normal grid does not point to another disease.", "The grid tests the central field around fixation."],
        misconceptionIds: ["M-FINDING-AS-CERTAINTY"], sources: ["C1"], reviewStatus: "draft"
      }
    ],
    sources: ["C1", "C2", "K7"],
    reviewStatus: "draft"
  },
  {
    id: "L08",
    title: "Ophthalmic history and examination sequence",
    group: "Examination",
    emphasis: "Symptom characterization, relevant history, systematic examination and prioritization",
    signature: "Choose the next question or examination maneuver",
    prerequisites: ["L07"],
    studios: ["LAB18", "LAB04", "LAB08", "LAB16"],
    activities: ["T001", "T022", "T037", "T041"],
    estMinutes: 40,
    objectives: [
      { id: "L08-O1", text: "Characterise an eye symptom by onset, laterality, pain, redness, discharge, photophobia, visual change and associated features." },
      { id: "L08-O2", text: "Order a routine examination so that acuity and pupils are assessed before dilating drops and pressure is not measured when globe integrity is in doubt." },
      { id: "L08-O3", text: "Identify presentations where immediate action (for example irrigation after chemical exposure) takes priority over a full history." },
      { id: "L08-O4", text: "Distinguish monocular from binocular diplopia by the effect of covering one eye." }
    ],
    bridge: "L07 established acuity as the baseline measurement. This lecture places it in a systematic sequence: history that narrows the differential, then an examination ordered so that earlier steps do not spoil later ones. The sequence is a default; urgent situations reorder it.",
    essentials: [
      "Start by characterising the main symptom: which eye, when and how it started (sudden or gradual), whether it is painful, red, sticky or light-sensitive, and whether vision has changed.",
      "Ask about relevant background: previous eye disease or surgery, contact lens wear, trauma, diabetes, hypertension, autoimmune disease, medications, allergies, family history (for example glaucoma) and occupation or driving needs.",
      "A default examination order is: acuity, pupils, visual fields and eye movements, external examination, slit lamp, pressure, then dilated fundus examination. Pupils are checked before dilating drops are given.",
      "Some presentations change the order. After a chemical splash, irrigate first and take a fuller history afterwards. If an open globe is suspected, avoid pressure on the eye and do not measure intraocular pressure.",
      "Double vision that disappears when either eye is covered is binocular (misalignment). Double vision that persists in one eye with the other covered is monocular (usually optical, such as cataract or corneal irregularity).",
      "Document what you actually examined and found. Do not record normal findings for tests you did not perform."
    ],
    full: [
      "History is the first diagnostic test. The combination of features narrows possibilities quickly: painless gradual loss suggests cataract, refractive change or chronic retinal disease; sudden painless loss suggests vascular occlusion, retinal detachment, vitreous haemorrhage or ischaemic optic neuropathy; a painful red eye with reduced vision suggests keratitis, uveitis, acute angle closure or scleritis. Each pattern is a hypothesis to test, not a conclusion.",
      "Red-flag features raise urgency: reduced vision, significant pain, photophobia, a contact-lens wearer with a painful red eye, recent eye surgery, trauma (especially high-velocity or chemical), new neurological symptoms, an abnormal pupil, and in older adults new headache with jaw claudication or scalp tenderness (giant cell arteritis concern).",
      "The sequence protects information. Acuity comes first because it is the baseline and is affected by later tests (bright lights, drops, contact procedures). Pupils must be assessed before dilation, which abolishes the light reflex. Fields and motility are tested with the patient undilated and comfortable. Contact tonometry and gonioscopy follow the slit-lamp examination of the cornea, because fluorescein, anaesthetic and contact can alter the surface.",
      "Exceptions are principles, not shortcuts. With a chemical injury, time spent on history delays irrigation, so irrigation starts immediately and the history continues alongside or afterwards. With a suspected open globe, pressure on the eye risks expelling intraocular contents, so tonometry, lid eversion and squeezing are avoided and a protective shield is used while urgent ophthalmic review is arranged.",
      "The cover test distinguishes monocular from binocular diplopia at the bedside. Binocular diplopia is caused by misalignment, which may be neurological, muscular or orbital; monocular diplopia is usually caused by an optical problem in that eye. This single manoeuvre redirects the whole assessment.",
      "Documentation uses structured headings: presenting complaint, history, findings by eye, assessment (working diagnosis and differential), urgency and plan. Unexamined structures are recorded as not examined, not as normal."
    ],
    deeper: [
      "Medication history matters in both directions: some systemic drugs have ocular toxicity (for example hydroxychloroquine, ethambutol, corticosteroids), and some eye drops have systemic effects (for example topical beta-blockers in asthma).",
      "In children, the history often comes from carers; ask about birth history, prematurity, family history of childhood eye disease, and what the carer has noticed (eye turn, white pupil, head posture)."
    ],
    misconceptions: [
      "Mistake: always complete a full history before any examination or treatment. Correction: chemical injury requires immediate irrigation; history follows.",
      "Mistake: dilate first to get a good view of the fundus. Correction: assess pupils (and record acuity) before dilating drops.",
      "Mistake: double vision always means a cranial nerve palsy. Correction: first check whether it is monocular or binocular by covering each eye."
    ],
    entryChallenge: {
      prompt: "Name two pieces of the examination that must be done before dilating drops are instilled, and why.",
      answer: "Visual acuity (baseline, affected by drops and glare) and pupil reactions (dilation abolishes the light reflex, so a relative afferent defect cannot be assessed)."
    },
    contrast: {
      a: "Monocular diplopia: persists in the affected eye when the other eye is covered; usually optical.",
      b: "Binocular diplopia: disappears when either eye is covered; caused by misalignment.",
      discriminator: "The effect of covering one eye."
    },
    workedExample: {
      problem: "A 30-year-old contact lens wearer presents with a painful red right eye and blurred vision since this morning. Plan the next steps.",
      steps: [
        "Characterise the symptom: onset, pain, photophobia, discharge, lens hygiene, overnight wear and water exposure.",
        "Record acuity in each eye first.",
        "Check pupils, then examine with fluorescein at the slit lamp for an epithelial defect or infiltrate.",
        "Recognise red flags: contact lens wear, pain and reduced vision raise concern for microbial keratitis.",
        "Arrange urgent same-day ophthalmic assessment per local protocol; document findings and what was not examined."
      ]
    },
    transfer: {
      prompt: "You are given four steps out of order: (a) dilated fundus examination, (b) pupil examination, (c) visual acuity, (d) slit-lamp examination of the cornea. Put them in a routine order and state one situation that would change the order or remove a step.",
      modelAnswer: "Routine order: (c) acuity, (b) pupils, (d) slit lamp, (a) dilated fundus. A chemical injury puts irrigation before everything; a suspected open globe removes pressure-related steps such as tonometry and lid eversion and calls for a protective shield and urgent referral."
    },
    items: [
      {
        id: "Q-L08-01", version: 1, objectiveIds: ["L08-O2"], familyId: "F-L08-pupils-before-dilation", pool: "practice", difficulty: 1,
        stem: "Why should pupil reactions be examined before instilling dilating drops?",
        options: ["Drops make the eye red", "Dilation abolishes the light reflex, so afferent defects cannot then be assessed", "Pupils are only examined in children", "Dilated pupils look identical to a relative afferent defect"],
        answerIndex: 1,
        explanation: "Pharmacological dilation removes the ability to assess direct and consensual responses, including the swinging-flashlight test.",
        distractorRationale: ["Redness is not the reason for the sequence.", "", "Pupil examination is routine at all ages.", "A relative afferent defect is not a dilated pupil; the problem is that the reflex can no longer be tested."],
        misconceptionIds: ["M-AFFERENT-VS-EFFERENT"], sources: ["C1"], reviewStatus: "draft"
      },
      {
        id: "Q-L08-02", version: 1, objectiveIds: ["L08-O3"], familyId: "F-L08-chemical-priority", pool: "practice", difficulty: 1,
        stem: "A worker arrives saying a cleaning chemical has just splashed into one eye. What is the first priority?",
        options: ["Take a full history of the chemical and past ocular history", "Measure intraocular pressure", "Begin copious irrigation, then continue assessment", "Arrange imaging"],
        answerIndex: 2,
        explanation: "In an ordinary isolated chemical exposure, irrigation should not wait for a long history. History and examination continue once irrigation has begun, following local protocol.",
        distractorRationale: ["A long history delays the most important intervention.", "Pressure measurement is not a first step.", "", "Imaging is not the initial priority in an isolated chemical splash."],
        misconceptionIds: [], sources: ["K6"], reviewStatus: "draft"
      },
      {
        id: "Q-L08-03", version: 1, objectiveIds: ["L08-O4"], familyId: "F-L08-diplopia-type", pool: "practice", difficulty: 2,
        stem: "A patient has double vision that persists when the left eye is covered and disappears when the right eye is covered. What does this indicate?",
        options: ["Binocular diplopia from misalignment", "Monocular diplopia arising in the right eye", "Monocular diplopia arising in the left eye", "A left sixth nerve palsy"],
        answerIndex: 1,
        explanation: "With the left eye covered only the right eye sees, and diplopia persists, so it arises within the right eye — monocular diplopia, usually optical.",
        distractorRationale: ["Binocular diplopia disappears when either eye is covered.", "", "Diplopia vanishes when the right eye is covered, so the left eye alone does not produce it.", "A nerve palsy causes binocular diplopia."],
        misconceptionIds: [], sources: ["C1"], reviewStatus: "draft"
      },
      {
        id: "Q-L08-04", version: 1, objectiveIds: ["L08-O1"], familyId: "F-L08-red-flags", pool: "practice", difficulty: 2,
        stem: "Which history feature most increases urgency in a patient with a red eye?",
        options: ["Itching in both eyes during spring", "Contact lens wear with pain and reduced vision", "Mild watery discharge with normal vision", "A painless, sharply demarcated red patch with normal vision"],
        answerIndex: 1,
        explanation: "Pain and reduced vision in a contact lens wearer raise concern for microbial keratitis, which needs urgent same-day assessment.",
        distractorRationale: ["Seasonal bilateral itch suggests allergic conjunctivitis.", "", "Watery discharge with normal vision is less concerning.", "This pattern fits subconjunctival haemorrhage, usually benign."],
        misconceptionIds: [], sources: ["C1", "C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L08-05", version: 1, objectiveIds: ["L08-O2", "L08-O3"], familyId: "F-L08-open-globe-sequence", pool: "exam", difficulty: 2,
        stem: "After a hammering injury, a patient has an irregular pupil and a possible full-thickness corneal wound. Which step should be omitted?",
        options: ["Recording visual acuity", "Placing a rigid protective shield", "Applanation tonometry", "Arranging urgent ophthalmic review"],
        answerIndex: 2,
        explanation: "When an open globe is suspected, pressure on the eye must be avoided; tonometry is omitted. Acuity can be recorded gently, the eye is shielded and urgent review arranged.",
        distractorRationale: ["Acuity can usually be recorded without pressure and is important baseline information.", "A rigid shield protects the eye without pressing on it.", "", "Urgent review is required."],
        misconceptionIds: [], sources: ["K5"], reviewStatus: "draft"
      },
      {
        id: "Q-L08-06", version: 1, objectiveIds: ["L08-O1"], familyId: "F-L08-gca-history", pool: "exam", difficulty: 3,
        stem: "A 76-year-old reports sudden painless loss of vision in one eye. Which additional history question is most important to ask early?",
        options: ["Whether they have recently changed spectacles", "Whether they have jaw pain on chewing, scalp tenderness or new headache", "Whether they have hay fever", "Whether they use eye make-up"],
        answerIndex: 1,
        explanation: "In older adults, sudden visual loss with jaw claudication, scalp tenderness or headache raises concern for giant cell arteritis, which needs urgent same-day systemic assessment per local protocol to protect both eyes.",
        distractorRationale: ["A spectacle change does not explain sudden monocular loss.", "", "Hay fever does not fit sudden painless monocular loss.", "Cosmetics are not relevant to this presentation."],
        misconceptionIds: [], sources: ["C1", "C2"], reviewStatus: "draft"
      }
    ],
    sources: ["C1", "C2", "K5", "K6"],
    reviewStatus: "draft"
  },
  {
    id: "L09",
    title: "Pupils and light pathways",
    group: "Examination",
    emphasis: "Direct/consensual response, afferent/efferent defects, RAPD and anisocoria",
    signature: "Swing a virtual light and localize the defect",
    prerequisites: ["L01", "L02"],
    studios: ["LAB05"],
    activities: ["T009", "T021", "T022", "T023", "T024", "T088"],
    estMinutes: 50,
    objectives: [
      { id: "L09-O1", text: "Explain why light shone into one eye normally constricts both pupils, using separate afferent and efferent pathways." },
      { id: "L09-O2", text: "Predict the swinging-flashlight observations for a unilateral afferent defect and explain why the pupils are equal in size at rest." },
      { id: "L09-O3", text: "Given anisocoria greater in light or greater in dark, identify which pupil is likely abnormal and the type of pathway involved." },
      { id: "L09-O4", text: "Describe how to assess for an afferent defect when one pupil cannot react." }
    ],
    bridge: "From L01 and L02: the iris sphincter (parasympathetic, via the oculomotor nerve) constricts the pupil and the dilator (sympathetic) widens it. The pupil light reflex starts with light detected by the retina and optic nerve (afferent) and ends with the sphincter (efferent). Keeping these two halves separate is the whole lecture.",
    essentials: [
      "Light entering one eye travels along that optic nerve and is distributed to both sides of the midbrain, so both pupils constrict equally: the direct response (stimulated eye) and the consensual response (other eye).",
      "An afferent defect (optic nerve or extensive retinal disease) reduces the signal from that eye, but both pupils still share the input from the other eye. At rest the pupils are equal in size.",
      "In the swinging-flashlight test, moving the light from the healthy eye to the affected eye makes both pupils dilate (less constriction). This is a relative afferent pupillary defect (RAPD). It is not a permanently dilated pupil.",
      "An efferent defect affects the output to one iris. The affected pupil is larger and reacts poorly to both direct and consensual light, while the afferent pathways can be normal.",
      "Anisocoria greater in bright light suggests the larger pupil fails to constrict (parasympathetic problem). Anisocoria greater in the dark suggests the smaller pupil fails to dilate (sympathetic problem, as in Horner syndrome).",
      "Pupil assessment is done before dilating drops."
    ],
    full: [
      "Pathway: retinal ganglion cells send pupil signals along the optic nerve; at the chiasm, nasal fibres cross; the signal reaches the pretectal nuclei and is distributed to both Edinger–Westphal nuclei. Parasympathetic fibres then travel with the oculomotor nerve to the ciliary ganglion and the iris sphincter. Because of the bilateral distribution, an afferent problem in one eye does not make one pupil larger.",
      "Swinging-flashlight test: in dim background light with the patient fixing at a distance, the light is held on one eye for a few seconds, then swung briskly to the other. Normally both pupils stay constricted or constrict slightly. With a left RAPD, swinging from right to left makes both pupils dilate because the left eye supplies less drive. Grading conventions exist but must follow a stated protocol.",
      "Causes of RAPD include optic neuritis and other optic neuropathies, and extensive retinal disease (such as large retinal detachments or central retinal artery occlusion). Media opacities like cataract typically do not cause a marked RAPD, so a significant RAPD in an eye with cataract should prompt a search for retinal or optic nerve disease.",
      "Efferent problems: a third nerve palsy can give a large, poorly reactive pupil with ptosis and motility limitation; a pupil-involving third nerve palsy may be due to a compressive lesion such as an aneurysm and needs emergency assessment. A tonic pupil reacts poorly to light with a slow near response. Pharmacological dilation produces a large non-reactive pupil without other neurological signs.",
      "Horner syndrome: interruption of the sympathetic pathway gives a smaller pupil, mild ptosis and sometimes reduced sweating; the anisocoria is more obvious in dim light and the smaller pupil dilates slowly. An acute painful Horner syndrome can indicate carotid dissection and needs urgent assessment.",
      "Testing when one pupil cannot react: if one pupil is fixed (for example from drops or an efferent palsy), observe the reactive pupil throughout. Compare its constriction when light is in its own eye (direct) with when light is in the fixed-pupil eye (consensual). A weaker consensual response indicates an afferent defect in the eye with the fixed pupil.",
      "Documentation: record pupil sizes in light and dark if anisocoria is present, the direct and consensual responses for each eye, the swinging-flashlight result with laterality (for example 'left RAPD'), and the near response if tested."
    ],
    deeper: [
      "Light–near dissociation is when the near response is better than the light response. It occurs in several conditions, including dorsal midbrain lesions and tonic pupils, and requires its own interpretation rather than reuse of the light-reflex model.",
      "Pharmacological pupil tests can help localise Horner syndrome or confirm pharmacological mydriasis, but interpretation depends on a source-reviewed protocol; IRIS teaches the principle without doses or timing.",
      "Physiological anisocoria is common, usually small, and similar in light and dark, with normal reactions."
    ],
    misconceptions: [
      "Mistake: a RAPD means the affected pupil is dilated. Correction: in a pure afferent defect the pupils are equal at rest; the defect shows only as a relative response during the swinging test.",
      "Mistake: the eye with the poor direct response must have the abnormal iris. Correction: decide whether the problem is afferent (signal in) or efferent (signal out) by comparing direct and consensual responses.",
      "Mistake: a dense cataract explains a large RAPD. Correction: media opacities rarely cause a marked RAPD; look for retinal or optic nerve disease."
    ],
    entryChallenge: {
      prompt: "Light is shone into the right eye of a person with a severely damaged right optic nerve. What happens to each pupil?",
      answer: "Both pupils constrict weakly or not at all, because little signal enters through the right optic nerve. When light is in the left eye, both pupils constrict normally."
    },
    contrast: {
      a: "Left afferent defect: pupils equal at rest; both dilate when light swings to the left eye.",
      b: "Left efferent (parasympathetic) defect: left pupil larger, poor direct and consensual constriction; anisocoria greater in light.",
      discriminator: "Resting anisocoria and whether the left pupil constricts when light is in the right eye."
    },
    workedExample: {
      problem: "A 28-year-old has blurred vision and pain on eye movement in the left eye. Predict and interpret the swinging-flashlight findings.",
      steps: [
        "Suspect a left optic neuropathy (for example optic neuritis), an afferent problem.",
        "At rest, expect equal pupil sizes.",
        "Light on the right eye: both pupils constrict.",
        "Swing to the left eye: both pupils dilate because the left eye provides less afferent drive — a left RAPD.",
        "Document 'left RAPD' and correlate with acuity, colour vision, fields and fundus examination."
      ]
    },
    transfer: {
      prompt: "A table gives pupil diameters: in bright light, right 3 mm, left 6 mm; in dim light, right 6 mm, left 7 mm. Which pupil is abnormal, which pathway is affected, and what other signs would you look for?",
      modelAnswer: "The anisocoria is greater in bright light, so the larger (left) pupil fails to constrict: a left parasympathetic/efferent problem. Look for ptosis and eye-movement limitation (third nerve palsy, which can be urgent), signs of a tonic pupil, or a history of drops or plant exposure (pharmacological)."
    },
    items: [
      {
        id: "Q-L09-01", version: 1, objectiveIds: ["L09-O2"], familyId: "F-L09-swing-afferent", pool: "practice", difficulty: 2,
        stem: "During a swinging-flashlight test, both pupils dilate each time the light moves from the right eye to the left eye. What is the finding?",
        options: ["Right RAPD", "Left RAPD", "Left third nerve palsy", "Normal physiological anisocoria"],
        answerIndex: 1,
        explanation: "Dilation of both pupils when light enters the left eye means the left eye provides less afferent drive: a left relative afferent pupillary defect.",
        distractorRationale: ["The defect is on the side that, when illuminated, produces dilation — the left.", "", "An efferent palsy affects one pupil's constriction, not both pupils' response to one eye.", "Physiological anisocoria does not produce this swinging pattern."],
        misconceptionIds: ["M-AFFERENT-VS-EFFERENT"], sources: ["K1"], reviewStatus: "draft"
      },
      {
        id: "Q-L09-02", version: 1, objectiveIds: ["L09-O2"], familyId: "F-L09-rapd-not-dilated", pool: "practice", difficulty: 2,
        stem: "A patient has a unilateral optic neuropathy and nothing else. What would you expect to see at rest in room light?",
        options: ["The affected pupil is larger", "The affected pupil is smaller", "Pupils are equal in size", "Both pupils are fixed"],
        answerIndex: 2,
        explanation: "Both irises receive the shared central drive from both eyes, so a pure afferent defect does not cause anisocoria. It is revealed by the swinging-flashlight test.",
        distractorRationale: ["A large pupil suggests an efferent or pharmacological problem.", "A small pupil suggests a sympathetic problem.", "", "Fixed pupils are not expected from a unilateral afferent defect."],
        misconceptionIds: ["M-AFFERENT-VS-EFFERENT"], sources: ["K1"], reviewStatus: "draft"
      },
      {
        id: "Q-L09-03", version: 1, objectiveIds: ["L09-O3"], familyId: "F-L09-anisocoria-light", pool: "practice", difficulty: 2,
        stem: "Anisocoria is much greater in bright light than in dim light. Which pupil is abnormal?",
        options: ["The smaller pupil, from a sympathetic problem", "The larger pupil, from a failure to constrict", "Neither; this is always physiological", "Cannot be determined from light and dark comparison"],
        answerIndex: 1,
        explanation: "In bright light the normal pupil constricts and the abnormal larger pupil does not, so the difference grows. This points to the parasympathetic (constrictor) side.",
        distractorRationale: ["A sympathetic problem makes anisocoria greater in the dark.", "", "Physiological anisocoria is similar in light and dark.", "Light-versus-dark comparison is exactly the test that localises the abnormal pupil."],
        misconceptionIds: ["M-AFFERENT-VS-EFFERENT"], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L09-04", version: 1, objectiveIds: ["L09-O3"], familyId: "F-L09-horner", pool: "practice", difficulty: 2,
        stem: "A patient has mild left ptosis and a smaller left pupil; the anisocoria is more obvious in dim light. What is the most likely mechanism?",
        options: ["Left oculomotor nerve palsy", "Left sympathetic pathway interruption (Horner syndrome)", "Left RAPD", "Pharmacological dilation of the right pupil"],
        answerIndex: 1,
        explanation: "Ptosis with a smaller pupil and anisocoria greater in the dark fits loss of sympathetic drive to the left eye.",
        distractorRationale: ["Third nerve palsy gives a larger pupil and usually more marked ptosis with motility loss.", "", "An afferent defect does not cause anisocoria or ptosis.", "A pharmacologically dilated right pupil would make the anisocoria greater in light and would not explain left ptosis."],
        misconceptionIds: ["M-AFFERENT-VS-EFFERENT"], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L09-05", version: 1, objectiveIds: ["L09-O4"], familyId: "F-L09-reverse-observation", pool: "exam", difficulty: 3,
        stem: "The right pupil is fixed and dilated from an efferent problem. How can you check for a right afferent defect?",
        options: ["It cannot be assessed", "Observe the left pupil: compare its constriction when light is in the left eye with when light is in the right eye", "Observe only the right pupil for dilation", "Dilate the left pupil as well"],
        answerIndex: 1,
        explanation: "The reactive left pupil reports the afferent input from each eye. If it constricts less when the light is in the right eye (consensual) than in the left eye (direct), there is a right afferent defect.",
        distractorRationale: ["The reactive pupil can still be used to compare afferent input.", "", "A fixed pupil cannot report changes in input.", "Dilating the other pupil removes the only usable response."],
        misconceptionIds: ["M-AFFERENT-VS-EFFERENT"], sources: ["K1"], reviewStatus: "draft"
      },
      {
        id: "Q-L09-06", version: 1, objectiveIds: ["L09-O2"], familyId: "F-L09-media-rapd", pool: "exam", difficulty: 3,
        stem: "A patient has a dense cataract in the right eye and a clear right RAPD. What is the most appropriate conclusion?",
        options: ["The cataract fully explains the RAPD", "A marked RAPD is not typical of cataract alone; look for coexisting retinal or optic nerve disease", "The RAPD proves glaucoma", "The RAPD means the right pupil is dilated"],
        answerIndex: 1,
        explanation: "Media opacities scatter light but usually do not reduce afferent drive enough to cause a marked RAPD. A clear RAPD should prompt assessment of retina and optic nerve, using B-scan if the fundus cannot be seen.",
        distractorRationale: ["Attributing the RAPD to cataract risks missing another disease.", "", "A RAPD indicates afferent asymmetry, not a specific diagnosis.", "An RAPD is not a dilated pupil."],
        misconceptionIds: ["M-FINDING-AS-CERTAINTY", "M-AFFERENT-VS-EFFERENT"], sources: ["K1", "C2"], reviewStatus: "draft"
      }
    ],
    sources: ["K1", "C1", "C2"],
    reviewStatus: "draft"
  },
  {
    id: "L10",
    title: "Ocular motility and alignment examination",
    group: "Examination",
    emphasis: "Extraocular movements, cover tests, corneal reflex, phoria/tropia and prism concepts",
    signature: "Cover/uncover a virtual patient's eyes",
    prerequisites: ["L01"],
    studios: ["LAB06"],
    activities: ["T025", "T026", "T027", "T028", "T029", "T030", "T031", "T032", "T033", "T034", "T035", "T036", "T083"],
    estMinutes: 55,
    objectives: [
      { id: "L10-O1", text: "State the primary action and cranial nerve supply of each extraocular muscle and predict the limitation produced by each nerve palsy." },
      { id: "L10-O2", text: "Given the movement seen on a cover-uncover test, distinguish a tropia from a phoria and name its direction, stating which eye is covered and which is observed." },
      { id: "L10-O3", text: "Interpret corneal light reflex (Hirschberg) displacement as eso- or exodeviation." },
      { id: "L10-O4", text: "Explain what the alternate-cover test reveals that the cover-uncover test does not." }
    ],
    bridge: "L01 placed six extraocular muscles in the orbit. Here you will predict what each does and test alignment. Two ideas carry the lecture: a tropia is a manifest misalignment present with both eyes open, while a phoria is a latent tendency held in check by fusion.",
    essentials: [
      "Horizontal muscles: the medial rectus adducts and the lateral rectus abducts. Vertical recti elevate (superior rectus) and depress (inferior rectus) best when the eye is abducted; the obliques depress (superior oblique) and elevate (inferior oblique) best when the eye is adducted.",
      "Nerve supply: the lateral rectus is supplied by the abducens nerve (VI), the superior oblique by the trochlear nerve (IV) and all others, plus the levator, by the oculomotor nerve (III).",
      "Cover-uncover test: cover one eye and watch the other. If the uncovered eye moves to take up fixation, it was not straight — a tropia. Movement inward to fixate means it was turned out (exotropia); movement outward means it was turned in (esotropia).",
      "Example: a left esotropia. When the right (fixing) eye is covered, the left eye moves outward to take fixation.",
      "A phoria shows no movement of the uncovered eye; the covered eye drifts behind the cover and moves back when uncovered as fusion is restored.",
      "Corneal light reflex: a reflex displaced temporally suggests esotropia, displaced nasally suggests exotropia.",
      "Alternate-cover testing breaks fusion and reveals the total deviation (tropia plus any phoria); prisms can be used to measure it."
    ],
    full: [
      "Mechanism of examination: ductions test one eye's range; versions test both eyes together in the cardinal positions of gaze. Testing the vertical muscles in the positions where their vertical action is greatest isolates them: superior and inferior recti in abduction, obliques in adduction. Documentation names the limitation, the eye and the gaze direction using patient-centred laterality.",
      "Nerve palsy patterns: a sixth nerve palsy limits abduction, producing an esotropia and horizontal diplopia that worsens looking toward the affected side and at distance. A fourth nerve palsy gives vertical (often oblique) diplopia worse looking down and toward the nose, such as when reading or using stairs; patients may tilt the head away from the affected side. A third nerve palsy gives ptosis and an eye that rests down and out; pupil involvement raises concern for compression and needs emergency assessment (L25).",
      "Cover-uncover test in detail: the patient fixes a target. Cover the right eye and observe the left. If the left eye moves, there is a left tropia (direction from the movement). Uncover and observe; repeat covering the left and observing the right. If neither uncovered eye moves, there is no manifest tropia at that distance. On removing the cover, a covered eye that moves to re-fixate indicates a phoria (if no tropia was found).",
      "Alternate-cover test: the cover moves directly from one eye to the other without allowing both eyes to see together. Fusion is suspended, so the test reveals the total deviation, combining manifest and latent components; it does not by itself say whether a deviation is a phoria or a tropia. Prism-cover methods measure deviations in prism dioptres; simultaneous prism-cover measures the manifest component, alternate prism-cover the total.",
      "Hirschberg test: a penlight held in front of the patient produces corneal reflexes. With straight eyes the reflexes are symmetrical and slightly nasal to the pupil centre. If one eye is turned in, its reflex appears displaced temporally; if turned out, nasally. Pseudostrabismus (for example from broad epicanthic folds) gives the appearance of a turn but symmetrical reflexes and a normal cover test.",
      "Binocular tests (Maddox rod, Worth four-dot, Bagolini lenses, stereoacuity) assess dissociated alignment, suppression and fusion. Their results depend on declared filter or lens assignment and distance; they are extensions after the cover tests are secure.",
      "Documentation: state distance and near, the fixing eye, the type (phoria/tropia), direction (eso/exo/hyper/hypo), whether constant or intermittent, and any measurement with the method used. Note patient laterality explicitly."
    ],
    deeper: [
      "Hering's law: yoked muscles of the two eyes receive equal innervation. This explains why the deviation can be larger when the paretic eye fixates (secondary deviation) than when the normal eye fixates (primary deviation).",
      "The three-step test helps localise a vertical muscle weakness, classically pointing to a superior oblique palsy, but restrictive and skew deviations can mimic its pattern; it is not universally specific."
    ],
    misconceptions: [
      "Mistake: if the covered eye moves when uncovered, there is a tropia. Correction: the uncovered (fellow) eye moving to take fixation when the other is covered indicates a tropia; movement of the previously covered eye on uncovering, with no tropia found, indicates a phoria.",
      "Mistake: the alternate-cover test shows the manifest deviation. Correction: it reveals the total dissociated deviation, combining phoria and tropia.",
      "Mistake: the superior rectus is tested best in adduction. Correction: the vertical recti are tested in abduction and the obliques in adduction."
    ],
    entryChallenge: {
      prompt: "You cover the right eye and the left eye moves inward to look at the target. What does this mean?",
      answer: "The left eye was turned outward before the cover: a left exotropia (manifest)."
    },
    contrast: {
      a: "Left esotropia (tropia): covering the right eye makes the left eye move outward to fixate.",
      b: "Esophoria (phoria): no movement of either uncovered eye; the covered eye drifts in behind the cover and moves out on uncovering.",
      discriminator: "Whether the uncovered fellow eye moves when the fixing eye is covered."
    },
    workedExample: {
      problem: "A patient reports horizontal double vision worse at distance and looking to the right. On testing, the right eye does not abduct fully. Interpret.",
      steps: [
        "Horizontal diplopia worse looking to the right points to a muscle that moves an eye horizontally to the right: right lateral rectus or left medial rectus.",
        "Limited abduction of the right eye identifies the right lateral rectus.",
        "Its nerve is the abducens (VI).",
        "Expect a right esotropia increasing in right gaze. Document: 'Right abduction limited; esotropia greater in right gaze and at distance.'",
        "Consider causes and urgency in the clinical context (L25)."
      ]
    },
    transfer: {
      prompt: "A timeline strip shows: frame 1 both eyes open, reflexes symmetric; frame 2 right eye covered, left eye does not move; frame 3 cover removed, right eye moves outward to re-fixate. Interpret the result.",
      modelAnswer: "No movement of the uncovered left eye means no left tropia. The right eye moving outward on uncovering means it had drifted inward behind the cover: an esophoria (latent). Repeat with the left eye covered and at near and distance before concluding."
    },
    items: [
      {
        id: "Q-L10-01", version: 1, objectiveIds: ["L10-O2"], familyId: "F-L10-cover-uncover-tropia", pool: "practice", difficulty: 2,
        stem: "The right eye fixes. When the right eye is covered, the left eye moves outward to take up fixation. What is the deviation?",
        options: ["Left exotropia", "Left esotropia", "Right esophoria", "No deviation"],
        answerIndex: 1,
        explanation: "The uncovered left eye moved outward to fixate, so it had been turned inward: a manifest left esotropia.",
        distractorRationale: ["An exotropic eye moves inward to take fixation.", "", "A phoria does not cause the uncovered fellow eye to move.", "Movement of the uncovered eye proves a manifest deviation."],
        misconceptionIds: ["M-PHORIA-VS-TROPIA"], sources: ["K2", "C3"], reviewStatus: "draft"
      },
      {
        id: "Q-L10-02", version: 1, objectiveIds: ["L10-O2"], familyId: "F-L10-phoria", pool: "practice", difficulty: 2,
        stem: "Neither eye moves when the other is covered. When the cover is removed from the left eye, the left eye moves inward to re-fixate. What is this?",
        options: ["Left esotropia", "Left exotropia", "Exophoria", "Esophoria"],
        answerIndex: 2,
        explanation: "No movement of the uncovered eyes means no tropia. The left eye drifted outward under the cover and moved inward on uncovering as fusion resumed: an exophoria.",
        distractorRationale: ["A tropia would make the uncovered eye move.", "A tropia would make the uncovered eye move.", "", "In esophoria the eye drifts inward behind the cover and moves outward on uncovering."],
        misconceptionIds: ["M-PHORIA-VS-TROPIA"], sources: ["K2", "C3"], reviewStatus: "draft"
      },
      {
        id: "Q-L10-03", version: 1, objectiveIds: ["L10-O3"], familyId: "F-L10-hirschberg", pool: "practice", difficulty: 2,
        stem: "The corneal light reflex is centred in the left eye but displaced temporally in the right eye. What does this suggest?",
        options: ["Right exotropia", "Right esotropia", "Left esotropia", "Normal alignment"],
        answerIndex: 1,
        explanation: "If the right eye is turned in, the light reflex falls on the temporal side of its cornea relative to the pupil. A temporally displaced reflex suggests esotropia of that eye; confirm with a cover test.",
        distractorRationale: ["Exotropia gives a nasally displaced reflex.", "", "The left reflex is centred, so the left eye is fixing.", "Asymmetric reflexes indicate a likely deviation."],
        misconceptionIds: [], sources: ["K2"], reviewStatus: "draft"
      },
      {
        id: "Q-L10-04", version: 1, objectiveIds: ["L10-O1"], familyId: "F-L10-nerve-abduction", pool: "practice", difficulty: 1,
        stem: "A patient cannot move the left eye outward beyond the midline. Which nerve is most likely affected?",
        options: ["Left oculomotor (III)", "Left trochlear (IV)", "Left abducens (VI)", "Right abducens (VI)"],
        answerIndex: 2,
        explanation: "Abduction is the action of the lateral rectus, supplied by the abducens nerve on the same side.",
        distractorRationale: ["The oculomotor nerve supplies the medial rectus (adduction), not abduction.", "The trochlear nerve supplies the superior oblique.", "", "The right nerve would affect the right eye."],
        misconceptionIds: [], sources: ["C1", "C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L10-05", version: 1, objectiveIds: ["L10-O1"], familyId: "F-L10-oblique-action", pool: "exam", difficulty: 3,
        stem: "A patient has vertical double vision that is worst when reading and walking downstairs. Weakness of which muscle best fits, and in which gaze is its vertical action greatest?",
        options: ["Inferior rectus; greatest in adduction", "Superior oblique; greatest in adduction", "Superior rectus; greatest in abduction", "Lateral rectus; greatest in abduction"],
        answerIndex: 1,
        explanation: "The superior oblique depresses the eye most effectively when it is adducted, the position used for reading and looking down stairs. Weakness causes vertical diplopia in that gaze.",
        distractorRationale: ["The inferior rectus depresses most in abduction.", "", "The superior rectus elevates, so weakness affects upgaze.", "The lateral rectus has no vertical action."],
        misconceptionIds: [], sources: ["C1", "C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L10-06", version: 1, objectiveIds: ["L10-O4"], familyId: "F-L10-alternate-cover-meaning", pool: "exam", difficulty: 3,
        stem: "During an alternate-cover test, each eye moves inward as the cover passes to the other eye. What can be concluded from this test alone?",
        options: ["A manifest exotropia is present", "There is an exo-deviation, but whether it is latent, manifest or both is not determined by this test alone", "There is an esophoria", "The eyes are straight"],
        answerIndex: 1,
        explanation: "Alternate covering suspends fusion and reveals the total deviation. Each eye moving inward to fixate shows an exo-deviation, but only the cover-uncover test separates phoria from tropia.",
        distractorRationale: ["The alternate-cover test does not isolate the manifest component.", "", "Inward refixation indicates exo-, not eso-, deviation.", "Movement shows that a deviation exists under dissociation."],
        misconceptionIds: ["M-PHORIA-VS-TROPIA"], sources: ["K2", "C3"], reviewStatus: "draft"
      }
    ],
    sources: ["K2", "C3", "C1", "C2"],
    reviewStatus: "draft"
  },
  {
    id: "L11",
    title: "Visual fields and pathway localization",
    group: "Examination",
    emphasis: "Confrontation, perimetry, monocular/binocular defects, chiasmal/retrochiasmal localization",
    signature: "Map a lesion to the visual fields",
    prerequisites: ["L01", "L09"],
    studios: ["LAB07"],
    activities: ["T037", "T038", "T039", "T040"],
    estMinutes: 50,
    objectives: [
      { id: "L11-O1", text: "Map a point in the visual field to its retinal location, accounting for inversion and reversal by the eye's optics." },
      { id: "L11-O2", text: "Localise a field defect as prechiasmal, chiasmal or retrochiasmal from whether it affects one or both eyes and respects the vertical midline." },
      { id: "L11-O3", text: "Given a lesion in the right optic tract, radiation or occipital cortex, predict a left homonymous defect." },
      { id: "L11-O4", text: "Explain why test reliability and fixation must be assessed before interpreting an automated field." }
    ],
    bridge: "From L09: ganglion cell axons form the optic nerve, and nasal fibres cross at the chiasm. The visual field is what the patient sees; the retina is where the image falls. Because the eye inverts the image, field and retinal coordinates are flipped, and keeping them separate is essential.",
    essentials: [
      "The optics of the eye invert and reverse the image: the superior field falls on the inferior retina and the temporal field falls on the nasal retina.",
      "At the chiasm, fibres from the nasal retina of each eye cross. Behind the chiasm, each optic tract carries information about the opposite half of the visual field from both eyes.",
      "A defect in one eye only localises in front of the chiasm (retina or optic nerve).",
      "A bitemporal defect localises to the chiasm, where crossing nasal fibres are compressed, for example by a pituitary tumour.",
      "A homonymous defect (same side of the field in both eyes) localises behind the chiasm on the opposite side: a right-sided lesion gives a left homonymous defect.",
      "Defects that respect the vertical midline suggest a chiasmal or retrochiasmal cause; defects that respect the horizontal midline suggest retinal nerve fibre or optic nerve disease such as glaucoma or ischaemic optic neuropathy."
    ],
    full: [
      "Coordinate discipline: a field map is drawn as the patient sees it, conventionally with the right eye's map on the right. Retinal maps are inverted. Images on screen may be mirrored. Before localising, state which coordinate system a diagram uses; a 'superior' defect on a field chart corresponds to inferior retinal damage.",
      "Anatomy predicts patterns. Retinal ganglion cell axons arc around the fovea and meet at a horizontal raphe on the temporal side; damage to these bundles produces arcuate defects that stop at the horizontal midline, typical of glaucoma. The vertical meridian is respected from the chiasm backward because crossed and uncrossed fibres divide there.",
      "Chiasmal lesions: compression from below (classically pituitary tumours) affects crossing inferonasal fibres first, often producing bitemporal defects that begin superiorly. Symptoms may be subtle, such as bumping into objects at the sides.",
      "Retrochiasmal lesions: a right optic tract, right optic radiation or right occipital lesion causes a left homonymous defect. Temporal lobe lesions affecting Meyer's loop tend to cause contralateral superior quadrantanopia; parietal lesions tend to cause inferior defects; occipital lesions give highly congruous defects and may spare the macula. These are teaching relationships; real defects vary.",
      "Tests: confrontation fields are a quick bedside screen for large defects, done monocularly with fixation controlled. Kinetic perimetry moves stimuli to map isopters. Static automated perimetry presents stimuli at fixed locations and compares responses with normative data; reliability indices (fixation losses, false positives, false negatives) and artefacts such as lens rim or ptosis must be reviewed first.",
      "Interpretation: decide monocular versus binocular, which midline is respected, and congruity, then propose a location and differential. A single unreliable field is not a diagnosis; repeat testing and correlation with the optic disc, pupils and imaging are often needed.",
      "Documentation: state the test (confrontation, kinetic or automated), reliability, each eye's defect described in field coordinates, and the proposed localisation with uncertainty."
    ],
    deeper: [
      "Junctional scotoma: a lesion at the junction of the optic nerve and chiasm can produce a central defect in one eye and a superotemporal defect in the other.",
      "Enlarged blind spot is seen in disc swelling (L24). Altitudinal defects respecting the horizontal midline are typical of ischaemic optic neuropathy and branch retinal artery occlusion.",
      "Many historical localisation 'rules' (such as precise congruity gradients) are simplifications; IRIS teaches them as tendencies supported by K3, not absolutes."
    ],
    misconceptions: [
      "Mistake: a superior field defect means superior retinal damage. Correction: the image is inverted, so a superior field defect corresponds to inferior retina.",
      "Mistake: a right occipital lesion causes right-sided field loss. Correction: retrochiasmal lesions cause contralateral (left) homonymous loss.",
      "Mistake: an automated field with many errors still shows the true defect. Correction: check reliability and artefacts first; unreliable results can mislead."
    ],
    entryChallenge: {
      prompt: "A patient cannot see objects on the left side with either eye; the defect stops sharply at the vertical midline. Where is the lesion?",
      answer: "Behind the chiasm on the right side (right optic tract, radiation or occipital cortex): a left homonymous hemianopia."
    },
    contrast: {
      a: "Bitemporal hemianopia: both temporal hemifields lost; chiasmal lesion.",
      b: "Left homonymous hemianopia: left hemifield lost in both eyes; right retrochiasmal lesion.",
      discriminator: "Whether the lost halves are on opposite sides (temporal in each eye) or the same side of space in both eyes."
    },
    workedExample: {
      problem: "Automated fields show a superior arcuate defect in the right eye that stops at the horizontal midline; the left eye is normal and reliability is acceptable. Localise.",
      steps: [
        "Only one eye is affected, so the lesion is in front of the chiasm.",
        "The defect respects the horizontal midline and follows an arcuate path, matching nerve fibre bundle damage.",
        "A superior field defect corresponds to inferior retina/inferior optic disc fibres.",
        "Correlate with the inferior rim of the right optic disc and RNFL imaging; glaucoma is one possibility but needs disc assessment, not field alone.",
        "Document: 'RE superior arcuate defect respecting horizontal meridian; reliable; LE full.'"
      ]
    },
    transfer: {
      prompt: "A schematic shows a lesion marked on the left optic radiation in the temporal lobe. Draw or describe the expected field maps for each eye.",
      modelAnswer: "A left retrochiasmal lesion gives right-sided homonymous loss. Involvement of temporal (Meyer's loop) fibres tends to produce a right superior homonymous quadrantanopia in both eyes, respecting the vertical midline. Real defects can be incomplete or incongruous."
    },
    items: [
      {
        id: "Q-L11-01", version: 1, objectiveIds: ["L11-O2"], familyId: "F-L11-bitemporal", pool: "practice", difficulty: 1,
        stem: "A patient has loss of the temporal half of the field in both eyes. Where is the lesion most likely to be?",
        options: ["Right optic nerve", "Optic chiasm", "Left optic tract", "Right occipital cortex"],
        answerIndex: 1,
        explanation: "Crossing nasal retinal fibres, which serve the temporal fields, are concentrated at the chiasm. Damage there produces bitemporal defects.",
        distractorRationale: ["An optic nerve lesion affects one eye only.", "", "A tract lesion gives a homonymous defect.", "Occipital lesions give homonymous defects."],
        misconceptionIds: [], sources: ["K3"], reviewStatus: "draft"
      },
      {
        id: "Q-L11-02", version: 1, objectiveIds: ["L11-O3"], familyId: "F-L11-homonymous", pool: "practice", difficulty: 2,
        stem: "A stroke affects the right occipital lobe. What field defect is expected in a standard teaching case?",
        options: ["Right homonymous hemianopia", "Left homonymous hemianopia", "Bitemporal hemianopia", "Right monocular blindness"],
        answerIndex: 1,
        explanation: "Each occipital lobe processes the opposite half of visual space from both eyes. A right occipital lesion gives a left homonymous hemianopia, sometimes with macular sparing.",
        distractorRationale: ["The defect is contralateral to the lesion.", "", "Bitemporal loss is chiasmal.", "Monocular loss is prechiasmal."],
        misconceptionIds: [], sources: ["K3"], reviewStatus: "draft"
      },
      {
        id: "Q-L11-03", version: 1, objectiveIds: ["L11-O1"], familyId: "F-L11-field-retina", pool: "practice", difficulty: 2,
        stem: "A patient's right eye has a defect in the inferior nasal visual field. Which retinal region corresponds?",
        options: ["Inferior nasal retina", "Superior temporal retina", "Superior nasal retina", "Inferior temporal retina"],
        answerIndex: 1,
        explanation: "The eye's optics invert and reverse the image. The inferior field maps to the superior retina and the nasal field maps to the temporal retina.",
        distractorRationale: ["This forgets the inversion between field and retina.", "", "Only the vertical inversion was applied.", "Only the horizontal reversal was applied."],
        misconceptionIds: ["M-FIELD-VS-RETINA"], sources: ["K3"], reviewStatus: "draft"
      },
      {
        id: "Q-L11-04", version: 1, objectiveIds: ["L11-O2"], familyId: "F-L11-monocular", pool: "practice", difficulty: 1,
        stem: "A field defect affects only the left eye. Where is the lesion?",
        options: ["Anterior to the chiasm, in the left eye or left optic nerve", "Left optic tract", "Right occipital cortex", "Optic chiasm"],
        answerIndex: 0,
        explanation: "Only prechiasmal structures carry information from one eye alone; behind the chiasm, fibres from both eyes travel together.",
        distractorRationale: ["", "Tract lesions give homonymous defects in both eyes.", "Occipital lesions affect both eyes' fields.", "Chiasmal lesions typically affect both eyes."],
        misconceptionIds: [], sources: ["K3"], reviewStatus: "draft"
      },
      {
        id: "Q-L11-05", version: 1, objectiveIds: ["L11-O3", "L11-O1"], familyId: "F-L11-quadrantanopia", pool: "exam", difficulty: 3,
        stem: "Both eyes show loss of the upper left quadrant of the visual field, respecting the vertical midline. Which lesion location best fits?",
        options: ["Left temporal lobe", "Right temporal lobe (Meyer's loop fibres)", "Right parietal lobe", "Chiasm, superior aspect"],
        answerIndex: 1,
        explanation: "A homonymous left defect implies a right retrochiasmal lesion. Superior quadrant defects are associated with inferior radiation fibres looping through the temporal lobe.",
        distractorRationale: ["A left-sided lesion would cause right-sided field loss.", "", "Parietal lesions tend to produce inferior quadrant defects.", "Chiasmal lesions give bitemporal rather than homonymous defects."],
        misconceptionIds: ["M-FIELD-VS-RETINA"], sources: ["K3"], reviewStatus: "draft"
      },
      {
        id: "Q-L11-06", version: 1, objectiveIds: ["L11-O4"], familyId: "F-L11-reliability", pool: "exam", difficulty: 2,
        stem: "An automated field printout shows a scattered defect, but the reliability indices show frequent fixation losses and false positives. What is the best next step?",
        options: ["Diagnose advanced glaucoma from the printout", "Treat the result as unreliable; review artefacts and repeat or correlate before interpreting", "Ignore reliability because the machine is automated", "Conclude the patient is malingering"],
        answerIndex: 1,
        explanation: "Reliability and artefacts must be assessed before interpreting a field. An unreliable test should be repeated and interpreted with the disc, pupils and history.",
        distractorRationale: ["A diagnosis cannot rest on an unreliable test.", "", "Automation does not remove patient-dependent errors.", "Poor reliability has many innocent causes, such as fatigue or unfamiliarity."],
        misconceptionIds: ["M-FINDING-AS-CERTAINTY"], sources: ["K3"], reviewStatus: "draft"
      }
    ],
    sources: ["K3", "C1", "C2"],
    reviewStatus: "draft"
  },
  {
    id: "L12",
    title: "Instruments and core examination techniques",
    group: "Examination",
    emphasis: "Penlight, slit lamp, red reflex, direct/indirect ophthalmoscopy, tonometry and gonioscopy principles",
    signature: "Select an instrument and interpret what it can reveal",
    prerequisites: ["L01", "L08"],
    studios: ["LAB08", "LAB10", "LAB11", "LAB14"],
    activities: ["T041", "T042", "T043", "T044", "T045", "T055", "T056", "T057", "T058", "T061", "T062", "T063", "T064"],
    estMinutes: 55,
    objectives: [
      { id: "L12-O1", text: "Compare direct and indirect ophthalmoscopy by image orientation, field of view, magnification and stereopsis." },
      { id: "L12-O2", text: "Explain why the iridocorneal angle cannot be seen directly and how gonioscopy overcomes this." },
      { id: "L12-O3", text: "Explain what applanation tonometry measures, list factors that bias the reading, and state why a pressure value alone neither diagnoses nor excludes glaucoma." },
      { id: "L12-O4", text: "Select a slit-lamp illumination technique (diffuse, optical section, retroillumination) appropriate to a question about a lesion." },
      { id: "L12-O5", text: "Describe a red reflex finding and its next step without assigning a single diagnosis." }
    ],
    bridge: "L08 gave you the order of examination; L01 the structures you will see. Each instrument answers a particular question with particular limits. Choosing the right tool and knowing what it cannot show prevents over-interpretation.",
    essentials: [
      "A penlight shows lids, conjunctiva, gross cornea and pupils. It does not replace a slit lamp.",
      "The slit lamp is a binocular microscope with an adjustable light. Diffuse light surveys; a narrow optical section shows depth within the cornea, anterior chamber and lens; retroillumination uses reflected light from behind to outline opacities.",
      "The direct ophthalmoscope gives a magnified, upright, monocular view of a small area of fundus. Indirect ophthalmoscopy gives a wider, stereoscopic, inverted and reversed view at lower magnification.",
      "The red reflex, seen through the ophthalmoscope at a distance, should be bright and symmetrical. A dull, absent or white reflex is a finding that needs evaluation, not a diagnosis.",
      "Goldmann applanation tonometry measures the force needed to flatten a defined area of cornea. Corneal thickness, astigmatism, and technique (such as excess fluorescein or pressing on the lids) bias the reading.",
      "The angle cannot be seen directly because light from it is totally internally reflected at the cornea. A gonioscopy lens overcomes this. The Van Herick slit-lamp estimate of peripheral chamber depth is a screening clue, not a replacement for gonioscopy.",
      "A normal pressure reading does not exclude glaucoma and a high reading does not diagnose it."
    ],
    full: [
      "Slit-lamp technique follows the question. To find whether a corneal scar is superficial or deep, use a narrow beam at an angle (optical section) and observe where in the corneal thickness it lies. To see cells in the anterior chamber, use a short, narrow, bright beam in a dark room and look in the dark space between cornea and lens. To outline cataract or iris transillumination, use retroillumination from the fundus reflex.",
      "Direct ophthalmoscopy: the examiner gets close to the patient, uses the same eye as the patient's eye being examined, and sees a high-magnification upright image. Its small field makes systematic navigation essential: disc (colour, margin, cup), vessels along each arcade, then macula. Undilated views are limited; an unseen periphery is recorded as not examined.",
      "Indirect ophthalmoscopy (head-mounted with a hand-held condensing lens) and slit-lamp fundus lenses give stereoscopic wide views, with the image inverted and reversed. Orientation must be translated when drawing: a lesion seen at the top of the indirect image lies inferiorly in the eye. Peripheral retinal examination for tears requires these methods with dilation.",
      "Tonometry principle: in applanation, the force needed to flatten a fixed area of cornea is related to intraocular pressure. Thicker corneas tend to give higher readings and thinner corneas lower readings, but there is no validated universal correction formula. Rebound and non-contact tonometers have different use cases and biases; a screening reading does not complete a glaucoma assessment.",
      "Why pressure is not diagnosis: glaucoma is defined by characteristic optic nerve damage with corresponding field loss. Some patients develop damage at statistically normal pressures; others have raised pressure without damage (ocular hypertension). Pressure is interpreted alongside disc, field and angle findings.",
      "Gonioscopy: placing a mirrored or high-curvature contact lens on the cornea eliminates the air-cornea total internal reflection and lets the examiner see angle structures from the iris root to Schwalbe's line. Indentation gonioscopy can distinguish appositional from synechial closure. A grading system must be declared.",
      "Red reflex: in children especially, a white reflex (leukocoria), an absent reflex or asymmetry between the eyes calls for urgent specialist evaluation; causes range from cataract to retinoblastoma (L26, L32). In adults, a dull reflex often reflects media opacity.",
      "Safety: contact tonometry and gonioscopy are avoided when an open globe is suspected; infection control applies to any contact instrument."
    ],
    deeper: [
      "The Brückner test compares red reflexes of both eyes simultaneously; asymmetry in brightness or colour can indicate strabismus, anisometropia or media opacity.",
      "Corneal biomechanics as well as thickness influence tonometry; this is why IRIS does not offer a corneal-thickness correction calculator.",
      "Condensing lens power affects field and magnification in indirect ophthalmoscopy: higher-power lenses give wider fields with less magnification."
    ],
    misconceptions: [
      "Mistake: a pressure in the normal range excludes glaucoma. Correction: diagnosis depends on optic nerve structure and visual field; pressure is a risk factor.",
      "Mistake: the indirect ophthalmoscope image is the same way up as the fundus. Correction: it is inverted and reversed; translate orientation when documenting.",
      "Mistake: a white pupillary reflex means retinoblastoma. Correction: leukocoria is a finding with several causes; it requires urgent evaluation, not an assumed diagnosis.",
      "Mistake: Van Herick grading replaces gonioscopy. Correction: it estimates peripheral chamber depth; the angle itself requires gonioscopy."
    ],
    entryChallenge: {
      prompt: "Which instrument would you choose to decide whether an opacity lies in the anterior or posterior part of the lens, and which illumination?",
      answer: "The slit lamp, using a narrow optical section (and retroillumination to outline the opacity)."
    },
    contrast: {
      a: "Direct ophthalmoscopy: upright, high magnification, small field, monocular.",
      b: "Indirect ophthalmoscopy: inverted and reversed, lower magnification, wide field, stereoscopic.",
      discriminator: "Field of view and image orientation — choose by the question (disc detail versus periphery)."
    },
    workedExample: {
      problem: "A patient's applanation reading is within the usual population range, but the optic disc shows a thin inferior rim with a matching superior field defect. How should this be interpreted?",
      steps: [
        "Recognise that structure (thin inferior rim) and function (superior field defect) agree.",
        "A pressure reading within the normal range does not exclude glaucoma; glaucomatous damage can occur at such pressures.",
        "Consider measurement factors (corneal thickness, technique) and the variability of pressure over time.",
        "Consider other optic neuropathies in the differential.",
        "Document the findings and refer for specialist glaucoma assessment rather than labelling the eye normal."
      ]
    },
    transfer: {
      prompt: "An indirect ophthalmoscopy sketch drawn exactly as seen shows a horseshoe-shaped lesion at the top-left of the image of a right eye. Where is the lesion in the eye?",
      modelAnswer: "The indirect image is inverted and reversed, so the top-left of the image corresponds to the inferior and opposite horizontal side of the fundus — inferior and to the right of the image centre in true orientation. Re-label nasal/temporal for the right eye explicitly rather than relying on the picture."
    },
    items: [
      {
        id: "Q-L12-01", version: 1, objectiveIds: ["L12-O1"], familyId: "F-L12-ophthalmoscope-compare", pool: "practice", difficulty: 1,
        stem: "Which feature is characteristic of binocular indirect ophthalmoscopy compared with direct ophthalmoscopy?",
        options: ["Upright image with high magnification", "Wide, stereoscopic, inverted and reversed view", "No need for pupil dilation to see the periphery", "Smaller field of view"],
        answerIndex: 1,
        explanation: "Indirect ophthalmoscopy trades magnification for a wide stereoscopic field; the image is inverted and reversed.",
        distractorRationale: ["This describes direct ophthalmoscopy.", "", "Peripheral examination usually requires dilation.", "The field is wider, not smaller."],
        misconceptionIds: [], sources: ["C1", "C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L12-02", version: 1, objectiveIds: ["L12-O2"], familyId: "F-L12-gonioscopy-principle", pool: "practice", difficulty: 2,
        stem: "Why can the iridocorneal angle not be seen directly at the slit lamp without a special lens?",
        options: ["The iris is opaque", "Light from the angle undergoes total internal reflection at the cornea–air interface", "The angle is behind the lens", "The angle lacks pigment"],
        answerIndex: 1,
        explanation: "Light from the angle meets the cornea–air interface at too steep an angle and is reflected back into the eye. A gonioscopy lens replaces that interface and allows the light out.",
        distractorRationale: ["The angle lies in front of the iris root, so iris opacity is not the reason.", "", "The angle lies at the periphery of the anterior chamber, in front of the lens.", "Pigmentation is irrelevant to whether light can exit."],
        misconceptionIds: [], sources: ["C2", "K4"], reviewStatus: "draft"
      },
      {
        id: "Q-L12-03", version: 1, objectiveIds: ["L12-O3"], familyId: "F-L12-iop-not-diagnosis", pool: "practice", difficulty: 2,
        stem: "A patient has an applanation pressure within the usual population range. Which statement is correct?",
        options: ["Glaucoma is excluded", "Glaucoma can still be present; disc and field assessment are required", "The cornea must be thin", "Tonometry should be stopped in future"],
        answerIndex: 1,
        explanation: "Glaucoma is diagnosed by optic nerve damage and field loss. It can occur at pressures within the usual range.",
        distractorRationale: ["A normal reading does not exclude glaucoma.", "", "Nothing in the reading establishes corneal thickness.", "Pressure remains an important risk factor to monitor."],
        misconceptionIds: ["M-IOP-AS-GLAUCOMA"], sources: ["K4"], reviewStatus: "draft"
      },
      {
        id: "Q-L12-04", version: 1, objectiveIds: ["L12-O5"], familyId: "F-L12-red-reflex", pool: "practice", difficulty: 2,
        stem: "During a baby check, the left red reflex appears white. What is the most appropriate interpretation?",
        options: ["Retinoblastoma is confirmed", "A white reflex is a finding requiring urgent specialist evaluation; several causes are possible", "This is normal in newborns", "Repeat in a year"],
        answerIndex: 1,
        explanation: "Leukocoria has a differential including congenital cataract and retinoblastoma. It needs urgent evaluation, not a single assumed diagnosis or delay.",
        distractorRationale: ["The finding is concerning but does not confirm one diagnosis.", "", "A white reflex is not a normal finding.", "Delay could harm vision or life."],
        misconceptionIds: ["M-FINDING-AS-CERTAINTY"], sources: ["C1", "C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L12-05", version: 1, objectiveIds: ["L12-O2"], familyId: "F-L12-vanherick", pool: "exam", difficulty: 2,
        stem: "Van Herick assessment suggests a shallow peripheral anterior chamber. What should follow?",
        options: ["Diagnose angle-closure glaucoma", "Gonioscopy to examine the angle directly", "No action, because Van Herick is definitive", "Measure only the central chamber depth"],
        answerIndex: 1,
        explanation: "Van Herick compares peripheral chamber depth with corneal thickness as a screening estimate. The angle configuration is assessed by gonioscopy.",
        distractorRationale: ["A shallow chamber is a risk clue, not a diagnosis of glaucoma.", "", "It is an estimate, not a definitive test.", "Central depth does not show the angle."],
        misconceptionIds: ["M-FINDING-AS-CERTAINTY"], sources: ["K4", "C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L12-06", version: 1, objectiveIds: ["L12-O4"], familyId: "F-L12-illumination-choice", pool: "exam", difficulty: 2,
        stem: "You need to judge how deep within the cornea a small opacity lies. Which slit-lamp setup is most informative?",
        options: ["Wide diffuse illumination", "A narrow beam at an angle (optical section)", "Cobalt blue light without fluorescein", "Retroillumination only"],
        answerIndex: 1,
        explanation: "An optical section shows the cornea in cross-section, so the depth of the opacity within the thickness can be judged.",
        distractorRationale: ["Diffuse light surveys the surface but gives poor depth information.", "", "Cobalt blue is used with fluorescein to show epithelial defects.", "Retroillumination outlines opacities but does not localise depth well."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      }
    ],
    sources: ["K4", "C1", "C2"],
    reviewStatus: "draft"
  },
  {
    id: "L13",
    title: "Conjunctiva and common red eye",
    group: "Anterior segment",
    emphasis: "Conjunctivitis types, subconjunctival hemorrhage, pterygium and important differentials",
    signature: "Contrast similar red-eye presentations",
    prerequisites: ["L08", "L12"],
    studios: ["LAB08", "LAB09", "LAB16"],
    activities: ["T041", "T042", "T047", "T051"],
    estMinutes: 45,
    objectives: [
      { id: "L13-O1", text: "Distinguish viral, bacterial and allergic conjunctivitis using discharge, itch, lymph nodes, conjunctival reaction and laterality." },
      { id: "L13-O2", text: "Identify red-flag features (reduced vision, pain, photophobia, ciliary flush, abnormal pupil, corneal staining or opacity) that point away from simple conjunctivitis." },
      { id: "L13-O3", text: "Describe subconjunctival haemorrhage, pinguecula and pterygium and state when each needs further evaluation." },
      { id: "L13-O4", text: "Recognise presentations of red eye that require same-day ophthalmic assessment, including neonatal conjunctivitis and acute angle closure." }
    ],
    bridge: "L08 taught red-flag history and L12 the slit lamp. The conjunctiva is a thin mucous membrane covering the sclera and lining the lids. Most red eyes are conjunctival and self-limiting; the skill is recognising the minority that threaten sight.",
    essentials: [
      "Conjunctivitis causes diffuse redness, a gritty feeling and discharge, with normal or near-normal vision and normal pupils.",
      "Viral conjunctivitis is typically watery, often starts in one eye and spreads to the other, may have a tender preauricular node and is very contagious.",
      "Bacterial conjunctivitis typically has purulent discharge with lids stuck together in the morning.",
      "Allergic conjunctivitis is typically itchy, bilateral and associated with atopy or seasonal triggers.",
      "Subconjunctival haemorrhage is a painless, sharply demarcated red patch with normal vision; it usually resolves on its own.",
      "Red flags pointing away from simple conjunctivitis: reduced vision, moderate to severe pain, photophobia, redness concentrated around the cornea (ciliary flush), an abnormal pupil, corneal opacity or staining, or a contact lens wearer with pain. These need prompt ophthalmic assessment.",
      "Conjunctivitis in a newborn needs urgent assessment."
    ],
    full: [
      "Mechanism to sign: inflammation dilates conjunctival vessels, most visibly in the fornices and fading toward the cornea. Lymphoid follicles (small pale elevations) suggest viral or chlamydial infection; papillae (vascular cores) suggest allergic or bacterial processes and are best seen on the everted upper lid.",
      "Viral conjunctivitis (commonly adenovirus) can be accompanied by an upper respiratory infection, follicles and preauricular lymphadenopathy. Some cases develop corneal subepithelial infiltrates that reduce vision. Hygiene to limit spread is a key part of advice.",
      "Bacterial conjunctivitis produces mucopurulent discharge. Hyperacute, copious purulent discharge with marked swelling raises concern for gonococcal infection, which can perforate the cornea and needs urgent treatment. Chronic follicular conjunctivitis in a sexually active adult raises the possibility of chlamydial infection.",
      "Allergic conjunctivitis is driven by mast-cell-mediated hypersensitivity: itching is the hallmark, with watery discharge, lid swelling and papillae. Severe forms in children (vernal keratoconjunctivitis) can involve the cornea.",
      "Important differentials: keratitis (pain, photophobia, staining or infiltrate), anterior uveitis (photophobia, ciliary flush, cells in the anterior chamber, small pupil), acute angle closure (severe pain, haloes, nausea, hazy cornea, mid-dilated poorly reactive pupil, high pressure), scleritis (deep boring pain, tenderness) and endophthalmitis after surgery. Each needs urgent assessment.",
      "Subconjunctival haemorrhage results from a ruptured conjunctival vessel, often after coughing or straining, or with anticoagulation or hypertension. If recurrent, consider blood pressure and bleeding tendency. After trauma, consider associated injury, especially if the posterior edge cannot be seen.",
      "Pinguecula is a yellowish degenerative conjunctival lesion at the limbus that does not cross onto the cornea; pterygium is a fibrovascular growth that extends onto the cornea and can induce astigmatism or threaten the visual axis. Both are associated with ultraviolet exposure.",
      "Documentation: laterality, discharge type, distribution of redness, follicles or papillae, corneal staining, pupil and acuity, and whether red flags were present or absent."
    ],
    deeper: [
      "Ophthalmia neonatorum can be caused by chlamydia, gonococcus, other bacteria, herpes simplex or chemical irritation; the timing and severity help, but microbiological testing guides management.",
      "Conjunctival lesions that are elevated, pigmented, vascularised or growing should be assessed for neoplasia, such as ocular surface squamous neoplasia or conjunctival melanoma (L32)."
    ],
    misconceptions: [
      "Mistake: any red eye with discharge is conjunctivitis. Correction: check vision, pain, photophobia, pupil and cornea; red flags indicate other diagnoses.",
      "Mistake: a subconjunctival haemorrhage needs urgent treatment. Correction: an isolated spontaneous one is usually benign; consider recurrence, trauma and blood pressure.",
      "Mistake: pinguecula and pterygium are the same. Correction: a pterygium grows onto the cornea; a pinguecula stays on the conjunctiva."
    ],
    entryChallenge: {
      prompt: "Name three findings that would make you doubt a diagnosis of simple conjunctivitis in a red eye.",
      answer: "Any three of: reduced vision, significant pain, photophobia, ciliary flush, abnormal pupil, corneal staining or opacity, raised pressure, contact lens wear with pain."
    },
    contrast: {
      a: "Viral conjunctivitis: watery discharge, follicles, tender preauricular node, normal vision.",
      b: "Anterior uveitis: photophobia, ciliary flush, cells in the anterior chamber, possibly reduced vision and small pupil.",
      discriminator: "Photophobia with circumcorneal redness and anterior chamber cells versus diffuse conjunctival redness with discharge."
    },
    workedExample: {
      problem: "A 22-year-old has a watery red right eye for two days; today the left eye is also red. Vision is normal, pupils normal, cornea clear, and a tender node is felt in front of the right ear. Formulate an assessment.",
      steps: [
        "Characterise: bilateral sequential, watery, normal vision — no red flags.",
        "Signs: follicles on the lower lid and a preauricular node support viral conjunctivitis.",
        "Exclude red flags: cornea clear without staining, pupils normal, no photophobia.",
        "Assessment: likely viral conjunctivitis; differential includes other infective causes.",
        "Plan principle: supportive care and hygiene advice, with safety-net advice to return if vision drops, pain increases or photophobia develops."
      ]
    },
    transfer: {
      prompt: "Compare two short case summaries in a table: (A) 68-year-old, painful red eye, haloes, vomiting, hazy cornea, mid-dilated pupil; (B) 25-year-old, itchy watery eyes every spring. For each give the likely category and urgency.",
      modelAnswer: "A: suspected acute angle closure — a sight-threatening emergency requiring immediate ophthalmic care. B: allergic (seasonal) conjunctivitis — routine management. The discriminators are pain, vision, cornea, pupil and pressure."
    },
    items: [
      {
        id: "Q-L13-01", version: 1, objectiveIds: ["L13-O1"], familyId: "F-L13-conjunctivitis-type", pool: "practice", difficulty: 1,
        stem: "A patient has watery discharge, follicles on the lower lid and a tender preauricular lymph node. Which cause is most likely?",
        options: ["Allergic conjunctivitis", "Viral conjunctivitis", "Bacterial conjunctivitis", "Episcleritis"],
        answerIndex: 1,
        explanation: "Watery discharge with follicles and preauricular lymphadenopathy is characteristic of viral (commonly adenoviral) conjunctivitis.",
        distractorRationale: ["Allergy is dominated by itch and papillae.", "", "Bacterial conjunctivitis usually has purulent discharge.", "Episcleritis is localised redness without discharge."],
        misconceptionIds: [], sources: ["C1", "C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L13-02", version: 1, objectiveIds: ["L13-O3"], familyId: "F-L13-subconj", pool: "practice", difficulty: 1,
        stem: "A well patient on no medication notices a painless, sharply demarcated red patch on the white of one eye after coughing. Vision is normal. What is the best approach?",
        options: ["Emergency referral for possible open globe", "Reassure; it usually resolves; consider blood pressure and review if recurrent or after trauma", "Start antibiotic drops", "Measure pressure urgently"],
        answerIndex: 1,
        explanation: "This is a typical spontaneous subconjunctival haemorrhage. Recurrence, trauma or bleeding tendency changes the assessment.",
        distractorRationale: ["There is no trauma history or sign of globe injury.", "", "There is no infection.", "Pressure assessment is not indicated urgently for this presentation."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L13-03", version: 1, objectiveIds: ["L13-O3"], familyId: "F-L13-pterygium", pool: "practice", difficulty: 1,
        stem: "Which feature distinguishes a pterygium from a pinguecula?",
        options: ["Location at the limbus", "Extension onto the cornea", "Association with sunlight", "Yellowish colour"],
        answerIndex: 1,
        explanation: "Both are limbal and associated with ultraviolet exposure, but a pterygium is fibrovascular tissue that grows onto the cornea.",
        distractorRationale: ["Both lie at the limbus.", "", "Both are associated with UV exposure.", "A yellowish colour is more typical of pinguecula."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L13-04", version: 1, objectiveIds: ["L13-O2"], familyId: "F-L13-red-flags", pool: "practice", difficulty: 2,
        stem: "Which combination most strongly suggests a cause other than conjunctivitis?",
        options: ["Itch and watery discharge in both eyes", "Photophobia, redness concentrated around the cornea and reduced vision", "Morning crusting and purulent discharge", "Gritty sensation with normal acuity"],
        answerIndex: 1,
        explanation: "Photophobia, ciliary flush and reduced vision suggest keratitis, uveitis or angle closure and need prompt ophthalmic assessment.",
        distractorRationale: ["Typical of allergic conjunctivitis.", "", "Typical of bacterial conjunctivitis.", "Consistent with simple conjunctivitis or dry eye."],
        misconceptionIds: [], sources: ["C1", "C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L13-05", version: 1, objectiveIds: ["L13-O4"], familyId: "F-L13-neonatal", pool: "exam", difficulty: 2,
        stem: "A 4-day-old baby has copious purulent discharge and swollen lids. What is the appropriate response?",
        options: ["Reassure; sticky eyes are normal in newborns", "Urgent same-day assessment with microbiological testing, because some causes can damage the cornea quickly", "Lacrimal massage only", "Routine review in a month"],
        answerIndex: 1,
        explanation: "Neonatal conjunctivitis needs urgent evaluation; causes such as gonococcal infection can rapidly threaten the cornea and some infections have systemic implications.",
        distractorRationale: ["Copious purulent discharge in a newborn is not normal.", "", "Massage is for congenital duct obstruction, which typically gives watering with mild discharge rather than this picture.", "Delay risks corneal damage."],
        misconceptionIds: [], sources: ["C1", "C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L13-06", version: 1, objectiveIds: ["L13-O4", "L13-O2"], familyId: "F-L13-angle-closure-mimic", pool: "exam", difficulty: 3,
        stem: "A 70-year-old long-sighted woman presents in the evening with a painful red eye, coloured haloes, nausea and blurred vision. The cornea is hazy and the pupil mid-dilated and poorly reactive. What is the priority?",
        options: ["Treat as conjunctivitis", "Treat as a sight-threatening emergency (suspected acute angle closure) requiring immediate ophthalmic care", "Arrange routine glasses review", "Advise dilating drops for a better view"],
        answerIndex: 1,
        explanation: "The combination of pain, haloes, corneal haze, mid-dilated pupil and systemic upset in a hyperopic older person suggests acute angle closure — an emergency.",
        distractorRationale: ["Conjunctivitis does not cause a hazy cornea, fixed pupil or severe pain with haloes.", "", "This is not a refractive problem.", "Dilation can worsen angle closure."],
        misconceptionIds: [], sources: ["C1", "C2"], reviewStatus: "draft"
      }
    ],
    sources: ["C1", "C2"],
    reviewStatus: "draft"
  },
  {
    id: "L14",
    title: "Eyelids and lacrimal system",
    group: "Anterior segment",
    emphasis: "Blepharitis, chalazion/hordeolum, lid malposition, ptosis and lacrimal obstruction/infection",
    signature: "Match anatomy, findings and appropriate next evaluation",
    prerequisites: ["L01", "L12"],
    studios: ["LAB09", "LAB15"],
    activities: ["T049", "T051", "T053", "T054", "T079"],
    estMinutes: 45,
    objectives: [
      { id: "L14-O1", text: "Distinguish chalazion from hordeolum by mechanism, pain and time course, and identify features prompting biopsy." },
      { id: "L14-O2", text: "Explain the consequences of entropion and ectropion for the cornea and tear drainage." },
      { id: "L14-O3", text: "Classify ptosis by mechanism (aponeurotic, myogenic, neurogenic, mechanical) and use pupil and motility findings to identify urgent neurogenic causes." },
      { id: "L14-O4", text: "Localise tear drainage obstruction or infection along the punctum–canaliculus–sac–duct pathway." }
    ],
    bridge: "From L01: the lid has anterior (skin, muscle) and posterior (tarsus, conjunctiva) lamellae; meibomian glands in the tarsus supply the tear lipid layer; tears drain from puncta to the nose. Disorders map neatly onto these parts.",
    essentials: [
      "Blepharitis is chronic lid-margin inflammation. Anterior blepharitis involves the lash base; posterior blepharitis involves meibomian gland dysfunction and contributes to evaporative dry eye.",
      "A chalazion is a painless, firm lump from a blocked meibomian gland with granulomatous inflammation. A hordeolum (stye) is an acute, painful infection of a lid gland.",
      "A recurrent lump at the same site, or chronic one-sided lid inflammation with lash loss, in an adult should prompt consideration of biopsy to exclude malignancy such as sebaceous carcinoma.",
      "Entropion turns the lid margin inward so lashes rub the cornea; ectropion turns it outward, exposing the conjunctiva and moving the punctum away from the tear lake, causing watering.",
      "Ptosis is a drooping upper lid. Most adult ptosis is aponeurotic (age-related stretching) with good levator function. Ptosis with a large pupil or eye-movement problem suggests a third nerve palsy; ptosis with a small pupil suggests Horner syndrome; variable fatigable ptosis suggests myasthenia.",
      "Tears drain through the punctum, canaliculus, lacrimal sac and nasolacrimal duct into the nose. Congenital nasolacrimal duct obstruction is common in infants; acute dacryocystitis is a painful swelling at the medial canthus over the lacrimal sac."
    ],
    full: [
      "Gland anatomy explains lesions: meibomian glands lie in the tarsal plate and open at the posterior lid margin; glands of Zeis and Moll are associated with lash follicles. An external hordeolum arises at a lash follicle or associated gland; an internal hordeolum arises in a meibomian gland. A chalazion is a sterile lipogranuloma when meibomian secretion is trapped; it may follow a hordeolum.",
      "Lid malposition: involutional entropion and ectropion result from horizontal lid laxity and changes in lid retractors with age. Cicatricial causes (scarring from trachoma, chemical injury or mucous membrane disease) also occur. Entropion and trichiasis cause corneal abrasion and risk of ulceration; ectropion causes exposure, chronic redness and epiphora.",
      "Ptosis assessment uses measurements in a declared scene: lid position relative to the corneal light reflex, levator function (excursion of the lid from downgaze to upgaze with the brow fixed) and lid crease. Aponeurotic ptosis has good levator function and often a high crease; myogenic and congenital ptosis have poor levator function. Pupils and eye movements are always checked, because neurogenic causes may be urgent.",
      "Neurogenic ptosis: a third nerve palsy causes marked ptosis with the eye down and out and, if the pupil is involved, a large pupil — a pupil-involving third nerve palsy needs emergency imaging for a compressive lesion. Horner syndrome gives mild ptosis with miosis; acute painful Horner can signal carotid dissection. Myasthenia gives fatigable, variable ptosis and diplopia with normal pupils.",
      "Watering eye: decide whether the problem is overproduction (reflex tearing from surface irritation, entropion, dry eye) or reduced drainage (punctal stenosis, ectropion, canalicular or nasolacrimal duct obstruction). Dye disappearance and supervised lacrimal irrigation help localise drainage problems; these are interpretation activities in IRIS, not procedures for students to practise.",
      "Infection: acute dacryocystitis presents as a tender red swelling below the medial canthal tendon over the sac, often with a background of duct obstruction; it can progress to cellulitis and needs prompt treatment. Canaliculitis causes a pouting punctum with discharge. In infants, congenital duct obstruction usually improves with time; persistent cases are assessed by a specialist.",
      "Documentation: lid position and measurements with method, levator function, pupil and motility findings in ptosis, lesion size and site, and the lacrimal findings with the test used."
    ],
    deeper: [
      "Lid tumours: basal cell carcinoma is the most common malignant eyelid tumour, often on the lower lid; loss of lashes, ulceration, pearly rolled edges and distortion of the lid margin are warning features (L32).",
      "Floppy eyelid syndrome, associated with obstructive sleep apnoea, can cause chronic papillary conjunctivitis from easy lid eversion during sleep."
    ],
    misconceptions: [
      "Mistake: a chalazion is an infection. Correction: it is a sterile granulomatous reaction to trapped meibomian secretion; a hordeolum is the acute infection.",
      "Mistake: all ptosis is age-related. Correction: check pupils, motility and fatigability; neurogenic causes can be urgent.",
      "Mistake: a watering eye always means blocked tear ducts. Correction: surface irritation can cause reflex overproduction; assess both production and drainage."
    ],
    entryChallenge: {
      prompt: "An eyelid lump has been present for six weeks and is painless and firm. Which lid gland is likely involved and what is the lesion called?",
      answer: "A meibomian gland in the tarsal plate; a chalazion."
    },
    contrast: {
      a: "Aponeurotic ptosis: good levator function, normal pupils and motility, gradual onset.",
      b: "Third nerve palsy ptosis: marked ptosis, eye down and out, possibly a large pupil; can be urgent.",
      discriminator: "Pupil size and eye movements, and levator function."
    },
    workedExample: {
      problem: "A 70-year-old has a watery right eye. The lower lid is turned outward and the punctum is not in contact with the eye. Explain the watering and the next evaluation.",
      steps: [
        "Recognise ectropion: the lid margin is everted.",
        "The punctum is displaced from the tear lake, so tears cannot enter the drainage system — reduced drainage.",
        "Exposure of the conjunctiva can also cause irritation and reflex tearing.",
        "Assess lid laxity, the cornea for exposure, and whether drainage is otherwise patent.",
        "Document the malposition and arrange oculoplastic assessment per local pathway."
      ]
    },
    transfer: {
      prompt: "A diagram shows the lacrimal drainage path with four marked points: punctum, canaliculus, lacrimal sac, nasolacrimal duct. A patient has a tender swelling below the medial canthal tendon and pus expressed from the punctum on pressure. Which point is the site of infection and why?",
      modelAnswer: "The lacrimal sac — acute dacryocystitis, typically behind a nasolacrimal duct obstruction. The location below the medial canthal tendon matches the sac, and pressure over it refluxes material through the canaliculi to the punctum."
    },
    items: [
      {
        id: "Q-L14-01", version: 1, objectiveIds: ["L14-O1"], familyId: "F-L14-chalazion-hordeolum", pool: "practice", difficulty: 1,
        stem: "A patient has an acutely painful, red, swollen spot at the base of an eyelash. What is it most likely to be?",
        options: ["Chalazion", "External hordeolum", "Basal cell carcinoma", "Pinguecula"],
        answerIndex: 1,
        explanation: "An acute painful infection at a lash follicle or its associated glands is an external hordeolum (stye).",
        distractorRationale: ["A chalazion is usually painless and chronic.", "", "Basal cell carcinoma is slowly growing and usually not acutely painful.", "A pinguecula is a conjunctival lesion."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L14-02", version: 1, objectiveIds: ["L14-O1"], familyId: "F-L14-biopsy-trigger", pool: "practice", difficulty: 2,
        stem: "A 72-year-old has had three 'chalazia' removed from the same upper lid site, with persistent lid thickening and lash loss. What should be considered?",
        options: ["Repeat warm compresses only", "Biopsy to exclude a malignancy such as sebaceous carcinoma", "No action; recurrence is normal", "Lacrimal irrigation"],
        answerIndex: 1,
        explanation: "Recurrent lesions at one site, lash loss and chronic one-sided inflammation in an older adult are warning features. Histology is needed.",
        distractorRationale: ["Conservative measures do not address the possibility of malignancy.", "", "Recurrence at the same site is a warning sign, not reassurance.", "Lacrimal irrigation assesses drainage, not lid lesions."],
        misconceptionIds: ["M-FINDING-AS-CERTAINTY"], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L14-03", version: 1, objectiveIds: ["L14-O3"], familyId: "F-L14-ptosis-pupil", pool: "practice", difficulty: 2,
        stem: "A patient has new right ptosis, the right eye rests down and out, and the right pupil is larger and poorly reactive. What is the priority?",
        options: ["Routine oculoplastic referral", "Emergency assessment for a pupil-involving third nerve palsy, including urgent neuroimaging per local protocol", "Ice-pack test only", "Reassure; this is age-related ptosis"],
        answerIndex: 1,
        explanation: "A pupil-involving third nerve palsy can be caused by a compressive lesion such as an aneurysm and needs emergency assessment.",
        distractorRationale: ["The neurological signs make this urgent, not routine.", "", "Myasthenia does not involve the pupil.", "Aponeurotic ptosis does not affect pupil or motility."],
        misconceptionIds: ["M-AFFERENT-VS-EFFERENT"], sources: ["C1", "C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L14-04", version: 1, objectiveIds: ["L14-O2"], familyId: "F-L14-malposition", pool: "practice", difficulty: 1,
        stem: "Which lid malposition causes lashes to rub against the cornea?",
        options: ["Ectropion", "Entropion", "Lid retraction", "Ptosis"],
        answerIndex: 1,
        explanation: "Entropion turns the lid margin inward so lashes contact the cornea, causing irritation and abrasion.",
        distractorRationale: ["Ectropion turns the lid outward, causing exposure and watering.", "", "Lid retraction exposes more of the eye but does not turn lashes inward.", "Ptosis is drooping of the upper lid, not inward rotation."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L14-05", version: 1, objectiveIds: ["L14-O4"], familyId: "F-L14-lacrimal-localise", pool: "exam", difficulty: 2,
        stem: "An adult has a tender, red swelling just below the medial canthal tendon with a history of a watery eye. Where is the problem?",
        options: ["Lacrimal gland", "Lacrimal sac", "Meibomian gland", "Superior punctum only"],
        answerIndex: 1,
        explanation: "The lacrimal sac lies below the medial canthal tendon. Acute dacryocystitis usually develops behind a nasolacrimal duct obstruction.",
        distractorRationale: ["The lacrimal gland lies superotemporally.", "", "Meibomian glands are in the tarsal plates.", "Isolated punctal problems do not give swelling below the medial canthal tendon."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L14-06", version: 1, objectiveIds: ["L14-O3"], familyId: "F-L14-levator-function", pool: "exam", difficulty: 3,
        stem: "A 75-year-old contact lens wearer has gradually drooping upper lids with a high lid crease, good levator excursion, normal pupils and full eye movements. Which mechanism fits best?",
        options: ["Myogenic congenital ptosis", "Aponeurotic (involutional) ptosis", "Horner syndrome", "Third nerve palsy"],
        answerIndex: 1,
        explanation: "Disinsertion or stretching of the levator aponeurosis gives ptosis with a high crease and preserved levator function; long-term contact lens wear is a recognised association.",
        distractorRationale: ["Congenital myogenic ptosis has poor levator function and is present from early life.", "", "Horner syndrome would include miosis.", "Third nerve palsy would affect motility and possibly the pupil."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      }
    ],
    sources: ["C1", "C2"],
    reviewStatus: "draft"
  },
  {
    id: "L15",
    title: "Cornea and ocular surface",
    group: "Anterior segment",
    emphasis: "Dry eye, epithelial defects, microbial/herpetic keratitis, contact-lens risk and keratoconus",
    signature: "Interpret fluorescein patterns and corneal findings",
    prerequisites: ["L12", "L13"],
    studios: ["LAB09", "LAB13"],
    activities: ["T047", "T048", "T049", "T050", "T052", "T072", "T073", "T086"],
    estMinutes: 50,
    objectives: [
      { id: "L15-O1", text: "Interpret fluorescein staining patterns (abrasion, linear vertical scratches, punctate staining, dendrite) and propose a differential rather than a single forced diagnosis." },
      { id: "L15-O2", text: "Recognise microbial keratitis in a contact lens wearer as a same-day emergency and explain why." },
      { id: "L15-O3", text: "Explain why topical corticosteroids should not be started for a suspected herpetic epithelial keratitis outside specialist care." },
      { id: "L15-O4", text: "Relate the tear film layers to types of dry eye and to available tests." },
      { id: "L15-O5", text: "Describe how keratoconus alters corneal shape and refraction and which investigation characterises it." }
    ],
    bridge: "L12 introduced the slit lamp and cobalt blue light; L02 the tear film and endothelial pump. The cornea is avascular, transparent and densely innervated, so surface disease is painful and threatens vision when it scars or becomes infected.",
    essentials: [
      "Fluorescein stains areas where the epithelium is missing or disrupted and glows green under cobalt blue light.",
      "A corneal abrasion is a sharply defined staining area after trauma. Several fine vertical linear scratches suggest a foreign body under the upper lid, which is found by everting the lid (unless an open globe is suspected).",
      "A branching (dendritic) staining pattern with terminal bulbs suggests herpes simplex keratitis. Steroid drops can worsen epithelial herpetic disease and should not be started without specialist assessment.",
      "A contact lens wearer with a painful red eye and a white corneal infiltrate may have microbial keratitis. This is an emergency that needs same-day ophthalmic assessment.",
      "Dry eye can result from reduced tear production (aqueous deficiency) or excessive evaporation (often meibomian gland dysfunction). Punctate staining, reduced tear break-up time and symptoms help characterise it.",
      "Keratoconus is progressive thinning and steepening of the cornea, causing irregular astigmatism. Corneal topography or tomography characterises it; early disease can be missed by refraction alone."
    ],
    full: [
      "Mechanism: the corneal epithelium is a barrier; when breached, pain arises from exposed nerve endings and microbes can invade the stroma. Because the cornea has no blood vessels, inflammatory cells arrive via the tears and limbus, and infection can progress rapidly. A white stromal infiltrate with an overlying epithelial defect is the typical sign of a corneal ulcer.",
      "Contact lens risk: overnight wear, poor hygiene and water exposure (swimming, rinsing lenses with tap water) increase risk of bacterial keratitis and of Acanthamoeba keratitis. Microbial keratitis requires urgent assessment, often with corneal scrapes for microbiology selected by a specialist; patching is generally avoided in contact-lens-related abrasions because of infection risk.",
      "Herpes simplex keratitis: epithelial disease forms dendrites; stromal and endothelial forms involve immune-mediated inflammation and scarring. Reduced corneal sensation is a clue. Steroids can make active epithelial viral disease worse and must only be used under specialist supervision, sometimes alongside antivirals for stromal forms.",
      "Abrasion and foreign body: history of injury, pain, photophobia and watering; fluorescein shows the defect. Linear vertical scratches suggest a subtarsal foreign body. A high-velocity injury (hammering metal on metal, grinding) raises concern for intraocular foreign body and changes management toward imaging and avoiding pressure (L28).",
      "Dry eye: the lipid layer (meibomian), aqueous layer (lacrimal) and mucin layer (goblet cells) each contribute. Inferior punctate staining suggests exposure or lid problems; interpalpebral staining is typical of dry eye. Schirmer testing and tear break-up time help, but their protocols (anaesthetic or not) must be stated. Systemic associations include autoimmune disease such as Sjögren syndrome.",
      "Keratoconus: thinning usually begins inferiorly or centrally, producing a cone that increases myopia and irregular astigmatism. Clues include changing prescriptions, scissoring retinoscopy reflex and poor spectacle-corrected acuity. Topography/tomography maps curvature and thickness; total refractive cylinder alone does not establish the diagnosis. Corneal cross-linking aims to halt progression; specialised contact lenses improve vision.",
      "Seidel test: concentrated fluorescein over a suspected wound shows a stream of dilution if aqueous is leaking. A positive test supports a full-thickness wound; a negative test does not exclude one, because a self-sealed wound may not leak.",
      "Documentation: draw the staining pattern with size and location, note infiltrate size and depth, anterior chamber reaction, corneal sensation and contact lens history."
    ],
    deeper: [
      "Neurotrophic keratopathy follows loss of corneal sensation (for example after herpetic disease or trigeminal damage); epithelial defects heal poorly despite little pain.",
      "Corneal endothelial dysfunction (such as Fuchs dystrophy) causes stromal oedema with blurred vision often worse on waking; endothelial keratoplasty replaces the dysfunctional layer (L34)."
    ],
    misconceptions: [
      "Mistake: a staining pattern identifies the cause by itself. Correction: patterns guide a differential; history and other signs are needed.",
      "Mistake: steroid drops help any inflamed cornea. Correction: steroids can worsen epithelial herpetic and some microbial infections; use only under specialist care.",
      "Mistake: a negative Seidel test rules out a penetrating injury. Correction: a self-sealing wound may not leak; the history and other signs still matter.",
      "Mistake: a high cylinder on refraction diagnoses keratoconus. Correction: corneal imaging characterises corneal shape; refractive cylinder alone is insufficient."
    ],
    entryChallenge: {
      prompt: "Fluorescein shows several fine vertical lines on the upper cornea after a gust of wind. What should you look for next?",
      answer: "A foreign body under the upper lid, found by everting the lid (if there is no suspicion of open globe)."
    },
    contrast: {
      a: "Corneal abrasion: sharp-edged epithelial defect, clear stroma, history of trauma.",
      b: "Microbial keratitis: epithelial defect over a white stromal infiltrate, often with contact lens wear and anterior chamber reaction.",
      discriminator: "A stromal infiltrate and context (contact lens wear) separate infection from simple abrasion."
    },
    workedExample: {
      problem: "A 35-year-old with a history of cold sores has a red, watering left eye and a branching stain with terminal bulbs. A colleague suggests steroid drops for the inflammation. How do you respond?",
      steps: [
        "Recognise the dendritic pattern as suggestive of herpes simplex epithelial keratitis.",
        "Check corneal sensation, which may be reduced.",
        "Explain that steroids can worsen active epithelial herpetic disease.",
        "Arrange prompt ophthalmic assessment for antiviral management per local protocol.",
        "Document the pattern with a drawing, sensation, acuity and the advice given."
      ]
    },
    transfer: {
      prompt: "Two corneal topography descriptions are given: (A) symmetric bow-tie pattern of steepening along one meridian; (B) inferior localised steepening with corresponding thinning. Which is more consistent with keratoconus and what else would you correlate?",
      modelAnswer: "B is more consistent with keratoconus (localised inferior steepening and thinning, irregular astigmatism). A suggests regular astigmatism. Correlate with tomography/pachymetry, progression over time and slit-lamp signs; refractive cylinder alone does not diagnose keratoconus."
    },
    items: [
      {
        id: "Q-L15-01", version: 1, objectiveIds: ["L15-O3", "L15-O1"], familyId: "F-L15-dendrite", pool: "practice", difficulty: 2,
        stem: "Fluorescein shows a branching epithelial lesion with terminal bulbs. Which action should be avoided outside specialist care?",
        options: ["Recording visual acuity", "Testing corneal sensation", "Starting topical corticosteroid drops", "Arranging prompt ophthalmic review"],
        answerIndex: 2,
        explanation: "The pattern suggests herpes simplex epithelial keratitis. Steroids can worsen active epithelial viral disease.",
        distractorRationale: ["Acuity should always be recorded.", "Reduced sensation supports a herpetic cause and is useful to test.", "", "Prompt review is appropriate."],
        misconceptionIds: ["M-FINDING-AS-CERTAINTY"], sources: ["C1", "C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L15-02", version: 1, objectiveIds: ["L15-O2"], familyId: "F-L15-cl-keratitis", pool: "practice", difficulty: 2,
        stem: "A contact lens wearer who sleeps in lenses has a painful red eye and a white spot on the cornea with overlying staining. What is the appropriate urgency?",
        options: ["Routine optometry review next month", "Same-day ophthalmic assessment for suspected microbial keratitis", "Patch the eye and review in a week", "Change lens brand"],
        answerIndex: 1,
        explanation: "A stromal infiltrate with an epithelial defect in a contact lens wearer suggests microbial keratitis, which can progress rapidly and needs same-day assessment.",
        distractorRationale: ["Delay risks corneal perforation and scarring.", "", "Patching is generally avoided in contact-lens-related corneal disease and delays care.", "This does not address a possible infection."],
        misconceptionIds: [], sources: ["C1", "C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L15-03", version: 1, objectiveIds: ["L15-O1"], familyId: "F-L15-subtarsal-fb", pool: "practice", difficulty: 1,
        stem: "Several fine vertical linear staining marks are seen on the upper cornea. What is the most useful next step (with no suspicion of open globe)?",
        options: ["Evert the upper lid to look for a foreign body", "Measure intraocular pressure", "Start oral antibiotics", "Order MRI"],
        answerIndex: 0,
        explanation: "Vertical linear scratches are typical of a foreign body under the upper lid scratching the cornea with each blink. Lid eversion reveals it.",
        distractorRationale: ["", "Pressure measurement does not address the cause.", "There is no indication for systemic antibiotics.", "MRI is not indicated and is unsafe if a metallic foreign body is possible."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L15-04", version: 1, objectiveIds: ["L15-O5"], familyId: "F-L15-keratoconus", pool: "practice", difficulty: 2,
        stem: "A 19-year-old has rapidly changing prescriptions, increasing astigmatism and a scissoring retinoscopy reflex. Which investigation best characterises the cornea?",
        options: ["Corneal topography/tomography", "Fluorescein angiography", "Visual evoked potential", "Gonioscopy"],
        answerIndex: 0,
        explanation: "Topography and tomography map corneal curvature and thickness and are used to characterise suspected keratoconus.",
        distractorRationale: ["", "Angiography images retinal and choroidal circulation.", "VEPs assess the visual pathway.", "Gonioscopy examines the angle."],
        misconceptionIds: ["M-FINDING-AS-CERTAINTY"], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L15-05", version: 1, objectiveIds: ["L15-O4"], familyId: "F-L15-tear-film", pool: "exam", difficulty: 2,
        stem: "A patient has dry-eye symptoms, a rapid tear break-up and thickened, capped meibomian gland openings. Which mechanism is most likely dominant?",
        options: ["Aqueous deficiency from lacrimal gland failure", "Evaporative dry eye from meibomian gland dysfunction", "Mucin excess", "Endothelial pump failure"],
        answerIndex: 1,
        explanation: "Meibomian gland dysfunction reduces the lipid layer, so the tear film evaporates and breaks up quickly.",
        distractorRationale: ["Aqueous deficiency is possible but the gland findings point to evaporation.", "", "Mucin excess is not a recognised cause of this picture.", "Endothelial failure causes stromal oedema, not tear film instability."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L15-06", version: 1, objectiveIds: ["L15-O1"], familyId: "F-L15-seidel", pool: "exam", difficulty: 3,
        stem: "After a sharp injury, a corneal laceration is suspected but the Seidel test is negative. What is the correct interpretation?",
        options: ["A full-thickness injury is excluded", "No leak was seen; a self-sealed full-thickness wound is still possible, so open-globe precautions continue if suspicion remains", "Tonometry can now be performed safely", "The eye can be patched and reviewed routinely"],
        answerIndex: 1,
        explanation: "A positive Seidel supports a leaking wound, but a negative result does not exclude penetration. Clinical suspicion determines precautions.",
        distractorRationale: ["A negative test does not exclude penetration.", "", "Pressure on a possibly open globe should still be avoided.", "Suspected penetrating injury needs urgent assessment."],
        misconceptionIds: ["M-FINDING-AS-CERTAINTY"], sources: ["K5"], reviewStatus: "draft"
      }
    ],
    sources: ["C1", "C2", "K5"],
    reviewStatus: "draft"
  },
  {
    id: "L16",
    title: "Episclera and sclera",
    group: "Anterior segment",
    emphasis: "Episcleritis/scleritis mechanisms, distinguishing features and systemic associations",
    signature: "Compare cases using pain, examination and context",
    prerequisites: ["L13"],
    studios: ["LAB08", "LAB13"],
    activities: ["T041", "T042", "T075"],
    estMinutes: 35,
    objectives: [
      { id: "L16-O1", text: "Distinguish episcleritis from scleritis by pain, tenderness, colour, vessel depth and response to a topical vasoconstrictor." },
      { id: "L16-O2", text: "Explain why scleritis requires urgent ophthalmic assessment and a search for systemic disease." },
      { id: "L16-O3", text: "Recognise that posterior scleritis can present with pain and a white or minimally red eye, and name the imaging that can support it." }
    ],
    bridge: "From L01, the sclera is the tough outer coat and the episclera is the thin vascular layer between sclera and conjunctiva. From L13, diffuse conjunctival redness with discharge suggests conjunctivitis. Sectoral redness without discharge points you here.",
    essentials: [
      "Episcleritis is inflammation of the episclera. It causes sectoral or diffuse redness with mild discomfort, normal vision and no discharge, and is often self-limiting.",
      "Scleritis is inflammation of the sclera. It causes severe, deep, boring pain that may wake the patient, tenderness of the globe and a dusky or violaceous redness.",
      "Superficial episcleral vessels blanch with a topical vasoconstrictor; deep scleral vessels do not. The test is a clue, not a diagnosis.",
      "A substantial proportion of scleritis cases are associated with a systemic disease such as rheumatoid arthritis or vasculitis. Scleritis needs urgent ophthalmic assessment and systemic evaluation.",
      "Necrotising scleritis can thin the sclera; posterior scleritis can cause pain with little visible redness."
    ],
    full: [
      "Mechanism: in episcleritis, inflammation is confined to the loose vascular tissue just under the conjunctiva, so it is mobile over the sclera and the pain is mild. In scleritis, immune-mediated inflammation (often vasculitic) involves the dense sclera itself, where swelling and vascular injury cause severe pain and can progress to tissue necrosis.",
      "Presentation and signs: episcleritis typically affects young adults, with a red patch and normal acuity. Scleritis typically presents with pain radiating to the brow or jaw, tenderness, redness that looks deeper and bluish, and in some cases reduced vision from associated keratitis, uveitis or posterior involvement.",
      "Examination: in daylight, the colour of scleritis is often more violaceous. At the slit lamp, episcleral vessels are superficial and move with a cotton bud; scleral vessels are deep and fixed. A topical vasoconstrictor blanches the superficial plexus; persistent redness suggests deeper inflammation.",
      "Systemic associations: rheumatoid arthritis, granulomatosis with polyangiitis and other vasculitides, inflammatory bowel disease and infections (for example herpes zoster or syphilis) can be associated. Scleritis may be the first sign of systemic vasculitis, so history and systemic review are essential and investigation is guided by the specialist.",
      "Posterior scleritis can cause pain, reduced vision, choroidal folds or exudative retinal detachment with a white or mildly red eye. B-scan ultrasound may show thickening of the posterior sclera with fluid in the space around the optic nerve.",
      "Urgency and management principles: episcleritis is usually managed conservatively, with treatment if symptomatic. Scleritis generally needs systemic anti-inflammatory or immunosuppressive treatment under specialist care; topical treatment alone is not sufficient for most scleritis.",
      "Documentation: location (sector or diffuse), pain severity, tenderness, colour, blanching response, acuity, anterior chamber findings and systemic symptoms."
    ],
    deeper: [
      "Scleromalacia perforans is a form of necrotising scleritis with little inflammation, typically in long-standing rheumatoid arthritis; the thinned sclera shows the dark uvea beneath.",
      "Nodular episcleritis forms a mobile nodule; nodular scleritis forms a fixed, tender nodule."
    ],
    misconceptions: [
      "Mistake: episcleritis and scleritis differ only in severity. Correction: they involve different tissues with different systemic implications and urgency.",
      "Mistake: a white eye excludes scleritis. Correction: posterior scleritis can present with pain and little anterior redness.",
      "Mistake: blanching proves episcleritis. Correction: blanching supports superficial inflammation but the whole clinical picture decides."
    ],
    entryChallenge: {
      prompt: "Which symptom best separates scleritis from episcleritis at the bedside?",
      answer: "Severe, deep, boring pain (often waking the patient) with tenderness, which favours scleritis."
    },
    contrast: {
      a: "Episcleritis: mild discomfort, bright red sectoral redness, mobile vessels, blanches with vasoconstrictor.",
      b: "Scleritis: severe pain, tender globe, violaceous redness, deep fixed vessels, little blanching.",
      discriminator: "Pain and tenderness, and vessel depth on examination."
    },
    workedExample: {
      problem: "A 60-year-old with rheumatoid arthritis has severe right eye pain that wakes her at night and a dusky red area nasally. Assess.",
      steps: [
        "Severe night pain and dusky colour suggest scleritis rather than episcleritis.",
        "Examine for tenderness, deep vessel involvement and scleral thinning.",
        "Check acuity, cornea and anterior chamber for associated keratitis or uveitis.",
        "Relate to systemic disease: rheumatoid arthritis is a known association; scleritis may indicate active systemic disease.",
        "Arrange urgent ophthalmic assessment and liaison with the rheumatology team per local pathway."
      ]
    },
    transfer: {
      prompt: "A table lists three observations for two patients: pain (mild vs severe), vasoconstrictor blanching (yes vs no), systemic disease (none vs vasculitis). Write a one-line assessment for each patient with urgency.",
      modelAnswer: "Patient 1: probable episcleritis — routine management with review if symptoms change. Patient 2: probable scleritis associated with systemic vasculitis — urgent ophthalmic and systemic assessment."
    },
    items: [
      {
        id: "Q-L16-01", version: 1, objectiveIds: ["L16-O1"], familyId: "F-L16-pain-discriminator", pool: "practice", difficulty: 1,
        stem: "Which feature most favours scleritis over episcleritis?",
        options: ["Mild grittiness", "Severe deep pain waking the patient at night", "Bright red sectoral patch", "Normal vision"],
        answerIndex: 1,
        explanation: "Scleritis involves the dense, innervated sclera and typically causes severe, boring pain; episcleritis causes mild discomfort.",
        distractorRationale: ["Mild irritation fits episcleritis.", "", "A bright red sector can occur in both and more often suggests episcleritis.", "Vision is often normal in both early on."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L16-02", version: 1, objectiveIds: ["L16-O1"], familyId: "F-L16-blanching", pool: "practice", difficulty: 2,
        stem: "After a topical vasoconstrictor, the redness in a sectoral red eye largely disappears. What does this suggest?",
        options: ["Deep scleral inflammation", "Inflammation predominantly of the superficial episcleral vessels", "Subconjunctival haemorrhage", "Proven absence of systemic disease"],
        answerIndex: 1,
        explanation: "Superficial vessels blanch with a vasoconstrictor; deep scleral vessels do not. This supports episcleritis but does not replace clinical assessment.",
        distractorRationale: ["Deep scleral vessels do not blanch well.", "", "A haemorrhage is extravascular blood and does not blanch.", "Blanching says nothing definitive about systemic disease."],
        misconceptionIds: ["M-FINDING-AS-CERTAINTY"], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L16-03", version: 1, objectiveIds: ["L16-O2"], familyId: "F-L16-systemic", pool: "practice", difficulty: 2,
        stem: "Why is a systemic evaluation important in scleritis?",
        options: ["Scleritis is always infectious", "Scleritis is frequently associated with systemic inflammatory disease and may be its first sign", "Systemic evaluation replaces eye examination", "Scleritis never affects vision"],
        answerIndex: 1,
        explanation: "A substantial proportion of scleritis is associated with conditions such as rheumatoid arthritis and vasculitis, which may be life-threatening and need systemic treatment.",
        distractorRationale: ["Infectious causes exist but are a minority.", "", "Eye examination remains essential.", "Scleritis can cause vision loss through complications."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L16-04", version: 1, objectiveIds: ["L16-O1", "L16-O2"], familyId: "F-L16-urgency", pool: "practice", difficulty: 2,
        stem: "A young adult has a mildly uncomfortable red sector, normal vision and no systemic symptoms; the vessels are mobile. What is the most appropriate plan?",
        options: ["Emergency admission", "Probable episcleritis; conservative management and review if pain increases or vision changes", "Immediate systemic immunosuppression", "Gonioscopy"],
        answerIndex: 1,
        explanation: "These features fit episcleritis, which is usually self-limiting. Safety-net advice covers features suggesting scleritis.",
        distractorRationale: ["Nothing suggests an emergency.", "", "Systemic immunosuppression is for scleritis under specialist care.", "Gonioscopy is not relevant."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L16-05", version: 1, objectiveIds: ["L16-O3"], familyId: "F-L16-posterior", pool: "exam", difficulty: 3,
        stem: "A patient has severe ocular pain and reduced vision with only mild anterior redness; the fundus shows choroidal folds. Which investigation can support posterior scleritis?",
        options: ["Gonioscopy", "B-scan ultrasonography", "Schirmer test", "Colour plates"],
        answerIndex: 1,
        explanation: "B-scan can show posterior scleral thickening and fluid around the optic nerve, supporting posterior scleritis in the right clinical context.",
        distractorRationale: ["Gonioscopy examines the angle.", "", "Schirmer testing measures tear production.", "Colour plates test colour vision."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L16-06", version: 1, objectiveIds: ["L16-O2"], familyId: "F-L16-necrotising", pool: "exam", difficulty: 2,
        stem: "In a patient with long-standing rheumatoid arthritis, an area of sclera appears thin with a dark bluish colour. What does this suggest?",
        options: ["Benign pigmentation only", "Scleral thinning from necrotising scleritis, needing urgent specialist care", "Pinguecula", "Episcleritis"],
        answerIndex: 1,
        explanation: "Thinned sclera reveals the darker uvea underneath. In rheumatoid arthritis this suggests necrotising scleritis, which risks perforation.",
        distractorRationale: ["The context and thinning make benign pigmentation unlikely as the only explanation.", "", "A pinguecula is a yellowish conjunctival lesion.", "Episcleritis does not thin the sclera."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      }
    ],
    sources: ["C1", "C2"],
    reviewStatus: "draft"
  },
  {
    id: "L17",
    title: "Uveitis",
    group: "Anterior segment",
    emphasis: "Anatomic classification, signs, complications and selected associations",
    signature: "Localize inflammation and connect signs to anatomy",
    prerequisites: ["L12", "L13"],
    studios: ["LAB08", "LAB12"],
    activities: ["T043", "T046", "T066", "T068"],
    estMinutes: 50,
    objectives: [
      { id: "L17-O1", text: "Classify uveitis anatomically as anterior, intermediate, posterior or panuveitis based on where inflammatory cells are seen." },
      { id: "L17-O2", text: "Explain the mechanism of each sign of anterior uveitis: ciliary flush, anterior chamber cells and flare, keratic precipitates, posterior synechiae and hypopyon." },
      { id: "L17-O3", text: "Name selected systemic associations (HLA-B27-related disease, juvenile idiopathic arthritis, sarcoidosis, infections) and why some uveitis is asymptomatic." },
      { id: "L17-O4", text: "Connect complications (cataract, raised pressure, macular oedema) to reduced vision in uveitis." }
    ],
    bridge: "From L01, the uvea is the iris, ciliary body and choroid. From L12, the slit lamp's narrow beam reveals cells in the anterior chamber. Uveitis is inflammation of the uvea and adjacent structures; its location determines symptoms, signs and complications.",
    essentials: [
      "Anterior uveitis (iritis) involves the iris and anterior ciliary body; cells are in the anterior chamber. Intermediate uveitis involves the vitreous and peripheral retina. Posterior uveitis involves the choroid or retina. Panuveitis involves all.",
      "Acute anterior uveitis typically causes pain, photophobia, redness around the cornea (ciliary flush) and blurred vision. The pupil may be small and irregular.",
      "At the slit lamp, white cells and protein leakage (flare) are seen in the anterior chamber. Keratic precipitates are clumps of cells on the corneal endothelium. A hypopyon is a layer of white cells at the bottom of the anterior chamber.",
      "Posterior synechiae are adhesions between iris and lens that make the pupil irregular when dilated.",
      "Acute anterior uveitis is associated with HLA-B27-related conditions such as ankylosing spondylitis. Uveitis in juvenile idiopathic arthritis can be painless and white, so children at risk are screened.",
      "Complications include cataract, raised pressure, macular oedema and band keratopathy. Treatment is directed by an ophthalmologist and depends on cause and location."
    ],
    full: [
      "Mechanism: inflammation breaks down the blood–aqueous barrier. Protein leaks into the aqueous (flare, seen as a beam path) and white cells migrate into the anterior chamber (cells). Ciliary muscle spasm causes pain and photophobia, and inflammation around the limbus produces ciliary flush. Inflamed iris sticks to the lens, forming posterior synechiae.",
      "Granulomatous versus non-granulomatous: large greasy-looking keratic precipitates ('mutton-fat') and iris nodules suggest granulomatous disease, such as sarcoidosis, tuberculosis or syphilis; fine precipitates are typical of non-granulomatous disease, such as HLA-B27-related uveitis. This is a clue to the differential, not a diagnosis.",
      "Intermediate uveitis presents with floaters and blurred vision; cells are seen in the vitreous and sometimes snowball-like aggregates inferiorly. Associations include multiple sclerosis and sarcoidosis, though many cases are idiopathic.",
      "Posterior uveitis presents with floaters, blurred vision or field loss and is examined with dilated fundoscopy and imaging. Infectious causes are important: toxoplasma retinochoroiditis (a focus of retinitis adjacent to an old scar), cytomegalovirus retinitis in immunosuppression, syphilis and tuberculosis. Treating infectious uveitis with immunosuppression alone can be harmful, so infection is considered before steroids are intensified.",
      "Complications explain vision loss: cystoid macular oedema (seen on OCT), cataract (from inflammation and steroid treatment), raised pressure (trabecular inflammation, synechial angle closure or steroid response), and occasionally low pressure from ciliary body shutdown.",
      "Management principles at student depth: topical steroids and cycloplegic drops are common for anterior uveitis, given and monitored by an ophthalmologist; cycloplegics reduce pain and help prevent synechiae. Posterior or chronic disease may require systemic or local therapy after infection is considered.",
      "Documentation: laterality, anatomical location, anterior chamber cells and flare (using a stated grading system), keratic precipitate type, synechiae, pressure, vitreous findings and fundus findings, plus systemic symptoms reviewed."
    ],
    deeper: [
      "The Standardization of Uveitis Nomenclature (SUN) framework standardises anatomical classification and anterior chamber grading; numeric grades should be applied only with the verified scale and viewing protocol.",
      "Masquerade syndromes, such as intraocular lymphoma in older adults, can mimic uveitis and should be considered in atypical or treatment-resistant cases."
    ],
    misconceptions: [
      "Mistake: uveitis always causes a painful red eye. Correction: juvenile idiopathic arthritis-associated and intermediate uveitis can be painless and white.",
      "Mistake: a hypopyon means bacterial infection. Correction: it is a layer of white cells that can occur in severe sterile inflammation or in infection; context (such as recent surgery) guides urgency.",
      "Mistake: all uveitis is treated with steroids immediately. Correction: infectious causes must be considered; treatment is specialist-led."
    ],
    entryChallenge: {
      prompt: "Where would you look with the slit lamp to find the hallmark sign of anterior uveitis, and what would you see?",
      answer: "In the anterior chamber, using a short narrow bright beam: floating white cells (and flare from protein leakage)."
    },
    contrast: {
      a: "Acute anterior uveitis: photophobia, ciliary flush, anterior chamber cells, small pupil, no discharge.",
      b: "Conjunctivitis: diffuse redness, discharge, normal pupil, no anterior chamber cells.",
      discriminator: "Anterior chamber cells at the slit lamp and photophobia with ciliary flush."
    },
    workedExample: {
      problem: "A 30-year-old man with chronic low back stiffness has a painful, photophobic red left eye. The left pupil is small; the anterior chamber has cells. Formulate the assessment.",
      steps: [
        "Locate inflammation: anterior chamber cells indicate anterior uveitis.",
        "Mechanism links: ciliary spasm (pain, photophobia), iris inflammation (small pupil).",
        "Systemic clue: inflammatory back pain suggests an HLA-B27-related spondyloarthropathy.",
        "Check pressure, look for synechiae and examine the fundus.",
        "Assessment: left acute anterior uveitis, possibly HLA-B27-associated; arrange same-day ophthalmic care and systemic evaluation."
      ]
    },
    transfer: {
      prompt: "An eye diagram shows dots (inflammatory cells) in three places: vitreous base only; anterior chamber only; retina and choroid with a pale focus beside a pigmented scar. Classify each anatomically and give one consideration for the third.",
      modelAnswer: "Vitreous base only: intermediate uveitis. Anterior chamber only: anterior uveitis. Retina/choroid with a focus beside an old scar: posterior uveitis; the pattern suggests toxoplasma retinochoroiditis, so infection must be addressed before immunosuppression."
    },
    items: [
      {
        id: "Q-L17-01", version: 1, objectiveIds: ["L17-O2"], familyId: "F-L17-anterior-signs", pool: "practice", difficulty: 1,
        stem: "Which slit-lamp sign is the hallmark of active anterior uveitis?",
        options: ["Follicles on the lower lid", "Cells in the anterior chamber", "Corneal dendrite", "Subconjunctival haemorrhage"],
        answerIndex: 1,
        explanation: "Breakdown of the blood–aqueous barrier allows white cells into the anterior chamber, visible in a narrow slit beam.",
        distractorRationale: ["Follicles suggest viral or chlamydial conjunctivitis.", "", "A dendrite suggests herpetic keratitis.", "Haemorrhage is not a sign of uveitis."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L17-02", version: 1, objectiveIds: ["L17-O1"], familyId: "F-L17-classification", pool: "practice", difficulty: 2,
        stem: "A patient has floaters, inflammatory cells mainly in the vitreous and a quiet anterior chamber. What is the anatomical classification?",
        options: ["Anterior uveitis", "Intermediate uveitis", "Panuveitis", "Scleritis"],
        answerIndex: 1,
        explanation: "Intermediate uveitis is defined by the vitreous (and peripheral retina) as the main site of inflammation.",
        distractorRationale: ["The anterior chamber is quiet.", "", "Panuveitis involves anterior, intermediate and posterior compartments.", "Scleritis is inflammation of the sclera, not cells in the vitreous."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L17-03", version: 1, objectiveIds: ["L17-O3"], familyId: "F-L17-hlab27", pool: "practice", difficulty: 2,
        stem: "Recurrent, acute, unilateral anterior uveitis in a young adult is most classically associated with which group of conditions?",
        options: ["HLA-B27-related spondyloarthropathies", "Diabetic retinopathy", "Primary open-angle glaucoma", "Keratoconus"],
        answerIndex: 0,
        explanation: "Acute recurrent non-granulomatous anterior uveitis is classically associated with HLA-B27-related disease such as ankylosing spondylitis.",
        distractorRationale: ["", "Diabetic retinopathy is a microvascular disease, not a uveitis cause.", "Glaucoma can be a complication, not a cause.", "Keratoconus is a corneal ectasia."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L17-04", version: 1, objectiveIds: ["L17-O3"], familyId: "F-L17-jia-screening", pool: "practice", difficulty: 2,
        stem: "Why do children with juvenile idiopathic arthritis undergo regular eye screening?",
        options: ["Their uveitis is usually very painful and obvious", "Their uveitis can be asymptomatic with a white eye, yet still cause complications", "They always develop retinal detachment", "Screening replaces treatment of arthritis"],
        answerIndex: 1,
        explanation: "JIA-associated anterior uveitis is often chronic and painless; without slit-lamp screening it can cause cataract, glaucoma and band keratopathy before symptoms appear.",
        distractorRationale: ["It is often silent, which is the reason for screening.", "", "Retinal detachment is not a routine feature.", "Screening is complementary to systemic treatment."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L17-05", version: 1, objectiveIds: ["L17-O2"], familyId: "F-L17-hypopyon", pool: "exam", difficulty: 3,
        stem: "Five days after cataract surgery, a patient has pain, reduced vision and a hypopyon. Which interpretation is most important?",
        options: ["This is typical post-operative inflammation; review routinely", "A hypopyon after surgery raises urgent concern for endophthalmitis", "Hypopyon always indicates HLA-B27 disease", "It indicates a subconjunctival haemorrhage"],
        answerIndex: 1,
        explanation: "A hypopyon is a layer of white cells. After intraocular surgery, pain, reduced vision and hypopyon are red flags for infection, requiring emergency ophthalmic assessment.",
        distractorRationale: ["Increasing pain with hypopyon is not routine and must not be dismissed.", "", "Hypopyon has several causes; the surgical context dominates here.", "A haemorrhage is a different finding."],
        misconceptionIds: ["M-FINDING-AS-CERTAINTY"], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L17-06", version: 1, objectiveIds: ["L17-O4"], familyId: "F-L17-complication-cme", pool: "exam", difficulty: 2,
        stem: "A patient with chronic uveitis has reduced central vision; the anterior chamber is now quiet and the lens clear. OCT shows fluid-filled spaces in the macula. What explains the vision loss?",
        options: ["Posterior synechiae", "Cystoid macular oedema", "Band keratopathy", "Ciliary flush"],
        answerIndex: 1,
        explanation: "Inflammatory mediators increase macular capillary leakage, causing cystoid macular oedema, a common cause of reduced vision in uveitis.",
        distractorRationale: ["Synechiae affect the pupil, not macular function.", "", "Band keratopathy is corneal and would be visible at the slit lamp.", "Flush is a sign of active inflammation, not a cause of central loss."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      }
    ],
    sources: ["C1", "C2"],
    reviewStatus: "draft"
  },
  {
    id: "L18",
    title: "Lens and cataract",
    group: "Anterior segment",
    emphasis: "Cataract types, symptoms, examination, complications and surgery principles",
    signature: "Relate the opacity's location to symptoms and examination",
    prerequisites: ["L07", "L12"],
    studios: ["LAB08", "LAB13", "LAB14", "LAB17"],
    activities: ["T005", "T044", "T061", "T074"],
    estMinutes: 45,
    objectives: [
      { id: "L18-O1", text: "Relate nuclear, cortical and posterior subcapsular cataract to their typical symptoms (including myopic shift and glare)." },
      { id: "L18-O2", text: "Explain why a congenital cataract is urgent and how it is detected." },
      { id: "L18-O3", text: "Describe the principle of cataract surgery with intraocular lens implantation and recognise posterior capsule opacification and endophthalmitis as distinct complications." },
      { id: "L18-O4", text: "Explain why visual loss in an eye with cataract is not assumed to be caused by the cataract until other findings are checked." }
    ],
    bridge: "From L01, the lens sits behind the iris, held by zonules within a capsule. From L12, retroillumination and optical sections show lens opacities. A cataract is any opacity of the lens; its location determines how it affects vision.",
    essentials: [
      "Cataract is clouding of the lens. Age-related cataract is the most common type; others are associated with diabetes, corticosteroids, trauma, uveitis, radiation and congenital causes.",
      "Nuclear cataract hardens and yellows the centre of the lens and can make the eye more myopic, sometimes temporarily improving near vision without glasses.",
      "Cortical cataract forms spoke-like opacities that cause glare. Posterior subcapsular cataract lies at the back of the lens near the optical centre and causes glare and reduced near vision early; it is associated with steroids and diabetes.",
      "Symptoms are gradual painless blurring, glare, reduced contrast and changing prescription. The red reflex is dulled.",
      "Congenital cataract can prevent normal visual development and is detected by red reflex examination; it needs urgent specialist referral.",
      "Surgery removes the opaque lens and implants an artificial intraocular lens. Months to years later, the posterior capsule can become cloudy (posterior capsule opacification), which is treated with a laser. Pain and reduced vision in the days after surgery suggest endophthalmitis, an emergency."
    ],
    full: [
      "Mechanism: lens proteins are packed in a precise arrangement that keeps the lens transparent. Ageing, oxidative damage, glycation, steroids and inflammation alter proteins and fibre structure, scattering light. Because new lens fibres are added throughout life and old ones are not removed, the nucleus becomes progressively denser.",
      "Location to symptom: nuclear cataract increases refractive index, causing a myopic shift. Cortical opacities scatter light from peripheral sources (glare at night). Posterior subcapsular opacities sit near the nodal point and are disproportionately disabling when the pupil is small (bright light, reading).",
      "Examination: acuity (including pinhole, which may improve partially), glare symptoms, red reflex, slit-lamp grading of type and density, and dilated fundus examination where possible. If the fundus cannot be seen, B-scan ultrasound checks the retina before surgery. A relative afferent defect or disproportionate acuity loss suggests another disease (L09).",
      "Decision for surgery is based on visual function and the patient's needs, not a fixed acuity value, together with the likelihood of benefit given other eye conditions. Biometry measures the eye to select the intraocular lens power; IRIS teaches the concept but does not calculate lens powers.",
      "Surgical principle: the anterior capsule is opened, the nucleus is emulsified and aspirated (phacoemulsification), the cortex removed and a foldable lens placed in the remaining capsular bag. The posterior capsule is retained to support the lens.",
      "Complications at student depth: endophthalmitis (infection, typically days after surgery, with pain, reduced vision, hypopyon — emergency); posterior capsule opacification (gradual blur months to years later, treated with laser capsulotomy); retinal detachment (flashes, floaters, shadow); raised pressure; and macular oedema.",
      "Children: congenital or early-onset cataract that blocks the visual axis deprives the developing visual system and can cause dense amblyopia; it needs urgent referral. Bilateral congenital cataract may have systemic or genetic causes that require paediatric evaluation."
    ],
    deeper: [
      "Phacodonesis (lens wobble) suggests zonular weakness, for example in pseudoexfoliation or after trauma, and alters surgical planning.",
      "Some systemic drugs used for urinary symptoms (alpha-1 antagonists such as tamsulosin) are associated with intraoperative floppy iris syndrome; surgeons need to know about current or past use."
    ],
    misconceptions: [
      "Mistake: improved near vision in an older adult is a sign of healthy eyes. Correction: a nuclear cataract can cause a myopic shift ('second sight').",
      "Mistake: any visual loss in an eye with cataract is due to the cataract. Correction: check pupils, fundus (or B-scan) and history; other disease may coexist.",
      "Mistake: blur after cataract surgery means the cataract has returned. Correction: posterior capsule opacification is a different, treatable process; acute painful loss suggests endophthalmitis."
    ],
    entryChallenge: {
      prompt: "A 75-year-old says she can now read without her reading glasses but distance vision is worse. Which type of cataract fits?",
      answer: "Nuclear cataract, which increases lens refractive power and causes a myopic shift."
    },
    contrast: {
      a: "Posterior capsule opacification: gradual blur months to years after surgery, painless, treated with laser.",
      b: "Endophthalmitis: pain, redness and reduced vision days after surgery, often with hypopyon — emergency.",
      discriminator: "Timing after surgery and the presence of pain and inflammation."
    },
    workedExample: {
      problem: "A 40-year-old on long-term oral corticosteroids has glare and reduced reading vision in bright light, with near-normal distance acuity in a dim room. Explain.",
      steps: [
        "Steroids are associated with posterior subcapsular cataract.",
        "This opacity lies near the optical centre at the back of the lens.",
        "In bright light and during near tasks the pupil constricts, so more light passes through the central opacity.",
        "In dim light the pupil dilates and light passes around the opacity, so acuity is better.",
        "Confirm at the slit lamp with retroillumination; check pressure (steroid response) and document."
      ]
    },
    transfer: {
      prompt: "A retroillumination sketch shows dark wedge-shaped spokes pointing toward the centre from the lens periphery. Name the cataract type and predict the main symptom.",
      modelAnswer: "Cortical cataract. Peripheral spokes scatter light, so glare (especially from oncoming headlights at night) is typical; central acuity may be preserved until spokes reach the visual axis."
    },
    items: [
      {
        id: "Q-L18-01", version: 1, objectiveIds: ["L18-O1"], familyId: "F-L18-myopic-shift", pool: "practice", difficulty: 1,
        stem: "Which cataract type characteristically causes a myopic shift?",
        options: ["Nuclear", "Cortical", "Posterior subcapsular", "Anterior polar"],
        answerIndex: 0,
        explanation: "Nuclear sclerosis increases the refractive index of the lens centre, adding plus power and making the eye more myopic.",
        distractorRationale: ["", "Cortical cataract mainly causes glare.", "Posterior subcapsular cataract mainly causes glare and near problems.", "Anterior polar cataracts are small and often visually insignificant."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L18-02", version: 1, objectiveIds: ["L18-O1"], familyId: "F-L18-psc", pool: "practice", difficulty: 2,
        stem: "A young adult with diabetes has glare and difficulty reading, worse in bright light. Which lens opacity best explains this?",
        options: ["Nuclear sclerosis", "Posterior subcapsular cataract", "Peripheral cortical spokes not reaching the axis", "Pseudophakia"],
        answerIndex: 1,
        explanation: "Posterior subcapsular cataract lies near the optical centre; constriction in bright light and at near forces light through it. It is associated with diabetes and steroids.",
        distractorRationale: ["Nuclear cataract causes gradual blur and myopic shift, usually in older patients.", "", "Peripheral spokes not reaching the axis cause less near difficulty.", "Pseudophakia means a lens implant is present."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L18-03", version: 1, objectiveIds: ["L18-O2"], familyId: "F-L18-congenital", pool: "practice", difficulty: 2,
        stem: "A newborn's red reflex is absent in the right eye. Why is urgent referral required?",
        options: ["It is a cosmetic problem only", "A visual-axis opacity in infancy can cause dense amblyopia and may indicate other serious disease", "Cataracts in infants always resolve", "Surgery is never performed in children"],
        answerIndex: 1,
        explanation: "Blocking the visual axis during the sensitive period prevents normal development; an abnormal reflex also has a differential that includes retinoblastoma.",
        distractorRationale: ["The visual consequences can be permanent.", "", "Congenital cataracts do not resolve.", "Paediatric cataract surgery is performed when indicated."],
        misconceptionIds: ["M-FINDING-AS-CERTAINTY"], sources: ["C1", "C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L18-04", version: 1, objectiveIds: ["L18-O3"], familyId: "F-L18-pco", pool: "practice", difficulty: 2,
        stem: "Two years after uncomplicated cataract surgery, a patient notices gradual painless blurring and glare. The eye is white. What is the most likely cause?",
        options: ["Recurrence of the original cataract", "Posterior capsule opacification", "Endophthalmitis", "Acute angle closure"],
        answerIndex: 1,
        explanation: "Lens epithelial cells proliferate on the retained posterior capsule, clouding it. It is treated with laser capsulotomy.",
        distractorRationale: ["The natural lens has been removed and cannot regrow as a cataract.", "", "Endophthalmitis is painful and usually early.", "Angle closure is painful and acute."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L18-05", version: 1, objectiveIds: ["L18-O3"], familyId: "F-L18-postop-endophthalmitis", pool: "exam", difficulty: 2,
        stem: "Three days after cataract surgery, a patient reports increasing pain and worsening vision; the eye is red. What is the appropriate response?",
        options: ["Reassure; this is normal recovery", "Emergency same-day ophthalmic assessment for suspected endophthalmitis", "Book laser capsulotomy", "Advise a new spectacle prescription"],
        answerIndex: 1,
        explanation: "Worsening pain and vision soon after intraocular surgery are red flags for endophthalmitis, which needs emergency assessment.",
        distractorRationale: ["Normal recovery involves improving, not worsening, comfort and vision.", "", "Capsular opacification is a late, painless complication.", "Refraction is not the issue in an acutely painful eye."],
        misconceptionIds: [], sources: ["C2"], reviewStatus: "draft"
      },
      {
        id: "Q-L18-06", version: 1, objectiveIds: ["L18-O4"], familyId: "F-L18-coexisting-disease", pool: "exam", difficulty: 3,
        stem: "A patient has a moderate cataract, but acuity is much worse than expected and the patient reports central distortion. What is the best approach?",
        options: ["Attribute everything to cataract and list for surgery", "Examine the macula (dilated fundus, OCT if available) because coexisting macular disease may limit the benefit of surgery", "Prescribe stronger glasses only", "Reassure that distortion is typical of cataract"],
        answerIndex: 1,
        explanation: "Disproportionate acuity loss and metamorphopsia suggest macular disease. Identifying it matters for diagnosis, treatment and for counselling about expected outcomes of surgery.",
        distractorRationale: ["Assuming the cataract explains everything risks missing treatable disease.", "", "Glasses do not address macular disease.", "Distortion points to the macula rather than the lens."],
        misconceptionIds: ["M-FINDING-AS-CERTAINTY"], sources: ["C2"], reviewStatus: "draft"
      }
    ],
    sources: ["C1", "C2"],
    reviewStatus: "draft"
  },
];
