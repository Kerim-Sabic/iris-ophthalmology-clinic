export type SourceId = 'O1'|'O2'|'O3'|'O4'|'C1'|'C2'|'C3'|'K1'|'K2'|'K3'|'K4'|'K5'|'K6'|'K7'|'K8'|'E1'|'E2';
export type ReviewStatus = 'draft'|'source-checked'|'human-review-pending'|'human-reviewed'|'quarantined';
export interface Objective { id: string; text: string }
export interface McqItem {
  id: string; version: number; objectiveIds: string[]; familyId: string;
  pool: 'practice'|'exam'; difficulty: 1|2|3;
  stem: string; options: string[]; answerIndex: number;
  explanation: string; distractorRationale: string[]; // one per option, '' for the key
  misconceptionIds: string[]; sources: SourceId[]; reviewStatus: ReviewStatus;
}
export interface LectureContent {
  id: string; title: string; group: 'Foundations'|'Optics & refraction'|'Examination'|'Anterior segment'|'Posterior segment'|'Neuro-ophthalmology'|'Paediatrics, orbit & tumours'|'Emergency & integration'|'Therapeutics & systemic';
  emphasis: string; signature: string;
  prerequisites: string[]; // lecture IDs
  studios: string[]; // LAB01..LAB18 per spec section 7
  activities: string[]; // T001..T088 ids relevant per spec section 8 table
  estMinutes: number; // a design estimate
  objectives: Objective[]; // 3-5, measurable ("Explain…", "Distinguish…", "Given X, state Y")
  bridge: string; // 2-3 sentence prerequisite refresher for someone opening it cold
  essentials: string[]; // 4-7 short paragraphs (level 1)
  full: string[]; // 4-8 paragraphs causal explanation incl. mechanism → presentation → signs → test → interpretation → differential → urgency principles → documentation where it applies (level 2)
  deeper: string[]; // 2-4 paragraphs optional detail (level 3)
  misconceptions: string[]; // 2-4 common mistakes, each phrased as "Mistake: … Correction: …"
  entryChallenge: { prompt: string; answer: string };
  contrast: { a: string; b: string; discriminator: string };
  workedExample: { problem: string; steps: string[] };
  transfer: { prompt: string; modelAnswer: string }; // a different-representation problem, self-assessed
  items: McqItem[];
  sources: SourceId[]; // only IDs from the register that genuinely bear on this lecture; [] is acceptable
  reviewStatus: ReviewStatus; // always 'draft'
}
