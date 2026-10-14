import { useEffect, useState } from 'react';
import { useApp, type NewAttempt } from '../app/context';
import { href } from '../app/router';
import { deriveReviewStates, objectiveEvidence, EVIDENCE_LABEL } from '../domain/learning';
import { OPTICS_OBJECTIVES, ANSWER_TOL_D } from '../domain/missions';
import {
  CLASS_LABEL, classify, fmtAxis, fmtD, formatRx, gradeLens, makeLens, meridionalPower, toPowerCross, type RefractiveClass, type SpheroCyl,
} from '../domain/optics';
import { rng } from '../domain/random';
import { now } from '../lib/store';
import { ConfidencePicker, Feedback, HintLadder, NumberEntry, RxEntry, parseDioptre, rxFromState, type Confidence, type RxEntryState } from '../ui/kit';
import { CylinderCanvas, PowerGraph, PowerLegend } from './OpticsViews';
import { TranspositionAnimator } from './Transposition';

export const REFERENCE_LENS: SpheroCyl = makeLens(0, -4, 180);
const PREDICT = [30, 45, 60, 90] as const;
type Step = 'predict' | 'explore' | 'write' | 'plus' | 'classify-lens' | 'classify-context' | 'oblique' | 'done';
const STEPS: { id: Step; label: string }[] = [
  { id: 'predict', label: 'Predict four meridians' },
  { id: 'explore', label: 'Rotate the measurement meridian' },
  { id: 'write', label: 'Write sphere, cylinder, axis' },
  { id: 'plus', label: 'Plus-cylinder notation' },
  { id: 'classify-lens', label: 'Lens or diagnosis?' },
  { id: 'classify-context', label: 'Classify in context' },
  { id: 'oblique', label: 'New oblique lens, no labels' },
  { id: 'done', label: 'Summary and delayed review' },
];

export interface MissionState {
  step: Step;
  predictions: Record<string, { value: number; correct: boolean }>;
  writeTries: number;
  writeHint: number;
  lastWrite?: SpheroCyl | null;
  plusTries: number;
  lensAnswer?: string;
  ctxAnswer?: string;
  ctxNoCorr?: string;
  ctxMinus?: string;
  explanation?: string;
  obliqueSeed: number;
  obliqueTries: number;
  obliqueSolved?: boolean;
  startedAt: number;
}

const KEY = 'mission:cyl-intro';

export function obliqueLens(seed: number): SpheroCyl {
  const r = rng(seed);
  return makeLens(r.quarter(-1.5, 1.5), -r.quarter(1.5, 3.5), r.pick([30, 60, 120, 150, 20, 160, 35, 145]));
}

export function CylinderMission() {
  const { repo, profile, recordAttempt, attempts } = useApp();
  const [st, setSt] = useState<MissionState | null>(null);
  const [probe, setProbe] = useState(30);
  const [num, setNum] = useState('');
  const [rx, setRx] = useState<RxEntryState>({ result: null, confirmed: false });
  const [fb, setFb] = useState<{ tone: 'good' | 'bad' | 'warn'; title: string; items: string[] } | null>(null);
  const [conf, setConf] = useState<Confidence | null>(null);
  const [proposal, setProposal] = useState<SpheroCyl | null>(null);
  const [entryKey, setEntryKey] = useState(0);

  useEffect(() => {
    if (!profile) return;
    repo.getKV<MissionState>(profile.id, KEY).then((s) => {
      setSt(s ?? { step: 'predict', predictions: {}, writeTries: 0, writeHint: 0, plusTries: 0, obliqueSeed: Math.floor(now() % 100000), obliqueTries: 0, startedAt: now() });
    });
  }, [repo, profile]);

  const save = async (s: MissionState) => {
    setSt(s);
    if (profile) await repo.setKV(profile.id, KEY, s);
  };

  if (!st) return <p>Loading mission…</p>;

  const lens = REFERENCE_LENS;
  const stepIdx = STEPS.findIndex((s) => s.id === st.step);
  const nextPredict = PREDICT.find((m) => !(String(m) in st.predictions));
  const revealed = [180, ...Object.keys(st.predictions).map(Number)];
  const isOblique = st.step === 'oblique';
  const obl = obliqueLens(st.obliqueSeed);
  const canvasLens = isOblique ? obl : lens;

  const base = (over: Partial<NewAttempt>): NewAttempt => ({
    itemId: 'MISSION-CYL', itemVersion: 1, familyId: 'F-MISSION', objectiveIds: [], lectureIds: ['L05'], seed: null, taskType: 'mission', mode: 'mission',
    response: null, correct: null, scores: {}, confidence: conf, hintLevel: 0, misconceptionIds: [], startedAt: st.startedAt, state: { target: lens }, ...over,
  });

  const advance = (to: Step, extra: Partial<MissionState> = {}) => {
    setFb(null);
    setConf(null);
    setProposal(null);
    setEntryKey((k) => k + 1);
    save({ ...st, ...extra, step: to });
  };

  // ---- step handlers
  const commitPrediction = async () => {
    if (nextPredict === undefined) return;
    const v = parseDioptre(num);
    if (!Number.isFinite(v)) return;
    const actual = meridionalPower(lens, nextPredict);
    const ok = Math.abs(v - actual) <= 0.01;
    const items = ok
      ? [`At ${nextPredict}° the meridian is ${nextPredict}° from the axis: −4.00 × sin²(${nextPredict}°) = ${fmtD(actual)} D.`]
      : [
          `Revealed: ${fmtD(actual)} D at ${nextPredict}°. You predicted ${fmtD(v)} D.`,
          Math.abs(v - meridionalPower(lens, nextPredict + 90)) <= 0.01 ? 'That is the power 90° away — the axis (180°) has no cylinder power; the full −4.00 lies at 90°.' : `Power rises from 0 at the axis to −4.00 at 90° as sin²: not linearly (30° gives −1.00, not −1.33).`,
        ];
    const mis = !ok && Math.abs(v - meridionalPower(lens, nextPredict + 90)) <= 0.01 ? ['M-AXIS-VS-MERIDIAN'] : [];
    await recordAttempt(base({ itemId: `MISSION-CYL-predict-${nextPredict}`, familyId: 'F-MERID-PREDICT', objectiveIds: ['OPT-MERIDIAN'], taskType: 'numerical-production', response: { kind: 'number', value: v }, correct: ok, scores: { valueD: v, expectedD: actual }, misconceptionIds: mis }));
    setFb({ tone: ok ? 'good' : 'bad', title: ok ? 'Prediction matches the model' : 'Prediction differs', items });
    setProbe(nextPredict);
    setNum('');
    await save({ ...st, predictions: { ...st.predictions, [nextPredict]: { value: v, correct: ok } } });
  };

  const submitWrite = async (target: SpheroCyl, requested: 'any' | 'plus' | 'minus', where: 'write' | 'plus' | 'oblique') => {
    const l = rxFromState(rx);
    if (!l) return;
    const g = gradeLens(l, target, requested, ANSWER_TOL_D);
    // The oblique task is a measurement from rounded readouts: a declared measurement tolerance applies.
    const measured = where === 'oblique' && !g.opticallyEquivalent && Math.abs(g.worst.errorD) <= 0.13;
    const ok = (g.opticallyEquivalent || measured) && g.notation !== 'other-convention';
    const items: string[] = [];
    if (measured) items.push(`Within the ±0.13 D measurement tolerance of this task (largest difference ${fmtD(g.worst.errorD)} D at ${fmtAxis(g.worst.meridianDeg)}°). The exact lens is ${formatRx(target)}; readouts are rounded to 0.01 D, so the axis is hard to pin down to the degree.`);
    else if (g.opticallyEquivalent) {
      items.push('Optically equivalent: your lens has the same power in every meridian as the target.');
      if (g.notation === 'other-convention') items.push(`Correct lens, but the requested ${requested}-cylinder form is ${formatRx(requested === 'plus' ? makeLens(target.sphereD + target.cylinderD, -target.cylinderD, target.axisDeg! + 90) : target)}.`);
    } else {
      const d = g.discrepancies.find((x) => x.meridianDeg === 180)!;
      const d90 = g.discrepancies.find((x) => x.meridianDeg === 90)!;
      items.push(`Your lens: ${fmtD(d.proposalD)} D at 180°, ${fmtD(d90.proposalD)} D at 90°. Target: ${fmtD(d.targetD)} D at 180°, ${fmtD(d90.targetD)} D at 90°.`);
      items.push(`Largest difference ${fmtD(g.worst.errorD)} D at ${fmtAxis(g.worst.meridianDeg)}°.`);
      for (const h of g.hypotheses) items.push(h.message);
    }
    const fam = where === 'write' ? 'F-CROSS-TO-RX' : where === 'plus' ? 'F-TRANSPOSE-PLUS' : 'F-CROSS-OBLIQUE';
    const obj = where === 'write' ? ['OPT-WRITE'] : where === 'plus' ? ['OPT-TRANSPOSE'] : ['OPT-WRITE', 'OPT-MERIDIAN'];
    await recordAttempt(base({ itemId: `MISSION-CYL-${where}`, familyId: fam, objectiveIds: obj, taskType: where === 'plus' ? 'notation' : 'numerical-production', response: { kind: 'rx', lens: l }, correct: ok, scores: { opticallyEquivalent: g.opticallyEquivalent, notation: g.notation }, hintLevel: where === 'write' ? st.writeHint : 0, misconceptionIds: g.hypotheses.map((h) => h.id), state: { target } }));
    setProposal(l);
    setFb({ tone: ok ? 'good' : g.opticallyEquivalent ? 'warn' : 'bad', title: ok ? 'Correct' : g.opticallyEquivalent ? 'Optically correct — notation not as requested' : 'Not the same lens', items });
    if (where === 'write') await save({ ...st, writeTries: st.writeTries + 1, lastWrite: l });
    if (where === 'plus') await save({ ...st, plusTries: st.plusTries + 1 });
    if (where === 'oblique') await save({ ...st, obliqueTries: st.obliqueTries + 1, obliqueSolved: ok || st.obliqueSolved });
    return ok;
  };

  const lastOk = (fam: string) => {
    const a = [...attempts].reverse().find((x) => x.familyId === fam && x.mode === 'mission');
    return a?.correct === true;
  };

  const cls = classify(lens, 'full-distance-correction-relaxed');
  const clsAns = cls.status === 'classified' ? cls.cls : 'emmetropic';

  return (
    <div className="stack">
    <div className="lab" data-testid="cyl-mission">
      <aside className="controls-col stack">
        <div className="panel">
          <h3>Introductory mission</h3>
          <ol className="step-list">
            {STEPS.map((s, i) => (
              <li key={s.id} className={i < stepIdx ? 'done' : i === stepIdx ? 'current' : ''} aria-current={i === stepIdx ? 'step' : undefined}>
                {s.label}
              </li>
            ))}
          </ol>
          <button className="btn sm ghost" onClick={() => { if (confirm('Restart the mission? Your recorded attempts are kept.')) advance('predict', { predictions: {}, writeTries: 0, writeHint: 0, plusTries: 0, obliqueTries: 0, obliqueSolved: false, lensAnswer: undefined, ctxAnswer: undefined }); }}>
            Restart mission (history kept)
          </button>
        </div>
        <div className="panel small">
          {st.step === 'classify-context' || st.step === 'done' ? (
            <p>
              <b>Fictional patient context:</b> this lens is the complete distance correction for a regular astigmatic eye with accommodation relaxed. Laterality, symptoms, acuity and ocular health are not given.
            </p>
          ) : (
            <p>
              <b>Lens mode.</b> This is a correcting lens, not an eye diagnosis.
            </p>
          )}
          <PowerLegend lens={canvasLens} />
        </div>
      </aside>
      <section className="canvas-col stack">
        <div className="canvas-wrap">
          <CylinderCanvas
            lens={canvasLens}
            probeDeg={probe}
            onProbe={setProbe}
            showValues={st.step !== 'predict' && !isOblique}
            revealed={isOblique ? [] : revealed}
            showAxisLabel={!isOblique}
            proposal={proposal}
            notation={isOblique ? (st.obliqueSolved ? formatRx(obl) : 'unknown lens — probe it') : st.step === 'predict' || st.step === 'explore' || st.step === 'write' ? 'reference lens — write it yourself' : formatRx(lens)}
            title={isOblique ? 'Unknown oblique lens: rotate the measurement meridian to read powers' : 'Reference cylinder: axis 180°, measurement meridian movable'}
          />
          <div className="readout">
            <div>
              <span>Measurement meridian θ</span>
              <b className="num">{fmtAxis(probe)}°</b>
            </div>
            <div>
              <span>Power F(θ)</span>
              <b className="num" data-testid="probe-power">
                {st.step === 'predict' && !revealed.some((r) => Math.abs(((r - probe) % 180 + 180) % 180) < 1e-9) ? 'predict first' : `${fmtD(meridionalPower(canvasLens, probe))} D`}
              </b>
            </div>
            {!isOblique && (
              <div>
                <span>Cylinder axis A</span>
                <b className="num">180°</b>
              </div>
            )}
          </div>
        </div>
        <div className="canvas-wrap">
          <PowerGraph
            lens={canvasLens}
            probeDeg={probe}
            onProbe={setProbe}
            showCurve={st.step !== 'predict' && !(isOblique && !st.obliqueSolved)}
            proposal={proposal}
            points={
              st.step === 'predict'
                ? [
                    ...revealed.map((d) => ({ deg: d, label: String(meridionalPower(lens, d)), kind: 'revealed' as const })),
                    ...Object.entries(st.predictions).map(([d, p]) => ({ deg: Number(d), label: String(p.value), kind: 'prediction' as const })),
                  ]
                : isOblique && !st.obliqueSolved
                  ? [{ deg: probe, label: String(meridionalPower(obl, probe)), kind: 'revealed' as const }]
                  : []
            }
            title="Meridional power against meridian angle"
          />
          <div className="legend">
            <span><i style={{ background: 'var(--target)' }} />model lens</span>
            <span><i style={{ background: 'var(--proposal)' }} />your proposal / predictions</span>
            <span><i style={{ background: 'var(--probe)' }} />measurement meridian</span>
          </div>
        </div>
      </section>
      <aside className="stack" aria-label="Notebook">
        <div className="panel stack" data-testid="mission-notebook">
          <h3>Notebook</h3>
          {st.step === 'predict' && (
            <>
              <p>
                The horizontal meridian (180°) is labelled <b>plano</b>. Predict the total lens power at each meridian before it is revealed.
              </p>
              <table className="data small">
                <tbody>
                  <tr>
                    <th>Meridian</th>
                    <th>Your prediction</th>
                    <th>Model</th>
                  </tr>
                  {PREDICT.map((m) => (
                    <tr key={m}>
                      <td className="num">{m}°</td>
                      <td className="num">{st.predictions[m] ? fmtD(st.predictions[m].value) : m === nextPredict ? '…' : ''}</td>
                      <td className="num">{st.predictions[m] ? `${fmtD(meridionalPower(lens, m))} ${st.predictions[m].correct ? '✓' : '✗'}` : 'hidden'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {fb && <Feedback tone={fb.tone} title={fb.title} items={fb.items} />}
              {nextPredict !== undefined ? (
                <form onSubmit={(e) => { e.preventDefault(); commitPrediction(); }} className="stack">
                  <NumberEntry id="predict-input" label={`Power at ${nextPredict}°`} unit="D" value={num} onChange={setNum} />
                  <button className="btn primary" type="submit" disabled={!Number.isFinite(parseDioptre(num))}>
                    Commit prediction
                  </button>
                </form>
              ) : (
                <button className="btn primary" onClick={() => advance('explore')}>
                  Continue: rotate the meridian
                </button>
              )}
            </>
          )}
          {st.step === 'explore' && (
            <>
              <p>
                Drag the purple θ handle (or focus it and use the arrow keys; Shift = 15°). Watch the readout and the graph: power is 0 at the axis and reaches −4.00 D at 90°, following F(θ) = 0 + (−4)·sin²(θ − 180°).
              </p>
              <p className="small muted">Notice that 30° and 150° give the same power: meridians are orientations, not directions.</p>
              <button className="btn primary" onClick={() => advance('write')}>
                I have explored — next
              </button>
            </>
          )}
          {st.step === 'write' && (
            <>
              <p>Write this lens as sphere / cylinder × axis. Any notation is accepted. No options are given.</p>
              <RxEntry key={entryKey} idPrefix="mission-write" onChange={setRx} />
              <ConfidencePicker value={conf} onChange={setConf} />
              {!lastOk('F-CROSS-TO-RX') && <HintLadder hints={['Which meridian has zero power? That orientation is where the cylinder adds nothing.', 'Axis 180° carries the sphere (plano). The cylinder is the power 90° away minus the sphere.', 'Sphere plano, cylinder −4.00, axis 180: plano / −4.00 × 180 (or −4.00 / +4.00 × 090).']} level={st.writeHint} onReveal={() => save({ ...st, writeHint: st.writeHint + 1 })} />}
              <button className="btn primary" disabled={!rxFromState(rx)} onClick={() => submitWrite(lens, 'any', 'write')}>
                Check my lens
              </button>
              {fb && <Feedback tone={fb.tone} title={fb.title} items={fb.items} />}
              {lastOk('F-CROSS-TO-RX') && (
                <button className="btn primary" onClick={() => advance('plus')}>
                  Next: plus-cylinder form
                </button>
              )}
            </>
          )}
          {st.step === 'plus' && (
            <>
              <p>
                Now write the <b>same lens</b> in <b>plus-cylinder</b> notation.
              </p>
              <RxEntry key={entryKey} idPrefix="mission-plus" onChange={setRx} />
              <button className="btn primary" disabled={!rxFromState(rx)} onClick={() => submitWrite(lens, 'plus', 'plus')}>
                Check
              </button>
              {fb && <Feedback tone={fb.tone} title={fb.title} items={fb.items} />}
              {lastOk('F-TRANSPOSE-PLUS') && (
                <>
                  <p className="small">Use the animation beside the canvas: it changes only the representation.</p>
                  <button className="btn primary" onClick={() => advance('classify-lens')}>
                    Next
                  </button>
                </>
              )}
            </>
          )}
          {st.step === 'classify-lens' && (
            <>
              <p>A patient’s refractive diagnosis from this lens alone is:</p>
              <ChoiceList name="lensdx" value={st.lensAnswer} onChange={(v) => save({ ...st, lensAnswer: v })} options={[{ value: 'cannot', label: 'Cannot be established from the isolated lens image' }, ...Object.entries(CLASS_LABEL).map(([value, label]) => ({ value, label }))]} />
              <button
                className="btn primary"
                disabled={!st.lensAnswer}
                onClick={async () => {
                  const ok = st.lensAnswer === 'cannot';
                  await recordAttempt(base({ itemId: 'MISSION-CYL-lensdx', familyId: 'F-CLASSIFY-CONTEXT', objectiveIds: ['OPT-CLASSIFY'], taskType: 'conceptual-discrimination', response: { kind: 'choice', value: st.lensAnswer }, correct: ok, scores: { choice: st.lensAnswer! }, misconceptionIds: ok ? [] : ['M-RX-VS-DIAGNOSIS'] }));
                  setFb(ok ? { tone: 'good', title: 'Correct', items: ['The image shows a lens. It does not tell us whose lens, which eye, whether it is the full correction, accommodation status, acuity or eye health.'] } : { tone: 'bad', title: 'Not supported yet', items: ['You classified the lens as if it were a known full distance correction. That context has not been stated, so no patient diagnosis follows. (Recorded as a prescription-versus-diagnosis error.)'] });
                }}
              >
                Commit
              </button>
              {fb && <Feedback tone={fb.tone} title={fb.title} items={fb.items} />}
              {fb && (
                <button className="btn primary" onClick={() => advance('classify-context')}>
                  Supply the patient context
                </button>
              )}
            </>
          )}
          {st.step === 'classify-context' && (
            <>
              <p className="small">
                <b>Context now given:</b> complete distance correction, regular astigmatic eye, accommodation relaxed.
              </p>
              <label className="field">
                <span>Refractive classification</span>
                <select value={st.ctxAnswer ?? ''} onChange={(e) => save({ ...st, ctxAnswer: e.target.value })}>
                  <option value="">Choose…</option>
                  {Object.entries(CLASS_LABEL).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Principal meridian needing no correction</span>
                <select value={st.ctxNoCorr ?? ''} onChange={(e) => save({ ...st, ctxNoCorr: e.target.value })}>
                  <option value="">Choose…</option>
                  {['180', '90', '45', 'none'].map((v) => (
                    <option key={v} value={v}>
                      {v === 'none' ? 'Neither' : `${v}°`}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Principal meridian needing minus correction</span>
                <select value={st.ctxMinus ?? ''} onChange={(e) => save({ ...st, ctxMinus: e.target.value })}>
                  <option value="">Choose…</option>
                  {['180', '90', '45', 'both'].map((v) => (
                    <option key={v} value={v}>
                      {v === 'both' ? 'Both' : `${v}°`}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Explain in one or two sentences (self-assessed against the model answer)</span>
                <textarea value={st.explanation ?? ''} onChange={(e) => setSt({ ...st, explanation: e.target.value })} onBlur={() => save(st)} />
              </label>
              <button
                className="btn primary"
                disabled={!st.ctxAnswer || !st.ctxNoCorr || !st.ctxMinus}
                onClick={async () => {
                  const okCls = st.ctxAnswer === clsAns;
                  const okNo = st.ctxNoCorr === '180';
                  const okMinus = st.ctxMinus === '90';
                  const items = [
                    okCls ? `${CLASS_LABEL[clsAns as RefractiveClass]} — correct.` : `Classification: ${CLASS_LABEL[(st.ctxAnswer ?? 'emmetropic') as RefractiveClass]} is not supported. Principal corrective powers are 0.00 D (180°) and −4.00 D (90°): one zero, one negative.`,
                    okNo ? 'The 180° meridian needs no correction — correct.' : 'The meridian needing no correction is 180° (the axis: plano).',
                    okMinus ? 'The 90° meridian needs −4.00 D — correct.' : 'Minus correction is needed only at 90° (−4.00 D).',
                    'Model answer: one principal meridian (180°) is already focused on the retina and the perpendicular one (90°) focuses in front, needing −4.00 D; one zero and one negative principal power define simple myopic astigmatism — in this stated context only.',
                  ];
                  const mis = okCls ? [] : st.ctxAnswer === 'compound-myopic-astigmatism' || st.ctxAnswer === 'spherical-myopia' ? ['M-SIMPLE-VS-COMPOUND'] : ['M-SE-AS-EQUIVALENT'];
                  await recordAttempt(base({ itemId: 'MISSION-CYL-classify', familyId: 'F-CLASSIFY', objectiveIds: ['OPT-CLASSIFY'], taskType: 'classification', response: { cls: st.ctxAnswer, noCorr: st.ctxNoCorr, minus: st.ctxMinus, explanation: st.explanation ?? '' }, correct: okCls && okNo && okMinus, scores: { classification: okCls, noCorrectionMeridian: okNo, minusMeridian: okMinus, explanation: 'self-assessed' }, misconceptionIds: mis }));
                  setFb({ tone: okCls && okNo && okMinus ? 'good' : 'bad', title: okCls && okNo && okMinus ? 'Supported classification' : 'Check the principal powers', items });
                }}
              >
                Submit classification
              </button>
              {fb && <Feedback tone={fb.tone} title={fb.title} items={fb.items} />}
              {fb && (
                <button className="btn primary" onClick={() => { setProbe(90); advance('oblique'); }}>
                  Final task: a new oblique lens
                </button>
              )}
            </>
          )}
          {st.step === 'oblique' && (
            <>
              <p>
                A different lens, labels removed. Rotate the measurement meridian to find where power is greatest and least (the principal meridians), then write the lens. Hints are not available here.
              </p>
              <p className="small muted">Readout shows the power only at the current meridian.</p>
              <RxEntry key={entryKey} idPrefix="mission-oblique" onChange={setRx} />
              <ConfidencePicker value={conf} onChange={setConf} />
              <button className="btn primary" disabled={!rxFromState(rx) || st.obliqueSolved} onClick={() => submitWrite(obl, 'any', 'oblique')}>
                Check
              </button>
              {fb && <Feedback tone={fb.tone} title={fb.title} items={fb.items} />}
              {(st.obliqueSolved || st.obliqueTries >= 3) && (
                <>
                  {!st.obliqueSolved && <p className="small">Answer: {formatRx(obl)} (principal {fmtD(toPowerCross(obl).powerAD)} D at {fmtAxis(toPowerCross(obl).meridianADeg)}°, {fmtD(toPowerCross(obl).powerBD)} D at {fmtAxis(toPowerCross(obl).meridianBDeg)}°).</p>}
                  <button className="btn primary" onClick={() => advance('done')}>
                    See summary
                  </button>
                </>
              )}
            </>
          )}
          {st.step === 'done' && <MissionSummary />}
        </div>
      </aside>
    </div>
    {st.step === 'plus' && lastOk('F-TRANSPOSE-PLUS') && (
      <div className="panel">
        <h3>Same lens, two descriptions</h3>
        <TranspositionAnimator lens={lens} />
      </div>
    )}
    </div>
  );
}

function ChoiceList({ name, value, onChange, options }: { name: string; value?: string; onChange(v: string): void; options: { value: string; label: string }[] }) {
  return (
    <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
      <legend className="sr-only">Choose one</legend>
      {options.map((o) => (
        <label key={o.value} className="row small" style={{ padding: '5px 8px', border: '1px solid var(--line)', borderRadius: 8, marginBottom: 5, background: value === o.value ? 'var(--accent-soft)' : 'var(--surface)' }}>
          <input type="radio" name={name} checked={value === o.value} onChange={() => onChange(o.value)} /> {o.label}
        </label>
      ))}
    </fieldset>
  );
}

function MissionSummary() {
  const { attempts } = useApp();
  const states = deriveReviewStates(attempts);
  const fams = ['F-MERID-PREDICT', 'F-CROSS-TO-RX', 'F-TRANSPOSE-PLUS', 'F-CLASSIFY-CONTEXT', 'F-CLASSIFY', 'F-CROSS-OBLIQUE'];
  const mis = attempts.filter((a) => a.mode === 'mission' && a.misconceptionIds.length);
  return (
    <div className="stack small" data-testid="mission-summary">
      <p>
        <b>Mission complete — not “mastered”.</b> Following a guided sequence is practice. Evidence grows only from unaided answers, a delayed check and a different-structure transfer problem.
      </p>
      <table className="data">
        <thead>
          <tr>
            <th>Objective</th>
            <th>Evidence</th>
          </tr>
        </thead>
        <tbody>
          {['OPT-MERIDIAN', 'OPT-WRITE', 'OPT-TRANSPOSE', 'OPT-CLASSIFY'].map((o) => (
            <tr key={o}>
              <td>{OPTICS_OBJECTIVES[o].text}</td>
              <td>{EVIDENCE_LABEL[objectiveEvidence(attempts, o)]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        <b>Delayed retrieval scheduled:</b>
      </p>
      <ul>
        {fams.map((f) => {
          const s = states.get(f);
          return s ? (
            <li key={f}>
              {f}: due {new Date(s.dueAt).toLocaleString()}
            </li>
          ) : null;
        })}
      </ul>
      {mis.length > 0 && (
        <p>
          Misconception evidence saved to your error notebook: {[...new Set(mis.flatMap((m) => m.misconceptionIds))].join(', ')}.
        </p>
      )}
      <div className="row">
        <a className="btn primary" href={href('review')}>
          Go to Review
        </a>
        <a className="btn" href={href('lab/LAB01?mode=guided')}>
          Guided practice
        </a>
        <a className="btn" href={href('notebook')}>
          Error notebook
        </a>
      </div>
    </div>
  );
}
