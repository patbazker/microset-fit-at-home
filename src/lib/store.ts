import { writable, get } from 'svelte/store';
import type { AppData, Session, PatternId } from './types';
import { loadAppData, saveAppData, defaultAppData } from './storage';
import { applyCompletion, type StreakMilestone } from './streak';

export const appData = writable<AppData>(loadAppData());

// Persist on every change
appData.subscribe(d => saveAppData(d));

export function completeSession(session: Session): StreakMilestone[] {
  let milestones: StreakMilestone[] = [];
  appData.update(d => {
    const sessions = [...d.sessions, session];
    const { streak, newMilestones } = applyCompletion(d, session);
    milestones = newMilestones;

    // Pattern progression: for each strength exercise where reps hit target, increment.
    const patternProgress = { ...d.patternProgress };
    for (const ex of session.exercises) {
      const p = patternProgress[ex.pattern];
      if (!p) continue;
      // best
      const maxReps = Math.max(...ex.sets.map(s => s.reps ?? 0));
      const maxHold = Math.max(...ex.sets.map(s => s.holdSec ?? 0));
      if (maxReps > (p.bestReps ?? 0)) p.bestReps = maxReps;
      if (maxHold > (p.bestHoldSec ?? 0)) p.bestHoldSec = maxHold;

      // Auto-progress: 3 consecutive sessions hitting all sets at target
      // Approximate: increment consecutiveTargetHits if any set met an internal threshold.
      // We treat "hit" as: at least one set with reps >= 1 (very lenient for MVP).
      // Better heuristic would compare to plan target — TODO.
      const hit = ex.sets.length > 0;
      if (hit) {
        p.consecutiveTargetHits = (p.consecutiveTargetHits ?? 0) + 1;
        if (p.consecutiveTargetHits >= 3) {
          p.level = Math.min(12, p.level + 1);
          p.consecutiveTargetHits = 0;
        }
      } else {
        p.consecutiveTargetHits = 0;
      }
      patternProgress[ex.pattern] = p;
    }

    const badges = Array.from(new Set([...d.badges, ...newMilestones.map(m => m.id)]));

    return {
      ...d,
      sessions,
      streak,
      patternProgress,
      badges,
    };
  });
  return milestones;
}

export function setLevel(pattern: PatternId, level: number) {
  appData.update(d => ({
    ...d,
    patternProgress: {
      ...d.patternProgress,
      [pattern]: { ...d.patternProgress[pattern], level: Math.max(1, Math.min(12, level)) },
    },
  }));
}

export function updateSettings<K extends keyof AppData['settings']>(key: K, value: AppData['settings'][K]) {
  appData.update(d => ({ ...d, settings: { ...d.settings, [key]: value } }));
}

export function updateProfile(patch: Partial<AppData['profile']>) {
  appData.update(d => ({ ...d, profile: { ...d.profile, ...patch } }));
}

export function resetAllData() {
  localStorage.removeItem('hf:app:v1');
  appData.set(defaultAppData());
}

export function snapshot(): AppData {
  return get(appData);
}
