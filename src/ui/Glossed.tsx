import { useEffect, useId, useRef, useState } from 'react';
import { segmentTerms, type PlainTerm, type Segment } from '../content/plainTerms';
import { WatchTutorial } from '../tutorials';

/** Renders text with jargon turned into tappable terms that explain themselves in plain English. */
export function Glossed({ text, segments }: { text: string; segments?: Segment[] }) {
  return (
    <>
      {(segments ?? segmentTerms(text)).map((s, i) => (s.term ? <TermLink key={i} text={s.text} term={s.term} /> : <span key={i}>{s.text}</span>))}
    </>
  );
}

function TermLink({ text, term }: { text: string; term: PlainTerm }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);
  return (
    <span className="term" ref={ref}>
      <button type="button" className="term-link" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)} data-term={term.id}>
        {text}
      </button>
      {open && (
        <span className="term-card" id={id} role="note">
          <b>{term.word}</b>
          <span>{term.plain}</span>
          {term.tutorial && (
            <span className="term-watch">
              <WatchTutorial id={term.tutorial} label="See it animated" />
            </span>
          )}
        </span>
      )}
    </span>
  );
}

/** Segment several paragraphs so each term is linked only once across all of them (pure: call during render). */
export function segmentParagraphs(paras: string[]): Segment[][] {
  const used = new Set<string>();
  return paras.map((p) => segmentTerms(p, used));
}
