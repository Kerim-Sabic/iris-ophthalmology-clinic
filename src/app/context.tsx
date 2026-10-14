import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Attempt, PlanSnapshot, Profile } from '../domain/learning';
import { uid } from '../domain/random';
import { MemoryBackend, Repo, clockOffset, now, openIdb, setClockOffset, type Flag } from '../lib/store';

export const CONTENT_VERSION = '2026-10-14.1';

export interface Prefs {
  theme: 'light' | 'dark';
  motion: 'system' | 'reduce';
  celebrations: boolean;
}

const PREF_KEY = 'iris.prefs';
const ACTIVE_KEY = 'iris.activeProfile';

function loadPrefs(): Prefs {
  try {
    const p = JSON.parse(localStorage.getItem(PREF_KEY) ?? '{}');
    return { theme: p.theme === 'dark' ? 'dark' : 'light', motion: p.motion === 'reduce' ? 'reduce' : 'system', celebrations: p.celebrations !== false };
  } catch {
    return { theme: 'light', motion: 'system', celebrations: true };
  }
}

export type NewAttempt = Omit<Attempt, 'id' | 'profileId' | 'submittedAt' | 'contentVersion'> & { id?: string };

interface Ctx {
  ready: boolean;
  repo: Repo;
  storage: { kind: 'indexeddb' | 'memory'; error?: string };
  profiles: Profile[];
  profile: Profile | null;
  attempts: Attempt[];
  plans: PlanSnapshot[];
  plan: PlanSnapshot | null;
  flags: Flag[];
  prefs: Prefs;
  setPrefs(p: Partial<Prefs>): void;
  clockMs: number;
  advanceClock(ms: number): void;
  resetClock(): void;
  switchProfile(id: string): Promise<void>;
  createProfile(name: string): Promise<void>;
  refresh(): Promise<void>;
  recordAttempt(a: NewAttempt): Promise<Attempt | null>;
  savePlan(p: Pick<PlanSnapshot, 'lectures' | 'presetId' | 'examDate' | 'minutesPerDay'>): Promise<void>;
  saveError: string | null;
  reducedMotion: boolean;
}

const AppCtx = createContext<Ctx | null>(null);

export function useApp(): Ctx {
  const c = useContext(AppCtx);
  if (!c) throw new Error('useApp outside provider');
  return c;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [repo, setRepo] = useState<Repo>(() => new Repo(new MemoryBackend()));
  const [storage, setStorage] = useState<Ctx['storage']>({ kind: 'memory' });
  const [ready, setReady] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [plans, setPlans] = useState<PlanSnapshot[]>([]);
  const [flags, setFlags] = useState<Flag[]>([]);
  const [prefs, setPrefsState] = useState<Prefs>(loadPrefs);
  const [clockMs, setClockMs] = useState(now());
  const [saveError, setSaveError] = useState<string | null>(null);
  const [sysReduced, setSysReduced] = useState(() => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    const h = () => setSysReduced(mq.matches);
    mq.addEventListener?.('change', h);
    return () => mq.removeEventListener?.('change', h);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = prefs.theme;
    document.documentElement.dataset.motion = prefs.motion === 'reduce' ? 'reduce' : '';
    try {
      localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
    } catch {
      /* ignore */
    }
  }, [prefs]);

  const load = useCallback(async (r: Repo, pid: string | null) => {
    const ps = await r.profiles();
    let p = ps.find((x) => x.id === pid) ?? ps[0] ?? null;
    if (!p) p = await r.createProfile('Guest');
    setProfiles(await r.profiles());
    setProfile(p);
    try {
      localStorage.setItem(ACTIVE_KEY, p.id);
    } catch {
      /* ignore */
    }
    setAttempts(await r.attempts(p.id));
    setPlans(await r.plans(p.id));
    setFlags(await r.flags(p.id));
  }, []);

  useEffect(() => {
    (async () => {
      let r: Repo;
      try {
        if (new URLSearchParams(location.search).has('nostorage')) throw new Error('Storage disabled for this session (?nostorage).');
        r = new Repo(await openIdb());
        setStorage({ kind: 'indexeddb' });
      } catch (e) {
        r = new Repo(new MemoryBackend());
        setStorage({ kind: 'memory', error: e instanceof Error ? e.message : String(e) });
      }
      setRepo(r);
      let active: string | null = null;
      try {
        active = localStorage.getItem(ACTIVE_KEY);
      } catch {
        /* ignore */
      }
      await load(r, active);
      setReady(true);
    })();
  }, [load]);

  const refresh = useCallback(async () => {
    if (profile) await load(repo, profile.id);
  }, [repo, profile, load]);

  const recordAttempt = useCallback(
    async (a: NewAttempt) => {
      if (!profile) return null;
      const full: Attempt = { ...a, id: a.id ?? uid(), profileId: profile.id, submittedAt: now(), contentVersion: CONTENT_VERSION };
      try {
        await repo.addAttempt(full);
        setSaveError(null);
        setAttempts(await repo.attempts(profile.id));
        return full;
      } catch (e) {
        setSaveError(`Could not save your attempt: ${e instanceof Error ? e.message : String(e)}. Your answer is still shown; try again or export your data.`);
        return null;
      }
    },
    [repo, profile],
  );

  const savePlan = useCallback(
    async (p: Pick<PlanSnapshot, 'lectures' | 'presetId' | 'examDate' | 'minutesPerDay'>) => {
      if (!profile) return;
      try {
        await repo.addPlan({ ...p, profileId: profile.id });
        setPlans(await repo.plans(profile.id));
        setSaveError(null);
      } catch (e) {
        setSaveError(`Could not save the study plan: ${e instanceof Error ? e.message : String(e)}`);
      }
    },
    [repo, profile],
  );

  const value: Ctx = useMemo(
    () => ({
      ready, repo, storage, profiles, profile, attempts, plans, plan: plans[plans.length - 1] ?? null, flags, prefs,
      setPrefs: (p) => setPrefsState((old) => ({ ...old, ...p })),
      clockMs,
      advanceClock: (ms) => {
        setClockOffset(clockOffset() + ms);
        setClockMs(now());
      },
      resetClock: () => {
        setClockOffset(0);
        setClockMs(now());
      },
      switchProfile: async (id) => load(repo, id),
      createProfile: async (name) => {
        const p = await repo.createProfile(name);
        await load(repo, p.id);
      },
      refresh, recordAttempt, savePlan, saveError,
      reducedMotion: prefs.motion === 'reduce' || sysReduced,
    }),
    [ready, repo, storage, profiles, profile, attempts, plans, flags, prefs, clockMs, load, refresh, recordAttempt, savePlan, saveError, sysReduced],
  );

  // keep clock fresh each minute for due computations
  useEffect(() => {
    const t = setInterval(() => setClockMs(now()), 60_000);
    return () => clearInterval(t);
  }, []);

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}
