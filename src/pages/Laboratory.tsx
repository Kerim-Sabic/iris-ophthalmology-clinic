import { useState } from 'react';
import { href } from '../app/router';
import { STUDIOS, studioById } from '../content/studios';
import registry from '../content/TEST_REGISTRY.json';
import { Pill } from '../ui/kit';

const tone = (s: string) => (s === 'implemented' ? 'good' : s === 'partial' ? 'warn' : undefined);

export function Laboratory() {
  return (
    <div className="stack">
      <h1>Laboratory</h1>
      <p className="muted small">
        Eighteen reusable studios share one patient model, notation system and learner record. Status is truthful: a planned studio is a description, not a laboratory.
      </p>
      <div className="cards">
        {STUDIOS.map((s) => (
          <div key={s.id} className="card" data-testid={`studio-${s.id}`}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span className="num muted">{s.id}</span>
              <Pill tone={tone(s.status)}>{s.status}</Pill>
            </div>
            <h3>{s.title}</h3>
            <p className="small">{s.summary}</p>
            <p className="tiny muted">{s.statusNote}</p>
            <div className="meta">
              {s.status !== 'planned' ? (
                <a className="btn sm primary" href={href(`lab/${s.id}`)}>
                  Open studio
                </a>
              ) : (
                <a className="btn sm" href={href(`lab/${s.id}`)}>
                  View plan
                </a>
              )}
              <span className="tiny muted">Lectures {s.lectures.join(', ')}</span>
            </div>
          </div>
        ))}
      </div>
      <a href={href('lab/catalog')}>Open the 88-entry examination and investigation catalog →</a>
    </div>
  );
}

export function StudioPage({ id }: { id: string }) {
  const s = studioById(id);
  if (!s) return <p>Unknown studio {id}.</p>;
  const acts = registry.entries.filter((e) => e.studio === id);
  return (
    <div className="stack">
      <a className="small" href={href('lab')}>
        ← Laboratory
      </a>
      <h1>
        {s.id} · {s.title}
      </h1>
      <div className="banner warn">
        <b>Planned — not yet implemented.</b> This page describes the intended studio. No simulation runs here and nothing on this page counts as learning evidence.
      </div>
      <div className="panel">
        <p>{s.summary}</p>
        <p className="small muted">Related lectures: {s.lectures.map((l) => <a key={l} href={href(`lectures/${l}`)} style={{ marginRight: 6 }}>{l}</a>)}</p>
      </div>
      <div className="panel">
        <h2>Catalog activities assigned to this studio</h2>
        <ActivityTable rows={acts} />
      </div>
    </div>
  );
}

type Entry = (typeof registry.entries)[number];

function ActivityTable({ rows }: { rows: Entry[] }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="data small">
        <thead>
          <tr>
            <th>ID</th>
            <th>Activity</th>
            <th>Studio</th>
            <th>Depth</th>
            <th>Status</th>
            <th>Capabilities</th>
            <th>Safeguard</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((e) => (
            <tr key={e.id}>
              <td className="num">{e.id}</td>
              <td>
                {e.activity}
                <div className="tiny muted">{e.requiredAction}</div>
              </td>
              <td>{e.implementedIn ? <a href={href(e.implementedIn)}>{e.studio}</a> : e.studio}</td>
              <td>{e.depth}</td>
              <td>
                <Pill tone={tone(e.implementation === 'implemented' || e.implementation === 'tested' ? 'implemented' : e.implementation === 'planned' ? 'planned' : 'partial')}>{e.implementation}</Pill>
                <div className="tiny muted">{e.humanReview} · {e.sourceStatus}</div>
              </td>
              <td className="tiny">
                {Object.entries(e.capabilities)
                  .filter(([k, v]) => v && k !== 'requiresSupervisedPhysicalPractice')
                  .map(([k]) => k)
                  .join(', ') || '—'}
                {e.capabilities.requiresSupervisedPhysicalPractice && <div className="muted">needs supervised physical practice</div>}
              </td>
              <td className="tiny">{e.safeguard}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Catalog() {
  const [studio, setStudio] = useState('all');
  const [status, setStatus] = useState('all');
  const [q, setQ] = useState('');
  const rows = registry.entries.filter((e) => (studio === 'all' || e.studio === studio) && (status === 'all' || (status === 'planned' ? e.implementation === 'planned' : e.implementation !== 'planned')) && (q === '' || `${e.id} ${e.activity} ${e.requiredAction}`.toLowerCase().includes(q.toLowerCase())));
  const impl = registry.entries.filter((e) => e.implementation !== 'planned').length;
  return (
    <div className="stack">
      <h1>Examination, refraction and investigation catalog</h1>
      <p className="small muted">
        A minimum proposed coverage registry of 88 educational activities — not 88 validated diagnostic instruments. {impl} implemented in some form, {88 - impl} planned. No entry has human clinical review.
      </p>
      <div className="row">
        <input type="search" placeholder="Filter…" aria-label="Filter activities" value={q} onChange={(e) => setQ(e.target.value)} style={{ maxWidth: 260 }} />
        <select aria-label="Studio" value={studio} onChange={(e) => setStudio(e.target.value)} style={{ maxWidth: 200 }}>
          <option value="all">All studios</option>
          {STUDIOS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.id} {s.title.slice(0, 28)}
            </option>
          ))}
        </select>
        <select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)} style={{ maxWidth: 180 }}>
          <option value="all">Any status</option>
          <option value="implemented">Implemented (any depth)</option>
          <option value="planned">Planned</option>
        </select>
      </div>
      <div className="panel">
        <ActivityTable rows={rows} />
      </div>
    </div>
  );
}
