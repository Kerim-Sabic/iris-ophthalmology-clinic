import { useState } from 'react';
import { useApp } from '../app/context';
import { DAY_MS } from '../domain/learning';
import { Feedback, Seg } from '../ui/kit';

export function Settings() {
  const { profiles, profile, switchProfile, createProfile, repo, storage, prefs, setPrefs, clockMs, advanceClock, resetClock, attempts, plans } = useApp();
  const [name, setName] = useState('');
  const [msg, setMsg] = useState<{ tone: 'good' | 'bad'; text: string } | null>(null);
  const exportData = async () => {
    if (!profile) return;
    try {
      const b = await repo.exportBundle(profile.id);
      const blob = new Blob([JSON.stringify(b, null, 1)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `iris-export-${profile.name.replace(/\W+/g, '_')}-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(a.href);
      setMsg({ tone: 'good', text: `Exported ${b.attempts.length} attempts, ${b.plans.length} scope snapshots, ${b.exams.length} exams.` });
    } catch (e) {
      setMsg({ tone: 'bad', text: `Export failed: ${e instanceof Error ? e.message : e}` });
    }
  };
  const importData = async (file: File) => {
    try {
      const text = await file.text();
      let raw: unknown;
      try {
        raw = JSON.parse(text);
      } catch {
        setMsg({ tone: 'bad', text: 'Import rejected: the file is not valid JSON.' });
        return;
      }
      const r = await repo.importBundle(raw);
      if (!r.ok) {
        setMsg({ tone: 'bad', text: r.error });
        return;
      }
      await switchProfile(r.profile.id);
      setMsg({ tone: 'good', text: `Imported into a new profile “${r.profile.name}”: ${r.counts.attempts} attempts, ${r.counts.plans} scope snapshots, ${r.counts.exams} exams.` });
    } catch (e) {
      setMsg({ tone: 'bad', text: `Import failed: ${e instanceof Error ? e.message : e}` });
    }
  };
  const offsetDays = (clockMs - Date.now()) / DAY_MS;
  return (
    <div className="stack">
      <h1>Data & settings</h1>
      <div className="grid cols-2" style={{ alignItems: 'start' }}>
        <div className="panel stack">
          <h2>Profiles (local guests)</h2>
          <p className="small">Storage: <b>{storage.kind === 'indexeddb' ? 'IndexedDB in this browser' : 'memory only (not saved)'}</b>. Local data is not a cloud backup; clearing site data deletes it. There is no sign-in and no sync.</p>
          <label className="field">
            <span>Active profile</span>
            <select value={profile?.id} onChange={(e) => switchProfile(e.target.value)} data-testid="profile-select">
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <p className="small muted">{attempts.length} attempts · {plans.length} scope snapshots in this profile.</p>
          <div className="row">
            <input type="text" placeholder="New profile name" value={name} onChange={(e) => setName(e.target.value)} aria-label="New profile name" style={{ maxWidth: 220 }} />
            <button className="btn" onClick={async () => { await createProfile(name || 'Guest'); setName(''); }}>
              Create fresh profile
            </button>
          </div>
        </div>
        <div className="panel stack">
          <h2>Export / import</h2>
          <p className="small">Versioned JSON with validation. Import always creates a new profile; it never overwrites existing progress.</p>
          <div className="row">
            <button className="btn primary" onClick={exportData} data-testid="export">
              Export this profile
            </button>
            <label className="btn">
              Import file…
              <input type="file" accept="application/json,.json" style={{ display: 'none' }} data-testid="import" onChange={(e) => e.target.files?.[0] && importData(e.target.files[0])} />
            </label>
          </div>
          {msg && <Feedback tone={msg.tone} title={msg.text} />}
        </div>
        <div className="panel stack">
          <h2>Display</h2>
          <Seg label="Theme" value={prefs.theme} onChange={(theme) => setPrefs({ theme })} options={[{ value: 'light', label: 'Study (light)' }, { value: 'dark', label: 'Instrument (dark)' }]} />
          <Seg label="Motion" value={prefs.motion} onChange={(motion) => setPrefs({ motion })} options={[{ value: 'system', label: 'Follow system motion setting' }, { value: 'reduce', label: 'Reduce motion' }]} />
          <label className="row small">
            <input type="checkbox" checked={prefs.celebrations} onChange={(e) => setPrefs({ celebrations: e.target.checked })} /> Allow celebration messages (no sound is ever played)
          </label>
        </div>
        <div className="panel stack">
          <h2>Test clock (for checking delayed review)</h2>
          <p className="small">Simulated offset: <b className="num">{offsetDays.toFixed(2)} days</b>. This shifts the app’s clock for scheduling only. Attempts record the shifted time, so use it for testing, not for real study.</p>
          <div className="row">
            <button className="btn" onClick={() => advanceClock(DAY_MS)} data-testid="advance-day">
              +1 day
            </button>
            <button className="btn" onClick={() => advanceClock(7 * DAY_MS)}>
              +7 days
            </button>
            <button className="btn" onClick={resetClock}>
              Reset to real time
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
