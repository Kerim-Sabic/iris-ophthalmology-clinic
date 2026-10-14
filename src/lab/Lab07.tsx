import { useState, type KeyboardEvent, type ReactNode } from 'react';
import { useApp, type NewAttempt } from '../app/context';
import {
  ALL_LESIONS, ARTIFACT, CENTRAL_RADIUS_DEG, CONFRONTATION_CASES, EYE_WORD, FIELD_EXTENT_DEG, GRID_N, PERIMETRY_REPORTS, QUADS, REPEAT, SITE_INFO,
  blankSummary, classify, comparePrediction, examinerHand, fieldDefect, fieldHalf, fieldQuadrantToRetina, lesionLabel, localize,
  patternName, perimetryFromLesion, quadHalf, quadName, retinaGrid, retinaHalf, summarize, confrontationResponse,
  type ConfrontationCase, type Eye, type Grid, type Horizontal, type LevelGrid, type Lesion, type PerimetryReport, type QuadKey, type Site,
  type Summary, type SummaryPair, type Variant, type Vertical,
} from '../domain/fields';
import { newSeed, rng } from '../domain/random';
import { now } from '../lib/store';
import { Feedback, Pill, Seg } from '../ui/kit';

type Mode = 'explore' | 'guided' | 'challenge' | 'case';
type Rec = (a: Pick<NewAttempt, 'itemId' | 'familyId' | 'objectiveIds' | 'taskType' | 'correct' | 'scores' | 'response' | 'startedAt'> & Partial<NewAttempt>) => void;
const LECTURES = ['L11', 'L24'];
const levelsOf = (g: Grid): LevelGrid => g.map((r) => r.map((v) => (v ? 2 : 0)));
const onKey = (fn: () => void) => (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fn();
  }
};
const sideKey = (l: { site: Site; side: Eye | null }) => `${l.site}|${l.side ?? '-'}`;

// ------------------------------------------------------------ field / retina maps (SVG; no CSS mirroring — positions come from coordinates)

const S = 200;
const C = S / GRID_N;
function EyeMap({ title, labels, levels, aria, overlay }: { title: string; labels: { l: string; r: string; t: string; b: string }; levels: LevelGrid | null; aria: string; overlay?: ReactNode }) {
  const { reducedMotion } = useApp();
  const rC = (CENTRAL_RADIUS_DEG / FIELD_EXTENT_DEG) * (S / 2);
  return (
    <svg viewBox="0 0 240 262" role="img" aria-label={aria} style={{ maxWidth: 280 }}>
      <defs>
        <pattern id="fld-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="6" height="6" fill="var(--ink-2)" />
          <line x1="0" y1="0" x2="0" y2="6" stroke="var(--surface)" strokeWidth="1.5" />
        </pattern>
        <pattern id="fld-dots" width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="2.5" cy="2.5" r="1.1" fill="var(--ink-2)" />
        </pattern>
      </defs>
      <text x="120" y="12" textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--ink)">{title}</text>
      <text x="120" y="27" textAnchor="middle" fontSize="10" fill="var(--ink-3)">{labels.t}</text>
      <text x="120" y="258" textAnchor="middle" fontSize="10" fill="var(--ink-3)">{labels.b}</text>
      <text x="12" y="135" textAnchor="middle" fontSize="10" fill="var(--ink-3)" transform="rotate(-90 12 135)">{labels.l}</text>
      <text x="230" y="135" textAnchor="middle" fontSize="10" fill="var(--ink-3)" transform="rotate(90 230 135)">{labels.r}</text>
      <g transform="translate(20,35)">
        <rect width={S} height={S} fill="var(--surface)" stroke="var(--line)" />
        {levels?.map((r, row) =>
          r.map((v, col) => (v ? <rect key={`${row}-${col}`} x={col * C} y={row * C} width={C} height={C} fill={v === 2 ? 'url(#fld-hatch)' : 'url(#fld-dots)'} style={{ transition: reducedMotion ? 'none' : 'opacity .2s' }} /> : null)),
        )}
        <line x1={S / 2} y1="0" x2={S / 2} y2={S} stroke="var(--line)" strokeDasharray="4 3" />
        <line x1="0" y1={S / 2} x2={S} y2={S / 2} stroke="var(--line)" strokeDasharray="4 3" />
        <circle cx={S / 2} cy={S / 2} r={rC} fill="none" stroke="var(--ink-3)" strokeDasharray="2 3" />
        <circle cx={S / 2} cy={S / 2} r="3" fill="var(--target)" />
        {overlay}
      </g>
    </svg>
  );
}

const fieldLabels = (eye: Eye) => ({ t: 'Superior field', b: 'Inferior field', l: `${fieldHalf(eye, -1)} (patient's left)`, r: `${fieldHalf(eye, 1)} (patient's right)` });
const retinaLabels = (eye: Eye) => ({ t: 'Superior retina', b: 'Inferior retina', l: `${retinaHalf(eye, -1)} retina`, r: `${retinaHalf(eye, 1)} retina` });

/** Observable description (never names the pattern). */
function describeSummary(eye: Eye, s: Summary): string {
  const lostQ = QUADS.filter((q) => s.quads[q]).map(quadName);
  return `${EYE_WORD[eye]} eye: ${lostQ.length ? `not seen in ${lostQ.join(', ')}` : 'all quadrants seen'}; central region ${s.central ? 'involved' : 'seen'}.`;
}

function PredictOverlay({ eye, s, onToggle, disabled }: { eye: Eye; s: Summary; onToggle(q: QuadKey | 'central'): void; disabled?: boolean }) {
  const pos: Record<QuadKey, [number, number]> = { 'sup-left': [0, 0], 'sup-right': [S / 2, 0], 'inf-left': [0, S / 2], 'inf-right': [S / 2, S / 2] };
  const rC = (CENTRAL_RADIUS_DEG / FIELD_EXTENT_DEG) * (S / 2);
  return (
    <g>
      {QUADS.map((q) => (
        <g key={q} role="button" tabIndex={disabled ? -1 : 0} aria-pressed={s.quads[q]} aria-label={`${EYE_WORD[eye]} eye, ${quadName(q)} (${quadHalf(eye, q)}) quadrant: ${s.quads[q] ? 'marked lost' : 'marked seen'}`} onClick={() => !disabled && onToggle(q)} onKeyDown={onKey(() => !disabled && onToggle(q))} style={{ cursor: disabled ? 'default' : 'pointer' }}>
          <rect x={pos[q][0] + 2} y={pos[q][1] + 2} width={S / 2 - 4} height={S / 2 - 4} fill={s.quads[q] ? 'url(#fld-hatch)' : 'transparent'} opacity={s.quads[q] ? 0.55 : 1} stroke="var(--proposal)" strokeDasharray={s.quads[q] ? undefined : '3 3'} />
          <text x={pos[q][0] + S / 4} y={pos[q][1] + 18} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--proposal)">{s.quads[q] ? '✕ LOST' : 'seen'}</text>
        </g>
      ))}
      <g role="button" tabIndex={disabled ? -1 : 0} aria-pressed={s.central} aria-label={`${EYE_WORD[eye]} eye, central region: ${s.central ? 'marked involved' : 'marked spared'}`} onClick={() => !disabled && onToggle('central')} onKeyDown={onKey(() => !disabled && onToggle('central'))} style={{ cursor: disabled ? 'default' : 'pointer' }}>
        <circle cx={S / 2} cy={S / 2} r={rC} fill={s.central ? 'var(--proposal)' : 'var(--surface)'} fillOpacity={s.central ? 0.45 : 0.85} stroke="var(--proposal)" strokeWidth="2" />
        <text x={S / 2} y={S / 2 + 4} textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--ink)">{s.central ? '✕ C' : 'C'}</text>
      </g>
    </g>
  );
}

function FieldPair({ levels, pred, onToggle, disabled, caption }: { levels: Record<Eye, LevelGrid> | null; pred?: SummaryPair; onToggle?(e: Eye, q: QuadKey | 'central'): void; disabled?: boolean; caption?: string }) {
  return (
    <div className="canvas-wrap">
      <div className="row" style={{ justifyContent: 'center', gap: 16 }}>
        {(['L', 'R'] as Eye[]).map((e) => (
          <EyeMap key={e} title={`${EYE_WORD[e]} eye (${e === 'R' ? 'OD' : 'OS'})`} labels={fieldLabels(e)} levels={levels?.[e] ?? null}
            aria={levels ? describeSummary(e, summarize(levels[e].map((r) => r.map((v) => v === 2)))) : `${EYE_WORD[e]} eye: blank field map for your prediction`}
            overlay={pred && onToggle ? <PredictOverlay eye={e} s={pred[e]} onToggle={(q) => onToggle(e, q)} disabled={disabled} /> : undefined} />
        ))}
      </div>
      <p className="tiny muted" style={{ textAlign: 'center', margin: 0 }}>{caption ?? "Field maps as seen by the patient (printout orientation): left eye on the left, right eye on the right; patient's left ← → patient's right. Hatched = not seen; dotted = relatively depressed; C = central region."}</p>
    </div>
  );
}

// ------------------------------------------------------------ pathway diagram (viewed from above, face toward the top: patient's right is on screen right)

const SITE_POS: Record<string, [number, number]> = {
  'optic-nerve|L': [125, 92], 'optic-nerve|R': [235, 92], 'chiasm|-': [180, 138], 'optic-tract|L': [146, 182], 'optic-tract|R': [214, 182],
  'lgn|L': [124, 222], 'lgn|R': [236, 222], 'meyer|L': [72, 282], 'meyer|R': [288, 282], 'parietal|L': [128, 292], 'parietal|R': [232, 292],
  'occipital|L': [156, 366], 'occipital|R': [204, 366],
};
function Pathway({ marked, onPick, disabled, ariaPrefix }: { marked: Set<string>; onPick?(site: Site, side: Eye | null): void; disabled?: boolean; ariaPrefix: string }) {
  const path = (side: 'L' | 'R') => {
    const m = side === 'L' ? 1 : -1;
    const x = (v: number) => (side === 'L' ? v : 360 - v);
    return (
      <g stroke="var(--target)" strokeWidth="3" fill="none" strokeLinecap="round">
        <line x1={x(110)} y1={58} x2={180} y2={138} />
        <path d={`M180 138 L${x(146)} 182 L${x(124)} 222`} />
        <path d={`M${x(124)} 222 Q${x(124) - 70 * m} 262 ${x(72)} 282 Q${x(84)} 340 ${x(156)} 366`} />
        <path d={`M${x(124)} 222 Q${x(124)} 270 ${x(128)} 292 Q${x(134)} 340 ${x(156)} 366`} />
      </g>
    );
  };
  return (
    <svg viewBox="0 0 360 400" role="group" aria-label={`${ariaPrefix}. Visual pathway viewed from above, face toward the top; patient's right is on the right.`} style={{ maxWidth: 380 }}>
      <text x="8" y="16" fontSize="11" fontWeight="700" fill="var(--ink)">Patient's LEFT</text>
      <text x="352" y="16" fontSize="11" fontWeight="700" fill="var(--ink)" textAnchor="end">Patient's RIGHT</text>
      <polygon points="180,10 170,34 190,34" fill="none" stroke="var(--ink-3)" />
      <text x="180" y="48" fontSize="9" textAnchor="middle" fill="var(--ink-3)">nose</text>
      {(['L', 'R'] as Eye[]).map((e) => (
        <g key={e}>
          <circle cx={e === 'L' ? 110 : 250} cy="40" r="18" fill="var(--surface-2)" stroke="var(--ink-2)" />
          <text x={e === 'L' ? 110 : 250} y="44" fontSize="10" textAnchor="middle" fill="var(--ink)">{e === 'L' ? 'OS' : 'OD'}</text>
        </g>
      ))}
      {path('L')}
      {path('R')}
      <g fontSize="9" fill="var(--ink-3)">
        <text x="180" y="160" textAnchor="middle">chiasm</text>
        <text x="40" y="262">Meyer's loop</text>
        <text x="320" y="262" textAnchor="end">Meyer's loop</text>
        <text x="100" y="246" textAnchor="end">LGN</text>
        <text x="260" y="246">LGN</text>
        <text x="180" y="392" textAnchor="middle">occipital cortex</text>
      </g>
      {Object.entries(SITE_POS).map(([k, [cx, cy]]) => {
        const [site, s] = k.split('|') as [Site, string];
        const side = s === '-' ? null : (s as Eye);
        const on = marked.has(k);
        const name = side ? `${EYE_WORD[side]} ${SITE_INFO[site].name}` : SITE_INFO[site].name;
        return (
          <g key={k} role="button" tabIndex={disabled ? -1 : 0} aria-pressed={on} aria-label={`${name}${on ? ' — marked' : ''}`} onClick={() => !disabled && onPick?.(site, side)} onKeyDown={onKey(() => !disabled && onPick?.(site, side))} style={{ cursor: disabled ? 'default' : 'pointer' }}>
            <title>{name}</title>
            <circle cx={cx} cy={cy} r="12" fill={on ? 'var(--proposal)' : 'var(--surface)'} fillOpacity={on ? 0.25 : 0.9} stroke={on ? 'var(--proposal)' : 'var(--ink-3)'} strokeWidth={on ? 3 : 1} strokeDasharray={on ? undefined : '3 2'} />
            {on && <text x={cx} y={cy + 5} fontSize="15" fontWeight="800" textAnchor="middle" fill="var(--proposal)">✕</text>}
          </g>
        );
      })}
    </svg>
  );
}

function retinaText(eye: Eye, g: Grid): string {
  const s = summarize(retinaGrid(g));
  const parts = QUADS.filter((q) => s.quads[q]).map((q) => `${q.startsWith('sup') ? 'superior' : 'inferior'} ${retinaHalf(eye, q.endsWith('right') ? 1 : -1)}`);
  return `${EYE_WORD[eye]} retina: ${parts.length ? parts.join(', ') : s.central ? 'central (macular) region only' : 'no affected region'}`;
}

// ------------------------------------------------------------ Explore

function Explore() {
  const [lesion, setLesion] = useState<Lesion | null>({ site: 'occipital', side: 'R', variant: 'complete' });
  const [variant, setVariant] = useState<Variant>('complete');
  const [showRetina, setShowRetina] = useState(false);
  const d = fieldDefect(lesion);
  const loc = localize(d);
  const pick = (site: Site, side: Eye | null) => {
    const vs = SITE_INFO[site].variants;
    setLesion({ site, side, variant: vs ? (vs.includes(variant) ? variant : 'complete') : undefined });
  };
  const variants = lesion && SITE_INFO[lesion.site].variants;
  return (
    <div className="grid cols-2">
      <div className="canvas-wrap stack">
        <Pathway marked={new Set(lesion ? [sideKey(lesion)] : [])} onPick={pick} ariaPrefix="Choose where to place a hypothetical lesion" />
        <div className="row small">
          {variants && <Seg label="Lesion variant" value={lesion!.variant ?? 'complete'} onChange={(v) => { setVariant(v); setLesion({ ...lesion!, variant: v }); }} options={variants.map((v) => ({ value: v, label: v === 'complete' ? 'Complete' : v === 'central-scotoma' ? 'Central fibres only' : 'Macular sparing (authored)' }))} />}
          <button className="btn sm" onClick={() => setLesion(null)}>No lesion</button>
          <label className="row"><input type="checkbox" checked={showRetina} onChange={(e) => setShowRetina(e.target.checked)} /> Show retinal mapping</label>
        </div>
      </div>
      <div className="stack">
        <FieldPair levels={{ R: levelsOf(d.R), L: levelsOf(d.L) }} />
        {showRetina && (
          <div className="canvas-wrap">
            <div className="row" style={{ justifyContent: 'center', gap: 16 }}>
              {(['L', 'R'] as Eye[]).map((e) => <EyeMap key={e} title={`${EYE_WORD[e]} retina`} labels={retinaLabels(e)} levels={levelsOf(retinaGrid(d[e]))} aria={retinaText(e, d[e])} />)}
            </div>
            <p className="tiny muted" style={{ textAlign: 'center', margin: 0 }}>Retina in its anatomical frame, viewed from behind the eye (patient's right on the right). The image is inverted and reversed: temporal field → nasal retina, superior field → inferior retina.</p>
          </div>
        )}
        <div className="panel stack small">
          <div><b>{lesion ? lesionLabel(lesion) : 'No lesion'}</b> → <span>{classify(d).name}</span></div>
          {lesion && <p style={{ margin: 0 }}><b>Explain this change:</b> {SITE_INFO[lesion.site].note}</p>}
          <p style={{ margin: 0 }}>{retinaText('L', d.L)}. {retinaText('R', d.R)}.</p>
          <p style={{ margin: 0 }}><b>Sites that give the same pattern:</b> {loc.candidates.map(lesionLabel).join('; ') || '—'}. <span className="muted">{loc.note}</span></p>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------ Guided: predict → reveal; field ↔ retina question

function Predict({ seed, rec }: { seed: number; rec: Rec }) {
  const [start] = useState(now());
  const lesion = rng(seed).pick(ALL_LESIONS);
  const d = fieldDefect(lesion);
  const [pred, setPred] = useState<SummaryPair>({ R: blankSummary(), L: blankSummary() });
  const [g, setG] = useState<ReturnType<typeof comparePrediction> | null>(null);
  const toggle = (e: Eye, q: QuadKey | 'central') => setPred((p) => ({ ...p, [e]: q === 'central' ? { ...p[e], central: !p[e].central } : { ...p[e], quads: { ...p[e].quads, [q]: !p[e].quads[q] } } }));
  const submit = () => {
    const r = comparePrediction(pred, d);
    setG(r);
    rec({ itemId: `LAB07-predict#${seed}`, familyId: 'F-FIELD-PREDICT', objectiveIds: ['FLD-COORD', 'FLD-LOCALIZE'], taskType: 'predict-reveal', correct: r.correct, scores: { matches: r.matches, total: r.total }, response: pred, misconceptionIds: r.misconceptionIds, startedAt: start, hintLevel: 1, state: { lesion } });
  };
  return (
    <div className="grid cols-2">
      <div className="canvas-wrap stack">
        <Pathway marked={new Set([sideKey(lesion)])} disabled ariaPrefix={`Given lesion: ${lesionLabel(lesion)}`} />
        <p className="small"><b>Given:</b> {lesionLabel(lesion)}. Predict the field loss in each eye: click (or Tab + Enter) the quadrants that will be lost and the central region if it is involved.</p>
        <p className="tiny muted">Scaffold: start from the lesion side, decide which half of each retina is interrupted, then invert and reverse onto the field.</p>
      </div>
      <div className="stack">
        <FieldPair levels={g ? { R: levelsOf(d.R), L: levelsOf(d.L) } : null} pred={pred} onToggle={toggle} disabled={!!g} caption={g ? 'Model result (hatched) under your prediction (orange outlines).' : undefined} />
        {!g ? <button className="btn primary" onClick={submit}>Reveal and compare</button> : <Feedback tone={g.correct ? 'good' : 'bad'} title={g.correct ? `Correct: ${patternName(lesion)}` : `${g.matches}/${g.total} regions match — ${patternName(lesion)}`} items={g.items} />}
      </div>
    </div>
  );
}

function CoordQuiz({ seed, rec }: { seed: number; rec: Rec }) {
  const [start] = useState(now());
  const r = rng(seed + 7);
  const eye = r.pick(['R', 'L'] as Eye[]);
  const q = { h: r.pick(['nasal', 'temporal'] as Horizontal[]), v: r.pick(['superior', 'inferior'] as Vertical[]) };
  const truth = fieldQuadrantToRetina(eye, q);
  const [ans, setAns] = useState<{ h: Horizontal; v: Vertical } | null>(null);
  const choose = (a: { h: Horizontal; v: Vertical }) => {
    setAns(a);
    const ok = a.h === truth.h && a.v === truth.v;
    const same = a.h === q.h && a.v === q.v;
    rec({ itemId: `LAB07-coord#${seed}`, familyId: 'F-FIELD-PREDICT', objectiveIds: ['FLD-COORD'], taskType: 'coordinate-transform', correct: ok, scores: { horizontal: a.h === truth.h, vertical: a.v === truth.v }, response: a, misconceptionIds: !ok && (same || a.h === q.h || a.v === q.v) ? ['M-FIELD-VS-RETINA'] : [], startedAt: start, state: { eye, q } });
  };
  const opts = (['superior', 'inferior'] as Vertical[]).flatMap((v) => (['nasal', 'temporal'] as Horizontal[]).map((h) => ({ h, v })));
  return (
    <div className="panel stack" style={{ maxWidth: 640 }}>
      <p>The patient's <b>{EYE_WORD[eye].toLowerCase()} eye</b> does not see in its <b>{q.v} {q.h}</b> field. Which retinal quadrant of that eye receives this part of the field?</p>
      <div className="row">
        {opts.map((o) => <button key={o.h + o.v} className="btn" disabled={!!ans} aria-pressed={ans?.h === o.h && ans?.v === o.v} onClick={() => choose(o)}>{o.v} {o.h} retina</button>)}
      </div>
      {ans && <Feedback tone={ans.h === truth.h && ans.v === truth.v ? 'good' : 'bad'} title={`Answer: ${truth.v} ${truth.h} retina`} items={['The eye\'s optics invert and reverse the image: temporal field ↔ nasal retina, superior field ↔ inferior retina. Field names describe where the patient sees; retinal names describe where the image falls.']} />}
    </div>
  );
}

// ------------------------------------------------------------ Confrontation (T037)

const EX_POS: { label: string; q: QuadKey }[] = [
  { label: 'your upper left', q: 'sup-right' }, { label: 'your upper right', q: 'sup-left' }, { label: 'your lower left', q: 'inf-right' }, { label: 'your lower right', q: 'inf-left' },
];
type Doc = Record<Eye, { quads: Record<QuadKey, 'seen' | 'not seen' | ''>; reliable: 'reliable' | 'unreliable' | '' }>;
const blankDoc = (): Doc => ({ R: { quads: { 'sup-left': '', 'sup-right': '', 'inf-left': '', 'inf-right': '' }, reliable: '' }, L: { quads: { 'sup-left': '', 'sup-right': '', 'inf-left': '', 'inf-right': '' }, reliable: '' } });

function Confrontation({ c, guided, rec, seed, onDone }: { c: ConfrontationCase; guided: boolean; rec: Rec; seed: number; onDone?(): void }) {
  const [start] = useState(now());
  const [eye, setEye] = useState<Eye>('R');
  const [fixOk, setFixOk] = useState<boolean | null>(null);
  const [log, setLog] = useState<{ eye: Eye; pos: string; q: QuadKey; text: string }[]>([]);
  const [doc, setDoc] = useState<Doc>(blankDoc());
  const [fb, setFb] = useState<{ ok: boolean; items: string[] } | null>(null);
  const tested = (e: Eye) => new Set(log.filter((l) => l.eye === e).map((l) => l.q)).size === 4;
  const present = (p: (typeof EX_POS)[number]) => {
    const o = confrontationResponse(c, eye, p.q);
    setLog((l) => [...l, { eye, pos: p.label, q: p.q, text: `Fixation ${o.fixation}; patient ${o.report}.` }]);
  };
  const complete = (['R', 'L'] as Eye[]).every((e) => doc[e].reliable && (doc[e].reliable === 'unreliable' || QUADS.every((q) => doc[e].quads[q])));
  const submit = () => {
    const items: string[] = [];
    const mis: string[] = [];
    let ok = true;
    let relOk = true;
    for (const e of ['R', 'L'] as Eye[]) {
      const unreliable = c.fixationLoss.includes(e);
      if (unreliable !== (doc[e].reliable === 'unreliable')) {
        ok = false;
        relOk = false;
        items.push(unreliable ? `${EYE_WORD[e]} eye: fixation was not maintained (the eye moved toward your hand), so the result is unreliable — document that and re-instruct or use formal perimetry.` : `${EYE_WORD[e]} eye: fixation was steady; the result is interpretable.`);
      }
      if (!unreliable && doc[e].reliable === 'reliable') {
        const t = summarize(fieldDefect(c.truth)[e]);
        const wrong = QUADS.filter((q) => (doc[e].quads[q] === 'not seen') !== t.quads[q]);
        if (wrong.length) {
          ok = false;
          const mirrored = QUADS.every((q) => (doc[e].quads[q] === 'not seen') === t.quads[(q.endsWith('left') ? q.replace('left', 'right') : q.replace('right', 'left')) as QuadKey]);
          if (mirrored) mis.push('M-FIELD-VS-RETINA');
          items.push(`${EYE_WORD[e]} eye: ${wrong.map(quadName).join(', ')} documented incorrectly.${mirrored ? ' Your record is mirrored — your left hand tests the patient\'s right field.' : ''}`);
        }
      }
    }
    if (ok) items.push('Documentation matches what this examination could show. Finger confrontation is insensitive to small or central defects; it does not replace perimetry.');
    setFb({ ok, items });
    rec({ itemId: `LAB07-confront-${c.id}#${seed}`, familyId: 'F-CONFRONTATION', objectiveIds: ['FLD-COORD'], taskType: 'procedural-sequence', correct: ok, scores: { fixationInstructed: fixOk === true, reliabilityJudged: relOk }, response: { doc, log }, misconceptionIds: [...new Set(mis)], startedAt: start, hintLevel: guided ? 1 : 0, state: { caseId: c.id } });
    onDone?.();
  };
  return (
    <div className="grid cols-2">
      <div className="panel stack small">
        <p><b>{c.vignette}</b> You sit facing the patient at about 1 m, eyes level.</p>
        <div className="row"><span>1. Instruction for fixation:</span>
          <button className="btn sm" aria-pressed={fixOk === true} onClick={() => setFixOk(true)}>"Look at my opposite eye and keep looking"</button>
          <button className="btn sm" aria-pressed={fixOk === false} onClick={() => setFixOk(false)}>"Look at my fingers"</button>
        </div>
        {fixOk === false && <Feedback tone="bad" title="Fixation must stay central" items={['Looking at the fingers turns a peripheral test into a central one. Ask the patient to fixate your opposite eye.']} />}
        {fixOk && (
          <>
            <div className="row"><span>2. Cover the patient's</span><Seg label="Eye being tested" value={eye} onChange={setEye} options={[{ value: 'R', label: 'left eye → test RIGHT' }, { value: 'L', label: 'right eye → test LEFT' }]} /></div>
            <div><span>3. Present fingers midway between you, in each quadrant (positions are from YOUR side):</span>
              <div className="row" style={{ marginTop: 6 }}>{EX_POS.map((p) => <button key={p.label} className="btn sm" onClick={() => present(p)}>{p.label}</button>)}</div>
              {guided && <p className="tiny muted">Face to face, your left hand is in the patient's right field. {EX_POS.map((p) => `${p.label} → patient's ${quadName(p.q)} (${quadHalf(eye, p.q)})`).join('; ')}.</p>}
            </div>
            <table className="data" aria-label="Observation log">
              <thead><tr><th>Eye</th><th>Your hand</th><th>Observation</th></tr></thead>
              <tbody>{log.map((l, i) => <tr key={i}><td>{l.eye === 'R' ? 'OD' : 'OS'}</td><td>{l.pos}{guided && ` (${examinerHand(l.q)})`}</td><td>{l.text}</td></tr>)}</tbody>
            </table>
          </>
        )}
      </div>
      <div className="panel stack small">
        <h3>4. Document (patient's field coordinates)</h3>
        {(['L', 'R'] as Eye[]).map((e) => (
          <fieldset key={e} disabled={!tested(e) || !!fb} style={{ border: '1px solid var(--line)', borderRadius: 8 }}>
            <legend>{EYE_WORD[e]} eye {!tested(e) && <Pill tone="warn">test all four quadrants first</Pill>}</legend>
            <Seg label={`${EYE_WORD[e]} eye reliability`} value={doc[e].reliable as 'reliable'} onChange={(v) => setDoc({ ...doc, [e]: { ...doc[e], reliable: v } })} options={[{ value: 'reliable', label: 'Fixation held — interpretable' }, { value: 'unreliable', label: 'Fixation lost — unreliable' }]} />
            {doc[e].reliable === 'reliable' && (
              <div className="grid cols-2" style={{ marginTop: 6 }}>
                {QUADS.map((q) => (
                  <label key={q} className="field">
                    <span>{quadName(q)} ({quadHalf(e, q)})</span>
                    <select value={doc[e].quads[q]} onChange={(ev) => setDoc({ ...doc, [e]: { ...doc[e], quads: { ...doc[e].quads, [q]: ev.target.value as 'seen' } } })}>
                      <option value="">—</option><option value="seen">seen</option><option value="not seen">not seen</option>
                    </select>
                  </label>
                ))}
              </div>
            )}
          </fieldset>
        ))}
        {!fb ? <button className="btn primary" disabled={!complete} onClick={submit}>Submit documentation</button> : <Feedback tone={fb.ok ? 'good' : 'bad'} title={fb.ok ? 'Well documented' : 'Check the record'} items={fb.items} />}
        {guided && <p className="tiny muted">Reliability first: if the eye moves toward your hand, the "seen" answers are not evidence of an intact field.</p>}
      </div>
    </div>
  );
}

// ------------------------------------------------------------ Challenge: localize (hidden lesion) and perimetry report (T039)

function Localize({ lesion, rec, itemId, asReport }: { lesion: Lesion; rec: Rec; itemId: string; asReport?: boolean }) {
  const [start] = useState(now());
  const d = fieldDefect(lesion);
  const truth = new Set(localize(d).candidates.map(sideKey));
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [fb, setFb] = useState<{ ok: boolean; items: string[] } | null>(null);
  const pick = (site: Site, side: Eye | null) => {
    const k = sideKey({ site, side });
    const n = new Set(sel);
    if (n.has(k)) n.delete(k);
    else n.add(k);
    setSel(n);
  };
  const submit = () => {
    const missed = [...truth].filter((k) => !sel.has(k));
    const extra = [...sel].filter((k) => !truth.has(k));
    const lat = extra.some((k) => truth.has(k.replace(/\|R$/, '|X').replace(/\|L$/, '|R').replace(/\|X$/, '|L')));
    const ok = missed.length === 0 && extra.length === 0;
    const name = (k: string) => { const [s, sd] = k.split('|') as [Site, string]; return sd === '-' ? SITE_INFO[s].name : `${EYE_WORD[sd as Eye]} ${SITE_INFO[s].name}`; };
    const loc = localize(d);
    setFb({ ok, items: [`Pattern: ${classify(d).name}.`, `Consistent modelled sites: ${[...truth].map(name).join('; ')}.`, ...(missed.length ? [`Missed: ${missed.map(name).join('; ')}.`] : []), ...(extra.length ? [`Not consistent: ${extra.map(name).join('; ')}.`] : []), ...(lat ? ['Laterality: a retrochiasmal lesion causes loss in the OPPOSITE hemifield of both eyes.'] : []), loc.note] });
    rec({ itemId, familyId: 'F-FIELD-LOCALIZE', objectiveIds: ['FLD-LOCALIZE'], taskType: 'localize', correct: ok, scores: { missed: missed.length, extra: extra.length }, response: [...sel], misconceptionIds: lat ? ['M-FIELD-VS-RETINA'] : [], startedAt: start, state: { lesion } });
  };
  return (
    <div className="grid cols-2">
      <div className="stack">
        <FieldPair levels={{ R: levelsOf(d.R), L: levelsOf(d.L) }} caption={asReport ? 'Generic teaching plot (not an instrument printout) — patient view, left eye on the left.' : undefined} />
        <p className="small">Mark <b>every</b> modelled site that could produce this pattern (several may fit). Then submit.</p>
      </div>
      <div className="canvas-wrap stack">
        <Pathway marked={fb ? new Set([...sel, ...truth]) : sel} onPick={pick} disabled={!!fb} ariaPrefix="Mark candidate lesion sites" />
        {!fb ? <button className="btn primary" disabled={!sel.size} onClick={submit}>Submit localization ({sel.size} marked)</button> : <Feedback tone={fb.ok ? 'good' : 'bad'} title={fb.ok ? 'All consistent sites, none extra' : 'Check the localization'} items={fb.items} />}
      </div>
    </div>
  );
}

const PERI_OPTIONS = ['Left homonymous hemianopia with macular sparing', 'Left homonymous hemianopia', 'Right homonymous hemianopia', 'Bitemporal hemianopia', 'Left homonymous superior quadrantanopia', 'Right homonymous inferior quadrantanopia', ARTIFACT, REPEAT];

function Perimetry({ report, rec, seed }: { report: PerimetryReport; rec: Rec; seed: number }) {
  const [start] = useState(now());
  const [rel, setRel] = useState<'reliable' | 'unreliable' | ''>('');
  const [interp, setInterp] = useState('');
  const [fb, setFb] = useState<{ ok: boolean; items: string[] } | null>(null);
  const opts = PERI_OPTIONS.includes(report.answer) ? PERI_OPTIONS : [report.answer, ...PERI_OPTIONS];
  const submit = () => {
    const relOk = (rel === 'reliable') === report.reliable;
    const intOk = interp === report.answer;
    setFb({ ok: relOk && intOk, items: [relOk ? 'Reliability judged correctly.' : `Reliability: this report is ${report.reliable ? 'interpretable' : 'unreliable'} by its authored statements.`, intOk ? 'Interpretation correct.' : `Expected: ${report.answer}.`, report.explanation] });
    rec({ itemId: `LAB07-perimetry-${report.id}#${seed}`, familyId: 'F-FIELD-LOCALIZE', objectiveIds: ['FLD-LOCALIZE'], taskType: 'result-interpretation', correct: relOk && intOk, scores: { reliability: relOk, interpretation: intOk }, response: { rel, interp }, startedAt: start, state: { reportId: report.id } });
  };
  return (
    <div className="grid cols-2">
      <div className="stack">
        <FieldPair levels={report.levels} caption="GENERIC TEACHING PLOT — coarse grey-scale grid, not an instrument printout. No probability maps or normative database are modelled. Patient view, left eye on the left." />
      </div>
      <div className="panel stack small">
        <h3>Reliability (authored qualitative statements)</h3>
        <ul>{report.reliability.map((r) => <li key={r}>{r}</li>)}</ul>
        {report.technicianNote && <p><b>Technician note:</b> {report.technicianNote}</p>}
        <Seg label="Reliability judgement" value={rel as 'reliable'} onChange={setRel} options={[{ value: 'reliable', label: 'Interpretable' }, { value: 'unreliable', label: 'Unreliable' }]} />
        <label className="field"><span>Interpretation</span>
          <select value={interp} onChange={(e) => setInterp(e.target.value)} disabled={!rel || !!fb}>
            <option value="">— choose —</option>
            {opts.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </label>
        {!fb ? <button className="btn primary" disabled={!rel || !interp} onClick={submit}>Submit interpretation</button> : <Feedback tone={fb.ok ? 'good' : 'bad'} title={fb.ok ? 'Correct' : 'Review'} items={fb.items} />}
        <p className="tiny muted">No numeric reliability cutoffs are applied: real protocols differ by instrument and strategy.</p>
      </div>
    </div>
  );
}

// ------------------------------------------------------------ Patient case

function PatientCase({ seed, rec }: { seed: number; rec: Rec }) {
  const c = rng(seed).pick(CONFRONTATION_CASES);
  const [step, setStep] = useState(0);
  const lesion = c.truth!;
  const report = perimetryFromLesion(`case-${c.id}`, lesion, '');
  return (
    <div className="stack">
      <Seg label="Case step" value={String(step) as '0'} onChange={(v) => setStep(Number(v))} options={[{ value: '0', label: '1 · Confrontation' }, { value: '1', label: '2 · Formal field + localize' }]} />
      {step === 0 ? <Confrontation c={c} guided={false} rec={rec} seed={seed} /> : (
        <>
          <p className="small">Automated static perimetry was then performed. {report.reliability.join(' ')}</p>
          <Localize lesion={lesion} rec={rec} itemId={`LAB07-case-${c.id}#${seed}`} asReport />
        </>
      )}
    </div>
  );
}

// ------------------------------------------------------------ studio shell

export function Lab07() {
  const { recordAttempt } = useApp();
  const [mode, setMode] = useState<Mode>('explore');
  const [gTask, setGTask] = useState<'predict' | 'coords' | 'confront'>('predict');
  const [cTask, setCTask] = useState<'localize' | 'perimetry'>('localize');
  const [seed, setSeed] = useState(newSeed());
  const [resetN, setResetN] = useState(0);
  const rec: Rec = (a) => void recordAttempt({ itemVersion: 1, lectureIds: LECTURES, seed, mode: 'learning', confidence: null, hintLevel: 0, misconceptionIds: [], ...a });
  const key = `${mode}-${gTask}-${cTask}-${seed}-${resetN}`;
  const hidden = ALL_LESIONS.filter((l) => l.site !== 'optic-nerve' || l.variant === 'complete');
  return (
    <div className="stack">
      <h1>LAB07 · Visual fields and pathway localization</h1>
      <p className="small muted">Conceptual schematic (teaching-level localization, source K3) · draft · not clinically reviewed. Field coordinates (patient view) are kept separate from retinal coordinates; no map is produced by mirroring the screen.</p>
      <div className="row">
        <Seg label="Mode" value={mode} onChange={setMode} options={[{ value: 'explore', label: 'Explore' }, { value: 'guided', label: 'Guided practice' }, { value: 'challenge', label: 'Independent challenge' }, { value: 'case', label: 'Patient case' }]} />
        <label className="row small">Seed <input type="text" inputMode="numeric" className="num" style={{ width: 120 }} value={seed} onChange={(e) => /^\d{0,10}$/.test(e.target.value) && setSeed(Number(e.target.value))} aria-label="Variant seed" /></label>
        <button className="btn sm" onClick={() => setSeed(newSeed())}>New variant</button>
        <button className="btn sm" onClick={() => setResetN((n) => n + 1)}>Reset</button>
      </div>
      {mode === 'guided' && <Seg label="Guided task" value={gTask} onChange={setGTask} options={[{ value: 'predict', label: 'Predict the field from a lesion' }, { value: 'coords', label: 'Field ↔ retina' }, { value: 'confront', label: 'Confrontation (T037)' }]} />}
      {mode === 'challenge' && <Seg label="Challenge task" value={cTask} onChange={setCTask} options={[{ value: 'localize', label: 'Localize a hidden lesion' }, { value: 'perimetry', label: 'Static perimetry report (T039)' }]} />}
      <div key={key}>
        {mode === 'explore' && <Explore />}
        {mode === 'guided' && gTask === 'predict' && <Predict seed={seed} rec={rec} />}
        {mode === 'guided' && gTask === 'coords' && <CoordQuiz seed={seed} rec={rec} />}
        {mode === 'guided' && gTask === 'confront' && <Confrontation c={rng(seed).pick(CONFRONTATION_CASES)} guided rec={rec} seed={seed} />}
        {mode === 'challenge' && cTask === 'localize' && <Localize lesion={rng(seed).pick(hidden)} rec={rec} itemId={`LAB07-localize#${seed}`} />}
        {mode === 'challenge' && cTask === 'perimetry' && <Perimetry report={rng(seed).pick(PERIMETRY_REPORTS)} rec={rec} seed={seed} />}
        {mode === 'case' && <PatientCase seed={seed} rec={rec} />}
      </div>
      <div className="panel small">
        <b>Planned / not modelled:</b> <Pill>T038 Kinetic perimetry — planned</Pill> <Pill>T040 Tangent screen / central-field mapping — planned</Pill>
        <p className="tiny muted" style={{ margin: '6px 0 0' }}>The coarse 6° grid cannot show congruity, wedge shapes, sectoranopias, the physiological blind spot or threshold values. Patterns are schematic teaching relationships, not rules for every patient.</p>
      </div>
    </div>
  );
}
