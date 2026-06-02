<script lang="ts">
  import Home from './views/Home.svelte';
  import Calendar from './views/Calendar.svelte';
  import Progress from './views/Progress.svelte';
  import Settings from './views/Settings.svelte';
  import Workout from './views/Workout.svelte';
  import NavBar from './components/NavBar.svelte';
  import type { StreakMilestone } from './lib/streak';
  import { appData } from './lib/store';

  type Route = 'home' | 'calendar' | 'progress' | 'settings' | 'workout';
  let route: Route = $state('home');
  let celebration: { milestones: StreakMilestone[]; streakNow: number } | null = $state(null);

  function navigate(r: string) {
    route = r as Route;
  }

  function startWorkout() {
    route = 'workout';
  }

  function exitWorkout() {
    route = 'home';
  }

  function onComplete(milestones: StreakMilestone[]) {
    celebration = { milestones, streakNow: $appData.streak.current };
  }

  function dismissCelebration() {
    celebration = null;
    route = 'home';
  }
</script>

{#if route === 'workout'}
  <Workout onExit={exitWorkout} onComplete={onComplete} />
{:else}
  {#if route === 'home'}
    <Home onStart={startWorkout} onNavigate={navigate} />
  {:else if route === 'calendar'}
    <Calendar />
  {:else if route === 'progress'}
    <Progress />
  {:else if route === 'settings'}
    <Settings />
  {/if}
  <NavBar current={route} onNavigate={navigate} />
{/if}

{#if celebration}
  <div class="celebration-backdrop" onclick={dismissCelebration} role="presentation">
    <div class="celebration scale-in" onclick={(e) => e.stopPropagation()} role="presentation">
      <div class="celebration-emoji">🎉</div>
      <h1 style="text-align: center;">Bien joué !</h1>
      <div class="streak-display">
        <span style="font-size: 3.5rem;">🔥</span>
        <span class="huge" style="color: var(--accent);">{celebration.streakNow}</span>
      </div>
      <p class="muted" style="text-align: center;">jours consécutifs</p>

      {#if celebration.milestones.length > 0}
        <div class="divider"></div>
        <p style="text-align: center; font-weight: 600;">Nouveau palier !</p>
        {#each celebration.milestones as m}
          <div class="milestone-badge">
            <div style="font-size: 3rem;">{m.emoji}</div>
            <strong>{m.title}</strong>
            <div class="muted small" style="text-align: center;">{m.message}</div>
          </div>
        {/each}
      {/if}

      <button class="btn btn-primary btn-xl btn-block" style="margin-top: 16px;" onclick={dismissCelebration}>
        Continuer
      </button>
    </div>
  </div>
{/if}

<style>
  .celebration-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 100;
  }
  .celebration {
    background: var(--bg-elev);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 32px 24px;
    max-width: 380px;
    width: 100%;
  }
  .celebration-emoji { font-size: 5rem; text-align: center; }
  .streak-display {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
  }
  .milestone-badge {
    background: linear-gradient(135deg, #ff5e3a22, #ffaa3a22);
    border: 1px solid #ff5e3a44;
    border-radius: 16px;
    padding: 16px;
    text-align: center;
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
</style>
