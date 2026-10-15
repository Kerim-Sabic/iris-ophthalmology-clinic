import { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../app/context';
import { href } from '../app/router';
import { LECTURES, PRESETS, lectureById, lectureDepth } from '../content/lectures';
import { SOURCES } from '../content/reference';
import type { LectureScope } from '../domain/learning';
import { EVIDENCE_LABEL, objectiveEvidence } from '../domain/learning';
import { FAMILIES, OPTICS_OBJECTIVES } from '../domain/missions';
import { STUDIOS } from '../content/studios';
import registry from '../content/TEST_REGISTRY.json';
import { now } from '../lib/store';
import { Feedback, Pill, Seg } from '../ui/kit';
import { McqRunner } from '../ui/Mcq';
import { Glossed, segmentParagraphs } from '../ui/Glossed';
import { TUTORIALS, WatchTutorial } from '../tutorials';
import { speakBrowser, browserSpeechAvailable, watchedTutorials } from '../tutorials/narration';

export function LecturesPage() {
  const { plan, plans, savePlan } = useApp();
  const [scope, setScope] = useState<Record<string, LectureScope>>(() => plan?.lectures ?? {});
  const [q, setQ] = useState('');
  const [group, setGroup] = useState('all');
  const [examDate, setExamDate] = useState(plan?.examDate ?? '');
  const [saved, setSaved] = useState(false);
  const [graph, setGraph] = useState(false);
  useEffect(() => setScope(plan?.lectures ?? {}), [plan?.id]);
  const groups = [...new Set(LECTURES.map((l) => l.group))];
  const shown = LECTURES.filter((l) => (group === 'all' || l.group === group) && (q === '' || `${l.id} ${l.title} ${l.emphasis}`.toLowerCase().includes(q.toLowerCase())));
  const inc = Object.values(scope).filter((s) => s === 'included').length;
  const unc = Object.values(scope).filter((s) => s === 'uncertain').length;
  const exc = Object.values(scope).filter((s) => s === 'excluded').length;
  const dirty = JSON.stringify(scope) !== JSON.stringify(plan?.lectures ?? {}) || (examDate || null) !== (plan?.examDate ?? null);
  const set = (id: string, s: LectureScope) => {
    setSaved(false);
    setScope({ ...scope, [id]: s });
  };
  return (
    <div className="stack">
      <h1>Lectures</h1>
      <p className="muted small">
        Select lectures individually or by group. Presets are application study plans, not a university syllabus. Saving creates a new scope snapshot; all previous history is kept.
      </p>
      <div className="panel stack">
        <div className="row">
          <span className="small muted">Presets:</span>
          {PRESETS.map((p) => (
            <button key={p.id} className="btn sm" title={p.note} onClick={() => { setSaved(false); setScope(Object.fromEntries(LECTURES.map((l) => [l.id, p.lectures.includes(l.id) ? 'included' : 'excluded'])) as Record<string, LectureScope>); }}>
              {p.title}
            </button>
          ))}
          <button className="btn sm ghost" onClick={() => setScope({})}>
            Clear
          </button>
        </div>
        <div className="row">
          <input type="search" aria-label="Filter lectures" placeholder="Filter lectures…" value={q} onChange={(e) => setQ(e.target.value)} style={{ maxWidth: 280 }} />
          <select aria-label="Group" value={group} onChange={(e) => setGroup(e.target.value)} style={{ maxWidth: 260 }}>
            <option value="all">All groups</option>
            {groups.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
          {group !== 'all' && (
            <>
              <button className="btn sm" onClick={() => setScope({ ...scope, ...Object.fromEntries(shown.map((l) => [l.id, 'included'])) })}>Include group</button>
              <button className="btn sm" onClick={() => setScope({ ...scope, ...Object.fromEntries(shown.map((l) => [l.id, 'excluded'])) })}>Exclude group</button>
            </>
          )}
          <button className="btn sm" onClick={() => setGraph(!graph)} aria-pressed={graph}>
            {graph ? 'List view' : 'Prerequisite graph'}
          </button>
        </div>
        <div className="row small">
          <Pill tone="good">{inc} included</Pill>
          <Pill tone="warn">{unc} uncertain</Pill>
          <Pill>{exc} excluded</Pill>
          <Pill>{36 - inc - unc - exc} not set</Pill>
          <label className="row">
            Exam date (optional)
            <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} style={{ width: 170 }} />
          </label>
          <button className="btn primary" disabled={!dirty} data-testid="save-scope" onClick={async () => { await savePlan({ lectures: scope, presetId: null, examDate: examDate || null, minutesPerDay: null }); setSaved(true); }}>
            Save scope snapshot
          </button>
          {saved && <span className="pill good">Saved as v{plans[plans.length - 1]?.scopeVersion}</span>}
        </div>
        {inc === 0 && <p className="small muted">Zero lectures included: everything stays available, but exams and scope evidence need at least one included lecture.</p>}
      </div>
      {graph ? (
        <PrereqGraph scope={scope} />
      ) : (
        <div className="panel" style={{ padding: 0 }}>
          {shown.map((l) => (
            <div key={l.id} className="lecture-row">
              <span className="num muted">{l.id}</span>
              <div>
                <a href={href(`lectures/${l.id}`)}>
                  <b>{l.title}</b>
                </a>
                <div className="tiny muted">
                  {l.group} · {l.emphasis.slice(0, 110)}
                  {l.emphasis.length > 110 ? '…' : ''}
                </div>
              </div>
              <Seg className="scope-seg" label={`Scope for ${l.id}`} value={(scope[l.id] ?? '') as LectureScope} onChange={(s) => set(l.id, s)} options={[{ value: 'included', label: 'Include' }, { value: 'uncertain', label: 'Uncertain' }, { value: 'excluded', label: 'Exclude' }]} />
            </div>
          ))}
        </div>
      )}
      {plans.length > 0 && (
        <details className="panel">
          <summary>Scope history ({plans.length} snapshots)</summary>
          <table className="data small">
            <tbody>
              {[...plans].reverse().map((p) => (
                <tr key={p.id}>
                  <td>v{p.scopeVersion}</td>
                  <td>{new Date(p.createdAt).toLocaleString()}</td>
                  <td>{Object.values(p.lectures).filter((s) => s === 'included').length} included</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      )}
    </div>
  );
}

function PrereqGraph({ scope }: { scope: Record<string, LectureScope> }) {
  const memo = new Map<string, number>();
  const layers: string[][] = [];
  for (const l of LECTURES) {
    const d = lectureDepth(l.id, memo);
    (layers[d] ??= []).push(l.id);
  }
  const colW = 120;
  const rowH = 30;
  const pos = new Map<string, { x: number; y: number }>();
  layers.forEach((ids, d) => ids.forEach((id, i) => pos.set(id, { x: 20 + d * colW, y: 20 + i * rowH })));
  const W = 40 + layers.length * colW;
  const H = 40 + Math.max(...layers.map((l) => l.length)) * rowH;
  return (
    <div className="panel" style={{ overflowX: 'auto' }}>
      <p className="small muted">Recommended prerequisites flow left → right. They are recommendations: every lecture can be opened directly (a short bridge is offered).</p>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ minWidth: W, width: '100%' }} role="img" aria-label="Prerequisite graph of the 36 lectures">
        {LECTURES.flatMap((l) =>
          l.prerequisites.map((p) => {
            const a = pos.get(p)!;
            const b = pos.get(l.id)!;
            return <path key={p + l.id} d={`M${a.x + 70},${a.y} C${a.x + 95},${a.y} ${b.x - 25},${b.y} ${b.x},${b.y}`} stroke="var(--line)" fill="none" />;
          }),
        )}
        {LECTURES.map((l) => {
          const p = pos.get(l.id)!;
          const s = scope[l.id];
          return (
            <a key={l.id} href={href(`lectures/${l.id}`)}>
              <rect x={p.x} y={p.y - 11} width={70} height={22} rx={6} fill={s === 'included' ? 'var(--good-soft)' : s === 'uncertain' ? 'var(--warn-soft)' : 'var(--surface)'} stroke={s === 'included' ? 'var(--good)' : 'var(--line)'} />
              <text x={p.x + 35} y={p.y + 4} textAnchor="middle" fontSize="11" fill="var(--ink)">
                {l.id}
              </text>
              <title>{l.title}</title>
            </a>
          );
        })}
      </svg>
    </div>
  );
}

export function LectureView({ id }: { id: string }) {
  const l = lectureById(id);
  const { attempts, repo, profile } = useApp();
  const [level, setLevel] = useState<'essentials' | 'full' | 'deeper'>('essentials');
  const [entry, setEntry] = useState(false);
  const [transfer, setTransfer] = useState(false);
  const [note, setNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);
  const [itemIdx, setItemIdx] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [readDone, setReadDone] = useState(() => readLessons().includes(id));
  const stopRef = useRef<() => void>(() => {});
  useEffect(() => () => stopRef.current(), []);
  useEffect(() => {
    if (!profile) return;
    repo.notes(profile.id).then((ns) => setNote(ns.find((n) => n.ref === `lecture:${id}`)?.text ?? ''));
  }, [id, profile, repo]);
  const practice = useMemo(() => l?.items.filter((i) => i.pool === 'practice') ?? [], [l]);
  if (!l) return <Feedback tone="bad" title={`No lecture ${id}`} />;
  const prereqWeak = l.prerequisites.filter((p) => !attempts.some((a) => a.lectureIds.includes(p) && a.correct));
  const opticsObjs = Object.entries(OPTICS_OBJECTIVES).filter(([, o]) => o.lectureIds.includes(l.id));
  const studios = STUDIOS.filter((s) => l.studios.includes(s.id));
  const acts = registry.entries.filter((e) => l.activities.includes(e.id));
  const item = practice[itemIdx % Math.max(1, practice.length)];
  const paras = level === 'essentials' ? l.essentials : level === 'full' ? l.full : l.deeper;
  const segs = segmentParagraphs(paras); // each jargon word is linked once per section
  const tutorial = TUTORIALS.find((t) => t.studio && l.studios.includes(t.studio));
  const answered = attempts.filter((a) => a.lectureIds.includes(l.id) && a.taskType === 'mcq').length;
  const triedLab = attempts.some((a) => a.lectureIds.includes(l.id) && a.taskType !== 'mcq');
  const markRead = () => {
    setReadDone(true);
    saveRead(id);
  };
  const listen = () => {
    if (speaking) {
      stopRef.current();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    stopRef.current = speakBrowser(paras.join(' '), 1, () => {
      setSpeaking(false);
      markRead();
    });
  };
  const steps = [
    { label: 'Read the essentials', done: readDone, href: '', target: 'reference' },
    ...(tutorial ? [{ label: `Watch: ${tutorial.title}`, done: watchedTutorials().includes(tutorial.id), href: href(`learn/${tutorial.id}`) }] : []),
    { label: `Answer questions (${Math.min(answered, practice.length)}/${practice.length})`, done: answered >= practice.length && practice.length > 0, href: '', target: 'questions' },
    ...(studios.some((s) => s.status !== 'planned') ? [{ label: 'Try it in the lab', done: triedLab, href: href(`lab/${studios.find((s) => s.status !== 'planned')!.id}`) }] : []),
  ];
  return (
    <div className="stack">
      <div>
        <a href={href('lectures')} className="small">
          ← Lectures
        </a>
        <h1>
          <span className="muted num">{l.id}</span> {l.title}
        </h1>
        <div className="row small">
          <Pill tone="warn">{l.reviewStatus} · not clinically reviewed</Pill>
          <Pill>{l.group}</Pill>
          <Pill>≈{l.estMinutes} min (design estimate)</Pill>
        </div>
      </div>
      <nav className="lesson-steps" aria-label="Steps for this lecture" data-testid="lesson-steps">
        {steps.map((st, i) => (
          <a
            key={st.label}
            className={`lesson-step ${st.done ? 'done' : ''}`}
            href={st.href || undefined}
            role={st.href ? undefined : 'button'}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !st.href) (e.currentTarget as HTMLElement).click();
            }}
            onClick={(e) => {
              if ('target' in st && st.target) {
                e.preventDefault();
                document.getElementById(st.target as string)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          >
            <span className="num-badge">{st.done ? '✓' : i + 1}</span>
            {st.label}
          </a>
        ))}
      </nav>
      {prereqWeak.length > 0 && (
        <details className="banner small" data-testid="bridge">
          <summary>
            <b>New to this? Quick recap first</b> <span className="muted">(builds on {prereqWeak.join(', ')} — optional)</span>
          </summary>
          <p style={{ margin: '6px 0 0' }}>
            <Glossed text={l.bridge} />
          </p>
          <span className="muted">
            Recommended first:{' '}
            {prereqWeak.map((p) => (
              <a key={p} href={href(`lectures/${p}`)} style={{ marginRight: 6 }}>
                {p}
              </a>
            ))}
          </span>
        </details>
      )}
      <div className="grid cols-2" style={{ alignItems: 'start' }}>
        <div className="stack">
          <div className="panel stack" id="reference">
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <h2 style={{ margin: 0 }}>Read</h2>
              <Seg label="Depth" value={level} onChange={setLevel} options={[{ value: 'essentials', label: 'Essentials' }, { value: 'full', label: 'Full explanation' }, { value: 'deeper', label: 'Deeper detail' }]} />
            </div>
            <div className="row small">
              {browserSpeechAvailable() && (
                <button className="btn sm listen-btn" aria-pressed={speaking} onClick={listen} data-testid="listen">
                  {speaking ? '■ Stop reading' : '🔊 Read it to me'}
                </button>
              )}
              {tutorial && <WatchTutorial id={tutorial.id} label="Watch the animated version" />}
              <span className="muted">Tap any underlined word for a plain-English explanation.</span>
            </div>
            {paras.map((p, i) => (
              <p key={i}>
                <Glossed text={p} segments={segs[i]} />
              </p>
            ))}
            {!readDone && (
              <button className="btn sm" onClick={markRead} data-testid="mark-read">
                ✓ I've read this
              </button>
            )}
            <details className="ref">
              <summary>Common mistakes</summary>
              <ul>
                {l.misconceptions.map((m, i) => (
                  <li key={i}>
                    <Glossed text={m} />
                  </li>
                ))}
              </ul>
            </details>
            <details className="ref">
              <summary>Worked example</summary>
              <p>{l.workedExample.problem}</p>
              <ol>
                {l.workedExample.steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </details>
            <details className="ref">
              <summary>Contrast: {l.contrast.a} vs {l.contrast.b}</summary>
              <p>
                <Glossed text={l.contrast.discriminator} />
              </p>
            </details>
          </div>
          <div className="panel">
            <h2>Objectives and your evidence</h2>
            <table className="data small">
              <tbody>
                {l.objectives.map((o) => (
                  <tr key={o.id}>
                    <td>{o.text}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{EVIDENCE_LABEL[objectiveEvidence(attempts, o.id)]}</td>
                  </tr>
                ))}
                {opticsObjs.map(([oid, o]) => (
                  <tr key={oid}>
                    <td>{o.text} <span className="tiny muted">(laboratory)</span></td>
                    <td style={{ whiteSpace: 'nowrap' }}>{EVIDENCE_LABEL[objectiveEvidence(attempts, oid)]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="panel stack">
            <h2>Entry challenge</h2>
            <p>{l.entryChallenge.prompt}</p>
            {entry ? <div className="feedback">{l.entryChallenge.answer}</div> : <button className="btn sm" onClick={() => setEntry(true)}>Commit to an answer in your head, then reveal</button>}
          </div>
        </div>
        <div className="stack">
          {(studios.length > 0 || acts.length > 0) && (
            <div className="panel stack">
              <h2>Do it in the laboratory</h2>
              <p className="small muted">Signature interaction: {l.signature}</p>
              {studios.map((s) => (
                <div key={s.id} className="row">
                  <a className={`btn sm ${s.status !== 'planned' ? 'primary' : ''}`} href={href(`lab/${s.id}`)}>
                    {s.id} {s.title}
                  </a>
                  <Pill tone={s.status === 'implemented' ? 'good' : s.status === 'partial' ? 'warn' : undefined}>{s.status}</Pill>
                </div>
              ))}
              {acts.length > 0 && (
                <details>
                  <summary className="small">{acts.length} catalog activities</summary>
                  <ul className="small">
                    {acts.map((a) => (
                      <li key={a.id}>
                        {a.id} {a.activity} — <i>{a.implementation}</i>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
              {l.id === 'L05' || l.id === 'L03' || l.id === 'L04' ? (
                <div className="row">
                  <a className="btn sm" href={href('lab/LAB01?mode=mission')}>Cylinder mission</a>
                  {FAMILIES.filter((f) => f.pool === 'practice' && f.objectiveIds.some((o) => OPTICS_OBJECTIVES[o].lectureIds.includes(l.id))).slice(0, 4).map((f) => (
                    <a key={f.id} className="btn sm" href={href(`lab/LAB01?mode=guided&family=${f.id}`)}>
                      {f.title}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          )}
          <div className="panel stack">
            <h2 id="questions">Questions</h2>
            {item ? (
              <>
                <p className="tiny muted">
                  Practice item {(itemIdx % practice.length) + 1} of {practice.length}. Exam-pool families of this lecture are held back for the Exam Room.
                </p>
                <McqRunner key={item.id + itemIdx} item={item} lectureId={l.id} mode="learning" />
                <button className="btn sm" onClick={() => setItemIdx(itemIdx + 1)}>
                  Next question
                </button>
              </>
            ) : (
              <p className="small muted">No practice items authored yet.</p>
            )}
          </div>
          <div className="panel stack">
            <h2>Transfer check</h2>
            <p>{l.transfer.prompt}</p>
            {transfer ? (
              <div className="feedback">
                <b>Model answer (compare yourself — self-assessed, not scored):</b> {l.transfer.modelAnswer}
              </div>
            ) : (
              <button className="btn sm" onClick={() => setTransfer(true)}>Reveal model answer</button>
            )}
          </div>
          <div className="panel stack">
            <h2>My notes</h2>
            <textarea aria-label="Personal notes for this lecture" value={note} onChange={(e) => { setNote(e.target.value); setNoteSaved(false); }} />
            <button className="btn sm" onClick={async () => { if (profile) { await repo.saveNote({ id: `${profile.id}:lecture:${id}`, profileId: profile.id, ref: `lecture:${id}`, text: note, updatedAt: now() || Date.now() }); setNoteSaved(true); } }}>
              Save note
            </button>
            {noteSaved && <span className="pill good">Saved</span>}
          </div>
          <div className="panel small">
            <h3>Sources</h3>
            {l.sources.length ? (
              <ul>
                {l.sources.map((s) => (
                  <li key={s}>
                    <b>{s}</b> {SOURCES[s].title} — {SOURCES[s].org}. <span className="muted">{SOURCES[s].scope}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">No claim-level source attached yet — this lecture is unsourced draft content.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



const READ_KEY = 'iris.lessonsRead';
function readLessons(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(READ_KEY) ?? '[]');
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
function saveRead(id: string) {
  try {
    localStorage.setItem(READ_KEY, JSON.stringify([...new Set([...readLessons(), id])]));
  } catch {
    /* per-browser convenience only */
  }
}
