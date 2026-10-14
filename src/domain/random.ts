/** Deterministic seeded PRNG (mulberry32). Same seed → same variant. */
export function rng(seed: number) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int: (lo: number, hi: number) => lo + Math.floor(next() * (hi - lo + 1)),
    pick: <T,>(xs: readonly T[]): T => xs[Math.floor(next() * xs.length)],
    /** Quarter-dioptre value in [lo, hi]. */
    quarter: (lo: number, hi: number) => (lo * 4 + Math.floor(next() * ((hi - lo) * 4 + 1))) / 4,
  };
}

export function newSeed(): number {
  return Math.floor(Math.random() * 2 ** 31);
}

export function uid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}
