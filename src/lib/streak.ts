import type { AppData, Session, Streak } from './types';
import { diffDays, todayKey } from './storage';

export interface StreakMilestone {
  id: string;
  days: number;
  title: string;
  emoji: string;
  message: string;
}

export const MILESTONES: StreakMilestone[] = [
  { id: 'm-3', days: 3, title: 'Trois jours', emoji: '🌱', message: 'Une habitude commence à pousser.' },
  { id: 'm-7', days: 7, title: 'Une semaine', emoji: '🔥', message: 'Tu as franchi le seuil critique.' },
  { id: 'm-14', days: 14, title: 'Deux semaines', emoji: '⚡', message: 'Ton cerveau commence à câbler l\'habitude.' },
  { id: 'm-30', days: 30, title: 'Un mois', emoji: '🌟', message: 'Un mois entier. Le rituel est ancré.' },
  { id: 'm-50', days: 50, title: 'Cinquante', emoji: '💎', message: 'Cinquante jours. C\'est rare.' },
  { id: 'm-100', days: 100, title: 'Cent jours', emoji: '👑', message: 'Tu es entré dans le club du 100. Bravo.' },
  { id: 'm-200', days: 200, title: 'Deux cents', emoji: '🚀', message: 'Implacable.' },
  { id: 'm-365', days: 365, title: 'Un an', emoji: '🏆', message: 'Une année entière. Une nouvelle version de toi.' },
  { id: 'm-500', days: 500, title: 'Cinq cents', emoji: '⭐', message: 'Hall of fame.' },
  { id: 'm-1000', days: 1000, title: 'Mille', emoji: '🌌', message: 'Légende.' },
];

/**
 * Update streak after a completed session.
 * Returns: { streak, newMilestones }
 */
export function applyCompletion(data: AppData, session: Session): {
  streak: Streak;
  newMilestones: StreakMilestone[];
} {
  const date = session.date;
  const prev = data.streak;

  // Already counted today? No-op streak update.
  if (prev.lastDate === date) {
    return { streak: prev, newMilestones: [] };
  }

  let current = prev.current;
  let longest = prev.longest;
  let freezesAvailable = prev.freezesAvailable;
  let freezesUsed = [...prev.freezesUsed];

  if (prev.lastDate === null) {
    current = 1;
  } else {
    const gap = diffDays(prev.lastDate, date);
    if (gap === 1) {
      current = prev.current + 1;
    } else if (gap > 1) {
      // Try to use freezes for the missing days (gap - 1)
      const missing = gap - 1;
      if (freezesAvailable >= missing) {
        freezesAvailable -= missing;
        // Mark each missing date as frozen
        for (let i = 1; i <= missing; i++) {
          const d = new Date(prev.lastDate + 'T00:00:00');
          d.setDate(d.getDate() + i);
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          freezesUsed.push(`${y}-${m}-${dd}`);
        }
        current = prev.current + 1;
      } else {
        // Streak broken
        current = 1;
      }
    } else {
      // gap === 0 already handled; negative shouldn't happen
      current = prev.current;
    }
  }

  if (current > longest) longest = current;

  // Earn a freeze every 10 streak days, capped at 4
  const freezesEarnedNow = current % 10 === 0 && current > 0 && freezesAvailable < 4 ? 1 : 0;
  freezesAvailable = Math.min(4, freezesAvailable + freezesEarnedNow);

  const newStreak: Streak = {
    current,
    longest,
    lastDate: date,
    freezesAvailable,
    freezesUsed,
    totalDays: prev.totalDays + 1,
  };

  // Detect newly-earned milestones
  const previouslyEarned = new Set(data.badges);
  const newMilestones: StreakMilestone[] = MILESTONES.filter(
    m => current >= m.days && !previouslyEarned.has(m.id)
  );

  return { streak: newStreak, newMilestones };
}

/**
 * Compute weekly ring values [0..1] for the 7 days ending today.
 * One ring per category: strength, cardio, mobility.
 * Target = at least one session of that category in the week.
 */
export interface WeeklyRings {
  strength: number;
  cardio: number;
  mobility: number;
  daysWithSession: number;
}

export function weeklyRings(data: AppData, now: Date = new Date()): WeeklyRings {
  const today = todayKey(now);
  const start = new Date(now);
  start.setDate(start.getDate() - 6);
  const startKey = todayKey(start);

  const within = data.sessions.filter(
    s => s.completed && s.date >= startKey && s.date <= today
  );

  const strengthCount = within.filter(s => s.category === 'strength').length;
  const cardioCount = within.filter(s => s.category === 'cardio').length;
  const mobilityCount = within.filter(s => s.category === 'mobility' || s.category === 'recovery').length;

  // Targets per week (rough): strength 3, cardio 1, mobility 2
  const strength = Math.min(1, strengthCount / 3);
  const cardio = Math.min(1, cardioCount / 1);
  const mobility = Math.min(1, mobilityCount / 2);

  const uniqueDates = new Set(within.map(s => s.date));
  return { strength, cardio, mobility, daysWithSession: uniqueDates.size };
}

/** Whether today's streak is still "at risk" (not done yet). */
export function streakAtRiskToday(data: AppData): boolean {
  return data.streak.lastDate !== todayKey() && data.streak.current > 0;
}
