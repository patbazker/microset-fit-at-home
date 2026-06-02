<script lang="ts">
  import { appData, completeSession } from '../lib/store';
  import { planForDate } from '../lib/program';
  import { compile, type Phase, type LoggedSetTmp } from '../lib/runner';
  import { beep, haptic, speak, requestWakeLock, releaseWakeLock } from '../lib/feedback';
  import { onMount, onDestroy } from 'svelte';
  import { todayKey } from '../lib/storage';
  import type { Session, LoggedExercise, PatternId } from '../lib/types';
  import confetti from 'canvas-confetti';
  import type { StreakMilestone } from '../lib/streak';
  import ExerciseInfo from '../components/ExerciseInfo.svelte';

  interface Props {
    onExit: () => void;
    onComplete: (milestones: StreakMilestone[]) => void;
  }
  let { onExit, onComplete }: Props = $props();

  const data = $derived($appData);
  const plan = $derived(planForDate(new Date()));
  let phases: Phase[] = $state([]);
  let idx = $state(0);
  let secondsLeft = $state(0);
  let intervalId: number | null = null;
  let startedAt = $state(Date.now());
  let logged: LoggedSetTmp[] = $state([]);
  let pendingReps = $state(0);
  let paused = $state(false);
  let infoOpen = $state(false);

  const current = $derived(phases[idx]);
  const currentExerciseId = $derived(
    current && (current.kind === 'work-reps' || current.kind === 'work-hold' || current.kind === 'work-time')
      ? current.exerciseId
      : null
  );
  const progress = $derived(phases.length > 0 ? idx / (phases.length - 1) : 0);

  onMount(() => {
    phases = compile(plan, data);
    enterPhase();
    if (data.settings.keepScreenOn) requestWakeLock();
  });

  onDestroy(() => {
    if (intervalId) clearInterval(intervalId);
    releaseWakeLock();
  });

  function clearTick() {
    if (intervalId) { clearInterval(intervalId); intervalId = null; }
  }

  function enterPhase() {
    clearTick();
    const p = phases[idx];
    if (!p) return;
    if (p.kind === 'instruction' || p.kind === 'rest' || p.kind === 'work-hold' || p.kind === 'work-time') {
      secondsLeft = p.durationSec;
      tickStart();
      if (p.kind === 'work-hold' || p.kind === 'work-time') {
        speak(p.title, data.settings);
        haptic(50, data.settings);
      } else if (p.kind === 'rest') {
        speak('Récupération', data.settings);
      }
    } else if (p.kind === 'work-reps') {
      pendingReps = p.targetReps;
      speak(`${p.title}, ${p.targetReps} répétitions`, data.settings);
      haptic([60, 40, 60], data.settings);
    } else if (p.kind === 'summary') {
      finalize();
    }
  }

  function tickStart() {
    paused = false;
    intervalId = window.setInterval(() => {
      if (paused) return;
      secondsLeft -= 1;
      // Audio cues at 3, 2, 1 for short phases (rest, hold, time)
      if (secondsLeft === 3 || secondsLeft === 2 || secondsLeft === 1) {
        beep(700, 80, data.settings);
        haptic(20, data.settings);
      }
      if (secondsLeft <= 0) {
        beep(1000, 180, data.settings);
        haptic([60, 40, 100], data.settings);
        clearTick();
        // Auto-log holds/times
        const p = phases[idx];
        if (p?.kind === 'work-hold') {
          logged.push({ exerciseId: p.exerciseId, pattern: p.pattern, level: p.level, holdSec: p.durationSec });
        } else if (p?.kind === 'work-time') {
          logged.push({ exerciseId: p.exerciseId, pattern: p.pattern, level: p.level, holdSec: p.durationSec });
        }
        next();
      }
    }, 1000);
  }

  function next() {
    idx = Math.min(phases.length - 1, idx + 1);
    enterPhase();
  }

  function prev() {
    idx = Math.max(0, idx - 1);
    enterPhase();
  }

  function repsDone() {
    const p = phases[idx];
    if (p?.kind === 'work-reps') {
      logged.push({ exerciseId: p.exerciseId, pattern: p.pattern, level: p.level, reps: pendingReps });
      haptic([60, 40, 60, 40, 80], data.settings);
      beep(900, 120, data.settings);
    }
    next();
  }

  function togglePause() {
    paused = !paused;
    haptic(30, data.settings);
  }

  function skipPhase() {
    clearTick();
    next();
  }

  function quit() {
    clearTick();
    if (confirm('Quitter la séance ? Les sets déjà faits ne seront pas enregistrés.')) {
      releaseWakeLock();
      onExit();
    }
  }

  function finalize() {
    clearTick();
    releaseWakeLock();

    // Group logged sets into LoggedExercises
    const byKey: Record<string, LoggedExercise> = {};
    for (const ls of logged) {
      const k = ls.exerciseId;
      if (!byKey[k]) {
        byKey[k] = { exerciseId: ls.exerciseId, pattern: ls.pattern, level: ls.level, sets: [] };
      }
      byKey[k].sets.push({ reps: ls.reps, holdSec: ls.holdSec, rpe: ls.rpe });
    }

    const session: Session = {
      id: `s-${Date.now()}`,
      date: todayKey(),
      startedAt,
      endedAt: Date.now(),
      dayType: plan.dayType,
      category: plan.category,
      durationSec: Math.round((Date.now() - startedAt) / 1000),
      exercises: Object.values(byKey),
      completed: true,
    };

    const milestones = completeSession(session);

    // Big confetti burst
    confetti({
      particleCount: 160,
      spread: 80,
      startVelocity: 55,
      origin: { y: 0.4 },
      colors: ['#ff5e3a', '#ffaa3a', '#3ad1ff', '#a06bff', '#4ade80'],
    });
    setTimeout(() => confetti({
      particleCount: 80,
      spread: 100,
      startVelocity: 40,
      origin: { x: 0.2, y: 0.5 },
    }), 250);
    setTimeout(() => confetti({
      particleCount: 80,
      spread: 100,
      startVelocity: 40,
      origin: { x: 0.8, y: 0.5 },
    }), 400);

    haptic([100, 50, 100, 50, 200], data.settings);
    speak('Séance terminée. Bravo.', data.settings);

    onComplete(milestones);
  }

  function fmtTime(s: number) {
    const m = Math.floor(s / 60);
    const r = s % 60;
    return m > 0 ? `${m}:${String(r).padStart(2, '0')}` : String(r);
  }
</script>

<div class="workout-stage">
  <div class="workout-head">
    <button class="btn btn-ghost" onclick={quit}>✕</button>
    <div class="muted small">{idx + 1} / {phases.length}</div>
    <div class="row" style="gap: 6px;">
      {#if currentExerciseId}
        <button class="btn btn-ghost" onclick={() => { paused = true; infoOpen = true; }} aria-label="Info exercice">ⓘ</button>
      {/if}
      <button class="btn btn-ghost" onclick={togglePause}>{paused ? '▶' : '⏸'}</button>
    </div>
  </div>

  <div class="progress-bar">
    <div class="progress-fill" style="width: {progress * 100}%"></div>
  </div>

  <div class="workout-body">
    {#if current?.kind === 'instruction'}
      <div class="exercise-emoji scale-in">{current.emoji ?? '🌅'}</div>
      <div class="exercise-name">{current.title}</div>
      {#if current.description}
        <div class="exercise-target">{current.description}</div>
      {/if}
      <div class="timer-big">{fmtTime(secondsLeft)}</div>

    {:else if current?.kind === 'work-reps'}
      <div class="exercise-emoji scale-in">{current.emoji}</div>
      <button class="exercise-name name-btn" onclick={() => { paused = true; infoOpen = true; }}>{current.title} <span class="info-dot">ⓘ</span></button>
      <div class="exercise-target">Série {current.setIndex} / {current.setTotal} · objectif {current.targetReps} reps</div>

      <div class="reps-control">
        <button class="rep-btn" onclick={() => pendingReps = Math.max(0, pendingReps - 1)} aria-label="−">−</button>
        <div class="rep-count">{pendingReps}</div>
        <button class="rep-btn" onclick={() => pendingReps += 1} aria-label="+">+</button>
      </div>

      {#if current.cues?.length}
        <ul class="cues">
          {#each current.cues as cue}<li>{cue}</li>{/each}
        </ul>
      {/if}

    {:else if current?.kind === 'work-hold'}
      <div class="exercise-emoji scale-in">{current.emoji}</div>
      <button class="exercise-name name-btn" onclick={() => { paused = true; infoOpen = true; }}>{current.title} <span class="info-dot">ⓘ</span></button>
      <div class="exercise-target">Tiens · série {current.setIndex} / {current.setTotal}</div>
      <div class="timer-big" class:hot={secondsLeft <= 3}>{fmtTime(secondsLeft)}</div>
      {#if current.cues?.length}
        <ul class="cues">
          {#each current.cues as cue}<li>{cue}</li>{/each}
        </ul>
      {/if}

    {:else if current?.kind === 'work-time'}
      <div class="exercise-emoji scale-in">{current.emoji}</div>
      <button class="exercise-name name-btn" onclick={() => { paused = true; infoOpen = true; }}>{current.title} <span class="info-dot">ⓘ</span></button>
      <div class="exercise-target">{current.setIndex} / {current.setTotal}</div>
      <div class="timer-big" class:hot={secondsLeft <= 3}>{fmtTime(secondsLeft)}</div>
      {#if current.cues?.length}
        <ul class="cues">
          {#each current.cues as cue}<li>{cue}</li>{/each}
        </ul>
      {/if}

    {:else if current?.kind === 'rest'}
      <div class="exercise-emoji scale-in">😮‍💨</div>
      <div class="exercise-name">Récupération</div>
      <div class="timer-big" class:hot={secondsLeft <= 3}>{fmtTime(secondsLeft)}</div>
      {#if current.nextTitle}
        <div class="exercise-target">Ensuite : {current.nextEmoji ?? ''} {current.nextTitle}</div>
      {/if}
    {/if}
  </div>

  <div class="workout-foot">
    <button class="btn btn-ghost" onclick={prev} disabled={idx === 0}>← Précédent</button>
    <div class="spacer"></div>
    {#if current?.kind === 'work-reps'}
      <button class="btn btn-primary btn-lg" onclick={repsDone}>Fait ✓</button>
    {:else}
      <button class="btn" onclick={skipPhase}>Passer →</button>
    {/if}
  </div>
</div>

{#if infoOpen && currentExerciseId}
  <ExerciseInfo exerciseId={currentExerciseId} onClose={() => { infoOpen = false; }} />
{/if}

<style>
  .progress-bar {
    height: 4px;
    background: var(--border);
    border-radius: 999px;
    overflow: hidden;
    margin: 4px 0;
  }
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent), var(--accent-2));
    transition: width 0.4s ease;
  }
  .timer-big.hot {
    color: var(--accent);
    animation: pulse 0.5s ease-in-out infinite;
  }
  .reps-control {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-top: 8px;
  }
  .rep-btn {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: var(--bg-elev);
    border: 1px solid var(--border);
    font-size: 1.8rem;
    color: var(--fg);
    font-weight: 700;
    transition: transform 0.1s ease, background 0.15s ease;
  }
  .rep-btn:active { transform: scale(0.9); background: var(--accent); color: #0c1018; }
  .rep-count {
    font-size: 4rem;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
    min-width: 80px;
    text-align: center;
  }
  .name-btn {
    background: transparent;
    border: 0;
    color: inherit;
    font: inherit;
    padding: 4px 10px;
    border-radius: 10px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: background 0.15s ease;
  }
  .name-btn:active { background: var(--bg-elev-2); }
  .info-dot {
    color: var(--accent-2);
    font-size: 1rem;
    opacity: 0.8;
  }
</style>
