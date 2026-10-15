#!/usr/bin/env node
/**
 * Generate tutorial narration with ElevenLabs text-to-speech.
 *
 *   ELEVENLABS_API_KEY=...  node scripts/narrate.mjs            # generate missing/changed steps
 *   node scripts/narrate.mjs --dry-run                          # show what would be generated + character count
 *
 * Optional env: ELEVENLABS_VOICE_ID (exact voice) or ELEVENLABS_VOICE_NAME (default "Amila"),
 *               ELEVENLABS_MODEL (default "eleven_multilingual_v2").
 * Output: public/audio/<tutorial>/<step>.mp3 + public/audio/manifest.json.
 * The API key is read from the environment only; it is never written to disk or bundled into the app.
 * Only steps whose text changed (hash mismatch) are regenerated, to avoid spending credits twice.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const script = JSON.parse(readFileSync(join(root, 'src/tutorials/script.json'), 'utf8'));
const outDir = join(root, 'public/audio');
const manifestPath = join(outDir, 'manifest.json');
const dry = process.argv.includes('--dry-run');
const API = 'https://api.elevenlabs.io/v1';

/** FNV-1a 32-bit — must match textHash() in src/tutorials/narration.ts. */
function textHash(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

const old = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : { files: {} };
const jobs = [];
for (const t of script.tutorials) {
  for (const s of t.steps) {
    const key = `${t.id}/${s.id}`;
    const file = `${t.id}/${s.id}.mp3`;
    const hash = textHash(s.say);
    const prev = old.files?.[key];
    if (prev && prev.hash === hash && existsSync(join(outDir, file))) continue;
    jobs.push({ key, file, hash, text: s.say });
  }
}
const chars = jobs.reduce((n, j) => n + j.text.length, 0);
console.log(`${jobs.length} step(s) to generate, ${chars} characters.`);
if (dry || jobs.length === 0) {
  for (const j of jobs) console.log(`  ${j.key}  (${j.text.length} chars)`);
  process.exit(0);
}

const key = process.env.ELEVENLABS_API_KEY;
if (!key) {
  console.error('Set ELEVENLABS_API_KEY in your environment first (it is not stored anywhere by this script).');
  process.exit(1);
}
const headers = { 'xi-api-key': key, 'Content-Type': 'application/json' };
const model = process.env.ELEVENLABS_MODEL || 'eleven_multilingual_v2';

let voiceId = process.env.ELEVENLABS_VOICE_ID;
let voiceName = voiceId;
if (!voiceId) {
  const want = (process.env.ELEVENLABS_VOICE_NAME || 'Amila').toLowerCase();
  const r = await fetch(`${API}/voices`, { headers });
  if (!r.ok) {
    console.error(`Could not list voices (${r.status}): ${await r.text()}`);
    process.exit(1);
  }
  const { voices } = await r.json();
  const v = voices.find((x) => x.name.toLowerCase().startsWith(want)) ?? voices[0];
  if (!v) {
    console.error('No voices available on this ElevenLabs account.');
    process.exit(1);
  }
  voiceId = v.voice_id;
  voiceName = v.name;
}
console.log(`Voice: ${voiceName} · model: ${model}`);

const files = { ...(old.files ?? {}) };
for (const j of jobs) {
  const r = await fetch(`${API}/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ text: j.text, model_id: model, voice_settings: { stability: 0.5, similarity_boost: 0.75, speed: 1.0 } }),
  });
  if (!r.ok) {
    console.error(`Failed on ${j.key} (${r.status}): ${await r.text()}`);
    break; // keep what succeeded; rerun to continue
  }
  const dest = join(outDir, j.file);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, Buffer.from(await r.arrayBuffer()));
  files[j.key] = { file: j.file, hash: j.hash };
  writeFileSync(manifestPath, JSON.stringify({ voice: voiceName, model, generatedAt: new Date().toISOString(), files }, null, 1));
  console.log(`  ✓ ${j.key}`);
}
console.log('Done. Restart or reload the app; tutorials now use these recordings.');
