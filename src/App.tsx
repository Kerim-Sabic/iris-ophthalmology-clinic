import { lazy, Suspense, useState } from 'react';
import { AppProvider, useApp } from './app/context';
import { go, href, useRoute } from './app/router';
import { Lab01 } from './lab/Lab01';
import { Today } from './pages/Today';
import { LecturesPage, LectureView } from './pages/Lectures';
import { Laboratory, StudioPage, Catalog } from './pages/Laboratory';
import { Review } from './pages/Review';
import { ExamRoom } from './pages/ExamRoom';
import { Notebook } from './pages/Notebook';
import { SearchPage } from './pages/Search';
import { Settings } from './pages/Settings';
import { Patients } from './pages/Patients';
import { dueReviews } from './domain/learning';

const NAV = [
  { path: 'today', label: 'Today' },
  { path: 'lectures', label: 'Lectures' },
  { path: 'lab', label: 'Laboratory' },
  { path: 'patients', label: 'Patients' },
  { path: 'exam', label: 'Exam Room' },
  { path: 'review', label: 'Review' },
];

// Lazily loaded studios (heavy, independent)
const LazyStudio = lazy(() => import('./lab/registry'));

function Shell() {
  const { ready, storage, saveError, attempts, clockMs, profile } = useApp();
  const route = useRoute();
  const [q, setQ] = useState('');
  const top = route.path[0] ?? 'today';
  const due = dueReviews(attempts, clockMs).length;
  if (!ready) return <p style={{ padding: 24 }}>Opening local study data…</p>;
  let page;
  switch (top) {
    case 'lectures':
      page = route.path[1] ? <LectureView id={route.path[1]} /> : <LecturesPage />;
      break;
    case 'lab':
      if (route.path[1] === 'LAB01') page = <Lab01 query={route.query} />;
      else if (route.path[1] === 'catalog') page = <Catalog />;
      else if (route.path[1])
        page = (
          <Suspense fallback={<p>Loading studio…</p>}>
            <LazyStudio id={route.path[1]} query={route.query} fallback={<StudioPage id={route.path[1]} />} />
          </Suspense>
        );
      else page = <Laboratory />;
      break;
    case 'patients':
      page = <Patients id={route.path[1]} query={route.query} />;
      break;
    case 'exam':
      page = <ExamRoom id={route.path[1]} />;
      break;
    case 'review':
      page = <Review />;
      break;
    case 'notebook':
      page = <Notebook />;
      break;
    case 'search':
      page = <SearchPage q={route.query.get('q') ?? ''} />;
      break;
    case 'settings':
      page = <Settings />;
      break;
    default:
      page = <Today />;
  }
  return (
    <div className="shell">
      <a href="#main" className="sr-only">
        Skip to content
      </a>
      <nav className="nav" aria-label="Primary">
        <div className="brand">
          IRIS
          <small>Ophthalmology teaching clinic</small>
        </div>
        {NAV.map((n) => (
          <a key={n.path} href={href(n.path)} aria-current={top === n.path || (top === '' && n.path === 'today') ? 'page' : undefined}>
            {n.label}
            {n.path === 'review' && due > 0 && <span className="pill info" style={{ marginLeft: 6 }}>{due}</span>}
          </a>
        ))}
        <div className="sep" />
        <a href={href('notebook')} aria-current={top === 'notebook' ? 'page' : undefined}>
          Error notebook
        </a>
        <a href={href('lab/catalog')} aria-current={route.path[1] === 'catalog' ? 'page' : undefined}>
          Test catalog
        </a>
        <a href={href('settings')} aria-current={top === 'settings' ? 'page' : undefined}>
          Data & settings
        </a>
        <div className="foot">
          Guest profile: {profile?.name}
          <br />
          Local data only — not a cloud backup. Educational simulation; not clinical advice.
        </div>
      </nav>
      <main id="main">
        <div className="topbar">
          <form
            className="search"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              go(`search?q=${encodeURIComponent(q)}`);
            }}
          >
            <input type="search" aria-label="Search tests, symptoms, diseases, formulas, notation, misconceptions and notes" placeholder="Search tests, symptoms, formulas, notation, notes…" value={q} onChange={(e) => setQ(e.target.value)} />
          </form>
        </div>
        {storage.kind === 'memory' && (
          <div className="banner warn" role="alert">
            <b>Progress will not be saved.</b> Browser storage is unavailable ({storage.error}). You can still study; export your data before closing the tab.
          </div>
        )}
        {saveError && (
          <div className="banner bad" role="alert">
            {saveError}
          </div>
        )}
        {page}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
