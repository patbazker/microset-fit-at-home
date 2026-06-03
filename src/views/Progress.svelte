<script lang="ts">
  import { appData, setLevel } from '../lib/store';
  import { LADDERS, exerciseAtLevel } from '../lib/exercises';
  import type { PatternId } from '../lib/types';
  import ExerciseInfo from '../components/ExerciseInfo.svelte';

  const data = $derived($appData);
  let infoExId: string | null = $state(null);

  const PATTERN_LABELS: Record<PatternId, { label: string; emoji: string; color: string }> = {
    'push-h': { label: 'Push horizontal', emoji: '💪', color: 'var(--strength)' },
    'push-v': { label: 'Push vertical', emoji: '🤸', color: 'var(--strength)' },
    'pull-h': { label: 'Pull horizontal', emoji: '🎯', color: 'var(--strength)' },
    squat: { label: 'Squat', emoji: '🦵', color: 'var(--strength)' },
    hinge: { label: 'Charnière (hinge)', emoji: '🌉', color: 'var(--strength)' },
    'core-ext': { label: 'Core anti-extension', emoji: '🥚', color: 'var(--strength)' },
    'core-rot': { label: 'Core anti-rotation', emoji: '📐', color: 'var(--strength)' },
    cardio: { label: 'Cardio', emoji: '🔥', color: 'var(--cardio)' },
    mobility: { label: 'Mobilité', emoji: '🧘', color: 'var(--mobility)' },
    skill: { label: 'Skill', emoji: '👑', color: 'var(--accent-2)' },
  };

  const STRENGTH_PATTERNS: PatternId[] = ['push-h', 'push-v', 'pull-h', 'squat', 'hinge', 'core-ext', 'core-rot'];

  function totalDuration() {
    return Math.round(
      data.sessions.filter(s => s.completed).reduce((a, s) => a + s.durationSec, 0) / 60
    );
  }

  function nudgeLevel(p: PatternId, delta: number) {
    const cur = data.patternProgress[p]?.level ?? 1;
    setLevel(p, cur + delta);
  }
</script>

<div class="view">
  <div class="view-head fade-up">
    <h1>Progrès</h1>
  </div>

  <div class="card fade-up d1">
    <div class="row" style="gap: 16px;">
      <div class="col" style="flex:1; gap:2px;">
        <div class="muted small">Temps total</div>
        <div class="big">{totalDuration()} min</div>
      </div>
      <div class="col" style="flex:1; gap:2px;">
        <div class="muted small">Séances</div>
        <div class="big">{data.sessions.filter(s => s.completed).length}</div>
      </div>
      <div class="col" style="flex:1; gap:2px;">
        <div class="muted small">Record</div>
        <div class="big">🔥{data.streak.longest}</div>
      </div>
    </div>
  </div>

  <div class="card fade-up d2">
    <h3>Niveaux par mouvement</h3>
    <p class="muted small" style="margin-top: 4px;">Le niveau monte automatiquement après 3 séances réussies, mais tu peux ajuster manuellement.</p>

    <div style="margin-top: 12px;">
      {#each STRENGTH_PATTERNS as p}
        {@const prog = data.patternProgress[p]}
        {@const ex = exerciseAtLevel(p, prog.level)}
        {@const meta = PATTERN_LABELS[p]}
        <div class="pattern-row">
          <div class="row" style="gap: 10px;">
            <span style="font-size: 1.4rem;">{meta.emoji}</span>
            <div class="col" style="gap: 2px; flex: 1;">
              <div class="row" style="gap: 6px;">
                <strong>{meta.label}</strong>
                <span class="tag">Niv. {prog.level}/12</span>
              </div>
              <button class="link-row" onclick={() => infoExId = ex.id}>{ex.emoji} {ex.name} <span class="info-dot">ⓘ</span></button>
              {#if prog.bestReps}
                <div class="tiny" style="color: var(--success)">PR {prog.bestReps} reps</div>
              {/if}
              {#if prog.bestHoldSec}
                <div class="tiny" style="color: var(--success)">PR {prog.bestHoldSec}s</div>
              {/if}
            </div>
            <div class="row" style="gap: 4px;">
              <button class="btn btn-ghost" onclick={() => nudgeLevel(p, -1)} disabled={prog.level <= 1}>−</button>
              <button class="btn btn-ghost" onclick={() => nudgeLevel(p, 1)} disabled={prog.level >= 12}>+</button>
            </div>
          </div>
          <div class="ladder">
            {#each LADDERS[p] as _, i}
              <div class="rung" class:active={i + 1 <= prog.level} style="background: {i + 1 <= prog.level ? meta.color : 'var(--border)'}"></div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>

  <div class="card fade-up d3">
    <h3>Cardio · Mobilité · Skill</h3>
    <div style="margin-top: 8px;">
      {#each ['cardio', 'mobility', 'skill'] as PatternId[] as p}
        {@const meta = PATTERN_LABELS[p]}
        {@const prog = data.patternProgress[p]}
        <div class="row" style="padding: 8px 0; border-bottom: 1px solid var(--border)">
          <span style="font-size: 1.3rem;">{meta.emoji}</span>
          <div style="flex: 1;">{meta.label}</div>
          <span class="muted small">Niv. {prog.level}/12</span>
        </div>
      {/each}
    </div>
  </div>
</div>

{#if infoExId}
  <ExerciseInfo exerciseId={infoExId} onClose={() => (infoExId = null)} />
{/if}

<style>
  .pattern-row { padding: 12px 0; border-bottom: 1px solid var(--border); }
  .pattern-row:last-child { border-bottom: 0; }
  .ladder {
    display: flex;
    gap: 3px;
    margin-top: 8px;
  }
  .rung {
    flex: 1;
    height: 6px;
    border-radius: 2px;
    transition: background 0.3s ease;
  }
  .link-row {
    background: transparent;
    border: 0;
    color: var(--fg-dim);
    font-size: 0.86rem;
    padding: 2px 0;
    text-align: left;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .link-row:hover { color: var(--fg); }
  .info-dot { color: var(--accent-2); opacity: 0.75; }
</style>
