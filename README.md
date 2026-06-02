# Microset · 10 min/jour

> Programme fitness/musculation **au poids du corps**, à faire **chez soi**, en **10 min/jour**.
> PWA mobile-first · streak Duolingo-style · stockage local uniquement.

Production: **https://microset.emergence.md**

## Programme

Rotation 7 jours, ~10 min/séance, **zéro matériel** :

| Jour | Focus | Catégorie |
|------|-------|-----------|
| Lun | Push (pompes + push vertical) | Force |
| Mar | HIIT 7-min (circuit ACSM) | Cardio |
| Mer | Legs (squat + hinge) | Force |
| Jeu | Pull + Core | Force |
| Ven | Mobility flow | Mobilité |
| Sam | Skill day (handstand, pistol, L-sit…) | Force |
| Dim | Recovery (compte aussi pour le streak) | Récup |

Chaque pattern de force a une **ladder 12 niveaux**. L'app auto-incrémente après 3 séances réussies.

## Motivation long-terme

- **Streak** avec freezes (gagnés tous les 10 jours, max 4 — comme Duolingo)
- 10 paliers **badges** (3 → 1000 jours)
- 3 **anneaux** Apple-style (Force / Cardio / Mobilité) sur la semaine
- **Heatmap** GitHub-style 16 semaines
- Confetti + haptics + voix française à la fin de chaque séance

## Tech

- **Vite + Svelte 5 + TypeScript**
- `vite-plugin-pwa` (offline + installable)
- `canvas-confetti` pour les célébrations
- Web Speech API · Vibration API · Wake Lock API
- **100% localStorage**, pas de backend, pas d'analytics

Bundle initial : **~39 kB gzippé**.

## Dev

```bash
npm install
npm run dev        # http://localhost:8765
npm run build      # output: dist/
npm run preview
```

## Déploiement

Déployé sur **Cloudflare Workers (Assets)** — pas Pages — connecté au repo
GitHub. Chaque push sur `main` déclenche un build + déploiement automatique.

- Project name CF : `microset-fit-at-home`
- Framework détecté : Vite
- Build command : `npm run build`
- Output directory : `dist/`
- SPA fallback : géré nativement par `not_found_handling: "single-page-application"`
  (auto-injecté par CF dans `dist/wrangler.json` au build, **ne pas committer
  de `_redirects` ni de `wrangler.jsonc` à la racine** — CF les détecte comme
  un conflit Workers/Pages).
- Domaine custom : `microset.emergence.md` (DNS géré via le compte CF qui
  héberge `emergence.md`).

## Inspirations (recherche)

Convict Conditioning · Naked Warrior (Tsatsouline) · Greasing the Groove · 7-min HIIT (Klika & Jordan / ACSM 2013) · Stronger By Science (minimum effective dose) · Duolingo (streaks, freezes, milestones) · Atomic Habits (Clear) · Tiny Habits (Fogg) · Apple Fitness rings · GitHub contributions.
