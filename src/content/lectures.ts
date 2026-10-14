import type { LectureContent, McqItem } from './schema';
import { STUDIOS } from './studios';
import registry from './TEST_REGISTRY.json';
import { SOURCES } from './reference';

// Lecture data files are discovered at build time; a missing file shows up as a validation error, not a crash.
const modules = import.meta.glob<Record<string, LectureContent[]>>('./lectures.data*.ts', { eager: true });
export const LECTURES: LectureContent[] = Object.values(modules)
  .flatMap((m) => Object.values(m).flat())
  .sort((a, b) => a.id.localeCompare(b.id));

export function lectureById(id: string) {
  return LECTURES.find((l) => l.id === id);
}

export const ALL_ITEMS: (McqItem & { lectureId: string })[] = LECTURES.flatMap((l) => l.items.map((i) => ({ ...i, lectureId: l.id })));

export interface Preset {
  id: string;
  title: string;
  note: string;
  lectures: string[];
}

const all = () => LECTURES.map((l) => l.id);
export const PRESETS: Preset[] = [
  { id: 'optics', title: 'Optics-intensive', note: 'Refraction, notation and visual function first.', lectures: ['L03', 'L04', 'L05', 'L06', 'L07', 'L12', 'L36'] },
  { id: 'broad', title: 'Broad medical-student', note: 'All 36 lectures at core depth.', lectures: all() },
  { id: 'neuro', title: 'Neuro-ophthalmology', note: 'Pupils, motility, fields, optic nerve, diplopia.', lectures: ['L01', 'L09', 'L10', 'L11', 'L24', 'L25', 'L27', 'L35'] },
  { id: 'emergency', title: 'Emergency', note: 'Red eye, trauma, sudden loss, urgent presentations.', lectures: ['L08', 'L13', 'L15', 'L19', 'L22', 'L23', 'L27', 'L28', 'L35'] },
  { id: 'mixed', title: 'Mixed revision', note: 'A cross-section for final revision.', lectures: ['L04', 'L05', 'L07', 'L09', 'L10', 'L11', 'L13', 'L19', 'L20', 'L22', 'L28', 'L35', 'L36'] },
];

/** Content validation used by tests and the in-app status page. */
export function validateContent(): string[] {
  const errs: string[] = [];
  const ids = new Set<string>();
  for (const l of LECTURES) {
    if (ids.has(l.id)) errs.push(`duplicate lecture ${l.id}`);
    ids.add(l.id);
  }
  if (LECTURES.length !== 36) errs.push(`expected 36 lectures, found ${LECTURES.length}`);
  const studioIds = new Set(STUDIOS.map((s) => s.id));
  const testIds = new Set(registry.entries.map((e) => e.id));
  const itemIds = new Set<string>();
  for (const l of LECTURES) {
    for (const p of l.prerequisites) if (!ids.has(p)) errs.push(`${l.id}: undefined prerequisite ${p}`);
    for (const s of l.studios) if (!studioIds.has(s)) errs.push(`${l.id}: undefined studio ${s}`);
    for (const t of l.activities) if (!testIds.has(t)) errs.push(`${l.id}: undefined activity ${t}`);
    for (const s of l.sources) if (!(s in SOURCES)) errs.push(`${l.id}: unknown source ${s}`);
    if (!l.objectives.length) errs.push(`${l.id}: no objectives`);
    const objIds = new Set(l.objectives.map((o) => o.id));
    const practiceFams = new Set(l.items.filter((i) => i.pool === 'practice').map((i) => i.familyId));
    for (const it of l.items) {
      if (itemIds.has(it.id)) errs.push(`duplicate item ${it.id}`);
      itemIds.add(it.id);
      if (!it.explanation) errs.push(`${it.id}: missing explanation`);
      if (it.answerIndex < 0 || it.answerIndex >= it.options.length) errs.push(`${it.id}: answer index out of range`);
      if (it.distractorRationale.length !== it.options.length) errs.push(`${it.id}: distractor rationale count`);
      for (const o of it.objectiveIds) if (!objIds.has(o)) errs.push(`${it.id}: orphan objective ${o}`);
      if (it.pool === 'exam' && practiceFams.has(it.familyId)) errs.push(`${it.id}: exam family also used in practice`);
      if (it.reviewStatus === 'quarantined' && it.pool === 'exam') errs.push(`${it.id}: quarantined item in exam pool`);
    }
  }
  // prerequisite cycles
  const visiting = new Set<string>();
  const done = new Set<string>();
  const visit = (id: string, path: string[]) => {
    if (done.has(id)) return;
    if (visiting.has(id)) {
      errs.push(`prerequisite cycle: ${[...path, id].join(' → ')}`);
      return;
    }
    visiting.add(id);
    for (const p of lectureById(id)?.prerequisites ?? []) visit(p, [...path, id]);
    visiting.delete(id);
    done.add(id);
  };
  for (const l of LECTURES) visit(l.id, []);
  // registry truthfulness: an entry marked implemented must name where and declare an interactive capability
  for (const e of registry.entries) {
    if (e.implementation !== 'planned' && !e.implementedIn) errs.push(`${e.id}: implemented without location`);
    if (e.implementation !== 'planned' && !Object.values(e.capabilities).some(Boolean)) errs.push(`${e.id}: implemented without capability flags`);
    if (e.humanReview !== 'not-reviewed') errs.push(`${e.id}: claims human review without a review record`);
  }
  return errs;
}

export function lectureDepth(id: string, memo = new Map<string, number>()): number {
  if (memo.has(id)) return memo.get(id)!;
  const l = lectureById(id);
  const d = !l || !l.prerequisites.length ? 0 : 1 + Math.max(...l.prerequisites.map((p) => lectureDepth(p, memo)));
  memo.set(id, d);
  return d;
}
