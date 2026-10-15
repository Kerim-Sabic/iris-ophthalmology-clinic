import { useEffect, useState } from 'react';
import { useApp } from '../app/context';
import { href } from '../app/router';
import { CASES, CLINICAL_CASES, caseById, clinicalCaseById, expectedClass, type CaseDef, type Eye } from '../domain/cases';
import { ClinicalCaseView } from './ClinicalCase';
import { CLASS_LABEL, fmtD, formatRx, gradeLens, makeLens, worstMeridian, subMatrices, toMatrix, type RefractiveClass, type SpheroCyl } from '../domain/optics';
import { JccTool } from '../lab/JccTool';
import { Retinoscope, type RetinoRecord } from '../lab/Retinoscope';
import { now } from '../lib/store';
import { Feedback, Pill, RxEntry, Seg, rxFromState, type RxEntryState } from '../ui/kit';

type Action = { kind: 'history'; i: number } | { kind: 'test'; eye: Eye; test: TestId } | { kind: 'near' } | { kind: 'auto' };
type TestId = 'va-unaided' | 'va-pinhole' | 'retinoscopy' | 'subjective' | 'va-corrected';

interface CaseProgress {
  actions: Action[];
  retino: Record<Eye, RetinoRecord[]>;
  subjective: Partial<Record<Eye, SpheroCyl>>;
  submitted?: boolean;
  startedAt: number;
}

const TEST_LABEL: Record<TestId, string> = {
  'va-unaided': 'Distance acuity, unaided (6 m)',
  'va-pinhole': 'Pinhole acuity',
  retinoscopy: 'Static retinoscopy',
  subjective: 'Subjective refinement (sphere / JCC)',
  'va-corrected': 'Acuity with the refraction you recorded',
};

export function Patients({ id }: { id?: string; query: URLSearchParams }) {
  if (id) {
    const c = caseById(id);
    if (c) return <CaseView c={c} />;
    const k = clinicalCaseById(id);
    return k ? <ClinicalCaseView c={k} /> : <Feedback tone="bad" title="Case not found" />;
  }
  return (
    <div className="stack">
      <h1>Patients</h1>
      <h2>Refraction</h2>
      <p className="small muted">Fictional, authored refraction patients. The case title never reveals the answer. Every instrument reads the same hidden target refraction; only what you examine appears in your note. Content status: draft, not clinically reviewed.</p>
      <div className="cards">
        {CASES.map((c) => (
          <a key={c.id} className="card" href={href(`patients/${c.id}`)} style={{ textDecoration: 'none', color: 'inherit' }} data-testid={`case-${c.label}`}>
            <h3>{c.label}</h3>
            <p className="small">
              {c.name}, {c.age}
            </p>
            <p className="small muted">{c.complaint}</p>
          </a>
        ))}
      </div>
      <h2>Pupils, visual pathway and alignment</h2>
      <p className="small muted">Fictional, authored patients examined with the same pupil, field and cover-test models as LAB05–LAB07. Titles never reveal the finding.</p>
      <div className="cards">
        {CLINICAL_CASES.map((c) => (
          <a key={c.id} className="card" href={href(`patients/${c.id}`)} style={{ textDecoration: 'none', color: 'inherit' }} data-testid={`case-${c.label}`}>
            <h3>{c.label}</h3>
            <p className="small">
              {c.name}, {c.age}
            </p>
            <p className="small muted">{c.complaint}</p>
          </a>
        ))}
      </div>
      <div className="panel small muted">Red eye, glaucoma assessment, trauma and paediatric red-reflex case families are planned with LAB08–LAB18 and are not shown until they exist.</div>
    </div>
  );
}

function CaseView({ c }: { c: CaseDef }) {
  const { repo, profile, recordAttempt } = useApp();
  const key = `mission:case:${c.id}`;
  const [p, setP] = useState<CaseProgress | null>(null);
  const [eye, setEye] = useState<Eye>('OD');
  const [tool, setTool] = useState<TestId | null>(null);
  const [rx, setRx] = useState<Record<Eye, RxEntryState>>({ OD: { result: null, confirmed: false }, OS: { result: null, confirmed: false } });
  const [cls, setCls] = useState<Record<Eye, string>>({ OD: '', OS: '' });
  const [next, setNext] = useState('');
  const [assessment, setAssessment] = useState('');
  const [result, setResult] = useState<null | { items: string[]; dims: Record<string, string> }>(null);
  useEffect(() => {
    if (profile) repo.getKV<CaseProgress>(profile.id, key).then((s) => setP(s ?? { actions: [], retino: { OD: [], OS: [] }, subjective: {}, startedAt: now() }));
  }, [profile, repo, key]);
  if (!p) return <p>Loading…</p>;
  const save = async (np: CaseProgress) => {
    setP(np);
    if (profile) await repo.setKV(profile.id, key, np);
  };
  const did = (a: Action) => p.actions.some((x) => JSON.stringify(x) === JSON.stringify(a));
  const doAct = (a: Action) => !did(a) && save({ ...p, actions: [...p.actions, a] });
  const performed = (e: Eye, t: TestId) => did({ kind: 'test', eye: e, test: t });
  const refracted = (e: Eye) => p.retino[e].length > 0 || !!p.subjective[e];
  const truth = c.eyes[eye];

  const note = (): string[] => {
    const lines: string[] = [`${c.label} (${c.name}), ${c.age} y. Presenting complaint: ${c.complaint}`];
    p.actions.filter((a) => a.kind === 'history').forEach((a) => a.kind === 'history' && lines.push(`History — ${c.history[a.i].q} ${c.history[a.i].a}`));
    for (const e of ['OD', 'OS'] as Eye[]) {
      const t = c.eyes[e];
      if (performed(e, 'va-unaided')) lines.push(`${e} VA unaided ${t.vaUnaided} (6 m)`);
      if (performed(e, 'va-pinhole')) lines.push(`${e} pinhole ${t.vaPinhole}`);
      if (p.retino[e].length) lines.push(`${e} retinoscopy records: ${p.retino[e].map((r) => `${fmtD(r.trialD)} D @ ${r.meridianDeg}° (w ${r.workingDistanceM.toFixed(2)} m${r.wdLensIncluded ? ', WD lens in' : ''})`).join('; ')}`);
      if (p.subjective[e]) lines.push(`${e} subjective end-point ${formatRx(p.subjective[e]!)}`);
      if (performed(e, 'va-corrected')) lines.push(`${e} VA with recorded refraction ${t.vaBestCorrected}`);
    }
    if (did({ kind: 'near' }) && c.near) lines.push(`Near: ${c.near.observation}`);
    if (did({ kind: 'auto' }) && c.autorefraction) lines.push(`Autorefraction printout: ${c.autorefraction.text}`);
    lines.push('Not examined (not documented): anything not listed above.');
    return lines;
  };

  const submit = async () => {
    const items: string[] = [];
    const dims: Record<string, string> = {};
    let allOk = true;
    for (const e of ['OD', 'OS'] as Eye[]) {
      const l = rxFromState(rx[e]);
      const t = c.eyes[e].target;
      if (!l) {
        dims[`${e} refraction`] = 'not given';
        allOk = false;
        continue;
      }
      const g = gradeLens(l, t, 'any', 0.005);
      const w = Math.abs(worstMeridian(subMatrices(toMatrix(l), toMatrix(t))).errorD);
      dims[`${e} refraction`] = g.opticallyEquivalent ? 'exact (optically equivalent)' : w <= 0.25 ? `within 0.25 D (largest error ${fmtD(w)} D)` : `outside 0.25 D (largest error ${fmtD(w)} D)`;
      if (w > 0.25) allOk = false;
      if (!refracted(e)) {
        dims[`${e} evidence`] = 'unsupported: no refraction was performed on this eye';
        allOk = false;
      }
      const exp = expectedClass(c.eyes[e]);
      const ok = cls[e] === exp;
      dims[`${e} classification`] = ok ? 'supported' : cls[e] ? `not supported (expected ${CLASS_LABEL[exp]})` : 'not given';
      if (!ok) allOk = false;
      if (!g.opticallyEquivalent) items.push(...g.hypotheses.map((h) => `${e}: ${h.message}`));
    }
    const na = c.nextActions.find((n) => n.value === next);
    dims['next action'] = na ? (na.correct ? 'defensible' : 'not supported') : 'not given';
    if (na) items.push(na.why);
    if (!na?.correct) allOk = false;
    const vaDone = (['OD', 'OS'] as Eye[]).every((e) => performed(e, 'va-unaided'));
    dims['evidence gathered'] = vaDone ? 'baseline acuity documented in both eyes' : 'baseline acuity missing in at least one eye';
    items.push(c.learningPoint, `Counterfactual: ${c.counterfactual}`);
    await recordAttempt({ itemId: `CASE-${c.id}`, itemVersion: 1, familyId: `CASE-REFRACTION`, objectiveIds: ['OPT-CLASSIFY', 'OPT-RETINOSCOPY'], lectureIds: ['L06', 'L04', 'L07'], seed: null, taskType: 'patient-case', mode: 'learning', response: { rx: { OD: rxFromState(rx.OD), OS: rxFromState(rx.OS) }, cls, next, assessment, actions: p.actions }, correct: allOk, scores: dims, confidence: null, hintLevel: 0, misconceptionIds: [], startedAt: p.startedAt, state: { caseId: c.id } });
    setResult({ items, dims });
    save({ ...p, submitted: true });
  };

  return (
    <div className="stack" data-testid="case-view">
      <a className="small" href={href('patients')}>
        ← Patients
      </a>
      <h1>
        {c.label}: {c.name}, {c.age}
      </h1>
      <p>{c.complaint}</p>
      <div className="row small">
        <Pill tone="warn">draft · not clinically reviewed</Pill>
        <span className="muted">Fictional patient. Acuity values are authored observations, not computed from dioptres.</span>
        <button className="btn sm ghost" onClick={() => { if (confirm('Restart this case? Your submitted attempts stay in your history.')) save({ actions: [], retino: { OD: [], OS: [] }, subjective: {}, startedAt: now() }); }}>
          Restart case
        </button>
      </div>
      <div className="grid cols-2" style={{ alignItems: 'start' }}>
        <div className="panel stack">
          <h2>History</h2>
          {c.history.map((h, i) => (
            <div key={i}>
              {did({ kind: 'history', i }) ? (
                <p className="small">
                  <b>{h.q}</b> {h.a}
                </p>
              ) : (
                <button className="btn sm" onClick={() => doAct({ kind: 'history', i })}>
                  Ask: {h.q}
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="panel stack">
          <h2>Examination</h2>
          <Seg label="Eye" value={eye} onChange={(e) => { setEye(e); setTool(null); }} options={[{ value: 'OD', label: 'Right eye (OD)' }, { value: 'OS', label: 'Left eye (OS)' }]} />
          <div className="row">
            {(['va-unaided', 'va-pinhole', 'retinoscopy', 'subjective', 'va-corrected'] as TestId[]).map((t) => (
              <button key={t} className={`btn sm ${tool === t ? 'primary' : ''}`} disabled={t === 'va-corrected' && !refracted(eye)} title={t === 'va-corrected' && !refracted(eye) ? 'Record a refraction for this eye first' : ''} onClick={() => { setTool(t); doAct({ kind: 'test', eye, test: t }); }}>
                {TEST_LABEL[t]}
              </button>
            ))}
            {c.near && <button className="btn sm" onClick={() => doAct({ kind: 'near' })}>Near assessment</button>}
            {c.autorefraction && <button className="btn sm" onClick={() => doAct({ kind: 'auto' })}>Autorefractor printout</button>}
          </div>
          {tool === 'va-unaided' && <Feedback tone="info" title={`${eye} unaided distance acuity: ${truth.vaUnaided}`} items={['Chart at 6 m, other eye occluded. Record the eye, distance and correction status.']} />}
          {tool === 'va-pinhole' && <Feedback tone="info" title={`${eye} pinhole: ${truth.vaPinhole}`} items={['Improvement supports an optical contribution; it does not prove the absence of disease.']} />}
          {tool === 'va-corrected' && <Feedback tone="info" title={`${eye} acuity with your recorded refraction: ${truth.vaBestCorrected}`} items={truth.nonRefractiveLoss ? ['Acuity did not improve with correction.'] : []} />}
          {did({ kind: 'near' }) && c.near && <Feedback tone="info" title="Near assessment" items={[c.near.observation]} />}
          {did({ kind: 'auto' }) && c.autorefraction && <Feedback tone="warn" title={`Autorefractor printout: ${c.autorefraction.text}`} items={[c.autorefraction.caveat, 'Check laterality labels (R/L) against OD/OS before using any value.']} />}
        </div>
      </div>
      {tool === 'retinoscopy' && (
        <div className="panel">
          <h2>{eye} retinoscopy</h2>
          <Retinoscope key={eye} eyeLabel={eye} target={truth.target} quality={truth.retinoQuality} records={p.retino[eye]} onRecord={(r) => save({ ...p, retino: { ...p.retino, [eye]: [...p.retino[eye], r] } })} />
          <p className="small muted">Neutralise both principal meridians, record each, then convert gross to net yourself in the notebook. The instrument never prints the final prescription.</p>
        </div>
      )}
      {tool === 'subjective' && (
        <div className="panel">
          <h2>{eye} subjective refinement</h2>
          <JccTool key={eye} target={truth.target} start={p.subjective[eye] ?? makeLens(0)} onResult={(l) => save({ ...p, subjective: { ...p.subjective, [eye]: l } })} />
          {p.subjective[eye] && <p className="small">Recorded end-point: {formatRx(p.subjective[eye]!)}</p>}
        </div>
      )}
      <div className="grid cols-2" style={{ alignItems: 'start' }}>
        <div className="panel stack" data-testid="case-notebook">
          <h2>Notebook</h2>
          <p className="small muted">OD and OS are independent. Classification is requested only in the stated context: your refraction is the complete distance correction with accommodation relaxed.</p>
          {(['OD', 'OS'] as Eye[]).map((e) => (
            <fieldset key={e} style={{ border: '1px solid var(--line)', borderRadius: 8, padding: 10 }}>
              <legend>{e === 'OD' ? 'Right eye (OD)' : 'Left eye (OS)'}</legend>
              <RxEntry idPrefix={`case-${e}`} onChange={(s) => setRx((old) => ({ ...old, [e]: s }))} disabled={!!result} />
              <label className="field" style={{ marginTop: 6 }}>
                <span>Refractive classification</span>
                <select value={cls[e]} onChange={(ev) => setCls({ ...cls, [e]: ev.target.value })} disabled={!!result}>
                  <option value="">Choose…</option>
                  {(Object.keys(CLASS_LABEL) as RefractiveClass[]).map((k) => (
                    <option key={k} value={k}>
                      {CLASS_LABEL[k]}
                    </option>
                  ))}
                </select>
              </label>
            </fieldset>
          ))}
          <label className="field">
            <span>Working assessment / uncertainty (free text; self-assessed)</span>
            <textarea value={assessment} onChange={(e) => setAssessment(e.target.value)} disabled={!!result} />
          </label>
          <label className="field">
            <span>Next action</span>
            <select value={next} onChange={(e) => setNext(e.target.value)} disabled={!!result}>
              <option value="">Choose…</option>
              {c.nextActions.map((n) => (
                <option key={n.value} value={n.value}>
                  {n.label}
                </option>
              ))}
            </select>
          </label>
          {!result && (
            <button className="btn primary" onClick={submit} data-testid="submit-case">
              Submit assessment
            </button>
          )}
          {result && (
            <>
              <table className="data small">
                <tbody>
                  {Object.entries(result.dims).map(([k, v]) => (
                    <tr key={k}>
                      <td>{k}</td>
                      <td>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Feedback tone="info" title="Feedback" items={result.items} />
            </>
          )}
        </div>
        <div className="panel">
          <h2>Generated note (from obtained evidence only)</h2>
          <ul className="small" data-testid="case-note">
            {note().map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
          <p className="tiny muted">Fictional educational note — not a clinical record or a usable prescription.</p>
        </div>
      </div>
    </div>
  );
}
