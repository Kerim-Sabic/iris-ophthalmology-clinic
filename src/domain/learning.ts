/**
 * Learner record model, transparent review scheduling and evidence statuses.
 * All summaries are DERIVED from the immutable attempt log; nothing here mutates attempts.
 * Policies are product hypotheses (displayed to the learner), not validated mastery science.
 */
import { z } from 'zod';

export const LectureScope = z.enum(['included', 'excluded', 'uncertain']);
export type LectureScope = z.infer<typeof LectureScope>;

export const AttemptSchema = z.object({
  id: z.string(),
  profileId: z.string(),
  itemId: z.string(),
  itemVersion: z.number().int(),
  contentVersion: z.string(),
  familyId: z.string(),
  objectiveIds: z.array(z.string()),
  lectureIds: z.array(z.string()),
  seed: z.number().int().nullable(),
  taskType: z.string(),
  mode: z.enum(['learning', 'review', 'exam', 'mission']),
  response: z.unknown(),
  correct: z.boolean().nullable(),
  /** Separate score dimensions, e.g. opticallyEquivalent, notation, classification. */
  scores: z.record(z.union([z.boolean(), z.number(), z.string()])),
  confidence: z.enum(['low', 'medium', 'high']).nullable(),
  hintLevel: z.number().int().min(0).max(3),
  misconceptionIds: z.array(z.string()),
  feedback: z.string().optional(),
  startedAt: z.number(),
  submittedAt: z.number(),
  examId: z.string().optional(),
  isTransfer: z.boolean().optional(),
  /** Model/case state needed to reproduce the item (target lens, etc.). */
  state: z.unknown().optional(),
});
export type Attempt = z.infer<typeof AttemptSchema>;

export const PlanSnapshotSchema = z.object({
  id: z.string(),
  profileId: z.string(),
  createdAt: z.number(),
  scopeVersion: z.number().int(),
  presetId: z.string().nullable(),
  lectures: z.record(LectureScope),
  examDate: z.string().nullable(),
  minutesPerDay: z.number().nullable(),
});
export type PlanSnapshot = z.infer<typeof PlanSnapshotSchema>;

// ------------------------------------------------------------ scheduling

export const REVIEW_POLICY = {
  /** Days until the next check after consecutive unassisted successes on a family. */
  intervalsDays: [1, 3, 7, 16, 35],
  /** After an error or assisted success: retry after this many days. */
  retryDays: 1,
  /** A delayed check must be at least this long after the previous success. */
  minDelayHours: 20,
  description:
    'Transparent starting policy (a product hypothesis, not a validated algorithm): each unassisted correct answer on a task family lengthens the next interval 1 → 3 → 7 → 16 → 35 days; an error or a hinted answer brings the family back after 1 day. Delayed checks use a new numerical variant of the same family.',
} as const;

export const DAY_MS = 86_400_000;

export interface ReviewState {
  familyId: string;
  lectureIds: string[];
  objectiveIds: string[];
  dueAt: number;
  streak: number;
  lastAttemptAt: number;
  lastCorrect: boolean;
  attempts: number;
}

/** Derive per-family review state from attempts (exam attempts do not schedule). */
export function deriveReviewStates(attempts: Attempt[]): Map<string, ReviewState> {
  const byFam = new Map<string, Attempt[]>();
  for (const a of attempts) {
    if (a.mode === 'exam' || a.correct === null) continue;
    const list = byFam.get(a.familyId) ?? [];
    list.push(a);
    byFam.set(a.familyId, list);
  }
  const out = new Map<string, ReviewState>();
  for (const [fam, list] of byFam) {
    list.sort((x, y) => x.submittedAt - y.submittedAt);
    let streak = 0;
    let due = 0;
    let lastSuccessAt = -Infinity;
    for (const a of list) {
      const independent = a.correct === true && a.hintLevel === 0;
      if (independent) {
        // A success counts toward lengthening only if it is a delayed check (or the first success).
        if (streak === 0 || a.submittedAt - lastSuccessAt >= REVIEW_POLICY.minDelayHours * 3_600_000) streak += 1;
        lastSuccessAt = a.submittedAt;
        const iv = REVIEW_POLICY.intervalsDays[Math.min(streak - 1, REVIEW_POLICY.intervalsDays.length - 1)];
        due = a.submittedAt + iv * DAY_MS;
      } else {
        streak = 0;
        due = a.submittedAt + REVIEW_POLICY.retryDays * DAY_MS;
      }
    }
    const last = list[list.length - 1];
    out.set(fam, {
      familyId: fam,
      lectureIds: [...new Set(list.flatMap((a) => a.lectureIds))],
      objectiveIds: [...new Set(list.flatMap((a) => a.objectiveIds))],
      dueAt: due,
      streak,
      lastAttemptAt: last.submittedAt,
      lastCorrect: last.correct === true && last.hintLevel === 0,
      attempts: list.length,
    });
  }
  return out;
}

export function dueReviews(attempts: Attempt[], now: number, dailyCap = 20): ReviewState[] {
  return [...deriveReviewStates(attempts).values()]
    .filter((r) => r.dueAt <= now)
    .sort((a, b) => a.dueAt - b.dueAt)
    .slice(0, dailyCap);
}

// ------------------------------------------------------------ evidence

export type EvidenceStatus =
  | 'not-attempted'
  | 'practicing'
  | 'immediate-check-passed'
  | 'delayed-check-passed'
  | 'transfer-demonstrated'
  | 'needs-review';

export const EVIDENCE_LABEL: Record<EvidenceStatus, string> = {
  'not-attempted': 'Not attempted',
  practicing: 'Practising',
  'immediate-check-passed': 'Immediate check passed',
  'delayed-check-passed': 'Delayed check passed',
  'transfer-demonstrated': 'Transfer demonstrated',
  'needs-review': 'Needs review',
};

export const EVIDENCE_POLICY =
  'Viewing, dragging or hinted answers never count as evidence. Immediate: an unhinted correct answer. Delayed: an unhinted correct answer at least 20 h after an earlier success on the same objective. Transfer: an unhinted correct answer on a family flagged as transfer (a different task structure) for the objective, plus a delayed pass. A failed delayed check lowers the status to “needs review” without deleting history.';

/** Evidence for one objective, derived from its attempts. */
export function objectiveEvidence(attempts: Attempt[], objectiveId: string): EvidenceStatus {
  const list = attempts.filter((a) => a.objectiveIds.includes(objectiveId) && a.correct !== null).sort((x, y) => x.submittedAt - y.submittedAt);
  if (!list.length) return 'not-attempted';
  let immediate = false;
  let delayed = false;
  let transfer = false;
  let firstSuccessAt: number | null = null;
  let needsReview = false;
  for (const a of list) {
    const ok = a.correct === true && a.hintLevel === 0;
    const isDelayed = firstSuccessAt !== null && a.submittedAt - firstSuccessAt >= REVIEW_POLICY.minDelayHours * 3_600_000;
    if (ok) {
      immediate = true;
      if (firstSuccessAt === null) firstSuccessAt = a.submittedAt;
      if (isDelayed) {
        delayed = true;
        needsReview = false;
      }
      if (a.isTransfer) transfer = true;
    } else if (a.correct === false && isDelayed) {
      needsReview = true;
    }
  }
  if (needsReview) return 'needs-review';
  if (transfer && delayed) return 'transfer-demonstrated';
  if (delayed) return 'delayed-check-passed';
  if (immediate) return 'immediate-check-passed';
  return 'practicing';
}

// ------------------------------------------------------------ export bundle

export const EXPORT_FORMAT = 'iris-learner-export';
export const SCHEMA_VERSION = 2;

export const ProfileSchema = z.object({ id: z.string(), name: z.string(), createdAt: z.number() });
export type Profile = z.infer<typeof ProfileSchema>;

export const NoteSchema = z.object({ id: z.string(), profileId: z.string(), ref: z.string(), text: z.string(), updatedAt: z.number() });
export type Note = z.infer<typeof NoteSchema>;

export const ExamSessionSchema = z.object({
  id: z.string(),
  profileId: z.string(),
  createdAt: z.number(),
  settings: z.object({
    lectureIds: z.array(z.string()),
    count: z.number().int(),
    timed: z.boolean(),
    minutes: z.number().nullable(),
    allowPracticedFamilies: z.boolean(),
    seed: z.number().int(),
  }),
  items: z.array(z.object({ kind: z.enum(['mcq', 'optics']), itemId: z.string(), familyId: z.string(), seed: z.number().int().nullable() })),
  responses: z.record(z.unknown()),
  currentIndex: z.number().int(),
  status: z.enum(['in-progress', 'submitted']),
  submittedAt: z.number().nullable(),
  elapsedMs: z.number(),
  poolWarning: z.string().nullable(),
});
export type ExamSession = z.infer<typeof ExamSessionSchema>;

export const ExportBundleSchema = z.object({
  format: z.literal(EXPORT_FORMAT),
  schemaVersion: z.literal(SCHEMA_VERSION),
  exportedAt: z.number(),
  profile: ProfileSchema,
  plans: z.array(PlanSnapshotSchema),
  attempts: z.array(AttemptSchema),
  exams: z.array(ExamSessionSchema),
  notes: z.array(NoteSchema),
  flags: z.array(z.object({ itemId: z.string(), reason: z.string(), at: z.number() })),
  missions: z.record(z.unknown()),
});
export type ExportBundle = z.infer<typeof ExportBundleSchema>;

/**
 * Migrate older bundles. v1 stored `hints` instead of `hintLevel` and no contentVersion/flags/missions.
 */
export function migrateBundle(raw: unknown): unknown {
  if (!raw || typeof raw !== 'object') return raw;
  const b = { ...(raw as Record<string, unknown>) };
  if (b.format !== EXPORT_FORMAT) return b;
  if (b.schemaVersion === 1) {
    const attempts = Array.isArray(b.attempts) ? b.attempts : [];
    b.attempts = attempts.map((a: Record<string, unknown>) => {
      const { hints, ...rest } = a;
      return { contentVersion: '0', ...rest, hintLevel: typeof hints === 'number' ? Math.min(3, hints) : (rest.hintLevel ?? 0) };
    });
    b.flags = b.flags ?? [];
    b.missions = b.missions ?? {};
    b.schemaVersion = 2;
  }
  return b;
}

export function parseBundle(raw: unknown): { ok: true; bundle: ExportBundle } | { ok: false; error: string } {
  const migrated = migrateBundle(raw);
  const r = ExportBundleSchema.safeParse(migrated);
  if (!r.success) {
    const first = r.error.issues.slice(0, 3).map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`);
    return { ok: false, error: `Import rejected — not a valid IRIS export (${first.join('; ')}).` };
  }
  return { ok: true, bundle: r.data };
}
