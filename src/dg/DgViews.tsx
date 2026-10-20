import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useApp } from '../app/context';
import {
  CLASS_ENGLISH, CLASS_LATIN, CLASS_RULE, ORIENT_ENGLISH, decimalToSnellen6, derivationSteps, diagnoseEye, explainToken,
  type Eye, type EyeAnswer, type Orientation, type Token, type TokenKind, type VisusLine,
} from '../domain/diagnosis';
import { fmtAxis, fmtD, normalizeAxis, toPowerCross, type RefractiveClass, type SpheroCyl } from '../domain/optics';

const GROUP: Record<TokenKind, string> = {
  eye: 'eye', colon: 'punct', comma: 'punct', sc: 'sc', 'va-sc': 'sc', cc: 'lens', 'sph-power': 'lens', dsph: 'lens', 'cyl-power': 'cyl', dcyl: 'cyl', ax: 'cyl', 'axis-value': 'cyl', 'va-cc': 'bcva', dg: 'dg', add: 'near', 'add-power': 'near', near: 'near', 'near-va': 'near', age: 'age', 'age-value': 'age', unknown: 'unknown',
};

export const TOKEN_LEGEND: { group: string; label: string }[] = [
  { group: 'eye', label: 'which eye' },
  { group: 'sc', label: 'vision without glasses' },
  { group: 'lens', label: 'the lens (sphere)' },
  { group: 'cyl', label: 'cylinder + axis' },
  { group: 'bcva', label: 'vision with the lens' },
  { group: 'near', label: 'near / reading (ADD)' },
  { group: 'age', label: 'age (context)' },
  { group: 'dg', label: 'what you write' },
];

/** A visus line where every part is a button that explains itself. */
export function AnnotatedLine({ line, selected, onSelect, highlight = [], disabled, big }: { line: VisusLine; selected?: number | null; onSelect?(i: number | null): void; highlight?: TokenKind[]; disabled?: boolean; big?: boolean }) {
  const parts: ReactNode[] = [];
  let pos = 0;
  line.tokens.forEach((t, i) => {
    if (t.start > pos) parts.push(<span key={'g' + i}>{line.raw.slice(pos, t.start)}</span>);
    const g = GROUP[t.kind];
    const hl = highlight.includes(t.kind);
    if (g === 'punct') parts.push(<span key={i}>{t.text}</span>);
    else
      parts.push(
        <button
          key={i}
          type="button"
          className={`tok tok-${g}${selected === i ? ' sel' : ''}${hl ? ' hl' : ''}`}
          disabled={disabled}
          aria-pressed={selected === i}
          aria-label={`${t.text}: explain`}
          onClick={() => onSelect?.(i)}
        >
          {t.text}
        </button>,
      );
    pos = t.end;
  });
  if (pos < line.raw.length) parts.push(<span key="end">{line.raw.slice(pos)}</span>);
  return <div className={`vline num${big ? ' big' : ''}`}>{parts}</div>;
}

export function TokenLegend() {
  return (
    <div className="legend" aria-label="Colour key (each part is also a button you can click)">
      {TOKEN_LEGEND.map((l) => (
        <span key={l.group} className="row" style={{ gap: 4 }}>
          <span className={`tok tok-${l.group}`} style={{ padding: '0 6px', cursor: 'default' }}>
            Aa
          </span>
          {l.label}
        </span>
      ))}
    </div>
  );
}

export function TokenExplain({ line, index }: { line: VisusLine; index: number | null }) {
  if (index === null || !line.tokens[index]) return <p className="small muted">Click any coloured part of the line to see what it means.</p>;
  const t: Token = line.tokens[index];
  const e = explainToken(t, line);
  return (
    <div className={`explain tok-border-${GROUP[t.kind]}`} role="status" aria-live="polite" key={index}>
      <b>{e.title}</b>
      {e.body.map((b, i) => (
        <p key={i} style={{ margin: '4px 0 0' }}>
          {b}
        </p>
      ))}
    </div>
  );
}

// ------------------------------------------------------------------ pictures

const sign = (p: number) => (Math.abs(p) < 1e-9 ? 0 : p > 0 ? 1 : -1);
const needs = (p: number) => (sign(p) === 0 ? 'needs nothing' : sign(p) < 0 ? 'needs minus' : 'needs plus');

/** Power cross drawn from the lens; lines draw themselves in when the lens changes. */
export function PowerCross({ lens, size = 260 }: { lens: SpheroCyl; size?: number }) {
  const pc = toPowerCross(lens);
  const c = size / 2;
  const R = size * 0.36;
  const rows = [
    { p: pc.powerAD, m: pc.meridianADeg },
    { p: pc.powerBD, m: pc.meridianBDeg },
  ];
  const key = `${lens.sphereD}|${lens.cylinderD}|${lens.axisDeg}`;
  return (
    <svg viewBox={`-48 -26 ${size + 96} ${size + 52}`} role="img" aria-label={`Power cross: ${rows.map((r) => `${fmtD(r.p)} dioptres at ${fmtAxis(r.m)} degrees`).join(', ')}`} className="pcross" key={key}>
      <circle cx={c} cy={c} r={R + 8} fill="none" stroke="var(--line)" />
      <line x1={c - R - 14} y1={c} x2={c + R + 14} y2={c} stroke="var(--line)" strokeDasharray="2 4" />
      <text x={c + R + 10} y={c + 14} fontSize="10" fill="var(--ink-3)" textAnchor="end">
        0°/180°
      </text>
      {rows.map((r, i) => {
        const a = (normalizeAxis(r.m) * Math.PI) / 180;
        const dx = Math.cos(a) * R;
        const dy = -Math.sin(a) * R;
        const col = sign(r.p) < 0 ? 'var(--target)' : sign(r.p) > 0 ? 'var(--proposal)' : 'var(--ink-3)';
        const lx = c + dx * 1.18;
        const ly = c + dy * 1.18;
        return (
          <g key={i} className="draw-in" style={{ animationDelay: `${i * 0.35}s` }}>
            <line x1={c - dx} y1={c - dy} x2={c + dx} y2={c + dy} stroke={col} strokeWidth={i === 0 ? 5 : 3} strokeLinecap="round" strokeDasharray={i === 0 ? undefined : '10 5'} pathLength={100} className="stroke-draw" />
            <g className="pop-in" style={{ animationDelay: `${0.4 + i * 0.35}s` }}>
              <rect x={lx - 38} y={ly - 21} width={76} height={36} rx={7} fill="var(--surface)" stroke={col} strokeWidth={1.5} />
              <text x={lx} y={ly - 5} textAnchor="middle" fontSize="13" fontWeight={700} fill={col} className="num">
                {fmtD(r.p)}
              </text>
              <text x={lx} y={ly + 9} textAnchor="middle" fontSize="9.5" fill="var(--ink-2)">
                at {fmtAxis(r.m)}° · {needs(r.p)}
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}

const RULES: { cls: RefractiveClass; a: number; b: number; eq?: boolean }[] = [
  { cls: 'emmetropic', a: 0, b: 0 },
  { cls: 'spherical-myopia', a: -1, b: -1, eq: true },
  { cls: 'spherical-hyperopia', a: 1, b: 1, eq: true },
  { cls: 'simple-myopic-astigmatism', a: 0, b: -1 },
  { cls: 'compound-myopic-astigmatism', a: -1, b: -1 },
  { cls: 'simple-hyperopic-astigmatism', a: 0, b: 1 },
  { cls: 'compound-hyperopic-astigmatism', a: 1, b: 1 },
  { cls: 'mixed-astigmatism', a: 1, b: -1 },
];
const chip = (s: number, eq?: boolean) => <span className={`sgn sgn-${s}`}>{s === 0 ? '0' : s < 0 ? '−' : '+'}{eq ? '' : ''}</span>;

/** The one rule: the signs of the two principal corrections decide the name. */
export function ClassRuleTable({ active, onPick }: { active?: RefractiveClass | null; onPick?(c: RefractiveClass): void }) {
  return (
    <table className="data rule-table">
      <thead>
        <tr>
          <th>Meridian 1</th>
          <th>Meridian 2</th>
          <th>Write (Latin)</th>
          <th className="hide-narrow">English</th>
        </tr>
      </thead>
      <tbody>
        {RULES.map((r) => (
          <tr key={r.cls} className={active === r.cls ? 'on' : ''} onClick={() => onPick?.(r.cls)} style={{ cursor: onPick ? 'pointer' : undefined }} aria-current={active === r.cls ? 'true' : undefined}>
            <td>{chip(r.a)}</td>
            <td>
              {chip(r.b)} {r.cls.includes('astig') && (r.a === r.b ? <span className="tiny muted">different amount</span> : null)}
              {r.eq && <span className="tiny muted">same amount</span>}
            </td>
            <td>
              <b>{CLASS_LATIN[r.cls]}</b>
            </td>
            <td className="small hide-narrow">{CLASS_ENGLISH[r.cls]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Minus-cylinder axis on a half dial with the rectus / inversus / obliquus zones. */
export function OrientationDial({ minusAxisDeg, orientation }: { minusAxisDeg: number; orientation: Orientation }) {
  const W = 260;
  const cx = W / 2;
  const cy = 130;
  const R = 105;
  const pt = (deg: number, r = R) => ({ x: cx + r * Math.cos((deg * Math.PI) / 180), y: cy - r * Math.sin((deg * Math.PI) / 180) });
  const arc = (a1: number, a2: number) => {
    const p1 = pt(a1);
    const p2 = pt(a2);
    return `M${cx},${cy} L${p1.x},${p1.y} A${R},${R} 0 0 0 ${p2.x},${p2.y} Z`;
  };
  const a = normalizeAxis(minusAxisDeg);
  const needle = pt(a === 180 ? 180 : a, R - 6);
  return (
    <svg viewBox={`0 0 ${W} 160`} role="img" aria-label={`Minus-cylinder axis ${fmtAxis(a)} degrees: ${orientation}`}>
      <path d={arc(0, 30)} fill="var(--good-soft)" stroke="var(--good)" />
      <path d={arc(150, 180)} fill="var(--good-soft)" stroke="var(--good)" />
      <path d={arc(60, 120)} fill="var(--warn-soft)" stroke="var(--warn)" />
      <path d={arc(30, 60)} fill="var(--surface-2)" stroke="var(--line)" />
      <path d={arc(120, 150)} fill="var(--surface-2)" stroke="var(--line)" />
      <text x={cx + R - 22} y={cy - 8} fontSize="10" fill="var(--good)">rectus</text>
      <text x={cx - R + 4} y={cy - 8} fontSize="10" fill="var(--good)">rectus</text>
      <text x={cx} y={cy - R + 22} fontSize="10" textAnchor="middle" fill="var(--warn)">inversus</text>
      <text x={cx + 52} y={cy - 70} fontSize="9" fill="var(--ink-3)">obliquus</text>
      <text x={cx - 52} y={cy - 70} fontSize="9" textAnchor="end" fill="var(--ink-3)">obliquus</text>
      {[0, 30, 60, 90, 120, 150, 180].map((d) => {
        const p = pt(d, R + 12);
        return (
          <text key={d} x={p.x} y={p.y + 3} fontSize="9" textAnchor="middle" fill="var(--ink-2)" className="num">
            {d}
          </text>
        );
      })}
      <line x1={cx} y1={cy} x2={needle.x} y2={needle.y} stroke="var(--ink)" strokeWidth={3.5} strokeLinecap="round" className="needle" />
      <circle cx={cx} cy={cy} r={5} fill="var(--ink)" />
      <text x={cx} y={cy + 22} textAnchor="middle" fontSize="11" fontWeight={700} fill="var(--ink)">
        minus-cyl axis {fmtAxis(a)}° → {orientation}
      </text>
    </svg>
  );
}

function AcuityBar({ value, label }: { value: number; label: string }) {
  const pct = Math.min(100, value * 100);
  return (
    <div className="stack small">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span>{label}</span>
        <b className="num">
          {value} {decimalToSnellen6(value)}
        </b>
      </div>
      <div className="bar" style={{ height: 14 }}>
        <div className="grow-x" style={{ width: `${pct}%`, background: value >= 1 ? 'var(--good)' : 'var(--warn)' }} />
      </div>
      <div className="row tiny muted" style={{ justifyContent: 'space-between' }}>
        <span>0</span>
        <span>1.0 = normal</span>
      </div>
    </div>
  );
}

function Typewriter({ text }: { text: string }) {
  const { reducedMotion } = useApp();
  const [n, setN] = useState(reducedMotion ? text.length : 0);
  useEffect(() => {
    if (reducedMotion) {
      setN(text.length);
      return;
    }
    setN(0);
    const t = setInterval(() => setN((x) => (x >= text.length ? (clearInterval(t), x) : x + 1)), 28);
    return () => clearInterval(t);
  }, [text, reducedMotion]);
  return (
    <p className="dg-sentence num" aria-label={text}>
      {text.slice(0, n)}
      {n < text.length && <span className="caret">▍</span>}
    </p>
  );
}

/** Step-by-step animated solution for one eye. Every frame is computed from the parsed line. */
export function DerivationPlayer({ line, startAt = 0 }: { line: VisusLine; startAt?: number }) {
  const { reducedMotion } = useApp();
  const steps = useMemo(() => derivationSteps(line), [line]);
  const d = useMemo(() => diagnoseEye(line), [line]);
  const [iRaw, setI] = useState(Math.min(startAt, steps.length - 1));
  const [playing, setPlaying] = useState(false);
  // a new line can have fewer steps than the previous one: clamp, and restart when the line changes
  const i = Math.min(iRaw, steps.length - 1);
  useEffect(() => {
    setI(Math.min(startAt, steps.length - 1));
    setPlaying(false);
  }, [line.raw, startAt, steps.length]);
  useEffect(() => {
    if (!playing) return;
    if (i >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setI((x) => x + 1), 2600);
    return () => clearTimeout(t);
  }, [playing, i, steps.length]);
  const s = steps[i];
  let visual: ReactNode = null;
  if (s.id === 'sc' && line.sc !== null) visual = <AcuityBar value={line.sc} label="Without glasses (sc)" />;
  if (s.id === 'lens' && line.cc) visual = <PowerCross lens={line.cc.lens} />;
  if (s.id === 'cross' && line.cc) visual = <PowerCross lens={line.cc.lens} />;
  if (s.id === 'classify' && d.outcome.kind === 'refractive') visual = <ClassRuleTable active={d.outcome.cls} />;
  if (s.id === 'orient' && d.outcome.kind === 'refractive' && d.outcome.orientation) visual = <OrientationDial minusAxisDeg={d.outcome.minusForm.axisDeg!} orientation={d.outcome.orientation} />;
  if (s.id === 'cc-va' && line.cc?.va) visual = <AcuityBar value={line.cc.va} label="With the lens (cc)" />;
  if (s.id === 'dg') visual = <Typewriter text={s.text} />;
  return (
    <div className="derivation" data-testid="derivation">
      <AnnotatedLine line={line} highlight={s.highlight} disabled />
      <ol className="dsteps" aria-label="Solution steps">
        {steps.map((x, k) => (
          <li key={x.id}>
            <button type="button" className={k === i ? 'on' : k < i ? 'done' : ''} onClick={() => { setPlaying(false); setI(k); }} aria-current={k === i ? 'step' : undefined}>
              <span className="num-badge">{k < i ? '✓' : k + 1}</span> {x.title}
            </button>
          </li>
        ))}
      </ol>
      <div className="dstage" key={s.id}>
        <div className="fade-up">
          <h4 style={{ margin: '0 0 4px' }}>
            Step {i + 1}: {s.title}
          </h4>
          {s.id !== 'dg' && <p style={{ margin: 0 }}>{s.text}</p>}
        </div>
        <div className="dvisual fade-up" style={{ animationDelay: '.15s' }}>
          {visual}
        </div>
      </div>
      {d.notes.length > 0 && i === steps.length - 1 && (
        <ul className="small" style={{ margin: 0 }}>
          {d.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      )}
      <div className="row">
        <button className="btn sm" onClick={() => { setPlaying(false); setI(Math.max(0, i - 1)); }} disabled={i === 0}>
          ◀ Back
        </button>
        <button className="btn sm primary" onClick={() => { setPlaying(false); setI(Math.min(steps.length - 1, i + 1)); }} disabled={i === steps.length - 1} data-testid="dstep-next">
          Next step ▶
        </button>
        {!reducedMotion && (
          <button className="btn sm" onClick={() => { if (i >= steps.length - 1) setI(0); setPlaying(!playing); }}>
            {playing ? 'Pause' : i >= steps.length - 1 ? 'Replay' : 'Play all'}
          </button>
        )}
        <span className="tiny muted">
          {i + 1}/{steps.length}
        </span>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ answer composer

const CATS: { value: EyeAnswer['cls']; label: string; short: string }[] = [
  { value: 'emmetropic', label: 'Emmetropia', short: 'Emmetropia' },
  { value: 'spherical-myopia', label: 'Myopia', short: 'Myopia' },
  { value: 'spherical-hyperopia', label: 'Hypermetropia', short: 'Hypermetropia' },
  { value: 'simple-myopic-astigmatism', label: 'Astigmatismus myopicus simplex', short: 'Astig. myop. simplex' },
  { value: 'compound-myopic-astigmatism', label: 'Astigmatismus myopicus compositus', short: 'Astig. myop. compositus' },
  { value: 'simple-hyperopic-astigmatism', label: 'Astigmatismus hypermetropicus simplex', short: 'Astig. hyperm. simplex' },
  { value: 'compound-hyperopic-astigmatism', label: 'Astigmatismus hypermetropicus compositus', short: 'Astig. hyperm. compositus' },
  { value: 'mixed-astigmatism', label: 'Astigmatismus mixtus', short: 'Astig. mixtus' },
  { value: 'cannot', label: 'Cannot be stated (refraction needed)', short: 'Cannot be stated' },
];

export const emptyEyeAnswer = (): EyeAnswer => ({ cls: '', orientation: '', flagBcva: false });

export function composeSentence(eyes: Partial<Record<Eye, EyeAnswer>>, aniso: boolean, presbyopia = false): string {
  const part = (e: Eye) => {
    const a = eyes[e];
    if (!a || !a.cls) return null;
    if (a.cls === 'cannot') return `cannot be stated ${e}`;
    return `${CLASS_LATIN[a.cls as RefractiveClass]}${a.orientation ? ' ' + a.orientation : ''} ${e}${a.flagBcva ? ' (reduced best-corrected acuity, further examination)' : ''}`;
  };
  const p = (['OD', 'OS'] as Eye[]).map(part).filter(Boolean);
  if (!p.length) return 'Dg: …';
  return `Dg: ${p.join('; ')}${aniso ? '; Anisometropia' : ''}${presbyopia ? '; Presbyopia' : ''}`;
}

export function EyeComposer({ eye, value, onChange, disabled }: { eye: Eye; value: EyeAnswer; onChange(v: EyeAnswer): void; disabled?: boolean }) {
  const astig = value.cls.includes('astig');
  return (
    <fieldset className="composer" disabled={disabled}>
      <legend>
        {eye === 'OD' ? 'OD · right eye' : 'OS · left eye'}
      </legend>
      <div className="cat-grid" role="radiogroup" aria-label={`${eye} diagnosis`}>
        {CATS.map((c) => (
          <button key={c.value} type="button" role="radio" aria-checked={value.cls === c.value} className={`cat ${value.cls === c.value ? 'on' : ''}`} onClick={() => onChange({ ...value, cls: c.value, orientation: c.value.includes('astig') ? value.orientation : '' })} title={c.label}>
            {c.short}
          </button>
        ))}
      </div>
      {astig && (
        <div className="row small" style={{ marginTop: 6 }}>
          <span className="muted">Direction (optional):</span>
          {(['', 'rectus', 'inversus', 'obliquus'] as const).map((o) => (
            <button key={o || 'none'} type="button" className={`btn sm ${value.orientation === o ? 'primary' : ''}`} aria-pressed={value.orientation === o} onClick={() => onChange({ ...value, orientation: o })}>
              {o || 'not stated'}
            </button>
          ))}
        </div>
      )}
      <label className="row small" style={{ marginTop: 6 }}>
        <input type="checkbox" checked={value.flagBcva} onChange={(e) => onChange({ ...value, flagBcva: e.target.checked })} /> Vision is still below 1.0 with the lens (note it, further examination)
      </label>
    </fieldset>
  );
}

/** Distance lens + ADD = reading lens, drawn as an animated sum for each eye. */
export function NearPanel({ addD, rows, ageY }: { addD: number; rows: { eye: Eye; distance: SpheroCyl | null; near: SpheroCyl }[]; ageY: number | null }) {
  return (
    <div className="near-panel" data-testid="near-panel">
      <div className="small">
        <b>Presbyopia — reading glasses</b>
        {ageY !== null && <span className="muted"> · age {ageY} (context only)</span>}
      </div>
      {rows.map((r, k) => (
        <div key={r.eye} className="near-row fade-up" style={{ animationDelay: `${k * 0.25}s` }}>
          <b>{r.eye}</b>
          <span className="num chip-lens">{r.distance ? fmtRx(r.distance) : 'plano'}</span>
          <span className="op">+</span>
          <span className="num chip-add">ADD {fmtD(addD)}</span>
          <span className="op">=</span>
          <span className="num chip-near">{fmtRx(r.near)}</span>
        </div>
      ))}
      <p className="tiny muted" style={{ margin: 0 }}>The ADD is spherical and plus; cylinder and axis do not change. It comes from a near test, not from the age.</p>
    </div>
  );
}

function fmtRx(l: SpheroCyl) {
  return l.cylinderD === 0 ? `${fmtD(l.sphereD, { plano: true })} dsph` : `${fmtD(l.sphereD, { plano: true })} dsph ${fmtD(l.cylinderD)} dcyl ax ${fmtAxis(l.axisDeg)}`;
}

export { ORIENT_ENGLISH, CLASS_RULE };
