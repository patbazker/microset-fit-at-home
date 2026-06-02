import type { AppData, PatternId, PatternProgress, Session, Streak, Settings, Profile } from './types';

const KEY = 'hf:app:v1';

const DEFAULT_PROFILE: Profile = {
  name: 'Patrice',
  weightKg: 75,
  birthYear: 1977,
  startedAt: Date.now(),
  reminderHour: null,
};

const DEFAULT_SETTINGS: Settings = {
  sound: true,
  haptics: true,
  voiceCues: true,
  keepScreenOn: true,
};

const DEFAULT_STREAK: Streak = {
  current: 0,
  longest: 0,
  lastDate: null,
  freezesAvailable: 2,
  freezesUsed: [],
  totalDays: 0,
};

const PATTERNS: PatternId[] = ['push-h', 'push-v', 'pull-h', 'squat', 'hinge', 'core-ext', 'core-rot', 'cardio', 'mobility', 'skill'];

function defaultPatternProgress(): Record<PatternId, PatternProgress> {
  return PATTERNS.reduce((acc, p) => {
    acc[p] = { level: 1, consecutiveTargetHits: 0 };
    return acc;
  }, {} as Record<PatternId, PatternProgress>);
}

export function defaultAppData(): AppData {
  return {
    profile: { ...DEFAULT_PROFILE },
    settings: { ...DEFAULT_SETTINGS },
    streak: { ...DEFAULT_STREAK },
    patternProgress: defaultPatternProgress(),
    sessions: [],
    badges: [],
  };
}

export function loadAppData(): AppData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultAppData();
    const parsed = JSON.parse(raw) as Partial<AppData>;
    // Merge defaults to support migrations
    const base = defaultAppData();
    return {
      profile: { ...base.profile, ...parsed.profile },
      settings: { ...base.settings, ...parsed.settings },
      streak: { ...base.streak, ...parsed.streak },
      patternProgress: { ...base.patternProgress, ...parsed.patternProgress },
      sessions: parsed.sessions ?? [],
      badges: parsed.badges ?? [],
    };
  } catch (e) {
    console.error('loadAppData failed', e);
    return defaultAppData();
  }
}

export function saveAppData(data: AppData): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch (e) {
    console.error('saveAppData failed', e);
  }
}

export function exportJSON(): string {
  return JSON.stringify(loadAppData(), null, 2);
}

export function importJSON(json: string): boolean {
  try {
    const parsed = JSON.parse(json);
    saveAppData(parsed);
    return true;
  } catch {
    return false;
  }
}

export function resetAll(): void {
  localStorage.removeItem(KEY);
}

// ---- Helpers ----

export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

export function diffDays(a: string, b: string): number {
  const da = new Date(a + 'T00:00:00');
  const db = new Date(b + 'T00:00:00');
  return Math.round((db.getTime() - da.getTime()) / 86400000);
}

export function addSession(data: AppData, session: Session): AppData {
  return { ...data, sessions: [...data.sessions, session] };
}

export function sessionsByDate(data: AppData, dateKey: string): Session[] {
  return data.sessions.filter(s => s.date === dateKey);
}

export function hasCompletedToday(data: AppData): boolean {
  return sessionsByDate(data, todayKey()).some(s => s.completed);
}
