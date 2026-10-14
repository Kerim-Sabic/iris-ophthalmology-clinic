import { useEffect, useState } from 'react';
import { useApp } from '../app/context';
import { href } from '../app/router';
import { LECTURES } from '../content/lectures';
import { FORMULAS, GLOSSARY, MISCONCEPTIONS } from '../content/reference';
import registry from '../content/TEST_REGISTRY.json';
import type { Note } from '../domain/learning';

export function SearchPage({ q }: { q: string }) {
  const { repo, profile } = useApp();
  const [notes, setNotes] = useState<Note[]>([]);
  useEffect(() => {
    if (profile) repo.notes(profile.id).then(setNotes);
  }, [repo, profile]);
  const t = q.trim().toLowerCase();
  const m = (s: string) => t !== '' && s.toLowerCase().includes(t);
  const lectures = LECTURES.filter((l) => m(`${l.id} ${l.title} ${l.emphasis} ${l.essentials.join(' ')}`));
  const tests = registry.entries.filter((e) => m(`${e.id} ${e.activity} ${e.requiredAction}`));
  const gloss = GLOSSARY.filter((g) => m(`${g.term} ${g.aliases.join(' ')} ${g.def}`));
  const forms = FORMULAS.filter((f) => m(`${f.name} ${f.formula} ${f.note}`));
  const mis = Object.entries(MISCONCEPTIONS).filter(([k, v]) => m(`${k} ${v}`));
  const ns = notes.filter((n) => m(n.text));
  const total = lectures.length + tests.length + gloss.length + forms.length + mis.length + ns.length;
  return (
    <div className="stack">
      <h1>Search: “{q}”</h1>
      {t === '' && <p className="muted">Type a test, symptom, disease, formula, notation or misconception in the search box.</p>}
      {t !== '' && total === 0 && <p className="muted">No matches.</p>}
      {gloss.length > 0 && (
        <div className="panel">
          <h2>Glossary & notation</h2>
          <dl>
            {gloss.map((g) => (
              <div key={g.term}>
                <dt><b>{g.term}</b> {g.aliases.length > 0 && <span className="tiny muted">({g.aliases.join(', ')})</span>}</dt>
                <dd style={{ margin: '0 0 8px' }}>{g.def}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
      {forms.length > 0 && (
        <div className="panel">
          <h2>Formulas</h2>
          {forms.map((f) => (
            <p key={f.name}>
              <b>{f.name}:</b> <span className="num">{f.formula}</span> <span className="small muted">— {f.note}</span>
            </p>
          ))}
          <a href={href('lab/LAB01?mode=explore')}>Open the optical bench</a>
        </div>
      )}
      {lectures.length > 0 && (
        <div className="panel">
          <h2>Lectures</h2>
          <ul>
            {lectures.map((l) => (
              <li key={l.id}><a href={href(`lectures/${l.id}`)}>{l.id} {l.title}</a></li>
            ))}
          </ul>
        </div>
      )}
      {tests.length > 0 && (
        <div className="panel">
          <h2>Tests and investigations</h2>
          <ul>
            {tests.map((e) => (
              <li key={e.id}>
                {e.implementedIn ? <a href={href(e.implementedIn)}>{e.id} {e.activity}</a> : `${e.id} ${e.activity}`} <span className="tiny muted">({e.studio}, {e.implementation})</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {mis.length > 0 && (
        <div className="panel">
          <h2>Misconceptions</h2>
          <ul>{mis.map(([k, v]) => <li key={k}>{v} <span className="tiny muted">{k}</span></li>)}</ul>
        </div>
      )}
      {ns.length > 0 && (
        <div className="panel">
          <h2>My notes</h2>
          <ul>{ns.map((n) => <li key={n.id}><a href={href(n.ref.replace('lecture:', 'lectures/'))}>{n.ref}</a>: {n.text.slice(0, 140)}</li>)}</ul>
        </div>
      )}
    </div>
  );
}
