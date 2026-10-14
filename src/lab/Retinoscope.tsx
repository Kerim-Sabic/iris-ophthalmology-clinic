import { useEffect, useRef, useState } from 'react';
import { useApp } from '../app/context';
import type { RetinoQuality } from '../domain/cases';
import { addMatrices, fmtAxis, fmtD, formatRx, fromMatrix, makeLens, meridionalPower, normalizeAxis, retinoscopy, scalarMatrix, toMatrix, type SpheroCyl } from '../domain/optics';
import { Seg } from '../ui/kit';

export interface RetinoRecord {
  meridianDeg: number;
  /** Power of the trial lenses in that meridian, EXCLUDING any working-distance lens. */
  trialD: number;
  workingDistanceM: number;
  wdLensIncluded: boolean;
}

const WD_OPTIONS: { value: string; label: string; m: number }[] = [
  { value: '0.5', label: '0.50 m', m: 0.5 },
  { value: '0.67', label: '0.67 m (entered)', m: 0.67 },
  { value: '2/3', label: '2/3 m', m: 2 / 3 },
  { value: '1', label: '1.00 m', m: 1 },
];

/**
 * Declared model: plane-mirror static retinoscopy, accommodation relaxed (except where the
 * authored case declares fluctuation). Vertical streak (90°) swept horizontally measures 180°.
 */
export function Retinoscope({ target, quality = 'clear', onRecord, records = [], teachingDefault = false, eyeLabel }: { target: SpheroCyl; quality?: RetinoQuality; onRecord?(r: RetinoRecord): void; records?: RetinoRecord[]; teachingDefault?: boolean; eyeLabel?: string }) {
  const { reducedMotion } = useApp();
  const [wd, setWd] = useState('0.5');
  const [wdLens, setWdLens] = useState(false);
  const [sph, setSph] = useState(0);
  const [cyl, setCyl] = useState(0);
  const [ax, setAx] = useState(180);
  const [streak, setStreak] = useState(90);
  const [pos, setPos] = useState(0);
  const [sweeping, setSweeping] = useState(false);
  const [teaching, setTeaching] = useState(teachingDefault);
  const [flicker, setFlicker] = useState(0);
  const raf = useRef<number | null>(null);
  const w = WD_OPTIONS.find((o) => o.value === wd)!.m;
  const trial = makeLens(sph, cyl, ax);
  const frame = wdLens ? fromMatrix(addMatrices(toMatrix(trial), scalarMatrix(1 / w))) : trial;
  // Authored fluctuation: accommodation adds variable minus-equivalent in the eye for that case only.
  const eyeTarget = quality === 'fluctuating-accommodation' ? makeLens(target.sphereD - flicker, target.cylinderD, target.axisDeg) : target;
  const obs = retinoscopy(eyeTarget, frame, streak, w);

  useEffect(() => {
    if (!sweeping) return;
    let t0: number | null = null;
    const step = (ts: number) => {
      if (t0 === null) t0 = ts;
      const t = (ts - t0) / 1000;
      setPos(Math.sin(t * 2.4));
      if (t > 2.62) {
        setSweeping(false);
        setPos(0);
        if (quality === 'fluctuating-accommodation') setFlicker([0, 0.5, 1, 0.25][Math.floor(Math.random() * 4)]);
        return;
      }
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [sweeping, quality]);

  const pupilR = quality === 'small-pupil' ? 26 : 52;
  const gain = obs.motion === 'neutral' ? 0 : obs.motion === 'with' ? 1 : -1;
  const bandW = obs.motion === 'neutral' ? pupilR * 2.2 : 10 + 30 * obs.brightness;
  const dim = quality === 'media-haze' ? 0.45 : 1;
  const offset = pos * 60;
  const reflexOffset = gain * offset * (0.4 + 0.6 * obs.brightness);
  const sweepDir = normalizeAxis(streak + 90);
  // band oriented along the streak; displaced perpendicular to it (along the sweep direction)
  const sd = { x: Math.cos((sweepDir * Math.PI) / 180), y: -Math.sin((sweepDir * Math.PI) / 180) };
  const rot = -streak;
  const qualityNote: Record<RetinoQuality, string> = {
    clear: 'Clear reflex.',
    'small-pupil': 'Small pupil: the reflex is hard to judge; observation reliability is reduced.',
    'media-haze': 'Dim, patchy reflex through hazy media: observation reliability is reduced. This does not identify a specific disease.',
    'fluctuating-accommodation': 'Reflex changes between sweeps (authored: variable accommodation). The end-point is unstable.',
  };
  const motionText = obs.motion === 'neutral' ? 'Neutral: the pupil fills with light and no motion can be seen.' : obs.motion === 'with' ? 'The reflex moves WITH the streak.' : 'The reflex moves AGAINST the streak.';
  const trialInMeridian = meridionalPower(trial, obs.measuredMeridianDeg);
  const bump = (set: (f: (v: number) => number) => void, d: number) => set((v) => Math.round((v + d) * 4) / 4);
  return (
    <div className="grid cols-2" style={{ alignItems: 'start' }} data-testid="retinoscope">
      <div className="canvas-wrap">
        <svg viewBox="0 0 300 300" role="img" aria-label={`Retinoscopic reflex${eyeLabel ? ' ' + eyeLabel : ''}. Streak at ${fmtAxis(streak)} degrees, sweeping to measure the ${fmtAxis(obs.measuredMeridianDeg)} degree meridian. ${motionText}`}>
          <defs>
            <clipPath id="pupil">
              <circle cx={150} cy={150} r={pupilR} />
            </clipPath>
          </defs>
          <rect x={0} y={0} width={300} height={300} fill="#1a1410" rx={12} />
          <circle cx={150} cy={150} r={110} fill="#5b4632" />
          <circle cx={150} cy={150} r={pupilR} fill="#120c08" />
          <g clipPath="url(#pupil)" opacity={dim}>
            {obs.motion === 'neutral' ? (
              <circle cx={150} cy={150} r={pupilR} fill={`rgba(255,170,90,${0.9})`} />
            ) : (
              <rect x={150 - bandW / 2 + reflexOffset * sd.x} y={150 - 200 + reflexOffset * sd.y} width={bandW} height={400} fill={`rgba(255,160,80,${0.25 + 0.65 * obs.brightness})`} transform={`rotate(${rot + 90} ${150 + reflexOffset * sd.x} ${150 + reflexOffset * sd.y})`} />
            )}
            {quality === 'media-haze' && [0, 1, 2, 3, 4].map((i) => <circle key={i} cx={130 + i * 11} cy={135 + (i % 2) * 22} r={7} fill="#120c08" opacity={0.6} />)}
          </g>
          {/* external streak on the face */}
          <rect x={150 - 4 + offset * sd.x} y={-60 + offset * sd.y} width={8} height={420} fill="rgba(255,220,160,.35)" transform={`rotate(${rot + 90} ${150 + offset * sd.x} ${150 + offset * sd.y})`} />
          <text x={10} y={290} fill="#e8d9c8" fontSize="11">
            Streak {fmtAxis(streak)}° · sweep measures {fmtAxis(obs.measuredMeridianDeg)}°
          </text>
          {obs.breakPhenomenon && obs.motion !== 'neutral' && (
            <text x={10} y={20} fill="#ffd27f" fontSize="10.5">
              Break: reflex not aligned — rotate the streak
            </text>
          )}
        </svg>
        <div className="row" style={{ marginTop: 8 }}>
          {!reducedMotion && (
            <button className="btn primary" onClick={() => setSweeping(true)} disabled={sweeping} data-testid="sweep">
              Sweep
            </button>
          )}
          <label className="row small" style={{ flex: 1 }}>
            Sweep position
            <input type="range" min={-1} max={1} step={0.05} value={pos} onChange={(e) => { setSweeping(false); setPos(Number(e.target.value)); }} aria-label="Streak sweep position" style={{ flex: 1 }} />
          </label>
        </div>
        <p className="small" aria-live="polite" data-testid="reflex-observation">
          <b>Observation:</b> {motionText} {qualityNote[quality]}
        </p>
      </div>
      <div className="stack">
        <label className="field">
          <span>Streak orientation: {fmtAxis(streak)}° (swept perpendicular → measures {fmtAxis(obs.measuredMeridianDeg)}° meridian)</span>
          <input type="range" min={1} max={180} value={streak} onChange={(e) => setStreak(Number(e.target.value))} aria-label="Streak orientation in degrees" />
        </label>
        <div className="row small">
          <button className="btn sm" onClick={() => setStreak(90)}>Vertical streak (measures 180°)</button>
          <button className="btn sm" onClick={() => setStreak(180)}>Horizontal streak (measures 90°)</button>
        </div>
        <div className="row small">
          <span className="muted">Working distance</span>
          <Seg label="Working distance" value={wd} onChange={setWd} options={WD_OPTIONS.map((o) => ({ value: o.value, label: o.label }))} />
        </div>
        <label className="row small">
          <input type="checkbox" checked={wdLens} onChange={(e) => setWdLens(e.target.checked)} /> Working-distance lens ({fmtD(1 / w)} D) in the trial frame
        </label>
        <div className="panel stack small" style={{ padding: 10 }}>
          <b>Trial lenses (excluding the working-distance lens)</b>
          <div className="row">
            <span style={{ width: 70 }}>Sphere</span>
            <button className="btn sm" onClick={() => bump(setSph, -1)}>−1.00</button>
            <button className="btn sm" onClick={() => bump(setSph, -0.25)}>−0.25</button>
            <b className="num" style={{ width: 60, textAlign: 'center' }}>{fmtD(sph)}</b>
            <button className="btn sm" onClick={() => bump(setSph, 0.25)}>+0.25</button>
            <button className="btn sm" onClick={() => bump(setSph, 1)}>+1.00</button>
          </div>
          <div className="row">
            <span style={{ width: 70 }}>Cylinder</span>
            <button className="btn sm" onClick={() => bump(setCyl, -0.25)}>−0.25</button>
            <b className="num" style={{ width: 60, textAlign: 'center' }}>{fmtD(cyl)}</b>
            <button className="btn sm" onClick={() => bump(setCyl, 0.25)}>+0.25</button>
            <span>axis</span>
            <input className="num" type="number" min={1} max={180} value={ax} onChange={(e) => setAx(normalizeAxis(Number(e.target.value) || 180))} style={{ width: 80 }} aria-label="Trial cylinder axis" />
          </div>
          <div className="muted">
            Trial: <span className="num">{formatRx(trial)}</span> · power in measured meridian {fmtD(trialInMeridian)} D
          </div>
          {onRecord && (
            <button className="btn" data-testid="record-neutral" onClick={() => onRecord({ meridianDeg: obs.measuredMeridianDeg, trialD: trialInMeridian, workingDistanceM: w, wdLensIncluded: wdLens })}>
              Record: this meridian looks neutral with these lenses
            </button>
          )}
        </div>
        {records.length > 0 && (
          <table className="data small">
            <thead>
              <tr>
                <th>Meridian</th>
                <th>Neutralising trial power</th>
                <th>WD</th>
                <th>WD lens in frame</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={i}>
                  <td className="num">{fmtAxis(r.meridianDeg)}°</td>
                  <td className="num">{fmtD(r.trialD)} D</td>
                  <td className="num">{r.workingDistanceM.toFixed(3)} m</td>
                  <td>{r.wdLensIncluded ? 'yes' : 'no'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <label className="row small">
          <input type="checkbox" checked={teaching} onChange={(e) => setTeaching(e.target.checked)} /> Teaching readout (reveals the remaining error — off for independent work)
        </label>
        {teaching && (
          <div className="feedback small">
            Gross neutral power in {fmtAxis(obs.measuredMeridianDeg)}° = R + 1/w = {fmtD(obs.grossNeutralD)} D. Lenses in front {fmtD(meridionalPower(frame, obs.measuredMeridianDeg))} D. Residual {fmtD(obs.residualD)} D → {obs.motion === 'with' ? 'add plus' : obs.motion === 'against' ? 'add minus' : 'neutral (±0.125 D teaching band)'}.
          </div>
        )}
        <p className="tiny muted">Model: plane-mirror static retinoscopy; residual G−T &gt; 0 → with motion (needs plus). Neutral band ±0.125 D is a teaching parameter, not clinical resolution. Source O3.</p>
      </div>
    </div>
  );
}
