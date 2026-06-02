<script lang="ts">
  import { appData } from '../lib/store';
  import { planForDate } from '../lib/program';
  import { weeklyRings, streakAtRiskToday } from '../lib/streak';
  import { hasCompletedToday, todayKey } from '../lib/storage';
  import Rings from '../components/Rings.svelte';
  import { exerciseAtLevel, exerciseById } from '../lib/exercises';

  interface Props { onStart: () => void; onNavigate: (r: string) => void; }
  let { onStart, onNavigate }: Props = $props();

  const data = $derived($appData);
  const plan = $derived(planForDate(new Date()));
  const done = $derived(hasCompletedToday(data));
  const rings = $derived(weeklyRings(data));
  const atRisk = $derived(streakAtRiskToday(data));

  function exerciseSummary() {
    return plan.steps
      .filter(s => s.kind === 'exercise')
      .slice(0, 4)
      .map(s => {
        if (s.exerciseId) return exerciseById(s.exerciseId)?.name ?? '';
        if (s.patternRef) {
          const lvl = data.patternProgress[s.patternRef]?.level ?? 1;
          return exerciseAtLevel(s.patternRef, lvl).name;
        }
        return s.title;
      });
  }

  const dayLabels = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const today = new Date();
</script>

<div class="view">
  <div class="view-head fade-up">
    <div>
      <div class="sub">{dayLabels[today.getDay()]} {today.getDate()}</div>
      <h1>Salut {data.profile.name} 👋</h1>
    </div>
    {#if data.streak.current > 0}
      <div class="streak-chip" class:cold={atRisk}>
        <span class="flame">{atRisk ? '⏳' : '🔥'}</span>
        <span>{data.streak.current}</span>
      </div>
    {:else}
      <div class="streak-chip cold">
        <span class="flame">✨</span>
        <span>Démarre</span>
      </div>
    {/if}
  </div>

  <div class="card fade-up d1" style="text-align: center; padding: 24px 16px;">
    <Rings strength={rings.strength} cardio={rings.cardio} mobility={rings.mobility} size={200} />
    <div style="margin-top: 12px;" class="row" >
      <div class="legend-item"><span class="dot" style="background:var(--strength)"></span> Force</div>
      <div class="legend-item"><span class="dot" style="background:var(--cardio)"></span> Cardio</div>
      <div class="legend-item"><span class="dot" style="background:var(--mobility)"></span> Mobilité</div>
    </div>
    <p class="muted small" style="margin-top:8px">{rings.daysWithSession}/7 jours actifs cette semaine</p>
  </div>

  <div class="card fade-up d2">
    <div class="row">
      <span style="font-size: 2rem">{plan.emoji}</span>
      <div class="col" style="gap:2px; flex:1">
        <div class="row" style="gap:6px">
          <h2>{plan.title}</h2>
          <span class="tag {plan.category}">{plan.category}</span>
        </div>
        <div class="muted small">{plan.subtitle} · ~{plan.estMinutes} min</div>
      </div>
    </div>
    <div class="divider"></div>
    <ul style="padding-left: 18px; margin: 0; color: var(--fg-dim); font-size: 0.9rem;">
      {#each exerciseSummary() as ex}
        <li>{ex}</li>
      {/each}
    </ul>
    <div style="margin-top: 16px">
      {#if done}
        <button class="btn btn-block" onclick={onStart}>✅ Terminé · refaire</button>
      {:else}
        <button class="btn btn-primary btn-xl btn-block pulse" onclick={onStart}>
          Démarrer la séance →
        </button>
      {/if}
    </div>
  </div>

  {#if data.streak.freezesAvailable > 0}
    <div class="card fade-up d3">
      <div class="row">
        <span style="font-size: 1.5rem">❄️</span>
        <div class="col" style="gap:2px; flex:1">
          <strong>Freezes disponibles : {data.streak.freezesAvailable}</strong>
          <div class="muted small">Sautent automatiquement les jours manqués. Gagne-en 1 tous les 10 jours de streak.</div>
        </div>
      </div>
    </div>
  {/if}

  <div class="card fade-up d3">
    <div class="row" style="justify-content: space-between;">
      <div class="col" style="gap: 2px;">
        <div class="muted small">Record streak</div>
        <div class="big">{data.streak.longest}j</div>
      </div>
      <div class="col" style="gap: 2px; text-align: center;">
        <div class="muted small">Total séances</div>
        <div class="big">{data.sessions.filter(s => s.completed).length}</div>
      </div>
      <div class="col" style="gap: 2px; text-align: right;">
        <div class="muted small">Badges</div>
        <div class="big">{data.badges.length}</div>
      </div>
    </div>
    <button class="btn btn-ghost btn-block" style="margin-top: 12px" onclick={() => onNavigate('progress')}>
      Voir les progrès détaillés
    </button>
  </div>
</div>

<style>
  .row { justify-content: center; gap: 16px; flex-wrap: wrap; }
  .legend-item { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; color: var(--fg-dim); }
  .dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
</style>
