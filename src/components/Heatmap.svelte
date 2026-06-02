<script lang="ts">
  import type { Session } from '../lib/types';
  import { todayKey } from '../lib/storage';

  interface Props {
    sessions: Session[];
    weeks?: number;
  }
  let { sessions, weeks = 16 }: Props = $props();

  // Map of date -> minutes; track if any session exists separately
  const minutesByDate = $derived.by(() => {
    const m: Record<string, number> = {};
    for (const s of sessions) {
      if (!s.completed) continue;
      m[s.date] = (m[s.date] || 0) + Math.round(s.durationSec / 60);
    }
    return m;
  });
  const hasSessionByDate = $derived.by(() => {
    const m: Record<string, boolean> = {};
    for (const s of sessions) {
      if (s.completed) m[s.date] = true;
    }
    return m;
  });

  // Each column = a week; rows are Mon..Sun
  const grid = $derived.by(() => {
    const today = new Date();
    // Find end of this week (Sunday)
    const endOfWeek = new Date(today);
    const dow = endOfWeek.getDay(); // 0=Sun
    const daysToSun = (7 - dow) % 7;
    endOfWeek.setDate(endOfWeek.getDate() + daysToSun);

    const cols: Array<Array<{ date: string; intensity: number; isFuture: boolean; isToday: boolean }>> = [];
    for (let w = weeks - 1; w >= 0; w--) {
      const col: Array<{ date: string; intensity: number; isFuture: boolean; isToday: boolean }> = [];
      // Start at Monday of that week
      const monday = new Date(endOfWeek);
      monday.setDate(endOfWeek.getDate() - (w * 7) - 6);
      for (let d = 0; d < 7; d++) {
        const day = new Date(monday);
        day.setDate(monday.getDate() + d);
        const key = todayKey(day);
        const mins = minutesByDate[key] || 0;
        const has = hasSessionByDate[key] === true;
        // Intensity 0..4 buckets — any completed session bumps to at least 1
        const intensity = !has ? 0 : mins < 5 ? 1 : mins < 10 ? 2 : mins < 15 ? 3 : 4;
        const isFuture = day.getTime() > today.getTime() && key !== todayKey(today);
        const isToday = key === todayKey(today);
        col.push({ date: key, intensity, isFuture, isToday });
      }
      cols.push(col);
    }
    return cols;
  });

  function intensityColor(i: number, isFuture: boolean) {
    if (isFuture) return 'var(--bg-elev)';
    if (i === 0) return '#1a2230';
    const opacities = [0, 0.3, 0.55, 0.8, 1];
    return `rgba(255, 94, 58, ${opacities[i]})`;
  }
</script>

<div class="heatmap">
  <div class="grid">
    {#each grid as col}
      <div class="col">
        {#each col as cell}
          <div
            class="cell"
            class:today={cell.isToday}
            style="background: {intensityColor(cell.intensity, cell.isFuture)}"
            title={cell.date}
          ></div>
        {/each}
      </div>
    {/each}
  </div>
  <div class="legend">
    <span>moins</span>
    {#each [0,1,2,3,4] as i}
      <div class="cell legend-cell" style="background: {intensityColor(i, false)}"></div>
    {/each}
    <span>plus</span>
  </div>
</div>

<style>
  .heatmap { overflow-x: auto; -webkit-overflow-scrolling: touch; padding-bottom: 4px; }
  .grid {
    display: flex;
    gap: 4px;
    min-width: max-content;
  }
  .col {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .cell {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    transition: transform 0.15s ease;
  }
  .cell.today {
    outline: 2px solid var(--fg);
    outline-offset: 1px;
  }
  .legend {
    display: flex;
    gap: 4px;
    align-items: center;
    margin-top: 10px;
    color: var(--fg-muted);
    font-size: 0.7rem;
  }
  .legend-cell { width: 12px; height: 12px; }
</style>
