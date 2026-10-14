import { useState, type KeyboardEvent } from 'react';
import { useApp, type NewAttempt } from '../app/context';
import {
  AMSLER_N, COLOUR_ADMIN_STEPS, COLOUR_RESULTS, CONVERSION_CAVEAT, CORRECTION_LABEL, LOW_VISION_LABEL, LOW_VISION_ORDER, NEAR_CARD, NEAR_CAVEAT,
  NEAR_CORRECTION_LABEL, NEAR_DISTANCES_CM, PATIENTS, SIDE_WORD, TEST_DISTANCES_M, amslerArea, amslerKey, amslerOffset, chartObservation,
  compareAmsler, convertSnellen, describeChartObservation, describeLowVisionResponse, expectedSnellen, formatLowVision, formatSnellen,
  gradeLowVisionRecord, gradeNearRecord, gradeSnellenRecord, interpretPinhole, letterByLetterLogMAR, lowVisionResponse, parseSnellen,
  recordLogMAR, roundTo, sequenceScore, type AmslerMap, type AmslerMark, type AmslerSpec, type ChartObservation, type Correction, type EyeTruth,
  type LowVisionRecord, type LowVisionTest, type NearCorrection, type PinholeChange, type RecordGrade, type Side, type Snellen, type VirtualPatient,
} from '../domain/acuity';
import { newSeed, rng } from '../domain/random';
import { now } from '../lib/store';
import { Feedback, Pill, Seg } from '../ui/kit';

type Mode = 'explore' | 'guided' | 'challenge' | 'case';
type Task = 'distance' | 'convert' | 'lowva' | 'pinhole' | 'near' | 'amsler' | 'colour';
type Rec = (a: Pick<NewAttempt, 'itemId' | 'familyId' | 'objectiveIds' | 'taskType' | 'correct' | 'scores' | 'response' | 'startedAt'> & Partial<NewAttempt>) => void;
interface TaskProps { p: VirtualPatient; mode: Mode; seed: number; rec: Rec }

const SIDES: { value: Side; label: string }[] = [{ value: 'R', label: 'Right eye (OD)' }, { value: 'L', label: 'Left eye (OS)' }];
const baseCorrection = (p: VirtualPatient): Correction => (p.wearsGlasses ? 'own-glasses' : 'unaided');

function GradeBox({ g, title }: { g: RecordGrade | null; title?: string }) {
  if (!g) return null;
  return <Feedback tone={g.correct ? 'good' : 'bad'} title={title ?? (g.correct ? 'Correctly documented' : 'Check the record')} items={g.items} />;
}
function Hint({ mode, children }: { mode: Mode; children: string }) {
  return mode === 'guided' || mode === 'explore' ? <p className="tiny muted" style={{ margin: 0 }}>Hint: {children}</p> : null;
}

/** Best measurable record at 6 → 3 → 1 m, else the low-vision category (used where the protocol is fixed by the lab). */
function bestRecord(t: EyeTruth): Snellen | LowVisionRecord {
  for (const d of TEST_DISTANCES_M) {
    const s = expectedSnellen(chartObservation(t, d));
    if (s) return s;
  }
  return t.kind === 'low' ? { category: t.category, distanceM: t.distanceM } : { category: 'CF', distanceM: 1 };
}
const fmtRecord = (r: Snellen | LowVisionRecord) => ('category' in r ? formatLowVision(r) : formatSnellen(r));

// ------------------------------------------------------------ T001 distance acuity

function DistanceTask({ p, mode, seed, rec }: TaskProps) {
  const [start] = useState(now());
  const [side, setSide] = useState<Side>('R');
  const [corr, setCorr] = useState<Correction>(baseCorrection(p));
  const [dist, setDist] = useState<number>(6);
  const [obs, setObs] = useState<(ChartObservation & { side: Side; corr: Correction }) | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [g, setG] = useState<RecordGrade | null>(null);
  const present = () => {
    const o = { ...chartObservation(p.eyes[side].distance[corr], dist), side, corr };
    setObs(o);
    setG(null);
    setText('');
    setLog((l) => [...l, `${side === 'R' ? 'OD' : 'OS'} · ${CORRECTION_LABEL[corr]} · ${dist} m — ${describeChartObservation(o)}`]);
  };
  const check = () => {
    if (!obs) return;
    const r = gradeSnellenRecord(text, obs);
    const protocol = obs.distanceM < 6 && chartObservation(p.eyes[obs.side].distance[obs.corr], 6).kind === 'line' ? ['Protocol note: this eye reads the chart at 6 m — test at the standard distance first and move closer only if the top line cannot be read.'] : [];
    const out = { ...r, items: [...r.items, ...protocol] };
    setG(out);
    if (mode !== 'explore') rec({ itemId: `LAB04-distance-${p.id}-${obs.side}-${obs.corr}-${obs.distanceM}#${seed}`, familyId: 'F-VA-RECORD', objectiveIds: ['VA-NOTATION'], taskType: 'documentation', correct: r.correct, scores: { notation: r.correct, standardDistanceFirst: protocol.length === 0 }, response: { text, side: obs.side, correction: obs.corr, distanceM: obs.distanceM }, misconceptionIds: r.misconceptionIds, startedAt: start, hintLevel: mode === 'guided' ? 1 : 0, state: { patientId: p.id } });
  };
  const exp = obs && expectedSnellen(obs);
  return (
    <div className="grid cols-2">
      <div className="panel stack small">
        <h3>Examination conditions</h3>
        <Seg label="Eye tested (other eye occluded)" value={side} onChange={setSide} options={SIDES} />
        <Seg label="Correction" value={corr} onChange={setCorr} options={(['unaided', 'own-glasses', 'pinhole'] as Correction[]).filter((c) => p.wearsGlasses || c !== 'own-glasses').map((c) => ({ value: c, label: CORRECTION_LABEL[c] }))} />
        <Seg label="Test distance" value={String(dist) as '6'} onChange={(v) => setDist(Number(v))} options={TEST_DISTANCES_M.map((d) => ({ value: String(d) as '6', label: `${d} m` }))} />
        <button className="btn primary" onClick={present}>Present the chart to the patient</button>
        <p className="tiny muted">The chart is not drawn: this lab never measures your own eyesight. The fictional patient's responses are supplied.</p>
        {log.length > 0 && <ol className="tiny">{log.map((l, i) => <li key={i}>{l}</li>)}</ol>}
      </div>
      <div className="panel stack small">
        <h3>Documentation</h3>
        {obs ? (
          <>
            <p><b>Observation:</b> {describeChartObservation(obs)}</p>
            <label className="field"><span>{obs.side === 'R' ? 'RE' : 'LE'}, {CORRECTION_LABEL[obs.corr].toLowerCase()}, at {obs.distanceM} m — acuity</span>
              <input type="text" className="num" value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. 6/12" autoComplete="off" />
            </label>
            <Hint mode={mode}>numerator = the distance actually used; denominator = the smallest line fully read. Write 3/60, not 6/120, when tested at 3 m.</Hint>
            {mode === 'explore' && <p className="tiny">Model record: <span className="num">{exp ? formatSnellen(exp) : 'no line read — move closer or use the low-vision sequence'}</span>{exp && ` · decimal ${convertSnellen(exp).decimal2} · logMAR ${convertSnellen(exp).logMAR2}`}</p>}
            <button className="btn" disabled={!text.trim()} onClick={check}>Check record</button>
            <GradeBox g={g} />
          </>
        ) : <p className="muted">Choose eye, correction and distance, then present the chart.</p>}
        <p className="tiny muted">Acuity is one measure of resolution; it is not a "percentage of vision".</p>
      </div>
    </div>
  );
}

// ------------------------------------------------------------ T002 conversions

const FRACTIONS: Snellen[] = [{ num: 6, den: 6 }, { num: 6, den: 9 }, { num: 6, den: 12 }, { num: 6, den: 18 }, { num: 6, den: 24 }, { num: 6, den: 36 }, { num: 6, den: 60 }, { num: 3, den: 60 }, { num: 6, den: 5 }, { num: 20, den: 40 }, { num: 20, den: 200 }];

function ConvertTask({ mode, seed, rec }: TaskProps) {
  const [start] = useState(now());
  const r = rng(seed + 3);
  const f = r.pick(FRACTIONS);
  const line = r.pick([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6]);
  const extra = r.int(1, 4);
  const [dec, setDec] = useState('');
  const [lm, setLm] = useState('');
  const [lbl, setLbl] = useState('');
  const [calc, setCalc] = useState('6/12');
  const [fb, setFb] = useState<RecordGrade | null>(null);
  const c = convertSnellen(f);
  const lblTruth = letterByLetterLogMAR(line, extra);
  const close = (s: string, v: number) => s.trim() !== '' && Math.abs(Number(s.replace(',', '.').replace('−', '-')) - v) <= 0.011;
  const check = () => {
    const okD = close(dec, c.decimal), okL = close(lm, c.logMAR), okB = close(lbl, lblTruth);
    const items = [
      `${formatSnellen(f)}: decimal = ${f.num}/${f.den} = ${c.decimal2}${okD ? ' ✓' : ''}; logMAR = −log10(${c.decimal2}) ≈ ${c.logMAR2}${okL ? ' ✓' : ''} (unitless log units).`,
      `Letter-by-letter: ${line.toFixed(1)} − ${extra} × 0.02 = ${lblTruth.toFixed(2)} logMAR${okB ? ' ✓' : ''}.`,
      CONVERSION_CAVEAT,
    ];
    setFb({ correct: okD && okL && okB, items, misconceptionIds: [] });
    if (mode !== 'explore') rec({ itemId: `LAB04-convert#${seed}`, familyId: 'F-VA-CONVERT', objectiveIds: ['VA-NOTATION'], taskType: 'numeric', correct: okD && okL && okB, scores: { decimal: okD, logMAR: okL, letterByLetter: okB }, response: { dec, lm, lbl }, startedAt: start, hintLevel: mode === 'guided' ? 1 : 0, state: { f, line, extra } });
  };
  const cs = parseSnellen(calc);
  return (
    <div className="grid cols-2">
      <div className="panel stack small">
        <p>1. A supplied Snellen record reads <b className="num">{formatSnellen(f)}</b>. Give the decimal acuity and the logMAR value (2 decimals).</p>
        <div className="row">
          <label className="field"><span>Decimal</span><input type="text" className="num" value={dec} onChange={(e) => setDec(e.target.value)} /></label>
          <label className="field"><span>logMAR</span><input type="text" className="num" value={lm} onChange={(e) => setLm(e.target.value)} /></label>
        </div>
        <p>2. Stated protocol: a logMAR-style chart with 5 letters per line and 0.1 log units per line, scored letter by letter (0.02 per letter). The patient reads all of the <b>{line.toFixed(1)}</b> line and <b>{extra}</b> letter{extra > 1 ? 's' : ''} of the next smaller line. Score?</p>
        <label className="field"><span>logMAR score</span><input type="text" className="num" value={lbl} onChange={(e) => setLbl(e.target.value)} /></label>
        <Hint mode={mode}>decimal = numerator ÷ denominator; logMAR = −log10(decimal); smaller lines have LOWER logMAR, so subtract for extra letters.</Hint>
        <button className="btn primary" disabled={!dec || !lm || !lbl} onClick={check}>Check</button>
        {fb && <GradeBox g={fb} title={fb.correct ? 'All correct' : 'Review the conversions'} />}
      </div>
      <div className="panel stack small">
        <h3>Calculator (Explore)</h3>
        {mode === 'explore' ? (
          <>
            <label className="field"><span>Snellen fraction</span><input type="text" className="num" value={calc} onChange={(e) => setCalc(e.target.value)} /></label>
            {cs ? <p className="num">decimal {roundTo(convertSnellen(cs).decimal, 3)} · logMAR {convertSnellen(cs).logMAR2} · 6 m equivalent 6/{convertSnellen(cs).equiv6m}</p> : <p className="muted">Type e.g. 6/18 or 3/60.</p>}
          </>
        ) : <p className="muted">Available in Explore mode.</p>}
        <p className="tiny muted">{CONVERSION_CAVEAT} The letters on screen are not a standardized chart.</p>
      </div>
    </div>
  );
}

// ------------------------------------------------------------ T004 very low acuity

type LvStep = { test: 'chart'; distanceM: 1 } | { test: LowVisionTest; distanceM?: number };
const LV_STEPS: LvStep[] = [{ test: 'chart', distanceM: 1 }, { test: 'CF', distanceM: 2 }, { test: 'CF', distanceM: 1 }, { test: 'CF', distanceM: 0.5 }, { test: 'HM', distanceM: 1 }, { test: 'HM', distanceM: 0.5 }, { test: 'LP' }];
const lvLabel = (s: LvStep) => (s.test === 'chart' ? 'Chart at 1 m' : `${s.test}${s.distanceM ? ` at ${s.distanceM} m` : ' (other eye fully covered)'}`);

function LowVaTask({ p, mode, seed, rec }: TaskProps) {
  const [start] = useState(now());
  const [side, setSide] = useState<Side>(p.eyes.R.distance.unaided.kind === 'low' ? 'R' : 'L');
  const [log, setLog] = useState<{ s: LvStep; text: string }[]>([]);
  const [text, setText] = useState('');
  const [g, setG] = useState<RecordGrade | null>(null);
  const truth = p.eyes[side].distance[baseCorrection(p)];
  const run = (s: LvStep) => {
    const text = s.test === 'chart' ? describeChartObservation(chartObservation(truth, 1)) : describeLowVisionResponse(s.test, lowVisionResponse(truth, s.test, s.distanceM), s.distanceM);
    setLog((l) => [...l, { s, text }]);
  };
  const check = () => {
    const r = truth.kind === 'chart' ? { correct: false, items: [`This eye reads the chart (${fmtRecord(bestRecord(truth))}): document a Snellen fraction, not a low-vision category.`], misconceptionIds: [] } : gradeLowVisionRecord(text, truth);
    const ranks = log.filter((l) => l.s.test !== 'chart').map((l) => LOW_VISION_ORDER.indexOf(l.s.test as LowVisionTest));
    const ordered = ranks.every((v, i) => i === 0 || v >= ranks[i - 1]);
    const items = [...r.items, ordered ? 'Sequence: tested from the better level down (CF → HM → LP).' : 'Sequence: work from the better level down — CF, then HM, then LP — and stop at the first level the patient achieves.', recordLogMAR({ category: 'CF' }).reason!];
    setG({ ...r, items });
    if (mode !== 'explore') rec({ itemId: `LAB04-lowva-${p.id}-${side}#${seed}`, familyId: 'F-LOW-VA', objectiveIds: ['VA-LOWVISION'], taskType: 'procedural-sequence', correct: r.correct && ordered, scores: { documentation: r.correct, sequence: ordered }, response: { text, log: log.map((l) => lvLabel(l.s)) }, misconceptionIds: r.misconceptionIds, startedAt: start, hintLevel: mode === 'guided' ? 1 : 0, state: { patientId: p.id, side } });
  };
  return (
    <div className="grid cols-2">
      <div className="panel stack small">
        <Seg label="Eye tested" value={side} onChange={(v) => { setSide(v); setLog([]); setG(null); }} options={SIDES} />
        <p>Correction: {CORRECTION_LABEL[baseCorrection(p)]}. Choose the next test:</p>
        <div className="row">{LV_STEPS.map((s) => <button key={lvLabel(s)} className="btn sm" onClick={() => run(s)}>{lvLabel(s)}</button>)}</div>
        <Hint mode={mode}>if the top line is not read at 1 m, try counting fingers at decreasing distance, then hand movements, then light perception with the other eye completely covered.</Hint>
        <ol className="tiny">{log.map((l, i) => <li key={i}><b>{lvLabel(l.s)}:</b> {l.text}</li>)}</ol>
      </div>
      <div className="panel stack small">
        <label className="field"><span>{SIDE_WORD[side]} — document the result</span><input type="text" className="num" value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. CF at 1 m" autoComplete="off" /></label>
        {mode === 'explore' && <p className="tiny">Model record: <span className="num">{fmtRecord(bestRecord(truth))}</span></p>}
        <button className="btn" disabled={!text.trim() || !log.length} onClick={check}>Check documentation</button>
        <GradeBox g={g} />
        <p className="tiny muted">{Object.values(LOW_VISION_LABEL).join(' · ')} are documented as categories (with distance for CF/HM). This lab assigns them no numeric logMAR.</p>
      </div>
    </div>
  );
}

// ------------------------------------------------------------ T005 pinhole

const PINHOLE_OPTIONS: { text: string; fits: PinholeChange[] }[] = [
  { text: 'Improves: suggests an optical (refractive) contribution — refract next; this does not exclude co-existing disease', fits: ['improved'] },
  { text: 'Improves: the eye is healthy and needs no further examination', fits: [] },
  { text: 'No useful improvement: an optical cause is not demonstrated — look for a non-refractive cause (media, macula, optic nerve)', fits: ['no-change', 'worse'] },
  { text: 'Pinhole comparison is of limited value at this level — document and examine further', fits: ['not-comparable'] },
];

function PinholeTask({ p, mode, seed, rec }: TaskProps) {
  const [start] = useState(now());
  const [side, setSide] = useState<Side>('R');
  const [shown, setShown] = useState<{ base: boolean; ph: boolean }>({ base: false, ph: false });
  const [pick, setPick] = useState<number | null>(null);
  const base = bestRecord(p.eyes[side].distance[baseCorrection(p)]);
  const ph = bestRecord(p.eyes[side].distance.pinhole);
  const interp = interpretPinhole(base, ph);
  const choose = (i: number) => {
    setPick(i);
    const ok = PINHOLE_OPTIONS[i].fits.includes(interp.change);
    if (mode !== 'explore') rec({ itemId: `LAB04-pinhole-${p.id}-${side}#${seed}`, familyId: 'F-PINHOLE', objectiveIds: ['VA-PINHOLE'], taskType: 'result-interpretation', correct: ok, scores: { interpretation: ok, overclaimedNoDisease: i === 1 }, response: { choice: i }, startedAt: start, hintLevel: mode === 'guided' ? 1 : 0, state: { patientId: p.id, side } });
  };
  return (
    <div className="panel stack small" style={{ maxWidth: 760 }}>
      <Seg label="Eye tested" value={side} onChange={(v) => { setSide(v); setShown({ base: false, ph: false }); setPick(null); }} options={SIDES} />
      <div className="row">
        <button className="btn" onClick={() => setShown({ ...shown, base: true })}>Measure baseline ({CORRECTION_LABEL[baseCorrection(p)].toLowerCase()})</button>
        <button className="btn" onClick={() => setShown({ ...shown, ph: true })}>Repeat through the pinhole</button>
      </div>
      <table className="data"><tbody>
        <tr><th>Baseline</th><td className="num">{shown.base ? fmtRecord(base) : '—'}</td></tr>
        <tr><th>Pinhole</th><td className="num">{shown.ph ? fmtRecord(ph) : '—'}</td></tr>
      </tbody></table>
      {shown.base && shown.ph && (
        <>
          <p><b>Interpretation and next step:</b></p>
          <div className="stack">{PINHOLE_OPTIONS.map((o, i) => <button key={i} className="btn" style={{ justifyContent: 'flex-start', textAlign: 'left' }} disabled={pick !== null} aria-pressed={pick === i} onClick={() => choose(i)}>{o.text}</button>)}</div>
          <Hint mode={mode}>compare the two records line by line; then ask what an improvement can and cannot rule out.</Hint>
          {pick !== null && <Feedback tone={PINHOLE_OPTIONS[pick].fits.includes(interp.change) ? 'good' : 'bad'} title={`Model: ${interp.change.replace('-', ' ')}${interp.lines ? ` (${Math.abs(interp.lines)} line${Math.abs(interp.lines) > 1 ? 's' : ''})` : ''}`} items={[interp.statement, ...(pick === 1 ? ['Pinhole improvement never proves the absence of disease.'] : [])]} />}
        </>
      )}
    </div>
  );
}

// ------------------------------------------------------------ T003 near

function NearTask({ p, mode, seed, rec }: TaskProps) {
  const [start] = useState(now());
  const [side, setSide] = useState<Side>('R');
  const [corr, setCorr] = useState<NearCorrection>('unaided');
  const [dist, setDist] = useState<number>(40);
  const [obs, setObs] = useState<{ side: Side; corr: NearCorrection; dist: number; size: number | null; text: string } | null>(null);
  const [text, setText] = useState('');
  const [g, setG] = useState<RecordGrade | null>(null);
  const present = () => {
    const size = p.eyes[side].near[corr];
    const t = dist !== NEAR_CARD.designDistanceCm ? `This card's protocol states ${NEAR_CARD.designDistanceCm} cm; responses at ${dist} cm are not modelled in this lab. Return to the stated distance.` : size === null ? 'Cannot read the largest print on the card (N48).' : `Reads N${size} print fluently; cannot read the next smaller size.`;
    setObs({ side, corr, dist, size, text: t });
    setText('');
    setG(null);
  };
  const check = () => {
    if (!obs || obs.dist !== NEAR_CARD.designDistanceCm) return;
    const r = obs.size === null ? (/N\s*48|cannot|<\s*N/i.test(text) && /40/.test(text) ? { correct: true, items: ['Documented as unable to read N48 at 40 cm.'], misconceptionIds: [] } : { correct: false, items: ['Document "cannot read N48 at 40 cm" (or "< N48 at 40 cm").'], misconceptionIds: [] }) : gradeNearRecord(text, { size: obs.size, distanceCm: obs.dist });
    setG({ ...r, items: [...r.items, `Correction to document: ${NEAR_CORRECTION_LABEL[obs.corr].toLowerCase()}.`] });
    if (mode !== 'explore') rec({ itemId: `LAB04-near-${p.id}-${obs.side}-${obs.corr}#${seed}`, familyId: 'F-VA-RECORD', objectiveIds: ['VA-NOTATION'], taskType: 'documentation', correct: r.correct, scores: { notation: r.correct }, response: { text, correction: obs.corr, distanceCm: obs.dist }, misconceptionIds: r.misconceptionIds, startedAt: start, hintLevel: mode === 'guided' ? 1 : 0, state: { patientId: p.id } });
  };
  return (
    <div className="grid cols-2">
      <div className="panel stack small">
        <Seg label="Eye tested" value={side} onChange={setSide} options={SIDES} />
        <Seg label="Near correction" value={corr} onChange={setCorr} options={(Object.keys(NEAR_CORRECTION_LABEL) as NearCorrection[]).map((c) => ({ value: c, label: NEAR_CORRECTION_LABEL[c] }))} />
        <Seg label="Working distance" value={String(dist) as '40'} onChange={(v) => setDist(Number(v))} options={NEAR_DISTANCES_CM.map((d) => ({ value: String(d) as '40', label: `${d} cm` }))} />
        <button className="btn primary" onClick={present}>Give the near card (N-notation, fictional)</button>
        {obs && <p><b>Observation:</b> {obs.text}</p>}
      </div>
      <div className="panel stack small">
        <label className="field"><span>Near acuity record</span><input type="text" className="num" value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. N8 at 40 cm" disabled={!obs || obs.dist !== NEAR_CARD.designDistanceCm} autoComplete="off" /></label>
        <Hint mode={mode}>record the size in the card's own notation plus the working distance, and state the correction worn.</Hint>
        {mode === 'explore' && obs?.size != null && obs.dist === 40 && <p className="tiny">Model record: <span className="num">N{obs.size} at 40 cm, {NEAR_CORRECTION_LABEL[obs.corr].toLowerCase()}</span></p>}
        <button className="btn" disabled={!text.trim()} onClick={check}>Check record</button>
        <GradeBox g={g} />
        <p className="tiny muted">{NEAR_CAVEAT}</p>
      </div>
    </div>
  );
}

// ------------------------------------------------------------ T010 Amsler

function describeAmsler(side: Side, s: AmslerSpec | null): string {
  const pre = `Fixating the central dot with the ${side === 'R' ? 'right' : 'left'} eye (other eye covered, reading glasses on), the patient reports: `;
  if (!s) return pre + 'all lines look straight and no part of the grid is missing.';
  const h = s.cx === 0 ? '' : `${Math.abs(s.cx)} squares to the ${s.cx > 0 ? 'right' : 'left'}`;
  const v = s.cy === 0 ? '' : `${Math.abs(s.cy)} squares ${s.cy > 0 ? 'above' : 'below'}`;
  const where = [h, v].filter(Boolean).join(' and ') + ' of the dot';
  return pre + (s.missingR > 0.5 ? `a missing patch centred about ${where}, about ${Math.round(s.missingR * 2)} squares across, with wavy lines around it out to about ${s.distortR} squares from that centre.` : `wavy, bent lines (nothing missing) in a roughly round area centred about ${where}, about ${s.distortR} squares in radius.`);
}

const CELL = 14;
function AmslerTask({ p, mode, seed, rec }: TaskProps) {
  const [start] = useState(now());
  const [side, setSide] = useState<Side>(p.eyes.R.amsler ? 'R' : p.eyes.L.amsler ? 'L' : 'R');
  const [tool, setTool] = useState<AmslerMark | 'erase'>('missing');
  const [marks, setMarks] = useState<AmslerMap>(new Map());
  const [cur, setCur] = useState({ c: 10, r: 9 });
  const [g, setG] = useState<ReturnType<typeof compareAmsler> | null>(null);
  const truth = amslerArea(p.eyes[side].amsler);
  const apply = (c: number, r: number) => {
    if (g) return;
    const m = new Map(marks);
    if (tool === 'erase') m.delete(amslerKey(c, r));
    else m.set(amslerKey(c, r), tool);
    setMarks(m);
  };
  const key = (e: KeyboardEvent) => {
    const d: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    if (d[e.key]) {
      e.preventDefault();
      setCur({ c: Math.min(AMSLER_N - 1, Math.max(0, cur.c + d[e.key][0])), r: Math.min(AMSLER_N - 1, Math.max(0, cur.r + d[e.key][1])) });
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      apply(cur.c, cur.r);
    }
  };
  const submit = () => {
    const r = compareAmsler(marks, truth);
    setG(r);
    if (mode !== 'explore') rec({ itemId: `LAB04-amsler-${p.id}-${side}#${seed}`, familyId: 'F-AMSLER', objectiveIds: ['VA-AMSLER'], taskType: 'mapping', correct: r.correct, scores: { dice: roundTo(r.dice, 2), typeAgreement: roundTo(r.typeAgreement, 2), position: r.centroidOk }, response: [...marks], startedAt: start, hintLevel: mode === 'guided' ? 1 : 0, state: { patientId: p.id, side } });
  };
  const o = amslerOffset(cur.c, cur.r);
  const fill = (m: AmslerMark | undefined) => (m === 'missing' ? 'url(#ams-hatch)' : m === 'distorted' ? 'url(#ams-dots)' : 'transparent');
  return (
    <div className="grid cols-2">
      <div className="canvas-wrap stack">
        <svg viewBox={`0 0 ${AMSLER_N * CELL + 2} ${AMSLER_N * CELL + 2}`} tabIndex={0} onKeyDown={key} role="application" style={{ maxWidth: 420 }}
          aria-label={`Original Amsler-style grid, ${AMSLER_N} by ${AMSLER_N} squares, drawn as the patient sees it. Cursor ${o.x > 0 ? `${o.x + 0.5} right` : `${-o.x + 0.5} left`}, ${o.y > 0 ? `${o.y + 0.5} up` : `${-o.y + 0.5} down`} from the dot; ${marks.size} squares marked. Arrow keys move, Space marks with the current tool.`}>
          <defs>
            <pattern id="ams-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="5" height="5" fill="var(--proposal)" opacity=".35" /><line x1="0" y1="0" x2="0" y2="5" stroke="var(--proposal)" strokeWidth="2" /></pattern>
            <pattern id="ams-dots" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r="1.3" fill="var(--proposal)" /></pattern>
          </defs>
          <rect x="1" y="1" width={AMSLER_N * CELL} height={AMSLER_N * CELL} fill="var(--surface)" stroke="var(--ink)" />
          {Array.from({ length: AMSLER_N * AMSLER_N }, (_, i) => {
            const c = i % AMSLER_N, r = Math.floor(i / AMSLER_N), k = amslerKey(c, r);
            const t = g ? truth.get(k) : undefined;
            return (
              <g key={k} onClick={() => { setCur({ c, r }); apply(c, r); }}>
                <rect x={1 + c * CELL} y={1 + r * CELL} width={CELL} height={CELL} fill={fill(marks.get(k))} stroke="var(--ink-3)" strokeWidth=".5" />
                {t && <rect x={3 + c * CELL} y={3 + r * CELL} width={CELL - 4} height={CELL - 4} fill="none" stroke="var(--target)" strokeWidth={t === 'missing' ? 2 : 1} strokeDasharray={t === 'missing' ? undefined : '2 2'} />}
              </g>
            );
          })}
          <circle cx={1 + (AMSLER_N * CELL) / 2} cy={1 + (AMSLER_N * CELL) / 2} r="3" fill="var(--ink)" />
          <rect x={1 + cur.c * CELL} y={1 + cur.r * CELL} width={CELL} height={CELL} fill="none" stroke="var(--accent)" strokeWidth="2.5" pointerEvents="none" />
        </svg>
        <div className="legend"><span><i style={{ background: 'var(--proposal)' }} />your mark: hatched = missing, dotted = distorted</span>{g && <span><i style={{ background: 'var(--target)' }} />authored area: solid outline = missing, dashed = distorted</span>}</div>
      </div>
      <div className="panel stack small">
        <Seg label="Eye tested" value={side} onChange={(v) => { setSide(v); setMarks(new Map()); setG(null); }} options={SIDES} />
        <p><b>Patient's report:</b> {describeAmsler(side, p.eyes[side].amsler)}</p>
        <Seg label="Marking tool" value={tool} onChange={setTool} options={[{ value: 'missing', label: 'Missing' }, { value: 'distorted', label: 'Distorted' }, { value: 'erase', label: 'Erase' }]} />
        <Hint mode={mode}>the grid is shown as the patient sees it, so "to the right of the dot" is on your right here. Count squares from the central dot.</Hint>
        <div className="row"><button className="btn primary" onClick={submit} disabled={!!g}>Compare with the report</button><button className="btn sm" onClick={() => { setMarks(new Map()); setG(null); }}>Clear</button></div>
        {g && <Feedback tone={g.correct ? 'good' : 'bad'} title={g.correct ? 'Area mapped well' : 'Mapping differs from the report'} items={g.items} />}
        <p className="tiny muted">Original illustrative grid. A normal Amsler result does not exclude macular disease.</p>
      </div>
    </div>
  );
}

// ------------------------------------------------------------ T007 colour plates (text only)

function ColourTask({ seed }: TaskProps) {
  const r = rng(seed + 11);
  const [order, setOrder] = useState<string[]>(() => [...COLOUR_ADMIN_STEPS].map((s) => [r.next(), s] as const).sort((a, b) => a[0] - b[0]).map((x) => x[1]));
  const [checked, setChecked] = useState(false);
  const res = COLOUR_RESULTS[seed % COLOUR_RESULTS.length];
  const [pick, setPick] = useState<number | null>(null);
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= order.length) return;
    const n = [...order];
    [n[i], n[j]] = [n[j], n[i]];
    setOrder(n);
    setChecked(false);
  };
  const sc = sequenceScore(order);
  return (
    <div className="grid cols-2">
      <div className="panel stack small">
        <h3>Administration sequence</h3>
        <ol>{order.map((s, i) => <li key={s} className="row" style={{ justifyContent: 'space-between' }}><span>{s}</span><span><button className="btn sm" aria-label={`Move "${s}" up`} onClick={() => move(i, -1)}>↑</button> <button className="btn sm" aria-label={`Move "${s}" down`} onClick={() => move(i, 1)}>↓</button></span></li>)}</ol>
        <button className="btn" onClick={() => setChecked(true)}>Check order</button>
        {checked && <Feedback tone={sc.correctPositions === sc.total ? 'good' : 'warn'} title={`${sc.correctPositions}/${sc.total} steps in the reference position`} items={sc.correctPositions === sc.total ? [] : COLOUR_ADMIN_STEPS.map((s, i) => `${i + 1}. ${s}`)} />}
      </div>
      <div className="panel stack small">
        <h3>Interpret a supplied result</h3>
        <p>{res.text}</p>
        {res.options.map((o, i) => <button key={i} className="btn" style={{ justifyContent: 'flex-start', textAlign: 'left' }} aria-pressed={pick === i} disabled={pick !== null} onClick={() => setPick(i)}>{o}</button>)}
        {pick !== null && <Feedback tone={pick === res.answer ? 'good' : 'bad'} title={pick === res.answer ? 'Supported interpretation' : `Supported: ${res.options[res.answer]}`} items={[res.explanation]} />}
        <p className="tiny muted">No plates are drawn or copied: results are supplied as text. This lab does not test your own colour vision. Self-check — not recorded.</p>
      </div>
    </div>
  );
}

// ------------------------------------------------------------ studio shell

const TASKS: { value: Task; label: string }[] = [
  { value: 'distance', label: 'Distance (T001)' }, { value: 'convert', label: 'Conversions (T002)' }, { value: 'lowva', label: 'Very low acuity (T004)' },
  { value: 'pinhole', label: 'Pinhole (T005)' }, { value: 'near', label: 'Near (T003)' }, { value: 'amsler', label: 'Amsler (T010)' }, { value: 'colour', label: 'Colour plates (T007)' },
];

export function Lab04() {
  const { recordAttempt } = useApp();
  const [mode, setMode] = useState<Mode>('explore');
  const [task, setTask] = useState<Task>('distance');
  const [seed, setSeed] = useState(newSeed());
  const [resetN, setResetN] = useState(0);
  const [pid, setPid] = useState(PATIENTS[0].id);
  const hidden = mode === 'challenge' || mode === 'case';
  const p = hidden ? rng(seed).pick(PATIENTS) : PATIENTS.find((x) => x.id === pid)!;
  const rec: Rec = (a) => void recordAttempt({ itemVersion: 1, lectureIds: ['L07'], seed, mode: 'learning', confidence: null, hintLevel: 0, misconceptionIds: [], ...a });
  const props: TaskProps = { p, mode, seed, rec };
  return (
    <div className="stack">
      <h1>LAB04 · Visual function room</h1>
      <p className="small muted">Constrained procedural simulation on authored fictional patients · draft · not clinically reviewed. You examine a virtual patient; nothing here measures your own vision.</p>
      <div className="row">
        <Seg label="Mode" value={mode} onChange={setMode} options={[{ value: 'explore', label: 'Explore' }, { value: 'guided', label: 'Guided practice' }, { value: 'challenge', label: 'Independent challenge' }, { value: 'case', label: 'Patient case' }]} />
        <label className="row small">Seed <input type="text" inputMode="numeric" className="num" style={{ width: 120 }} value={seed} onChange={(e) => /^\d{0,10}$/.test(e.target.value) && setSeed(Number(e.target.value))} aria-label="Variant seed" /></label>
        <button className="btn sm" onClick={() => setSeed(newSeed())}>New variant</button>
        <button className="btn sm" onClick={() => setResetN((n) => n + 1)}>Reset</button>
      </div>
      <Seg label="Test" value={task} onChange={setTask} options={TASKS} />
      <div className="panel small row">
        {hidden ? <span><b>{mode === 'challenge' ? `Hidden patient (seed ${seed})` : p.label}</b>{mode === 'case' && ` — ${p.vignette}`}</span> : (
          <label className="row">Patient
            <select value={pid} onChange={(e) => setPid(e.target.value)} style={{ width: 'auto' }}>{PATIENTS.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}</select>
            <span className="muted">{p.vignette}</span>
          </label>
        )}
        <span className="tiny muted">{p.wearsGlasses ? 'Wears distance glasses.' : 'No glasses.'}</span>
      </div>
      <div key={`${mode}-${task}-${seed}-${resetN}-${p.id}`}>
        {task === 'distance' && <DistanceTask {...props} />}
        {task === 'convert' && <ConvertTask {...props} />}
        {task === 'lowva' && <LowVaTask {...props} />}
        {task === 'pinhole' && <PinholeTask {...props} />}
        {task === 'near' && <NearTask {...props} />}
        {task === 'amsler' && <AmslerTask {...props} />}
        {task === 'colour' && <ColourTask {...props} />}
      </div>
      <div className="panel small">
        <b>Planned / not modelled:</b> <Pill>T006 Contrast sensitivity — planned</Pill> <Pill>T008 Hue arrangement (D-15 / 100-hue) — planned</Pill>
        <p className="tiny muted" style={{ margin: '6px 0 0' }}>Simplifications: whole-line reading only (no partial-line notation such as 6/9−2); one fictional near card designed for 40 cm; no screen display here is a calibrated clinical chart.</p>
      </div>
    </div>
  );
}
