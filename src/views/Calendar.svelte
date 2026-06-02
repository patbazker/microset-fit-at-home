<script lang="ts">
  import { appData } from '../lib/store';
  import Heatmap from '../components/Heatmap.svelte';
  import { DAY_PLANS } from '../lib/program';
  import { MILESTONES } from '../lib/streak';

  const data = $derived($appData);

  const recent = $derived(
    [...data.sessions]
      .filter(s => s.completed)
      .sort((a, b) => b.startedAt - a.startedAt)
      .slice(0, 15)
  );

  function fmtDate(date: string) {
    const d = new Date(date + 'T00:00:00');
    return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
  }

  function fmtMin(sec: number) {
    return `${Math.round(sec / 60)} min`;
  }

  const upcomingMilestone = $derived.by(() => {
    const c = data.streak.current;
    return MILESTONES.find(m => m.days > c);
  });
  const previousMilestone = $derived.by(() => {
    const c = data.streak.current;
    return [...MILESTONES].reverse().find(m => m.days <= c);
  });
</script>

<div class="view">
  <div class="view-head fade-up">
    <h1>Streak & calendrier</h1>
  </div>

  <div class="card fade-up d1" style="text-align: center;">
    <div class="huge" style="color: var(--accent);">🔥 {data.streak.current}</div>
    <div class="muted small">jours consécutifs · record {data.streak.longest}j</div>

    {#if upcomingMilestone}
      <div style="margin-top: 16px;">
        <div class="muted small">Prochain palier</div>
        <div class="row" style="justify-content: center; gap: 8px; margin-top: 4px;">
          <span style="font-size: 1.5rem;">{upcomingMilestone.emoji}</span>
          <strong>{upcomingMilestone.title}</strong>
          <span class="muted">· {upcomingMilestone.days - data.streak.current}j restants</span>
        </div>
        <div class="muted small" style="margin-top: 4px;">{upcomingMilestone.message}</div>
        <div class="progress-bar" style="margin-top: 12px;">
          <div class="progress-fill" style="width: {(data.streak.current / upcomingMilestone.days) * 100}%"></div>
        </div>
      </div>
    {/if}
  </div>

  <div class="card fade-up d2">
    <h3>Activité (16 dernières semaines)</h3>
    <div style="margin-top: 12px;">
      <Heatmap sessions={data.sessions} />
    </div>
  </div>

  <div class="card fade-up d3">
    <h3>Badges débloqués</h3>
    {#if data.badges.length === 0}
      <p class="muted small" style="margin-top: 8px;">Encore aucun badge. Le premier arrive à 3 jours d'affilée 🌱</p>
    {:else}
      <div class="badges">
        {#each MILESTONES.filter(m => data.badges.includes(m.id)) as m}
          <div class="badge" title={m.message}>
            <div class="badge-emoji">{m.emoji}</div>
            <div class="badge-title">{m.title}</div>
            <div class="muted tiny">{m.days}j</div>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <div class="card fade-up d3">
    <h3>Séances récentes</h3>
    {#if recent.length === 0}
      <p class="muted small" style="margin-top: 8px;">Pas encore de séance enregistrée.</p>
    {:else}
      <div style="margin-top: 8px;">
        {#each recent as s}
          <div class="row session-row">
            <span style="font-size: 1.4rem;">{DAY_PLANS[s.dayType].emoji}</span>
            <div class="col" style="flex: 1; gap: 2px;">
              <strong>{DAY_PLANS[s.dayType].title}</strong>
              <div class="muted tiny">{fmtDate(s.date)} · {fmtMin(s.durationSec)}</div>
            </div>
            <span class="tag {s.category}">{s.category}</span>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .progress-bar { height: 6px; background: var(--border); border-radius: 999px; overflow: hidden; }
  .progress-fill { height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent-2)); transition: width 0.6s ease; }
  .badges {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 12px;
    margin-top: 12px;
  }
  .badge {
    background: var(--bg-elev-2);
    border-radius: var(--radius-sm);
    padding: 10px 4px;
    text-align: center;
    border: 1px solid var(--border);
  }
  .badge-emoji { font-size: 1.8rem; }
  .badge-title { font-size: 0.75rem; font-weight: 600; margin-top: 4px; }
  .session-row {
    padding: 10px 0;
    border-bottom: 1px solid var(--border);
  }
  .session-row:last-child { border-bottom: 0; }
</style>
