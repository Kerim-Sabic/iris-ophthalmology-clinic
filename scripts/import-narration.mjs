#!/usr/bin/env node
/**
 * Import ElevenLabs web-app downloads (one MP3 per tutorial step, generated in script order) into public/audio.
 *
 *   node scripts/import-narration.mjs "<downloads folder>" "<voice name substring>"
 *
 * Files are matched to steps by the generation timestamp in the ElevenLabs filename, oldest first.
 * The manifest stores a hash of each step's text so edited narration is never paired with stale audio.
 */
import { copyFileSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const [dir, voice] = process.argv.slice(2);
if (!dir || !voice) {
  console.error('Usage: node scripts/import-narration.mjs "<downloads folder>" "<voice name substring>"');
  process.exit(1);
}
function textHash(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}
const script = JSON.parse(readFileSync(join(root, 'src/tutorials/script.json'), 'utf8'));
const steps = script.tutorials.flatMap((t) => t.steps.map((s) => ({ key: `${t.id}/${s.id}`, say: s.say })));
const files = readdirSync(dir).filter((f) => f.endsWith('.mp3') && f.includes(voice)).sort();
if (files.length !== steps.length) {
  console.error(`Found ${files.length} files for "${voice}" but the script has ${steps.length} steps. Nothing imported.`);
  process.exit(1);
}
const out = join(root, 'public/audio');
const manifest = { voice, model: 'ElevenLabs web app (Eleven v4)', generatedAt: new Date().toISOString(), files: {} };
files.forEach((f, i) => {
  const st = steps[i];
  const sec = statSync(join(dir, f)).size / 16000; // 128 kbps
  const cps = st.say.length / sec;
  if (cps < 8 || cps > 18) console.warn(`  ! ${st.key}: ${cps.toFixed(1)} chars/s looks off — check this clip`);
  const rel = `${st.key}.mp3`;
  mkdirSync(dirname(join(out, rel)), { recursive: true });
  copyFileSync(join(dir, f), join(out, rel));
  manifest.files[st.key] = { file: rel, hash: textHash(st.say) };
});
writeFileSync(join(out, 'manifest.json'), JSON.stringify(manifest, null, 1));
console.log(`Imported ${files.length} clips into public/audio.`);
