import { useEffect, useId, useState, type ReactNode } from 'react';
import { formatRx, lensFromFields, normaliseRxText, parseRx, type ParseResult, type SpheroCyl } from '../domain/optics';

export function Pill({ tone, children, title }: { tone?: 'good' | 'warn' | 'bad' | 'info'; children: ReactNode; title?: string }) {
  return (
    <span className={`pill ${tone ?? ''}`} title={title}>
      {children}
    </span>
  );
}

export function Feedback({ tone, title, items, children }: { tone: 'good' | 'bad' | 'warn' | 'info'; title: string; items?: string[]; children?: ReactNode }) {
  return (
    <div className={`feedback ${tone === 'info' ? '' : tone}`} role="status" aria-live="polite">
      <strong>{title}</strong>
      {items && items.length > 0 && (
        <ul>
          {items.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      )}
      {children}
    </div>
  );
}

export function Seg<T extends string>({ value, options, onChange, label, className }: { value: NoInfer<T>; options: { value: T; label: string }[]; onChange: (v: NoInfer<T>) => void; label: string; className?: string }) {
  return (
    <div className={`seg ${className ?? ''}`} role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={value === o.value} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Parse a dioptre value typed with Unicode minus or comma. Returns NaN when invalid. */
export function parseDioptre(s: string): number {
  const t = normaliseRxText(s).replace(/^plano$|^pl$/, '0').replace(/(\d),(\d)/, '$1.$2').replace(/\s*d$/, '');
  if (!/^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(t)) return NaN;
  return Number(t);
}

export function NumberEntry({ label, value, onChange, unit, id, placeholder, disabled, describedBy }: { label: string; value: string; onChange(v: string): void; unit?: string; id?: string; placeholder?: string; disabled?: boolean; describedBy?: string }) {
  const auto = useId();
  const iid = id ?? auto;
  const bad = value.trim() !== '' && Number.isNaN(parseDioptre(value));
  return (
    <label className="field" htmlFor={iid}>
      <span>
        {label} {unit && <span className="muted tiny">({unit})</span>}
      </span>
      <input id={iid} className="num" type="text" inputMode="decimal" autoComplete="off" value={value} placeholder={placeholder} disabled={disabled} aria-invalid={bad} aria-describedby={describedBy} onChange={(e) => onChange(e.target.value)} />
      {bad && <span className="tiny" style={{ color: 'var(--bad)' }}>Not a number</span>}
    </label>
  );
}

export interface RxEntryState {
  result: ParseResult | null;
  confirmed: boolean;
}

/** Prescription entry: structured fields or free text, with parsed preview and confirmation of interpretations. */
export function RxEntry({ onChange, disabled, initialText, idPrefix }: { onChange(s: RxEntryState): void; disabled?: boolean; initialText?: string; idPrefix?: string }) {
  const [mode, setMode] = useState<'fields' | 'text'>(initialText ? 'text' : 'fields');
  const [sph, setSph] = useState('');
  const [cyl, setCyl] = useState('');
  const [ax, setAx] = useState('');
  const [text, setText] = useState(initialText ?? '');
  const [confirmed, setConfirmed] = useState(false);
  const empty = mode === 'fields' ? sph + cyl + ax === '' : text.trim() === '';
  const result = empty ? null : mode === 'fields' ? lensFromFields(sph, cyl, ax) : parseRx(text);
  const key = JSON.stringify([mode, sph, cyl, ax, text]);
  useEffect(() => {
    setConfirmed(false);
  }, [key]);
  useEffect(() => {
    onChange({ result, confirmed: result?.ok ? result.warnings.length === 0 || confirmed : false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, confirmed]);
  const p = idPrefix ?? 'rx';
  return (
    <div className="stack">
      <Seg label="Entry mode" value={mode} onChange={setMode} options={[{ value: 'fields', label: 'SPH / CYL / AXIS' }, { value: 'text', label: 'Type it' }]} />
      {mode === 'fields' ? (
        <div className="grid cols-3" style={{ gridTemplateColumns: 'repeat(3, minmax(0,1fr))' }}>
          <NumberEntry id={`${p}-sph`} label="SPH" unit="D" value={sph} onChange={setSph} placeholder="e.g. +1.25" disabled={disabled} />
          <NumberEntry id={`${p}-cyl`} label="CYL" unit="D" value={cyl} onChange={setCyl} placeholder="e.g. −0.75" disabled={disabled} />
          <label className="field" htmlFor={`${p}-ax`}>
            <span>
              AXIS <span className="muted tiny">(°)</span>
            </span>
            <input id={`${p}-ax`} className="num" type="text" inputMode="numeric" value={ax} onChange={(e) => setAx(e.target.value)} placeholder="1–180" disabled={disabled} />
          </label>
        </div>
      ) : (
        <label className="field" htmlFor={`${p}-text`}>
          <span>Prescription</span>
          <input id={`${p}-text`} className="num" type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. +1.25 / −0.75 × 015" disabled={disabled} autoComplete="off" spellCheck={false} />
          <span className="tiny muted">Accepts plano/pl, DS, − or -, × or x, optional °.</span>
        </label>
      )}
      {result && !result.ok && <Feedback tone="bad" title="Cannot read this yet" items={result.errors} />}
      {result && result.ok && result.lens && (
        <div className="small">
          Read as: <span className="rx">{formatRx(result.lens)}</span>
          {result.warnings.length > 0 && (
            <div className="feedback warn" style={{ marginTop: 6 }}>
              <ul>
                {result.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
              <label className="row" style={{ marginTop: 4 }}>
                <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} /> Yes, that is what I meant
              </label>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function rxFromState(s: RxEntryState): SpheroCyl | null {
  return s.result?.ok && s.confirmed && s.result.lens ? s.result.lens : null;
}

export function HintLadder({ hints, level, onReveal, disabled }: { hints: readonly string[]; level: number; onReveal(): void; disabled?: boolean }) {
  return (
    <div className="stack small">
      {hints.slice(0, level).map((h, i) => (
        <div key={i} className="feedback">
          <strong>{['Attend to', 'One step', 'Worked solution'][i]}:</strong> {h}
        </div>
      ))}
      {level < hints.length && (
        <button type="button" className="btn sm" onClick={onReveal} disabled={disabled}>
          {level === 0 ? 'Hint (recorded)' : level === 1 ? 'Show one step (recorded)' : 'Show worked solution (recorded)'}
        </button>
      )}
      {level > 0 && <span className="tiny muted">Hints used: {level}/3 — an assisted answer counts as practice, not independent evidence.</span>}
    </div>
  );
}

export type Confidence = 'low' | 'medium' | 'high';
export function ConfidencePicker({ value, onChange }: { value: Confidence | null; onChange(c: Confidence): void }) {
  return (
    <div className="row small">
      <span className="muted">Confidence:</span>
      <Seg label="Confidence" value={(value ?? '') as Confidence} onChange={onChange} options={[{ value: 'low', label: 'Unsure' }, { value: 'medium', label: 'Fairly sure' }, { value: 'high', label: 'Sure' }]} />
    </div>
  );
}

export function Modal({ title, onClose, children, wide }: { title: string; onClose(): void; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    addEventListener('keydown', h);
    return () => removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <div role="dialog" aria-modal="true" aria-label={title} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', display: 'grid', placeItems: 'center', zIndex: 50, padding: 16 }} onClick={onClose}>
      <div className="panel" style={{ maxWidth: wide ? 1000 : 640, width: '100%', maxHeight: '92vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0 }}>{title}</h2>
          <button className="btn sm" onClick={onClose} aria-label="Close">
            Close
          </button>
        </div>
        <div style={{ marginTop: 10 }}>{children}</div>
      </div>
    </div>
  );
}
