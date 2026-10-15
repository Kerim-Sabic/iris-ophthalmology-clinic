/**
 * Tutorial scenes. Every picture is computed from the same domain models the studios use
 * (optics, pupils, motility, fields, slit lamp) at progress t — animations never show a state the
 * model would not produce.
 */
import type { ReactNode } from 'react';
import * as Fld from '../domain/fields';
import * as Mot from '../domain/motility';
import { eyeState, fmtAxis, fmtD, formatRx, makeLens, meridionalPower, retinoscopy, transpose, type SpheroCyl } from '../domain/optics';
import * as Pup from '../domain/pupils';
import { LAYERS, layerAtFocus, technique, TECHNIQUE_NAME, DEFAULT_SETTINGS } from '../domain/slitlamp';
import { CylinderCanvas, PowerGraph } from '../lab/OpticsViews';
import type { SceneFn } from './Player';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const Big = ({ children }: { children: ReactNode }) => <div className="tutorial-big num">{children}</div>;

// ---------------------------------------------------------------- tour
const DEST = [
  { id: 'today', name: 'Today', icon: '☀', text: 'Your next step' },
  { id: 'lectures', name: 'Lectures', icon: '📖', text: 'Pick your topics' },
  { id: 'lab', name: 'Laboratory', icon: '🔬', text: 'Move the instruments' },
  { id: 'patients', name: 'Patients', icon: '🧑', text: 'Examine & write a note' },
  { id: 'review', name: 'Exam & Review', icon: '✓', text: 'Prove you remember' },
];
const tour: SceneFn = (step, t) => {
  const active = step === 'welcome' ? -1 : step === 'help' ? -2 : DEST.findIndex((d) => d.id === step);
  return (
    <div className="tour-scene">
      {DEST.map((d, i) => {
        const on = active === i || active === -1;
        return (
          <div key={d.id} className={`tour-card ${active === i ? 'on' : ''}`} style={{ opacity: active === -1 ? Math.min(1, t * 5 - i * 0.6) : on ? 1 : 0.35, transform: active === i ? `scale(${1 + 0.06 * Math.sin(t * Math.PI)})` : undefined }}>
            <div className="tour-icon" aria-hidden>{d.icon}</div>
            <b>{d.name}</b>
            <span className="small muted">{d.text}</span>
          </div>
        );
      })}
      {active === -2 && (
        <div className="tour-help" style={{ transform: `scale(${1 + 0.08 * Math.sin(t * Math.PI * 4)})` }}>
          ▶ Watch tutorial
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------- cylinder
const CYL = makeLens(0, -4, 180);
const cylinder: SceneFn = (step, t) => {
  let lens: SpheroCyl = CYL;
  let probe = 180;
  let pts: { deg: number; label: string; kind: 'revealed' }[] = [];
  let caption = '';
  if (step === 'sphere') {
    lens = makeLens(-2);
    probe = 1 + 178 * t;
  } else if (step === 'cylinder') probe = 1 + 178 * t;
  else if (step === 'axis') probe = 180;
  else if (step === 'ninety') probe = lerp(180, 90, t);
  else if (step === 'between') {
    const k = Math.min(2, Math.floor(t * 3));
    probe = [30, 45, 60][k];
    pts = [30, 45, 60].slice(0, k + 1).map((d) => ({ deg: d, label: String(meridionalPower(CYL, d)), kind: 'revealed' as const }));
  } else if (step === 'write') {
    probe = 90;
    caption = formatRx(CYL);
  }
  probe = Math.round(probe);
  return (
    <div className="tutorial-grid">
      <div>
        <CylinderCanvas lens={lens} probeDeg={probe} showValues={false} showAxisLabel={lens.cylinderD !== 0} notation={caption || (lens.cylinderD === 0 ? 'sphere: same power everywhere' : 'cylinder lens')} title="Tutorial lens" />
      </div>
      <div>
        <Big>
          {fmtAxis(probe)}° → <b>{fmtD(meridionalPower(lens, probe), { plano: true })}</b>
          {meridionalPower(lens, probe) !== 0 && ' D'}
        </Big>
        <PowerGraph lens={lens} probeDeg={probe} showCurve={step !== 'between'} points={pts} title="Power in every direction" />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- transposition
const transposeScene: SceneFn = (step, t) => {
  const S = step === 'shift' ? lerp(0, -4, t) : step === 'rule' || step === 'trap' ? -4 : 0;
  const label = S === 0 ? formatRx(CYL) : S === -4 ? formatRx(transpose(CYL)) : `sphere ${fmtD(S)} + cylinder part`;
  return (
    <div className="tutorial-grid">
      <div>
        <PowerGraph lens={CYL} probeDeg={90} showCurve split={step === 'same' ? null : { sphereD: S }} proposal={step === 'trap' ? makeLens(-2) : null} title="Total power (blue) never changes" />
        <div className="legend">
          <span><i style={{ background: 'var(--target)' }} />total lens</span>
          {step !== 'same' && <span><i style={{ background: 'var(--observed)' }} />sphere part</span>}
          {step !== 'same' && <span><i style={{ background: 'var(--probe)' }} />cylinder part</span>}
          {step === 'trap' && <span><i style={{ background: 'var(--proposal)' }} />−2.00 DS (average only)</span>}
        </div>
      </div>
      <div>
        <Big>{label}</Big>
        {step === 'rule' && <p className="small">plano + (−4.00) = −4.00 · −4.00 → +4.00 · 180 → 090</p>}
        {step === 'trap' && <p className="small">−2.00 DS matches only the average. At 180° it gives −2.00 instead of plano.</p>}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- focal lines
function FocusDiagram({ target, trial, note }: { target: SpheroCyl; trial: SpheroCyl; note: string }) {
  const s = eyeState(target, trial);
  const W = 520;
  const H = 220;
  const x = (mm: number) => 70 + (mm - 14) * 26;
  const cy = 110;
  const retina = s.retinaDepthM * 1000;
  const col = ['var(--proposal)', 'var(--probe)'];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Side view of the eye. ${s.lines.map((l) => `${l.convergingMeridianDeg === 90 ? 'Up–down' : 'Side-to-side'} rays focus ${l.depthM ? (Math.abs(l.depthM * 1000 - retina) < 0.01 ? 'on the retina' : l.depthM * 1000 < retina ? 'in front of the retina' : 'behind the retina') : 'nowhere real'}`).join('. ')}.`}>
      <ellipse cx={x(retina) - 120} cy={cy} rx={200} ry={96} fill="var(--surface-2)" stroke="var(--line)" />
      <rect x={x(14) - 46} y={cy - 46} width={10} height={92} rx={5} fill="var(--target)" opacity={0.5} />
      <line x1={x(retina)} x2={x(retina)} y1={cy - 80} y2={cy + 80} stroke="var(--observed)" strokeWidth={5} />
      <text x={x(retina) + 6} y={cy - 70} fontSize="12" fill="var(--observed)">retina</text>
      {s.lines.map((l, i) => {
        const d = l.depthM ? Math.min(31, Math.max(14.5, l.depthM * 1000)) : 31;
        const vertical = Math.abs(l.convergingMeridianDeg - 90) < 1;
        const y1 = vertical ? cy - 40 : cy - 12;
        const y2 = vertical ? cy + 40 : cy + 12;
        return (
          <g key={i}>
            <line x1={x(14) - 40} y1={y1} x2={x(d)} y2={cy} stroke={col[i]} strokeWidth={1.5} opacity={0.7} />
            <line x1={x(14) - 40} y1={y2} x2={x(d)} y2={cy} stroke={col[i]} strokeWidth={1.5} opacity={0.7} />
            <circle cx={x(d)} cy={cy} r={6} fill={col[i]} />
            {!s.spherical && (
              <text x={x(d)} y={cy + (i ? 34 : -22)} fontSize="11" textAnchor="middle" fill={col[i]}>
                {vertical ? 'up–down rays' : 'side rays'}
              </text>
            )}
          </g>
        );
      })}
      <text x={10} y={H - 10} fontSize="12" fill="var(--ink-2)">{note}</text>
    </svg>
  );
}
const foci: SceneFn = (step, t) => {
  const P = makeLens(0);
  if (step === 'normal') return <FocusDiagram target={P} trial={P} note="Normal eye: one sharp focus on the retina" />;
  if (step === 'myopia') return <FocusDiagram target={makeLens(-3)} trial={makeLens(-3 * t)} note={`Myopia −3.00 D · minus lens in front: ${fmtD(-3 * t)} D`} />;
  if (step === 'two' || step === 'simple') return <FocusDiagram target={makeLens(0, -3, 180)} trial={P} note="plano / −3.00 × 180 uncorrected: one line on the retina, one in front" />;
  const mixed = makeLens(1.5, -3, 180);
  if (step === 'mixed') return <FocusDiagram target={mixed} trial={P} note="+1.50 / −3.00 × 180 uncorrected: one line in front, one behind" />;
  return <FocusDiagram target={mixed} trial={makeLens(1.5 * t, -3 * t, 180)} note={`Correcting lens ${Math.round(t * 100)}% in place`} />;
};

// ---------------------------------------------------------------- retinoscopy
function Reflex({ target, trial, pos, label }: { target: SpheroCyl; trial: SpheroCyl; pos: number; label: string }) {
  const o = retinoscopy(target, trial, 90, 0.5);
  const gain = o.motion === 'neutral' ? 0 : o.motion === 'with' ? 1 : -1;
  const off = pos * 55;
  return (
    <div className="tutorial-grid">
      <svg viewBox="0 0 300 260" role="img" aria-label={`Pupil reflex: ${o.motion === 'neutral' ? 'neutral, the whole pupil glows' : `moves ${o.motion} the light`}`}>
        <rect width={300} height={260} rx={12} fill="#16110d" />
        <circle cx={150} cy={130} r={95} fill="#5b4632" />
        <clipPath id="tp"><circle cx={150} cy={130} r={52} /></clipPath>
        <circle cx={150} cy={130} r={52} fill="#0c0806" />
        <g clipPath="url(#tp)">
          {o.motion === 'neutral' ? <circle cx={150} cy={130} r={52} fill="rgba(255,170,90,.92)" /> : <rect x={150 - 14 + gain * off * 0.7} y={60} width={28} height={140} fill="rgba(255,160,80,.85)" />}
        </g>
        <rect x={150 - 4 + off} y={0} width={8} height={260} fill="rgba(255,225,170,.35)" />
        <text x={150 + off} y={250} fill="#ffe1aa" fontSize="12" textAnchor="middle">your light →</text>
      </svg>
      <div>
        <Big>{o.motion === 'with' ? 'WITH motion → add plus' : o.motion === 'against' ? 'AGAINST motion → add minus' : 'NEUTRAL'}</Big>
        <p className="small">{label}</p>
      </div>
    </div>
  );
}
const retino: SceneFn = (step, t) => {
  const pos = Math.sin(t * Math.PI * 4);
  if (step === 'idea' || step === 'with') return <Reflex target={makeLens(1)} trial={makeLens(0)} pos={pos} label="Eye +1.00 D, no lens yet, working distance 0.50 m" />;
  if (step === 'against') return <Reflex target={makeLens(-3)} trial={makeLens(0)} pos={pos} label="Eye −3.00 D, no lens yet" />;
  if (step === 'neutral') return <Reflex target={makeLens(-3)} trial={makeLens(-1)} pos={pos} label="Eye −3.00 D with a −1.00 D lens: gross result −1.00 D" />;
  return (
    <div className="tutorial-center">
      <Big>gross −1.00 D − (1 ÷ 0.50 m = 2.00 D) = net {fmtD(lerp(-1, -3, t))} D</Big>
      <p className="small">Take the working distance off the sphere only once — not twice if a working-distance lens was already in the frame.</p>
    </div>
  );
};

// ---------------------------------------------------------------- pupils
function TwoPupils({ frame, light }: { frame: Pup.PupilFrame; light: Pup.LightPos }) {
  const r = (mm: number) => mm * 6;
  return (
    <svg viewBox="0 0 440 200" role="img" aria-label={`Right pupil ${frame.OD.toFixed(1)} millimetres, left pupil ${frame.OS.toFixed(1)} millimetres, light on ${light === 'none' ? 'neither eye' : light === 'OD' ? 'the right eye' : 'the left eye'}`}>
      {(['OD', 'OS'] as const).map((e, i) => {
        const cx = i ? 330 : 110;
        return (
          <g key={e}>
            <ellipse cx={cx} cy={95} rx={95} ry={55} fill="#fff" stroke="var(--line)" />
            <circle cx={cx} cy={95} r={48} fill="#6d8fa8" />
            <circle cx={cx} cy={95} r={r(frame[e])} fill="#111" />
            <text x={cx} y={175} textAnchor="middle" fontSize="13" fill="var(--ink)">{e === 'OD' ? "Patient's RIGHT" : "Patient's LEFT"} · {frame[e].toFixed(1)} mm</text>
            {light === e && <text x={cx} y={24} textAnchor="middle" fontSize="20">🔦</text>}
          </g>
        );
      })}
    </svg>
  );
}
function pupilFrames(p: Pup.PupilPatient, segs: Pup.LightSegment[]) {
  return Pup.simulate(p, segs);
}
const SW = Pup.swingSequence('OD', 4, 15);
const pupils: SceneFn = (step, t) => {
  const normal = Pup.normalPatient();
  const rapd = Pup.patientFor('afferent-OD');
  const segs = step === 'both' ? [{ light: 'none' as const, ambient: 'dark' as const, ticks: 10 }, { light: 'OD' as const, ambient: 'dark' as const, ticks: 25 }] : SW;
  const frames = pupilFrames(step === 'both' || step === 'swing' ? normal : rapd, segs);
  const f = frames[Math.min(frames.length - 1, Math.floor(t * (frames.length - 1)))];
  return (
    <div className="tutorial-center">
      <TwoPupils frame={f} light={f.light} />
      <Big>{step === 'rapd' || step === 'not-big' ? (f.light === 'OD' ? 'Light on RIGHT → both pupils widen' : f.light === 'OS' ? 'Light on LEFT → both pupils narrow' : 'Dim room') : f.light === 'none' ? 'Dim room' : 'Light on → both pupils narrow together'}</Big>
    </div>
  );
};

// ---------------------------------------------------------------- cover test
function FaceView({ pos, occ, label }: { pos: Record<'OD' | 'OS', number>; occ: Mot.Occluder; label: string }) {
  const eyeX = { OD: 150, OS: 290 };
  return (
    <svg viewBox="0 0 440 210" role="img" aria-label={label}>
      <ellipse cx={220} cy={110} rx={200} ry={95} fill="var(--surface-2)" stroke="var(--line)" />
      <text x={220} y={22} textAnchor="middle" fontSize="12" fill="var(--ink-2)">● target straight ahead</text>
      {(['OD', 'OS'] as const).map((e) => (
        <g key={e}>
          <ellipse cx={eyeX[e]} cy={105} rx={52} ry={28} fill="#fff" stroke="var(--ink-3)" />
          <circle cx={eyeX[e] + Mot.toExaminerX(e, pos[e]) * 1.2} cy={105} r={16} fill="#5b7f95" />
          <circle cx={eyeX[e] + Mot.toExaminerX(e, pos[e]) * 1.2} cy={105} r={7} fill="#111" />
          <text x={eyeX[e]} y={160} textAnchor="middle" fontSize="12" fill="var(--ink)">{e === 'OD' ? "Patient's RIGHT" : "Patient's LEFT"}</text>
          {occ === e && <rect x={eyeX[e] - 62} y={66} width={124} height={78} rx={10} fill="#3d4652" opacity={0.92} />}
          {occ === e && <text x={eyeX[e]} y={110} textAnchor="middle" fontSize="12" fill="#fff">COVER</text>}
        </g>
      ))}
      <text x={220} y={195} textAnchor="middle" fontSize="11" fill="var(--ink-3)">You face the patient: their right eye is on your left</text>
    </svg>
  );
}
const cover: SceneFn = (step, t) => {
  if (step === 'phoria') {
    const p = Mot.patientFor('esophoria');
    const steps = Mot.runCoverSequence(p, ['OS', 'none']);
    const k = t < 0.5 ? 1 : 2;
    const tt = t < 0.5 ? t * 2 : (t - 0.5) * 2;
    const st = steps[k];
    const pos = { OD: lerp(st.before.inwardPD.OD, st.after.inwardPD.OD, tt), OS: lerp(st.before.inwardPD.OS, st.after.inwardPD.OS, tt) };
    return (
      <div className="tutorial-center">
        <FaceView pos={pos} occ={st.after.occluder === 'none' && tt < 1 ? 'none' : st.after.occluder} label={`Phoria: ${st.label}`} />
        <Big>{k === 1 ? 'Covered left eye drifts in (behind the cover)' : 'Uncovered: it moves back OUT to the target'}</Big>
      </div>
    );
  }
  const p = Mot.patientFor('ET-OS');
  const steps = Mot.runCoverSequence(p, ['OD']);
  const st = steps[1];
  const tt = step === 'look' ? 0 : step === 'cover-right' ? t : 1;
  const pos = { OD: lerp(st.before.inwardPD.OD, st.after.inwardPD.OD, tt), OS: lerp(st.before.inwardPD.OS, st.after.inwardPD.OS, tt) };
  return (
    <div className="tutorial-center">
      <FaceView pos={pos} occ={step === 'look' ? 'none' : 'OD'} label={step === 'look' ? 'Left eye turned in' : 'Right eye covered; left eye moves out to fixate'} />
      <Big>{step === 'look' ? 'Left eye is turned IN' : step === 'cover-right' ? 'Cover right → left eye moves OUT' : 'Moved on cover = TROPIA (left esotropia)'}</Big>
    </div>
  );
};

// ---------------------------------------------------------------- fields
function FieldMap({ grid, title, reveal }: { grid: Fld.Grid; title: string; reveal: number }) {
  const n = Fld.GRID_N;
  const c = 14;
  return (
    <svg viewBox={`0 0 ${n * c + 20} ${n * c + 34}`} role="img" aria-label={`${title}: ${Fld.QUADS.filter((q) => Fld.summarize(grid).quads[q]).map(Fld.quadName).join(', ') || 'no loss'}`}>
      <text x={(n * c + 20) / 2} y={13} textAnchor="middle" fontSize="11" fill="var(--ink)">{title}</text>
      {grid.map((row, r) =>
        row.map((lost, col) => (
          <rect key={`${r}-${col}`} x={10 + col * c} y={20 + r * c} width={c - 1} height={c - 1} fill={lost && col / n <= reveal + 0.05 ? '#2b2f36' : 'var(--surface-2)'} />
        )),
      )}
      <line x1={10 + (n * c) / 2} x2={10 + (n * c) / 2} y1={20} y2={20 + n * c} stroke="var(--ink-3)" />
      <line x1={10} x2={10 + n * c} y1={20 + (n * c) / 2} y2={20 + (n * c) / 2} stroke="var(--ink-3)" />
    </svg>
  );
}
const LESION: Record<string, Fld.Lesion | null> = {
  map: null,
  nerve: { site: 'optic-nerve', side: 'R', variant: 'complete' },
  chiasm: { site: 'chiasm', side: null },
  tract: { site: 'optic-tract', side: 'R' },
  occipital: { site: 'occipital', side: 'R', variant: 'complete' },
};
const fields: SceneFn = (step, t) => {
  const l = LESION[step] ?? null;
  // Grid rows are stored top = superior; columns left = patient's left in field coordinates.
  const d = Fld.fieldDefect(l);
  const reveal = l ? t : 1;
  const where = !l ? '' : l.site === 'optic-nerve' ? 'Right optic nerve' : l.site === 'chiasm' ? 'Chiasm' : l.site === 'optic-tract' ? 'Right optic tract' : 'Right occipital cortex';
  return (
    <div className="tutorial-grid">
      <svg viewBox="0 0 220 230" role="img" aria-label={where ? `Damage at the ${where}` : 'Visual pathway'}>
        <text x={10} y={14} fontSize="10" fill="var(--ink-2)">Patient's LEFT</text>
        <text x={210} y={14} fontSize="10" textAnchor="end" fill="var(--ink-2)">RIGHT</text>
        <circle cx={70} cy={40} r={16} fill="var(--surface-2)" stroke="var(--ink-3)" />
        <circle cx={150} cy={40} r={16} fill="var(--surface-2)" stroke="var(--ink-3)" />
        <path d="M70 56 L110 100 L150 56 M110 100 L80 150 L95 210 M110 100 L140 150 L125 210" fill="none" stroke="var(--target)" strokeWidth={4} />
        {l && (() => {
          const pt = l.site === 'optic-nerve' ? [135, 75] : l.site === 'chiasm' ? [110, 100] : l.site === 'optic-tract' ? [140, 150] : [125, 205];
          return <circle cx={pt[0]} cy={pt[1]} r={10 + 4 * Math.sin(t * Math.PI * 4)} fill="var(--bad)" opacity={0.7} />;
        })()}
        <text x={110} y={226} textAnchor="middle" fontSize="11" fill="var(--bad)">{where}</text>
      </svg>
      <div>
        <div className="row" style={{ justifyContent: 'center' }}>
          <div style={{ width: 170 }}><FieldMap grid={d.L} title="Left eye sees" reveal={reveal} /></div>
          <div style={{ width: 170 }}><FieldMap grid={d.R} title="Right eye sees" reveal={reveal} /></div>
        </div>
        <Big>{l ? Fld.classify(d).name : 'Full vision in both eyes'}</Big>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- slit lamp
const slitlamp: SceneFn = (step, t) => {
  const s = { ...DEFAULT_SETTINGS, magnification: 16 as const };
  if (step === 'section') Object.assign(s, { beamWidthMm: lerp(8, 0.2, t), angleDeg: 45 });
  if (step === 'focus') Object.assign(s, { beamWidthMm: 0.2, focusMm: lerp(0.03, 3.9, t) });
  if (step === 'cone' || step === 'rule') Object.assign(s, { beamWidthMm: 0.2, beamHeightMm: lerp(10, 1, step === 'cone' ? t : 1), focusMm: 1.5, roomDark: true });
  const tech = technique(s);
  const lay = layerAtFocus(s);
  const W = 460;
  const zx = (mm: number) => 40 + (mm / 4.5) * 380;
  return (
    <div className="tutorial-center">
      <svg viewBox={`0 0 ${W} 200`} role="img" aria-label={`${TECHNIQUE_NAME[tech]}${lay ? `, focused in the ${LAYERS[lay].name}` : ''}`}>
        <rect width={W} height={200} rx={10} fill={s.roomDark ? '#0d0d10' : '#2a2a30'} />
        {(['epithelium', 'stroma', 'endothelium', 'anterior-chamber', 'iris', 'lens-anterior'] as const).map((k) => (
          <rect key={k} x={zx(LAYERS[k].from)} y={40} width={Math.max(3, zx(Math.min(4.5, LAYERS[k].to)) - zx(LAYERS[k].from))} height={120} fill={k === lay ? '#ffe7a8' : k === 'iris' ? '#6b4f35' : k === 'anterior-chamber' ? '#1e2a33' : '#4a5d6b'} opacity={0.85} />
        ))}
        <rect x={zx(s.focusMm) - Math.max(1.5, s.beamWidthMm * 6) / 2} y={100 - s.beamHeightMm * 6} width={Math.max(3, s.beamWidthMm * 6)} height={s.beamHeightMm * 12} fill="rgba(255,248,220,.55)" />
        <line x1={zx(s.focusMm)} x2={zx(s.focusMm)} y1={30} y2={170} stroke="var(--probe)" strokeDasharray="4 3" strokeWidth={2} />
        <text x={12} y={22} fontSize="12" fill="#eee">front of eye ← → deeper</text>
        <text x={12} y={190} fontSize="12" fill="#ffe7a8">{lay ? `In focus: ${LAYERS[lay].name}` : ''}</text>
      </svg>
      <Big>{TECHNIQUE_NAME[tech]}</Big>
      {step === 'rule' && <p className="small">Write: the layers you sectioned. Not examined ≠ normal.</p>}
    </div>
  );
};

export const SCENES: Record<string, SceneFn> = { tour, cylinder, transpose: transposeScene, foci, retino, pupils, cover, fields, slitlamp };
