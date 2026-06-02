<script lang="ts">
  interface Props {
    strength: number;     // 0..1
    cardio: number;
    mobility: number;
    size?: number;
  }
  let { strength, cardio, mobility, size = 200 }: Props = $props();

  const C = (r: number) => 2 * Math.PI * r;
  const stroke = 14;
  const cx = $derived(size / 2);
  const cy = $derived(size / 2);

  const r1 = $derived(size / 2 - stroke / 2 - 4);
  const r2 = $derived(r1 - stroke - 4);
  const r3 = $derived(r2 - stroke - 4);

  function dash(progress: number, r: number) {
    const c = C(r);
    const v = Math.max(0, Math.min(1, progress));
    return `${c * v} ${c * (1 - v) + 1}`;
  }
</script>

<svg viewBox="0 0 {size} {size}" width={size} height={size} aria-label="Anneaux hebdomadaires">
  <!-- Track rings -->
  <circle cx={cx} cy={cy} r={r1} fill="none" stroke="#ff5e3a22" stroke-width={stroke} />
  <circle cx={cx} cy={cy} r={r2} fill="none" stroke="#3ad1ff22" stroke-width={stroke} />
  <circle cx={cx} cy={cy} r={r3} fill="none" stroke="#a06bff22" stroke-width={stroke} />

  <!-- Progress rings (rotate -90 so they start at top) -->
  <g transform="rotate(-90 {cx} {cy})">
    <circle cx={cx} cy={cy} r={r1} fill="none" stroke="var(--strength)" stroke-width={stroke}
            stroke-linecap="round" stroke-dasharray={dash(strength, r1)}
            style="transition: stroke-dasharray 0.8s cubic-bezier(.34,1.56,.64,1)" />
    <circle cx={cx} cy={cy} r={r2} fill="none" stroke="var(--cardio)" stroke-width={stroke}
            stroke-linecap="round" stroke-dasharray={dash(cardio, r2)}
            style="transition: stroke-dasharray 0.8s cubic-bezier(.34,1.56,.64,1) 0.1s" />
    <circle cx={cx} cy={cy} r={r3} fill="none" stroke="var(--mobility)" stroke-width={stroke}
            stroke-linecap="round" stroke-dasharray={dash(mobility, r3)}
            style="transition: stroke-dasharray 0.8s cubic-bezier(.34,1.56,.64,1) 0.2s" />
  </g>
</svg>
