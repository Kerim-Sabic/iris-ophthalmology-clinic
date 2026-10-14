import { useMemo, useState } from 'react';
import { useApp } from '../app/context';
import { ANSWER_TOL_D } from '../domain/missions';
import { CLASS_LABEL, classify, fmtAxis, fmtD, formatRx, gradeLens, makeLens, normalizeAxis, orientationDiff, prenticePrismDioptres, toPowerCross, transpose, type RefractiveClass } from '../domain/optics';
import { newSeed, rng } from '../domain/random';
import { now } from '../lib/store';
import { Feedback, NumberEntry, RxEntry, Seg, parseDioptre, rxFromState, type RxEntryState } from '../ui/kit';

type Tab = 'desk' | 'lensometer' | 'prism';

export function Lab03() {
  const [tab, setTab] = useState<Tab>('desk');
  return (
    <div className="stack">
      <h1>LAB03 · Prescription, lensometry and refractive-diagnosis desk</h1>
      <p className="small muted">Partial studio. Exported notes are fictional educational records, not usable prescriptions. A measured pair of glasses establishes lens properties, not the wearer’s current diagnosis.</p>
      <Seg label="Desk tool" value={tab} onChange={setTab} options={[{ value: 'desk', label: 'Bilateral prescription' }, { value: 'lensometer', label: 'Lensometer (T020)' }, { value: 'prism', label: 'Prentice / prism (T081)' }]} />
      {tab === 'desk' && <Desk />}
      {tab === 'lensometer' && <Lensometer />}
      {tab === 'prism' && <Prism />}
    </div>
  );
}

function deskTask(seed: number) {
  const r = rng(seed);
  const mk = () => makeLens(r.quarter(-3, 2), -r.quarter(0.5, 2.5), r.pick([180, 90, 10, 170, 45, 135, 20, 160]));
  const od = mk();
  const os = mk();
  const requested = r.pick(['minus', 'plus'] as const);
  // OD given as a power cross; OS given in the opposite cylinder convention.
  return { od, os, requested, osShown: requested === 'minus' ? transpose(os) : os, odCross: toPowerCross(od) };
}

function Desk() {
  const { recordAttempt } = useApp();
  const [seed, setSeed] = useState(newSeed());
  const t = useMemo(() => deskTask(seed), [seed]);
  const osShown = t.requested === 'minus' && t.os.cylinderD < 0 ? transpose(t.os) : t.requested === 'plus' && t.os.cylinderD > 0 ? transpose(t.os) : t.os;
  const [rx, setRx] = useState<Record<'OD' | 'OS', RxEntryState>>({ OD: { result: null, confirmed: false }, OS: { result: null, confirmed: false } });
  const [cls, setCls] = useState<Record<'OD' | 'OS', string>>({ OD: '', OS: '' });
  const [res, setRes] = useState<{ eye: string; rows: [string, string][] }[] | null>(null);
  const [start] = useState(now());
  const submit = async () => {
    const out: { eye: string; rows: [string, string][] }[] = [];
    let all = true;
    for (const eye of ['OD', 'OS'] as const) {
      const target = eye === 'OD' ? t.od : t.os;
      const other = eye === 'OD' ? t.os : t.od;
      const l = rxFromState(rx[eye]);
      const rows: [string, string][] = [];
      if (!l) {
        rows.push(['Entry', 'missing']);
        all = false;
      } else {
        const g = gradeLens(l, target, t.requested, ANSWER_TOL_D);
        rows.push(['Optical equivalence', g.opticallyEquivalent ? 'yes' : `no — largest error ${fmtD(g.worst.errorD)} D at ${fmtAxis(g.worst.meridianDeg)}°`]);
        rows.push(['Requested notation', g.notation === 'as-requested' ? `${t.requested}-cylinder ✓` : g.notation === 'other-convention' ? `optically right but not ${t.requested}-cylinder` : 'n/a (sphere)']);
        const swapped = !g.opticallyEquivalent && gradeLens(l, other, 'any', ANSWER_TOL_D).opticallyEquivalent;
        rows.push(['Laterality', swapped ? `this is the ${eye === 'OD' ? 'left' : 'right'} eye’s lens — OD/OS swapped` : 'consistent']);
        if (!g.opticallyEquivalent || g.notation === 'other-convention' || swapped) all = false;
        for (const h of g.hypotheses) rows.push(['Pattern', h.message]);
      }
      const c = classify(target, 'full-distance-correction-relaxed');
      const exp = c.status === 'classified' ? c.cls : '';
      rows.push(['Classification (stated full-correction context)', cls[eye] === exp ? 'supported' : `not supported — principal powers ${fmtD(toPowerCross(target).powerAD)} / ${fmtD(toPowerCross(target).powerBD)} D → ${CLASS_LABEL[exp as RefractiveClass]}`]);
      if (cls[eye] !== exp) all = false;
      out.push({ eye, rows });
    }
    await recordAttempt({ itemId: `LAB03-desk#${seed}`, itemVersion: 1, familyId: 'F-RX-DESK-BILATERAL', objectiveIds: ['OPT-WRITE', 'OPT-TRANSPOSE', 'OPT-CLASSIFY'], lectureIds: ['L05'], seed, taskType: 'documentation', mode: 'learning', response: { OD: rxFromState(rx.OD), OS: rxFromState(rx.OS), cls }, correct: all, scores: Object.fromEntries(out.flatMap((o) => o.rows.map(([k, v]) => [`${o.eye} ${k}`, v]))), confidence: null, hintLevel: 0, misconceptionIds: [], startedAt: start, state: { target: t.od } });
    setRes(out);
  };
  return (
    <div className="grid cols-2" style={{ alignItems: 'start' }}>
      <div className="panel stack">
        <h2>Fictional referral note</h2>
        <p>
          <b>Right eye:</b> principal meridians {fmtD(t.odCross.powerAD)} D at {fmtAxis(t.odCross.meridianADeg)}° and {fmtD(t.odCross.powerBD)} D at {fmtAxis(t.odCross.meridianBDeg)}°.
        </p>
        <p>
          <b>Left eye:</b> written as <span className="num">{formatRx(osShown)}</span>.
        </p>
        <p>
          Context: each is the complete distance correction with accommodation relaxed. Write both eyes in <b>{t.requested}-cylinder</b> notation and classify each eye.
        </p>
        <button className="btn sm" onClick={() => { setSeed(newSeed()); setRes(null); }}>
          New note
        </button>
      </div>
      <div className="panel stack">
        <h2>Prescription form</h2>
        {(['OD', 'OS'] as const).map((eye) => (
          <fieldset key={eye + seed} style={{ border: '1px solid var(--line)', borderRadius: 8, padding: 10 }}>
            <legend>{eye === 'OD' ? 'OD — right eye' : 'OS — left eye'}</legend>
            <RxEntry idPrefix={`desk-${eye}`} onChange={(s) => setRx((o) => ({ ...o, [eye]: s }))} />
            <select aria-label={`${eye} classification`} value={cls[eye]} onChange={(e) => setCls({ ...cls, [eye]: e.target.value })} style={{ marginTop: 6 }}>
              <option value="">Classification…</option>
              {(Object.keys(CLASS_LABEL) as RefractiveClass[]).map((k) => (
                <option key={k} value={k}>
                  {CLASS_LABEL[k]}
                </option>
              ))}
            </select>
          </fieldset>
        ))}
        <p className="tiny muted">ADD and prism/base are separate fields of a real prescription; this exercise does not request them.</p>
        <button className="btn primary" onClick={submit}>
          Check form
        </button>
        {res && (
          <table className="data small">
            <tbody>
              {res.flatMap((o) =>
                o.rows.map(([k, v], i) => (
                  <tr key={o.eye + i}>
                    <td>{i === 0 ? <b>{o.eye}</b> : ''}</td>
                    <td>{k}</td>
                    <td>{v}</td>
                  </tr>
                )),
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/** Simplified focimeter: each principal power brings a line set into focus; lines are perpendicular to their meridian. */
function Lensometer() {
  const { recordAttempt } = useApp();
  const [seed, setSeed] = useState(newSeed());
  const lens = useMemo(() => {
    const r = rng(seed);
    return makeLens(r.quarter(-4, 3), -r.quarter(0.5, 3), r.int(1, 36) * 5);
  }, [seed]);
  const pc = toPowerCross(lens);
  const [power, setPower] = useState(0);
  const [axisWheel, setAxisWheel] = useState(90);
  const [reads, setReads] = useState<{ powerD: number; axisDeg: number }[]>([]);
  const [ans, setAns] = useState<RxEntryState>({ result: null, confirmed: false });
  const [fb, setFb] = useState<string[] | null>(null);
  const [start] = useState(now());
  const sets = [
    { p: pc.powerAD, merid: pc.meridianADeg },
    { p: pc.powerBD, merid: pc.meridianBDeg },
  ].map((s) => ({ ...s, lineOrient: normalizeAxis(s.merid + 90), blur: Math.min(8, Math.abs(power - s.p) * 4) }));
  const W = 260;
  const c = W / 2;
  const linesFor = (orient: number, blur: number, aligned: boolean, color: string, k: string) => {
    const out = [];
    const a = (-orient * Math.PI) / 180;
    const dir = { x: Math.cos(a), y: Math.sin(a) };
    const nrm = { x: -dir.y, y: dir.x };
    for (let i = -3; i <= 3; i++) {
      const o = i * 14;
      const x1 = c + nrm.x * o - dir.x * 90;
      const y1 = c + nrm.y * o - dir.y * 90;
      const x2 = c + nrm.x * o + dir.x * 90;
      const y2 = c + nrm.y * o + dir.y * 90;
      out.push(<line key={k + i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.5 + blur} opacity={Math.max(0.1, 1 - blur / 9)} strokeDasharray={aligned ? undefined : '6 5'} />);
    }
    return out;
  };
  const check = async () => {
    const l = rxFromState(ans);
    if (!l) return;
    const g = gradeLens(l, lens, 'any', ANSWER_TOL_D);
    setFb([g.opticallyEquivalent ? 'Correct lens reading.' : `Not this lens: largest error ${fmtD(g.worst.errorD)} D at ${fmtAxis(g.worst.meridianDeg)}°.`, `Lens: ${formatRx(lens)} = ${formatRx(transpose(lens))}.`, 'This describes the spectacle lens only — not the wearer’s current refraction or diagnosis.', ...g.hypotheses.map((h) => h.message)]);
    await recordAttempt({ itemId: `LAB03-lensometer#${seed}`, itemVersion: 1, familyId: 'F-LENSOMETRY', objectiveIds: ['OPT-WRITE'], lectureIds: ['L05'], seed, taskType: 'procedural-sequence', mode: 'learning', response: { kind: 'rx', lens: l }, correct: g.opticallyEquivalent, scores: { opticallyEquivalent: g.opticallyEquivalent }, confidence: null, hintLevel: 0, misconceptionIds: g.hypotheses.map((h) => h.id), startedAt: start, state: { target: lens } });
  };
  return (
    <div className="grid cols-2" style={{ alignItems: 'start' }}>
      <div className="canvas-wrap">
        <svg viewBox={`0 0 ${W} ${W}`} role="img" aria-label={`Focimeter target. Power wheel ${fmtD(power)} D, axis wheel ${axisWheel} degrees.`}>
          <rect width={W} height={W} fill="#0f1a14" rx={10} />
          <circle cx={c} cy={c} r={110} fill="none" stroke="#2b4a3a" />
          {sets.map((s, i) => linesFor(s.lineOrient, s.blur, orientationDiff(axisWheel, s.lineOrient) < 3, i === 0 ? '#9fe3b8' : '#c8f2d6', 'set' + i))}
          <text x={8} y={W - 8} fill="#9fe3b8" fontSize="11">
            power {fmtD(power)} D · axis wheel {axisWheel}°
          </text>
        </svg>
        <p className="tiny muted">Simplified, labelled focimeter model (constrained simulation): a line set is sharp when the power wheel equals one principal power; lines run perpendicular to that meridian and are continuous only when the axis wheel is aligned with them.</p>
      </div>
      <div className="stack">
        <label className="field">
          <span>Power wheel: {fmtD(power)} D</span>
          <input type="range" min={-10} max={8} step={0.25} value={power} onChange={(e) => setPower(Number(e.target.value))} aria-label="Power wheel in dioptres" />
        </label>
        <label className="field">
          <span>Axis wheel: {axisWheel}°</span>
          <input type="range" min={1} max={180} value={axisWheel} onChange={(e) => setAxisWheel(Number(e.target.value))} aria-label="Axis wheel in degrees" />
        </label>
        <button className="btn" onClick={() => setReads([...reads, { powerD: power, axisDeg: axisWheel }])}>
          Record reading
        </button>
        {reads.length > 0 && (
          <table className="data small">
            <tbody>
              {reads.map((r, i) => (
                <tr key={i}>
                  <td>Reading {i + 1}</td>
                  <td className="num">{fmtD(r.powerD)} D</td>
                  <td className="num">lines at {r.axisDeg}°</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p className="small">From two sharp readings, write the lens. (Hint: the power whose lines run along a direction belongs to the meridian 90° away.)</p>
        <RxEntry key={seed} idPrefix="lenso" onChange={setAns} />
        <div className="row">
          <button className="btn primary" disabled={!rxFromState(ans)} onClick={check}>
            Check reading
          </button>
          <button className="btn" onClick={() => { setSeed(newSeed()); setReads([]); setFb(null); }}>
            New lens
          </button>
        </div>
        {fb && <Feedback tone={fb[0].startsWith('Correct') ? 'good' : 'bad'} title="Lensometry result" items={fb} />}
      </div>
    </div>
  );
}

function Prism() {
  const { recordAttempt } = useApp();
  const [seed, setSeed] = useState(newSeed());
  const t = useMemo(() => {
    const r = rng(seed);
    return { F: r.pick([-6, -4, -3, -2, 2, 3, 4, 5]), c: r.pick([0.25, 0.5, 0.75, 1]), dir: r.pick(['above', 'below'] as const) };
  }, [seed]);
  const [pd, setPd] = useState('');
  const [base, setBase] = useState('');
  const [fb, setFb] = useState<{ ok: boolean; items: string[] } | null>(null);
  const expected = prenticePrismDioptres(t.c, t.F);
  const expBase = (t.F > 0) === (t.dir === 'above') ? 'down' : 'up';
  return (
    <div className="panel stack" style={{ maxWidth: 640 }}>
      <p>
        A spherical lens of <b className="num">{fmtD(t.F)} D</b>. The wearer looks through a point <b>{t.c * 10} mm {t.dir}</b> the optical centre. What prism is induced, and in which base direction?
      </p>
      <div className="grid cols-2">
        <NumberEntry label="Prism" unit="Δ (prism dioptres)" value={pd} onChange={setPd} />
        <label className="field">
          <span>Base</span>
          <select value={base} onChange={(e) => setBase(e.target.value)}>
            <option value="">Choose…</option>
            <option value="up">Base up</option>
            <option value="down">Base down</option>
          </select>
        </label>
      </div>
      <div className="row">
        <button
          className="btn primary"
          disabled={!Number.isFinite(parseDioptre(pd)) || !base}
          onClick={async () => {
            const v = parseDioptre(pd);
            const okP = Math.abs(v - expected) < 0.01;
            const okB = base === expBase;
            setFb({ ok: okP && okB, items: [`Prentice: Δ = c (cm) × F (D) = ${t.c} × ${Math.abs(t.F)} = ${expected.toFixed(2)} Δ.${okP ? '' : ' Decentration must be in centimetres.'}`, `A ${t.F > 0 ? 'plus' : 'minus'} lens behaves like prisms ${t.F > 0 ? 'base-to-base (bases toward the centre)' : 'apex-to-apex (bases toward the edge)'}, so ${t.dir} the centre the base is ${expBase}.`, 'Prism dioptres are not lens dioptres and not degrees.'] });
            await recordAttempt({ itemId: `LAB03-prism#${seed}`, itemVersion: 1, familyId: 'F-PRENTICE', objectiveIds: ['OPT-COMPOSE'], lectureIds: ['L03'], seed, taskType: 'numerical-production', mode: 'learning', response: { prism: v, base }, correct: okP && okB, scores: { prism: okP, base: okB }, confidence: null, hintLevel: 0, misconceptionIds: [], startedAt: now() });
          }}
        >
          Check
        </button>
        <button className="btn" onClick={() => { setSeed(newSeed()); setFb(null); setPd(''); setBase(''); }}>
          New problem
        </button>
      </div>
      {fb && <Feedback tone={fb.ok ? 'good' : 'bad'} title={fb.ok ? 'Correct' : 'Check the calculation'} items={fb.items} />}
    </div>
  );
}
