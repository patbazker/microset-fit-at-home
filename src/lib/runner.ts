import type { DayPlan, PatternId, AppData } from './types';
import { exerciseAtLevel, exerciseById } from './exercises';

export type Phase =
  | {
      kind: 'instruction';
      title: string;
      description?: string;
      durationSec: number;
      emoji?: string;
    }
  | {
      kind: 'work-reps';            // user-paced, taps "Done" when set complete
      title: string;
      description?: string;
      exerciseId: string;
      pattern: PatternId;
      level: number;
      emoji: string;
      cues: string[];
      targetReps: number;
      setIndex: number;
      setTotal: number;
    }
  | {
      kind: 'work-hold';            // auto-counting hold
      title: string;
      exerciseId: string;
      pattern: PatternId;
      level: number;
      emoji: string;
      cues: string[];
      durationSec: number;
      setIndex: number;
      setTotal: number;
    }
  | {
      kind: 'work-time';            // cardio-style timed effort
      title: string;
      exerciseId: string;
      pattern: PatternId;
      level: number;
      emoji: string;
      cues: string[];
      durationSec: number;
      setIndex: number;
      setTotal: number;
    }
  | {
      kind: 'rest';
      durationSec: number;
      nextTitle?: string;
      nextEmoji?: string;
    }
  | { kind: 'summary' };

export interface LoggedSetTmp {
  exerciseId: string;
  pattern: PatternId;
  level: number;
  reps?: number;
  holdSec?: number;
  rpe?: number;
}

export function compile(plan: DayPlan, data: AppData): Phase[] {
  const phases: Phase[] = [];

  for (const step of plan.steps) {
    if (step.kind === 'prep' || step.kind === 'cooldown') {
      phases.push({
        kind: 'instruction',
        title: step.title,
        description: step.description,
        durationSec: step.durationSec ?? 60,
        emoji: step.kind === 'prep' ? '🌅' : '🌙',
      });
      continue;
    }

    if (step.kind === 'exercise') {
      // Resolve exercise
      let ex;
      if (step.exerciseId) {
        ex = exerciseById(step.exerciseId);
      } else if (step.patternRef) {
        const lvl = data.patternProgress[step.patternRef]?.level ?? 1;
        ex = exerciseAtLevel(step.patternRef, lvl);
      }
      if (!ex) continue;

      const sets = step.sets ?? 1;
      const repsTarget = step.repsTarget ?? ex.defaultReps ?? 8;
      const holdSec = step.holdSec ?? ex.defaultHoldSec ?? 30;
      const rest = step.restBetweenSetsSec ?? 30;

      for (let i = 0; i < sets; i++) {
        if (ex.metric === 'reps') {
          phases.push({
            kind: 'work-reps',
            title: ex.name,
            description: step.description,
            exerciseId: ex.id,
            pattern: ex.pattern,
            level: ex.level,
            emoji: ex.emoji,
            cues: ex.cues,
            targetReps: repsTarget,
            setIndex: i + 1,
            setTotal: sets,
          });
        } else if (ex.metric === 'hold') {
          phases.push({
            kind: 'work-hold',
            title: ex.name,
            exerciseId: ex.id,
            pattern: ex.pattern,
            level: ex.level,
            emoji: ex.emoji,
            cues: ex.cues,
            durationSec: holdSec,
            setIndex: i + 1,
            setTotal: sets,
          });
        } else {
          phases.push({
            kind: 'work-time',
            title: ex.name,
            exerciseId: ex.id,
            pattern: ex.pattern,
            level: ex.level,
            emoji: ex.emoji,
            cues: ex.cues,
            durationSec: holdSec,
            setIndex: i + 1,
            setTotal: sets,
          });
        }

        if (i < sets - 1 && rest > 0) {
          phases.push({ kind: 'rest', durationSec: rest });
        }
      }
      continue;
    }

    if (step.kind === 'circuit') {
      const rounds = step.circuitRounds ?? 1;
      const work = step.circuitWorkSec ?? 30;
      const restSec = step.circuitRestSec ?? 10;
      const ids = step.circuitExerciseIds ?? [];
      const total = rounds * ids.length;
      let idx = 0;
      for (let r = 0; r < rounds; r++) {
        for (let i = 0; i < ids.length; i++) {
          const ex = exerciseById(ids[i]);
          if (!ex) continue;
          idx++;
          phases.push({
            kind: 'work-time',
            title: ex.name,
            exerciseId: ex.id,
            pattern: ex.pattern,
            level: ex.level,
            emoji: ex.emoji,
            cues: ex.cues,
            durationSec: work,
            setIndex: idx,
            setTotal: total,
          });
          // Rest between exercises within the circuit (skip after last of last round)
          const isLast = r === rounds - 1 && i === ids.length - 1;
          if (!isLast && restSec > 0) {
            const next = exerciseById(ids[(i + 1) % ids.length]);
            phases.push({
              kind: 'rest',
              durationSec: restSec,
              nextTitle: next?.name,
              nextEmoji: next?.emoji,
            });
          }
        }
      }
      continue;
    }
  }

  phases.push({ kind: 'summary' });
  return phases;
}

export function totalDurationEstimateSec(phases: Phase[]): number {
  return phases.reduce((acc, p) => {
    if (p.kind === 'instruction') return acc + p.durationSec;
    if (p.kind === 'rest') return acc + p.durationSec;
    if (p.kind === 'work-hold' || p.kind === 'work-time') return acc + p.durationSec;
    if (p.kind === 'work-reps') return acc + Math.max(20, p.targetReps * 3); // rough
    return acc;
  }, 0);
}
