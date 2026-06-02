<script lang="ts">
  import { appData, updateSettings, updateProfile, resetAllData } from '../lib/store';
  import { exportJSON, importJSON } from '../lib/storage';

  const data = $derived($appData);

  function doExport() {
    const json = exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `microset-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function doImport(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = importJSON(reader.result as string);
      if (ok) {
        location.reload();
      } else {
        alert('Fichier invalide');
      }
    };
    reader.readAsText(file);
  }

  function doReset() {
    if (confirm('Tout effacer ? Cette action est irréversible.')) {
      resetAllData();
      location.reload();
    }
  }
</script>

<div class="view">
  <div class="view-head fade-up">
    <h1>Réglages</h1>
  </div>

  <div class="card fade-up d1">
    <h3>Profil</h3>
    <div style="margin-top: 12px;" class="col">
      <label class="col" style="gap: 4px;">
        <span class="muted small">Prénom</span>
        <input type="text" value={data.profile.name}
          oninput={(e) => updateProfile({ name: (e.target as HTMLInputElement).value })} />
      </label>
      <label class="col" style="gap: 4px;">
        <span class="muted small">Poids (kg)</span>
        <input type="number" value={data.profile.weightKg}
          oninput={(e) => updateProfile({ weightKg: +(e.target as HTMLInputElement).value || 0 })} />
      </label>
      <label class="col" style="gap: 4px;">
        <span class="muted small">Année de naissance</span>
        <input type="number" value={data.profile.birthYear}
          oninput={(e) => updateProfile({ birthYear: +(e.target as HTMLInputElement).value || 0 })} />
      </label>
    </div>
  </div>

  <div class="card fade-up d2">
    <h3>Pendant la séance</h3>
    <label class="toggle">
      <div class="col" style="gap: 2px;">
        <strong>Sons</strong>
        <span class="muted small">Bips à 3, 2, 1, et fin de phase</span>
      </div>
      <input type="checkbox" class="switch" checked={data.settings.sound}
        onchange={(e) => updateSettings('sound', (e.target as HTMLInputElement).checked)} />
    </label>
    <label class="toggle">
      <div class="col" style="gap: 2px;">
        <strong>Vibrations</strong>
        <span class="muted small">Sur appareils compatibles (Android)</span>
      </div>
      <input type="checkbox" class="switch" checked={data.settings.haptics}
        onchange={(e) => updateSettings('haptics', (e.target as HTMLInputElement).checked)} />
    </label>
    <label class="toggle">
      <div class="col" style="gap: 2px;">
        <strong>Annonces vocales</strong>
        <span class="muted small">Nom de l'exercice annoncé</span>
      </div>
      <input type="checkbox" class="switch" checked={data.settings.voiceCues}
        onchange={(e) => updateSettings('voiceCues', (e.target as HTMLInputElement).checked)} />
    </label>
    <label class="toggle">
      <div class="col" style="gap: 2px;">
        <strong>Écran toujours allumé</strong>
        <span class="muted small">Wake lock pendant la séance</span>
      </div>
      <input type="checkbox" class="switch" checked={data.settings.keepScreenOn}
        onchange={(e) => updateSettings('keepScreenOn', (e.target as HTMLInputElement).checked)} />
    </label>
  </div>

  <div class="card fade-up d3">
    <h3>Données</h3>
    <p class="muted small" style="margin-top: 4px;">Tout est stocké en local sur cet appareil (localStorage).</p>
    <div class="col" style="gap: 8px; margin-top: 12px;">
      <button class="btn btn-ghost btn-block" onclick={doExport}>📤 Exporter (JSON)</button>
      <label class="btn btn-ghost btn-block" style="cursor: pointer;">
        📥 Importer
        <input type="file" accept="application/json" onchange={doImport} style="display: none;" />
      </label>
      <button class="btn btn-danger btn-block" onclick={doReset}>🗑️ Tout effacer</button>
    </div>
  </div>

  <div class="card fade-up d3">
    <h3>À propos</h3>
    <p class="muted small" style="margin-top: 6px;">
      Microset · programme 10 min/jour au poids du corps · 7 jours de rotation push/cardio/legs/pull-core/mobility/skill/recovery · 12 niveaux de progression par mouvement.
    </p>
    <p class="muted small" style="margin-top: 8px;">
      Inspirations : Convict Conditioning, Naked Warrior (Tsatsouline), 7-min HIIT (ACSM), Atomic Habits, Duolingo streaks.
    </p>
  </div>
</div>
