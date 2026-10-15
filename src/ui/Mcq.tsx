import { useEffect, useState } from 'react';
import { useApp } from '../app/context';
import { MISCONCEPTIONS } from '../content/reference';
import type { McqItem } from '../content/schema';
import { now } from '../lib/store';
import { ConfidencePicker, Feedback, type Confidence } from './kit';
import { Glossed } from './Glossed';

/** Shuffle options deterministically per item so position memory is not rewarded. */
export function optionOrder(item: McqItem, seed: number) {
  const idx = item.options.map((_, i) => i);
  let s = seed + item.id.length * 31;
  for (let i = idx.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
}

export function McqRunner({
  item, lectureId, mode, onDone, examValue, onExamValue, seed = 7,
}: {
  item: McqItem;
  lectureId: string;
  mode: 'learning' | 'review' | 'exam';
  onDone?(correct: boolean): void;
  examValue?: number | null;
  onExamValue?(v: number | null): void;
  seed?: number;
}) {
  const { recordAttempt, repo, profile, flags, refresh } = useApp();
  const [sel, setSel] = useState<number | null>(examValue ?? null);
  const [conf, setConf] = useState<Confidence | null>(null);
  const [done, setDone] = useState<boolean | null>(null);
  const [start] = useState(now());
  const order = optionOrder(item, seed);
  const flagged = flags.some((f) => f.itemId === item.id);
  useEffect(() => {
    setSel(examValue ?? null);
    setDone(null);
    setConf(null);
  }, [item.id]);
  const submit = async () => {
    if (sel === null) return;
    const ok = sel === item.answerIndex;
    await recordAttempt({
      itemId: item.id, itemVersion: item.version, familyId: item.familyId, objectiveIds: item.objectiveIds, lectureIds: [lectureId], seed: null,
      taskType: 'mcq', mode, response: { choice: sel }, correct: ok, scores: { choice: sel }, confidence: conf, hintLevel: 0,
      misconceptionIds: ok ? [] : item.misconceptionIds, startedAt: start, isTransfer: item.pool === 'exam',
    });
    setDone(ok);
    onDone?.(ok);
  };
  return (
    <div className="stack">
      <p style={{ fontSize: '1.02rem' }}>{item.stem}</p>
      <fieldset style={{ border: 0, padding: 0, margin: 0 }} disabled={done !== null}>
        <legend className="sr-only">Options</legend>
        {order.map((i) => (
          <label key={i} className="row" style={{ padding: '6px 8px', border: '1px solid var(--line)', borderRadius: 8, marginBottom: 6, background: done !== null && i === item.answerIndex ? 'var(--good-soft)' : done !== null && i === sel ? 'var(--bad-soft)' : sel === i ? 'var(--accent-soft)' : 'var(--surface)' }}>
            <input
              type="radio"
              name={`mcq-${item.id}`}
              checked={sel === i}
              onChange={() => {
                setSel(i);
                if (mode === 'exam') onExamValue?.(i);
              }}
            />
            {item.options[i]}
          </label>
        ))}
      </fieldset>
      {mode !== 'exam' && done === null && (
        <>
          <ConfidencePicker value={conf} onChange={setConf} />
          <button className="btn primary" disabled={sel === null} onClick={submit}>
            Submit
          </button>
        </>
      )}
      {done !== null && sel !== null && (
        <Feedback tone={done ? 'good' : 'bad'} title={done ? 'Correct' : 'Not correct'} items={[...(done ? [] : [item.distractorRationale[sel] || 'This option is not supported.']), ...(done ? [] : item.misconceptionIds.map((m) => `Possible misconception: ${MISCONCEPTIONS[m] ?? m}`))]}>
          <p style={{ margin: '6px 0 0' }} data-testid="mcq-explanation">
            <b>Why: </b>
            <Glossed text={item.explanation} />
          </p>
        </Feedback>
      )}
      <div className="row tiny muted">
        <span>
          {item.id} v{item.version} · family {item.familyId} · {item.reviewStatus}
        </span>
        <button
          className="btn sm ghost"
          disabled={flagged}
          onClick={async () => {
            const reason = prompt('What is ambiguous or wrong about this question?');
            if (reason && profile) {
              await repo.flag(profile.id, item.id, reason);
              await refresh();
            }
          }}
        >
          {flagged ? 'Flagged — excluded from your exam scoring' : 'Flag as ambiguous'}
        </button>
      </div>
    </div>
  );
}
