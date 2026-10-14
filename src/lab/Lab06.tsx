import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../app/context';
import {
  cornealReflex,
  coverEvidence,
  DIRECTION_TEXT,
  EYES,
  findingOf,
  gazePositions,
  gradeCoverAnswer,
  gradeHirschberg,
  initialCoverState,
  isTropia,
  motilityCase,
  MOTILITY_FINDING_LABELS,
  otherEye,
  patientFor,
  runCoverSequence,
  toExaminerX,
  type CoverStep,
  type Direction,
  type Eye,
  type Gaze,
  type HirschbergAnswer,
  type MotilityFinding,
  type MotilityGrade,
  type MotilityPatient,
  type Occluder,
} from '../domain/motility';
import { newSeed, rng } from '../domain/random';
import { now } from '../lib/store';
import { ConfidencePicker, Feedback, Pill, Seg, type Confidence } from '../ui/kit';

type Mode = 'explore' | 'guided' | 'challenge' | 'case';
type Tab = 'cover' | 'hirschberg' | 'gaze';
const EYE_LONG: Record<Eye, string> = { OD: "Patient's RIGHT eye (OD)", OS: "Patient's LEFT eye (OS)" };
const CX: Record<Eye, number> = { OD: 190, OS: 410 }; // examiner view: OD on the viewer's left
const PX_PER_PD = 0.8;
const PX_PER_MM_CORNEA = 5.5;

interface Vignette { id: string; text: string; finding: MotilityFinding; mag: number; deficit: Eye | null; note: string }
const VIGNETTES: Vignette[] = [
  { id: 'A', finding: 'ET-OD', mag: 25, deficit: 'OD', text: 'Fictional case A: a 45-year-old reports new horizontal double vision, worse when looking to the right. Examine alignment and eye movements.', note: 'A schematic right abduction limitation is modelled. Measurement in each gaze position and the neurological context are not modelled here.' },
  { id: 'B', finding: 'ET-OS', mag: 20, deficit: null, text: 'Fictional case B: the parents of a 4-year-old notice that the left eye seems to turn in, especially in photographs. Examine alignment.', note: 'In a child a manifest deviation raises the question of amblyopia (L26); acuity is a separate station.' },
  { id: 'C', finding: 'exophoria', mag: 12, deficit: null, text: 'Fictional case C: a 22-year-old student reports tired eyes after long reading sessions, without constant double vision. Examine alignment.', note: 'Near point of convergence (T035) and prism measurement (T031) are planned, not modelled.' },
];

const arrowFor = (e: Eye, d: Direction) => (d === 'none' ? '' : toExaminerX(e, d === 'in' ? 1 : -1) > 0 ? '→ toward viewer’s right' : '← toward viewer’s left');

interface FaceProps {
  posPx: Record<Eye, { x: number; y: number }>;
  occluder: Occluder;
  reflexPx?: Record<Eye, number | null>;
  target: { x: number; y: number; label: string };
  notes?: Record<Eye, string>;
  aria: string;
}
function Face({ posPx, occluder, reflexPx, target, notes, aria }: FaceProps) {
  return (
    <svg viewBox="0 -30 600 330" role="img" aria-label={aria}>
      <rect x="0" y="0" width="600" height="300" fill="var(--surface)" />
      <circle cx={300 + target.x} cy={30 + target.y} r="7" fill="var(--target)" stroke="var(--ink)" />
      <text x={300 + target.x} y={14 + target.y} textAnchor="middle" fontSize="11" fill="var(--ink-2)">{target.label}</text>
      <ellipse cx="300" cy="175" rx="250" ry="120" fill="none" stroke="var(--line)" strokeWidth="2" />
      <path d="M300 150 L288 205 L312 205" fill="none" stroke="var(--ink-3)" strokeWidth="2" />
      <text x="300" y="222" textAnchor="middle" fontSize="10" fill="var(--ink-3)">nose</text>
      {EYES.map((e) => (
        <g key={e}>
          <text x={CX[e]} y="92" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--ink)">{EYE_LONG[e]}</text>
          <text x={CX[e]} y="106" textAnchor="middle" fontSize="10" fill="var(--ink-3)">viewer’s {e === 'OD' ? 'left' : 'right'} · {e === 'OD' ? 'temporal ← | → nasal' : 'nasal ← | → temporal'}</text>
          <ellipse cx={CX[e]} cy="160" rx="70" ry="32" fill="var(--surface-2)" stroke="var(--ink-3)" />
          <g>
            <circle cx={CX[e] + posPx[e].x} cy={160 + posPx[e].y} r="24" fill="var(--accent-soft)" stroke="var(--ink-3)" />
            <circle cx={CX[e] + posPx[e].x} cy={160 + posPx[e].y} r="9" fill="var(--ink)" />
            {reflexPx && reflexPx[e] !== null && occluder !== e && <circle cx={CX[e] + posPx[e].x + (reflexPx[e] ?? 0)} cy={160 + posPx[e].y - 2} r="3.2" fill="#ffffff" stroke="var(--ink)" strokeWidth="1" />}
          </g>
          {occluder === e && (
            <g>
              <rect x={CX[e] - 82} y="118" width="164" height="84" rx="10" fill="var(--ink-2)" opacity="0.92" />
              <text x={CX[e]} y="166" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--surface)">OCCLUDER on {e}</text>
            </g>
          )}
          {notes && <text x={CX[e]} y="222" textAnchor="middle" fontSize="11" fill="var(--ink)" fontWeight="600">{notes[e]}</text>}
        </g>
      ))}
    </svg>
  );
}

export function Lab06() {
  const { recordAttempt, reducedMotion } = useApp();
  const [mode, setModeRaw] = useState<Mode>('explore');
  const [tab, setTab] = useState<Tab>('cover');
  const [seed, setSeed] = useState(() => newSeed());
  const [custom, setCustom] = useState<MotilityPatient>(patientFor('ET-OS', 20));
  const [actions, setActions] = useState<Occluder[]>([]);
  const [vi, setVi] = useState(0);
  const [phase, setPhase] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [predictOn, setPredictOn] = useState(false);
  const [pending, setPending] = useState<Occluder | null>(null);
  const [pred, setPred] = useState<Partial<Record<Eye, Direction>>>({});
  const [predResult, setPredResult] = useState<{ ok: boolean; items: string[] } | null>(null);
  const [answer, setAnswer] = useState<MotilityFinding | null>(null);
  const [conf, setConf] = useState<Confidence | null>(null);
  const [grade, setGrade] = useState<MotilityGrade | null>(null);
  const [hAns, setHAns] = useState<Partial<HirschbergAnswer>>({});
  const [hGrade, setHGrade] = useState<ReturnType<typeof gradeHirschberg> | null>(null);
  const [gaze, setGaze] = useState<Gaze>({ h: 0, v: 0 });
  const [gazeMode, setGazeMode] = useState<'version' | 'duction'>('version');
  const [ductionEye, setDuctionEye] = useState<Eye>('OD');
  const [startedAt, setStartedAt] = useState(now());

  const vignette = VIGNETTES[rng(seed).int(0, VIGNETTES.length - 1)];
  const drawn = useMemo(() => motilityCase(seed), [seed]);
  const patient = useMemo<MotilityPatient>(() => {
    if (mode === 'explore') return custom;
    if (mode === 'case') return { ...patientFor(vignette.finding, vignette.mag), abductionDeficit: vignette.deficit };
    if (mode === 'guided') return patientFor('ET-OS', 20); // stated K2 fixture for scaffolded prediction
    return drawn.patient;
  }, [mode, custom, vignette, drawn]);
  const steps = useMemo(() => runCoverSequence(patient, actions), [patient, actions]);
  const s: CoverStep = steps[Math.min(vi, steps.length - 1)];
  const hidden = mode === 'challenge' || mode === 'case';
  const reveal = !hidden || grade !== null;
  const occ = steps[steps.length - 1].after.occluder;

  const reset = () => {
    setActions([]); setVi(0); setPhase(1); setPlaying(false); setPending(null); setPred({}); setPredResult(null);
    setAnswer(null); setConf(null); setGrade(null); setHAns({}); setHGrade(null); setGaze({ h: 0, v: 0 }); setStartedAt(now());
  };
  const setMode = (m: Mode) => { setModeRaw(m); setPredictOn(m === 'guided'); reset(); };

  // step animation: phase 0 → 1 (presentation only; the model state is the discrete step)
  useEffect(() => {
    if (phase >= 1) return;
    if (reducedMotion) { setPhase(1); return; }
    const id = setTimeout(() => setPhase((p) => Math.min(1, p + 0.1)), 40);
    return () => clearTimeout(id);
  }, [phase, reducedMotion]);
  useEffect(() => {
    if (!playing || phase < 1) return;
    if (vi >= steps.length - 1) { setPlaying(false); return; }
    const id = setTimeout(() => { setVi(vi + 1); setPhase(0); }, 500);
    return () => clearTimeout(id);
  }, [playing, phase, vi, steps.length]);

  const view = (k: number, animate: boolean) => { setVi(k); setPhase(animate && !reducedMotion ? 0 : 1); };
  const append = (add: Occluder[]) => {
    const next = [...actions, ...add].slice(-30);
    setActions(next);
    view(next.length - add.length + 1, true);
  };
  const request = (o: Occluder) => {
    if (o === occ) return;
    if (predictOn) { setPending(o); setPred({}); setPredResult(null); return; }
    append([o]);
  };
  const visibleAfter = (o: Occluder) => EYES.filter((e) => e !== o);
  const commitPrediction = async () => {
    if (pending === null) return;
    const st = runCoverSequence(patient, [...actions, pending]);
    const last = st[st.length - 1];
    const eyes = visibleAfter(pending);
    const perEye = eyes.map((e) => ({ e, ok: pred[e] === last.movement[e].direction }));
    const ok = perEye.every((x) => x.ok);
    const items = eyes.map((e) => `${e}: predicted ${pred[e] === 'none' ? 'no movement' : `moves ${pred[e]}`}, observed ${DIRECTION_TEXT[last.movement[e].direction]}`);
    setPredResult({ ok, items });
    append([pending]);
    setPending(null);
    await recordAttempt({ itemId: `LAB06-predict-${mode}#${seed}.${st.length - 1}`, itemVersion: 1, familyId: 'F-COVER-PREDICT', objectiveIds: ['MOT-TROPIA-PHORIA'], lectureIds: ['L10'], seed, taskType: 'prediction', mode: 'learning', response: { maneuver: last.maneuver, occluder: pending, prediction: pred }, correct: ok, scores: Object.fromEntries(perEye.map((x) => [x.e, x.ok])), confidence: null, hintLevel: mode === 'guided' ? 1 : 0, misconceptionIds: !ok && (last.maneuver === 'cover' || last.maneuver === 'uncover') ? ['M-PHORIA-VS-TROPIA'] : [], startedAt, state: { patient, actions } });
  };

  const submitCover = async () => {
    if (!answer) return;
    const truth = findingOf(patient);
    const ev = coverEvidence(steps);
    const g = gradeCoverAnswer(truth, answer, ev);
    setGrade(g);
    await recordAttempt({ itemId: `LAB06-cover-${mode}${mode === 'case' ? vignette.id : ''}#${seed}`, itemVersion: 1, familyId: 'F-COVER-TEST', objectiveIds: ['MOT-TROPIA-PHORIA'], lectureIds: ['L10', 'L26'], seed, taskType: 'interpretation', mode: 'learning', response: { answer, actions }, correct: g.correct, scores: { tropiaPhoria: g.tropiaPhoriaCorrect, direction: g.directionCorrect, eye: g.eyeCorrect, coveredBoth: ev.coveredOD && ev.coveredOS, uncoverWatched: ev.uncoverWatched }, confidence: conf, hintLevel: 0, misconceptionIds: g.misconceptionIds, startedAt, isTransfer: mode === 'challenge', state: { patient } });
  };
  const submitHirschberg = async () => {
    if (!hAns.eye || !hAns.dir) return;
    const g = gradeHirschberg(patient, hAns as HirschbergAnswer);
    setHGrade(g);
    await recordAttempt({ itemId: `LAB06-hirschberg-${mode}#${seed}`, itemVersion: 1, familyId: 'F-HIRSCHBERG', objectiveIds: ['MOT-HIRSCHBERG'], lectureIds: ['L10'], seed, taskType: 'interpretation', mode: 'learning', response: hAns, correct: g.correct, scores: { reading: g.correct }, confidence: null, hintLevel: 0, misconceptionIds: g.misconceptionIds, startedAt, isTransfer: mode === 'challenge', state: { patient } });
  };

  // ---------- render data for the active tab
  let face: FaceProps;
  if (tab === 'cover') {
    const pos = {} as Record<Eye, { x: number; y: number }>;
    for (const e of EYES) {
      const pd = s.before.inwardPD[e] + (s.after.inwardPD[e] - s.before.inwardPD[e]) * phase;
      pos[e] = { x: toExaminerX(e, pd) * PX_PER_PD, y: 0 };
    }
    const notes = {} as Record<Eye, string>;
    for (const e of EYES) notes[e] = !s.movement[e].visible ? 'behind occluder' : s.movement[e].direction === 'none' ? (s.index === 0 ? '' : 'no movement') : `moves ${s.movement[e].direction.toUpperCase()} ${arrowFor(e, s.movement[e].direction).slice(0, 1)}`;
    face = { posPx: pos, occluder: s.after.occluder, target: { x: 0, y: 0, label: 'Fixation target (distance)' }, notes, aria: `Examiner view, stage ${s.index}: ${s.label}. Covered eye: ${s.after.occluder === 'none' ? 'none' : s.after.occluder}. ` + EYES.map((e) => `${EYE_LONG[e]}: ${s.movement[e].visible ? DIRECTION_TEXT[s.movement[e].direction] : 'behind the occluder, not observable'}.`).join(' ') };
  } else if (tab === 'hirschberg') {
    const st = initialCoverState(patient);
    const r = cornealReflex(st);
    const reflexPx = {} as Record<Eye, number | null>;
    const pos = {} as Record<Eye, { x: number; y: number }>;
    for (const e of EYES) {
      reflexPx[e] = r[e] ? toExaminerX(e, -(r[e]!.temporalMm)) * PX_PER_MM_CORNEA : null;
      pos[e] = { x: toExaminerX(e, st.inwardPD[e]) * PX_PER_PD, y: 0 };
    }
    face = { posPx: pos, occluder: 'none', reflexPx, target: { x: 0, y: 0, label: 'Penlight held at the fixation point' }, notes: reveal ? { OD: `reflex ${r.OD?.side}`, OS: `reflex ${r.OS?.side}` } : undefined, aria: `Examiner view, both eyes open, penlight at fixation. ` + EYES.map((e) => `${EYE_LONG[e]}: corneal reflex ${r[e]?.side === 'central' ? 'centred on the pupil' : `about ${Math.abs(r[e]!.temporalMm).toFixed(1)} mm ${r[e]!.side} of the pupil centre`}.`).join(' ') };
  } else {
    const g = gazePositions(patient, gaze, gazeMode, ductionEye);
    const pos = {} as Record<Eye, { x: number; y: number }>;
    for (const e of EYES) pos[e] = g[e] ? { x: -g[e]!.hDeg * 0.9, y: -g[e]!.vDeg * 0.9 } : { x: 0, y: 0 };
    const gl = `${gaze.v === 1 ? 'up' : gaze.v === -1 ? 'down' : ''}${gaze.v && gaze.h ? ' and ' : ''}${gaze.h === 1 ? "patient's right" : gaze.h === -1 ? "patient's left" : ''}` || 'primary position';
    face = { posPx: pos, occluder: gazeMode === 'duction' ? otherEye(ductionEye) : 'none', target: { x: -gaze.h * 120, y: -gaze.v * 10 + (gaze.v === -1 ? 20 : 0), label: `Target: ${gl}` }, notes: reveal ? { OD: g.OD?.limited ? 'limited (schematic)' : '', OS: g.OS?.limited ? 'limited (schematic)' : '' } : undefined, aria: `Examiner view, ${gazeMode}, gaze ${gl}. ` + EYES.map((e) => (g[e] ? `${EYE_LONG[e]}: rotated ${Math.abs(g[e]!.hDeg).toFixed(0)}° toward the patient's ${g[e]!.hDeg >= 0 ? 'right' : 'left'}${g[e]!.limited ? ', short of the target excursion' : ''}.` : `${EYE_LONG[e]}: covered.`)).join(' ') };
  }

  const ev = coverEvidence(steps);
  return (
    <div className="stack">
      <h1>LAB06 · Motility, alignment and binocular vision</h1>
      <p className="small muted">Conceptual schematic + constrained procedural simulation of horizontal alignment. Prism-dioptre values and muscle actions are schematic; vertical, torsional and incomitant patterns are not modelled except one labelled fictional abduction limitation. Draft — not clinically reviewed.</p>
      <div className="row">
        <Seg label="Studio mode" value={mode} onChange={setMode} options={[{ value: 'explore', label: 'Explore' }, { value: 'guided', label: 'Guided practice' }, { value: 'challenge', label: 'Independent challenge' }, { value: 'case', label: 'Patient case' }]} />
        {hidden && <button className="btn sm" onClick={() => { setSeed(newSeed()); reset(); }}>New case</button>}
        <button className="btn sm" onClick={reset}>Reset</button>
        <span className="tiny muted num">seed {seed}</span>
      </div>
      {mode === 'case' && <div className="panel small"><strong>Patient case.</strong> {vignette.text}</div>}
      {mode === 'guided' && <div className="panel small"><strong>Stated case (K2 fixture):</strong> left esotropia — OS turned in, OD fixing, 20 PD (schematic). Predict each stage before you perform it.</div>}
      {mode === 'challenge' && <p className="small">Hidden case: perform the cover tests and inspect the corneal reflexes, then record what the evidence supports.</p>}
      <Seg label="Examination" value={tab} onChange={setTab} options={[{ value: 'cover', label: 'Cover tests (T029, T030)' }, { value: 'hirschberg', label: 'Corneal reflex (T027)' }, { value: 'gaze', label: 'Gaze positions (T025)' }]} />

      <div className="grid cols-2">
        <div className="stack">
          <div className="canvas-wrap"><Face {...face} /></div>
          {tab === 'cover' && (
            <div className="canvas-wrap stack">
              <div className="row small" role="group" aria-label="Stage strip">
                {steps.map((st) => (
                  <button key={st.index} className="btn sm" aria-current={st.index === s.index ? 'step' : undefined} style={st.index === s.index ? { outline: '2px solid var(--accent)' } : undefined} onClick={() => { setPlaying(false); view(st.index, true); }}>
                    {st.index}: {st.index === 0 ? 'start' : st.after.occluder === 'none' ? 'uncovered' : `cover ${st.after.occluder}`}
                  </button>
                ))}
              </div>
              <div className="row small">
                <button className="btn sm" disabled={s.index === 0} onClick={() => { setPlaying(false); view(s.index - 1, false); }}>◀ Stage</button>
                <button className="btn sm" onClick={() => view(s.index, true)}>Replay stage</button>
                <button className="btn sm" disabled={s.index >= steps.length - 1} onClick={() => { setPlaying(false); view(s.index + 1, true); }}>Stage ▶</button>
                {!reducedMotion && <button className="btn sm" disabled={steps.length < 2} onClick={() => { if (s.index >= steps.length - 1) view(0, false); setPlaying(!playing); }}>{playing ? 'Pause' : 'Play all'}</button>}
              </div>
              <div className="feedback small" aria-live="polite">
                <strong>Stage {s.index}: {s.label}</strong>
                <ul>
                  <li>Covered eye: <b>{s.after.occluder === 'none' ? 'none (both eyes open)' : s.after.occluder}</b></li>
                  <li>Eye to observe: <b>{s.observe.join(' and ')}</b></li>
                  {EYES.map((e) => <li key={e}>{e}: {s.movement[e].visible ? `${DIRECTION_TEXT[s.movement[e].direction]} ${arrowFor(e, s.movement[e].direction)}` : 'behind the occluder — not observable at this stage'}</li>)}
                  {reveal && <li className="muted">Model: {s.after.fixingEye} fixing; fusion {s.after.fused ? 'intact' : 'broken'}.</li>}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="stack">
          {tab === 'cover' && (
            <div className="panel stack">
              <h2>Occluder</h2>
              <div className="row">
                <button className="btn sm" disabled={occ === 'OD'} onClick={() => request('OD')}>{occ === 'OS' ? 'Move cover to OD (alternate)' : 'Cover OD'}</button>
                <button className="btn sm" disabled={occ === 'OS'} onClick={() => request('OS')}>{occ === 'OD' ? 'Move cover to OS (alternate)' : 'Cover OS'}</button>
                <button className="btn sm" disabled={occ === 'none'} onClick={() => request('none')}>Uncover</button>
              </div>
              <label className="row small"><input type="checkbox" checked={predictOn} onChange={(e) => setPredictOn(e.target.checked)} /> Predict before each move</label>
              {!predictOn && (
                <div className="row">
                  <button className="btn sm" onClick={() => append(occ === 'none' ? ['OD', 'none', 'OS', 'none'] : ['none', 'OD', 'none', 'OS', 'none'])}>Cover–uncover each eye</button>
                  <button className="btn sm" onClick={() => append([...(occ === 'none' ? [] : ['none' as Occluder]), 'OD', 'OS', 'OD', 'OS', 'none'])}>Alternate cover</button>
                </div>
              )}
              {pending !== null && (
                <div className="feedback stack small">
                  <strong>Predict: {pending === 'none' ? `uncover ${occ}` : occ === 'none' ? `cover ${pending}` : `move cover ${occ} → ${pending}`}. What will each visible eye do?</strong>
                  {visibleAfter(pending).map((e) => (
                    <div key={e} className="row"><span style={{ minWidth: 150 }}>{EYE_LONG[e]}</span>
                      <Seg label={`Prediction for ${e}`} value={(pred[e] ?? '') as Direction} onChange={(v) => setPred({ ...pred, [e]: v })} options={[{ value: 'in', label: 'moves in' }, { value: 'out', label: 'moves out' }, { value: 'none', label: 'no movement' }]} />
                    </div>
                  ))}
                  <div className="row"><button className="btn primary sm" disabled={visibleAfter(pending).some((e) => !pred[e])} onClick={commitPrediction}>Perform</button><button className="btn sm" onClick={() => setPending(null)}>Cancel</button></div>
                </div>
              )}
              {predResult && <Feedback tone={predResult.ok ? 'good' : 'bad'} title={predResult.ok ? 'Prediction matched' : 'Prediction differed'} items={predResult.items} />}
              {mode === 'guided' && <Feedback tone="info" title="Why" items={[isTropia(patient) ? 'In a tropia the fixing eye holds the target; the other eye is already deviated. Only covering the FIXING eye forces the deviating eye to move to take up fixation.' : 'In a phoria fusion keeps both eyes aligned; the eye only drifts when it is covered and recovers when uncovered.', 'An eye turned IN must move OUT to take up fixation, and vice versa.']} />}
              <p className="tiny muted">Evidence so far: covered OD {ev.coveredOD ? '✓' : '—'} · covered OS {ev.coveredOS ? '✓' : '—'} · uncover watched {ev.uncoverWatched ? '✓' : '—'} · alternate {ev.alternateDone ? '✓' : '—'}. Alternate cover shows the total (phoria + tropia) deviation; it does not tell them apart.</p>
            </div>
          )}

          {tab === 'gaze' && (
            <div className="panel stack small">
              <h2>Gaze positions</h2>
              <Seg label="Ductions or versions" value={gazeMode} onChange={setGazeMode} options={[{ value: 'version', label: 'Versions (both eyes)' }, { value: 'duction', label: 'Duction (one eye, fellow covered)' }]} />
              {gazeMode === 'duction' && <Seg label="Eye tested" value={ductionEye} onChange={setDuctionEye} options={[{ value: 'OD', label: 'Test OD' }, { value: 'OS', label: 'Test OS' }]} />}
              <div role="group" aria-label="Target position, in patient terms" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 4, maxWidth: 360 }}>
                {([1, 0, -1] as const).flatMap((v) => ([1, 0, -1] as const).map((h) => (
                  <button key={`${v}${h}`} className="btn sm" aria-pressed={gaze.h === h && gaze.v === v} onClick={() => setGaze({ h, v })}>
                    {v === 1 ? 'Up' : v === -1 ? 'Down' : ''}{v !== 0 && h !== 0 ? ' · ' : ''}{h === 1 ? "Pt's R" : h === -1 ? "Pt's L" : v === 0 ? 'Primary' : ''}
                  </button>
                )))}
              </div>
              <p className="tiny muted">Grid is laid out as the examiner sees it: the patient’s right is on your left.</p>
              {mode === 'explore' && <label className="row"><input type="checkbox" checked={custom.abductionDeficit === 'OD'} onChange={(e) => setCustom({ ...custom, abductionDeficit: e.target.checked ? 'OD' : null })} /> Fictional right abduction limitation (schematic)</label>}
              <p className="tiny muted">Schematic: this shows where each eye points, not which muscle acts in which position. Secondary deviation and vertical muscle actions are not modelled.</p>
            </div>
          )}

          {tab === 'hirschberg' && (
            <div className="panel stack small">
              <h2>Corneal light reflex</h2>
              <p>Penlight at the fixation point, both eyes open. Compare where the bright reflex sits relative to each pupil centre.</p>
              {mode === 'guided' && <Feedback tone="info" title="Convention" items={['Reflex displaced TEMPORALLY on a cornea → that eye is turned IN (eso).', 'Reflex displaced NASALLY → eye turned OUT (exo).', 'Schematic: ~1 mm displacement ≈ 15 PD (published conversions vary); the normal slight nasal offset is ignored.']} />}
              {mode !== 'explore' && (
                <>
                  <div className="row"><span className="muted">Deviating eye:</span><Seg label="Deviating eye" value={(hAns.eye ?? '') as Eye | 'neither'} onChange={(v) => setHAns({ ...hAns, eye: v })} options={[{ value: 'OD', label: 'OD' }, { value: 'OS', label: 'OS' }, { value: 'neither', label: 'Neither' }]} /></div>
                  <div className="row"><span className="muted">Direction:</span><Seg label="Direction" value={(hAns.dir ?? '') as 'eso'} onChange={(v) => setHAns({ ...hAns, dir: v })} options={[{ value: 'eso', label: 'Turned in (eso)' }, { value: 'exo', label: 'Turned out (exo)' }, { value: 'none', label: 'Aligned' }]} /></div>
                  <button className="btn primary sm" disabled={!hAns.eye || !hAns.dir || hGrade !== null} onClick={submitHirschberg}>Submit reading</button>
                  {hGrade && <Feedback tone={hGrade.correct ? 'good' : 'bad'} title={hGrade.correct ? 'Correct' : 'Not quite'} items={hGrade.items} />}
                </>
              )}
            </div>
          )}

          {mode === 'explore' && (
            <div className="panel stack small">
              <h2>Model state (ground truth, Explore only)</h2>
              <Seg label="Deviation" value={custom.kind} onChange={(k) => { setCustom({ ...custom, kind: k, magnitudePD: k === 'ortho' ? 0 : custom.magnitudePD || 20 }); setActions([]); view(0, false); }} options={[{ value: 'ortho', label: 'Ortho' }, { value: 'eso', label: 'Eso' }, { value: 'exo', label: 'Exo' }]} />
              <Seg label="Manifest or latent" value={custom.manifest ? 'tropia' : 'phoria'} onChange={(v) => { setCustom({ ...custom, manifest: v === 'tropia' }); setActions([]); view(0, false); }} options={[{ value: 'phoria', label: 'Phoria (fusion intact)' }, { value: 'tropia', label: 'Tropia (manifest)' }]} />
              <Seg label="Fixing eye preference" value={custom.preferredEye} onChange={(v) => { setCustom({ ...custom, preferredEye: v }); setActions([]); view(0, false); }} options={[{ value: 'OD', label: 'Prefers OD' }, { value: 'OS', label: 'Prefers OS' }]} />
              <label className="field"><span>Magnitude: {custom.magnitudePD} PD (schematic)</span>
                <input type="range" min={0} max={40} step={5} value={custom.magnitudePD} onChange={(e) => setCustom({ ...custom, magnitudePD: Number(e.target.value) })} />
              </label>
              <p className="muted">Current model: {MOTILITY_FINDING_LABELS[findingOf(custom)]}.</p>
            </div>
          )}

          {hidden && (
            <div className="panel stack small">
              <h2>Your interpretation</h2>
              <fieldset className="stack" disabled={grade !== null} style={{ border: 0, padding: 0 }}>
                <legend className="sr-only">Alignment finding</legend>
                {(Object.keys(MOTILITY_FINDING_LABELS) as MotilityFinding[]).map((f) => (
                  <label key={f} className="row"><input type="radio" name="lab06-answer" checked={answer === f} onChange={() => setAnswer(f)} /> {MOTILITY_FINDING_LABELS[f]}</label>
                ))}
              </fieldset>
              <ConfidencePicker value={conf} onChange={setConf} />
              <button className="btn primary" disabled={!answer || grade !== null || steps.length < 2} onClick={submitCover}>Submit interpretation</button>
              {steps.length < 2 && <span className="tiny muted">Perform at least one cover-test stage first.</span>}
              {grade && <Feedback tone={grade.correct ? 'good' : 'bad'} title={grade.correct ? 'Supported by the cover-test evidence' : 'Not supported'} items={grade.items} />}
              {grade && <div className="row"><Pill tone={grade.tropiaPhoriaCorrect ? 'good' : 'bad'}>tropia vs phoria {grade.tropiaPhoriaCorrect ? '✓' : '✗'}</Pill><Pill tone={grade.directionCorrect ? 'good' : 'bad'}>direction {grade.directionCorrect ? '✓' : '✗'}</Pill><Pill tone={grade.eyeCorrect ? 'good' : 'bad'}>laterality {grade.eyeCorrect ? '✓' : '✗'}</Pill></div>}
              {grade && mode === 'case' && <p className="muted">{vignette.note}</p>}
            </div>
          )}

          <div className="panel small">
            <h3>Planned / not modelled here</h3>
            <ul>
              <li><Pill>planned</Pill> T031 Prism cover (simultaneous vs alternate) and T028 Krimsky — magnitudes here are schematic, not measured.</li>
              <li><Pill>planned</Pill> T032 Maddox rod, T033 Worth four-dot, T034 stereoacuity, T083 Bagolini — need declared filter/rod orientation and response semantics.</li>
              <li><Pill>planned</Pill> T035 Near point of convergence, T036 Hess / Lancaster interpretation, T026 saccades/pursuit/nystagmus.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
