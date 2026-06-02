# Microset — Claude Code project brief

PWA, 10-min bodyweight daily program. User: Patrice, 49, 75kg, home, no equipment.
Production: **https://microset.emergence.md** · Repo: `patbazker/microset-fit-at-home`

## Stack (don't change without reason)

- Vite + Svelte 5 (runes: `$state`, `$derived`, `$props`) + TypeScript
- `vite-plugin-pwa` (manifest + workbox SW, autoUpdate)
- `canvas-confetti` for celebrations
- localStorage only (key: `hf:app:v1`) — **no backend, no analytics**
- Web Speech API (TTS fr-FR) · Vibration · Wake Lock · Web Audio (beeps)

Bundle target: **<50 kB gzipped initial JS**. Currently ~39 kB.

## Architecture

```
src/
├── App.svelte              ← shell + manual hash-free routing (4 views + workout)
├── main.ts                 ← mount + SW register (virtual:pwa-register)
├── app.css                 ← dark theme, mobile-first, all utility classes
├── lib/
│   ├── types.ts            ← all domain types
│   ├── exercises.ts        ← 12-level ladders × 10 patterns (≈120 exercises)
│   ├── program.ts          ← 7-day rotation (DayPlan with abstract patternRef)
│   ├── runner.ts           ← compile(plan, data) → linear Phase[] for workout
│   ├── storage.ts          ← localStorage load/save/export/import
│   ├── streak.ts           ← streak math + freezes + milestones + weekly rings
│   ├── store.ts            ← Svelte store wrapping AppData, completeSession()
│   └── feedback.ts         ← haptic / beep / speak / wake lock
├── views/                  ← Home, Workout, Calendar, Progress, Settings
└── components/             ← Rings, Heatmap, NavBar
```

**Key design choice — abstract vs concrete exercises.** A DayPlan step can
reference a `patternRef` (e.g. `'push-h'`) instead of a fixed exercise. At
session start, `runner.compile()` resolves it to the user's current
level via `exerciseAtLevel(pattern, data.patternProgress[pattern].level)`.
This is how the same plan gets harder as the user progresses.

**Auto-progression heuristic** (in `store.ts:completeSession`): after 3
consecutive sessions hitting a pattern, level += 1. **Lenient by design**
— upgrade later to compare actual reps vs `repsTarget` if needed.

## Streak rules (Duolingo-style)

- Gap of 1 day → streak +1
- Gap > 1 day → freezes auto-consumed (1 per missing day, max 4 stored)
- Earn 1 freeze every 10 streak days (cap 4)
- Rest day (Sunday) **counts** — never punish recovery
- Milestones at 3/7/14/30/50/100/200/365/500/1000 (see `streak.ts MILESTONES`)

## Programme — 7-day rotation (10 min each)

| Day | DayType | Category | Notes |
|-----|---------|----------|-------|
| Sun | recovery | recovery | walk / breath / gratitude |
| Mon | push | strength | EMOM pompes + push vertical |
| Tue | cardio | cardio | Klika 7-min circuit (ACSM 2013) |
| Wed | legs | strength | squat + hinge |
| Thu | pull-core | strength | rows + 2 core variants |
| Fri | mobility | mobility | flow guided |
| Sat | skill | strength | sub-max practice (handstand, pistol…) |

To add an exercise: append to `LADDERS[pattern]` in `exercises.ts` (keep level
order, max 12). To add a day variant: add to `DAY_PLANS` in `program.ts`.

## Deployment

Cloudflare **Workers (with Assets)** — NOT Pages. Auto-deploy on push to
`main` (CF Pages dashboard project connected to repo).

**Do not** commit `_redirects` or `wrangler.jsonc` at repo root — CF's
framework integration auto-generates `dist/wrangler.json` with
`not_found_handling: "single-page-application"`. A user-provided
`_redirects` with `/* /index.html 200` triggers a false-positive "infinite
loop" rejection.

## Dev workflow

```bash
npm install
npm run dev               # http://localhost:8765 (port matters — OAuth, future)
npm run build             # → dist/
npx svelte-check          # type check (no errors expected)
```

- Mobile-first. Test in real Chrome via `mcp__Claude_in_Chrome__*` per
  `~/.claude/BROWSER.md` (port 8765 already allowed).
- Branch naming: `feature/...` / `fix/...`. Commit messages in
  French OR English, imperative mood.
- Run `npm run build` mentally before committing — type errors fail the
  CF deploy fast and visibly.

## What's NOT here (intentionally)

- No user accounts, no cloud sync — by design (localStorage backup/import in
  Settings handles portability)
- No notifications API yet — TODO when iOS Safari support stabilizes more
- No multi-program support — `program.ts` has a single rotation. Adding
  programs means adding a `Program` wrapper and a picker; punt until needed.
- No body-map / muscle visualization — researched, deferred
- No social / sharing — solo by design

## Pitfalls already paid for

- `npm install --no-save sharp` (used by `scripts/gen-icons.mjs`) corrupts
  the lockfile. If you regen icons, do it in a throwaway clone or run
  `npm install` after to re-sync.
- CF will reject the deploy if it sees `wrangler.jsonc` at root → it
  switches to Workers-deploy mode and tries `wrangler deploy` instead of
  using `dist/` as static assets.
- Svelte 5 uses runes (`$state`, `$derived`, `$props`). Don't mix in
  Svelte 4 reactive `$:` syntax.
