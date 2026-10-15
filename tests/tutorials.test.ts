import { describe, expect, it } from 'vitest';
import script from '../src/tutorials/script.json';
import { textHash, estimateMs } from '../src/tutorials/narration';
import { SCENES } from '../src/tutorials/scenes';
import { STUDIOS } from '../src/content/studios';

describe('tutorials', () => {
  it('every tutorial has a scene, unique step ids, and links to an existing non-planned studio', () => {
    for (const t of script.tutorials) {
      expect(SCENES[t.id], t.id).toBeTypeOf('function');
      expect(new Set(t.steps.map((s) => s.id)).size).toBe(t.steps.length);
      if (t.studio) expect(STUDIOS.find((s) => s.id === t.studio)?.status).not.toBe('planned');
      for (const s of t.steps) {
        expect(s.say.length).toBeGreaterThan(20);
        expect(s.say.length).toBeLessThan(400); // short, plain sentences
        for (const p of [0, 0.5, 1]) expect(() => SCENES[t.id](s.id, p)).not.toThrow();
      }
    }
  });
  it('narration hash matches the generator (FNV-1a) and is text-sensitive', () => {
    expect(textHash('')).toBe('811c9dc5');
    expect(textHash('a')).toBe('e40c292c');
    expect(textHash('plano')).not.toBe(textHash('plano.'));
    expect(estimateMs('one two three', 1)).toBe(2500);
  });
});
