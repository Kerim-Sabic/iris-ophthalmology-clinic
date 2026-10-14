import { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../app/context';
import { go, href } from '../app/router';
import { ALL_ITEMS, LECTURES } from '../content/lectures';
import { planExam } from '../domain/exam';
import type { ExamSession } from '../domain/learning';
import { FAMILIES, familyById, type TaskResponse } from '../domain/missions';
import { newSeed, uid } from '../domain/random';
import { TaskRunner } from '../lab/TaskRunner';
import { now } from '../lib/store';
import { Feedback, Pill } from '../ui/kit';
import { McqRunner } from '../ui/Mcq';

const opticsPool = FAMILIES.map((f) => ({ id: f.id, pool: f.pool, lectureIds: f.make(1).lectureIds }));

export function ExamRoom({ id }: { id?: string }) {
  if (id) return <ExamSessionView id={id} />;
  return <ExamSetup />;
}

function ExamSetup() {
  const { plan, attempts, flags, repo, profile } = useApp();
  const included = plan ? Object.entries(plan.lectures).filter(([, s]) => s === 'included').map(([k]) => k) : [];
  const [lectures, setLectures] = useState<string[]>(included);
  const [count, setCount] = useState(10);
  const [timed, setTimed] = useState(false);
  const [minutes, setMinutes] = useState(20);
  const [allowPracticed, setAllowPracticed] = useState(false);
  const [seed] = useState(newSeed());
  const [exams, setExams] = useState<ExamSession[]>([]);
  useEffect(() => {
    if (profile) repo.exams(profile.id).then(setExams);
  }, [repo, profile]);
  const settings = { lectureIds: lectures, count, timed, minutes: timed ? minutes : null, allowPracticedFamilies: allowPracticed, seed };
  const p = planExam(settings, ALL_ITEMS, opticsPool, attempts, flags.map((f) => f.itemId));
  const create = async () => {
    if (!profile || !p.items.length) return;
    const e: ExamSession = { id: uid(), profileId: profile.id, createdAt: now(), settings, items: p.items, responses: {}, currentIndex: 0, status: 'in-progress', submittedAt: null, elapsedMs: 0, poolWarning: p.warning };
    await repo.saveExam(e);
    go(`exam/${e.id}`);
  };
  return (
    <div className="stack">
      <h1>Exam Room</h1>
      <p className="small muted">Mock exams draw only from held-out exam families (different task structures from practice). Feedback is withheld until you submit. This is a self-study tool, not tamper-resistant proctoring.</p>
      <div className="grid cols-2" style={{ alignItems: 'start' }}>
        <div className="panel stack">
          <h2>New mock exam</h2>
          <div>
            <div className="small muted">Lectures ({lectures.length} selected{plan ? `; scope v${plan.scopeVersion}` : ''})</div>
            <div className="row" style={{ maxHeight: 180, overflow: 'auto', border: '1px solid var(--line)', borderRadius: 8, padding: 6 }}>
              {LECTURES.map((l) => (
                <label key={l.id} className="small" style={{ width: 70 }} title={l.title}>
                  <input type="checkbox" checked={lectures.includes(l.id)} onChange={(e) => setLectures(e.target.checked ? [...lectures, l.id] : lectures.filter((x) => x !== l.id))} /> {l.id}
                </label>
              ))}
            </div>
            <div className="row" style={{ marginTop: 6 }}>
              <button className="btn sm" onClick={() => setLectures(included)}>Use my scope</button>
              <button className="btn sm" onClick={() => setLectures([])}>None</button>
            </div>
          </div>
          <label className="field">
            <span>Number of items</span>
            <input type="number" min={1} max={60} value={count} onChange={(e) => setCount(Math.max(1, Math.min(60, Number(e.target.value) || 1)))} />
          </label>
          <label className="row small">
            <input type="checkbox" checked={timed} onChange={(e) => setTimed(e.target.checked)} /> Timed (the timer pauses if you leave; no penalty is applied automatically)
          </label>
          {timed && (
            <label className="field">
              <span>Minutes</span>
              <input type="number" min={5} max={180} value={minutes} onChange={(e) => setMinutes(Number(e.target.value) || 20)} />
            </label>
          )}
          <label className="row small">
            <input type="checkbox" checked={allowPracticed} onChange={(e) => setAllowPracticed(e.target.checked)} /> Allow families I have already attempted
          </label>
          <div className="small">
            Available independent families for these settings: <b data-testid="pool-available">{p.available}</b> (lecture exam items + held-out optics families).
          </div>
          {p.warning && <Feedback tone="warn" title="Pool limit" items={[p.warning]} />}
          <button className="btn primary" disabled={!p.items.length} onClick={create} data-testid="create-exam">
            Create exam ({p.items.length} items)
          </button>
        </div>
        <div className="panel">
          <h2>Previous exams</h2>
          {exams.length === 0 ? (
            <p className="small muted">None yet.</p>
          ) : (
            <table className="data small">
              <tbody>
                {[...exams].reverse().map((e) => (
                  <tr key={e.id}>
                    <td>{new Date(e.createdAt).toLocaleString()}</td>
                    <td>{e.items.length} items</td>
                    <td>
                      <Pill tone={e.status === 'submitted' ? 'good' : 'warn'}>{e.status}</Pill>
                    </td>
                    <td>
                      <a href={href(`exam/${e.id}`)}>{e.status === 'submitted' ? 'Results' : 'Resume'}</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function ExamSessionView({ id }: { id: string }) {
  const { repo, profile, recordAttempt, flags } = useApp();
  const [exam, setExam] = useState<ExamSession | null>(null);
  const [missing, setMissing] = useState(false);
  const startRef = useRef(now());
  useEffect(() => {
    if (!profile) return;
    repo.exams(profile.id).then((es) => {
      const e = es.find((x) => x.id === id);
      if (e) setExam(e);
      else setMissing(true);
    });
  }, [id, repo, profile]);
  const persist = async (e: ExamSession) => {
    setExam(e);
    await repo.saveExam(e);
  };
  // accumulate elapsed time while the page is open
  useEffect(() => {
    if (!exam || exam.status !== 'in-progress') return;
    startRef.current = now();
    const t = setInterval(() => {
      setExam((old) => (old ? { ...old, elapsedMs: old.elapsedMs + 1000 } : old));
    }, 1000);
    return () => clearInterval(t);
  }, [exam?.id, exam?.status]);
  const tasks = useMemo(() => exam?.items.map((it) => (it.kind === 'optics' ? familyById(it.itemId)?.make(it.seed ?? 1) : undefined)) ?? [], [exam?.id]);
  if (missing) return <Feedback tone="bad" title="Exam not found in this profile" />;
  if (!exam) return <p>Loading exam…</p>;
  const it = exam.items[exam.currentIndex];
  const answered = exam.items.filter((x) => exam.responses[x.itemId] !== undefined && exam.responses[x.itemId] !== null).length;
  const remainingMs = exam.settings.timed && exam.settings.minutes ? exam.settings.minutes * 60000 - exam.elapsedMs : null;

  const submit = async () => {
    if (!confirm(`Submit the exam? ${exam.items.length - answered} item(s) unanswered.`)) return;
    for (let i = 0; i < exam.items.length; i++) {
      const x = exam.items[i];
      const r = exam.responses[x.itemId];
      if (x.kind === 'optics') {
        const t = tasks[i]!;
        const g = r ? t.grade(r as TaskResponse) : null;
        await recordAttempt({ itemId: t.itemId, itemVersion: 1, familyId: t.familyId, objectiveIds: t.objectiveIds, lectureIds: t.lectureIds, seed: t.seed, taskType: t.taskType, mode: 'exam', response: r ?? null, correct: g ? g.correct : false, scores: g?.scores ?? { unanswered: true }, confidence: null, hintLevel: 0, misconceptionIds: g?.misconceptionIds ?? [], startedAt: exam.createdAt, examId: exam.id, isTransfer: true, id: `${exam.id}:${x.itemId}` });
      } else {
        const item = ALL_ITEMS.find((m) => m.id === x.itemId)!;
        const ok = typeof r === 'number' && r === item.answerIndex;
        await recordAttempt({ itemId: item.id, itemVersion: item.version, familyId: item.familyId, objectiveIds: item.objectiveIds, lectureIds: [item.lectureId], seed: null, taskType: 'mcq', mode: 'exam', response: r ?? null, correct: ok, scores: { choice: typeof r === 'number' ? r : 'unanswered' }, confidence: null, hintLevel: 0, misconceptionIds: ok ? [] : item.misconceptionIds, startedAt: exam.createdAt, examId: exam.id, isTransfer: true, id: `${exam.id}:${x.itemId}` });
      }
    }
    await persist({ ...exam, status: 'submitted', submittedAt: now() });
  };

  if (exam.status === 'submitted') return <ExamResults exam={exam} tasks={tasks} flagged={flags.map((f) => f.itemId)} />;
  return (
    <div className="stack" data-testid="exam-session">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0 }}>
          Mock exam · item {exam.currentIndex + 1}/{exam.items.length}
        </h1>
        <div className="row small">
          <span>{answered} answered</span>
          {remainingMs !== null && <Pill tone={remainingMs < 0 ? 'bad' : undefined}>{remainingMs < 0 ? 'Time over (no automatic penalty)' : `${Math.ceil(remainingMs / 60000)} min left`}</Pill>}
          <span className="muted">Progress saves automatically; you can leave and resume.</span>
        </div>
      </div>
      {exam.poolWarning && <Feedback tone="warn" title="Pool limit" items={[exam.poolWarning]} />}
      <div className="panel">
        {it.kind === 'optics' ? (
          <TaskRunner key={it.itemId} task={tasks[exam.currentIndex]!} mode="exam" examResponse={(exam.responses[it.itemId] as TaskResponse) ?? null} onExamResponse={(r) => { if (JSON.stringify(r) !== JSON.stringify(exam.responses[it.itemId] ?? null)) persist({ ...exam, responses: { ...exam.responses, [it.itemId]: r } }); }} />
        ) : (
          <McqRunner key={it.itemId} item={ALL_ITEMS.find((m) => m.id === it.itemId)!} lectureId={ALL_ITEMS.find((m) => m.id === it.itemId)!.lectureId} mode="exam" examValue={(exam.responses[it.itemId] as number) ?? null} onExamValue={(v) => persist({ ...exam, responses: { ...exam.responses, [it.itemId]: v } })} seed={exam.settings.seed} />
        )}
      </div>
      <div className="row">
        <button className="btn" disabled={exam.currentIndex === 0} onClick={() => persist({ ...exam, currentIndex: exam.currentIndex - 1 })}>
          ← Previous
        </button>
        <button className="btn" disabled={exam.currentIndex >= exam.items.length - 1} onClick={() => persist({ ...exam, currentIndex: exam.currentIndex + 1 })}>
          Next →
        </button>
        <span style={{ flex: 1 }} />
        <button className="btn primary" onClick={submit} data-testid="submit-exam">
          Submit exam
        </button>
      </div>
    </div>
  );
}

function ExamResults({ exam, tasks, flagged }: { exam: ExamSession; tasks: (ReturnType<NonNullable<ReturnType<typeof familyById>>['make']> | undefined)[]; flagged: string[] }) {
  const rows = exam.items.map((x, i) => {
    const r = exam.responses[x.itemId];
    if (x.kind === 'optics') {
      const t = tasks[i]!;
      const g = r ? t.grade(r as TaskResponse) : null;
      return { id: x.itemId, label: t.title, lecture: t.lectureIds.join(', '), kind: 'optics', correct: !!g?.correct, answered: !!r, feedback: g?.feedback ?? ['Unanswered.'], dims: g?.scores ?? {} };
    }
    const item = ALL_ITEMS.find((m) => m.id === x.itemId)!;
    const ok = typeof r === 'number' && r === item.answerIndex;
    return { id: item.id, label: item.stem.slice(0, 80) + (item.stem.length > 80 ? '…' : ''), lecture: item.lectureId, kind: 'mcq', correct: ok, answered: typeof r === 'number', feedback: [typeof r === 'number' && !ok ? item.distractorRationale[r] : '', item.explanation].filter(Boolean), dims: {} };
  });
  const scored = rows.filter((r) => !flagged.includes(r.id));
  const score = scored.filter((r) => r.correct).length;
  return (
    <div className="stack" data-testid="exam-results">
      <h1>Exam results</h1>
      <div className="panel">
        <p>
          <b className="num" style={{ fontSize: '1.4rem' }}>
            {score}/{scored.length}
          </b>{' '}
          on held-out families{flagged.length ? ` (${rows.length - scored.length} flagged item(s) excluded from scoring)` : ''}. This is one sample of performance on this pool — not a prediction of your examination grade.
        </p>
        <p className="small muted">Exam attempts are recorded as transfer evidence but do not schedule reviews themselves.</p>
      </div>
      <div className="panel">
        <table className="data small">
          <thead>
            <tr>
              <th>#</th>
              <th>Item</th>
              <th>Lecture</th>
              <th>Result</th>
              <th>Feedback</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id}>
                <td>{i + 1}</td>
                <td>
                  {r.label}
                  <div className="tiny muted">{r.kind}</div>
                </td>
                <td>{r.lecture}</td>
                <td>
                  <Pill tone={r.correct ? 'good' : 'bad'}>{!r.answered ? 'unanswered' : r.correct ? 'correct' : 'incorrect'}</Pill>
                  {'opticallyEquivalent' in r.dims && <div className="tiny">optics: {String(r.dims.opticallyEquivalent)} · notation: {String(r.dims.notation)}</div>}
                </td>
                <td className="tiny">{r.feedback.join(' ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <a className="btn" href={href('exam')}>
        Back to Exam Room
      </a>
    </div>
  );
}
