import { useState } from 'react';
import { addMatrices, blurStrength, fmtAxis, fmtD, formatRx, jcc, makeLens, normalizeAxis, patientPreference, scalarMatrix, subMatrices, toMatrix, type SpheroCyl } from '../domain/optics';
import { Seg } from '../ui/kit';

/**
 * Subjective refinement with a fictional patient. Declared workflow: MINUS-cylinder trial lenses.
 * The JCC is composed mathematically with the trial lens; the patient's preference is a declared
 * teaching metric (lower residual blur strength, tie zone 0.04 D), not a validated preference model.
 */
export function JccTool({ target, start, onResult }: { target: SpheroCyl; start: SpheroCyl; onResult?(lens: SpheroCyl): void }) {
  const [sph, setSph] = useState(start.sphereD);
  const [cyl, setCyl] = useState(start.cylinderD <= 0 ? start.cylinderD : -start.cylinderD);
  const [ax, setAx] = useState(start.axisDeg ?? 180);
  const [p, setP] = useState(0.25);
  const [check, setCheck] = useState<'axis' | 'power' | 'sphere'>('sphere');
  const [log, setLog] = useState<string[]>([]);
  const [keepSE, setKeepSE] = useState(true);
  const [teaching, setTeaching] = useState(false);
  const trial = makeLens(sph, cyl, ax);
  const qt = toMatrix(trial);
  // Positions: for axis check the JCC principal meridians straddle the trial axis (±45°);
  // for power check they lie along the trial principal meridians.
  const base = check === 'axis' ? ax + 45 : ax;
  const view1 = jcc(p, base); // +p meridian at `base`
  const view2 = jcc(p, base + 90); // flipped: +p meridian 90° away
  const ask = () => {
    let v1, v2, d1, d2;
    if (check === 'sphere') {
      v1 = addMatrices(qt, scalarMatrix(0.25));
      v2 = addMatrices(qt, scalarMatrix(-0.25));
      d1 = 'with +0.25';
      d2 = 'with −0.25';
      // Declared accommodation behaviour: excess minus is accepted by accommodating, reported as "smaller and darker", not clearer.
      const resid2 = subMatrices(v2, toMatrix(target));
      const m2 = (resid2.xxD + resid2.yyD) / 2;
      const pref = patientPreference(target, v1, v2);
      let ans = pref === 'first' ? `prefers ${d1}` : pref === 'second' ? `prefers ${d2}` : 'about the same';
      if (pref === 'second' && m2 < -0.1) ans = '“the minus lens makes letters smaller and darker, not clearer”';
      if (pref === 'same' && m2 < 0) ans = '“about the same — the minus one looks a bit smaller and darker”';
      setLog((l) => [`Sphere check ${formatRx(trial)}: ${ans}`, ...l].slice(0, 12));
      return;
    }
    v1 = addMatrices(qt, toMatrix(view1));
    v2 = addMatrices(qt, toMatrix(view2));
    const pref = patientPreference(target, v1, v2);
    const describe = (j: SpheroCyl) => `+${p.toFixed(2)} D at ${fmtAxis(j.axisDeg)}°, −${p.toFixed(2)} D at ${fmtAxis(j.axisDeg! + 90)}°`;
    setLog((l) => [`${check === 'axis' ? 'Axis' : 'Power'} check on ${formatRx(trial)} — view 1 (${describe(view1)}) vs view 2 (${describe(view2)}): ${pref === 'same' ? 'about the same' : `prefers view ${pref === 'first' ? 1 : 2}`}`, ...l].slice(0, 12));
  };
  const changeCyl = (d: number) => {
    const nc = Math.round((cyl + d) * 4) / 4;
    if (nc > 0) return;
    setCyl(nc);
    if (keepSE) setSph(Math.round((sph - d / 2) * 8) / 8);
  };
  const resid = blurStrength(subMatrices(qt, toMatrix(target)));
  return (
    <div className="grid cols-2" style={{ alignItems: 'start' }} data-testid="jcc">
      <div className="stack">
        <div className="row small">
          <span className="muted">Check</span>
          <Seg label="Refinement step" value={check} onChange={setCheck} options={[{ value: 'sphere', label: 'Sphere ±0.25' }, { value: 'axis', label: 'JCC axis' }, { value: 'power', label: 'JCC power' }]} />
        </div>
        <div className="row small">
          <span className="muted">JCC</span>
          <Seg label="JCC power" value={p === 0.5 ? "0.5" : "0.25"} onChange={(v) => setP(Number(v))} options={[{ value: '0.25', label: '±0.25' }, { value: '0.5', label: '±0.50' }]} />
        </div>
        {check !== 'sphere' && (
          <div className="feedback small">
            <b>View 1:</b> +{p.toFixed(2)} D at {fmtAxis(base)}°, −{p.toFixed(2)} D at {fmtAxis(base + 90)}°<br />
            <b>View 2 (flipped):</b> +{p.toFixed(2)} D at {fmtAxis(base + 90)}°, −{p.toFixed(2)} D at {fmtAxis(base)}°<br />
            <span className="muted">
              A ±{p.toFixed(2)} JCC has principal powers +{p.toFixed(2)}/−{p.toFixed(2)} D, zero spherical equivalent and a {(2 * p).toFixed(2)} D difference — not a {p.toFixed(2)} D cylinder. Powers are labelled; no colour code is needed.
            </span>
          </div>
        )}
        <button className="btn primary" onClick={ask} data-testid="ask-patient">
          Show both views and ask the patient
        </button>
        <ol className="small" style={{ paddingLeft: 18 }} aria-live="polite">
          {log.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ol>
      </div>
      <div className="stack">
        <div className="panel stack small" style={{ padding: 10 }}>
          <b>Current trial correction (minus-cylinder workflow)</b>
          <p className="num" style={{ fontSize: '1.1rem', margin: 0 }}>{formatRx(trial)}</p>
          <div className="row">
            <span style={{ width: 64 }}>Sphere</span>
            <button className="btn sm" onClick={() => setSph(Math.round((sph - 0.25) * 4) / 4)}>−0.25</button>
            <button className="btn sm" onClick={() => setSph(Math.round((sph + 0.25) * 4) / 4)}>+0.25</button>
          </div>
          <div className="row">
            <span style={{ width: 64 }}>Cylinder</span>
            <button className="btn sm" onClick={() => changeCyl(-0.25)}>−0.25</button>
            <button className="btn sm" onClick={() => changeCyl(0.25)}>+0.25</button>
            <label className="row">
              <input type="checkbox" checked={keepSE} onChange={(e) => setKeepSE(e.target.checked)} /> keep SE (sphere moves by half, opposite)
            </label>
          </div>
          <div className="row">
            <span style={{ width: 64 }}>Axis</span>
            {[-10, -5, 5, 10].map((d) => (
              <button key={d} className="btn sm" onClick={() => setAx(normalizeAxis(ax + d))}>
                {d > 0 ? '+' : ''}
                {d}°
              </button>
            ))}
            <span className="num">{fmtAxis(ax)}°</span>
          </div>
          {onResult && (
            <button className="btn" onClick={() => onResult(trial)} data-testid="record-subjective">
              Record this as my subjective end-point
            </button>
          )}
        </div>
        <label className="row small">
          <input type="checkbox" checked={teaching} onChange={(e) => setTeaching(e.target.checked)} /> Teaching readout
        </label>
        {teaching && <div className="feedback small">Residual blur strength of the current trial against the hidden target: {fmtD(resid)} D (declared metric, not acuity).</div>}
        <p className="tiny muted">Endpoint logic: choose the most plus (least minus) sphere that gives the best reported clarity; a “smaller and darker” report signals excess minus being accommodated. Source O4 workflow; preference function is a simulation assumption.</p>
      </div>
    </div>
  );
}
