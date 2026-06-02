<script lang="ts">
  import { exerciseById } from '../lib/exercises';
  import { getExerciseInfo } from '../lib/exerciseInfo';
  import { getPose } from '../lib/poses';

  interface Props {
    exerciseId: string;
    onClose: () => void;
  }
  let { exerciseId, onClose }: Props = $props();

  const ex = $derived(exerciseById(exerciseId));
  const info = $derived(getExerciseInfo(exerciseId));
  const poseSvg = $derived(getPose(info.pose));

  function onBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }
  function onKey(e: KeyboardEvent) {
    if (e.key === 'Escape') onClose();
  }
</script>

<svelte:window on:keydown={onKey} />

<div
  class="ex-backdrop"
  onclick={onBackdropClick}
  onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClose(); }}
  role="dialog"
  tabindex="-1"
  aria-modal="true"
  aria-label="Détails de l'exercice"
>
  <div class="ex-sheet">
    <div class="ex-grabber"></div>

    {#if ex}
      <div class="ex-head">
        <div class="ex-emoji">{ex.emoji}</div>
        <div class="ex-title-col">
          <div class="ex-title">{ex.name}</div>
          <div class="muted small">Niveau {ex.level}/12 ·
            {#if ex.metric === 'reps'}{ex.defaultReps ?? '—'} reps{:else if ex.metric === 'hold'}Tenir {ex.defaultHoldSec ?? '—'}s{:else}{ex.defaultHoldSec ?? '—'}s{/if}
          </div>
        </div>
        <button class="btn btn-ghost ex-close" onclick={onClose} aria-label="Fermer">✕</button>
      </div>

      {#if poseSvg}
        <div class="ex-pose">
          {@html poseSvg}
        </div>
      {/if}

      {#if info.description}
        <p class="ex-desc">{info.description}</p>
      {/if}

      {#if info.muscles?.length}
        <div class="ex-section">
          <div class="ex-label">Muscles sollicités</div>
          <div class="ex-tags">
            {#each info.muscles as m}<span class="tag">{m}</span>{/each}
          </div>
        </div>
      {/if}

      {#if info.setup?.length}
        <div class="ex-section">
          <div class="ex-label">Position de départ</div>
          <ul class="ex-list">{#each info.setup as s}<li>{s}</li>{/each}</ul>
        </div>
      {/if}

      {#if info.steps?.length}
        <div class="ex-section">
          <div class="ex-label">Exécution</div>
          <ol class="ex-list ex-list-ol">{#each info.steps as s}<li>{s}</li>{/each}</ol>
        </div>
      {/if}

      {#if ex.cues?.length && !info.steps?.length}
        <div class="ex-section">
          <div class="ex-label">Points clés</div>
          <ul class="ex-list">{#each ex.cues as c}<li>{c}</li>{/each}</ul>
        </div>
      {/if}

      {#if info.mistakes?.length}
        <div class="ex-section">
          <div class="ex-label danger-label">⚠ Erreurs à éviter</div>
          <ul class="ex-list">{#each info.mistakes as m}<li>{m}</li>{/each}</ul>
        </div>
      {/if}

      {#if info.breathing}
        <div class="ex-section">
          <div class="ex-label">Respiration</div>
          <div class="ex-text">{info.breathing}</div>
        </div>
      {/if}

      {#if info.progression}
        <div class="ex-section">
          <div class="ex-label">Progression</div>
          <div class="ex-text">{info.progression}</div>
        </div>
      {/if}
    {:else}
      <div class="muted">Exercice introuvable.</div>
    {/if}
  </div>
</div>

<style>
  .ex-backdrop {
    position: fixed; inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    z-index: 200;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    animation: fade 0.2s ease;
  }
  @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
  .ex-sheet {
    width: 100%;
    max-width: 560px;
    background: var(--bg-elev);
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
    padding: 8px 18px calc(24px + var(--safe-bottom));
    max-height: 92dvh;
    overflow-y: auto;
    animation: slide 0.25s ease;
    box-shadow: 0 -8px 40px rgba(0,0,0,0.4);
  }
  @keyframes slide { from { transform: translateY(20px); opacity: 0; } to { transform: none; opacity: 1; } }
  .ex-grabber {
    width: 40px; height: 4px;
    background: var(--border);
    border-radius: 2px;
    margin: 6px auto 12px;
  }
  .ex-head {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 14px;
  }
  .ex-emoji { font-size: 2.6rem; line-height: 1; }
  .ex-title-col { flex: 1; min-width: 0; }
  .ex-title { font-size: 1.25rem; font-weight: 700; }
  .ex-close { padding: 8px 12px; }
  .ex-pose {
    background: var(--bg-elev-2);
    border-radius: var(--radius-sm);
    padding: 14px;
    margin-bottom: 14px;
    color: var(--accent-2);
    display: flex;
    justify-content: center;
  }
  .ex-pose :global(svg) {
    width: 100%;
    max-width: 320px;
    height: auto;
  }
  .ex-desc {
    margin: 0 0 14px;
    color: var(--fg-dim);
    line-height: 1.45;
  }
  .ex-section { margin-bottom: 14px; }
  .ex-label {
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--fg-muted);
    margin-bottom: 6px;
    font-weight: 600;
  }
  .ex-label.danger-label { color: var(--danger); }
  .ex-tags {
    display: flex; flex-wrap: wrap; gap: 6px;
  }
  .ex-list {
    margin: 0; padding-left: 20px;
    color: var(--fg);
    line-height: 1.5;
  }
  .ex-list li { margin-bottom: 4px; }
  .ex-list-ol li::marker { color: var(--accent); font-weight: 700; }
  .ex-text { color: var(--fg); line-height: 1.45; }
</style>
