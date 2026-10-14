import { useEffect, useRef, useState } from 'react';
import { useApp } from '../app/context';
import { fmtD, formatRx, meridionalPower, transpose, type SpheroCyl } from '../domain/optics';
import { CylinderCanvas, PowerGraph } from './OpticsViews';

/**
 * Animates a change of REPRESENTATION: the split between "sphere component" and "cylinder component"
 * moves from the minus-cyl form to the plus-cyl form while the total power field is held fixed.
 * Every frame (paused, scrubbed or played) satisfies total(θ) = sphere(t) + cylinderPart(θ, t).
 */
export function TranspositionAnimator({ lens }: { lens: SpheroCyl }) {
  const { reducedMotion } = useApp();
  const other = transpose(lens);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const raf = useRef<number | null>(null);
  const last = useRef<number | null>(null);
  useEffect(() => {
    if (!playing) return;
    const tick = (ts: number) => {
      const dt = last.current === null ? 0 : (ts - last.current) / 1000;
      last.current = ts;
      setT((old) => {
        const n = Math.min(1, old + (dt * speed) / 3);
        if (n >= 1) setPlaying(false);
        return n;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      last.current = null;
    };
  }, [playing, speed]);
  if (lens.cylinderD === 0) return <p className="small muted">A sphere has only one description; there is nothing to transpose.</p>;
  const S = lens.sphereD + (other.sphereD - lens.sphereD) * t;
  const label = t === 0 ? formatRx(lens) : t === 1 ? formatRx(other) : `sphere component ${fmtD(S)} D + remaining cylinder part`;
  const probes = [0, 45, 90];
  return (
    <div className="stack" data-testid="transposition">
      <div className="grid cols-2">
        <div className="canvas-wrap">
          <CylinderCanvas lens={lens} probeDeg={90} showValues showAxisLabel={false} notation="Physical lens: unchanged" title="Physical power field during transposition" />
        </div>
        <div className="canvas-wrap">
          <PowerGraph lens={lens} probeDeg={90} showCurve split={{ sphereD: S }} title="Total power (solid) = sphere component (dotted) + cylinder component (dashed)" />
          <div className="legend">
            <span><i style={{ background: 'var(--target)' }} />total (fixed)</span>
            <span><i style={{ background: 'var(--observed)' }} />sphere component</span>
            <span><i style={{ background: 'var(--probe)' }} />cylinder component</span>
          </div>
          <p className="num" style={{ fontSize: '1.05rem', marginTop: 8 }} aria-live="polite">
            {label}
          </p>
          <table className="data small">
            <tbody>
              {probes.map((p) => (
                <tr key={p}>
                  <td className="num">{p || 180}°</td>
                  <td className="num">total {fmtD(meridionalPower(lens, p))}</td>
                  <td className="num">= sphere {fmtD(S)} + cyl part ({fmtD(meridionalPower(lens, p) - S)})</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="row">
        {!reducedMotion && (
          <button className="btn" onClick={() => (t >= 1 ? (setT(0), setPlaying(true)) : setPlaying(!playing))}>
            {playing ? 'Pause' : t >= 1 ? 'Replay' : 'Play'}
          </button>
        )}
        <button className="btn sm" onClick={() => { setPlaying(false); setT(Math.max(0, Math.round((t - 0.25) * 4) / 4)); }}>
          ◀ Step
        </button>
        <button className="btn sm" onClick={() => { setPlaying(false); setT(Math.min(1, Math.round((t + 0.25) * 4) / 4)); }}>
          Step ▶
        </button>
        <button className="btn sm" onClick={() => { setPlaying(false); setT(0); }}>
          Reset
        </button>
        <label className="row small">
          Scrub
          <input type="range" min={0} max={1} step={0.01} value={t} onChange={(e) => { setPlaying(false); setT(Number(e.target.value)); }} aria-label="Representation scrubber" style={{ width: 160 }} />
        </label>
        {!reducedMotion && (
          <label className="row small">
            Speed
            <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))} style={{ width: 80 }}>
              <option value={0.5}>0.5×</option>
              <option value={1}>1×</option>
              <option value={2}>2×</option>
            </select>
          </label>
        )}
      </div>
      <p className="small muted">
        Only the bookkeeping changes: how much of the total is called “sphere”. The solid curve and the lens on the left never move. {reducedMotion && 'Reduced motion is on: use the steps or the scrubber.'}
      </p>
    </div>
  );
}
