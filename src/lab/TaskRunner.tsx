import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../app/context';
import { href } from '../app/router';
import type { OpticsTask, TaskGrade, TaskResponse } from '../domain/missions';
import { fmtAxis, fmtD, formatRx, makeLens, meridionalPower, type SpheroCyl } from '../domain/optics';
import { now } from '../lib/store';
import { ConfidencePicker, Feedback, HintLadder, NumberEntry, RxEntry, parseDioptre, rxFromState, type Confidence, type RxEntryState } from '../ui/kit';
import { CylinderCanvas, PowerGraph } from './OpticsViews';

export type RunnerMode = 'guided' | 'challenge' | 'review' | 'exam';

export function exploreLink(target?: SpheroCyl, proposal?: SpheroCyl | null) {
  const q = new URLSearchParams({ mode: 'explore' });
  if (target) {
    q.set('S', String(target.sphereD));
    q.set('C', String(target.cylinderD));
    q.set('A', String(target.axisDeg ?? 180));
  }
  if (proposal) {
    q.set('pS', String(proposal.sphereD));
    q.set('pC', String(proposal.cylinderD));
    q.set('pA', String(proposal.axisDeg ?? 180));
  }
  return href(`lab/LAB01?${q.toString()}`);
}

export function TaskRunner({
  task, mode, onDone, onNext, examResponse, onExamResponse, compact,
}: {
  task: OpticsTask;
  mode: RunnerMode;
  onDone?(g: TaskGrade): void;
  onNext?(): void;
  /** Exam mode: response is stored by the exam, feedback withheld. */
  examResponse?: TaskResponse | null;
  onExamResponse?(r: TaskResponse | null): void;
  compact?: boolean;
}) {
  const { recordAttempt } = useApp();
  const [probe, setProbe] = useState(task.display.probeDeg ?? 45);
  const [num, setNum] = useState('');
  const [rx, setRx] = useState<RxEntryState>({ result: null, confirmed: false });
  const [choice, setChoice] = useState<string>('');
  const [cross, setCross] = useState({ m1: '', p1: '', m2: '', p2: '' });
  const [confidence, setConfidence] = useState<Confidence | null>(null);
  const [hint, setHint] = useState(0);
  const [grade, setGrade] = useState<TaskGrade | null>(null);
  const [startedAt] = useState(now());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setProbe(task.display.probeDeg ?? 45);
    const er = examResponse;
    setNum(er?.kind === 'number' ? String(er.value) : '');
    setChoice(er?.kind === 'choice' ? er.value : '');
    setCross(er?.kind === 'cross' ? { m1: String(er.m1), p1: String(er.p1), m2: String(er.m2), p2: String(er.p2) } : { m1: '', p1: '', m2: '', p2: '' });
    setConfidence(null);
    setHint(0);
    setGrade(null);
  }, [task.itemId]);

  const response: TaskResponse | null = useMemo(() => {
    if (task.kind === 'number') {
      const v = parseDioptre(num);
      return Number.isFinite(v) ? { kind: 'number', value: v } : null;
    }
    if (task.kind === 'rx') {
      const l = rxFromState(rx);
      return l ? { kind: 'rx', lens: l } : null;
    }
    if (task.kind === 'choice') return choice ? { kind: 'choice', value: choice } : null;
    const vals = [cross.m1, cross.p1, cross.m2, cross.p2].map(parseDioptre);
    if (vals.some((v) => !Number.isFinite(v))) return null;
    return { kind: 'cross', m1: vals[0], p1: vals[1], m2: vals[2], p2: vals[3] };
  }, [task.kind, num, rx, choice, cross]);

  useEffect(() => {
    if (mode === 'exam') onExamResponse?.(response);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, mode]);

  const submit = async () => {
    if (!response || grade) return;
    const g = task.grade(response);
    setSaving(true);
    await recordAttempt({
      itemId: task.itemId, itemVersion: task.itemVersion, familyId: task.familyId, objectiveIds: task.objectiveIds, lectureIds: task.lectureIds,
      seed: task.seed, taskType: task.taskType, mode: mode === 'review' ? 'review' : 'learning', response, correct: g.correct, scores: g.scores,
      confidence, hintLevel: hint, misconceptionIds: g.misconceptionIds, feedback: g.feedback.join(' '), startedAt, isTransfer: task.isTransfer,
      state: { target: task.target ?? null, prompt: task.prompt },
    });
    setSaving(false);
    setGrade(g);
    onDone?.(g);
  };

  const hideLens = !task.display.lens;
  const canvasLens = grade && task.target ? task.target : task.display.lens ?? task.target ?? makeLens(0);
  const showValues = !!grade || !task.display.hideLabels;
  const proposal = grade?.proposal ?? null;
  const exam = mode === 'exam';

  return (
    <div className={compact ? 'stack' : 'grid cols-2'} style={{ alignItems: 'start' }}>
      {(task.display.lens || grade) && !compact && (
        <div className="canvas-wrap">
          <CylinderCanvas
            lens={canvasLens}
            hideLens={hideLens && !grade}
            probeDeg={probe}
            onProbe={setProbe}
            showValues={showValues}
            proposal={proposal}
            notation={task.display.lens || grade ? formatRx(canvasLens) : undefined}
            title="Task lens"
          />
          <div className="readout">
            <div>
              <span>Probe θ</span>
              <b className="num">{fmtAxis(probe)}°</b>
            </div>
            <div>
              <span>F(θ)</span>
              <b className="num">{showValues && !(hideLens && !grade) ? `${fmtD(meridionalPower(canvasLens, probe))} D` : 'hidden'}</b>
            </div>
            {proposal && (
              <div>
                <span>Your lens at θ</span>
                <b className="num" style={{ color: 'var(--proposal)' }}>
                  {fmtD(meridionalPower(proposal, probe))} D
                </b>
              </div>
            )}
          </div>
          {grade && (
            <PowerGraph lens={canvasLens} probeDeg={probe} onProbe={setProbe} proposal={proposal} showCurve title="Target (solid) and your lens (dashed) across meridians" />
          )}
        </div>
      )}
      <div className="stack">
        <div className="row">
          <span className="pill info">{task.title}</span>
          <span className="pill">{task.taskType}</span>
          {task.isTransfer && <span className="pill warn">held-out family</span>}
        </div>
        <p style={{ fontSize: '1.02rem' }}>{task.prompt}</p>
        {task.display.note && <p className="small muted">{task.display.note}</p>}
        {task.kind === 'number' && <NumberEntry id={`n-${task.itemId}`} label="Your answer" unit="D" value={num} onChange={setNum} disabled={!!grade} />}
        {task.kind === 'rx' && (
          <div>
            <RxEntry key={task.itemId} idPrefix={`rx-${task.familyId}`} onChange={setRx} disabled={!!grade} initialText={examResponse?.kind === 'rx' ? formatRx(examResponse.lens) : undefined} />
            {task.requested && task.requested !== 'any' && <p className="small">Requested notation: <b>{task.requested}-cylinder</b>.</p>}
          </div>
        )}
        {task.kind === 'choice' && (
          <fieldset style={{ border: 0, padding: 0, margin: 0 }} disabled={!!grade}>
            <legend className="sr-only">Choose one</legend>
            {task.choices!.map((c) => (
              <label key={c.value} className="row" style={{ padding: '6px 8px', border: '1px solid var(--line)', borderRadius: 8, marginBottom: 6, background: choice === c.value ? 'var(--accent-soft)' : 'var(--surface)' }}>
                <input type="radio" name={`c-${task.itemId}`} value={c.value} checked={choice === c.value} onChange={() => setChoice(c.value)} /> {c.label}
              </label>
            ))}
          </fieldset>
        )}
        {task.kind === 'cross' && (
          <div className="grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0,1fr))' }}>
            <NumberEntry label="Meridian 1" unit="°" value={cross.m1} onChange={(v) => setCross({ ...cross, m1: v })} disabled={!!grade} />
            <NumberEntry label="Power at meridian 1" unit="D" value={cross.p1} onChange={(v) => setCross({ ...cross, p1: v })} disabled={!!grade} />
            <NumberEntry label="Meridian 2" unit="°" value={cross.m2} onChange={(v) => setCross({ ...cross, m2: v })} disabled={!!grade} />
            <NumberEntry label="Power at meridian 2" unit="D" value={cross.p2} onChange={(v) => setCross({ ...cross, p2: v })} disabled={!!grade} />
          </div>
        )}
        {!exam && (
          <>
            <ConfidencePicker value={confidence} onChange={setConfidence} />
            {mode === 'guided' && !grade && <HintLadder hints={task.hints} level={hint} onReveal={() => setHint(hint + 1)} />}
            {!grade && (
              <button className="btn primary" disabled={!response || saving} onClick={submit}>
                Submit answer
              </button>
            )}
          </>
        )}
        {exam && <p className="tiny muted">Exam mode: feedback is withheld until you submit the section.</p>}
        {grade && (
          <>
            <Feedback tone={grade.correct ? 'good' : 'bad'} title={grade.correct ? (hint ? 'Correct with help — practise again unaided' : 'Correct') : 'Not yet'} items={grade.feedback} />
            {confidence === 'high' && !grade.correct && <Feedback tone="warn" title="Confidently wrong" items={['This is worth a contrasting example: open the model with your answer loaded and compare meridian by meridian.']} />}
            {confidence === 'low' && grade.correct && <p className="small muted">Correct but unsure — a delayed check of this family has been scheduled to reinforce the discrimination.</p>}
            <details className="ref">
              <summary>Worked explanation</summary>
              <p>{task.explanation}</p>
            </details>
            <div className="row">
              {task.target && (
                <a className="btn" href={exploreLink(task.target, grade.proposal ?? null)}>
                  Open this model{grade.proposal ? ' with my answer' : ''}
                </a>
              )}
              {onNext && (
                <button className="btn primary" onClick={onNext}>
                  {grade.correct ? 'Next problem' : 'Try a near-transfer problem'}
                </button>
              )}
            </div>
          </>
        )}
        {mode === 'challenge' && !grade && <p className="tiny muted">Independent challenge: labels and hints are hidden.</p>}
        {mode === 'exam' && examResponse === null && <span className="tiny muted">No answer yet.</span>}
      </div>
    </div>
  );
}
