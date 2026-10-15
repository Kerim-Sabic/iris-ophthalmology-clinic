import { describe, expect, it } from 'vitest';
import { PLAIN_TERMS, segmentTerms } from '../src/content/plainTerms';
import script from '../src/tutorials/script.json';

describe('plain-English term linking', () => {
  it('links the longest matching phrase, once per text, and keeps the text intact', () => {
    const text = 'A relative afferent pupillary defect is not a big pupil; the pupil and the RAPD differ.';
    const segs = segmentTerms(text);
    expect(segs.map((s) => s.text).join('')).toBe(text);
    const ids = segs.filter((s) => s.term).map((s) => s.term!.id);
    expect(ids).toEqual(['rapd', 'pupil']);
  });
  it('abbreviations only match in capitals (OS is linked, "os" inside words or lowercase is not)', () => {
    expect(segmentTerms('Test OS first').some((s) => s.term?.id === 'od-os')).toBe(true);
    expect(segmentTerms('the os and costs').some((s) => s.term)).toBe(false);
  });
  it('does not match inside longer words', () => {
    expect(segmentTerms('axisymmetric spheres').some((s) => s.term?.id === 'axis')).toBe(false);
  });
  it('every term has a unique id, a short plain explanation, and any tutorial link exists', () => {
    const tut = new Set(script.tutorials.map((t) => t.id));
    expect(new Set(PLAIN_TERMS.map((t) => t.id)).size).toBe(PLAIN_TERMS.length);
    for (const t of PLAIN_TERMS) {
      expect(t.plain.length).toBeLessThan(220);
      if (t.tutorial) expect(tut.has(t.tutorial), t.id).toBe(true);
    }
  });
});
