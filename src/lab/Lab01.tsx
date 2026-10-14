import { useMemo, useState } from 'react';
import { href } from '../app/router';
import { FAMILIES } from '../domain/missions';
import {
  CLASS_LABEL, astigmatismOrientation, classify, fmtAxis, fmtD, formatRx, fromMatrix, gradeLens, makeLens, meridionalPower,
  normalizeAxis, orientationDiff, sphericalEquivalent, toMatrix, toPowerCross, toVector, type SpheroCyl,
} from '../domain/optics';
import { newSeed } from '../domain/random';
import { Feedback, NumberEntry, Seg, parseDioptre } from '../ui/kit';
import { CylinderMission } from './CylinderMission';
import { FocusView } from './FocusView';
import { CylinderCanvas, PowerGraph, PowerLegend } from './OpticsViews';
import { TaskRunner } from './TaskRunner';
import { TranspositionAnimator } from './Transposition';

type Mode = 'mission' | 'explore' | 'guided' | 'challenge' | 'patient';

export function Lab01({ query }: { query: URLSearchParams }) {
  const mode = (query.get('mode') as Mode) || 'mission';
  const setMode = (m: Mode) => (location.hash = href(`lab/LAB01?mode=${m}`));
  return (
    <div className="stack">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ marginBottom: 2 }}>LAB01 · Optical bench</h1>
          <p className="muted small" style={{ margin: 0 }}>
            Thin-lens meridional-power model · conceptual schematic + constrained simulation · content status: draft, not clinically reviewed
          </p>
        </div>
        <Seg
          label="Studio mode"
          value={mode}
          onChange={setMode}
          options={[
            { value: 'mission', label: 'Intro mission' },
            { value: 'explore', label: 'Explore' },
            { value: 'guided', label: 'Guided practice' },
            { value: 'challenge', label: 'Independent challenge' },
            { value: 'patient', label: 'Patient case' },
          ]}
        />
      </div>
      {mode === 'mission' && <CylinderMission />}
      {mode === 'explore' && <Explore query={query} />}
      {(mode === 'guided' || mode === 'challenge') && <Practice key={mode} mode={mode} query={query} />}
      {mode === 'patient' && (
        <div className="panel">
          <h2>Patient case mode</h2>
          <p>The same optical model drives the refraction patients. Choose a case: the retinoscope, trial lenses and notebook all read the case’s hidden target refraction.</p>
          <a className="btn primary" href={href('patients')}>
            Open the patient list
          </a>
        </div>
      )}
    </div>
  );
}

function num(q: URLSearchParams, k: string, d: number) {
  const v = Number(q.get(k));
  return q.has(k) && Number.isFinite(v) ? v : d;
}

interface Change {
  what: string;
  explanation: string;
}

function Explore({ query }: { query: URLSearchParams }) {
  const [S, setS] = useState(String(num(query, 'S', 0)));
  const [C, setC] = useState(String(num(query, 'C', -4)));
  const [A, setA] = useState(num(query, 'A', 180));
  const [probe, setProbe] = useState(45);
  const [labels, setLabels] = useState(true);
  const [notationConv, setNotationConv] = useState<'as-entered' | 'minus' | 'plus'>('as-entered');
  const [context, setContext] = useState<'lens' | 'patient'>('lens');
  const [view, setView] = useState<'power' | 'focus' | 'transpose'>('power');
  const [compare, setCompare] = useState<'none' | 'alias' | 'se' | 'rot90'>('none');
  const [hypo, setHypo] = useState<null | { lens: SpheroCyl; changed: string; fixed: string }>(null);
  const [lastChange, setLastChange] = useState<Change | null>(null);
  const [showExplain, setShowExplain] = useState(false);
  const proposal: SpheroCyl | null = query.has('pS') ? makeLens(num(query, 'pS', 0), num(query, 'pC', 0), num(query, 'pA', 180)) : null;

  const sv = parseDioptre(S);
  const cv = parseDioptre(C);
  const valid = Number.isFinite(sv) && Number.isFinite(cv) && Math.abs(sv) <= 20 && Math.abs(cv) <= 10;
  const lens = valid ? makeLens(sv, cv, A) : makeLens(0);
  const shown = notationConv === 'as-entered' ? lens : fromMatrix(toMatrix(lens), notationConv);
  const v = toVector(lens);
  const pc = toPowerCross(lens);
  const cls = classify(lens, context === 'patient' ? 'full-distance-correction-relaxed' : 'lens-only');
  const reset = () => {
    setS('0');
    setC('-4');
    setA(180);
    setProbe(45);
    setHypo(null);
    setCompare('none');
    setLastChange(null);
  };
  const explainProbe = (p: number): Change => {
    const d = orientationDiff(p, lens.axisDeg ?? 180);
    return {
      what: `Measurement meridian moved to ${fmtAxis(p)}°`,
      explanation:
        lens.cylinderD === 0
          ? `A spherical lens has ${fmtD(lens.sphereD)} D in every meridian, so moving the meridian changes nothing.`
          : `The meridian is ${d.toFixed(0)}° from the cylinder axis. sin²(${d.toFixed(0)}°) = ${Math.sin((d * Math.PI) / 180) ** 2 < 1e-9 ? '0' : (Math.sin((d * Math.PI) / 180) ** 2).toFixed(3)}, so F = ${fmtD(lens.sphereD)} + (${fmtD(lens.cylinderD)}) × ${(Math.sin((d * Math.PI) / 180) ** 2).toFixed(3)} = ${fmtD(meridionalPower(lens, p))} D. The axis itself carries sphere only; full cylinder power lies 90° from it.`,
    };
  };
  const compareLens = compare === 'alias' ? makeLens(lens.sphereD, lens.cylinderD, 180 - (lens.axisDeg ?? 180)) : compare === 'se' ? makeLens(sphericalEquivalent(lens)) : compare === 'rot90' ? makeLens(lens.sphereD, lens.cylinderD, (lens.axisDeg ?? 180) + 90) : null;
  const compareGrade = compareLens ? gradeLens(compareLens, lens) : null;

  return (
    <div className="lab" data-testid="lab01-explore">
      <aside className="controls-col stack">
        <div className="panel stack">
          <h3>Instrument</h3>
          <NumberEntry id="ex-sph" label="Sphere" unit="D" value={S} onChange={(x) => { setS(x); setLastChange({ what: 'Sphere changed', explanation: 'Sphere adds the same power to every meridian: the whole curve shifts up or down without changing shape or axis.' }); }} />
          <input type="range" aria-label="Sphere slider" min={-8} max={8} step={0.25} value={Number.isFinite(sv) ? sv : 0} onChange={(e) => { setS(e.target.value); setLastChange({ what: 'Sphere changed', explanation: 'Sphere adds the same power to every meridian: the whole curve shifts up or down without changing shape or axis.' }); }} />
          <NumberEntry id="ex-cyl" label="Cylinder" unit="D" value={C} onChange={(x) => { setC(x); setLastChange({ what: 'Cylinder changed', explanation: 'Cylinder power is added progressively away from the axis (sin² weighting): zero at the axis, full value 90° away. The axis orientation is unchanged.' }); }} />
          <input type="range" aria-label="Cylinder slider" min={-6} max={6} step={0.25} value={Number.isFinite(cv) ? cv : 0} onChange={(e) => { setC(e.target.value); setLastChange({ what: 'Cylinder changed', explanation: 'Cylinder power is added progressively away from the axis (sin² weighting): zero at the axis, full value 90° away.' }); }} />
          <label className="field">
            <span>Axis A: {fmtAxis(A)}° {lens.cylinderD === 0 && <span className="muted">(undefined — zero cylinder)</span>}</span>
            <input type="range" aria-label="Cylinder axis in degrees" min={1} max={180} step={1} value={A} onChange={(e) => { setA(Number(e.target.value)); setLastChange({ what: `Axis rotated to ${e.target.value}°`, explanation: `The whole power field rotates with the axis. Sphere-only power now lies at ${fmtAxis(Number(e.target.value))}°, full cylinder at ${fmtAxis(Number(e.target.value) + 90)}°. Meridional power at a fixed probe changes; principal powers do not.` }); }} />
          </label>
          <input className="num" type="number" min={0} max={180} aria-label="Axis exact entry" value={A} onChange={(e) => { const n = Number(e.target.value); if (Number.isFinite(n) && n >= 0 && n <= 180) setA(normalizeAxis(n)); }} />
          <label className="field">
            <span>Measurement meridian θ: {fmtAxis(probe)}° (separate from the axis)</span>
            <input type="range" aria-label="Measurement meridian in degrees" min={1} max={180} value={probe} onChange={(e) => { const p = Number(e.target.value); setProbe(p); setLastChange(explainProbe(p)); }} />
          </label>
          {!valid && <Feedback tone="bad" title="Enter sphere ±20 D and cylinder ±10 D" />}
          <div className="row">
            <button className="btn sm" onClick={reset}>
              Reset
            </button>
            <button className="btn sm" onClick={() => setLabels(!labels)} aria-pressed={!labels}>
              {labels ? 'Hide labels' : 'Reveal labels'}
            </button>
          </div>
          <div className="small">
            <div className="muted">Display notation</div>
            <Seg label="Notation" value={notationConv} onChange={setNotationConv} options={[{ value: 'as-entered', label: 'As entered' }, { value: 'minus', label: '−cyl' }, { value: 'plus', label: '+cyl' }]} />
          </div>
          <div className="small">
            <div className="muted">Context</div>
            <Seg label="Context" value={context} onChange={setContext} options={[{ value: 'lens', label: 'Lens' }, { value: 'patient', label: 'Fictional patient' }]} />
          </div>
        </div>
        <div className="panel stack small">
          <h3>Compare</h3>
          <Seg label="Compare with" value={compare} onChange={setCompare} options={[{ value: 'none', label: 'Off' }, { value: 'alias', label: 'Mirror axis' }, { value: 'se', label: 'SE sphere' }, { value: 'rot90', label: 'Axis +90°' }]} />
          <h3 style={{ marginTop: 10 }}>Change one thing</h3>
          <div className="row">
            <button className="btn sm" onClick={() => setHypo({ lens: makeLens(lens.sphereD, -lens.cylinderD, lens.axisDeg), changed: 'cylinder sign flipped', fixed: 'sphere and axis' })}>Flip cyl sign</button>
            <button className="btn sm" onClick={() => setHypo({ lens: makeLens(lens.sphereD, lens.cylinderD, (lens.axisDeg ?? 180) + 90), changed: 'axis rotated 90°', fixed: 'sphere and cylinder' })}>Rotate axis 90°</button>
            <button className="btn sm" onClick={() => setHypo({ lens: makeLens(lens.sphereD + 0.5, lens.cylinderD, lens.axisDeg), changed: 'sphere +0.50 D', fixed: 'cylinder and axis' })}>Sphere +0.50</button>
          </div>
        </div>
      </aside>
      <section className="canvas-col stack">
        <div className="row">
          <Seg label="View" value={view} onChange={setView} options={[{ value: 'power', label: 'Power field' }, { value: 'focus', label: 'Focus in the eye' }, { value: 'transpose', label: 'Transposition' }]} />
        </div>
        {view === 'power' && (
          <>
            <div className={compareLens ? 'grid cols-2' : ''}>
              <div className="canvas-wrap">
                <CylinderCanvas lens={lens} probeDeg={probe} onProbe={(p) => { setProbe(p); setLastChange(explainProbe(p)); }} showValues={labels} showAxisLabel={labels} proposal={proposal} notation={formatRx(shown)} title="Explore lens: drag the measurement meridian" />
                <PowerLegend lens={lens} />
              </div>
              {compareLens && (
                <div className="canvas-wrap">
                  <CylinderCanvas lens={compareLens} probeDeg={probe} showValues={labels} notation={formatRx(compareLens)} title="Comparison lens" />
                  <p className="small">{compare === 'alias' ? 'Mirror-image axis: same 90°/180° powers, different oblique powers.' : compare === 'se' ? 'Spherical-equivalent sphere: same mean power, no directional correction.' : 'Same numbers, axis turned 90°.'}</p>
                </div>
              )}
            </div>
            <div className="canvas-wrap">
              <PowerGraph lens={lens} probeDeg={probe} onProbe={setProbe} proposal={proposal ?? compareLens ?? hypo?.lens ?? null} showCurve title="Meridional power of the explore lens" />
              <div className="legend">
                <span><i style={{ background: 'var(--target)' }} />this lens</span>
                {(proposal || compareLens || hypo) && <span><i style={{ background: 'var(--proposal)' }} />{proposal ? 'your submitted answer' : compareLens ? 'comparison' : 'hypothetical'}</span>}
                <span><i style={{ background: 'var(--probe)' }} />θ</span>
              </div>
            </div>
          </>
        )}
        {view === 'focus' && (
          <div className="panel">
            <FocusView target={lens} />
          </div>
        )}
        {view === 'transpose' && (
          <div className="panel">
            <TranspositionAnimator lens={lens} />
          </div>
        )}
      </section>
      <aside className="stack">
        <div className="panel stack small">
          <h3>Readout</h3>
          <div className="readout">
            <div><span>F(θ) at {fmtAxis(probe)}°</span><b className="num">{fmtD(meridionalPower(lens, probe))} D</b></div>
            <div><span>Minus-cyl</span><b className="num">{formatRx(fromMatrix(toMatrix(lens), 'minus'))}</b></div>
            <div><span>Plus-cyl</span><b className="num">{formatRx(fromMatrix(toMatrix(lens), 'plus'))}</b></div>
            <div><span>Power cross</span><b className="num">{fmtD(pc.powerAD)} @ {fmtAxis(pc.meridianADeg)} · {fmtD(pc.powerBD)} @ {fmtAxis(pc.meridianBDeg)}</b></div>
            <div><span>M (SE)</span><b className="num">{fmtD(v.mD)}</b></div>
            <div><span>J0 / J45</span><b className="num">{fmtD(v.j0D)} / {fmtD(v.j45D)}</b></div>
          </div>
          {context === 'lens' ? (
            <p className="banner">This is a correcting lens, not an eye diagnosis.</p>
          ) : (
            <div className="banner good">
              <p style={{ margin: 0 }}>
                <b>Stated context:</b> complete distance correction of a regular eye, accommodation relaxed.
              </p>
              {cls.status === 'classified' && (
                <p style={{ margin: '4px 0 0' }}>
                  Classification: <b>{CLASS_LABEL[cls.cls]}</b> (principal {fmtD(cls.principal[0])} / {fmtD(cls.principal[1])} D). Correcting-cylinder orientation: {astigmatismOrientation(lens).replace(/-/g, ' ')} (minus-cyl axis within ±30° of 180 = WTR, of 090 = ATR; describes the written correction, not corneal topography).
                </p>
              )}
            </div>
          )}
          {proposal && (
            <Feedback tone="warn" title={`Your answer ${formatRx(proposal)} vs this lens`} items={gradeLens(proposal, lens).discrepancies.map((d) => `${fmtAxis(d.meridianDeg)}°: yours ${fmtD(d.proposalD)}, model ${fmtD(d.targetD)}${Math.abs(d.proposalD - d.targetD) > 0.005 ? '  ← differs' : ''}`)} />
          )}
          {compareGrade && (
            <Feedback tone={compareGrade.opticallyEquivalent ? 'good' : 'warn'} title={compareGrade.opticallyEquivalent ? 'Comparison lens is optically equivalent' : `Different lens: largest difference ${fmtD(compareGrade.worst.errorD)} D at ${fmtAxis(compareGrade.worst.meridianDeg)}°`} />
          )}
          {hypo && (
            <div className="feedback warn">
              <strong>Hypothetical (not the model lens):</strong> {formatRx(hypo.lens)}
              <div>Changed: {hypo.changed}. Kept fixed: {hypo.fixed}. At θ = {fmtAxis(probe)}°: {fmtD(meridionalPower(hypo.lens, probe))} D instead of {fmtD(meridionalPower(lens, probe))} D.</div>
              <button className="btn sm" onClick={() => setHypo(null)}>Discard hypothetical</button>
            </div>
          )}
          <button className="btn sm" onClick={() => setShowExplain(!showExplain)} aria-expanded={showExplain}>
            Explain this change
          </button>
          {showExplain && (
            <div className="feedback">
              {lastChange ? (
                <>
                  <strong>{lastChange.what}.</strong> {lastChange.explanation}
                </>
              ) : (
                'Change a control first.'
              )}
              <div className="tiny muted" style={{ marginTop: 4 }}>
                Model: F(θ) = S + C·sin²(θ−A). Sources: O1 (EyeRounds optics, notation/transposition), O2 (Thibos power vectors). Worked calculation from the model.
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

function Practice({ mode, query }: { mode: 'guided' | 'challenge'; query: URLSearchParams }) {
  const practice = FAMILIES.filter((f) => f.pool === 'practice');
  const [fam, setFam] = useState(query.get('family') ?? practice[0].id);
  const [seed, setSeed] = useState(() => newSeed());
  const task = useMemo(() => FAMILIES.find((f) => f.id === fam)!.make(seed), [fam, seed]);
  return (
    <div className="stack">
      <div className="panel row">
        <label className="field" style={{ minWidth: 280 }}>
          <span>Task family ({practice.length} practice families; {FAMILIES.length - practice.length} held out for exams)</span>
          <select value={fam} onChange={(e) => { setFam(e.target.value); setSeed(newSeed()); }}>
            {practice.map((f) => (
              <option key={f.id} value={f.id}>
                {f.title}
              </option>
            ))}
          </select>
        </label>
        <span className="small muted">Seed {seed} · {mode === 'guided' ? 'hints available (recorded)' : 'no hints, labels hidden'}</span>
      </div>
      <div className="panel">
        <TaskRunner task={mode === 'challenge' ? { ...task, display: { ...task.display, hideLabels: true } } : task} mode={mode} onNext={() => setSeed(newSeed())} />
      </div>
    </div>
  );
}


