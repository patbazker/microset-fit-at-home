// ---- Domain types ----

export type PatternId =
  | 'push-h'      // horizontal push (push-up family)
  | 'push-v'      // vertical push (pike / handstand)
  | 'pull-h'      // horizontal pull (rows)
  | 'squat'
  | 'hinge'
  | 'core-ext'    // anti-extension (hollow, dead bug)
  | 'core-rot'    // anti-rotation (side plank, bird dog)
  | 'cardio'
  | 'mobility'
  | 'skill';

export type DayType =
  | 'push'
  | 'cardio'
  | 'legs'
  | 'pull-core'
  | 'mobility'
  | 'skill'
  | 'recovery';

export type RingCategory = 'strength' | 'cardio' | 'mobility';

export type Metric = 'reps' | 'hold' | 'time';

export interface Exercise {
  id: string;
  name: string;
  pattern: PatternId;
  level: number;        // 1..12 within its ladder
  metric: Metric;
  emoji: string;
  cues: string[];
  // Default work parameters
  defaultReps?: number;
  defaultHoldSec?: number;
}

export type StepKind = 'prep' | 'exercise' | 'rest' | 'circuit' | 'emom' | 'cooldown';

export interface PlanStep {
  id: string;
  kind: StepKind;
  title: string;
  description?: string;
  // For prep/rest/cooldown
  durationSec?: number;
  // For 'exercise' (single set or hold)
  patternRef?: PatternId;       // resolved at runtime to current level
  exerciseId?: string;          // override when a fixed exercise (e.g. dead bug)
  sets?: number;
  repsTarget?: number;
  holdSec?: number;
  restBetweenSetsSec?: number;
  // For 'emom' — every minute on the minute
  emomMinutes?: number;
  emomRepsTarget?: number;
  // For 'circuit' (HIIT)
  circuitRounds?: number;
  circuitWorkSec?: number;
  circuitRestSec?: number;
  circuitExerciseIds?: string[];  // direct ids (cardio moves are fixed list)
}

export interface DayPlan {
  dayType: DayType;
  title: string;
  subtitle: string;
  emoji: string;
  category: RingCategory | 'recovery';
  estMinutes: number;
  steps: PlanStep[];
}

// ---- Logged session ----

export interface LoggedSet {
  reps?: number;
  holdSec?: number;
  rpe?: number;     // 1..10
}

export interface LoggedExercise {
  exerciseId: string;
  pattern: PatternId;
  level: number;
  sets: LoggedSet[];
}

export interface Session {
  id: string;
  date: string;             // YYYY-MM-DD (local)
  startedAt: number;
  endedAt: number;
  dayType: DayType;
  category: RingCategory | 'recovery';
  durationSec: number;
  exercises: LoggedExercise[];
  rpe?: number;             // session-level
  note?: string;
  completed: boolean;       // false if exited early
}

// ---- Persistent profile / progress ----

export interface PatternProgress {
  level: number;            // 1..12
  consecutiveTargetHits: number; // for auto-progression
  bestReps?: number;
  bestHoldSec?: number;
}

export interface Streak {
  current: number;
  longest: number;
  lastDate: string | null;  // YYYY-MM-DD of last completed
  freezesAvailable: number;
  freezesUsed: string[];    // dates a freeze was applied to
  totalDays: number;
}

export interface Profile {
  name: string;
  weightKg: number;
  birthYear: number;
  startedAt: number;
  reminderHour: number | null;  // 0..23 or null
}

export interface Settings {
  sound: boolean;
  haptics: boolean;
  voiceCues: boolean;
  keepScreenOn: boolean;
}

export interface AppData {
  profile: Profile;
  settings: Settings;
  streak: Streak;
  patternProgress: Record<PatternId, PatternProgress>;
  sessions: Session[];
  badges: string[];          // earned milestone ids
}
