import { describe, expect, it } from 'vitest';
import { DAY_MS, deriveReviewStates, dueReviews, objectiveEvidence, parseBundle, type Attempt } from '../src/domain/learning';
import { MemoryBackend, Repo } from '../src/lib/store';

const T0 = Date.UTC(2026, 9, 14, 9, 0, 0);
let n = 0;
function att(p: Partial<Attempt>): Attempt {
  n++;
  return {
    id: 'a' + n, profileId: 'p1', itemId: 'F-X#1', itemVersion: 1, contentVersion: '1', familyId: 'F-X', objectiveIds: ['OPT-X'],
    lectureIds: ['L05'], seed: 1, taskType: 't', mode: 'learning', response: null, correct: true, scores: {}, confidence: null,
    hintLevel: 0, misconceptionIds: [], startedAt: T0, submittedAt: T0, ...p,
  };
}

describe('review scheduler (controlled clock)', () => {
  it('first unassisted success → due in 1 day; nothing due before', () => {
    const a = [att({ submittedAt: T0 })];
    expect(dueReviews(a, T0 + DAY_MS - 1)).toHaveLength(0);
    expect(dueReviews(a, T0 + DAY_MS)).toHaveLength(1);
  });
  it('delayed success lengthens interval to 3 days; quick repeat does not', () => {
    const a = [att({ submittedAt: T0 }), att({ submittedAt: T0 + 60_000 })];
    expect(deriveReviewStates(a).get('F-X')!.streak).toBe(1);
    const b = [att({ submittedAt: T0 }), att({ submittedAt: T0 + DAY_MS })];
    const s = deriveReviewStates(b).get('F-X')!;
    expect(s.streak).toBe(2);
    expect(s.dueAt).toBe(T0 + DAY_MS + 3 * DAY_MS);
  });
  it('error or hint resets to 1-day retry', () => {
    const a = [att({ submittedAt: T0 }), att({ submittedAt: T0 + DAY_MS, correct: false })];
    expect(deriveReviewStates(a).get('F-X')!.streak).toBe(0);
    const b = [att({ submittedAt: T0, hintLevel: 2 })];
    expect(deriveReviewStates(b).get('F-X')!.dueAt).toBe(T0 + DAY_MS);
  });
  it('exam attempts do not schedule', () => {
    expect(deriveReviewStates([att({ mode: 'exam' })]).size).toBe(0);
  });
});

describe('evidence statuses', () => {
  it('hinted success is practising, not passed', () => {
    expect(objectiveEvidence([att({ hintLevel: 1 })], 'OPT-X')).toBe('practicing');
  });
  it('immediate → delayed → transfer; failed delayed → needs review', () => {
    expect(objectiveEvidence([att({})], 'OPT-X')).toBe('immediate-check-passed');
    const d = [att({}), att({ submittedAt: T0 + DAY_MS })];
    expect(objectiveEvidence(d, 'OPT-X')).toBe('delayed-check-passed');
    const t = [...d, att({ submittedAt: T0 + DAY_MS + 5, isTransfer: true, familyId: 'F-Y' })];
    expect(objectiveEvidence(t, 'OPT-X')).toBe('transfer-demonstrated');
    const f = [...d, att({ submittedAt: T0 + 3 * DAY_MS, correct: false })];
    expect(objectiveEvidence(f, 'OPT-X')).toBe('needs-review');
  });
  it('no attempts → not attempted', () => {
    expect(objectiveEvidence([], 'OPT-X')).toBe('not-attempted');
  });
});

describe('persistence, export / import', () => {
  it('duplicate attempt IDs are rejected; export → import into fresh profile preserves scope and history', async () => {
    const repo = new Repo(new MemoryBackend());
    const p = await repo.createProfile('Guest');
    const a = att({ profileId: p.id, id: 'fixed' });
    expect(await repo.addAttempt(a)).toBe(true);
    expect(await repo.addAttempt(a)).toBe(false);
    await repo.addPlan({ profileId: p.id, presetId: null, lectures: { L05: 'included', L09: 'included', L01: 'excluded' }, examDate: null, minutesPerDay: null });
    await repo.addPlan({ profileId: p.id, presetId: null, lectures: { L05: 'included', L09: 'uncertain' }, examDate: null, minutesPerDay: null });
    await repo.setKV(p.id, 'mission:cyl', { step: 4 });
    const bundle = JSON.parse(JSON.stringify(await repo.exportBundle(p.id)));
    const repo2 = new Repo(new MemoryBackend());
    const r = await repo2.importBundle(bundle);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const plans = await repo2.plans(r.profile.id);
    expect(plans).toHaveLength(2);
    expect(plans[1].scopeVersion).toBe(2);
    expect(plans[1].lectures).toEqual({ L05: 'included', L09: 'uncertain' });
    const atts = await repo2.attempts(r.profile.id);
    expect(atts).toHaveLength(1);
    expect(atts[0].profileId).toBe(r.profile.id);
    expect(await repo2.getKV(r.profile.id, 'mission:cyl')).toEqual({ step: 4 });
  });
  it('malformed imports are rejected with a reason', () => {
    expect(parseBundle(null).ok).toBe(false);
    expect(parseBundle({ format: 'other' }).ok).toBe(false);
    const r = parseBundle({ format: 'iris-learner-export', schemaVersion: 2, exportedAt: 1 });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain('not a valid IRIS export');
  });
  it('migrates a v1 bundle (hints → hintLevel)', () => {
    const v1 = {
      format: 'iris-learner-export', schemaVersion: 1, exportedAt: 1,
      profile: { id: 'p', name: 'Old', createdAt: 1 }, plans: [], exams: [], notes: [],
      attempts: [{ ...att({}), hintLevel: undefined, contentVersion: undefined, hints: 5 }],
    };
    const r = parseBundle(JSON.parse(JSON.stringify(v1)));
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.bundle.attempts[0].hintLevel).toBe(3);
  });
});
