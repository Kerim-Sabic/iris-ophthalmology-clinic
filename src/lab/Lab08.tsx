import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../app/context';
import { newSeed, rng } from '../domain/random';
import {
  DEFAULT_SETTINGS, KIND_TEXT, LAYERS, LAYER_ORDER, SCENES, TECHNIQUE_NAME, emptyLog, gradeDocumentation, layerAtFocus, logExposure,
  technique, visibility, type DocEntry, type ExposureLog, type FindingKind, type LampSettings, type Layer, type Scene, type SlitGrade,
} from '../domain/slitlamp';
import { now } from '../lib/store';
import { Feedback, Pill, Seg } from '../ui/kit';

type Mode = 'explore' | 'guided' | 'challenge' | 'patient';
const PX = 18; // px per mm in the microscope view

const GUIDE = [
  'Start wide (diffuse) to survey; note that depth cannot be judged.',
  'Narrow the beam to ≤ 0.3 mm and widen the angle to ≥ 30° to make an optical section.',
  'Move the beam over the finding and move the focus through the corneal layers until it is localised.',
  'Document the layer and description, then list what you did not examine.',
];

export function Lab08() {
  const { recordAttempt } = useApp();
  const [mode, setMode] = useState<Mode>('explore');
  const [tab, setTab] = useState<'lamp' | 'penlight'>('lamp');
  const [seed, setSeed] = useState(newSeed());
  const [sceneId, setSceneId] = useState(SCENES[0].id);
  const scene: Scene = useMemo(() => {
    if (mode === 'guided') return SCENES[0];
    if (mode === 'patient') return SCENES[1];
    if (mode === 'challenge') return rng(seed).pick(SCENES);
    return SCENES.find((s) => s.id === sceneId)!;
  }, [mode, seed, sceneId]);
  const [s, setS] = useState<LampSettings>(DEFAULT_SETTINGS);
  const [log, setLog] = useState<ExposureLog>(emptyLog());
  const [overlay, setOverlay] = useState(false);
  const [entries, setEntries] = useState<DocEntry[]>([]);
  const [draft, setDraft] = useState<{ layer: Layer | ''; kind: FindingKind | 'normal' | '' }>({ layer: '', kind: '' });
  const [grade, setGrade] = useState<SlitGrade | null>(null);
  const [startedAt, setStartedAt] = useState(now());
  const [penSteps, setPenSteps] = useState<number[]>([]);

  const reset = () => {
    setS(DEFAULT_SETTINGS);
    setLog(emptyLog());
    setEntries([]);
    setGrade(null);
    setPenSteps([]);
    setStartedAt(now());
  };
  useEffect(reset, [scene.id]);
  useEffect(() => setLog((l) => logExposure(l, scene, s)), [s, scene]);

  const t = technique(s);
  const focusLayer = layerAtFocus(s);
  const vis = scene.findings.map((f) => ({ f, v: visibility(s, f) }));
  const seen = vis.filter((x) => x.v.seen);
  const labelsAllowed = mode === 'explore' || mode === 'guided';
  const set = (p: Partial<LampSettings>) => setS((o) => ({ ...o, ...p }));

  const submit = async () => {
    const g = gradeDocumentation(scene, log, entries);
    setGrade(g);
    await recordAttempt({
      itemId: `LAB08-${scene.id}`, itemVersion: 1, familyId: 'F-SLIT-DOCUMENT', objectiveIds: ['SLT-EXPOSE', 'SLT-DOCUMENT'], lectureIds: ['L12', 'L17', 'L18'],
      seed: mode === 'challenge' ? seed : null, taskType: 'procedural-sequence', mode: 'learning', response: { entries, techniques: log.techniques, sectioned: log.sectioned },
      correct: g.correct, scores: { supportedEntries: g.rows.filter((r) => r.verdict.startsWith('supported')).length, missed: g.missed.length, unexamined: g.unexamined.length },
      confidence: null, hintLevel: 0, misconceptionIds: g.rows.some((r) => r.verdict.startsWith('unsupported')) ? ['M-FINDING-AS-CERTAINTY'] : [], startedAt, state: { sceneId: scene.id },
    });
  };

  // ---------------- microscope view geometry
  const W = 300;
  const cx = W / 2;
  const cy = W / 2;
  const bx = cx + s.beamX * PX;
  const bw = Math.max(2, s.beamWidthMm * PX);
  const bh = Math.min(W, s.beamHeightMm * PX);
  const retro = t === 'retroillumination';

  return (
    <div className="stack" data-testid="lab08">
      <h1>LAB08 · Slit lamp and anterior segment</h1>
      <p className="small muted">Original constrained schematic (not clinical images) · declared depth-of-field and technique rules · draft, not clinically reviewed. Virtual control does not demonstrate safe use of a real slit lamp. No cell or flare grades are given.</p>
      <div className="row">
        <Seg label="Studio mode" value={mode} onChange={(m) => { setMode(m); setOverlay(false); }} options={[{ value: 'explore', label: 'Explore' }, { value: 'guided', label: 'Guided practice' }, { value: 'challenge', label: 'Independent challenge' }, { value: 'patient', label: 'Patient case' }]} />
        {mode === 'explore' && (
          <select aria-label="Scene" value={sceneId} onChange={(e) => setSceneId(e.target.value)} style={{ maxWidth: 160 }}>
            {SCENES.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
          </select>
        )}
        {mode === 'challenge' && <button className="btn sm" onClick={() => setSeed(newSeed())}>New hidden scene</button>}
        <button className="btn sm" onClick={reset}>Reset</button>
        <span className="tiny muted num">{mode === 'challenge' ? `seed ${seed}` : scene.label}</span>
      </div>
      <div className="banner small">{scene.vignette}</div>
      <Seg label="Examination" value={tab} onChange={setTab} options={[{ value: 'lamp', label: 'Slit lamp (T042–T044, T046)' }, { value: 'penlight', label: 'Penlight / external (T041)' }]} />
      {tab === 'penlight' ? (
        <div className="panel stack" data-testid="penlight">
          <p className="small">Examine systematically. A penlight shows gross surface findings only; it is not equivalent to a slit-lamp examination.</p>
          <div className="row">
            {['Lids and lashes', 'Conjunctiva and sclera', 'Cornea (surface reflex)', 'Anterior chamber (gross)', 'Pupils'].map((label, i) => (
              <button key={i} className={`btn sm ${penSteps.includes(i) ? 'primary' : ''}`} onClick={() => !penSteps.includes(i) && setPenSteps([...penSteps, i])}>
                {i + 1}. {label}
              </button>
            ))}
          </div>
          <ul className="small" data-testid="penlight-obs">
            {penSteps.map((i) => (
              <li key={i}>{i === 2 || i === 3 ? scene.penlight.join(' ') : 'No gross abnormality reported in this authored scene.'}</li>
            ))}
          </ul>
        </div>
      ) : (
        <>
          <div className="lab">
            <aside className="controls-col panel stack small">
              <h3>Lamp controls</h3>
              <Slider label={`Beam width: ${s.beamWidthMm.toFixed(1)} mm`} min={0.1} max={8} step={0.1} value={s.beamWidthMm} onChange={(v) => set({ beamWidthMm: v })} />
              <Slider label={`Beam height: ${s.beamHeightMm.toFixed(1)} mm`} min={1} max={10} step={0.5} value={s.beamHeightMm} onChange={(v) => set({ beamHeightMm: v })} />
              <Slider label={`Illumination angle: ${s.angleDeg}°`} min={0} max={60} step={1} value={s.angleDeg} onChange={(v) => set({ angleDeg: v })} />
              <Slider label={`Focus depth: ${s.focusMm.toFixed(2)} mm`} min={0} max={9.5} step={0.01} value={s.focusMm} onChange={(v) => set({ focusMm: v })} />
              <Slider label={`Beam position: ${s.beamX.toFixed(1)} mm`} min={-6} max={6} step={0.1} value={s.beamX} onChange={(v) => set({ beamX: v })} />
              <div>
                <div className="muted">Magnification</div>
                <Seg label="Magnification" value={String(s.magnification) as '6' | '10' | '16' | '25'} onChange={(v) => set({ magnification: Number(v) as LampSettings['magnification'] })} options={[{ value: '6', label: '6×' }, { value: '10', label: '10×' }, { value: '16', label: '16×' }, { value: '25', label: '25×' }]} />
              </div>
              <label className="row">
                <input type="checkbox" checked={s.roomDark} onChange={(e) => set({ roomDark: e.target.checked })} /> Room lights off
              </label>
              {labelsAllowed && (
                <label className="row">
                  <input type="checkbox" checked={overlay} onChange={(e) => setOverlay(e.target.checked)} /> Teaching overlay (layer names)
                </label>
              )}
              {mode === 'guided' && (
                <ol className="small" style={{ paddingLeft: 18 }}>
                  {GUIDE.map((g, i) => <li key={i}>{g}</li>)}
                </ol>
              )}
            </aside>
            <section className="canvas-col stack">
              <div className="canvas-wrap">
                <svg viewBox={`0 0 ${W} ${W}`} role="img" aria-label={`Microscope view. ${TECHNIQUE_NAME[t]}. ${seen.length ? seen.map((x) => (x.v.seen ? x.v.text : '')).join(' ') : 'No finding visible with these settings.'}`} data-testid="microscope">
                  <rect width={W} height={W} rx={10} fill={s.roomDark ? '#0b0b0d' : '#2a2a30'} />
                  <circle cx={cx} cy={cy} r={6 * PX} fill={retro ? '#2b1414' : '#4b3a2a'} />
                  <circle cx={cx} cy={cy} r={2 * PX} fill={retro ? '#b5402c' : '#0d0b0a'} />
                  {retro && seen.map(({ f }) => <ellipse key={f.id} cx={cx + f.x * PX} cy={cy} rx={f.halfWidth * PX * 0.9} ry={f.halfWidth * PX * 0.7} fill="#3a0f0a" opacity={0.85} />)}
                  {!retro && (
                    <rect x={bx - bw / 2} y={cy - bh / 2} width={bw} height={bh} fill="rgba(255,248,220,0.55)" />
                  )}
                  {t === 'optical-section' && (
                    <path d={`M${bx + 4},${cy - bh / 2} q ${8 + s.angleDeg / 6},${bh / 2} 0,${bh} l ${3 + (s.focusMm < 0.6 ? 4 : 1)},0 q ${8 + s.angleDeg / 6},${-bh / 2} 0,${-bh} z`} fill="rgba(255,255,255,0.8)" />
                  )}
                  {!retro && seen.map(({ f }) => {
                    const x = cx + f.x * PX;
                    if (f.kind === 'opacity') return <ellipse key={f.id} cx={x} cy={cy - 6} rx={f.halfWidth * PX * 0.7} ry={f.halfWidth * PX * 0.5} fill="#e9e6df" opacity={0.9} />;
                    if (f.kind === 'deposits') return <g key={f.id}>{[-20, -8, 4, 16, -14, 10].map((d, i) => <circle key={i} cx={bx + (i % 2 ? 2 : -2)} cy={cy + 30 + d} r={2.2} fill="#7a5a3a" />)}</g>;
                    if (f.kind === 'cells') return <g key={f.id}>{[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={bx + ((i * 7) % 5) - 2} cy={cy - 10 + i * 4} r={1.2} fill="#fff" />)}</g>;
                    return null;
                  })}
                  <text x={8} y={W - 8} fontSize="11" fill="#ddd">{TECHNIQUE_NAME[t]} · {s.magnification}×</text>
                </svg>
              </div>
              <div className="canvas-wrap">
                <SideView s={s} scene={scene} overlay={overlay} log={log} />
              </div>
            </section>
            <aside className="stack">
              <div className="panel stack small" aria-live="polite" data-testid="slit-observation">
                <h3>Observation</h3>
                <p><b>{TECHNIQUE_NAME[t]}</b>{t === 'optical-section' || t === 'conical-beam' ? <> · focal plane in: <b>{focusLayer && (labelsAllowed || overlay) ? LAYERS[focusLayer].name : focusLayer ? `${s.focusMm.toFixed(2)} mm deep` : '—'}</b></> : null}</p>
                {seen.length ? (
                  <ul>{seen.map(({ f, v }) => <li key={f.id}>{v.seen ? v.text : ''}</li>)}</ul>
                ) : (
                  <p>No finding visible with these settings.</p>
                )}
                <p className="tiny muted">Not seeing something is not evidence of absence unless that region was examined with a technique able to reveal it.</p>
              </div>
              <div className="panel stack small">
                <h3>Exposed in section</h3>
                <div className="row" data-testid="sectioned">
                  {log.sectioned.length ? log.sectioned.map((l) => <Pill key={l} tone="info">{LAYERS[l].name}</Pill>) : <span className="muted">None yet</span>}
                </div>
                <div className="tiny muted">Techniques used: {log.techniques.map((x) => TECHNIQUE_NAME[x]).join(', ')}</div>
              </div>
              <div className="panel stack small" data-testid="slit-notebook">
                <h3>Document</h3>
                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  <select aria-label="Layer" value={draft.layer} onChange={(e) => setDraft({ ...draft, layer: e.target.value as Layer })} disabled={!!grade}>
                    <option value="">Layer…</option>
                    {LAYER_ORDER.map((l) => <option key={l} value={l}>{LAYERS[l].name}</option>)}
                  </select>
                  <select aria-label="Description" value={draft.kind} onChange={(e) => setDraft({ ...draft, kind: e.target.value as FindingKind | 'normal' })} disabled={!!grade}>
                    <option value="">Description…</option>
                    <option value="normal">No abnormality seen</option>
                    {(['opacity', 'deposits', 'cells', 'flare'] as FindingKind[]).map((k) => <option key={k} value={k}>{KIND_TEXT[k]}</option>)}
                  </select>
                </div>
                <button className="btn sm" disabled={!draft.layer || !draft.kind || !!grade} onClick={() => { setEntries([...entries, { layer: draft.layer as Layer, kind: draft.kind as FindingKind | 'normal' }]); setDraft({ layer: '', kind: '' }); }}>
                  Add to note
                </button>
                <ul data-testid="slit-entries">{entries.map((e, i) => <li key={i}>{LAYERS[e.layer].name}: {e.kind === 'normal' ? 'no abnormality seen' : KIND_TEXT[e.kind]}</li>)}</ul>
                {!grade && <button className="btn primary" disabled={!entries.length} onClick={submit} data-testid="submit-slit">Submit documentation</button>}
                {grade && (
                  <>
                    <table className="data" data-testid="slit-grade"><tbody>{grade.rows.map((r, i) => <tr key={i}><td>{r.entry}</td><td>{r.verdict}</td></tr>)}</tbody></table>
                    <Feedback
                      tone={grade.correct ? 'good' : 'warn'}
                      title={grade.correct ? 'Documentation supported by what you exposed' : 'Documentation incomplete or unsupported'}
                      items={[
                        ...(grade.missed.length ? [`${grade.missed.length} finding(s) present in this scene were not documented.`] : []),
                        `Not examined in section (must not be written as normal): ${grade.unexamined.map((l) => LAYERS[l].name).join(', ') || 'none'}.`,
                      ]}
                    />
                  </>
                )}
              </div>
            </aside>
          </div>
          <div className="panel small muted">
            Planned / not modelled: <Pill>T045 Van Herick (LAB10)</Pill> <Pill>T047 fluorescein staining (LAB09)</Pill> <Pill>T046 cell/flare grading — needs a verified grading standard</Pill>. Specular reflection and sclerotic scatter are not modelled.
          </div>
        </>
      )}
    </div>
  );
}

function Slider({ label, min, max, step, value, onChange }: { label: string; min: number; max: number; step: number; value: number; onChange(v: number): void }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type="range" min={min} max={max} step={step} value={value} aria-label={label.split(':')[0]} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

/** Side schematic (teaching aid): depth bands, focal plane and beam path. Findings appear only once localised. */
function SideView({ s, scene, overlay, log }: { s: LampSettings; scene: Scene; overlay: boolean; log: ExposureLog }) {
  const W = 460;
  const H = 150;
  const x0 = 30;
  const zx = (mm: number) => x0 + ((W - x0 - 10) * mm) / 9.5;
  const fill: Partial<Record<Layer, string>> = { stroma: '#d9e6ee', epithelium: '#b8cfdc', endothelium: '#8fb0c4', 'anterior-chamber': '#eef6fb', iris: '#8a6a4a', 'lens-anterior': '#f1ead2', 'lens-nucleus': '#e6d9ae', 'lens-posterior': '#f1ead2', 'anterior-vitreous': '#f5f5f0' };
  const a = (s.angleDeg * Math.PI) / 180;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Side schematic of the anterior segment with the focal plane">
      <title>Side schematic (teaching aid, not to scale)</title>
      {LAYER_ORDER.filter((l) => l !== 'tear-film').map((l) => (
        <rect key={l} x={zx(LAYERS[l].from)} y={30} width={Math.max(2, zx(LAYERS[l].to) - zx(LAYERS[l].from))} height={90} fill={fill[l] ?? '#eee'} stroke="var(--line)" />
      ))}
      {overlay && LAYER_ORDER.filter((l) => ['stroma', 'anterior-chamber', 'iris', 'lens-nucleus', 'lens-posterior'].includes(l)).map((l) => (
        <text key={l} x={(zx(LAYERS[l].from) + zx(LAYERS[l].to)) / 2} y={134} fontSize="9" textAnchor="middle" fill="var(--ink-2)">{LAYERS[l].name.replace('Lens: ', 'lens ').replace(' (aqueous)', '')}</text>
      ))}
      {scene.findings.filter((f) => log.localised.includes(f.id)).map((f) => (
        <circle key={f.id} cx={(zx(LAYERS[f.layer].from) + zx(LAYERS[f.layer].to)) / 2} cy={75} r={5} fill="var(--proposal)" />
      ))}
      <line x1={zx(s.focusMm)} x2={zx(s.focusMm)} y1={22} y2={126} stroke="var(--probe)" strokeWidth={2} strokeDasharray="4 3" />
      <line x1={zx(s.focusMm) - 120 * Math.cos(a)} y1={75 - 120 * Math.sin(a)} x2={zx(s.focusMm)} y2={75} stroke="#e0b030" strokeWidth={Math.max(1, Math.min(10, s.beamWidthMm * 2))} opacity={0.6} />
      <text x={zx(s.focusMm) + 4} y={18} fontSize="10" fill="var(--probe)">focal plane {s.focusMm.toFixed(2)} mm</text>
      <text x={4} y={H - 4} fontSize="9" fill="var(--ink-3)">front ← depth from corneal surface (schematic) → back</text>
    </svg>
  );
}
