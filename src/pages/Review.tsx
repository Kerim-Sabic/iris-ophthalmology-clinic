import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../app/context';
import { href } from '../app/router';
import { ALL_ITEMS } from '../content/lectures';
import { deriveReviewStates, dueReviews, REVIEW_POLICY, type ReviewState } from '../domain/learning';
import { familyById } from '../domain/missions';
import { TaskRunner } from '../lab/TaskRunner';
import { McqRunner } from '../ui/Mcq';

function seedFor(r: ReviewState) {
  // A new numerical variant for each scheduled check, reproducible for that due time.
  let h = Math.floor(r.dueAt / 60000);
  for (const c of r.familyId) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h % 2147483647;
}

export function Review() {
  const { attempts, clockMs } = useApp();
  const due = dueReviews(attempts, clockMs);
  const all = [...deriveReviewStates(attempts).values()].sort((a, b) => a.dueAt - b.dueAt);
  const [active, setActive] = useState<ReviewState | null>(null);
  const [doneIds, setDoneIds] = useState<string[]>([]);
  const queue = due.filter((d) => !doneIds.includes(d.familyId));
  const current = active ?? queue[0] ?? null;
  // Pin the current review so recording its attempt (which reschedules it) does not swap the task mid-feedback.
  useEffect(() => {
    if (!active && queue[0]) setActive(queue[0]);
  }, [active, queue]);
  const task = useMemo(() => {
    if (!current) return null;
    const fam = familyById(current.familyId);
    if (fam) return { kind: 'optics' as const, task: fam.make(seedFor(current)) };
    const items = ALL_ITEMS.filter((i) => i.familyId === current.familyId && i.pool === 'practice');
    if (!items.length) return null;
    return { kind: 'mcq' as const, item: items[seedFor(current) % items.length] };
  }, [current]);
  return (
    <div className="stack">
      <h1>Review</h1>
      <p className="small muted">{REVIEW_POLICY.description}</p>
      {due.length === 0 && (
        <div className="panel" data-testid="no-due">
          <h2>No reviews due now</h2>
          <p>Nothing is scheduled before {all[0] ? new Date(all[0].dueAt).toLocaleString() : 'your first attempt'}. Retention cannot be manufactured early; use guided practice or a lecture instead.</p>
          <a className="btn" href={href('lab/LAB01?mode=guided')}>Guided practice</a>
        </div>
      )}
      {current && task && (
        <div className="panel" data-testid="review-task">
          <div className="row small muted">
            <span>
              Due check: {current.familyId} · last attempt {new Date(current.lastAttemptAt).toLocaleDateString()} · streak {current.streak}
            </span>
            <span>
              {queue.length} remaining today
            </span>
          </div>
          {task.kind === 'optics' ? (
            <TaskRunner
              task={task.task}
              mode="review"
              onNext={() => {
                setDoneIds([...doneIds, current.familyId]);
                setActive(null);
              }}
            />
          ) : (
            <>
              <McqRunner item={task.item} lectureId={task.item.lectureId} mode="review" />
              <button className="btn" onClick={() => { setDoneIds([...doneIds, current.familyId]); setActive(null); }}>
                Next review
              </button>
            </>
          )}
        </div>
      )}
      {current && !task && <p>Review content for {current.familyId} is unavailable in this content version; it is skipped, not marked passed.</p>}
      <details className="panel">
        <summary>Full schedule ({all.length} families)</summary>
        <table className="data small">
          <thead>
            <tr>
              <th>Family</th>
              <th>Lectures</th>
              <th>Attempts</th>
              <th>Streak</th>
              <th>Next check</th>
            </tr>
          </thead>
          <tbody>
            {all.map((r) => (
              <tr key={r.familyId}>
                <td>{r.familyId}</td>
                <td>{r.lectureIds.join(', ')}</td>
                <td className="num">{r.attempts}</td>
                <td className="num">{r.streak}</td>
                <td>{r.dueAt <= clockMs ? <b>due</b> : new Date(r.dueAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
