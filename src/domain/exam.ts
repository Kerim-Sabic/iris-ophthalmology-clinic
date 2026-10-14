/** Mock-exam assembly from honest pools. Never recycles silently to reach a requested count. */
import type { Attempt, ExamSession } from './learning';
import { rng } from './random';

export interface PoolMcq {
  id: string;
  familyId: string;
  lectureId: string;
  pool: 'practice' | 'exam';
  reviewStatus: string;
}
export interface PoolOpticsFamily {
  id: string;
  pool: 'practice' | 'exam';
  lectureIds: string[];
}

export interface ExamPlan {
  items: ExamSession['items'];
  available: number;
  warning: string | null;
}

export function planExam(
  settings: ExamSession['settings'],
  mcqs: PoolMcq[],
  optics: PoolOpticsFamily[],
  attempts: Attempt[],
  flaggedItemIds: string[],
): ExamPlan {
  const seen = new Set(attempts.map((a) => a.familyId));
  const lect = new Set(settings.lectureIds);
  const okFamily = (f: string) => settings.allowPracticedFamilies || !seen.has(f);
  const m = mcqs.filter((i) => i.pool === 'exam' && lect.has(i.lectureId) && i.reviewStatus !== 'quarantined' && !flaggedItemIds.includes(i.id) && okFamily(i.familyId));
  const o = optics.filter((f) => f.pool === 'exam' && f.lectureIds.some((l) => lect.has(l)) && okFamily(f.id));
  const r = rng(settings.seed);
  const candidates: ExamSession['items'] = [
    ...m.map((i) => ({ kind: 'mcq' as const, itemId: i.id, familyId: i.familyId, seed: null })),
    ...o.map((f) => ({ kind: 'optics' as const, itemId: f.id, familyId: f.id, seed: r.int(1, 2 ** 30) })),
  ];
  // one item per family to keep families independent
  const byFam = new Map<string, ExamSession['items'][number]>();
  for (const c of candidates) if (!byFam.has(c.familyId)) byFam.set(c.familyId, c);
  const uniq = [...byFam.values()];
  for (let i = uniq.length - 1; i > 0; i--) {
    const j = Math.floor(r.next() * (i + 1));
    [uniq[i], uniq[j]] = [uniq[j], uniq[i]];
  }
  const items = uniq.slice(0, settings.count);
  let warning: string | null = null;
  if (settings.lectureIds.length === 0) warning = 'No lectures selected: an exam cannot be built from an empty scope.';
  else if (uniq.length < settings.count)
    warning = `Only ${uniq.length} independent unseen families are available for this scope${settings.allowPracticedFamilies ? '' : ' (families you already practised are excluded)'}; you asked for ${settings.count}. The exam uses ${uniq.length} items rather than recycling questions.`;
  return { items, available: uniq.length, warning };
}
