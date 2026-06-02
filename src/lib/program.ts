import type { DayPlan, DayType } from './types';

// 7-day rotation. Each plan ~10 minutes total.
// `patternRef` is resolved at session-start to the user's current level.

let stepId = 0;
const sid = () => `s${++stepId}`;

export const WEEKLY_ROTATION: DayType[] = [
  'recovery',   // 0 Sunday
  'push',       // 1 Monday
  'cardio',     // 2 Tuesday
  'legs',       // 3 Wednesday
  'pull-core',  // 4 Thursday
  'mobility',   // 5 Friday
  'skill',      // 6 Saturday
];

export const DAY_PLANS: Record<DayType, DayPlan> = {
  push: {
    dayType: 'push',
    title: 'Push Day',
    subtitle: 'Pectoraux · épaules · triceps',
    emoji: '💪',
    category: 'strength',
    estMinutes: 10,
    steps: [
      { id: sid(), kind: 'prep', title: 'Échauffement épaules', description: 'Rotations bras avant/arrière, scapular CARs', durationSec: 60 },
      { id: sid(), kind: 'exercise', title: 'Pompe (niveau)', patternRef: 'push-h', sets: 3, restBetweenSetsSec: 45, description: '3 séries à 1-2 reps avant échec' },
      { id: sid(), kind: 'exercise', title: 'Push vertical (niveau)', patternRef: 'push-v', sets: 2, restBetweenSetsSec: 45 },
      { id: sid(), kind: 'cooldown', title: 'Étirement poitrine', description: 'Bras tendu contre cadre de porte, 30s par côté', durationSec: 60 },
    ],
  },

  cardio: {
    dayType: 'cardio',
    title: 'HIIT 7 minutes',
    subtitle: 'Conditionnement métabolique',
    emoji: '🔥',
    category: 'cardio',
    estMinutes: 10,
    steps: [
      { id: sid(), kind: 'prep', title: 'Activation', description: 'Marche sur place + rotations articulaires', durationSec: 60 },
      {
        id: sid(),
        kind: 'circuit',
        title: 'Circuit HIIT (ACSM)',
        description: '7 exercices · 30s travail / 10s repos · 1 tour',
        circuitRounds: 1,
        circuitWorkSec: 30,
        circuitRestSec: 10,
        circuitExerciseIds: [
          'jumping-jacks',
          'bw-squat',
          'pushup',
          'mountain-climbers',
          'skater-jumps',
          'hollow-tuck',
          'high-knees-slow',
        ],
      },
      { id: sid(), kind: 'cooldown', title: 'Respiration', description: '5 cycles 4-7-8 (inspire 4s, retiens 7s, expire 8s)', durationSec: 90 },
    ],
  },

  legs: {
    dayType: 'legs',
    title: 'Legs Day',
    subtitle: 'Quadriceps · fessiers · ischios',
    emoji: '🦵',
    category: 'strength',
    estMinutes: 10,
    steps: [
      { id: sid(), kind: 'prep', title: 'Mobilité hanches', description: '90/90 + cossack flow lent', durationSec: 60 },
      { id: sid(), kind: 'exercise', title: 'Squat (niveau)', patternRef: 'squat', sets: 3, restBetweenSetsSec: 45 },
      { id: sid(), kind: 'exercise', title: 'Charnière (niveau)', patternRef: 'hinge', sets: 2, restBetweenSetsSec: 45 },
      { id: sid(), kind: 'cooldown', title: 'Couch stretch', description: '45s par jambe', durationSec: 90 },
    ],
  },

  'pull-core': {
    dayType: 'pull-core',
    title: 'Pull + Core',
    subtitle: 'Dos · biceps · gainage',
    emoji: '🎯',
    category: 'strength',
    estMinutes: 10,
    steps: [
      { id: sid(), kind: 'prep', title: 'Activation scapulaire', description: 'Scapular pulls, ouverture pectorale', durationSec: 60 },
      { id: sid(), kind: 'exercise', title: 'Row horizontal (niveau)', patternRef: 'pull-h', sets: 3, restBetweenSetsSec: 45 },
      { id: sid(), kind: 'exercise', title: 'Core anti-extension', patternRef: 'core-ext', sets: 2, restBetweenSetsSec: 30 },
      { id: sid(), kind: 'exercise', title: 'Core anti-rotation', patternRef: 'core-rot', sets: 2, restBetweenSetsSec: 30 },
      { id: sid(), kind: 'cooldown', title: 'Ouverture thoracique', description: 'Mains derrière tête, ouvrir + respirer', durationSec: 45 },
    ],
  },

  mobility: {
    dayType: 'mobility',
    title: 'Mobility Flow',
    subtitle: 'Articulations · circulation · récup active',
    emoji: '🧘',
    category: 'mobility',
    estMinutes: 10,
    steps: [
      { id: sid(), kind: 'exercise', title: 'Cat-cow', exerciseId: 'cat-cow', sets: 1, repsTarget: 10, restBetweenSetsSec: 0 },
      { id: sid(), kind: 'exercise', title: 'Rotations thoraciques', exerciseId: 'thoracic-rotation', sets: 1, repsTarget: 8, restBetweenSetsSec: 0 },
      { id: sid(), kind: 'exercise', title: 'World\'s greatest stretch', exerciseId: 'worlds-greatest', sets: 1, repsTarget: 6, restBetweenSetsSec: 0 },
      { id: sid(), kind: 'exercise', title: '90/90 switches', exerciseId: '90-90-switch', sets: 1, repsTarget: 10, restBetweenSetsSec: 0 },
      { id: sid(), kind: 'exercise', title: 'Beast → Crab', exerciseId: 'beast-to-crab', sets: 1, repsTarget: 8, restBetweenSetsSec: 0 },
      { id: sid(), kind: 'exercise', title: 'Deep squat hold', exerciseId: 'deep-squat-hold', sets: 1, holdSec: 60, restBetweenSetsSec: 0 },
      { id: sid(), kind: 'exercise', title: 'Shoulder dislocates', exerciseId: 'shoulder-dislocate', sets: 1, repsTarget: 10, restBetweenSetsSec: 0 },
    ],
  },

  skill: {
    dayType: 'skill',
    title: 'Skill Day',
    subtitle: 'Pratique technique · sub-max',
    emoji: '🤸',
    category: 'strength',
    estMinutes: 10,
    steps: [
      { id: sid(), kind: 'prep', title: 'Activation poignets/épaules', durationSec: 60 },
      { id: sid(), kind: 'exercise', title: 'Skill principal (niveau)', patternRef: 'skill', sets: 5, restBetweenSetsSec: 60, description: 'Sub-max, propre, qualité avant quantité' },
      { id: sid(), kind: 'cooldown', title: 'Poignets + respiration', durationSec: 60 },
    ],
  },

  recovery: {
    dayType: 'recovery',
    title: 'Recovery',
    subtitle: 'Récupération active · ça compte aussi',
    emoji: '🌱',
    category: 'recovery',
    estMinutes: 10,
    steps: [
      { id: sid(), kind: 'prep', title: 'Check-in', description: 'Comment te sens-tu ? Note ton énergie, ton sommeil.', durationSec: 30 },
      { id: sid(), kind: 'exercise', title: 'Marche ou flow doux', exerciseId: 'cat-cow', sets: 1, repsTarget: 10, restBetweenSetsSec: 0, description: 'Optionnel : 10 min de marche dehors à la place' },
      { id: sid(), kind: 'exercise', title: 'Respiration boîte', exerciseId: 'deep-squat-hold', sets: 1, holdSec: 120, restBetweenSetsSec: 0, description: 'Tiens un deep squat en respirant 4-4-4-4' },
      { id: sid(), kind: 'cooldown', title: 'Gratitude', description: 'Une chose pour laquelle tu es reconnaissant aujourd\'hui', durationSec: 30 },
    ],
  },
};

export function planForDate(date: Date): DayPlan {
  const dayIdx = date.getDay(); // 0=Sun, 1=Mon...
  return DAY_PLANS[WEEKLY_ROTATION[dayIdx]];
}

export function planForDayType(dt: DayType): DayPlan {
  return DAY_PLANS[dt];
}
