import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../app/context';
import { href } from '../app/router';
import {
  CLASS_LATIN, LECTURE_EXAMPLES, PRESBYOPIA_EXAMPLES, diagnosePair, generateExercise, gradePair, parseVisusBlock, parseVisusLine,
  type DgExercise, type PairGrade, type TokenKind,
} from '../domain/diagnosis';
import { type RefractiveClass } from '../domain/optics';
import { newSeed } from '../domain/random';
import { now } from '../lib/store';
import { Feedback, Seg } from '../ui/kit';
import { AnnotatedLine, ClassRuleTable, DerivationPlayer, NearPanel, OrientationDial, PowerCross, TokenExplain, TokenLegend } from './DgViews';
import { DgExerciseCard, toPairAnswer, type DgExamAnswer } from './ExerciseCard';

type Tab = 'learn' | 'examples' | 'practice' | 'exam' | 'sheet';
const TABS: { value: Tab; label: string }[] = [
  { value: 'learn', label: '1 · Learn' },
  { value: 'examples', label: '2 · Lecture examples' },
  { value: 'practice', label: '3 · Practice' },
  { value: 'exam', label: '4 · Exam' },
  { value: 'sheet', label: 'Cheat sheet' },
];

export function DiagnosisPage({ tab }: { tab?: string }) {
  const t = (TABS.find((x) => x.value === tab)?.value ?? 'learn') as Tab;
  return (
    <div className="stack dg-page">
      <div>
        <h1 style={{ marginBottom: 4 }}>Write a diagnosis from VOD / VOS</h1>
        <p className="muted" style={{ margin: 0 }}>
          From a line like <span className="num">VOD: sc 0.5, cc −1.00 dsph 1.0 Dg?</span> to a correct written diagnosis — step by step.
        </p>
      </div>
      <Seg label="Section" value={t} onChange={(v) => (location.hash = href(`dg/${v}`))} options={TABS} />
      {t === 'learn' && <Learn />}
      {t === 'examples' && <Examples />}
      {t === 'practice' && <Practice />}
      {t === 'exam' && <Exam />}
      {t === 'sheet' && <Sheet />}
      <p className="tiny muted">Teaching convention: the “cc” lens that gives the stated vision is treated as the full distance correction. Latin names follow common Central/South-East European usage; check your professor’s exact wording. Draft content, not clinically reviewed.</p>
    </div>
  );
}

// ------------------------------------------------------------------ 1 · Learn

const LESSONS = ['What a line says', 'Find each part', 'The one naming rule', 'Rectus or inversus?', 'Presbyopia', 'How to write it', 'Watch a full solution'];

function Learn() {
  const [k, setK] = useState(0);
  return (
    <div className="grid learn-grid">
      <nav className="lesson-nav" aria-label="Lessons">
        {LESSONS.map((l, i) => (
          <button key={l} className={`lesson-btn ${i === k ? 'on' : ''}`} onClick={() => setK(i)} aria-current={i === k ? 'step' : undefined}>
            <span className="num-badge">{i + 1}</span> {l}
          </button>
        ))}
      </nav>
      <div className="panel stack lesson-body" key={k}>
        <div className="fade-up stack">
          {k === 0 && <LessonLine />}
          {k === 1 && <FindIt />}
          {k === 2 && <LessonRule />}
          {k === 3 && <LessonOrientation />}
          {k === 4 && <LessonPresbyopia />}
          {k === 5 && <LessonWrite />}
          {k === 6 && <LessonWatch />}
        </div>
        <div className="row" style={{ justifyContent: 'space-between', marginTop: 8 }}>
          <button className="btn" disabled={k === 0} onClick={() => setK(k - 1)}>
            ◀ Back
          </button>
          {k < LESSONS.length - 1 ? (
            <button className="btn primary" onClick={() => setK(k + 1)} data-testid="lesson-next">
              Next: {LESSONS[k + 1]} ▶
            </button>
          ) : (
            <a className="btn primary" href={href('dg/examples')}>
              Try the lecture examples ▶
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function LessonLine() {
  const line = useMemo(() => parseVisusLine('VOS: sc 0.7, cc -0.50 dsph -1.00 dcyl ax 170 1.0 Dg?'), []);
  const [sel, setSel] = useState<number | null>(0);
  return (
    <>
      <h2>Every line is a tiny story about one eye</h2>
      <p>Click each coloured part. The explanation appears below.</p>
      <AnnotatedLine line={line} big selected={sel} onSelect={setSel} />
      <TokenLegend />
      <TokenExplain line={line} index={sel} />
      <div className="story">
        <div><b>1.</b> Which eye?</div>
        <div><b>2.</b> How well without glasses?</div>
        <div><b>3.</b> Which lens fixes it?</div>
        <div><b>4.</b> How well with that lens?</div>
        <div><b>5.</b> Name it (Dg).</div>
      </div>
    </>
  );
}

const FIND: { kind: TokenKind; ask: string }[] = [
  { kind: 'eye', ask: 'Which part tells you WHICH eye?' },
  { kind: 'va-sc', ask: 'Which number is the vision WITHOUT glasses?' },
  { kind: 'sph-power', ask: 'Which number is the SPHERE power?' },
  { kind: 'cyl-power', ask: 'Which number is the CYLINDER power?' },
  { kind: 'axis-value', ask: 'Which number is the AXIS (where the cylinder has no power)?' },
  { kind: 'va-cc', ask: 'Which number is the vision WITH the lens?' },
  { kind: 'dg', ask: 'Which part asks you to write the diagnosis?' },
];

function FindIt() {
  const line = useMemo(() => parseVisusLine('VOD: sc 0.4, cc +1.00 dsph -2.00 dcyl ax 90 1.0 Dg?'), []);
  const [q, setQ] = useState(0);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [score, setScore] = useState(0);
  const done = q >= FIND.length;
  return (
    <>
      <h2>Find each part</h2>
      {!done ? (
        <>
          <p style={{ fontSize: '1.1rem' }} data-testid="findit-q">
            <b>
              {q + 1}/{FIND.length}:
            </b>{' '}
            {FIND[q].ask}
          </p>
          <AnnotatedLine
            line={line}
            big
            onSelect={(i) => {
              if (i === null) return;
              const ok = line.tokens[i].kind === FIND[q].kind;
              setMsg({ ok, text: ok ? 'Yes!' : `That is “${line.tokens[i].text}” — try again.` });
              if (ok) {
                setScore(score + 1);
                setTimeout(() => {
                  setMsg(null);
                  setQ((x) => x + 1);
                }, 650);
              }
            }}
          />
          {msg && <div className={`feedback ${msg.ok ? 'good' : 'bad'} pop`}>{msg.text}</div>}
        </>
      ) : (
        <Feedback tone="good" title={`All ${FIND.length} found.`} items={['You can read every part of a line. Next: the one rule that names it.']} />
      )}
      <button className="btn sm ghost" onClick={() => { setQ(0); setScore(0); setMsg(null); }}>
        Start again
      </button>
      <span className="tiny muted">{score} found</span>
    </>
  );
}

const RULE_EXAMPLE: Record<RefractiveClass, string> = {
  emmetropic: 'VOD: sc 1.0',
  'spherical-myopia': 'VOD: sc 0.5, cc -1.00 dsph 1.0',
  'spherical-hyperopia': 'VOS: sc 0.5, cc +4.00 dsph 1.0',
  'simple-myopic-astigmatism': 'VOS: sc 0.3, cc -1.00 dcyl ax 180 1.0',
  'compound-myopic-astigmatism': 'VOS: sc 0.7, cc -0.50 dsph -1.00 dcyl ax 170 1.0',
  'simple-hyperopic-astigmatism': 'VOS: sc 0.8, cc +1.00 dcyl ax 180 1.0',
  'compound-hyperopic-astigmatism': 'VOD: sc 0.5, cc +1.00 dsph +1.00 dcyl ax 180 1.0',
  'mixed-astigmatism': 'VOS: sc 0.6, cc -0.50 dsph +1.00 dcyl ax 180 1.0',
};

function LessonRule() {
  const [c, setC] = useState<RefractiveClass>('simple-myopic-astigmatism');
  const line = parseVisusLine(RULE_EXAMPLE[c]);
  return (
    <>
      <h2>One rule names everything</h2>
      <p>
        A lens has a power in two main directions (the <b>power cross</b>). At the axis only the sphere acts; 90° away it is sphere + cylinder. <b>Look only at the signs</b> of those two numbers. Click a row.
      </p>
      <div className="grid cols-2" style={{ alignItems: 'center' }}>
        <ClassRuleTable active={c} onPick={setC} />
        <div className="canvas-wrap stack" style={{ gap: 6 }}>
          <AnnotatedLine line={line} disabled />
          {line.cc ? <PowerCross lens={line.cc.lens} /> : <p className="small">No lens needed: vision 1.0 without glasses.</p>}
          <b className="num">→ {CLASS_LATIN[c]}</b>
        </div>
      </div>
      <p className="small muted">Simplex = one direction is already 0. Compositus = both directions have the same sign. Mixtus = the signs differ.</p>
    </>
  );
}

function LessonOrientation() {
  const [ax, setAx] = useState(180);
  const [plus, setPlus] = useState(true);
  const o = ax <= 30 || ax >= 150 ? 'rectus' : ax >= 60 && ax <= 120 ? 'inversus' : 'obliquus';
  return (
    <>
      <h2>Rectus or inversus? Use the minus-cylinder axis</h2>
      <p>Move the minus-cylinder axis. Near 180° = <b>rectus</b> (with the rule). Near 90° = <b>inversus</b> (against the rule). In between = <b>obliquus</b>.</p>
      <div className="grid cols-2" style={{ alignItems: 'center' }}>
        <OrientationDial minusAxisDeg={ax} orientation={o} />
        <label className="field">
          <span>Minus-cylinder axis: {ax}°</span>
          <input type="range" min={1} max={180} value={ax} onChange={(e) => setAx(Number(e.target.value))} aria-label="Minus cylinder axis" />
        </label>
      </div>
      <div className="feedback warn">
        <b>The trap from the lecture:</b> “+1.00 dcyl ax 180” is written as a PLUS cylinder. Rewrite it first:
        <div className="row" style={{ marginTop: 6 }}>
          <button className="btn sm" onClick={() => setPlus(!plus)} data-testid="flip-trap">
            Show {plus ? 'minus' : 'plus'}-cylinder form
          </button>
          <span className="num flip" key={String(plus)}>
            {plus ? '+1.00 dcyl ax 180' : '+1.00 dsph −1.00 dcyl ax 90'}
          </span>
        </div>
        <p style={{ margin: '6px 0 0' }}>Same lens. The minus-cylinder axis is 90° → <b>inversus</b>, not rectus. Rule: new sphere = sphere + cylinder, cylinder changes sign, axis turns 90°.</p>
      </div>
    </>
  );
}

function LessonPresbyopia() {
  const ex = PRESBYOPIA_EXAMPLES[1];
  const lines = ex.lines.map(parseVisusLine);
  const pd = diagnosePair(lines);
  const trap = diagnosePair(PRESBYOPIA_EXAMPLES[3].lines.map(parseVisusLine));
  return (
    <>
      <h2>Presbyopia: when reading needs extra plus</h2>
      <p>
        With age the lens inside the eye stiffens and focusing for near (accommodation) weakens. The record then shows an <b>Add</b> (extra plus for reading) or a separate <b>za blizu / near</b> lens.
      </p>
      <div className="stack" style={{ gap: 4 }}>
        {lines.map((l, i) => (
          <AnnotatedLine key={i} line={l} disabled />
        ))}
      </div>
      <NearPanel addD={pd.presbyopia.addD!} ageY={pd.presbyopia.ageY} rows={pd.presbyopia.nearLenses.map((n) => ({ eye: n.eye, near: n.lens, distance: lines.find((l) => l.role === 'distance' && l.eye === n.eye)?.cc?.lens ?? null }))} />
      <div className="model-answer">
        <span className="tiny muted">Write</span>
        <div className="num">{pd.sentence}</div>
      </div>
      <ul className="small">
        <li>Presbyopia is written <b>in addition</b> to the distance diagnosis — a myope or hyperope can be presbyopic too.</li>
        <li>Write it only when a near addition was needed. Age alone is not enough.</li>
        <li>
          Trap: <span className="num">{PRESBYOPIA_EXAMPLES[3].lines.join(' · ')}</span> → <b className="num">{trap.sentence}</b> — no presbyopia, because no near data are given.
        </li>
      </ul>
    </>
  );
}

function LessonWrite() {
  return (
    <>
      <h2>How to write it</h2>
      <div className="write-card num">
        <div>Dg: <b>[name]</b> <i>[rectus / inversus / obliquus]</i> <b>OD</b>; <b>[name]</b> <b>OS</b></div>
        <div className="tiny muted">same name in both eyes → write it once with OU</div>
        <div>…; Anisometropia <span className="tiny muted">(if the eyes differ a lot)</span></div>
        <div>…; Presbyopia <span className="tiny muted">(if a near addition was needed)</span></div>
      </div>
      <h3>Examples</h3>
      <ul className="num small">
        <li>Dg: Myopia OD; Astigmatismus myopicus simplex rectus OS</li>
        <li>Dg: Hypermetropia OU; Anisometropia</li>
        <li>Dg: Astigmatismus mixtus inversus OS</li>
        <li>Dg: Myopia OU; Presbyopia</li>
      </ul>
      <h3>Common mistakes</h3>
      <ul className="small">
        <li>Calling any cylinder “myopic” because the sphere is minus — check BOTH directions.</li>
        <li>Forgetting the eye label, or swapping OD and OS.</li>
        <li>Reading “ax 180” as the direction of the power (the power is 90° away).</li>
        <li>Judging rectus/inversus from a plus cylinder without converting it.</li>
        <li>Writing presbyopia from age alone; ignoring corrected vision below 1.0.</li>
      </ul>
    </>
  );
}

function LessonWatch() {
  const line = useMemo(() => parseVisusLine(LECTURE_EXAMPLES[7].lines[1]), []);
  return (
    <>
      <h2>Watch a full solution</h2>
      <p>Lecture example 8, left eye. Press <b>Play all</b> or step through it.</p>
      <DerivationPlayer line={line} />
    </>
  );
}

// ------------------------------------------------------------------ 2 · Lecture examples

function Examples() {
  const all = [...LECTURE_EXAMPLES, ...PRESBYOPIA_EXAMPLES];
  const [i, setI] = useState(0);
  const { attempts } = useApp();
  const done = (id: string) => attempts.some((a) => a.itemId === id && a.correct);
  return (
    <div className="grid examples-grid">
      <nav className="lesson-nav" aria-label="Examples">
        <div className="tiny muted">From your lecture</div>
        {all.map((e, k) => (
          <button key={e.id} className={`lesson-btn ${k === i ? 'on' : ''}`} onClick={() => setI(k)} data-testid={`ex-${e.id}`}>
            <span className="num-badge">{done(e.id) ? '✓' : k < 8 ? k + 1 : 'P' + (k - 7)}</span>
            <span className="num tiny">{e.lines.filter((l) => /^V/i.test(l))[0]?.slice(0, 22)}…</span>
          </button>
        )).flatMap((b, k) => (k === 8 ? [<div key="sep" className="tiny muted" style={{ marginTop: 8 }}>Presbyopia (app-written)</div>, b] : [b]))}
      </nav>
      <div>
        <DgExerciseCard key={all[i].id} exercise={all[i]} mode="learn" onNext={i < all.length - 1 ? () => setI(i + 1) : undefined} />
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ 3 · Practice

type Focus = RefractiveClass | 'any' | 'presbyopia';
const FOCI: { value: Focus; label: string }[] = [
  { value: 'any', label: 'Everything mixed' },
  { value: 'spherical-myopia', label: 'Myopia' },
  { value: 'spherical-hyperopia', label: 'Hypermetropia' },
  { value: 'simple-myopic-astigmatism', label: 'Astig. myopicus simplex' },
  { value: 'compound-myopic-astigmatism', label: 'Astig. myopicus compositus' },
  { value: 'simple-hyperopic-astigmatism', label: 'Astig. hyperm. simplex' },
  { value: 'compound-hyperopic-astigmatism', label: 'Astig. hyperm. compositus' },
  { value: 'mixed-astigmatism', label: 'Astig. mixtus' },
  { value: 'presbyopia', label: 'Presbyopia' },
];

export function makeExercise(seed: number, focus: Focus): DgExercise {
  if (focus !== 'presbyopia') return generateExercise(seed, focus);
  for (let s = seed; s < seed + 200; s++) {
    const ex = generateExercise(s);
    if (diagnosePair(ex.lines.map(parseVisusLine)).presbyopia.status !== 'no') return { ...ex, familyId: 'F-DG-presbyopia' };
  }
  return generateExercise(seed);
}

function Practice() {
  const [focus, setFocus] = useState<Focus>('any');
  const [seed, setSeed] = useState(newSeed());
  const [style, setStyle] = useState<'build' | 'write'>('build');
  const [tally, setTally] = useState({ n: 0, ok: 0 });
  const ex = useMemo(() => makeExercise(seed, focus), [seed, focus]);
  return (
    <div className="stack">
      <div className="panel stack" style={{ padding: 12 }}>
        <div className="row">
          <b className="small">Focus:</b>
          <div className="chips">
            {FOCI.map((f) => (
              <button key={f.value} className={`chip ${focus === f.value ? 'on' : ''}`} aria-pressed={focus === f.value} onClick={() => { setFocus(f.value); setSeed(newSeed()); }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="row small">
          <Seg label="Default answer style" value={style} onChange={setStyle} options={[{ value: 'build', label: 'Build it (easier)' }, { value: 'write', label: 'Write it (exam style)' }]} />
          <span className="muted">
            This session: {tally.ok}/{tally.n} correct · unlimited new cases
          </span>
        </div>
      </div>
      <DgExerciseCard key={ex.id + style} exercise={ex} mode="practice" defaultInput={style} onGraded={(g) => setTally((t) => ({ n: t.n + 1, ok: t.ok + (g.correct ? 1 : 0) }))} onNext={() => setSeed(newSeed())} />
    </div>
  );
}

// ------------------------------------------------------------------ 4 · Exam

interface DgExamState {
  id: string;
  createdAt: number;
  seeds: number[];
  answers: Record<number, DgExamAnswer>;
  current: number;
  timed: boolean;
  minutes: number;
  elapsedMs: number;
  submitted: boolean;
}
const EXAM_KEY = 'mission:dg-exam';

function Exam() {
  const { repo, profile, recordAttempt } = useApp();
  const [st, setSt] = useState<DgExamState | null | undefined>(undefined);
  const [count, setCount] = useState(10);
  const [timed, setTimed] = useState(false);
  const [minutes, setMinutes] = useState(15);
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => {
    if (profile) repo.getKV<DgExamState>(profile.id, EXAM_KEY).then((s) => setSt(s ?? null));
  }, [profile, repo]);
  const save = async (s: DgExamState | null) => {
    setSt(s);
    if (profile) await repo.setKV(profile.id, EXAM_KEY, s);
  };
  useEffect(() => {
    if (!st || st.submitted) return;
    const t = setInterval(() => setSt((o) => (o ? { ...o, elapsedMs: o.elapsedMs + 1000 } : o)), 1000);
    return () => clearInterval(t);
  }, [st?.id, st?.submitted]);
  const exercises = useMemo(() => (st ? st.seeds.map((s, i) => ({ ...makeExercise(s, i % 5 === 4 ? 'presbyopia' : 'any'), id: `DGX-${st.id}-${i}` })) : []), [st?.id]);
  if (st === undefined) return <p>Loading…</p>;
  if (!st)
    return (
      <div className="panel stack" style={{ maxWidth: 560 }}>
        <h2>Mock exam</h2>
        <p>New, unseen cases. You write the diagnosis for each pair; the answers are shown only after you hand in.</p>
        <div className="row">
          <span>Number of cases:</span>
          <Seg label="Number of cases" value={String(count) as '5' | '10' | '20'} onChange={(v) => setCount(Number(v))} options={[{ value: '5', label: '5' }, { value: '10', label: '10' }, { value: '20', label: '20' }]} />
        </div>
        <label className="row small">
          <input type="checkbox" checked={timed} onChange={(e) => setTimed(e.target.checked)} /> Show a timer ({minutes} min — no automatic penalty)
        </label>
        {timed && <input type="range" min={5} max={60} step={5} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} aria-label="Minutes" />}
        <button className="btn primary" data-testid="dg-exam-start" onClick={() => save({ id: String(now()), createdAt: now(), seeds: Array.from({ length: count }, () => newSeed()), answers: {}, current: 0, timed, minutes, elapsedMs: 0, submitted: false })}>
          Start exam
        </button>
      </div>
    );
  const grades: (PairGrade | null)[] = exercises.map((ex, i) => (st.answers[i] ? gradePair(diagnosePair(ex.lines.map(parseVisusLine)), toPairAnswer(st.answers[i])) : null));
  if (st.submitted) {
    const score = grades.filter((g) => g?.correct).length;
    return (
      <div className="stack" data-testid="dg-exam-results">
        <div className="panel">
          <h2>
            Result: {score}/{exercises.length}
          </h2>
          <p className="small muted">Fully correct = every eye named right, corrected vision &lt; 1.0 noted where needed, anisometropia and presbyopia handled. Direction (rectus/inversus) is shown but not required.</p>
          <button className="btn" onClick={() => save(null)}>
            New exam
          </button>
        </div>
        <table className="data panel">
          <tbody>
            {exercises.map((ex, i) => (
              <tr key={ex.id}>
                <td>{i + 1}</td>
                <td className="num small">{ex.lines.join(' · ')}</td>
                <td>{grades[i]?.correct ? '✓' : grades[i] ? '✗' : 'blank'}</td>
                <td>
                  <button className="btn sm" onClick={() => setOpen(open === i ? null : i)}>
                    {open === i ? 'Hide' : 'Review'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {open !== null && <ExamReview ex={exercises[open]} grade={grades[open]} answer={st.answers[open]} />}
      </div>
    );
  }
  const left = st.timed ? st.minutes * 60000 - st.elapsedMs : null;
  const answered = Object.keys(st.answers).length;
  return (
    <div className="stack" data-testid="dg-exam">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <b>
          Case {st.current + 1} of {exercises.length} · {answered} answered
        </b>
        {left !== null && <span className={`pill ${left < 0 ? 'bad' : ''}`}>{left < 0 ? 'time is up' : `${Math.ceil(left / 60000)} min left`}</span>}
      </div>
      <div className="tutorial-progress">
        {exercises.map((_, i) => (
          <button key={i} className={i === st.current ? 'current' : st.answers[i] ? 'done' : ''} onClick={() => save({ ...st, current: i })} aria-label={`Case ${i + 1}`} />
        ))}
      </div>
      <DgExerciseCard key={exercises[st.current].id} number={st.current + 1} exercise={exercises[st.current]} mode="exam" defaultInput="write" examAnswer={st.answers[st.current] ?? null} onExamAnswer={(a) => save({ ...st, answers: { ...st.answers, [st.current]: a } })} />
      <div className="row">
        <button className="btn" disabled={st.current === 0} onClick={() => save({ ...st, current: st.current - 1 })}>
          ◀ Previous
        </button>
        <button className="btn" disabled={st.current >= exercises.length - 1} onClick={() => save({ ...st, current: st.current + 1 })}>
          Next ▶
        </button>
        <span style={{ flex: 1 }} />
        <button
          className="btn primary"
          data-testid="dg-exam-submit"
          onClick={async () => {
            if (!confirm(`Hand in? ${exercises.length - answered} case(s) unanswered.`)) return;
            for (let i = 0; i < exercises.length; i++) {
              const g = grades[i];
              await recordAttempt({ id: `${st.id}:${i}`, itemId: exercises[i].id, itemVersion: 1, familyId: exercises[i].familyId, objectiveIds: ['DG-WRITE'], lectureIds: ['L04', 'L05', 'L36'], seed: st.seeds[i], taskType: 'dg-exam', mode: 'exam', response: st.answers[i] ?? null, correct: !!g?.correct, scores: { answered: !!g }, confidence: null, hintLevel: 0, misconceptionIds: g ? [...new Set(g.eyes.flatMap((e) => e.misconceptionIds))] : [], startedAt: st.createdAt, isTransfer: true, state: { lines: exercises[i].lines } });
            }
            save({ ...st, submitted: true });
          }}
        >
          Hand in
        </button>
      </div>
    </div>
  );
}

function ExamReview({ ex, grade, answer }: { ex: DgExercise; grade: PairGrade | null; answer?: DgExamAnswer }) {
  const lines = ex.lines.map(parseVisusLine);
  const distance = lines.filter((l) => l.role === 'distance');
  return (
    <div className="panel stack">
      {lines.map((l, i) => (
        <AnnotatedLine key={i} line={l} big disabled />
      ))}
      <div className="small">
        <b>You wrote:</b> <span className="num">{answer ? (answer.inputMode === 'write' ? answer.text : '(built answer)') : '—'}</span>
      </div>
      <div className="model-answer">
        <span className="tiny muted">Model answer</span>
        <div className="num">{diagnosePair(lines).sentence}</div>
      </div>
      {grade && (
        <ul className="small">
          {grade.eyes.flatMap((e) => e.feedback).map((f) => (
            <li key={f}>{f}</li>
          ))}
          {grade.presbyopiaFeedback && <li>{grade.presbyopiaFeedback}</li>}
        </ul>
      )}
      {distance.map((l, i) => (
        <DerivationPlayer key={i} line={l} />
      ))}
    </div>
  );
}

// ------------------------------------------------------------------ Cheat sheet + check any line

function Sheet() {
  const [text, setText] = useState('VOD: sc 0.6, cc -1.50 dcyl ax 170 1.0\nVOS: sc 0.6, cc -0.50 dsph +1.00 dcyl ax 180 1.0');
  const lines = parseVisusBlock(text);
  const pd = lines.length ? diagnosePair(lines) : null;
  return (
    <div className="grid cols-2" style={{ alignItems: 'start' }}>
      <div className="panel stack sheet">
        <h2>Cheat sheet</h2>
        <table className="data small">
          <tbody>
            <tr><td className="num">VOD / VOS / VOU</td><td>vision of the right / left / both eyes</td></tr>
            <tr><td className="num">sc</td><td>sine correctione — without glasses</td></tr>
            <tr><td className="num">cc</td><td>cum correctione — with this lens</td></tr>
            <tr><td className="num">dsph</td><td>sphere: same power in every direction</td></tr>
            <tr><td className="num">dcyl ax …</td><td>cylinder: power 90° AWAY from the axis</td></tr>
            <tr><td className="num">Add / za blizu</td><td>extra plus for reading → presbyopia</td></tr>
            <tr><td className="num">1.0</td><td>normal vision (6/6)</td></tr>
          </tbody>
        </table>
        <ol className="small">
          <li>Find the power in the two main directions: sphere, and sphere + cylinder.</li>
          <li>Look at the two signs → name (table below).</li>
          <li>Astigmatism: convert to minus cylinder; axis near 180 = rectus, near 90 = inversus.</li>
          <li>Vision with lens below 1.0 → write it, further examination.</li>
          <li>Big difference between eyes → Anisometropia. Near addition → Presbyopia.</li>
        </ol>
        <ClassRuleTable />
        <button className="btn sm" onClick={() => print()}>
          Print
        </button>
      </div>
      <div className="panel stack">
        <h2>Check any line</h2>
        <p className="small">Paste lines from your notes (one per line). You get the parsed meaning, the model answer and the full solution.</p>
        <textarea aria-label="Lines to check" value={text} onChange={(e) => setText(e.target.value)} style={{ minHeight: 110 }} className="num" data-testid="checker-input" />
        {lines.map((l, i) => (
          <div key={i} className="stack" style={{ gap: 2 }}>
            <AnnotatedLine line={l} disabled />
            {l.errors.length > 0 && <span className="tiny" style={{ color: 'var(--bad)' }}>{l.errors.join(' ')}</span>}
            {l.warnings.length > 0 && <span className="tiny" style={{ color: 'var(--warn)' }}>{l.warnings.join(' ')}</span>}
          </div>
        ))}
        {pd && (
          <div className="model-answer" data-testid="checker-answer">
            <span className="tiny muted">Model answer</span>
            <div className="num">{pd.sentence}</div>
          </div>
        )}
        {pd?.notes.map((n) => (
          <p key={n} className="small" style={{ margin: 0 }}>
            {n}
          </p>
        ))}
        {lines.filter((l) => l.role === 'distance' && !l.errors.length).map((l, i) => (
          <DerivationPlayer key={l.raw + i} line={l} />
        ))}
      </div>
    </div>
  );
}

