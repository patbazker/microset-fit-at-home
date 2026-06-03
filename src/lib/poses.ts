// Stick-figure SVG schematics for exercise positions.
// viewBox 0 0 120 100. Stroke based on currentColor so they inherit theme.

export type PoseKey =
  | 'standing'
  | 'wall-lean'
  | 'pushup-top'
  | 'pushup-bottom'
  | 'knee-pushup'
  | 'incline-pushup'
  | 'decline-pushup'
  | 'pike'
  | 'handstand'
  | 'table-row'
  | 'hanging'
  | 'squat'
  | 'deep-squat'
  | 'lunge'
  | 'bridge'
  | 'hip-thrust'
  | 'hollow'
  | 'side-plank'
  | 'bird-dog'
  | 'l-sit'
  | 'dead-bug'
  | 'mountain-climber'
  | 'jumping-jack'
  | 'skater'
  | 'cat-cow'
  | 'cossack'
  | 'nordic'
  | 'crow'
  | 'pistol'
  | 'rdl'
  | 'good-morning'
  | 'shadow-box'
  | 'stretch';

const head = (cx: number, cy: number, r = 5) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" />`;

const wrap = (body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 100" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
    <line x1="4" y1="92" x2="116" y2="92" stroke-dasharray="3 4" opacity="0.4" />
    ${body}
  </svg>`;

export const POSES: Record<PoseKey, string> = {
  standing: wrap(`${head(60, 22)} <path d="M60 27 V62 M60 35 L46 50 M60 35 L74 50 M60 62 L50 90 M60 62 L70 90" />`),

  'wall-lean': wrap(`<line x1="20" y1="10" x2="20" y2="92" />${head(58, 30)}<path d="M58 35 V70 L58 88 M58 45 L26 22 M58 45 L26 28 M58 70 L72 88" />`),

  'pushup-top': wrap(`${head(28, 60)}<path d="M33 62 L100 78 M33 62 L36 86 M40 64 L48 86 M100 78 L100 88 M100 78 L108 88" />`),

  'pushup-bottom': wrap(`${head(26, 78)}<path d="M31 80 L102 86 M30 78 L26 90 M40 80 L46 90 M102 86 L100 92 M102 86 L108 92" />`),

  'knee-pushup': wrap(`${head(28, 64)}<path d="M33 66 L78 80 L92 88 M33 66 L40 90 M44 68 L52 90 M78 80 L88 90 M78 80 L70 90" />`),

  'incline-pushup': wrap(`<rect x="78" y="62" width="34" height="6" />${head(30, 44)}<path d="M35 46 L80 64 M35 46 L34 90 M44 50 L48 90" />`),

  'decline-pushup': wrap(`<rect x="78" y="70" width="34" height="6" />${head(28, 72)}<path d="M33 72 L34 88 M44 74 L52 88 M40 70 L84 56 L94 70" />`),

  pike: wrap(`${head(40, 56)}<path d="M44 58 L26 86 M50 56 L70 28 L96 86 M70 28 L94 86" />`),

  handstand: wrap(`<line x1="14" y1="10" x2="14" y2="92" />${head(40, 80)}<path d="M40 75 L40 24 M40 24 L24 14 M40 24 L24 18 M40 35 L60 88 M40 35 L70 88" />`),

  'table-row': wrap(`<rect x="40" y="50" width="60" height="4" />${head(20, 64)}<path d="M25 66 L96 66 M22 64 L42 52 M28 64 L48 52 M96 66 L108 88 M96 66 L106 90" />`),

  hanging: wrap(`<line x1="10" y1="14" x2="110" y2="14" />${head(60, 28)}<path d="M60 23 L42 14 M60 23 L78 14 M60 33 V72 M60 72 L50 92 M60 72 L70 92" />`),

  squat: wrap(`${head(60, 24)}<path d="M60 29 L60 54 L42 70 L42 90 M60 54 L78 70 L78 90 M60 38 L42 58 M60 38 L78 58" />`),

  'deep-squat': wrap(`${head(60, 36)}<path d="M60 41 L60 60 L38 60 L46 90 M60 60 L82 60 L74 90 M60 48 L40 56 M60 48 L80 56" />`),

  lunge: wrap(`${head(46, 22)}<path d="M46 27 L46 56 L70 56 L80 90 M46 56 L34 78 L42 90 M46 38 L30 50 M46 38 L62 30" />`),

  bridge: wrap(`${head(28, 70)}<path d="M28 75 L28 82 L60 60 L92 82 L92 90 M60 60 L86 90 M28 82 L20 90 M28 82 L36 90" />`),

  'hip-thrust': wrap(`<rect x="6" y="60" width="22" height="6" />${head(20, 56)}<path d="M22 60 L60 60 L84 76 L84 90 M60 60 L88 76" />`),

  hollow: wrap(`${head(30, 76)}<path d="M34 76 C 50 70, 80 70, 96 60 M34 76 L26 64 M34 76 L24 66 M96 60 L104 50 M96 60 L102 52" />`),

  'side-plank': wrap(`${head(22, 70)}<path d="M26 72 L106 82 M26 72 L24 88 M26 72 L24 56 M106 82 L114 90 M106 82 L114 70" />`),

  'bird-dog': wrap(`${head(20, 56)}<path d="M24 58 L66 64 M66 64 L96 60 M66 64 L96 72 M24 58 L18 30 M24 58 L18 76 M24 58 L40 78" />`),

  'l-sit': wrap(`<rect x="22" y="60" width="14" height="4" /><rect x="86" y="60" width="14" height="4" />${head(40, 38)}<path d="M40 43 L40 60 L96 60 M40 50 L30 60 M40 50 L46 60" />`),

  'dead-bug': wrap(`${head(28, 78)}<path d="M32 80 L92 80 M32 80 L20 60 M32 80 L24 64 M52 80 L52 50 M70 80 L88 56" />`),

  'mountain-climber': wrap(`${head(26, 60)}<path d="M30 62 L96 78 M30 62 L34 86 M40 64 L46 86 M96 78 L96 88 M96 78 L106 88 M60 70 L52 86" />`),

  'jumping-jack': wrap(`${head(60, 18)}<path d="M60 23 V60 M60 30 L34 14 M60 30 L86 14 M60 60 L40 90 M60 60 L80 90" />`),

  skater: wrap(`${head(40, 30)}<path d="M40 35 L52 58 L34 86 M52 58 L78 60 L96 78 M52 58 L40 50" />`),

  'cat-cow': wrap(`${head(22, 50)}<path d="M26 52 C 50 38, 80 38, 100 50 M26 52 L24 80 M30 54 L34 80 M100 50 L96 80 M96 50 L92 80" />`),

  cossack: wrap(`${head(40, 30)}<path d="M40 35 L40 60 L20 90 M40 60 L100 80 M40 44 L24 56 M40 44 L56 50" />`),

  nordic: wrap(`${head(60, 58)}<path d="M60 63 L80 90 L100 90 M60 63 L42 80 M60 63 L70 50 M60 63 L50 50" />`),

  crow: wrap(`${head(72, 60)}<path d="M72 65 L70 78 L52 88 L34 88 M70 78 L88 88 L104 88 M72 65 L54 56 M72 65 L90 56" />`),

  pistol: wrap(`${head(60, 32)}<path d="M60 37 L60 58 L50 86 M60 58 L96 64 M60 45 L44 56 M60 45 L74 50" />`),

  rdl: wrap(`${head(40, 36)}<path d="M40 41 L52 60 L48 90 M52 60 L82 78 M52 60 L80 50 M52 60 L80 56" />`),

  'good-morning': wrap(`${head(36, 44)}<path d="M40 46 L60 62 L60 90 M60 62 L86 30 M32 40 L42 28 M32 40 L48 30" />`),

  'shadow-box': wrap(`${head(46, 26)}<path d="M46 31 L46 60 M46 38 L26 36 M46 38 L72 22 M46 60 L36 90 M46 60 L60 90" />`),

  stretch: wrap(`${head(40, 56)}<path d="M40 61 L40 86 M40 65 L20 80 M40 65 L72 40 M40 86 L24 92 M40 86 L60 92" />`),
};

export function getPose(key: PoseKey | undefined): string | null {
  if (!key) return null;
  return POSES[key] ?? null;
}
