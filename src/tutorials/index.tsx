import { useState } from 'react';
import { href } from '../app/router';
import { Modal } from '../ui/kit';
import { TutorialPlayer, type TutorialDef } from './Player';
import { SCENES } from './scenes';
import script from './script.json';

export const TUTORIALS: TutorialDef[] = script.tutorials as TutorialDef[];
export const tutorialById = (id: string) => TUTORIALS.find((t) => t.id === id);
/** Tutorials that explain a given studio (first one is the main one). */
export const tutorialsForStudio = (studio: string) => TUTORIALS.filter((t) => t.studio === studio);

export function TutorialView({ id, autoStart, onClose }: { id: string; autoStart?: boolean; onClose?(): void }) {
  const t = tutorialById(id);
  if (!t) return <p>Tutorial not found.</p>;
  return <TutorialPlayer key={id} tutorial={t} scene={SCENES[id]} autoStart={autoStart} onClose={onClose} />;
}

/** "Watch tutorial" button that opens the player in a dialog. */
export function WatchTutorial({ id, label, primary }: { id: string; label?: string; primary?: boolean }) {
  const [open, setOpen] = useState(false);
  const t = tutorialById(id);
  if (!t) return null;
  return (
    <>
      <button className={`btn ${primary ? 'primary' : 'sm'} watch-btn`} onClick={() => setOpen(true)} data-testid={`watch-${id}`}>
        ▶ {label ?? `Watch: ${t.title}`}
      </button>
      {open && (
        <Modal title={t.title} onClose={() => setOpen(false)} wide>
          <TutorialView id={id} autoStart onClose={() => setOpen(false)} />
        </Modal>
      )}
    </>
  );
}

export function LearnPage({ id }: { id?: string }) {
  if (id) {
    return (
      <div className="stack">
        <a className="small" href={href('learn')}>
          ← All tutorials
        </a>
        <div className="panel">
          <TutorialView id={id} />
        </div>
      </div>
    );
  }
  const groups = [...new Set(TUTORIALS.map((t) => t.level))];
  return (
    <div className="stack">
      <h1>Start here: short animated tutorials</h1>
      <p className="muted">Each one takes 2–3 minutes. Press play and listen, or read the captions. Then open the instrument and try it yourself.</p>
      {groups.map((g) => (
        <div key={g} className="stack">
          <h2>{g}</h2>
          <div className="cards">
            {TUTORIALS.filter((t) => t.level === g).map((t) => (
              <a key={t.id} className="card tutorial-card" href={href(`learn/${t.id}`)} data-testid={`tutorial-${t.id}`}>
                <div className="tutorial-thumb" aria-hidden>▶</div>
                <h3>{t.title}</h3>
                <span className="small muted">
                  {t.steps.length} steps · about {t.minutes} min{t.studio ? ` · then try ${t.studio}` : ''}
                </span>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
