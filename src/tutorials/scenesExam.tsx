/**
 * Tutorial scenes for the prescription desk, visual acuity and note writing.
 * Pictures are computed from the optics and acuity models used by LAB03/LAB04.
 */
import type { ReactNode } from 'react';
import { CHART_LINES, chartObservation, expectedSnellen, formatSnellen, type EyeTruth } from '../domain/acuity';
import { fmtAxis, fmtD, formatRx, makeLens, toPowerCross, transpose, type SpheroCyl } from '../domain/optics';
import { CylinderCanvas } from '../lab/OpticsViews';
import type { SceneFn } from './Player';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const Big = ({ children }: { children: ReactNode }) => <div className="tutorial-big num">{children}</div>;

// ---------------------------------------------------------------- prescription desk
const OD_RX = makeLens(-1.5, -0.75, 180);
const OS_RX = makeLens(-2.25, 0, null);

function RxForm({ fill, highlight, plusOD }: { fill: number; highlight?: 'OD' | 'OS'; plusOD?: boolean }) {
  const rows: { eye: 'OD' | 'OS'; name: string; rx: SpheroCyl }[] = [
    { eye: 'OD', name: 'Right eye', rx: plusOD ? transpose(OD_RX) : OD_RX },
    { eye: 'OS', name: 'Left eye', rx: OS_RX },
  ];
  const cell = (rx: SpheroCyl, k: number, row: number) => {
    if (fill * 6 <= row * 3 + k) return '';
    if (k === 0) return fmtD(rx.sphereD, { plano: true });
    if (k === 1) return rx.cylinderD ? fmtD(rx.cylinderD) : '—';
    return rx.axisDeg ? fmtAxis(rx.axisDeg) : '—';
  };
  return (
    <table className="data tutorial-rx num" aria-label="Prescription form">
      <thead>
        <tr>
          <th>Eye</th>
          <th>SPH</th>
          <th>CYL</th>
          <th>AXIS</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={r.eye} style={{ background: highlight === r.eye ? 'var(--accent-soft)' : undefined }}>
            <td>
              <b>{r.eye}</b> <span className="small muted">{r.name}</span>
            </td>
            {[0, 1, 2].map((k) => (
              <td key={k}>{cell(r.rx, k, i)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Lensometer({ power, lens }: { power: number; lens: SpheroCyl }) {
  const pc = toPowerCross(lens);
  const sets = [
    { p: pc.powerAD, m: pc.meridianADeg },
    { p: pc.powerBD, m: pc.meridianBDeg },
  ];
  return (
    <svg viewBox="0 0 240 240" role="img" aria-label={`Lensometer target at power ${fmtD(power)} D`}>
      <rect width={240} height={240} rx={12} fill="#0f1a14" />
      <circle cx={120} cy={120} r={100} fill="none" stroke="#2b4a3a" />
      {sets.map((st, i) => {
        const blur = Math.min(8, Math.abs(power - st.p) * 4);
        // line images run perpendicular to the meridian that focuses them
        const a = (-(st.m + 90) * Math.PI) / 180;
        const d = { x: Math.cos(a), y: Math.sin(a) };
        const n = { x: -d.y, y: d.x };
        return [-3, -2, -1, 0, 1, 2, 3].map((k) => (
          <line key={`${i}${k}`} x1={120 + n.x * k * 13 - d.x * 80} y1={120 + n.y * k * 13 - d.y * 80} x2={120 + n.x * k * 13 + d.x * 80} y2={120 + n.y * k * 13 + d.y * 80} stroke={i ? '#c8f2d6' : '#9fe3b8'} strokeWidth={1.5 + blur} opacity={Math.max(0.12, 1 - blur / 9)} />
        ));
      })}
      <text x={10} y={232} fill="#9fe3b8" fontSize="12">
        power wheel {fmtD(power)} D
      </text>
    </svg>
  );
}

const rxdesk: SceneFn = (step, t) => {
  if (step === 'form')
    return (
      <div className="tutorial-center">
        <RxForm fill={t} />
        <Big>One row per eye: SPH · CYL · AXIS</Big>
      </div>
    );
  if (step === 'separate')
    return (
      <div className="tutorial-center">
        <RxForm fill={1} highlight={t < 0.5 ? 'OD' : 'OS'} />
        <Big>{t < 0.5 ? 'Right eye: its own numbers' : 'Left eye: different numbers'}</Big>
      </div>
    );
  if (step === 'cross') {
    const pc = toPowerCross(OD_RX);
    return (
      <div className="tutorial-grid">
        <CylinderCanvas lens={OD_RX} probeDeg={t < 0.5 ? 180 : 90} showValues={false} revealed={[180, 90]} notation={t > 0.75 ? formatRx(OD_RX) : 'right eye'} title="Power cross of the right eye" />
        <div>
          <Big>
            {fmtD(pc.powerAD)} at {fmtAxis(pc.meridianADeg)}° · {fmtD(pc.powerBD)} at {fmtAxis(pc.meridianBDeg)}°
          </Big>
          <p className="small">
            Axis = the direction with the sphere power ({fmtAxis(pc.meridianADeg)}°). Cylinder = {fmtD(pc.powerBD)} − ({fmtD(pc.powerAD)}) = {fmtD(pc.powerBD - pc.powerAD)}.
          </p>
        </div>
      </div>
    );
  }
  if (step === 'notation')
    return (
      <div className="tutorial-center">
        <RxForm fill={1} highlight="OD" plusOD={t > 0.5} />
        <Big>{t > 0.5 ? 'Same lens in plus cylinder — but minus was asked' : 'Asked for minus cylinder: write it this way'}</Big>
      </div>
    );
  const pc = toPowerCross(OD_RX);
  // Turn the wheel, pause on the first sharp setting, then on the second (ends sharp when paused).
  const [p1, p2] = [pc.powerAD, pc.powerBD];
  const power = t < 0.35 ? lerp(p1 + 2, p1, t / 0.35) : t < 0.55 ? p1 : t < 0.85 ? lerp(p1, p2, (t - 0.55) / 0.3) : p2;
  const sharp = [pc.powerAD, pc.powerBD].find((p) => Math.abs(power - p) < 0.2);
  return (
    <div className="tutorial-grid">
      <Lensometer power={power} lens={OD_RX} />
      <div>
        <Big>{sharp !== undefined ? `One set of lines sharp at ${fmtD(sharp)}` : 'Turning the power wheel…'}</Big>
        <p className="small">Two sharp settings = the two main powers of these glasses ({formatRx(OD_RX)}). It describes the glasses only.</p>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- visual acuity
function ChartRoom({ distance, truth, covered, pinhole }: { distance: number; truth: EyeTruth; covered: 'OD' | 'OS' | null; pinhole?: boolean }) {
  const o = chartObservation(truth, distance);
  const s = expectedSnellen(o);
  const px = 60 + ((6 - distance) / 6) * 300;
  return (
    <svg viewBox="0 0 520 230" role="img" aria-label={`Patient at ${distance} metres${covered ? `, ${covered} covered` : ''}. ${s ? `Acuity ${formatSnellen(s)}` : 'Cannot read the top line'}`}>
      <rect x={430} y={20} width={70} height={190} rx={6} fill="var(--surface)" stroke="var(--line)" />
      {CHART_LINES.map((ln, i) => {
        const read = o.kind === 'line' && ln >= o.line;
        return (
          <g key={ln}>
            <rect x={442} y={30 + i * 22} width={Math.max(8, ln * 0.7)} height={Math.max(4, ln / 6)} rx={1} fill={read ? 'var(--ink)' : 'var(--line)'} />
            <text x={496} y={38 + i * 22} fontSize="9" textAnchor="end" fill="var(--ink-3)">
              {ln}
            </text>
          </g>
        );
      })}
      <circle cx={px} cy={95} r={22} fill="#e9d6c2" stroke="var(--ink-3)" />
      <rect x={px - 26} y={118} width={52} height={70} rx={14} fill="#8fa7b9" />
      {covered && (
        <text x={px} y={58} fontSize="12" textAnchor="middle" fill="var(--ink)">
          {covered === 'OD' ? 'right eye covered' : 'left eye covered'}
        </text>
      )}
      {pinhole && (
        <text x={px} y={42} fontSize="12" textAnchor="middle" fill="var(--accent)">
          + pinhole
        </text>
      )}
      <line x1={px} x2={430} y1={210} y2={210} stroke="var(--ink-3)" strokeDasharray="4 4" />
      <text x={(px + 430) / 2} y={224} fontSize="12" textAnchor="middle" fill="var(--ink-2)">
        {distance} m
      </text>
    </svg>
  );
}

const acuity: SceneFn = (step, t) => {
  if (step === 'fraction')
    return (
      <div className="tutorial-center">
        <ChartRoom distance={6} truth={{ kind: 'chart', equiv6m: 12 }} covered="OS" />
        <Big>6 m away · smallest line read: 12 → 6/12</Big>
      </div>
    );
  if (step === 'one-eye')
    return (
      <div className="tutorial-center">
        <ChartRoom distance={6} truth={{ kind: 'chart', equiv6m: t < 0.5 ? 12 : 9 }} covered={t < 0.5 ? 'OS' : 'OD'} />
        <Big>{t < 0.5 ? 'Right eye (left covered): 6/12' : 'Left eye (right covered): 6/9'}</Big>
      </div>
    );
  if (step === 'closer') {
    const d = t < 0.5 ? 6 : 3;
    const s = expectedSnellen(chartObservation({ kind: 'chart', equiv6m: 120 }, d));
    return (
      <div className="tutorial-center">
        <ChartRoom distance={d} truth={{ kind: 'chart', equiv6m: 120 }} covered="OS" />
        <Big>{s ? `Moved to 3 m: reads the top line → ${formatSnellen(s)}` : 'At 6 m: cannot read the top line'}</Big>
      </div>
    );
  }
  if (step === 'pinhole')
    return (
      <div className="tutorial-center">
        <ChartRoom distance={6} truth={{ kind: 'chart', equiv6m: t < 0.5 ? 24 : 9 }} covered="OS" pinhole={t >= 0.5} />
        <Big>{t < 0.5 ? 'Without pinhole: 6/24' : 'With pinhole: 6/9 → probably optical (glasses may help)'}</Big>
      </div>
    );
  const seq = ['Counting fingers (write the distance)', 'Hand movements (write the distance)', 'Light perception', 'No light perception'];
  const k = Math.min(3, Math.floor(t * 4));
  return (
    <div className="tutorial-center">
      <ol className="tutorial-ladder" aria-label="Very low vision steps">
        {seq.map((x, i) => (
          <li key={x} className={i === k ? 'on' : i < k ? 'done' : ''}>
            {x}
          </li>
        ))}
      </ol>
      <Big>Step down one level at a time</Big>
    </div>
  );
};

// ---------------------------------------------------------------- writing a note
const NOTE_LINES = [
  { k: 'c', text: '45 y. Blurred vision in the right eye for 2 weeks.' },
  { k: 'h', text: 'No pain, no flashes. Diabetes for 10 years.' },
  { k: 't', text: 'VA: OD 6/24 (pinhole 6/24), OS 6/6.' },
  { k: 't', text: 'Pupils: equal, no relative afferent defect.' },
  { k: 'missing', text: 'Fundus: not examined.' },
  { k: 'a', text: 'Reduced OD vision not explained by refraction; cause not yet established.' },
  { k: 'n', text: 'Next: dilated fundus examination today (urgency per local protocol).' },
];
const NOTE_UPTO: Record<string, number> = { order: 4, missing: 5, assess: 6, next: 7 };
const NOTE_TITLE: Record<string, string> = { what: 'Only what you found', order: 'Complaint → history → tests, eye by eye', missing: 'Not examined ≠ normal', assess: 'Assessment + how sure you are', next: 'Next step + urgency' };

const note: SceneFn = (step, t) => {
  const upto = NOTE_UPTO[step] ?? 0;
  const prev = step === 'order' ? 0 : upto - 1;
  const shown = Math.round(lerp(prev, upto, t));
  return (
    <div className="tutorial-grid">
      <div className="tutorial-note" aria-label="Patient note being written">
        {step === 'what' ? (
          <>
            <p className="note-line ok">✓ Pupils: equal, no relative afferent defect. (you tested this)</p>
            <p className="note-line bad" style={{ opacity: Math.max(0.15, t) }}>
              ✗ <s>Fundus: normal.</s> (never looked — do not write it)
            </p>
          </>
        ) : (
          NOTE_LINES.slice(0, shown).map((l, i) => (
            <p key={i} className={`note-line ${l.k === 'missing' ? 'warn' : ''}`}>
              {l.text}
            </p>
          ))
        )}
      </div>
      <div>
        <Big>{NOTE_TITLE[step]}</Big>
        <p className="small muted">Fictional teaching note.</p>
      </div>
    </div>
  );
};

export const EXAM_SCENES: Record<string, SceneFn> = { rxdesk, acuity, note };
