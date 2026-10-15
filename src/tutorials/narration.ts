/**
 * Narration sources, in order of preference:
 *  1. Pre-generated ElevenLabs MP3s in /public/audio (made offline by scripts/narrate.mjs with the
 *     user's own API key — the key never reaches the browser). A text hash guards against stale audio.
 *  2. The browser's built-in speech synthesis (free, offline, quality varies by device).
 *  3. Captions only.
 */
export interface AudioManifest {
  voice: string;
  model: string;
  generatedAt: string;
  files: Record<string, { file: string; hash: string }>;
}

/** FNV-1a 32-bit hash; the same function is used by scripts/narrate.mjs. */
export function textHash(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

let manifestPromise: Promise<AudioManifest | null> | null = null;
export function loadManifest(): Promise<AudioManifest | null> {
  if (!manifestPromise) {
    manifestPromise = fetch(`${import.meta.env.BASE_URL}audio/manifest.json`, { cache: 'no-cache' })
      .then((r) => (r.ok ? (r.json() as Promise<AudioManifest>) : null))
      .catch(() => null);
  }
  return manifestPromise;
}

export function audioFor(m: AudioManifest | null, tutorialId: string, stepId: string, text: string): string | null {
  const f = m?.files[`${tutorialId}/${stepId}`];
  if (!f || f.hash !== textHash(text)) return null;
  return `${import.meta.env.BASE_URL}audio/${f.file}`;
}

export const browserSpeechAvailable = () => typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';

function pickVoice(): SpeechSynthesisVoice | undefined {
  const vs = window.speechSynthesis.getVoices();
  const en = vs.filter((v) => v.lang.toLowerCase().startsWith('en'));
  return en.find((v) => /natural|neural|online/i.test(v.name)) ?? en.find((v) => /google|samantha|daniel|serena/i.test(v.name)) ?? en[0];
}

export function speakBrowser(text: string, rate: number, onEnd: () => void): () => void {
  if (!browserSpeechAvailable()) {
    onEnd();
    return () => {};
  }
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = rate;
  const v = pickVoice();
  if (v) u.voice = v;
  let done = false;
  u.onend = () => {
    if (!done) {
      done = true;
      onEnd();
    }
  };
  u.onerror = u.onend;
  synth.speak(u);
  return () => {
    done = true;
    synth.cancel();
  };
}

/** Rough reading time for captions-only mode and progress estimates (~2.6 words per second at 1×). */
export const estimateMs = (text: string, rate = 1) => Math.max(2500, (text.split(/\s+/).length / 2.6) * 1000) / rate;

const WATCHED = 'iris.tutorialsWatched';
export function watchedTutorials(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(WATCHED) ?? '[]');
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
export function markWatched(id: string) {
  try {
    const w = new Set(watchedTutorials());
    w.add(id);
    localStorage.setItem(WATCHED, JSON.stringify([...w]));
  } catch {
    /* per-browser convenience only */
  }
}
