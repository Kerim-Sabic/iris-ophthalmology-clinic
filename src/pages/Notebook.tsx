import { useApp } from '../app/context';
import { href } from '../app/router';
import { MISCONCEPTIONS } from '../content/reference';
import { deriveReviewStates } from '../domain/learning';
import { formatRx, type SpheroCyl } from '../domain/optics';
import { exploreLink } from '../lab/TaskRunner';

function describe(resp: unknown): string {
  if (!resp || typeof resp !== 'object') return String(resp ?? '—');
  const r = resp as Record<string, unknown>;
  if (r.kind === 'rx' && r.lens) return formatRx(r.lens as SpheroCyl);
  if (r.kind === 'number') return `${r.value} D`;
  if (r.kind === 'choice') return String(r.value);
  if (r.kind === 'cross') return `${r.p1} D @ ${r.m1}°, ${r.p2} D @ ${r.m2}°`;
  if ('choice' in r) return `option ${r.choice}`;
  return JSON.stringify(r).slice(0, 80);
}

export function Notebook() {
  const { attempts, flags } = useApp();
  const wrong = attempts.filter((a) => a.correct === false).reverse();
  const states = deriveReviewStates(attempts);
  const misCount = new Map<string, number>();
  for (const a of wrong) for (const m of a.misconceptionIds) misCount.set(m, (misCount.get(m) ?? 0) + 1);
  // a misconception is "unresolved" if the latest attempt in any family where it appeared is still wrong
  const unresolved = [...misCount.keys()].filter((m) => {
    const fams = new Set(wrong.filter((a) => a.misconceptionIds.includes(m)).map((a) => a.familyId));
    return [...fams].some((f) => {
      const last = [...attempts].reverse().find((a) => a.familyId === f && a.correct !== null);
      return last && !(last.correct && last.hintLevel === 0);
    });
  });
  return (
    <div className="stack">
      <h1>Error notebook</h1>
      <p className="small muted">Every incorrect attempt is kept with its original answer, even after you later correct it. Misconception labels are hypotheses that fit the numbers, not judgements of what you were thinking.</p>
      <div className="panel">
        <h2>Misconception patterns</h2>
        {misCount.size === 0 ? (
          <p className="small muted">None recorded.</p>
        ) : (
          <table className="data small">
            <tbody>
              {[...misCount.entries()].sort((a, b) => b[1] - a[1]).map(([m, n]) => (
                <tr key={m}>
                  <td>{MISCONCEPTIONS[m] ?? m}</td>
                  <td className="num">{n}×</td>
                  <td>{unresolved.includes(m) ? <span className="pill warn">unresolved</span> : <span className="pill good">later answered unaided</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="panel" data-testid="error-list">
        <h2>Attempts ({wrong.length} incorrect)</h2>
        {wrong.length === 0 && <p className="small muted">No incorrect attempts yet.</p>}
        <table className="data small">
          <tbody>
            {wrong.slice(0, 200).map((a) => {
              const target = (a.state as { target?: SpheroCyl } | undefined)?.target;
              const prop = (a.response as { kind?: string; lens?: SpheroCyl } | null)?.kind === 'rx' ? (a.response as { lens: SpheroCyl }).lens : null;
              return (
                <tr key={a.id}>
                  <td>{new Date(a.submittedAt).toLocaleString()}</td>
                  <td>
                    {a.itemId}
                    <div className="tiny muted">
                      {a.mode} · hints {a.hintLevel} · confidence {a.confidence ?? '—'}
                    </div>
                  </td>
                  <td className="num">{describe(a.response)}</td>
                  <td className="tiny">{a.feedback?.slice(0, 220)}</td>
                  <td className="tiny">
                    {a.misconceptionIds.map((m) => MISCONCEPTIONS[m] ?? m).join('; ')}
                    <div className="muted">next review: {states.get(a.familyId) ? new Date(states.get(a.familyId)!.dueAt).toLocaleDateString() : '—'}</div>
                  </td>
                  <td>{target && <a href={exploreLink(target, prop)}>open model</a>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {flags.length > 0 && (
        <div className="panel">
          <h2>Flagged questions (quarantined from your exam scoring)</h2>
          <ul className="small">
            {flags.map((f) => (
              <li key={f.key}>
                {f.itemId}: {f.reason}
              </li>
            ))}
          </ul>
        </div>
      )}
      <a href={href('review')}>Go to review</a>
    </div>
  );
}
