import { describe, expect, it } from 'vitest';
import { LECTURES, validateContent } from '../src/content/lectures';
import { STUDIOS } from '../src/content/studios';
import registry from '../src/content/TEST_REGISTRY.json';

describe('content validation', () => {
  it('36 lectures, 18 studios, 88 registry entries', () => {
    expect(LECTURES).toHaveLength(36);
    expect(STUDIOS).toHaveLength(18);
    expect(registry.entries).toHaveLength(88);
  });
  it('no missing prerequisites, orphan objectives, exam/practice family overlap, cycles, or mislabelled registry rows', () => {
    expect(validateContent()).toEqual([]);
  });
  it('every lecture is honestly marked draft and every item has rationale per option', () => {
    for (const l of LECTURES) {
      expect(l.reviewStatus).toBe('draft');
      for (const i of l.items) expect(i.distractorRationale[i.answerIndex]).toBe('');
    }
  });
  it('no planned studio claims to be implemented in the registry', () => {
    const planned = new Set(STUDIOS.filter((s) => s.status === 'planned').map((s) => s.id));
    for (const e of registry.entries) if (planned.has(e.studio)) expect(e.implementation).toBe('planned');
  });
});
