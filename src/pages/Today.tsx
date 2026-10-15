import { useApp } from '../app/context';
import { href } from '../app/router';
import { LECTURES } from '../content/lectures';
import { STUDIOS } from '../content/studios';
import registry from '../content/TEST_REGISTRY.json';
import { dueReviews, objectiveEvidence, DAY_MS } from '../domain/learning';
import { OPTICS_OBJECTIVES } from '../domain/missions';
import { TUTORIALS, WatchTutorial } from '../tutorials';
import { watchedTutorials } from '../tutorials/narration';

export function Today() {
  const { plan, attempts, clockMs } = useApp();
  const due = dueReviews(attempts, clockMs);
  const watched = watchedTutorials();
  const triedMission = attempts.some((a) => a.mode === 'mission');
  const included = plan ? Object.entries(plan.lectures).filter(([, s]) => s === 'included').map(([k]) => k) : [];
  const uncertain = plan ? Object.entries(plan.lectures).filter(([, s]) => s === 'uncertain').length : 0;
  const objs = LECTURES.filter((l) => included.includes(l.id)).flatMap((l) => l.objectives.map((o) => o.id));
  const allObjs = [...objs, ...Object.keys(OPTICS_OBJECTIVES).filter((o) => OPTICS_OBJECTIVES[o].lectureIds.some((l) => included.includes(l)))];
  const ev = allObjs.map((o) => objectiveEvidence(attempts, o));
  const counts = (k: string) => ev.filter((e) => e === k).length;
  const implementedStudios = STUDIOS.filter((s) => s.status !== 'planned').length;
  const implementedTests = registry.entries.filter((e) => e.implementation !== 'planned').length;
  const lastAttempt = attempts[attempts.length - 1];
  const gapDays = lastAttempt ? Math.floor((clockMs - lastAttempt.submittedAt) / DAY_MS) : 0;
  return (
    <div className="stack">
      <div className="panel stack">
        <h1 style={{ marginBottom: 0 }}>Learn ophthalmology by doing it</h1>
        <p className="muted" style={{ margin: 0 }}>Three simple steps. Each one takes a few minutes.</p>
        <div className="path" data-testid="learning-path">
          <div className={`path-step ${watched.length ? 'done' : ''}`}>
            <span className="num-badge">{watched.length ? '✓' : 1}</span>
            <b>Watch</b>
            <span className="small">A short animated explanation with a voice. Start with the tour, then the cylinder lens.</span>
            <div className="row">
              <WatchTutorial id={watched.includes('tour') ? 'cylinder' : 'tour'} label={watched.includes('tour') ? 'Watch: cylinder lenses' : 'Watch the 2-minute tour'} primary />
            </div>
            <a className="small" href={href('learn')}>All {TUTORIALS.length} tutorials</a>
          </div>
          <div className={`path-step ${triedMission ? 'done' : ''}`}>
            <span className="num-badge">{triedMission ? '✓' : 2}</span>
            <b>Try</b>
            <span className="small">Solve a real lens step by step: predict, check, then write the prescription yourself.</span>
            <div className="row">
              <a className="btn primary" href={href('lab/LAB01?mode=mission')} data-testid="start-mission">
                Start the lens mission
              </a>
            </div>
            <a className="small" href={href('patients')}>or examine a patient</a>
          </div>
          <div className={`path-step ${due.length === 0 && attempts.length > 0 ? 'done' : ''}`}>
            <span className="num-badge">3</span>
            <b>Check</b>
            <span className="small">Come back tomorrow for a quick review on new numbers. That is what makes it stick.</span>
            <div className="row">
              <a className="btn" href={href('review')}>
                {due.length ? `Review now (${due.length})` : 'Open review'}
              </a>
            </div>
          </div>
        </div>
      </div>
      {gapDays >= 3 && due.length > 0 && (
        <div className="banner">
          Welcome back. {due.length} short review{due.length > 1 ? 's are' : ' is'} waiting; nothing has been deleted. A few now is enough to restart.
        </div>
      )}
      <div className="grid cols-3">
        <div className="panel">
          <h3>Due reviews</h3>
          <p className="num" style={{ fontSize: '1.8rem', margin: 0 }} data-testid="due-count">
            {due.length}
          </p>
          <p className="small muted">Delayed checks scheduled from your own attempts (capped at 20/day).</p>
          <a className="btn" href={href('review')}>
            Open review
          </a>
        </div>
        <div className="panel">
          <h3>Selected scope</h3>
          {plan ? (
            <>
              <p className="num" style={{ fontSize: '1.8rem', margin: 0 }}>
                {included.length}/{LECTURES.length}
              </p>
              <p className="small muted">
                lectures included · {uncertain} uncertain · scope v{plan.scopeVersion}
              </p>
            </>
          ) : (
            <p className="small">No study scope chosen yet — you can study anything without one.</p>
          )}
          <a className="btn" href={href('lectures')}>
            Choose lectures
          </a>
        </div>
        <div className="panel">
          <h3>Learning evidence (in scope)</h3>
          {allObjs.length ? (
            <table className="data small">
              <tbody>
                <tr><td>Objectives in scope</td><td className="num">{allObjs.length}</td></tr>
                <tr><td>Immediate check passed</td><td className="num">{counts('immediate-check-passed')}</td></tr>
                <tr><td>Delayed check passed</td><td className="num">{counts('delayed-check-passed')}</td></tr>
                <tr><td>Transfer demonstrated</td><td className="num">{counts('transfer-demonstrated')}</td></tr>
                <tr><td>Needs review</td><td className="num">{counts('needs-review')}</td></tr>
                <tr><td>No evidence yet</td><td className="num">{counts('not-attempted') + counts('practicing')}</td></tr>
              </tbody>
            </table>
          ) : (
            <p className="small muted">Choose a scope to see evidence against its objectives.</p>
          )}
        </div>
      </div>
      <div className="panel small">
        <h3>What exists in this build (content status, separate from your progress)</h3>
        <p>
          Studios with working instruments: <b>{implementedStudios}/18</b>. Catalog activities implemented: <b>{implementedTests}/88</b>. All content is <b>draft — not clinically reviewed</b>. Planned items are labelled as planned and never count toward your progress.
        </p>
        <a href={href('lab')}>See the laboratory status</a>
      </div>
    </div>
  );
}
