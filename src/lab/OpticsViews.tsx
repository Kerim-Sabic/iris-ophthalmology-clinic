import { useRef, type KeyboardEvent, type PointerEvent } from 'react';
import { fmtAxis, fmtD, meridionalPower, normalizeAxis, orientation, principalMeridians, toMatrix, type SpheroCyl } from '../domain/optics';

/** The single math→screen transform (y up in math, y down in SVG). */
export function toScreen(cx: number, cy: number, r: number, angleDeg: number) {
  const t = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(t), y: cy - r * Math.sin(t) };
}

function powerColor(p: number, maxAbs: number) {
  const k = Math.max(-1, Math.min(1, p / (maxAbs || 1)));
  // minus → blue, plus → orange, zero → neutral grey; lightness also encodes magnitude
  if (Math.abs(k) < 1e-6) return 'hsl(40 6% 70%)';
  return k < 0 ? `hsl(208 70% ${78 - 40 * -k}%)` : `hsl(24 80% ${78 - 38 * k}%)`;
}

export interface CanvasProps {
  lens: SpheroCyl;
  probeDeg: number;
  onProbe?(deg: number): void;
  showValues: boolean;
  /** Meridians whose values were revealed even when showValues is false. */
  revealed?: number[];
  showAxisLabel?: boolean;
  proposal?: SpheroCyl | null;
  notation?: string;
  title: string;
  /** Hide the lens itself (e.g. hidden-target challenge). */
  hideLens?: boolean;
}

export function CylinderCanvas({ lens, probeDeg, onProbe, showValues, revealed = [], showAxisLabel = true, proposal, notation, title, hideLens }: CanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const W = 460;
  const cx = W / 2;
  const cy = 236;
  const R = 150;
  const q = toMatrix(lens);
  const pm = principalMeridians(q);
  const maxAbs = Math.max(1, Math.abs(pm.maxD), Math.abs(pm.minD));
  const probeP = meridionalPower(lens, probeDeg);

  const angleFromEvent = (e: PointerEvent) => {
    const svg = svgRef.current!;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const loc = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    const a = (Math.atan2(cy - loc.y, loc.x - cx) * 180) / Math.PI;
    return normalizeAxis(Math.round(a));
  };
  const onDown = (e: PointerEvent) => {
    if (!onProbe) return;
    dragging.current = true;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    onProbe(angleFromEvent(e));
  };
  const onMove = (e: PointerEvent) => {
    if (dragging.current && onProbe) onProbe(angleFromEvent(e));
  };
  const onUp = () => {
    dragging.current = false;
  };
  const onKey = (e: KeyboardEvent) => {
    if (!onProbe) return;
    const step = e.shiftKey ? 15 : 1;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') onProbe(normalizeAxis(probeDeg + step));
    else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') onProbe(normalizeAxis(probeDeg - step));
    else return;
    e.preventDefault();
  };

  const segs = [];
  if (!hideLens) {
    for (let a = 0; a < 360; a += 3) {
      const p = meridionalPower(lens, a + 1.5);
      const o1 = toScreen(cx, cy, R + 4, a);
      const o2 = toScreen(cx, cy, R + 4, a + 3);
      const i1 = toScreen(cx, cy, R - 14, a);
      const i2 = toScreen(cx, cy, R - 14, a + 3);
      segs.push(<path key={a} d={`M${i1.x},${i1.y} L${o1.x},${o1.y} A${R + 4},${R + 4} 0 0 0 ${o2.x},${o2.y} L${i2.x},${i2.y} A${R - 14},${R - 14} 0 0 1 ${i1.x},${i1.y}Z`} fill={powerColor(p, maxAbs)} />);
    }
  }
  const ticks = [];
  for (let a = 0; a < 360; a += 15) {
    const o = toScreen(cx, cy, R + 12, a);
    const i = toScreen(cx, cy, R + (a % 30 === 0 ? 22 : 17), a);
    ticks.push(<line key={'t' + a} x1={o.x} y1={o.y} x2={i.x} y2={i.y} stroke="var(--ink-3)" strokeWidth={1} />);
    if (a <= 180 && a % 30 === 0) {
      const l = toScreen(cx, cy, R + 34, a);
      ticks.push(
        <text key={'l' + a} x={l.x} y={l.y + 4} textAnchor="middle" fontSize="12" fill="var(--ink-2)" className="num">
          {a}°
        </text>,
      );
    }
  }
  const line = (deg: number, r: number) => {
    const a = toScreen(cx, cy, r, deg);
    const b = toScreen(cx, cy, r, deg + 180);
    return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
  };
  const handle = toScreen(cx, cy, R + 4, orientation(probeDeg) === 0 ? 0 : probeDeg);
  const valueMeridians = [0, 30, 45, 60, 90, 120, 135, 150];
  const valueLabels = hideLens
    ? []
    : valueMeridians
        .filter((m) => showValues || revealed.some((r) => orientation(r) === orientation(m)))
        .map((m) => {
          const pos = toScreen(cx, cy, R - 34, m === 0 ? 0 : m);
          return (
            <g key={'v' + m}>
              <rect x={pos.x - 26} y={pos.y - 11} width={52} height={20} rx={5} fill="var(--surface)" stroke="var(--line)" />
              <text x={pos.x} y={pos.y + 4} textAnchor="middle" fontSize="12" className="num" fill="var(--ink)">
                {fmtD(meridionalPower(lens, m))}
              </text>
            </g>
          );
        });
  const axisDeg = lens.axisDeg;
  const desc = hideLens
    ? `Hidden lens. Measurement meridian at ${fmtAxis(probeDeg)} degrees.`
    : `Lens ${notation ?? ''}. ${axisDeg ? `Cylinder axis ${fmtAxis(axisDeg)} degrees.` : 'Spherical: no axis.'} Measurement meridian ${fmtAxis(probeDeg)} degrees${showValues || revealed.includes(probeDeg) ? `, power ${fmtD(probeP)} dioptres` : ''}.`;
  return (
    <svg ref={svgRef} viewBox={`0 0 ${W} ${W + 20}`} role="img" aria-label={title} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onPointerLeave={onUp}>
      <title>{title}</title>
      <desc>{desc}</desc>
      <text x={12} y={20} fontSize="12" fill="var(--ink-3)">
        Front view · 0° to the right, angles counter-clockwise (both eyes)
      </text>
      {segs}
      <circle cx={cx} cy={cy} r={R - 14} fill="var(--surface)" stroke="var(--line)" />
      {ticks}
      {/* zero reference */}
      <line {...line(0, R + 10)} stroke="var(--ink-3)" strokeDasharray="2 4" />
      <text x={cx + R - 10} y={cy + 16} fontSize="10" fill="var(--ink-3)" textAnchor="end">
        0°/180° reference
      </text>
      {!hideLens && axisDeg !== null && (
        <g>
          <line {...line(axisDeg + 90, R - 16)} stroke="var(--target)" strokeWidth={1.5} strokeDasharray="6 4" opacity={0.7} />
          <line {...line(axisDeg, R - 16)} stroke="var(--axis)" strokeWidth={4} strokeLinecap="round" />
          {showAxisLabel && (
            <AxisLabel at={toScreen(cx, cy, 62, axisDeg + (axisDeg > 90 ? 16 : -16))} text={`AXIS ${fmtAxis(axisDeg)}°`} />
          )}
        </g>
      )}
      {proposal && proposal.axisDeg !== null && (
        <g>
          <line {...line(proposal.axisDeg, R - 20)} stroke="var(--proposal)" strokeWidth={2.5} strokeDasharray="10 6" />
          <AxisLabel at={toScreen(cx, cy, R - 90, proposal.axisDeg + 12)} text={`your axis ${fmtAxis(proposal.axisDeg)}°`} color="var(--proposal)" />
        </g>
      )}
      {valueLabels}
      {/* probe */}
      <line {...line(probeDeg, R + 4)} stroke="var(--probe)" strokeWidth={2} strokeDasharray="4 3" />
      <circle
        cx={handle.x}
        cy={handle.y}
        r={14}
        fill="var(--probe)"
        stroke="var(--surface)"
        strokeWidth={3}
        style={{ cursor: onProbe ? 'grab' : 'default' }}
        tabIndex={onProbe ? 0 : -1}
        role={onProbe ? 'slider' : undefined}
        aria-label="Measurement meridian"
        aria-valuemin={1}
        aria-valuemax={180}
        aria-valuenow={Math.round(normalizeAxis(probeDeg))}
        aria-valuetext={`${fmtAxis(probeDeg)} degrees`}
        onPointerDown={onDown}
        onKeyDown={onKey}
      />
      <text x={handle.x} y={handle.y + 4} textAnchor="middle" fontSize="10" fill="#fff" pointerEvents="none">
        θ
      </text>
      {notation && (
        <text x={cx} y={W + 12} textAnchor="middle" fontSize="16" className="num" fill="var(--ink)">
          {notation}
        </text>
      )}
      {hideLens && (
        <text x={cx} y={cy + 5} textAnchor="middle" fontSize="14" fill="var(--ink-3)">
          Lens hidden — reconstruct it from the data
        </text>
      )}
    </svg>
  );
}

function AxisLabel({ at, text, color }: { at: { x: number; y: number }; text: string; color?: string }) {
  const w = text.length * 7 + 12;
  return (
    <g>
      <rect x={at.x - w / 2} y={at.y - 11} width={w} height={20} rx={4} fill="var(--surface)" stroke={color ?? 'var(--axis)'} />
      <text x={at.x} y={at.y + 4} textAnchor="middle" fontSize="11" fontWeight={600} fill={color ?? 'var(--axis)'} className="num">
        {text}
      </text>
    </g>
  );
}

export function PowerLegend({ lens }: { lens: SpheroCyl }) {
  const pm = principalMeridians(toMatrix(lens));
  const maxAbs = Math.max(1, Math.abs(pm.maxD), Math.abs(pm.minD));
  const stops = [-maxAbs, -maxAbs / 2, 0, maxAbs / 2, maxAbs];
  return (
    <div className="legend" aria-label="Power colour scale">
      <span>Ring colour = meridional power:</span>
      {stops.map((s) => (
        <span key={s}>
          <i style={{ background: powerColor(s, maxAbs), height: 10, width: 14 }} />
          <span className="num">{fmtD(s)}</span>
        </span>
      ))}
    </div>
  );
}

export interface GraphProps {
  lens: SpheroCyl;
  probeDeg: number;
  onProbe?(deg: number): void;
  proposal?: SpheroCyl | null;
  showCurve: boolean;
  points?: { deg: number; label?: string; kind: 'revealed' | 'prediction' }[];
  /** Representation split: draw sphere component and cylinder component whose sum is the total. */
  split?: { sphereD: number } | null;
  title: string;
}

export function PowerGraph({ lens, probeDeg, onProbe, proposal, showCurve, points = [], split, title }: GraphProps) {
  const W = 460;
  const H = 230;
  const L = 52;
  const Rm = 14;
  const T = 14;
  const B = 40;
  const vals: number[] = [0];
  for (let a = 0; a <= 180; a += 5) {
    vals.push(meridionalPower(lens, a));
    if (proposal) vals.push(meridionalPower(proposal, a));
  }
  if (split) vals.push(split.sphereD, ...vals.map((v) => v - split.sphereD));
  for (const p of points) if (p.label && !Number.isNaN(Number(p.label))) vals.push(Number(p.label));
  let lo = Math.floor(Math.min(...vals)) - 0.5;
  let hi = Math.ceil(Math.max(...vals)) + 0.5;
  if (hi - lo < 2) {
    lo -= 1;
    hi += 1;
  }
  const x = (d: number) => L + ((W - L - Rm) * d) / 180;
  const y = (p: number) => T + ((H - T - B) * (hi - p)) / (hi - lo);
  const path = (f: (a: number) => number) => {
    let d = '';
    for (let a = 0; a <= 180; a += 2) d += `${a === 0 ? 'M' : 'L'}${x(a).toFixed(1)},${y(f(a)).toFixed(1)}`;
    return d;
  };
  const yt: number[] = [];
  const step = hi - lo > 8 ? 2 : 1;
  for (let v = Math.ceil(lo); v <= hi; v += step) yt.push(v);
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef(false);
  const pick = (e: PointerEvent) => {
    const svg = svgRef.current!;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const loc = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    const d = Math.round(((loc.x - L) / (W - L - Rm)) * 180);
    onProbe?.(normalizeAxis(Math.max(0, Math.min(180, d))));
  };
  const probeX = x(orientation(probeDeg) === 0 && probeDeg > 90 ? 180 : normalizeAxis(probeDeg));
  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={title}
      onPointerDown={(e) => {
        if (!onProbe) return;
        drag.current = true;
        (e.target as Element).setPointerCapture?.(e.pointerId);
        pick(e);
      }}
      onPointerMove={(e) => drag.current && pick(e)}
      onPointerUp={() => (drag.current = false)}
      onPointerCancel={() => (drag.current = false)}
    >
      <title>{title}</title>
      {yt.map((v) => (
        <g key={v}>
          <line x1={L} x2={W - Rm} y1={y(v)} y2={y(v)} stroke={v === 0 ? 'var(--ink-3)' : 'var(--line)'} strokeWidth={v === 0 ? 1.2 : 1} />
          <text x={L - 6} y={y(v) + 4} fontSize="11" textAnchor="end" className="num" fill="var(--ink-2)">
            {fmtD(v, { digits: v % 1 ? 2 : 0 })}
          </text>
        </g>
      ))}
      {[0, 30, 45, 60, 90, 120, 135, 150, 180].map((a) => (
        <g key={a}>
          <line x1={x(a)} x2={x(a)} y1={H - B} y2={H - B + 4} stroke="var(--ink-3)" />
          <text x={x(a)} y={H - B + 16} fontSize="10.5" textAnchor="middle" className="num" fill="var(--ink-2)">
            {a}
          </text>
        </g>
      ))}
      <text x={(L + W) / 2} y={H - 6} fontSize="11.5" textAnchor="middle" fill="var(--ink-2)">
        Meridian θ (degrees)
      </text>
      <text x={12} y={H / 2} fontSize="11.5" textAnchor="middle" fill="var(--ink-2)" transform={`rotate(-90 12 ${H / 2})`}>
        Power F(θ) (D)
      </text>
      {split && (
        <g>
          <path d={path(() => split.sphereD)} stroke="var(--observed)" strokeWidth={2} fill="none" strokeDasharray="2 3" />
          <path d={path((a) => meridionalPower(lens, a) - split.sphereD)} stroke="var(--probe)" strokeWidth={2} fill="none" strokeDasharray="7 4" />
        </g>
      )}
      {showCurve && <path d={path((a) => meridionalPower(lens, a))} stroke="var(--target)" strokeWidth={3} fill="none" />}
      {proposal && <path d={path((a) => meridionalPower(proposal, a))} stroke="var(--proposal)" strokeWidth={2.5} fill="none" strokeDasharray="8 5" />}
      {points.map((p, i) => {
        const v = Number(p.label);
        if (Number.isNaN(v)) return null;
        const px = x(normalizeAxis(p.deg) === 180 && p.deg === 0 ? 0 : normalizeAxis(p.deg));
        return p.kind === 'revealed' ? (
          <circle key={i} cx={px} cy={y(v)} r={5} fill="var(--target)" stroke="var(--surface)" strokeWidth={2} />
        ) : (
          <rect key={i} x={px - 5} y={y(v) - 5} width={10} height={10} fill="none" stroke="var(--proposal)" strokeWidth={2} transform={`rotate(45 ${px} ${y(v)})`} />
        );
      })}
      <line x1={probeX} x2={probeX} y1={T} y2={H - B} stroke="var(--probe)" strokeWidth={2} strokeDasharray="4 3" />
    </svg>
  );
}
