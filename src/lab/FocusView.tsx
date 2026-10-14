import { useState } from 'react';
import { blurEllipseAt, DEFAULT_EYE, eyeState, fmtAxis, fmtD, formatRx, makeLens, toPowerCross, type SpheroCyl } from '../domain/optics';
import { Seg } from '../ui/kit';

const OBJECTS: { value: string; label: string; m: number | 'infinity' }[] = [
  { value: 'inf', label: '∞', m: 'infinity' },
  { value: '2', label: '2 m', m: 2 },
  { value: '1', label: '1 m', m: 1 },
  { value: '0.4', label: '40 cm', m: 0.4 },
  { value: '0.33', label: '33 cm', m: 1 / 3 },
];

/**
 * Same-plane paraxial reduced eye (declared model): Qeye = Dret·I − Qtarget; Qeff = Qeye + Qtrial + (L + a)·I.
 * Depths are measured from the common lens/eye reference plane; this is not a measured axial length.
 */
export function FocusView({ target }: { target: SpheroCyl }) {
  const [trialMode, setTrialMode] = useState<'none' | 'full' | 'sphere-se'>('none');
  const [obj, setObj] = useState('inf');
  const [acc, setAcc] = useState(0);
  const [retinaShiftMm, setRetinaShiftMm] = useState(0);
  const eye = { nPrime: DEFAULT_EYE.nPrime, retinaDistanceM: DEFAULT_EYE.retinaDistanceM + retinaShiftMm / 1000 };
  // Target correction is defined for the default eye; moving the retina is an explicit hypothetical.
  const eyeTarget = target;
  const trial = trialMode === 'full' ? target : trialMode === 'sphere-se' ? makeLens(target.sphereD + target.cylinderD / 2) : makeLens(0);
  const s = eyeState(eyeTarget, trial, { objectDistanceM: OBJECTS.find((o) => o.value === obj)!.m, accommodationD: acc, eye: { ...DEFAULT_EYE } });
  const retinaM = eye.retinaDistanceM;
  const W = 520;
  const H = 230;
  const z0 = 40;
  const zMaxMm = 34;
  const zx = (m: number) => z0 + ((W - z0 - 20) * (m * 1000)) / zMaxMm;
  const clampX = (m: number | null) => (m === null ? null : Math.min(W - 12, Math.max(z0, zx(m))));
  const cy = 112;
  const pupil = 60;
  const r0mm = 2;
  const blur = blurEllipseAt(s, retinaM, r0mm, eye.nPrime);
  const pc = toPowerCross(target);
  const deeper = (i: number) => (s.lines[i].depthM ?? Infinity) >= (s.lines[1 - i].depthM ?? Infinity);
  const rel = (d: number | null) => (d === null ? 'not a real focus' : Math.abs(d - retinaM) < 1e-7 ? 'on the retina' : d < retinaM ? `${((retinaM - d) * 1000).toFixed(2)} mm in front of the retina` : `${((d - retinaM) * 1000).toFixed(2)} mm behind the retina`);
  return (
    <div className="stack">
      <div className="row small">
        <span className="muted">Trial lens:</span>
        <Seg label="Trial lens" value={trialMode} onChange={setTrialMode} options={[{ value: 'none', label: 'None' }, { value: 'full', label: 'Full correction' }, { value: 'sphere-se', label: 'SE sphere only' }]} />
      </div>
      <div className="row small">
        <span className="muted">Object:</span>
        <Seg label="Object distance" value={obj} onChange={setObj} options={OBJECTS.map((o) => ({ value: o.value, label: o.label }))} />
      </div>
      <label className="field">
        <span>Accommodation in this declared scenario: {acc.toFixed(2)} D</span>
        <input type="range" min={0} max={6} step={0.25} value={acc} onChange={(e) => setAcc(Number(e.target.value))} aria-label="Accommodation in dioptres" />
      </label>
      <label className="field">
        <span>Hypothetical retina shift: {retinaShiftMm.toFixed(1)} mm (model change, not anatomy)</span>
        <input type="range" min={-2} max={2} step={0.1} value={retinaShiftMm} onChange={(e) => setRetinaShiftMm(Number(e.target.value))} aria-label="Retina shift in millimetres" />
      </label>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Side view of the reduced eye with the two line foci and the retina">
        <title>Reduced-eye focus diagram</title>
        <desc>{`Line focus of the ${fmtAxis(s.lines[0].convergingMeridianDeg)} degree meridian ${rel(s.lines[0].depthM)}; line focus of the ${fmtAxis(s.lines[1].convergingMeridianDeg)} degree meridian ${rel(s.lines[1].depthM)}.`}</desc>
        <line x1={z0} x2={W - 10} y1={cy} y2={cy} stroke="var(--line)" />
        <text x={z0} y={18} fontSize="11" fill="var(--ink-3)">
          Optical-axis depth from the reference plane (mm) — not the cylinder-axis angle
        </text>
        {[0, 5, 10, 15, 20, 25, 30].map((mm) => (
          <g key={mm}>
            <line x1={zx(mm / 1000)} x2={zx(mm / 1000)} y1={cy + 70} y2={cy + 75} stroke="var(--ink-3)" />
            <text x={zx(mm / 1000)} y={cy + 88} fontSize="10" textAnchor="middle" className="num" fill="var(--ink-2)">
              {mm}
            </text>
          </g>
        ))}
        <rect x={z0 - 4} y={cy - pupil} width={8} height={pupil * 2} rx={3} fill="var(--target)" opacity={0.5} />
        <text x={z0 + 6} y={cy - pupil - 6} fontSize="10" fill="var(--ink-2)">
          lens + eye (same plane)
        </text>
        <line x1={zx(retinaM)} x2={zx(retinaM)} y1={cy - 80} y2={cy + 66} stroke="var(--observed)" strokeWidth={4} />
        <text x={zx(retinaM) + 4} y={cy - 70} fontSize="11" fill="var(--observed)">
          retina
        </text>
        {s.lines.map((l, i) => {
          const x = clampX(l.depthM);
          const col = i === 0 ? 'var(--proposal)' : 'var(--probe)';
          if (x === null)
            return (
              <text key={i} x={W - 14} y={cy - 40 + i * 16} fontSize="10" textAnchor="end" fill={col}>
                {fmtAxis(l.convergingMeridianDeg)}° meridian: {l.kind === 'infinity' ? 'focus at infinity' : 'virtual focus (diverging)'}
              </text>
            );
          return (
            <g key={i}>
              <line x1={z0} y1={cy - pupil * 0.9} x2={x} y2={cy} stroke={col} strokeWidth={1} opacity={0.6} />
              <line x1={z0} y1={cy + pupil * 0.9} x2={x} y2={cy} stroke={col} strokeWidth={1} opacity={0.6} />
              <line x1={x} x2={x} y1={cy - 18 - i * 22} y2={cy + 18 + i * 0} stroke={col} strokeWidth={3} />
              <text x={x + (deeper(i) ? 6 : -6)} y={cy - 24 - i * 22} fontSize="12" fill={col} textAnchor={deeper(i) ? 'start' : 'end'}>
                {fmtAxis(l.convergingMeridianDeg)}° rays → line at {fmtAxis(l.lineOrientationDeg)}°
              </text>
            </g>
          );
        })}
        {s.colcDepthM !== null && !s.spherical && clampX(s.colcDepthM) !== null && (
          <g>
            <circle cx={clampX(s.colcDepthM)!} cy={cy} r={5} fill="none" stroke="var(--ink-2)" strokeWidth={1.5} />
            <text x={clampX(s.colcDepthM)!} y={cy + 30} fontSize="10" textAnchor="middle" fill="var(--ink-2)">
              COLC
            </text>
          </g>
        )}
        <g transform={`translate(${W - 70}, ${cy + 40})`}>
          <ellipse cx={0} cy={0} rx={Math.min(32, blur[0].semiAxis * 60 + 0.8)} ry={Math.min(32, blur[1].semiAxis * 60 + 0.8)} transform={`rotate(${-blur[0].meridianDeg})`} fill="var(--ink-3)" opacity={0.35} stroke="var(--ink-2)" />
          <text x={0} y={-36} fontSize="9.5" textAnchor="middle" fill="var(--ink-3)">
            blur patch on retina
          </text>
        </g>
      </svg>
      <table className="data small">
        <thead>
          <tr>
            <th>Converging meridian</th>
            <th>Effective vergence</th>
            <th>Line focus orientation</th>
            <th>Position</th>
          </tr>
        </thead>
        <tbody>
          {s.lines.map((l, i) => (
            <tr key={i}>
              <td className="num">{fmtAxis(l.convergingMeridianDeg)}°</td>
              <td className="num">{fmtD(l.vergenceD)} D</td>
              <td className="num">{fmtAxis(l.lineOrientationDeg)}°</td>
              <td>{l.kind === 'real' ? `${(l.depthM! * 1000).toFixed(2)} mm — ${rel(l.depthM)}` : l.kind}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="small muted">
        Model: n′ = 4/3, reference retina at {(DEFAULT_EYE.retinaDistanceM * 1000).toFixed(2)} mm (60 D retinal vergence demand). Target correction {formatRx(target)} (principal {fmtD(pc.powerAD)} / {fmtD(pc.powerBD)} D). The circle of least confusion lies at the vergence midpoint z = 2n′/(λ₁+λ₂), not the arithmetic midpoint of the two foci. The blur patch is a geometric approximation for a 4 mm pupil; it does not predict Snellen acuity, adaptation, diffraction or what a person perceives.
        {retinaShiftMm !== 0 && ' The retina shift is a hypothetical model change: the patient’s target correction above is unchanged.'}
      </p>
    </div>
  );
}
