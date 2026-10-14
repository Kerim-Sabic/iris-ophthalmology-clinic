/**
 * Local-only persistence. IndexedDB for progress; in-memory fallback (clearly reported) when
 * IndexedDB is unavailable (private mode, blocked storage). Not a cloud backup.
 */
import {
  AttemptSchema, EXPORT_FORMAT, SCHEMA_VERSION, parseBundle,
  type Attempt, type ExamSession, type ExportBundle, type Note, type PlanSnapshot, type Profile,
} from '../domain/learning';
import { uid } from '../domain/random';

type StoreName = 'profiles' | 'plans' | 'attempts' | 'exams' | 'notes' | 'flags' | 'kv';
const STORES: StoreName[] = ['profiles', 'plans', 'attempts', 'exams', 'notes', 'flags', 'kv'];

export interface Backend {
  kind: 'indexeddb' | 'memory';
  get<T>(store: StoreName, key: string): Promise<T | undefined>;
  put<T>(store: StoreName, value: T): Promise<void>;
  /** Insert only; resolves false when the key already exists (duplicate prevention). */
  add<T>(store: StoreName, value: T): Promise<boolean>;
  all<T>(store: StoreName): Promise<T[]>;
  del(store: StoreName, key: string): Promise<void>;
}

export class MemoryBackend implements Backend {
  kind = 'memory' as const;
  private data = new Map<StoreName, Map<string, unknown>>(STORES.map((s) => [s, new Map()]));
  private key(store: StoreName, v: unknown): string {
    const o = v as Record<string, string>;
    return store === 'flags' || store === 'kv' ? o.key : o.id;
  }
  async get<T>(store: StoreName, key: string) {
    return structuredClone(this.data.get(store)!.get(key)) as T | undefined;
  }
  async put<T>(store: StoreName, value: T) {
    this.data.get(store)!.set(this.key(store, value), structuredClone(value));
  }
  async add<T>(store: StoreName, value: T) {
    const k = this.key(store, value);
    if (this.data.get(store)!.has(k)) return false;
    this.data.get(store)!.set(k, structuredClone(value));
    return true;
  }
  async all<T>(store: StoreName) {
    return [...this.data.get(store)!.values()].map((v) => structuredClone(v)) as T[];
  }
  async del(store: StoreName, key: string) {
    this.data.get(store)!.delete(key);
  }
}

class IdbBackend implements Backend {
  kind = 'indexeddb' as const;
  private db: IDBDatabase;
  constructor(db: IDBDatabase) {
    this.db = db;
  }
  private tx<T>(store: StoreName, mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest): Promise<T> {
    return new Promise((resolve, reject) => {
      const t = this.db.transaction(store, mode);
      const req = fn(t.objectStore(store));
      req.onsuccess = () => resolve(req.result as T);
      req.onerror = () => reject(req.error);
      t.onabort = () => reject(t.error ?? new Error('Transaction aborted'));
    });
  }
  get<T>(store: StoreName, key: string) {
    return this.tx<T | undefined>(store, 'readonly', (s) => s.get(key));
  }
  async put<T>(store: StoreName, value: T) {
    await this.tx(store, 'readwrite', (s) => s.put(value));
  }
  async add<T>(store: StoreName, value: T) {
    try {
      await this.tx(store, 'readwrite', (s) => s.add(value));
      return true;
    } catch (e) {
      if (e instanceof DOMException && e.name === 'ConstraintError') return false;
      throw e;
    }
  }
  all<T>(store: StoreName) {
    return this.tx<T[]>(store, 'readonly', (s) => s.getAll());
  }
  async del(store: StoreName, key: string) {
    await this.tx(store, 'readwrite', (s) => s.delete(key));
  }
}

export function openIdb(name = 'iris-clinic', version = 1): Promise<Backend> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject(new Error('IndexedDB is not available in this browser context.'));
    let req: IDBOpenDBRequest;
    try {
      req = indexedDB.open(name, version);
    } catch (e) {
      return reject(e);
    }
    req.onupgradeneeded = () => {
      const db = req.result;
      for (const s of STORES) {
        if (!db.objectStoreNames.contains(s)) db.createObjectStore(s, { keyPath: s === 'flags' || s === 'kv' ? 'key' : 'id' });
      }
    };
    req.onsuccess = () => resolve(new IdbBackend(req.result));
    req.onerror = () => reject(req.error ?? new Error('Could not open IndexedDB.'));
    req.onblocked = () => reject(new Error('IndexedDB open was blocked by another tab.'));
  });
}

// ------------------------------------------------------------ clock (controlled test clock)

const CLOCK_KEY = 'iris.clockOffsetMs';
let memClockOffset = 0;
export function clockOffset(): number {
  try {
    const v = Number(localStorage.getItem(CLOCK_KEY) ?? '0');
    return Number.isFinite(v) ? v : 0;
  } catch {
    return memClockOffset;
  }
}
export function setClockOffset(ms: number) {
  memClockOffset = ms;
  try {
    localStorage.setItem(CLOCK_KEY, String(ms));
  } catch {
    /* storage blocked: offset kept in memory only */
  }
}
export function now(): number {
  return Date.now() + clockOffset();
}

// ------------------------------------------------------------ repository

export interface KV {
  key: string;
  value: unknown;
}
export interface Flag {
  key: string;
  profileId: string;
  itemId: string;
  reason: string;
  at: number;
}

export class Repo {
  backend: Backend;
  constructor(backend: Backend) {
    this.backend = backend;
  }

  async profiles(): Promise<Profile[]> {
    return (await this.backend.all<Profile>('profiles')).sort((a, b) => a.createdAt - b.createdAt);
  }
  async createProfile(name: string): Promise<Profile> {
    const p: Profile = { id: uid(), name: name.trim() || 'Guest', createdAt: now() };
    await this.backend.put('profiles', p);
    return p;
  }

  async attempts(profileId: string): Promise<Attempt[]> {
    return (await this.backend.all<Attempt>('attempts')).filter((a) => a.profileId === profileId).sort((a, b) => a.submittedAt - b.submittedAt);
  }
  /** Validates and appends; duplicate IDs are ignored (returns false). */
  async addAttempt(a: Attempt): Promise<boolean> {
    const parsed = AttemptSchema.parse(a);
    return this.backend.add('attempts', parsed);
  }

  async plans(profileId: string): Promise<PlanSnapshot[]> {
    return (await this.backend.all<PlanSnapshot>('plans')).filter((p) => p.profileId === profileId).sort((a, b) => a.createdAt - b.createdAt);
  }
  /** Scope changes create a NEW snapshot; history is never overwritten. */
  async addPlan(p: Omit<PlanSnapshot, 'id' | 'createdAt' | 'scopeVersion'>): Promise<PlanSnapshot> {
    const prev = await this.plans(p.profileId);
    const snap: PlanSnapshot = { ...p, id: uid(), createdAt: now(), scopeVersion: (prev[prev.length - 1]?.scopeVersion ?? 0) + 1 };
    await this.backend.put('plans', snap);
    return snap;
  }

  async exams(profileId: string): Promise<ExamSession[]> {
    return (await this.backend.all<ExamSession>('exams')).filter((e) => e.profileId === profileId).sort((a, b) => a.createdAt - b.createdAt);
  }
  async saveExam(e: ExamSession) {
    await this.backend.put('exams', e);
  }

  async notes(profileId: string): Promise<Note[]> {
    return (await this.backend.all<Note>('notes')).filter((n) => n.profileId === profileId);
  }
  async saveNote(n: Note) {
    await this.backend.put('notes', n);
  }

  async flags(profileId: string): Promise<Flag[]> {
    return (await this.backend.all<Flag>('flags')).filter((f) => f.profileId === profileId);
  }
  async flag(profileId: string, itemId: string, reason: string) {
    await this.backend.put<Flag>('flags', { key: `${profileId}:${itemId}`, profileId, itemId, reason, at: now() });
  }

  async getKV<T>(profileId: string, key: string): Promise<T | undefined> {
    return (await this.backend.get<KV>('kv', `${profileId}:${key}`))?.value as T | undefined;
  }
  async setKV(profileId: string, key: string, value: unknown) {
    await this.backend.put<KV>('kv', { key: `${profileId}:${key}`, value });
  }

  async exportBundle(profileId: string): Promise<ExportBundle> {
    const profile = (await this.profiles()).find((p) => p.id === profileId);
    if (!profile) throw new Error('Profile not found');
    const kv = (await this.backend.all<KV>('kv')).filter((k) => k.key.startsWith(profileId + ':mission:'));
    return {
      format: EXPORT_FORMAT,
      schemaVersion: SCHEMA_VERSION,
      exportedAt: now(),
      profile,
      plans: await this.plans(profileId),
      attempts: await this.attempts(profileId),
      exams: await this.exams(profileId),
      notes: await this.notes(profileId),
      flags: (await this.flags(profileId)).map((f) => ({ itemId: f.itemId, reason: f.reason, at: f.at })),
      missions: Object.fromEntries(kv.map((k) => [k.key.slice(profileId.length + 1), k.value])),
    };
  }

  /** Imports into a NEW profile (never merges into or overwrites an existing one). */
  async importBundle(raw: unknown): Promise<{ ok: true; profile: Profile; counts: Record<string, number> } | { ok: false; error: string }> {
    const parsed = parseBundle(raw);
    if (!parsed.ok) return parsed;
    const b = parsed.bundle;
    const profile: Profile = { id: uid(), name: `${b.profile.name} (imported)`, createdAt: now() };
    const remap = <T extends { profileId: string }>(x: T): T => ({ ...x, profileId: profile.id });
    await this.backend.put('profiles', profile);
    let attempts = 0;
    for (const a of b.attempts) if (await this.backend.add('attempts', remap({ ...a, id: `${profile.id}:${a.id}` }))) attempts++;
    for (const p of b.plans) await this.backend.put('plans', remap({ ...p, id: `${profile.id}:${p.id}` }));
    for (const e of b.exams) await this.backend.put('exams', remap({ ...e, id: `${profile.id}:${e.id}` }));
    for (const n of b.notes) await this.backend.put('notes', remap({ ...n, id: `${profile.id}:${n.id}` }));
    for (const f of b.flags) await this.flag(profile.id, f.itemId, f.reason);
    for (const [k, v] of Object.entries(b.missions)) await this.backend.put<KV>('kv', { key: `${profile.id}:${k}`, value: v });
    return { ok: true, profile, counts: { attempts, plans: b.plans.length, exams: b.exams.length, notes: b.notes.length } };
  }
}
