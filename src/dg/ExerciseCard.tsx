import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../app/context';
import {
  diagnosePair, gradePair, parseVisusLine, parseWrittenDiagnosis,
  type DgExercise, type Eye, type EyeAnswer, type PairAnswer, type PairGrade,
} from '../domain/diagnosis';
import { now } from '../lib/store';
import { Feedback, Seg } from '../ui/kit';
import { AnnotatedLine, ClassRuleTable, DerivationPlayer, EyeComposer, NearPanel, PowerCross, TokenExplain, composeSentence, emptyEyeAnswer } from './DgViews';

export type DgMode = 'learn' | 'practice' | 'exam' | 'review';

export interface DgExamAnswer {
  inputMode: 'build' | 'write';
  eyes: Partial<Record<Eye, EyeAnswer>>;
  aniso: boolean;
  presbyopia?: boolean;
  text: string;
}

export function toPairAnswer(a: DgExamAnswer): PairAnswer {
  if (a.inputMode === 'write') return parseWrittenDiagnosis(a.text).answer;
  return { eyes: a.eyes, anisometropia: a.aniso, unsupported: [], presbyopia: !!a.presbyopia };
}

export function DgExerciseCard({
  exercise, mode, onGraded, onNext, examAnswer, onExamAnswer, defaultInput = 'build', number,
}: {
  exercise: DgExercise;
  mode: DgMode;
  onGraded?(g: PairGrade): void;
  onNext?(): void;
  examAnswer?: DgExamAnswer | null;
  onExamAnswer?(a: DgExamAnswer): void;
  defaultInput?: 'build' | 'write';
  number?: number;
}) {
  const { recordAttempt } = useApp();
  const lines = useMemo(() => exercise.lines.map(parseVisusLine), [exercise]);
  const pair = useMemo(() => diagnosePair(lines), [lines]);
  const eyes = pair.eyes.map((e) => e.eye);
  const distanceLines = lines.filter((l) => l.role === 'distance');
  const init = (): DgExamAnswer => examAnswer ?? { inputMode: defaultInput, eyes: Object.fromEntries(eyes.map((e) => [e, emptyEyeAnswer()])), aniso: false, text: '' };
  const [ans, setAns] = useState<DgExamAnswer>(init);
  const [sel, setSel] = useState<Record<number, number | null>>({});
  const [hint, setHint] = useState(0);
  const [grade, setGrade] = useState<PairGrade | null>(null);
  const [solution, setSolution] = useState<number | null>(null);
  const [start] = useState(now());
  const exam = mode === 'exam';
  useEffect(() => {
    setAns(init());
    setSel({});
    setHint(0);
    setGrade(null);
    setSolution(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id]);
  const update = (a: DgExamAnswer) => {
    setAns(a);
    if (exam) onExamAnswer?.(a);
  };
  const parsed = ans.inputMode === 'write' && ans.text.trim() ? parseWrittenDiagnosis(ans.text) : null;
  const pairAnswer = toPairAnswer(ans);
  const ready = ans.inputMode === 'write' ? ans.text.trim().length > 3 : eyes.every((e) => ans.eyes[e]?.cls);

  const submit = async () => {
    const g = gradePair(pair, pairAnswer);
    setGrade(g);
    onGraded?.(g);
    const objs = ['DG-WRITE'];
    if (pair.eyes.some((e) => e.outcome.kind === 'refractive' && e.outcome.orientation)) objs.push('DG-ORIENT');
    if (pair.anisometropia !== 'no') objs.push('DG-ANISO');
    await recordAttempt({
      itemId: exercise.id, itemVersion: 1, familyId: exercise.familyId, objectiveIds: objs, lectureIds: ['L04', 'L05', 'L36'], seed: null,
      taskType: ans.inputMode === 'build' ? 'dg-composer' : 'dg-free-text', mode: mode === 'review' ? 'review' : 'learning', response: ans, correct: g.correct,
      scores: Object.fromEntries(g.eyes.flatMap((e) => [[`${e.eye} diagnosis`, e.classOk], [`${e.eye} direction`, e.orientationOk === null ? 'n/a' : e.orientationOk], [`${e.eye} reduced BCVA noted`, e.bcvaOk === null ? 'n/a' : e.bcvaOk]])),
      confidence: null, hintLevel: hint, misconceptionIds: [...new Set(g.eyes.flatMap((e) => e.misconceptionIds))], feedback: g.eyes.flatMap((e) => e.feedback).join(' '), startedAt: start,
      isTransfer: exercise.source === 'generated' && mode === 'review', state: { lines: exercise.lines },
    });
  };

  return (
    <div className="dg-card stack" data-testid="dg-card">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <b>{number !== undefined ? `Case ${number}` : exercise.source === 'lecture' ? `Lecture example ${exercise.id.replace('LEC-', '')}` : exercise.id.startsWith('PRES-') ? `Presbyopia example ${exercise.id.replace('PRES-', '')} (app-written)` : 'Practice case'}</b>
        {exercise.source === 'generated' && <span className="tiny muted">Fictional generated case · acuities illustrative</span>}
      </div>
      {lines.map((l, k) => (
        <div key={k} className="stack" style={{ gap: 4 }}>
          <AnnotatedLine line={l} big selected={sel[k] ?? null} onSelect={(i) => setSel({ ...sel, [k]: i })} disabled={exam} />
          {!exam && sel[k] !== undefined && sel[k] !== null && <TokenExplain line={l} index={sel[k] ?? null} />}
          {l.warnings.length > 0 && !exam && <span className="tiny" style={{ color: 'var(--warn)' }}>⚠ {l.warnings.join(' ')}</span>}
        </div>
      ))}
      {!exam && !grade && <p className="tiny muted">Tip: click any coloured part of a line to see what it means.</p>}

      <div className="panel stack" style={{ padding: 12 }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <b>Your diagnosis</b>
          <Seg label="Answer style" value={ans.inputMode} onChange={(m) => update({ ...ans, inputMode: m })} options={[{ value: 'build', label: 'Build it' }, { value: 'write', label: 'Write it myself' }]} />
        </div>
        {ans.inputMode === 'build' ? (
          <>
            <div className="grid cols-2">
              {eyes.map((e) => (
                <EyeComposer key={e} eye={e} value={ans.eyes[e] ?? emptyEyeAnswer()} onChange={(v) => update({ ...ans, eyes: { ...ans.eyes, [e]: v } })} disabled={!!grade} />
              ))}
            </div>
            <label className="row small">
              <input type="checkbox" checked={ans.aniso} disabled={!!grade} onChange={(e) => update({ ...ans, aniso: e.target.checked })} /> The two eyes differ a lot → also write Anisometropia
            </label>
            <label className="row small">
              <input type="checkbox" checked={!!ans.presbyopia} disabled={!!grade} onChange={(e) => update({ ...ans, presbyopia: e.target.checked })} /> A near addition was needed → also write Presbyopia
            </label>
            <div className="dg-preview num" aria-live="polite">{composeSentence(ans.eyes, ans.aniso, ans.presbyopia)}</div>
          </>
        ) : (
          <>
            <label className="field">
              <span>Write it as you would on paper</span>
              <textarea data-testid="dg-text" value={ans.text} disabled={!!grade} onChange={(e) => update({ ...ans, text: e.target.value })} placeholder="Dg: … OD; … OS" style={{ minHeight: 70 }} spellCheck={false} />
            </label>
            {parsed && (
              <div className="small">
                <b>We read:</b> {parsed.readAs.length ? parsed.readAs.join(' · ') : 'nothing yet'}
                {parsed.problems.length > 0 && <div style={{ color: 'var(--warn)' }}>⚠ {parsed.problems.join(' ')}</div>}
              </div>
            )}
            <p className="tiny muted">Latin, English or Bosnian/Croatian/Serbian terms are understood. Always label each eye (OD / OS or OU).</p>
          </>
        )}
        {!exam && !grade && (
          <div className="row">
            <button className="btn primary" disabled={!ready} onClick={submit} data-testid="dg-check">
              Check my diagnosis
            </button>
            {mode !== 'review' && hint < 3 && (
              <button className="btn sm" onClick={() => setHint(hint + 1)}>
                {['Hint: show the power crosses', 'Hint: show the naming rule', 'Show the full solution'][hint]} (recorded)
              </button>
            )}
          </div>
        )}
      </div>

      {!grade && hint >= 1 && (
        <div className="grid cols-2">
          {distanceLines.map((l, k) =>
            l.cc ? (
              <div key={k} className="canvas-wrap">
                <div className="small">
                  <b>{l.eye}</b>: power in each main direction
                </div>
                <PowerCross lens={l.cc.lens} size={220} />
              </div>
            ) : (
              <div key={k} className="canvas-wrap small">
                <b>{l.eye}</b>: no lens — look at the acuity without glasses.
              </div>
            ),
          )}
        </div>
      )}
      {!grade && hint >= 2 && <ClassRuleTable />}
      {!grade && hint >= 3 && distanceLines.map((l, k) => <DerivationPlayer key={k} line={l} />)}

      {grade && (
        <div className="stack" data-testid="dg-result">
          <Feedback tone={grade.correct ? 'good' : 'bad'} title={grade.correct ? (hint ? 'Correct — with hints, so practise once more unaided' : 'Correct!') : 'Not quite — see what differs'} />
          <table className="data">
            <thead>
              <tr>
                <th>Eye</th>
                <th>Diagnosis</th>
                <th>Direction</th>
                <th>Corrected vision &lt; 1.0 noted</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {grade.eyes.map((e, k) => (
                <tr key={e.eye}>
                  <td>
                    <b>{e.eye}</b>
                  </td>
                  <td>{e.classOk ? '✓' : '✗'} <span className="small">{e.expected.latin.replace(/ (OD|OS|OU)$/, '')}</span></td>
                  <td>{e.orientationOk === null ? '—' : e.orientationOk ? '✓' : '○ optional'}</td>
                  <td>{e.bcvaOk === null ? '—' : e.bcvaOk ? '✓' : '✗'}</td>
                  <td>
                    <button className="btn sm" onClick={() => setSolution(solution === k ? null : k)} data-testid={`solve-${e.eye}`}>
                      {solution === k ? 'Hide' : 'Show me how'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ul className="small" style={{ margin: 0 }}>
            {grade.eyes.flatMap((e) => e.feedback).filter((f) => !f.endsWith('✓')).map((f) => (
              <li key={f}>{f}</li>
            ))}
            {pair.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
            {grade.presbyopiaFeedback && <li>{grade.presbyopiaFeedback}</li>}
            {!grade.anisometropiaOk && <li>{pair.anisometropia === 'expected' ? 'Anisometropia should be mentioned.' : 'Anisometropia is not supported by such a small difference.'}</li>}
            {grade.unsupported.map((u) => (
              <li key={u}>Remove: {u}.</li>
            ))}
          </ul>
          <div className="model-answer">
            <span className="tiny muted">Model answer</span>
            <div className="num">{grade.modelAnswer}</div>
          </div>
          {pair.presbyopia.status === 'expected' && (
            <NearPanel addD={pair.presbyopia.addD!} ageY={pair.presbyopia.ageY} rows={pair.presbyopia.nearLenses.map((n) => ({ eye: n.eye, near: n.lens, distance: lines.find((l) => l.role === 'distance' && l.eye === n.eye)?.cc?.lens ?? null }))} />
          )}
          {solution !== null && distanceLines[solution] && <DerivationPlayer line={distanceLines[solution]} />}
          {onNext && (
            <button className="btn primary" onClick={onNext} data-testid="dg-next">
              Next case ▶
            </button>
          )}
        </div>
      )}
    </div>
  );
}
