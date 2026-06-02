import type { Exercise, PatternId } from './types';

// 12-level ladders per pattern. Earlier levels = easier regressions.
// Designed for 49yo, bodyweight only, no equipment.

const E = (
  id: string,
  name: string,
  pattern: PatternId,
  level: number,
  metric: 'reps' | 'hold' | 'time',
  emoji: string,
  cues: string[],
  defaults: { defaultReps?: number; defaultHoldSec?: number } = {}
): Exercise => ({ id, name, pattern, level, metric, emoji, cues, ...defaults });

export const LADDERS: Record<PatternId, Exercise[]> = {
  'push-h': [
    E('wall-pushup', 'Pompe au mur', 'push-h', 1, 'reps', '🧱', ['Corps gainé', 'Coudes vers l\'arrière', 'Descente contrôlée'], { defaultReps: 12 }),
    E('incline-pushup-high', 'Pompe inclinée (table)', 'push-h', 2, 'reps', '📐', ['Mains sur table/comptoir', 'Gainage actif'], { defaultReps: 10 }),
    E('incline-pushup-low', 'Pompe inclinée (chaise)', 'push-h', 3, 'reps', '🪑', ['Mains sur chaise stable', 'Coudes 45°'], { defaultReps: 10 }),
    E('knee-pushup', 'Pompe sur genoux', 'push-h', 4, 'reps', '🦵', ['Ligne hanche-genou-épaule', 'Descente 3s'], { defaultReps: 10 }),
    E('pushup', 'Pompe classique', 'push-h', 5, 'reps', '💪', ['Corps droit', 'Poitrine au sol', 'Coudes 45°'], { defaultReps: 10 }),
    E('tempo-pushup', 'Pompe tempo 3-1-3', 'push-h', 6, 'reps', '🐢', ['3s descente, 1s pause, 3s montée'], { defaultReps: 6 }),
    E('diamond-pushup', 'Pompe diamant', 'push-h', 7, 'reps', '💎', ['Mains en losange', 'Coudes près du corps'], { defaultReps: 8 }),
    E('decline-pushup', 'Pompe pieds surélevés', 'push-h', 8, 'reps', '🔼', ['Pieds sur chaise', 'Garde le dos plat'], { defaultReps: 8 }),
    E('archer-pushup-assist', 'Archer assistée', 'push-h', 9, 'reps', '🏹', ['Bras tendu en support', 'Charge un côté'], { defaultReps: 5 }),
    E('archer-pushup', 'Archer push-up', 'push-h', 10, 'reps', '🎯', ['Bras opposé tendu', 'Descente sur un bras'], { defaultReps: 4 }),
    E('one-arm-pushup-assist', 'One-arm assistée', 'push-h', 11, 'reps', '☝️', ['Une main au sol, l\'autre sur surface basse'], { defaultReps: 3 }),
    E('one-arm-pushup', 'One-arm push-up', 'push-h', 12, 'reps', '🔥', ['Stance large', 'Hanches stables'], { defaultReps: 2 }),
  ],
  'push-v': [
    E('wall-lean', 'Wall lean (anti-handstand)', 'push-v', 1, 'hold', '🧍', ['Mains au mur, pieds éloignés', 'Pousser dans le mur'], { defaultHoldSec: 30 }),
    E('pike-floor', 'Pike push-up sol', 'push-v', 2, 'reps', '⛰️', ['Pieds au sol, V inversé', 'Tête vers les mains'], { defaultReps: 8 }),
    E('pike-elevated', 'Pike pieds surélevés', 'push-v', 3, 'reps', '🗻', ['Pieds sur chaise', 'V plus prononcé'], { defaultReps: 6 }),
    E('wall-hs-hold-30', 'Handstand mur 30s', 'push-v', 4, 'hold', '🙃', ['Dos au mur ou face au mur', 'Gainage'], { defaultHoldSec: 30 }),
    E('wall-hs-hold-45', 'Handstand mur 45s', 'push-v', 5, 'hold', '🙃', ['Respirer', 'Pousser dans le sol'], { defaultHoldSec: 45 }),
    E('wall-hspu-negative', 'Wall HSPU négative', 'push-v', 6, 'reps', '⬇️', ['Descente 5s', 'Remonter avec pieds'], { defaultReps: 3 }),
    E('wall-hspu-partial', 'Wall HSPU partielle', 'push-v', 7, 'reps', '🎯', ['Mi-amplitude', 'Pas de cambrure'], { defaultReps: 3 }),
    E('wall-hspu', 'Wall handstand push-up', 'push-v', 8, 'reps', '🤸', ['Pleine amplitude', 'Tête entre les mains'], { defaultReps: 3 }),
    E('wall-hspu-deep', 'HSPU avec déficit', 'push-v', 9, 'reps', '🌋', ['Mains sur livres', 'Plus d\'amplitude'], { defaultReps: 3 }),
    E('freestanding-hs-attempt', 'Handstand libre tenté', 'push-v', 10, 'time', '🦩', ['Kick up et tente l\'équilibre'], { defaultHoldSec: 10 }),
    E('freestanding-hs', 'Handstand libre 10s', 'push-v', 11, 'hold', '🦋', ['Doigts actifs, regard entre les mains'], { defaultHoldSec: 10 }),
    E('freestanding-hspu', 'Freestanding HSPU', 'push-v', 12, 'reps', '👑', ['Skill avancée'], { defaultReps: 1 }),
  ],
  'pull-h': [
    E('door-scap-pull', 'Scapular pull à la porte', 'pull-h', 1, 'reps', '🚪', ['Serviette autour poignée', 'Serrer omoplates'], { defaultReps: 12 }),
    E('towel-row', 'Towel row porte', 'pull-h', 2, 'reps', '🧻', ['Pieds près de la porte', 'Tirer poitrine vers porte'], { defaultReps: 10 }),
    E('table-row-bent', 'Row sous table genoux pliés', 'pull-h', 3, 'reps', '🪑', ['Sous table solide', 'Genoux pliés'], { defaultReps: 8 }),
    E('table-row', 'Row sous table jambes tendues', 'pull-h', 4, 'reps', '➖', ['Corps droit', 'Poitrine touche la table'], { defaultReps: 8 }),
    E('table-row-feet-up', 'Row pieds surélevés', 'pull-h', 5, 'reps', '🔼', ['Pieds sur chaise', 'Plus de charge'], { defaultReps: 8 }),
    E('table-row-tempo', 'Row tempo 3-1-3', 'pull-h', 6, 'reps', '🐢', ['3s tirée, 1s pause'], { defaultReps: 6 }),
    E('archer-row-assist', 'Archer row assistée', 'pull-h', 7, 'reps', '🏹', ['Une main porte la charge'], { defaultReps: 6 }),
    E('archer-row', 'Archer row', 'pull-h', 8, 'reps', '🎯', ['Bras opposé tendu'], { defaultReps: 5 }),
    E('one-arm-row-assist', 'One-arm row assistée', 'pull-h', 9, 'reps', '☝️', ['Un bras, l\'autre en touche légère'], { defaultReps: 4 }),
    E('one-arm-row', 'One-arm row', 'pull-h', 10, 'reps', '🔥', ['Plein équilibre rotation'], { defaultReps: 3 }),
    E('one-arm-row-tempo', 'One-arm row tempo', 'pull-h', 11, 'reps', '🐢', ['3s descente'], { defaultReps: 3 }),
    E('one-arm-row-elevated', 'One-arm row pieds surélevés', 'pull-h', 12, 'reps', '👑', ['Pieds sur chaise'], { defaultReps: 3 }),
  ],
  'squat': [
    E('chair-sit', 'Squat sur chaise', 'squat', 1, 'reps', '🪑', ['S\'asseoir doucement', 'Se lever sans s\'aider des mains'], { defaultReps: 12 }),
    E('chair-squat', 'Squat avec touche chaise', 'squat', 2, 'reps', '💺', ['Frôler la chaise sans s\'asseoir'], { defaultReps: 12 }),
    E('bw-squat-half', 'Squat demi-amplitude', 'squat', 3, 'reps', '〰️', ['Cuisses parallèles', 'Genoux suivent les pieds'], { defaultReps: 15 }),
    E('bw-squat', 'Squat complet', 'squat', 4, 'reps', '🦵', ['Hanches sous genoux', 'Talons au sol'], { defaultReps: 15 }),
    E('tempo-squat', 'Squat tempo 3-1-3', 'squat', 5, 'reps', '🐢', ['Descente 3s'], { defaultReps: 10 }),
    E('split-squat', 'Split squat', 'squat', 6, 'reps', '🪜', ['Genou arrière touche presque', 'Tronc droit'], { defaultReps: 8 }),
    E('bulgarian-split', 'Bulgarian split squat', 'squat', 7, 'reps', '🇧🇬', ['Pied arrière sur chaise', 'Descendre droit'], { defaultReps: 8 }),
    E('cossack-squat', 'Cossack squat', 'squat', 8, 'reps', '↔️', ['Latéral, une jambe tendue'], { defaultReps: 6 }),
    E('shrimp-squat-assist', 'Shrimp squat assisté', 'squat', 9, 'reps', '🦐', ['Une main au mur', 'Pied dans la main'], { defaultReps: 5 }),
    E('pistol-box', 'Pistol vers boîte', 'squat', 10, 'reps', '📦', ['S\'asseoir sur surface basse, une jambe'], { defaultReps: 4 }),
    E('pistol-assist', 'Pistol squat assisté', 'squat', 11, 'reps', '☝️', ['Une main au mur'], { defaultReps: 3 }),
    E('pistol', 'Pistol squat', 'squat', 12, 'reps', '🔥', ['Une jambe tendue devant', 'Talon au sol'], { defaultReps: 3 }),
  ],
  'hinge': [
    E('glute-bridge', 'Pont fessier', 'hinge', 1, 'reps', '🌉', ['Pieds à plat', 'Serrer les fessiers en haut'], { defaultReps: 15 }),
    E('glute-bridge-march', 'Pont avec marche', 'hinge', 2, 'reps', '🚶', ['Lever genou alterné', 'Hanches stables'], { defaultReps: 12 }),
    E('sl-glute-bridge', 'Pont unilatéral', 'hinge', 3, 'reps', '🦿', ['Une jambe, l\'autre tendue'], { defaultReps: 10 }),
    E('hip-thrust-elevated', 'Hip thrust pieds surélevés', 'hinge', 4, 'reps', '🚀', ['Pieds sur chaise', 'Hanches en extension max'], { defaultReps: 12 }),
    E('sl-rdl', 'RDL unilatéral (PdC)', 'hinge', 5, 'reps', '⚖️', ['Une jambe, bascule du bassin', 'Dos droit'], { defaultReps: 10 }),
    E('sl-rdl-touch', 'RDL touche au sol', 'hinge', 6, 'reps', '👆', ['Doigts au sol à chaque rep'], { defaultReps: 10 }),
    E('good-morning', 'Good morning (PdC)', 'hinge', 7, 'reps', '🌅', ['Mains derrière tête', 'Charnière de hanche'], { defaultReps: 12 }),
    E('sl-hip-thrust', 'Hip thrust unilatéral', 'hinge', 8, 'reps', '🦿', ['Une jambe sur chaise'], { defaultReps: 8 }),
    E('sliding-leg-curl', 'Sliding leg curl', 'hinge', 9, 'reps', '🛼', ['Pieds sur torchon, glisser'], { defaultReps: 8 }),
    E('nordic-negative', 'Nordic négative', 'hinge', 10, 'reps', '🛡️', ['Pieds ancrés (canapé)', 'Descente 5s contrôlée'], { defaultReps: 3 }),
    E('nordic-partial', 'Nordic partielle', 'hinge', 11, 'reps', '🎯', ['Remonte à mi-chemin'], { defaultReps: 3 }),
    E('nordic-full', 'Nordic curl complet', 'hinge', 12, 'reps', '👑', ['Descente et remontée'], { defaultReps: 2 }),
  ],
  'core-ext': [
    E('dead-bug', 'Dead bug', 'core-ext', 1, 'reps', '🐞', ['Bas du dos collé au sol', 'Bras + jambe opposés'], { defaultReps: 10 }),
    E('hollow-tuck', 'Hollow tuck hold', 'core-ext', 2, 'hold', '🥚', ['Genoux pliés', 'Bas du dos au sol'], { defaultHoldSec: 20 }),
    E('hollow-hold-30', 'Hollow hold 30s', 'core-ext', 3, 'hold', '🥚', ['Jambes tendues', 'Bras au-dessus tête'], { defaultHoldSec: 30 }),
    E('hollow-rock', 'Hollow rock', 'core-ext', 4, 'reps', '🌊', ['Bascule comme une banane'], { defaultReps: 15 }),
    E('hollow-hold-45', 'Hollow hold 45s', 'core-ext', 5, 'hold', '🥚', ['Sans casser la position'], { defaultHoldSec: 45 }),
    E('toes-to-sky', 'Toes to sky', 'core-ext', 6, 'reps', '🦶', ['Allongé, lever bassin'], { defaultReps: 10 }),
    E('l-sit-tuck', 'L-sit tuck (sur livres)', 'core-ext', 7, 'hold', '📚', ['Mains sur livres', 'Genoux serrés'], { defaultHoldSec: 10 }),
    E('l-sit-one-leg', 'L-sit une jambe', 'core-ext', 8, 'hold', '🦩', ['Une jambe tendue'], { defaultHoldSec: 10 }),
    E('l-sit', 'L-sit', 'core-ext', 9, 'hold', '🔥', ['Deux jambes tendues'], { defaultHoldSec: 10 }),
    E('v-sit-tuck', 'V-sit tuck', 'core-ext', 10, 'hold', '✌️', ['Pieds plus haut que hanches'], { defaultHoldSec: 8 }),
    E('v-sit-one-leg', 'V-sit une jambe', 'core-ext', 11, 'hold', '🎯', ['Une jambe tendue verticale'], { defaultHoldSec: 6 }),
    E('v-sit', 'V-sit', 'core-ext', 12, 'hold', '👑', ['Skill avancée'], { defaultHoldSec: 5 }),
  ],
  'core-rot': [
    E('bird-dog', 'Bird dog', 'core-rot', 1, 'reps', '🐕', ['4 pattes', 'Bras + jambe opposés'], { defaultReps: 10 }),
    E('side-plank-knee', 'Side plank genoux', 'core-rot', 2, 'hold', '📐', ['Hanches hautes'], { defaultHoldSec: 20 }),
    E('side-plank', 'Side plank 30s', 'core-rot', 3, 'hold', '📐', ['Corps droit', 'Pieds empilés'], { defaultHoldSec: 30 }),
    E('side-plank-45', 'Side plank 45s', 'core-rot', 4, 'hold', '📐', ['Sans casser'], { defaultHoldSec: 45 }),
    E('side-plank-reach', 'Side plank reach-through', 'core-rot', 5, 'reps', '🔄', ['Passe bras sous le corps'], { defaultReps: 8 }),
    E('side-plank-hip-dip', 'Side plank hip dip', 'core-rot', 6, 'reps', '〰️', ['Hanches montent/descendent'], { defaultReps: 10 }),
    E('copenhagen-short', 'Copenhagen plank court', 'core-rot', 7, 'hold', '🇩🇰', ['Genou de la jambe haute sur chaise'], { defaultHoldSec: 20 }),
    E('copenhagen', 'Copenhagen plank', 'core-rot', 8, 'hold', '🇩🇰', ['Cheville sur chaise', 'Jambe basse soulevée'], { defaultHoldSec: 20 }),
    E('copenhagen-raise', 'Copenhagen avec raise', 'core-rot', 9, 'reps', '⬆️', ['Lever et descendre la jambe basse'], { defaultReps: 8 }),
    E('side-plank-clam', 'Side plank avec clam', 'core-rot', 10, 'reps', '🐚', ['Ouvrir/fermer la hanche'], { defaultReps: 10 }),
    E('star-plank', 'Star plank', 'core-rot', 11, 'hold', '⭐', ['Bras et jambe haute levés'], { defaultHoldSec: 15 }),
    E('one-arm-plank', 'Plank un bras', 'core-rot', 12, 'hold', '👑', ['Pieds écartés, anti-rotation'], { defaultHoldSec: 20 }),
  ],
  // Cardio moves used in HIIT circuits. "Level" reflects intensity; user can swap easier ones.
  cardio: [
    E('march-place', 'Marche sur place', 'cardio', 1, 'time', '🚶', ['Lever genoux', 'Respiration nasale'], { defaultHoldSec: 30 }),
    E('high-knees-slow', 'Montées de genoux lentes', 'cardio', 2, 'time', '🏃', ['Cadence modérée'], { defaultHoldSec: 30 }),
    E('jumping-jacks', 'Jumping jacks', 'cardio', 3, 'time', '🤸', ['Bras et jambes synchros'], { defaultHoldSec: 30 }),
    E('shadow-boxing', 'Shadow boxing', 'cardio', 4, 'time', '🥊', ['Jab-cross, garde haute'], { defaultHoldSec: 30 }),
    E('mountain-climbers', 'Mountain climbers', 'cardio', 5, 'time', '⛰️', ['Position planche', 'Genoux vers poitrine'], { defaultHoldSec: 30 }),
    E('skater-jumps', 'Skater jumps', 'cardio', 6, 'time', '⛸️', ['Sauts latéraux', 'Atterrir doucement'], { defaultHoldSec: 30 }),
    E('squat-jumps', 'Squat jumps', 'cardio', 7, 'time', '🦘', ['Descendre + exploser', 'Atterrir genoux mous'], { defaultHoldSec: 30 }),
    E('burpees-step', 'Burpees step-back', 'cardio', 8, 'time', '💥', ['Sans saut, recule un pied'], { defaultHoldSec: 30 }),
    E('burpees', 'Burpees complets', 'cardio', 9, 'time', '🔥', ['Saut + pompe + saut'], { defaultHoldSec: 30 }),
    E('plank-jacks', 'Plank jacks', 'cardio', 10, 'time', '🏋️', ['Planche + sauts écart-serré'], { defaultHoldSec: 30 }),
    E('star-jumps', 'Star jumps', 'cardio', 11, 'time', '⭐', ['Sauts en étoile explosifs'], { defaultHoldSec: 30 }),
    E('tuck-jumps', 'Tuck jumps', 'cardio', 12, 'time', '👑', ['Genoux à la poitrine en l\'air'], { defaultHoldSec: 30 }),
  ],
  mobility: [
    E('cat-cow', 'Cat-cow', 'mobility', 1, 'reps', '🐈', ['Respire avec le mouvement'], { defaultReps: 8 }),
    E('thoracic-rotation', 'Rotations thoraciques', 'mobility', 2, 'reps', '🌀', ['4 pattes, main derrière tête'], { defaultReps: 8 }),
    E('worlds-greatest', 'World\'s greatest stretch', 'mobility', 3, 'reps', '🌍', ['Fente + rotation', 'Coude au sol puis ciel'], { defaultReps: 6 }),
    E('90-90-switch', '90/90 hip switches', 'mobility', 4, 'reps', '🔄', ['Assis, alterner les côtés'], { defaultReps: 10 }),
    E('cossack-flow', 'Cossack flow', 'mobility', 5, 'reps', '↔️', ['Lent, sans charge'], { defaultReps: 6 }),
    E('beast-to-crab', 'Beast → Crab', 'mobility', 6, 'reps', '🦀', ['Transition fluide'], { defaultReps: 6 }),
    E('scorpion-reach', 'Scorpion reach', 'mobility', 7, 'reps', '🦂', ['Sur le ventre, jambe par-dessus'], { defaultReps: 6 }),
    E('deep-squat-hold', 'Deep squat hold', 'mobility', 8, 'hold', '🧘', ['Talons au sol, dos droit'], { defaultHoldSec: 60 }),
    E('couch-stretch', 'Couch stretch', 'mobility', 9, 'hold', '🛋️', ['Pied sur canapé, fente'], { defaultHoldSec: 45 }),
    E('jefferson-curl', 'Jefferson curl PdC', 'mobility', 10, 'reps', '🌊', ['Roulement vertèbre par vertèbre'], { defaultReps: 5 }),
    E('shoulder-dislocate', 'Shoulder dislocate (serviette)', 'mobility', 11, 'reps', '🧻', ['Serviette tendue, passe derrière'], { defaultReps: 10 }),
    E('full-flow', 'Flow complet libre', 'mobility', 12, 'time', '🌊', ['Combine tes mouvements préférés'], { defaultHoldSec: 60 }),
  ],
  skill: [
    E('wall-hs-skill', 'Skill: Wall handstand', 'skill', 1, 'hold', '🤸', ['5 sets × 20s hold'], { defaultHoldSec: 20 }),
    E('crow-pose', 'Skill: Crow pose', 'skill', 2, 'hold', '🐦', ['Genoux sur triceps, équilibre avant'], { defaultHoldSec: 15 }),
    E('pistol-neg', 'Skill: Pistol négatif', 'skill', 3, 'reps', '🦩', ['Descente 5s sur une jambe'], { defaultReps: 3 }),
    E('l-sit-skill', 'Skill: L-sit progression', 'skill', 4, 'hold', '📚', ['Sur livres, mains au sol'], { defaultHoldSec: 10 }),
    E('handstand-walk-attempt', 'Skill: Handstand walks', 'skill', 5, 'reps', '🚶', ['Mur, déplace une main'], { defaultReps: 4 }),
    E('back-bridge', 'Skill: Pont (bridge)', 'skill', 6, 'hold', '🌉', ['Hanches hautes', 'Épaules au-dessus mains'], { defaultHoldSec: 20 }),
    E('shrimp-skill', 'Skill: Shrimp squat', 'skill', 7, 'reps', '🦐', ['Une jambe tenue'], { defaultReps: 3 }),
    E('human-flag-tuck', 'Skill: Human flag tuck (porte)', 'skill', 8, 'hold', '🚩', ['Encadrement de porte'], { defaultHoldSec: 5 }),
    E('planche-lean', 'Skill: Planche lean', 'skill', 9, 'hold', '🛩️', ['Penche-toi en avant en planche'], { defaultHoldSec: 20 }),
    E('tuck-planche', 'Skill: Tuck planche', 'skill', 10, 'hold', '🛩️', ['Genoux au tronc, pieds décollés'], { defaultHoldSec: 5 }),
    E('front-lever-tuck', 'Skill: Tuck front lever', 'skill', 11, 'hold', '🏳️', ['Suspendu, genoux serrés'], { defaultHoldSec: 5 }),
    E('muscle-up-prep', 'Skill: Muscle-up prep', 'skill', 12, 'reps', '👑', ['Tractions explosives'], { defaultReps: 1 }),
  ],
};

// Flat index for fast lookup
export const EXERCISES: Record<string, Exercise> = Object.values(LADDERS)
  .flat()
  .reduce((acc, ex) => {
    acc[ex.id] = ex;
    return acc;
  }, {} as Record<string, Exercise>);

export function exerciseAtLevel(pattern: PatternId, level: number): Exercise {
  const ladder = LADDERS[pattern];
  const clamped = Math.max(1, Math.min(ladder.length, level));
  return ladder[clamped - 1];
}

export function exerciseById(id: string): Exercise | undefined {
  return EXERCISES[id];
}
