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
import { LearnPage, WatchTutorial, tutorialsForStudio } from './tutorials';

const NAV = [
  { path: 'learn', label: '▶ Start here' },
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
    case 'learn':
      page = <LearnPage id={route.path[1]} />;
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
        <HelpBar top={top} sub={route.path[1]} />
        {page}
      </main>
    </div>
  );
}

const HOWTO: Record<string, string[]> = {
  LAB01: ['Start with the Intro mission: predict, then check each answer.', 'In Explore, drag the purple handle or use the arrow keys to measure any direction.', 'Stuck? Guided practice gives up to three hints; Challenge hides them.'],
  LAB02: ['Pick a working distance, then press Sweep and watch the glow in the pupil.', 'With motion → add plus; against → add minus; whole pupil lights up → neutral, press Record.', 'Do both directions (vertical and horizontal streak), then write gross and net.'],
  LAB03: ['Read the note on the left, then fill OD (right eye) and OS (left eye) separately.', 'Use the notation asked for (plus or minus cylinder).', 'Lensometer tab: turn the power wheel until the lines are sharp, then record it.'],
  LAB04: ['Choose the eye, glasses or not, and distance; then present the chart.', 'Write what the patient read, e.g. 6/12. If they read nothing at 6 m, move closer.', 'Pinhole: if vision improves, the cause is probably optical.'],
  LAB05: ['Pick the room light, then shine the torch in one eye and watch BOTH pupils.', 'Swing the light between the eyes: both pupils widening on one side = afferent defect.', 'Compare sizes in light and dark to sort out unequal pupils.'],
  LAB06: ['Cover the eye that looks straight and watch the OTHER eye.', 'If it moves to look at the target, it was turned: a tropia.', 'If nothing moves until you uncover, it is a phoria.'],
  LAB07: ['Click a place on the pathway to see which parts of vision disappear.', 'Same half missing in both eyes → behind the chiasm, opposite side of the brain.', 'Outer halves missing in both eyes → chiasm.'],
  LAB08: ['Start with a wide beam to look around.', 'Make the beam thin and the angle wide to see which layer something is in.', 'Only document layers you actually looked at.'],
};

/** Plain-language pointer to the tutorial and a 3-step how-to for the current screen. */
function HelpBar({ top, sub }: { top: string; sub?: string }) {
  let ids: string[] = [];
  let text = '';
  let howto: string[] = [];
  if (top === 'lab' && sub && sub !== 'catalog') {
    ids = tutorialsForStudio(sub).map((t) => t.id);
    howto = HOWTO[sub] ?? [];
    text = 'How to use this screen:';
  } else if (top === 'patients') {
    ids = ['note'];
    text = 'Ask questions, do the tests you think you need, then write your note. Only what you examined counts.';
  }
  if (!ids.length && !howto.length) return null;
  return (
    <div className="help-bar" data-testid="help-bar">
      <div style={{ flex: 1, minWidth: 220 }}>
        <span className="small"><b>{text}</b></span>
        {howto.length > 0 && (
          <ol className="howto small">
            {howto.map((h) => <li key={h}>{h}</li>)}
          </ol>
        )}
      </div>
      {ids.map((id, i) => <WatchTutorial key={id} id={id} primary={i === 0} />)}
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
