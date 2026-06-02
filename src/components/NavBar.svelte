<script lang="ts">
  interface Props {
    current: string;
    onNavigate: (route: string) => void;
  }
  let { current, onNavigate }: Props = $props();

  const items = [
    { id: 'home', label: 'Aujourd\'hui', icon: '🏠' },
    { id: 'calendar', label: 'Calendrier', icon: '📅' },
    { id: 'progress', label: 'Progrès', icon: '📈' },
    { id: 'settings', label: 'Réglages', icon: '⚙️' },
  ];
</script>

<nav class="nav">
  {#each items as item}
    <button
      class="nav-btn"
      class:active={current === item.id}
      onclick={() => onNavigate(item.id)}
    >
      <span class="icon">{item.icon}</span>
      <span>{item.label}</span>
    </button>
  {/each}
</nav>
