import type { PoseKey } from './poses';
import type { PatternId } from './types';
import { exerciseById } from './exercises';

export interface ExerciseInfo {
  description?: string;     // 1-2 phrases : à quoi sert l'exo
  muscles?: string[];        // groupes musculaires sollicités
  setup?: string[];          // mise en place / position de départ
  steps?: string[];          // exécution étape par étape
  mistakes?: string[];       // erreurs fréquentes à éviter
  breathing?: string;        // schéma de respiration
  progression?: string;      // comment évoluer
  pose?: PoseKey;
}

// Map keyed by exercise.id. Not every exercise has an entry — getInfo() falls back
// to a sensible default using pattern + name + cues.
const INFO: Record<string, ExerciseInfo> = {
  // ===== push-h =====
  'wall-pushup': {
    description: 'Variante la plus douce de la pompe : on pousse contre un mur debout.',
    muscles: ['Pectoraux', 'Triceps', 'Épaules antérieures', 'Gainage'],
    setup: ['Face au mur, à un pas de distance', 'Mains à hauteur d\'épaules, écart un peu plus large', 'Corps droit, talons légèrement levés'],
    steps: ['Plie les coudes, descends le buste vers le mur', 'Touche presque avec le nez', 'Pousse pour revenir bras tendus'],
    mistakes: ['Cambrer le bas du dos', 'Lever les épaules vers les oreilles', 'Coudes à 90° écartés'],
    breathing: 'Inspire en descendant, expire en poussant',
    progression: 'Quand 15 reps sont faciles, passe sur table/comptoir.',
    pose: 'wall-lean',
  },
  'incline-pushup-high': {
    description: 'Pompe sur surface élevée (table, comptoir) : charge réduite.',
    muscles: ['Pectoraux', 'Triceps', 'Épaules', 'Gainage'],
    setup: ['Mains sur le rebord d\'une table stable', 'Pieds reculés, corps en ligne droite'],
    steps: ['Descends la poitrine vers la table', 'Coudes à environ 45° du buste', 'Pousse en gardant le corps gainé'],
    mistakes: ['Bassin qui s\'affaisse', 'Tête qui pique en avant'],
    breathing: 'Inspire en descendant, expire en poussant',
    pose: 'incline-pushup',
  },
  'incline-pushup-low': {
    description: 'Inclinaison plus basse (chaise) : on s\'approche de la pompe complète.',
    muscles: ['Pectoraux', 'Triceps', 'Épaules', 'Gainage'],
    setup: ['Mains sur une chaise stable', 'Corps en planche'],
    steps: ['Descends jusqu\'à frôler la chaise', 'Coudes ~45°', 'Pousse en serrant les fessiers'],
    mistakes: ['Chaise instable', 'Coudes ouverts à 90°'],
    breathing: 'Inspire en descendant, expire en poussant',
    pose: 'incline-pushup',
  },
  'knee-pushup': {
    description: 'Pompe sur genoux : ~50% du poids de corps.',
    muscles: ['Pectoraux', 'Triceps', 'Épaules', 'Gainage'],
    setup: ['Genoux + mains au sol', 'Ligne droite des épaules aux genoux', 'Mains sous les épaules'],
    steps: ['Descends lentement (3s)', 'Poitrine près du sol', 'Pousse fort'],
    mistakes: ['Hanches qui se cassent (assis sur les talons)', 'Bas du dos cambré'],
    breathing: 'Inspire en descendant, expire en poussant',
    pose: 'knee-pushup',
  },
  pushup: {
    description: 'La pompe classique au sol, base du push horizontal.',
    muscles: ['Pectoraux', 'Triceps', 'Épaules antérieures', 'Gainage', 'Dentelé antérieur'],
    setup: ['Position planche, mains sous les épaules', 'Doigts écartés', 'Corps gainé tête → talons'],
    steps: ['Descends jusqu\'à frôler la poitrine au sol', 'Coudes ~45° (pas de T)', 'Pousse en serrant fessiers + abdos'],
    mistakes: ['Bassin qui tombe', 'Coudes en T (épaules abîmées)', 'Tête qui plonge'],
    breathing: 'Inspire en descendant, expire en poussant',
    progression: 'Ajoute du tempo (3-1-3) avant de passer aux pieds surélevés.',
    pose: 'pushup-top',
  },
  'tempo-pushup': {
    description: 'Pompe au tempo lent : maximise le temps sous tension.',
    muscles: ['Pectoraux', 'Triceps', 'Gainage'],
    setup: ['Comme une pompe classique'],
    steps: ['3s de descente', '1s de pause poitrine près du sol', '3s de montée'],
    mistakes: ['Tricher en accélérant', 'Retenir sa respiration'],
    breathing: 'Inspire pendant la descente, expire pendant la montée',
    pose: 'pushup-bottom',
  },
  'diamond-pushup': {
    description: 'Pompe mains rapprochées en losange : focus triceps.',
    muscles: ['Triceps', 'Pectoraux interne', 'Gainage'],
    setup: ['Index + pouces forment un losange sous la poitrine'],
    steps: ['Descends en gardant les coudes près du corps', 'Frôle les mains avec la poitrine', 'Pousse en extension complète'],
    mistakes: ['Coudes qui s\'écartent', 'Mains trop hautes (sous la tête)'],
    breathing: 'Inspire en descendant, expire en poussant',
    pose: 'pushup-top',
  },
  'decline-pushup': {
    description: 'Pieds surélevés : transfert de charge vers les épaules.',
    muscles: ['Pectoraux haut', 'Épaules', 'Triceps', 'Gainage'],
    setup: ['Pieds sur chaise, mains au sol', 'Corps en ligne droite'],
    steps: ['Descends la poitrine vers le sol', 'Garde le bassin haut', 'Pousse'],
    mistakes: ['Cambrure du bas du dos', 'Tête en hyperextension'],
    breathing: 'Inspire en descendant, expire en poussant',
    pose: 'decline-pushup',
  },
  'archer-pushup-assist': {
    description: 'Transition vers la pompe à un bras : un bras travaille, l\'autre soutient.',
    muscles: ['Pectoraux', 'Triceps', 'Gainage anti-rotation'],
    setup: ['Mains très écartées', 'Un bras tendu en support sur le côté'],
    steps: ['Descends vers la main de travail', 'Le bras tendu glisse en soutien', 'Pousse du bras travaillant'],
    mistakes: ['Bassin qui tourne', 'Charger les deux bras à 50/50'],
    breathing: 'Inspire en descendant, expire en poussant',
    pose: 'pushup-top',
  },
  'archer-pushup': {
    description: 'Pompe archer : presque tout le poids sur un seul bras.',
    muscles: ['Pectoraux', 'Triceps', 'Gainage anti-rotation'],
    setup: ['Mains très écartées', 'Un bras reste tendu'],
    steps: ['Descends d\'un côté', 'Le bras opposé reste tendu', 'Alterne les côtés'],
    mistakes: ['Soulever le bras tendu', 'Rotation du tronc'],
    breathing: 'Inspire en descendant, expire en poussant',
    pose: 'pushup-bottom',
  },
  'one-arm-pushup-assist': {
    description: 'Pompe à un bras assistée par une surface basse.',
    muscles: ['Pectoraux', 'Triceps', 'Gainage anti-rotation'],
    setup: ['Une main au sol, l\'autre sur livre/marche basse'],
    steps: ['Stance large', 'Descente contrôlée', 'Pousse fort'],
    mistakes: ['Tourner les épaules face au sol'],
    breathing: 'Inspire en descendant, expire en poussant',
    pose: 'pushup-top',
  },
  'one-arm-pushup': {
    description: 'L\'objectif final du push horizontal.',
    muscles: ['Pectoraux', 'Triceps', 'Gainage anti-rotation total'],
    setup: ['Pieds très écartés', 'Main sous l\'épaule', 'Bras libre dans le dos'],
    steps: ['Descente lente, hanches stables', 'Pousse en restant gainé'],
    mistakes: ['Rotation des hanches', 'Pieds trop serrés'],
    breathing: 'Inspire en descendant, expire en poussant',
    pose: 'pushup-bottom',
  },

  // ===== push-v =====
  'wall-lean': {
    description: 'Préparation au handstand : tu t\'habitues à pousser tête vers le bas.',
    muscles: ['Épaules', 'Triceps', 'Gainage'],
    setup: ['Mains au mur à hauteur d\'épaules', 'Pieds reculés (1 m)'],
    steps: ['Pousse activement dans le mur', 'Hausse les épaules', 'Maintiens'],
    mistakes: ['Épaules molles', 'Cambrer le dos'],
    breathing: 'Respiration calme et régulière',
    pose: 'wall-lean',
  },
  'pike-floor': {
    description: 'Pompe en V inversé : prépare le handstand push-up.',
    muscles: ['Épaules', 'Triceps', 'Trapèzes hauts'],
    setup: ['Pieds + mains au sol, hanches hautes (V inversé)', 'Tête entre les bras'],
    steps: ['Plie les coudes, descends le sommet de la tête vers le sol', 'Pousse pour revenir'],
    mistakes: ['Hanches trop basses (devient une pompe)', 'Cambrer'],
    breathing: 'Inspire en descendant, expire en poussant',
    pose: 'pike',
  },
  'pike-elevated': {
    description: 'Pike pompe avec pieds surélevés : plus vertical, plus difficile.',
    muscles: ['Épaules', 'Triceps', 'Trapèzes'],
    setup: ['Pieds sur chaise, mains au sol', 'Hanches très hautes'],
    steps: ['Descends la tête vers le sol', 'Coudes près du corps', 'Pousse'],
    mistakes: ['Cambrure', 'Coudes ouverts'],
    breathing: 'Inspire en descendant, expire en poussant',
    pose: 'pike',
  },
  'wall-hs-hold-30': {
    description: 'Tenue handstand contre un mur.',
    muscles: ['Épaules', 'Gainage', 'Poignets'],
    setup: ['Dos ou ventre au mur', 'Mains à 10-20 cm du mur', 'Doigts écartés'],
    steps: ['Pousse fort dans le sol', 'Serre fessiers et abdos', 'Regard entre les mains'],
    mistakes: ['Cambrure (banane)', 'Épaules relâchées'],
    breathing: 'Respiration nasale calme',
    pose: 'handstand',
  },
  'wall-hs-hold-45': {
    description: 'Handstand mural plus long pour solidifier l\'endurance.',
    muscles: ['Épaules', 'Gainage', 'Poignets'],
    setup: ['Comme la version 30s'],
    steps: ['Tiens 45s', 'Si tu casses la position, redescends'],
    breathing: 'Respiration nasale, ne pas bloquer',
    pose: 'handstand',
  },
  'wall-hspu-negative': {
    description: 'Négative du handstand push-up : on contrôle la descente.',
    muscles: ['Épaules', 'Triceps', 'Gainage'],
    setup: ['Handstand contre le mur'],
    steps: ['Descends la tête vers le sol en 5s', 'Pose la tête doucement', 'Reviens en handstand en marchant avec les pieds'],
    mistakes: ['Descente trop rapide', 'Tête qui cogne'],
    breathing: 'Inspire pendant la descente',
    pose: 'handstand',
  },
  'wall-hspu-partial': {
    description: 'HSPU en demi-amplitude.',
    muscles: ['Épaules', 'Triceps', 'Gainage'],
    setup: ['Handstand au mur'],
    steps: ['Descends à mi-chemin', 'Remonte sans aide'],
    mistakes: ['Cambrer pour remonter'],
    breathing: 'Inspire en descendant, expire en poussant',
    pose: 'handstand',
  },
  'wall-hspu': {
    description: 'Pompe en handstand complète contre le mur.',
    muscles: ['Épaules', 'Triceps', 'Gainage'],
    setup: ['Handstand au mur, mains assez éloignées du mur'],
    steps: ['Descends jusqu\'à toucher du sommet de la tête', 'Pousse complet'],
    mistakes: ['Cambrer pour tricher', 'Épaules molles'],
    breathing: 'Inspire en descendant, expire en poussant',
    pose: 'handstand',
  },
  'wall-hspu-deep': {
    description: 'HSPU avec déficit (mains surélevées) pour plus d\'amplitude.',
    muscles: ['Épaules', 'Triceps'],
    setup: ['Mains sur livres ou blocs'],
    steps: ['Descends la tête sous les mains', 'Pousse'],
    pose: 'handstand',
  },
  'freestanding-hs-attempt': {
    description: 'Tentatives de handstand libre.',
    muscles: ['Épaules', 'Gainage', 'Coordination'],
    setup: ['Espace dégagé', 'Doigts actifs (comme des griffes)'],
    steps: ['Kick up contrôlé', 'Cherche l\'équilibre avec les doigts', 'Tiens le plus longtemps possible'],
    mistakes: ['Kick trop fort → on bascule'],
    breathing: 'Respiration courte et calme',
    pose: 'handstand',
  },
  'freestanding-hs': {
    description: 'Tenue handstand libre 10s : objectif majeur.',
    muscles: ['Épaules', 'Gainage', 'Poignets', 'Coordination'],
    setup: ['Pas de mur'],
    steps: ['Doigts actifs', 'Petits ajustements via les épaules et les doigts'],
    pose: 'handstand',
  },
  'freestanding-hspu': {
    description: 'Le saint graal : pompe en équilibre libre.',
    muscles: ['Épaules', 'Triceps', 'Gainage'],
    pose: 'handstand',
  },

  // ===== pull-h =====
  'door-scap-pull': {
    description: 'Préparation à la rétraction des omoplates.',
    muscles: ['Trapèzes moyens/bas', 'Rhomboïdes'],
    setup: ['Serviette autour de la poignée (porte bloquée)', 'Pieds proches de la porte', 'Bras tendus'],
    steps: ['Serre les omoplates sans plier les bras', 'Tiens 2s', 'Relâche'],
    mistakes: ['Tirer avec les bras'],
    breathing: 'Expire en serrant',
    pose: 'table-row',
  },
  'towel-row': {
    description: 'Tirage horizontal avec serviette de porte.',
    muscles: ['Dorsaux', 'Trapèzes', 'Biceps'],
    setup: ['Serviette autour de la poignée', 'Pieds près de la porte', 'Inclinaison vers l\'arrière'],
    steps: ['Tire la poitrine vers la porte', 'Coudes près du corps', 'Descends contrôlé'],
    mistakes: ['Tirer juste avec les bras', 'Hanches qui plient'],
    breathing: 'Expire en tirant',
    pose: 'table-row',
  },
  'table-row-bent': {
    description: 'Row sous une table solide, genoux pliés.',
    muscles: ['Dorsaux', 'Rhomboïdes', 'Biceps'],
    setup: ['Allongé sous la table', 'Mains sur le bord', 'Genoux pliés'],
    steps: ['Tire la poitrine vers la table', 'Pause 1s en haut'],
    mistakes: ['Hanches qui s\'affaissent'],
    breathing: 'Expire en tirant',
    pose: 'table-row',
  },
  'table-row': {
    description: 'Row sous table avec jambes tendues : plus exigeant.',
    muscles: ['Dorsaux', 'Trapèzes moyens', 'Biceps', 'Gainage'],
    setup: ['Allongé sous table stable', 'Jambes tendues', 'Corps en ligne'],
    steps: ['Tire la poitrine à toucher la table', 'Coudes à 45°', 'Descends contrôlé'],
    mistakes: ['Bassin qui tombe', 'Tirer en arc'],
    breathing: 'Expire en tirant',
    pose: 'table-row',
  },
  'table-row-feet-up': {
    description: 'Row sous table avec pieds surélevés : ratio bras/poids ↑.',
    muscles: ['Dorsaux', 'Biceps', 'Gainage'],
    setup: ['Pieds sur une chaise', 'Corps à l\'horizontale'],
    steps: ['Tire poitrine vers la table'],
    pose: 'table-row',
  },
  'table-row-tempo': {
    description: 'Row au tempo lent.',
    muscles: ['Dorsaux', 'Biceps'],
    steps: ['3s tirage, 1s pause haut, 3s descente'],
    pose: 'table-row',
  },
  'archer-row-assist': {
    description: 'Row archer assisté : prépare le row à un bras.',
    muscles: ['Dorsaux', 'Biceps', 'Gainage anti-rotation'],
    pose: 'table-row',
  },
  'archer-row': {
    description: 'Row archer : tirage asymétrique.',
    muscles: ['Dorsaux', 'Biceps', 'Gainage'],
    pose: 'table-row',
  },
  'one-arm-row-assist': {
    description: 'Row à un bras assisté.',
    muscles: ['Dorsaux', 'Biceps', 'Gainage'],
    pose: 'table-row',
  },
  'one-arm-row': {
    description: 'Row à un bras : objectif tirage horizontal.',
    muscles: ['Dorsaux', 'Biceps', 'Gainage anti-rotation'],
    pose: 'table-row',
  },
  'one-arm-row-tempo': {
    description: 'Row à un bras au tempo.',
    muscles: ['Dorsaux', 'Biceps'],
    pose: 'table-row',
  },
  'one-arm-row-elevated': {
    description: 'Row à un bras pieds surélevés : version la plus dure.',
    muscles: ['Dorsaux', 'Biceps', 'Gainage'],
    pose: 'table-row',
  },

  // ===== squat =====
  'chair-sit': {
    description: 'Squat le plus accessible : on s\'assoit et on se relève sans les mains.',
    muscles: ['Quadriceps', 'Fessiers', 'Ischio-jambiers'],
    setup: ['Devant une chaise stable', 'Pieds largeur des hanches'],
    steps: ['Recule les hanches', 'Assieds-toi doucement', 'Relève-toi sans les mains'],
    mistakes: ['Tomber sur la chaise'],
    breathing: 'Inspire en descendant, expire en montant',
    pose: 'squat',
  },
  'chair-squat': {
    description: 'Squat avec frôlement de la chaise (sans s\'asseoir).',
    muscles: ['Quadriceps', 'Fessiers'],
    pose: 'squat',
  },
  'bw-squat-half': {
    description: 'Squat demi-amplitude : cuisses parallèles au sol.',
    muscles: ['Quadriceps', 'Fessiers'],
    setup: ['Pieds largeur des hanches', 'Pointes légèrement vers l\'extérieur'],
    steps: ['Recule les hanches', 'Cuisses parallèles', 'Pousse dans les talons'],
    mistakes: ['Genoux qui rentrent en X', 'Talons qui se lèvent'],
    breathing: 'Inspire en descendant, expire en montant',
    pose: 'squat',
  },
  'bw-squat': {
    description: 'Squat complet : hanches sous le niveau des genoux.',
    muscles: ['Quadriceps', 'Fessiers', 'Ischio-jambiers', 'Mollets'],
    setup: ['Pieds largeur épaules', 'Pointes ~15° vers l\'extérieur'],
    steps: ['Descends en gardant le dos droit', 'Hanches sous genoux', 'Talons au sol', 'Pousse'],
    mistakes: ['Cambrer en bas', 'Genoux en X', 'Talons levés'],
    breathing: 'Inspire en descendant, expire en montant',
    pose: 'deep-squat',
  },
  'tempo-squat': {
    description: 'Squat au tempo 3-1-3.',
    muscles: ['Quadriceps', 'Fessiers'],
    pose: 'squat',
  },
  'split-squat': {
    description: 'Fente statique : unilatéral.',
    muscles: ['Quadriceps', 'Fessiers', 'Adducteurs'],
    setup: ['Une jambe avant, une arrière, tronc droit'],
    steps: ['Descends jusqu\'à effleurer le genou arrière au sol', 'Remonte', 'Change de côté à la fin'],
    mistakes: ['Genou avant qui dépasse trop les orteils', 'Tronc penché'],
    pose: 'lunge',
  },
  'bulgarian-split': {
    description: 'Fente bulgare : pied arrière surélevé.',
    muscles: ['Quadriceps', 'Fessiers'],
    setup: ['Pied arrière sur chaise', 'Pied avant à 60-80 cm'],
    steps: ['Descends droit', 'Le genou avant suit la pointe'],
    pose: 'lunge',
  },
  'cossack-squat': {
    description: 'Squat latéral cosaque.',
    muscles: ['Adducteurs', 'Quadriceps', 'Fessiers', 'Mobilité hanches'],
    setup: ['Pieds très écartés'],
    steps: ['Descends d\'un côté, l\'autre jambe tendue', 'Pied tendu en flex (orteils vers le ciel)'],
    pose: 'cossack',
  },
  'shrimp-squat-assist': {
    description: 'Shrimp squat assisté : pré-pistol.',
    muscles: ['Quadriceps', 'Fessiers'],
    setup: ['Une main au mur', 'Pied arrière dans la main opposée'],
    steps: ['Descends sur la jambe d\'appui', 'Genou arrière touche presque le sol'],
    pose: 'pistol',
  },
  'pistol-box': {
    description: 'Pistol vers une surface basse.',
    muscles: ['Quadriceps', 'Fessiers', 'Mobilité cheville'],
    pose: 'pistol',
  },
  'pistol-assist': {
    description: 'Pistol assisté par une main au mur.',
    muscles: ['Quadriceps', 'Fessiers', 'Équilibre'],
    pose: 'pistol',
  },
  pistol: {
    description: 'Squat sur une jambe : objectif final.',
    muscles: ['Quadriceps', 'Fessiers', 'Mobilité hanche/cheville', 'Gainage'],
    setup: ['Une jambe tendue devant', 'Bras tendus pour le contrepoids'],
    steps: ['Descends en gardant le talon au sol', 'Jambe libre tendue', 'Pousse pour remonter'],
    mistakes: ['Pied qui se lève', 'Tomber assis'],
    breathing: 'Inspire en descendant, expire en montant',
    pose: 'pistol',
  },

  // ===== hinge =====
  'glute-bridge': {
    description: 'Pont fessier : active la chaîne postérieure.',
    muscles: ['Fessiers', 'Ischio-jambiers', 'Bas du dos'],
    setup: ['Allongé sur le dos', 'Genoux pliés, pieds à plat'],
    steps: ['Pousse dans les talons', 'Lève les hanches', 'Serre les fessiers en haut', 'Descends contrôlé'],
    mistakes: ['Cambrer pour monter plus haut'],
    breathing: 'Expire en montant',
    pose: 'bridge',
  },
  'glute-bridge-march': {
    description: 'Pont fessier avec marche : anti-bascule.',
    muscles: ['Fessiers', 'Gainage'],
    pose: 'bridge',
  },
  'sl-glute-bridge': {
    description: 'Pont fessier unilatéral.',
    muscles: ['Fessiers', 'Ischio-jambiers'],
    pose: 'bridge',
  },
  'hip-thrust-elevated': {
    description: 'Hip thrust dos sur un appui surélevé.',
    muscles: ['Fessiers', 'Ischio-jambiers'],
    setup: ['Haut du dos contre une chaise/canapé', 'Pieds à plat'],
    steps: ['Pousse dans les talons', 'Hanches en extension max', 'Pause 1s en haut'],
    pose: 'hip-thrust',
  },
  'sl-rdl': {
    description: 'Soulevé de terre roumain unilatéral au poids du corps.',
    muscles: ['Ischio-jambiers', 'Fessiers', 'Équilibre'],
    setup: ['Une jambe au sol', 'L\'autre derrière, dans le prolongement du dos'],
    steps: ['Bascule du bassin (charnière)', 'Dos droit', 'Reviens en serrant les fessiers'],
    mistakes: ['Arrondir le bas du dos', 'Tourner les hanches'],
    breathing: 'Inspire en descendant, expire en remontant',
    pose: 'rdl',
  },
  'sl-rdl-touch': {
    description: 'RDL unilatéral avec touche au sol.',
    muscles: ['Ischio-jambiers', 'Fessiers'],
    pose: 'rdl',
  },
  'good-morning': {
    description: 'Charnière de hanche, mains derrière la tête.',
    muscles: ['Ischio-jambiers', 'Fessiers', 'Bas du dos'],
    setup: ['Pieds largeur hanches', 'Mains derrière la tête'],
    steps: ['Bascule du bassin', 'Dos plat', 'Reviens à la vertical en serrant les fessiers'],
    pose: 'good-morning',
  },
  'sl-hip-thrust': {
    description: 'Hip thrust unilatéral.',
    muscles: ['Fessiers'],
    pose: 'hip-thrust',
  },
  'sliding-leg-curl': {
    description: 'Curl ischios avec torchon glissant.',
    muscles: ['Ischio-jambiers', 'Fessiers'],
    pose: 'bridge',
  },
  'nordic-negative': {
    description: 'Nordic curl excentrique.',
    muscles: ['Ischio-jambiers (excentrique)'],
    setup: ['Genoux au sol', 'Chevilles bien ancrées (sous canapé)'],
    steps: ['Descends lentement (5s) en gardant le corps droit', 'Rattrape avec les mains'],
    mistakes: ['Casser les hanches'],
    pose: 'nordic',
  },
  'nordic-partial': {
    description: 'Nordic curl partiel.',
    muscles: ['Ischio-jambiers'],
    pose: 'nordic',
  },
  'nordic-full': {
    description: 'Nordic curl complet : descente + remontée.',
    muscles: ['Ischio-jambiers'],
    pose: 'nordic',
  },

  // ===== core-ext =====
  'dead-bug': {
    description: 'Dead bug : anti-extension lombaire.',
    muscles: ['Abdominaux profonds', 'Coordination'],
    setup: ['Sur le dos, genoux à 90°, bras vers le ciel'],
    steps: ['Tends bras + jambe opposés vers le sol', 'Bas du dos collé', 'Reviens'],
    mistakes: ['Cambrer le bas du dos'],
    breathing: 'Expire en tendant',
    pose: 'dead-bug',
  },
  'hollow-tuck': {
    description: 'Hollow tuck : la base du hollow.',
    muscles: ['Abdominaux', 'Fléchisseurs de hanche'],
    setup: ['Sur le dos, genoux pliés, mains vers le ciel'],
    steps: ['Décolle les omoplates', 'Bas du dos écrasé au sol', 'Tiens'],
    pose: 'hollow',
  },
  'hollow-hold-30': {
    description: 'Hollow hold avec jambes tendues.',
    muscles: ['Abdominaux profonds et superficiels'],
    setup: ['Sur le dos', 'Bras au-dessus de la tête', 'Jambes tendues'],
    steps: ['Décolle omoplates et talons', 'Bas du dos écrasé au sol', 'Tiens la position'],
    mistakes: ['Bas du dos qui décolle'],
    breathing: 'Respiration costale',
    pose: 'hollow',
  },
  'hollow-rock': {
    description: 'Bascule en position hollow.',
    muscles: ['Abdominaux'],
    pose: 'hollow',
  },
  'hollow-hold-45': {
    description: 'Hollow hold 45s.',
    muscles: ['Abdominaux'],
    pose: 'hollow',
  },
  'toes-to-sky': {
    description: 'Lever le bassin vers le ciel.',
    muscles: ['Abdominaux bas'],
    pose: 'hollow',
  },
  'l-sit-tuck': {
    description: 'L-sit tuck sur livres.',
    muscles: ['Abdominaux', 'Triceps', 'Fléchisseurs hanche'],
    pose: 'l-sit',
  },
  'l-sit-one-leg': {
    description: 'L-sit avec une jambe tendue.',
    muscles: ['Abdominaux', 'Triceps'],
    pose: 'l-sit',
  },
  'l-sit': {
    description: 'L-sit : objectif majeur des abdos statiques.',
    muscles: ['Abdominaux', 'Triceps', 'Quadriceps', 'Fléchisseurs hanche'],
    pose: 'l-sit',
  },
  'v-sit-tuck': {
    description: 'V-sit : jambes plus hautes que les hanches.',
    muscles: ['Abdominaux', 'Triceps'],
    pose: 'l-sit',
  },
  'v-sit-one-leg': {
    description: 'V-sit une jambe.',
    muscles: ['Abdominaux'],
    pose: 'l-sit',
  },
  'v-sit': {
    description: 'V-sit complet.',
    muscles: ['Abdominaux'],
    pose: 'l-sit',
  },

  // ===== core-rot =====
  'bird-dog': {
    description: 'Bird dog : anti-rotation 4 pattes.',
    muscles: ['Gainage', 'Fessiers', 'Coordination'],
    setup: ['4 pattes, mains sous épaules, genoux sous hanches'],
    steps: ['Tends bras + jambe opposés', 'Ne tourne pas les hanches', 'Reviens'],
    breathing: 'Expire en tendant',
    pose: 'bird-dog',
  },
  'side-plank-knee': {
    description: 'Planche latérale sur genoux.',
    muscles: ['Obliques', 'Moyen fessier'],
    pose: 'side-plank',
  },
  'side-plank': {
    description: 'Planche latérale 30s.',
    muscles: ['Obliques', 'Moyen fessier', 'Épaules'],
    setup: ['Sur le coude, pieds empilés'],
    steps: ['Hanches hautes', 'Corps en ligne', 'Respire'],
    mistakes: ['Bassin qui retombe'],
    pose: 'side-plank',
  },
  'side-plank-45': {
    description: 'Side plank 45s.',
    muscles: ['Obliques'],
    pose: 'side-plank',
  },
  'side-plank-reach': {
    description: 'Side plank avec passage du bras sous le corps.',
    muscles: ['Obliques', 'Dorsaux'],
    pose: 'side-plank',
  },
  'side-plank-hip-dip': {
    description: 'Side plank avec hip dip.',
    muscles: ['Obliques'],
    pose: 'side-plank',
  },
  'copenhagen-short': {
    description: 'Copenhagen plank version courte.',
    muscles: ['Adducteurs', 'Obliques'],
    pose: 'side-plank',
  },
  copenhagen: {
    description: 'Copenhagen plank : très exigeant pour adducteurs.',
    muscles: ['Adducteurs', 'Obliques', 'Moyen fessier'],
    setup: ['Sur le coude', 'Cheville de la jambe haute sur chaise', 'Jambe basse en l\'air'],
    pose: 'side-plank',
  },
  'copenhagen-raise': {
    description: 'Copenhagen avec lever de jambe.',
    muscles: ['Adducteurs', 'Moyen fessier'],
    pose: 'side-plank',
  },
  'side-plank-clam': {
    description: 'Side plank avec clamshell.',
    muscles: ['Obliques', 'Moyen fessier'],
    pose: 'side-plank',
  },
  'star-plank': {
    description: 'Star plank : bras et jambe haute levés.',
    muscles: ['Obliques', 'Épaules', 'Fessiers'],
    pose: 'side-plank',
  },
  'one-arm-plank': {
    description: 'Planche un bras : anti-rotation maximale.',
    muscles: ['Gainage complet'],
    pose: 'side-plank',
  },

  // ===== cardio =====
  'march-place': {
    description: 'Marche sur place pour la récup active.',
    muscles: ['Jambes', 'Cardio léger'],
    pose: 'standing',
  },
  'high-knees-slow': {
    description: 'Montées de genoux lentes.',
    muscles: ['Quadriceps', 'Fléchisseurs hanche', 'Cardio'],
    pose: 'mountain-climber',
  },
  'jumping-jacks': {
    description: 'Sauts en étoile classiques.',
    muscles: ['Cardio général', 'Mollets', 'Épaules'],
    pose: 'jumping-jack',
  },
  'shadow-boxing': {
    description: 'Boxe dans le vide : cardio + coordination.',
    muscles: ['Épaules', 'Cardio', 'Tronc'],
    pose: 'shadow-box',
  },
  'mountain-climbers': {
    description: 'Mountain climbers en planche.',
    muscles: ['Gainage', 'Cardio', 'Fléchisseurs hanche'],
    pose: 'mountain-climber',
  },
  'skater-jumps': {
    description: 'Sauts latéraux type patineur.',
    muscles: ['Fessiers', 'Quadriceps', 'Cardio'],
    pose: 'skater',
  },
  'squat-jumps': {
    description: 'Squat suivi d\'un saut explosif.',
    muscles: ['Quadriceps', 'Fessiers', 'Mollets', 'Cardio'],
    pose: 'squat',
  },
  'burpees-step': {
    description: 'Burpee sans saut, on recule un pied.',
    muscles: ['Corps entier', 'Cardio'],
    pose: 'pushup-top',
  },
  burpees: {
    description: 'Burpee complet : saut + pompe + saut.',
    muscles: ['Corps entier', 'Cardio intense'],
    pose: 'pushup-top',
  },
  'plank-jacks': {
    description: 'Planche avec sauts écart-serré.',
    muscles: ['Gainage', 'Cardio'],
    pose: 'pushup-top',
  },
  'star-jumps': {
    description: 'Sauts en étoile très explosifs.',
    muscles: ['Cardio', 'Jambes'],
    pose: 'jumping-jack',
  },
  'tuck-jumps': {
    description: 'Sauts genoux à la poitrine.',
    muscles: ['Quadriceps', 'Fessiers', 'Mollets'],
    pose: 'jumping-jack',
  },

  // ===== mobility =====
  'cat-cow': {
    description: 'Mobilité de la colonne en flexion/extension.',
    muscles: ['Mobilité colonne'],
    pose: 'cat-cow',
  },
  'thoracic-rotation': {
    description: 'Rotations thoraciques 4 pattes.',
    muscles: ['Mobilité thoracique'],
    pose: 'cat-cow',
  },
  'worlds-greatest': {
    description: 'World\'s greatest stretch : ouvre tout.',
    muscles: ['Hanches', 'Thoracique'],
    pose: 'lunge',
  },
  '90-90-switch': {
    description: '90/90 hip switches : mobilité hanches.',
    muscles: ['Hanches'],
    pose: 'stretch',
  },
  'cossack-flow': {
    description: 'Flow en cossack squat.',
    muscles: ['Hanches', 'Adducteurs'],
    pose: 'cossack',
  },
  'beast-to-crab': {
    description: 'Transitions beast → crab.',
    muscles: ['Mobilité épaules', 'Hanches'],
    pose: 'bridge',
  },
  'scorpion-reach': {
    description: 'Scorpion : sur le ventre, jambe par-dessus.',
    muscles: ['Mobilité thoracique', 'Hanches'],
    pose: 'stretch',
  },
  'deep-squat-hold': {
    description: 'Tenue en squat profond pour ouvrir hanches/chevilles.',
    muscles: ['Hanches', 'Chevilles', 'Adducteurs'],
    pose: 'deep-squat',
  },
  'couch-stretch': {
    description: 'Étirement profond des fléchisseurs de hanche.',
    muscles: ['Fléchisseurs hanche', 'Quadriceps'],
    pose: 'lunge',
  },
  'jefferson-curl': {
    description: 'Roulement vertèbre par vertèbre vers l\'avant.',
    muscles: ['Mobilité colonne', 'Ischio-jambiers'],
    pose: 'rdl',
  },
  'shoulder-dislocate': {
    description: 'Passage de serviette derrière la tête.',
    muscles: ['Mobilité épaules'],
    pose: 'standing',
  },
  'full-flow': {
    description: 'Flow libre : combine tes mouvements préférés.',
    muscles: ['Mobilité globale'],
    pose: 'stretch',
  },

  // ===== skill =====
  'wall-hs-skill': {
    description: 'Sessions courtes de tenue handstand.',
    muscles: ['Épaules', 'Gainage'],
    pose: 'handstand',
  },
  'crow-pose': {
    description: 'Équilibre sur les bras, genoux sur triceps.',
    muscles: ['Épaules', 'Triceps', 'Gainage'],
    pose: 'crow',
  },
  'pistol-neg': {
    description: 'Descente lente sur une jambe.',
    muscles: ['Quadriceps', 'Fessiers'],
    pose: 'pistol',
  },
  'l-sit-skill': {
    description: 'Travail progressif du L-sit.',
    muscles: ['Abdominaux', 'Triceps'],
    pose: 'l-sit',
  },
  'handstand-walk-attempt': {
    description: 'Tentatives de marche en handstand au mur.',
    muscles: ['Épaules', 'Coordination'],
    pose: 'handstand',
  },
  'back-bridge': {
    description: 'Pont (bridge) complet.',
    muscles: ['Mobilité colonne', 'Épaules', 'Fessiers'],
    pose: 'bridge',
  },
  'shrimp-skill': {
    description: 'Shrimp squat skill.',
    muscles: ['Quadriceps', 'Fessiers'],
    pose: 'pistol',
  },
  'human-flag-tuck': {
    description: 'Human flag version tuck dans un encadrement de porte.',
    muscles: ['Obliques', 'Dorsaux', 'Épaules'],
    pose: 'side-plank',
  },
  'planche-lean': {
    description: 'Penché en avant en planche pour préparer le planche.',
    muscles: ['Épaules', 'Gainage'],
    pose: 'pushup-top',
  },
  'tuck-planche': {
    description: 'Tuck planche : pieds décollés en boule.',
    muscles: ['Épaules', 'Gainage'],
    pose: 'crow',
  },
  'front-lever-tuck': {
    description: 'Front lever en position tuck.',
    muscles: ['Dorsaux', 'Gainage'],
    pose: 'hanging',
  },
  'muscle-up-prep': {
    description: 'Tractions explosives, prep muscle-up.',
    muscles: ['Dorsaux', 'Biceps'],
    pose: 'hanging',
  },
};

const PATTERN_DEFAULTS: Record<PatternId, { muscles: string[]; pose: PoseKey }> = {
  'push-h': { muscles: ['Pectoraux', 'Triceps', 'Épaules', 'Gainage'], pose: 'pushup-top' },
  'push-v': { muscles: ['Épaules', 'Triceps', 'Gainage'], pose: 'pike' },
  'pull-h': { muscles: ['Dorsaux', 'Biceps', 'Trapèzes'], pose: 'table-row' },
  squat: { muscles: ['Quadriceps', 'Fessiers'], pose: 'squat' },
  hinge: { muscles: ['Ischio-jambiers', 'Fessiers', 'Bas du dos'], pose: 'rdl' },
  'core-ext': { muscles: ['Abdominaux'], pose: 'hollow' },
  'core-rot': { muscles: ['Obliques', 'Gainage'], pose: 'side-plank' },
  cardio: { muscles: ['Cardio général', 'Jambes'], pose: 'jumping-jack' },
  mobility: { muscles: ['Mobilité'], pose: 'stretch' },
  skill: { muscles: ['Skill'], pose: 'standing' },
};

export function getExerciseInfo(exerciseId: string): ExerciseInfo {
  const explicit = INFO[exerciseId];
  if (explicit) return explicit;
  const ex = exerciseById(exerciseId);
  if (!ex) return {};
  const defaults = PATTERN_DEFAULTS[ex.pattern];
  return { muscles: defaults.muscles, pose: defaults.pose };
}
