import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../app/context';
import {
  EYES,
  findingOf,
  gradePupilInterpretation,
  normalPatient,
  otherEye,
  patientFor,
  pupilCase,
  PUPIL_FINDING_LABELS,
  PUPIL_MODEL,
  segmentObservations,
  simulate,
  strengthOf,
  comparePrediction,
  type Ambient,
  type EfferentState,
  type Eye,
  type LightPos,
  type LightSegment,
  type PupilChange,
  type PupilFinding,
  type PupilFrame,
  type PupilGrade,
  type PupilPatient,
  type SegmentObservation,
} from '../domain/pupils';
import { newSeed, rng } from '../domain/random';
import { now } from '../lib/store';
import { ConfidencePicker, Feedback, Pill, Seg, type Confidence } from '../ui/kit';

type Mode = 'explore' | 'guided' | 'challenge' | 'case';
const EYE_LONG: Record<Eye, string> = { OD: "Patient's RIGHT eye (OD)", OS: "Patient's LEFT eye (OS)" };
const CHANGES: PupilChange[] = ['constricts', 'little change', 'dilates'];
const START: LightSegment[] = [{ light: 'none', ambient: 'light', ticks: 10 }];

interface Vignette { id: string; text: string; finding: PupilFinding; level: number; note: string }
const VIGNETTES: Vignette[] = [
  { id: 'A', finding: 'afferent-OS', level: 0.4, text: 'Fictional case A: a 27-year-old reports that over four days the vision in the left eye has become dim and “washed out”, with an ache on eye movement. Examine the pupils.', note: 'Afferent asymmetry is one piece of evidence; acuity, colour comparison, fields and the optic disc are separate stations (not in this studio).' },
  { id: 'B', finding: 'symp-OD', level: 1, text: 'Fictional case B: a 48-year-old’s partner noticed the right upper eyelid sits slightly lower than the left. No double vision. Examine the pupils in light and dark.', note: 'Lid position, dilation lag and pharmacological confirmation are not modelled here; this schematic only shows the size pattern.' },
  { id: 'C', finding: 'para-OS', level: 1, text: 'Fictional case C: a 60-year-old with a new severe headache, a drooping left upper lid and double vision. Examine the pupils.', note: 'Lid and eye-movement findings are not modelled here. Teaching flag (draft): a new pupil-involving third-nerve picture with headache is treated as urgent in real practice.' },
];

const fmt = (mm: number) => mm.toFixed(1);
function segEnds(segs: LightSegment[]) {
  let n = 0;
  return segs.map((s) => (n += Math.max(1, Math.round(s.ticks))) - 1);
}
function trend(frames: PupilFrame[], i: number, e: Eye): string {
  if (i <= 0) return 'steady';
  const d = frames[i][e] - frames[i - 1][e];
  return d < -0.02 ? 'constricting' : d > 0.02 ? 'dilating' : 'steady';
}

function PupilEyes({ frames, i }: { frames: PupilFrame[]; i: number }) {
  const f = frames[i];
  const cx: Record<Eye, number> = { OD: 150, OS: 450 }; // examiner view: OD on viewer's left
  const aria = `Examiner view. Room: ${f.ambient === 'light' ? 'ambient light' : 'dark'}. Light ${f.light === 'none' ? 'not on either eye' : `on ${f.light}`}. ` + EYES.map((e) => `${EYE_LONG[e]}: pupil about ${fmt(f[e])} mm (schematic), ${trend(frames, i, e)}.`).join(' ');
  return (
    <svg viewBox="0 0 600 250" role="img" aria-label={aria}>
      <rect x="0" y="0" width="600" height="250" fill={f.ambient === 'dark' ? 'var(--surface-2)' : 'var(--surface)'} />
      <text x="300" y="18" textAnchor="middle" fontSize="12" fill="var(--ink-3)">Room: {f.ambient === 'light' ? 'ambient light ☀' : 'dark ☾'} · t = {(f.ms / 1000).toFixed(1)} s</text>
      {EYES.map((e) => (
        <g key={e}>
          <text x={cx[e]} y="40" textAnchor="middle" fontSize="14" fontWeight="600" fill="var(--ink)">{EYE_LONG[e]}</text>
          <text x={cx[e]} y="56" textAnchor="middle" fontSize="11" fill="var(--ink-3)">on viewer’s {e === 'OD' ? 'left' : 'right'}</text>
          <ellipse cx={cx[e]} cy="135" rx="110" ry="58" fill="var(--surface)" stroke="var(--ink-3)" />
          <circle cx={cx[e]} cy="135" r="52" fill="var(--accent-soft)" stroke="var(--ink-3)" />
          <circle cx={cx[e]} cy="135" r={f[e] * 5} fill="var(--ink)" />
          <text x={cx[e]} y="212" textAnchor="middle" fontSize="13" fill="var(--ink)" className="num">≈ {fmt(f[e])} mm</text>
          <text x={cx[e]} y="228" textAnchor="middle" fontSize="11" fill="var(--ink-2)">{trend(frames, i, e) === 'constricting' ? '▼ constricting' : trend(frames, i, e) === 'dilating' ? '▲ dilating' : '— steady'}</text>
        </g>
      ))}
      {f.light !== 'none' && (
        <g aria-hidden="true">
          <polygon points={`${cx[f.light] - 6},248 ${cx[f.light] + 6},248 ${cx[f.light] + 26},150 ${cx[f.light] - 26},150`} fill="var(--warn)" opacity="0.35" />
          <text x={cx[f.light] + (f.light === 'OD' ? 70 : -70)} y="244" textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--warn)">LIGHT → {f.light}</text>
        </g>
      )}
    </svg>
  );
}

function TimelineStrip({ frames, segs, i }: { frames: PupilFrame[]; segs: LightSegment[]; i: number }) {
  const W = 600, n = Math.max(1, frames.length - 1);
  const x = (t: number) => 8 + (t / n) * (W - 16);
  const y = (mm: number) => 112 - ((mm - 1.5) / 6.5) * 86;
  const ends = segEnds(segs);
  const line = (e: Eye) => frames.map((f) => `${x(f.t).toFixed(1)},${y(f[e]).toFixed(1)}`).join(' ');
  return (
    <svg viewBox="0 0 600 122" role="img" aria-label={`Timeline of ${segs.length} conditions; cursor at ${(frames[i].ms / 1000).toFixed(1)} s. OD solid line, OS dashed line.`}>
      {segs.map((s, k) => {
        const a = k === 0 ? 0 : ends[k - 1];
        return (
          <g key={k}>
            <rect x={x(a)} y="2" width={Math.max(1, x(ends[k]) - x(a))} height="16" fill={s.light === 'none' ? 'var(--surface-2)' : 'var(--warn-soft)'} stroke="var(--line)" />
            <text x={(x(a) + x(ends[k])) / 2} y="14" textAnchor="middle" fontSize="9" fill="var(--ink-2)">{s.light === 'none' ? '—' : s.light}{s.ambient === 'dark' ? '☾' : ''}</text>
          </g>
        );
      })}
      <polyline points={line('OD')} fill="none" stroke="var(--target)" strokeWidth="2" />
      <polyline points={line('OS')} fill="none" stroke="var(--proposal)" strokeWidth="2" strokeDasharray="5 3" />
      <line x1={x(i)} x2={x(i)} y1="0" y2="120" stroke="var(--ink)" strokeWidth="1.5" />
      <text x="596" y="118" textAnchor="end" fontSize="9" fill="var(--ink-3)">OD ━  OS ╍ (schematic mm)</text>
    </svg>
  );
}

function PathwayDiagram({ light, patient, reveal }: { light: LightPos; patient: PupilPatient; reveal: boolean }) {
  const affX: Record<Eye, number> = { OD: 90, OS: 510 };
  const ewX: Record<Eye, number> = { OD: 230, OS: 370 };
  const active = light !== 'none';
  const effLabel = (s: EfferentState) => (s === 'parasympathetic' ? 'CN III-type weakness' : s === 'sympathetic' ? 'sympathetic (dilator) pathway impaired — not drawn' : '');
  return (
    <svg viewBox="0 0 600 230" role="img" aria-label={`Schematic light-reflex pathway. ${active ? `Active afferent input from ${light}; both Edinger–Westphal nuclei and both CN III outputs driven.` : 'No torch input.'}`}>
      {EYES.map((e) => {
        const on = light === e;
        const reduced = reveal && patient.afferent[e] < 0.99;
        return (
          <g key={e}>
            <text x={affX[e]} y="18" textAnchor="middle" fontSize="11" fill="var(--ink)">{e} retina / optic nerve</text>
            <line x1={affX[e]} y1="24" x2="300" y2="82" stroke={on ? 'var(--warn)' : 'var(--line)'} strokeWidth={on ? 5 : 2} strokeDasharray={reduced ? '6 4' : undefined} />
            {on && <text x={(affX[e] + 300) / 2} y="44" textAnchor="middle" fontSize="10" fill="var(--ink)">afferent: active</text>}
            {reduced && <text x={(affX[e] + 300) / 2} y="66" textAnchor="middle" fontSize="10" fill="var(--bad)">reduced transmission ({Math.round(patient.afferent[e] * 100)}%)</text>}
            <line x1="300" y1="96" x2={ewX[e]} y2="138" stroke={active ? 'var(--observed)' : 'var(--line)'} strokeWidth={active ? 4 : 2} />
            <text x={ewX[e]} y="152" textAnchor="middle" fontSize="11" fill="var(--ink)">EW nucleus</text>
            <line x1={ewX[e]} y1="158" x2={affX[e]} y2="200" stroke={active ? 'var(--observed)' : 'var(--line)'} strokeWidth={active ? 4 : 2} strokeDasharray={reveal && patient.efferent[e] === 'parasympathetic' ? '6 4' : undefined} />
            <text x={affX[e]} y="216" textAnchor="middle" fontSize="11" fill="var(--ink)">CN III → {e} sphincter</text>
            {reveal && patient.efferent[e] !== 'normal' && <text x={affX[e]} y="229" textAnchor="middle" fontSize="10" fill="var(--bad)">{effLabel(patient.efferent[e])}</text>}
          </g>
        );
      })}
      <rect x="240" y="80" width="120" height="18" rx="4" fill="var(--surface-2)" stroke="var(--line)" />
      <text x="300" y="93" textAnchor="middle" fontSize="11" fill="var(--ink)">pretectal nuclei</text>
    </svg>
  );
}

function guidedHint(o: SegmentObservation | undefined, prev: SegmentObservation | undefined): string {
  if (!o) return 'Start by comparing the two pupil sizes in ambient light and in the dark, with no torch.';
  const aniso = Math.abs(o.endMm.OD - o.endMm.OS);
  if (o.light === 'none') return aniso > 0.3 ? `Pupils differ by ≈${aniso.toFixed(1)} mm. Is the difference larger in light or in dark? That tells you which pupil is failing.` : 'Pupils are equal here. Equal resting pupils are expected with a purely afferent defect.';
  if (prev && prev.light !== 'none' && prev.light !== o.light) {
    if (o.change.OD === 'dilates' && o.change.OS === 'dilates') return `Both pupils dilated when the light moved to ${o.light}: less drive arrives from ${o.light} than from ${prev.light}.`;
    if (o.change.OD === o.change.OS) return 'Both pupils behaved the same on the swing — the shared drive did not fall.';
  }
  if (o.change.OD !== o.change.OS || Math.abs(o.changeMm.OD - o.changeMm.OS) > 0.3) return `The two pupils responded differently to the same light (${o.light}). Shared drive reaches both — so a difference points to one pupil’s own output.`;
  return `Light on ${o.light}: direct (${o.light}) and consensual (${otherEye(o.light as Eye)}) responses are equal.`;
}

export function Lab05() {
  const { recordAttempt, reducedMotion } = useApp();
  const [mode, setModeRaw] = useState<Mode>('explore');
  const [seed, setSeed] = useState(() => newSeed());
  const [custom, setCustom] = useState<PupilPatient>(normalPatient());
  const [segs, setSegs] = useState<LightSegment[]>(START);
  const [cursor, setCursor] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<'0.5' | '1' | '2'>('1');
  const [dwell, setDwell] = useState<'5' | '15'>('15');
  const [predictOn, setPredictOn] = useState(false);
  const [pending, setPending] = useState<{ light: LightPos; ambient: Ambient } | null>(null);
  const [pred, setPred] = useState<Record<Eye, PupilChange | null>>({ OD: null, OS: null });
  const [predCheck, setPredCheck] = useState<{ segment: number; pred: Record<Eye, PupilChange> } | null>(null);
  const [answer, setAnswer] = useState<PupilFinding | null>(null);
  const [conf, setConf] = useState<Confidence | null>(null);
  const [grade, setGrade] = useState<PupilGrade | null>(null);
  const [showPath, setShowPath] = useState(true);
  const [startedAt, setStartedAt] = useState(now());
  const [recordedPred, setRecordedPred] = useState<number | null>(null);

  const vignette = VIGNETTES[rng(seed).int(0, VIGNETTES.length - 1)];
  const drawn = useMemo(() => pupilCase(seed), [seed]);
  const patient = useMemo(() => (mode === 'explore' ? custom : mode === 'case' ? patientFor(vignette.finding, vignette.level) : drawn.patient), [mode, custom, vignette, drawn]);
  const frames = useMemo(() => simulate(patient, segs), [patient, segs]);
  const ends = segEnds(segs);
  const i = Math.min(cursor, frames.length - 1);
  const obs = segmentObservations(frames).filter((o) => ends[o.segment] <= i);
  const last = segs[segs.length - 1];
  const hidden = mode === 'challenge' || mode === 'case';
  const reveal = mode === 'explore' || grade !== null;

  const reset = () => {
    setSegs(START); setCursor(0); setPlaying(false); setPending(null); setPred({ OD: null, OS: null });
    setPredCheck(null); setRecordedPred(null); setAnswer(null); setConf(null); setGrade(null); setStartedAt(now());
  };
  const setMode = (m: Mode) => { setModeRaw(m); setPredictOn(m !== 'explore'); reset(); };

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setCursor((c) => c + 1), PUPIL_MODEL.tickMs / Number(speed));
    return () => clearInterval(id);
  }, [playing, speed]);
  useEffect(() => {
    if (playing && cursor >= frames.length - 1) { setPlaying(false); setCursor(frames.length - 1); }
  }, [playing, cursor, frames.length]);

  const append = (add: LightSegment[]) => {
    const next = [...segs, ...add].slice(-40);
    setSegs(next);
    const nEnds = segEnds(next);
    const firstNew = nEnds[next.length - add.length - 1] + 1;
    if (reducedMotion) { setCursor(nEnds[nEnds.length - 1]); setPlaying(false); }
    else { setCursor(firstNew); setPlaying(true); }
    return next.length - 1;
  };
  const request = (light: LightPos, ambient: Ambient) => {
    if (light === last.light && ambient === last.ambient) return;
    if (predictOn) { setPending({ light, ambient }); setPred({ OD: null, OS: null }); return; }
    append([{ light, ambient, ticks: Number(dwell) }]);
  };
  const commitPrediction = () => {
    if (!pending || !pred.OD || !pred.OS) return;
    const segIndex = append([{ ...pending, ticks: Number(dwell) }]);
    setPredCheck({ segment: segIndex, pred: { OD: pred.OD, OS: pred.OS } });
    setPending(null);
  };
  const predObs = predCheck ? segmentObservations(frames).find((o) => o.segment === predCheck.segment) : undefined;
  const predVisible = predCheck && predObs && i >= ends[predCheck.segment];
  useEffect(() => {
    if (!predCheck || !predObs || !predVisible || recordedPred === predCheck.segment) return;
    setRecordedPred(predCheck.segment);
    const c = comparePrediction(predCheck.pred, predObs);
    const prevLight = segs[predCheck.segment - 1]?.light;
    const swing = prevLight !== undefined && prevLight !== 'none' && predObs.light !== 'none' && prevLight !== predObs.light;
    const mis = predObs.change.OD === predObs.change.OS && predCheck.pred.OD !== predCheck.pred.OS ? ['M-AFFERENT-VS-EFFERENT'] : [];
    void recordAttempt({ itemId: `LAB05-predict-${mode}#${seed}.${predCheck.segment}`, itemVersion: 1, familyId: 'F-PUPIL-PREDICT', objectiveIds: [swing ? 'PUP-RAPD' : 'PUP-AFF-EFF'], lectureIds: ['L09'], seed, taskType: 'prediction', mode: 'learning', response: { condition: segs[predCheck.segment], prediction: predCheck.pred }, correct: c.correct, scores: { OD: c.perEye.OD, OS: c.perEye.OS }, confidence: null, hintLevel: mode === 'guided' ? 1 : 0, misconceptionIds: mis, startedAt, state: { patient, segments: segs } });
  }, [predCheck, predObs, predVisible, recordedPred, mode, seed, segs, patient, startedAt, recordAttempt]);

  const submit = async () => {
    if (!answer) return;
    const truth = findingOf(patient);
    const g = gradePupilInterpretation(truth, answer);
    setGrade(g);
    await recordAttempt({ itemId: `LAB05-${mode}${mode === 'case' ? vignette.id : ''}#${seed}`, itemVersion: 1, familyId: g.isAnisocoriaTask ? 'F-PUPIL-ANISOCORIA' : 'F-PUPIL-LOCALIZE', objectiveIds: g.isAnisocoriaTask ? ['PUP-ANISO'] : ['PUP-AFF-EFF', 'PUP-RAPD'], lectureIds: g.isAnisocoriaTask ? ['L09', 'L25'] : ['L09'], seed, taskType: 'interpretation', mode: 'learning', response: { answer, observations: obs.length }, correct: g.correct, scores: { layer: g.layerCorrect, eye: g.eyeCorrect, mechanism: g.mechanismCorrect }, confidence: conf, hintLevel: mode === 'guided' ? 1 : 0, misconceptionIds: g.misconceptionIds, startedAt, isTransfer: mode === 'challenge', state: { patient, segments: segs } });
  };

  const checklist = [
    { t: 'Compare sizes in ambient light, no torch', done: segs.some((s) => s.light === 'none' && s.ambient === 'light') },
    { t: 'Compare sizes in the dark, no torch', done: segs.some((s) => s.light === 'none' && s.ambient === 'dark') },
    { t: 'Light OD: watch direct (OD) and consensual (OS)', done: segs.some((s) => s.light === 'OD') },
    { t: 'Light OS: watch direct (OS) and consensual (OD)', done: segs.some((s) => s.light === 'OS') },
    { t: 'Swing directly between eyes', done: segs.some((s, k) => k > 0 && s.light !== 'none' && segs[k - 1].light !== 'none' && segs[k - 1].light !== s.light) },
  ];

  return (
    <div className="stack">
      <h1>LAB05 · Pupils and neural light pathways</h1>
      <p className="small muted">Conceptual schematic + constrained simulation of the pupillary light reflex. Diameters, latency and rates are schematic teaching values, not patient data. Draft — not clinically reviewed.</p>
      <div className="row">
        <Seg label="Studio mode" value={mode} onChange={setMode} options={[{ value: 'explore', label: 'Explore' }, { value: 'guided', label: 'Guided practice' }, { value: 'challenge', label: 'Independent challenge' }, { value: 'case', label: 'Patient case' }]} />
        {mode !== 'explore' && <button className="btn sm" onClick={() => { setSeed(newSeed()); reset(); }}>New case</button>}
        <button className="btn sm" onClick={reset}>Reset</button>
        <span className="tiny muted num">seed {seed}</span>
      </div>
      {mode === 'case' && <div className="panel small"><strong>Patient case.</strong> {vignette.text}</div>}
      {mode === 'challenge' && <p className="small">Hidden case: examine with the light and room controls, then record your interpretation. No labels are shown until you submit.</p>}

      <div className="grid cols-2">
        <div className="stack">
          <div className="canvas-wrap"><PupilEyes frames={frames} i={i} /></div>
          <div className="canvas-wrap">
            <TimelineStrip frames={frames} segs={segs} i={i} />
            <div className="row small">
              <button className="btn sm" onClick={() => { setPlaying(false); setCursor(Math.max(0, i - 1)); }} aria-label="Step back one tick">◀ Step</button>
              {!reducedMotion && <button className="btn sm" onClick={() => { if (i >= frames.length - 1) setCursor(0); setPlaying(!playing); }}>{playing ? 'Pause' : 'Play'}</button>}
              <button className="btn sm" onClick={() => { setPlaying(false); setCursor(Math.min(frames.length - 1, i + 1)); }} aria-label="Step forward one tick">Step ▶</button>
              <button className="btn sm" onClick={() => { setPlaying(false); setCursor(ends.find((e) => e > i) ?? frames.length - 1); }}>End of stage</button>
              {!reducedMotion && <Seg label="Playback speed" value={speed} onChange={setSpeed} options={[{ value: '0.5', label: '½×' }, { value: '1', label: '1×' }, { value: '2', label: '2×' }]} />}
            </div>
            <label className="field small">
              <span>Scrub timeline (tick {i} of {frames.length - 1}, {(frames[i].ms / 1000).toFixed(1)} s)</span>
              <input type="range" min={0} max={frames.length - 1} value={i} onChange={(e) => { setPlaying(false); setCursor(Number(e.target.value)); }} />
            </label>
            {reducedMotion && <p className="tiny muted">Reduced motion: no autoplay — each move jumps to the end of the stage; use Step / scrub to inspect intermediate states.</p>}
          </div>
          {(mode !== 'challenge' && mode !== 'case') || reveal ? (
            <div className="canvas-wrap">
              <label className="row small"><input type="checkbox" checked={showPath} onChange={(e) => setShowPath(e.target.checked)} /> Show pathway diagram {reveal ? '(defect marked)' : '(active path only)'}</label>
              {showPath && <PathwayDiagram light={frames[i].light} patient={patient} reveal={reveal} />}
            </div>
          ) : null}
        </div>

        <div className="stack">
          <div className="panel stack">
            <h2>Examination conditions</h2>
            <div className="row small"><span className="muted">Room:</span>
              <Seg label="Room illumination" value={last.ambient} onChange={(a) => request(last.light, a)} options={[{ value: 'light', label: 'Ambient light' }, { value: 'dark', label: 'Dark' }]} />
            </div>
            <div className="row small"><span className="muted">Torch on:</span>
              <Seg label="Torch position" value={last.light} onChange={(l) => request(l, last.ambient)} options={[{ value: 'none', label: 'Neither' }, { value: 'OD', label: 'OD (patient’s right)' }, { value: 'OS', label: 'OS (patient’s left)' }]} />
            </div>
            <div className="row small">
              <span className="muted">Dwell per stage:</span>
              <Seg label="Dwell per stage" value={dwell} onChange={setDwell} options={[{ value: '15', label: '1.5 s' }, { value: '5', label: '0.5 s (rapid)' }]} />
              <label className="row"><input type="checkbox" checked={predictOn} onChange={(e) => setPredictOn(e.target.checked)} /> Predict before each move</label>
            </div>
            {!predictOn && <button className="btn sm" onClick={() => append([{ light: 'none', ambient: 'dark', ticks: 10 }, ...[0, 1, 2, 3].map((k) => ({ light: (k % 2 ? 'OS' : 'OD') as LightPos, ambient: 'dark' as Ambient, ticks: Number(dwell) }))])}>Run swinging-flashlight sequence (dark, OD→OS→OD→OS)</button>}
            {pending && (
              <div className="feedback stack">
                <strong>Predict: torch → {pending.light === 'none' ? 'neither eye' : pending.light}, room {pending.ambient}. What will each pupil do?</strong>
                {EYES.map((e) => (
                  <div key={e} className="row small"><span style={{ minWidth: 150 }}>{EYE_LONG[e]}</span>
                    <Seg label={`Prediction for ${e}`} value={(pred[e] ?? '') as PupilChange} onChange={(v) => setPred({ ...pred, [e]: v })} options={CHANGES.map((c) => ({ value: c, label: c }))} />
                  </div>
                ))}
                <div className="row"><button className="btn primary sm" disabled={!pred.OD || !pred.OS} onClick={commitPrediction}>Move the light</button><button className="btn sm" onClick={() => setPending(null)}>Cancel</button></div>
              </div>
            )}
            {predCheck && predObs && predVisible && (() => {
              const c = comparePrediction(predCheck.pred, predObs);
              return <Feedback tone={c.correct ? 'good' : 'bad'} title={c.correct ? 'Prediction matched the observation' : 'Prediction differed from the observation'} items={EYES.map((e) => `${e}: predicted ${predCheck.pred[e]}, observed ${predObs.change[e]} (${predObs.changeMm[e] >= 0 ? '+' : '−'}${Math.abs(predObs.changeMm[e]).toFixed(1)} mm)`)} />;
            })()}
            {mode === 'guided' && <Feedback tone="info" title="Guide" items={[guidedHint(obs[obs.length - 1], obs[obs.length - 2])]} />}
          </div>

          <div className="panel">
            <h2>Observations log</h2>
            <table className="data small">
              <thead><tr><th>#</th><th>Room</th><th>Torch</th><th>OD</th><th>OS</th></tr></thead>
              <tbody>
                {obs.map((o) => (
                  <tr key={o.segment}>
                    <td className="num">{o.segment}</td><td>{o.ambient}</td><td>{o.light === 'none' ? '—' : o.light}</td>
                    {EYES.map((e) => <td key={e} className="num">{fmt(o.endMm[e])} mm · {o.segment === 0 ? 'baseline' : `${o.change[e]} ${strengthOf(o.changeMm[e])}`}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {mode === 'explore' ? (
            <div className="panel stack">
              <h2>Model state (ground truth, Explore only)</h2>
              {EYES.map((e) => (
                <div key={e} className="stack small">
                  <strong>{EYE_LONG[e]}</strong>
                  <label className="field"><span>Afferent transmission: {Math.round(custom.afferent[e] * 100)}%</span>
                    <input type="range" min={0} max={1} step={0.1} value={custom.afferent[e]} onChange={(ev) => setCustom({ ...custom, afferent: { ...custom.afferent, [e]: Number(ev.target.value) } })} />
                  </label>
                  <Seg label={`Efferent function ${e}`} value={custom.efferent[e]} onChange={(v) => setCustom({ ...custom, efferent: { ...custom.efferent, [e]: v } })} options={[{ value: 'normal', label: 'Normal' }, { value: 'parasympathetic', label: 'CN III-type (schematic)' }, { value: 'sympathetic', label: 'Horner-type (schematic)' }]} />
                </div>
              ))}
              <label className="row small"><input type="checkbox" checked={!!custom.physiologicalAniso} onChange={(e) => setCustom({ ...custom, physiologicalAniso: e.target.checked ? { eye: 'OS', mm: 0.6 } : null })} /> Physiological anisocoria (OS +0.6 mm)</label>
              <p className="tiny muted">Change the model, then re-run conditions: the timeline is re-simulated from the same conditions, so you can compare.</p>
            </div>
          ) : (
            <div className="panel stack">
              <h2>Your interpretation</h2>
              {mode === 'guided' && <ul className="step-list small">{checklist.map((c) => <li key={c.t} className={c.done ? 'done' : ''}>{c.t}</li>)}</ul>}
              <fieldset className="stack small" disabled={grade !== null} style={{ border: 0, padding: 0 }}>
                <legend className="sr-only">Pupil finding</legend>
                {(Object.keys(PUPIL_FINDING_LABELS) as PupilFinding[]).map((f) => (
                  <label key={f} className="row"><input type="radio" name="lab05-answer" checked={answer === f} onChange={() => setAnswer(f)} /> {PUPIL_FINDING_LABELS[f]}</label>
                ))}
              </fieldset>
              <ConfidencePicker value={conf} onChange={setConf} />
              <button className="btn primary" disabled={!answer || grade !== null || obs.length < 2} onClick={submit}>Submit interpretation</button>
              {obs.length < 2 && <span className="tiny muted">Make at least one examination change first.</span>}
              {grade && <Feedback tone={grade.correct ? 'good' : 'bad'} title={grade.correct ? 'Supported by the observations' : 'Not supported'} items={grade.items} />}
              {grade && mode === 'case' && <p className="small muted">{vignette.note}</p>}
              {grade && <div className="row"><Pill tone={grade.layerCorrect ? 'good' : 'bad'}>afferent vs efferent {grade.layerCorrect ? '✓' : '✗'}</Pill><Pill tone={grade.eyeCorrect ? 'good' : 'bad'}>laterality {grade.eyeCorrect ? '✓' : '✗'}</Pill><Pill tone={grade.mechanismCorrect ? 'good' : 'bad'}>mechanism {grade.mechanismCorrect ? '✓' : '✗'}</Pill></div>}
              {!hidden && !grade && <p className="tiny muted">Guided practice: the guide comments on what you observed, never on the hidden answer.</p>}
            </div>
          )}

          <div className="panel small">
            <h3>Planned / not modelled here</h3>
            <ul>
              <li><Pill>planned</Pill> T024 Near response and light–near dissociation — needs its own source-reviewed near-target model; the light-reflex model is deliberately not reused.</li>
              <li><Pill>planned</Pill> T009 Red desaturation / brightness comparison — subjective monocular reports, not a pupil output.</li>
              <li><Pill>planned</Pill> T088 Pharmacological pupil tests — require a source-reviewed protocol; no doses or timings are given.</li>
              <li>Not modelled: dilation lag, pupillary escape, hippus, ptosis and eye movements, and combined lesions.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
