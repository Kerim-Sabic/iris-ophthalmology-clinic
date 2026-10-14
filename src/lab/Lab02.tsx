import { useState } from 'react';
import { useApp } from '../app/context';
import { href } from '../app/router';
import { ANSWER_TOL_D } from '../domain/missions';
import { fmtAxis, fmtD, formatRx, gradeLens, grossToNet, makeLens, type SpheroCyl } from '../domain/optics';
import { newSeed, rng } from '../domain/random';
import { now } from '../lib/store';
import { Feedback, RxEntry, Seg, rxFromState, type RxEntryState } from '../ui/kit';
import { JccTool } from './JccTool';
import { Retinoscope, type RetinoRecord } from './Retinoscope';

function hiddenTarget(seed: number): SpheroCyl {
  const r = rng(seed);
  return makeLens(r.quarter(-3, 3), -r.quarter(0, 2.5), r.pick([180, 90, 170, 10, 45, 135]));
}

export function Lab02() {
  const { recordAttempt } = useApp();
  const [tab, setTab] = useState<'retino' | 'jcc'>('retino');
  const [seed, setSeed] = useState(newSeed());
  const [records, setRecords] = useState<RetinoRecord[]>([]);
  const [gross, setGross] = useState<RxEntryState>({ result: null, confirmed: false });
  const [net, setNet] = useState<RxEntryState>({ result: null, confirmed: false });
  const [fb, setFb] = useState<{ tone: 'good' | 'bad'; items: string[] } | null>(null);
  const [start] = useState(now());
  const target = hiddenTarget(seed);
  const last = records[records.length - 1];
  const check = async () => {
    const g = rxFromState(gross);
    const n = rxFromState(net);
    if (!g || !n || !last) return;
    const w = last.workingDistanceM;
    const wdIn = last.wdLensIncluded;
    const items: string[] = [];
    const expectedNet = grossToNet(g, w, wdIn);
    const gNet = gradeLens(n, target, 'any', 0.13);
    const arith = gradeLens(n, expectedNet, 'any', ANSWER_TOL_D).opticallyEquivalent;
    items.push(arith ? `Arithmetic correct: from your gross ${formatRx(g)} the net is ${formatRx(expectedNet)}${wdIn ? ' (working-distance lens was already in the frame — nothing subtracted)' : ` (−${fmtD(1 / w).replace('+', '')} D for ${w.toFixed(3)} m)`}.` : `Arithmetic: from your gross ${formatRx(g)} the net should be ${formatRx(expectedNet)}.`);
    const mis: string[] = [];
    if (!arith && gradeLens(n, g, 'any', ANSWER_TOL_D).opticallyEquivalent && !wdIn) {
      items.push('You reported the gross result as net.');
      mis.push('M-GROSS-VS-NET');
    }
    if (!arith && wdIn && gradeLens(n, makeLens(g.sphereD - 1 / w, g.cylinderD, g.axisDeg), 'any', ANSWER_TOL_D).opticallyEquivalent) {
      items.push('The working distance was subtracted twice.');
      mis.push('M-DOUBLE-WD');
    }
    items.push(gNet.opticallyEquivalent ? 'Your net refraction matches the hidden target within the ±0.125 D neutral band.' : `Compared with the hidden target the largest error is ${fmtD(gNet.worst.errorD)} D at ${fmtAxis(gNet.worst.meridianDeg)}° — re-check neutrality of each principal meridian.`);
    items.push(`Hidden target was ${formatRx(target)}.`);
    const ok = arith && gNet.opticallyEquivalent;
    await recordAttempt({ itemId: `LAB02-retino#${seed}`, itemVersion: 1, familyId: 'F-RETINO-WORKFLOW', objectiveIds: ['OPT-RETINOSCOPY'], lectureIds: ['L06'], seed, taskType: 'procedural-sequence', mode: 'learning', response: { gross: g, net: n, records }, correct: ok, scores: { arithmetic: arith, matchesTarget: gNet.opticallyEquivalent }, confidence: null, hintLevel: 0, misconceptionIds: mis, startedAt: start, state: { target } });
    setFb({ tone: ok ? 'good' : 'bad', items });
  };
  return (
    <div className="stack">
      <h1>LAB02 · Refraction and accommodation suite</h1>
      <p className="small muted">Constrained procedural simulation on a hidden target. Partial studio: retinoscopy and JCC/sphere refinement are built; duochrome, binocular balance, cycloplegic comparison and autorefraction interpretation outside the patient cases are planned. Learning how a method works is not performing it on a patient.</p>
      <div className="row">
        <Seg label="Instrument" value={tab} onChange={setTab} options={[{ value: 'retino', label: 'Retinoscopy workflow' }, { value: 'jcc', label: 'Subjective / JCC' }]} />
        <button className="btn sm" onClick={() => { setSeed(newSeed()); setRecords([]); setFb(null); }}>
          New hidden eye
        </button>
        <a className="btn sm" href={href('patients')}>Use with a patient case</a>
      </div>
      {tab === 'retino' ? (
        <>
          <div className="panel">
            <Retinoscope key={seed} target={target} records={records} onRecord={(r) => setRecords([...records, r])} />
          </div>
          <div className="panel stack" style={{ maxWidth: 620 }}>
            <h2>Workflow notebook</h2>
            <ol className="small">
              <li>Neutralise each principal meridian (rotate the streak until the reflex is aligned, then add lenses until neutral) and record it.</li>
              <li>Write the gross neutralising lens from your two records.</li>
              <li>Convert to net: remove 1/w from the sphere unless a working-distance lens was in the frame.</li>
            </ol>
            <b className="small">Gross (lenses that neutralised, excluding any WD lens)</b>
            <RxEntry key={'g' + seed} idPrefix="lab02-gross" onChange={setGross} />
            <b className="small">Net refraction</b>
            <RxEntry key={'n' + seed} idPrefix="lab02-net" onChange={setNet} />
            <button className="btn primary" disabled={!rxFromState(gross) || !rxFromState(net) || !records.length} onClick={check}>
              Check workflow
            </button>
            {!records.length && <span className="tiny muted">Record at least one neutral meridian first.</span>}
            {fb && <Feedback tone={fb.tone} title={fb.tone === 'good' ? 'Workflow correct' : 'Check the steps'} items={fb.items} />}
          </div>
        </>
      ) : (
        <div className="panel">
          <JccTool key={seed} target={target} start={makeLens(target.sphereD + 0.5, target.cylinderD === 0 ? -0.5 : target.cylinderD + 0.5, (target.axisDeg ?? 180) + 15)} />
          <p className="small muted">Start lens deliberately differs from the hidden target (as after an imperfect objective refraction).</p>
        </div>
      )}
    </div>
  );
}
