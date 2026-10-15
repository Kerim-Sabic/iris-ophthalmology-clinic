import { useEffect, useState } from 'react';
import { useApp } from '../app/context';
import { href } from '../app/router';
import {
  LOCALISATIONS, clinicalNote, fieldPatternOptions, gradeClinical, observe,
  type ClinicalAction, type ClinicalAnswer, type ClinicalCaseDef, type ClinicalGrade, type Localisation,
} from '../domain/cases';
import { QUADS, quadName, type QuadKey } from '../domain/fields';
import { MOTILITY_FINDING_LABELS, type MotilityFinding, type Occluder } from '../domain/motility';
import { PUPIL_FINDING_LABELS, type PupilFinding } from '../domain/pupils';
import { now } from '../lib/store';
import { Feedback, Pill, Seg } from '../ui/kit';

type Eye = 'OD' | 'OS';
interface Progress {
  actions: ClinicalAction[];
  startedAt: number;
  submitted?: boolean;
}

const same = (a: ClinicalAction, b: ClinicalAction) => JSON.stringify(a) === JSON.stringify(b);

/** Non-refractive patient: history, acuity, pupils (LAB05 model), fields (LAB07 model), cover test (LAB06 model). */
export function ClinicalCaseView({ c }: { c: ClinicalCaseDef }) {
  const { repo, profile, recordAttempt } = useApp();
  const key = `mission:case:${c.id}`;
  const [p, setP] = useState<Progress | null>(null);
  const [eye, setEye] = useState<Eye>('OD');
  const [cover, setCover] = useState<Occluder[]>([]);
  const [ans, setAns] = useState<ClinicalAnswer>({ pupil: '', fieldPattern: '', motility: '', localisation: '', next: '' });
  const [assessment, setAssessment] = useState('');
  const [grade, setGrade] = useState<ClinicalGrade | null>(null);
  useEffect(() => {
    if (profile) repo.getKV<Progress>(profile.id, key).then((s) => setP(s ?? { actions: [], startedAt: now() }));
  }, [profile, repo, key]);
  if (!p) return <p>Loading…</p>;
  const save = async (np: Progress) => {
    setP(np);
    if (profile) await repo.setKV(profile.id, key, np);
  };
  const act = (a: ClinicalAction) => !p.actions.some((x) => same(x, a)) && save({ ...p, actions: [...p.actions, a] });
  const did = (a: ClinicalAction) => p.actions.some((x) => same(x, a));
  const last = (pred: (a: ClinicalAction) => boolean) => [...p.actions].reverse().find(pred);

  const submit = async () => {
    const g = gradeClinical(c, p.actions, ans);
    await recordAttempt({
      itemId: `CASE-${c.id}`, itemVersion: 1, familyId: `CASE-${c.family.toUpperCase()}`,
      objectiveIds: c.family === 'alignment' ? ['MOT-TROPIA-PHORIA'] : c.family === 'efferent-pupil' ? ['PUP-ANISO', 'PUP-AFF-EFF'] : c.family === 'afferent-pathway' ? ['PUP-RAPD', 'FLD-LOCALIZE'] : ['FLD-LOCALIZE'],
      lectureIds: c.family === 'alignment' ? ['L10', 'L26'] : c.family === 'efferent-pupil' ? ['L09', 'L25'] : ['L11', 'L24', 'L09'],
      seed: null, taskType: 'patient-case', mode: 'learning', response: { ans, assessment, actions: p.actions }, correct: g.correct, scores: g.dims,
      confidence: null, hintLevel: 0, misconceptionIds: g.misconceptionIds, startedAt: p.startedAt, state: { caseId: c.id },
    });
    setGrade(g);
    save({ ...p, submitted: true });
  };

  const pupilBtn = (test: 'light-dark' | 'direct-OD' | 'direct-OS' | 'swing', label: string) => (
    <button className={`btn sm ${did({ kind: 'pupil', test }) ? 'primary' : ''}`} onClick={() => act({ kind: 'pupil', test })}>
      {label}
    </button>
  );

  return (
    <div className="stack" data-testid="clinical-case">
      <a className="small" href={href('patients')}>
        ← Patients
      </a>
      <h1>
        {c.label}: {c.name}, {c.age}
      </h1>
      <p>{c.complaint}</p>
      <div className="row small">
        <Pill tone="warn">draft · not clinically reviewed</Pill>
        <span className="muted">Fictional patient. Pupils, fields and cover test use the same models as LAB05, LAB07 and LAB06; findings are schematic.</span>
        <button className="btn sm ghost" onClick={() => { if (confirm('Restart this case? Submitted attempts stay in your history.')) { save({ actions: [], startedAt: now() }); setGrade(null); setCover([]); } }}>
          Restart case
        </button>
      </div>
      <div className="grid cols-2" style={{ alignItems: 'start' }}>
        <div className="panel stack">
          <h2>History</h2>
          {c.history.map((h, i) =>
            did({ kind: 'history', i }) ? (
              <p key={i} className="small">
                <b>{h.q}</b> {h.a}
              </p>
            ) : (
              <button key={i} className="btn sm" onClick={() => act({ kind: 'history', i })}>
                Ask: {h.q}
              </button>
            ),
          )}
          <h2>Visual acuity</h2>
          <div className="row">
            {(['OD', 'OS'] as Eye[]).flatMap((e) => [false, true].map((ph) => (
              <button key={e + ph} className={`btn sm ${did({ kind: 'va', eye: e, pinhole: ph }) ? 'primary' : ''}`} onClick={() => act({ kind: 'va', eye: e, pinhole: ph })}>
                {e} {ph ? 'pinhole' : 'unaided'}
              </button>
            )))}
          </div>
        </div>
        <div className="panel stack">
          <h2>Pupils</h2>
          <div className="row">
            {pupilBtn('light-dark', 'Resting size: light vs dark')}
            {pupilBtn('direct-OD', 'Light in OD')}
            {pupilBtn('direct-OS', 'Light in OS')}
            {pupilBtn('swing', 'Swinging light')}
          </div>
          <a className="small" href={href('lab/LAB05')}>Open the pupil studio for the underlying model</a>
          <h2>Cover test</h2>
          <p className="small muted">Build a sequence of occluder positions, then perform it. Each stage names the covered eye and the eye to watch.</p>
          <div className="row">
            {(['OD', 'OS', 'none'] as Occluder[]).map((o) => (
              <button key={o} className="btn sm" onClick={() => setCover([...cover, o])}>
                {o === 'none' ? 'Uncover' : `Cover ${o}`}
              </button>
            ))}
            <button className="btn sm ghost" onClick={() => setCover([])}>Clear</button>
          </div>
          <div className="small num" data-testid="cover-seq">Sequence: {cover.length ? cover.map((o) => (o === 'none' ? 'uncover' : `cover ${o}`)).join(' → ') : '—'}</div>
          <button className="btn sm primary" disabled={!cover.length} onClick={() => { act({ kind: 'cover', sequence: cover }); setCover([]); }}>
            Perform sequence
          </button>
        </div>
      </div>
      <div className="panel stack">
        <h2>Visual fields</h2>
        <div className="row">
          <Seg label="Eye tested" value={eye} onChange={setEye} options={[{ value: 'OD', label: 'Test OD (OS covered)' }, { value: 'OS', label: 'Test OS (OD covered)' }]} />
          {QUADS.map((q: QuadKey) => (
            <button key={q} className={`btn sm ${did({ kind: 'confrontation', eye, quad: q }) ? 'primary' : ''}`} onClick={() => act({ kind: 'confrontation', eye, quad: q })}>
              Confront {eye}: patient&rsquo;s {quadName(q)}
            </button>
          ))}
          <button className={`btn sm ${did({ kind: 'perimetry' }) ? 'primary' : ''}`} onClick={() => act({ kind: 'perimetry' })}>
            Request automated field
          </button>
        </div>
      </div>
      <div className="grid cols-2" style={{ alignItems: 'start' }}>
        <div className="panel">
          <h2>Observations (from what you did)</h2>
          {p.actions.length === 0 ? (
            <p className="small muted">Nothing examined yet.</p>
          ) : (
            <ol className="small" data-testid="clinical-observations">
              {p.actions.map((a, i) => (
                <li key={i}>{a.kind === 'cover' ? <ul>{observe(c, a).split(' | ').map((t, j) => <li key={j}>{t}</li>)}</ul> : observe(c, a)}</li>
              ))}
            </ol>
          )}
          {last((a) => a.kind === 'cover') && <p className="tiny muted">Movements are described in patient terms: IN = toward the nose.</p>}
        </div>
        <div className="panel stack" data-testid="clinical-notebook">
          <h2>Notebook</h2>
          <label className="field">
            <span>Pupils</span>
            <select aria-label="Pupil finding" value={ans.pupil} onChange={(e) => setAns({ ...ans, pupil: e.target.value as PupilFinding })} disabled={!!grade}>
              <option value="">Choose…</option>
              <option value="not-examined">Not examined</option>
              {(Object.keys(PUPIL_FINDING_LABELS) as PupilFinding[]).map((k) => (
                <option key={k} value={k}>{PUPIL_FINDING_LABELS[k]}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Visual fields</span>
            <select aria-label="Field pattern" value={ans.fieldPattern} onChange={(e) => setAns({ ...ans, fieldPattern: e.target.value })} disabled={!!grade}>
              <option value="">Choose…</option>
              <option value="not-examined">Not examined</option>
              {fieldPatternOptions().map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Alignment</span>
            <select aria-label="Alignment finding" value={ans.motility} onChange={(e) => setAns({ ...ans, motility: e.target.value as MotilityFinding })} disabled={!!grade}>
              <option value="">Choose…</option>
              <option value="not-examined">Not examined</option>
              {(Object.keys(MOTILITY_FINDING_LABELS) as MotilityFinding[]).map((k) => (
                <option key={k} value={k}>{MOTILITY_FINDING_LABELS[k]}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Localisation</span>
            <select aria-label="Localisation finding" value={ans.localisation} onChange={(e) => setAns({ ...ans, localisation: e.target.value as Localisation })} disabled={!!grade}>
              <option value="">Choose…</option>
              {(Object.keys(LOCALISATIONS) as Localisation[]).map((k) => (
                <option key={k} value={k}>{LOCALISATIONS[k]}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Working assessment / uncertainty (free text; self-assessed)</span>
            <textarea value={assessment} onChange={(e) => setAssessment(e.target.value)} disabled={!!grade} />
          </label>
          <label className="field">
            <span>Next action</span>
            <select aria-label="Next action choice" value={ans.next} onChange={(e) => setAns({ ...ans, next: e.target.value })} disabled={!!grade}>
              <option value="">Choose…</option>
              {c.nextActions.map((n) => (
                <option key={n.value} value={n.value}>{n.label}</option>
              ))}
            </select>
          </label>
          {!grade && (
            <button className="btn primary" onClick={submit} data-testid="submit-clinical">
              Submit assessment
            </button>
          )}
          {grade && (
            <>
              <table className="data small" data-testid="clinical-dims">
                <tbody>
                  {Object.entries(grade.dims).map(([k, v]) => (
                    <tr key={k}>
                      <td>{k}</td>
                      <td>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Feedback tone={grade.correct ? 'good' : 'warn'} title={grade.correct ? 'Assessment supported by your evidence' : 'Some dimensions are unsupported or incorrect'} items={grade.feedback} />
            </>
          )}
        </div>
      </div>
      <div className="panel">
        <h2>Generated note (from obtained evidence only)</h2>
        <ul className="small" data-testid="clinical-note">
          {clinicalNote(c, p.actions).map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
        <p className="tiny muted">Fictional educational note — not a clinical record.</p>
      </div>
    </div>
  );
}
