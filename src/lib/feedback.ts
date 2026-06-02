// Haptics, voice, sound — tiny wrappers respecting user settings.

import type { Settings } from './types';

export function haptic(pattern: number | number[], settings: Settings): void {
  if (!settings.haptics) return;
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try { navigator.vibrate(pattern); } catch {}
  }
}

let audioCtx: AudioContext | null = null;
function ctx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const Ctor = (window.AudioContext || (window as any).webkitAudioContext);
    if (!Ctor) return null;
    audioCtx = new Ctor();
  }
  return audioCtx;
}

export function beep(frequency = 880, durationMs = 120, settings: Settings): void {
  if (!settings.sound) return;
  const c = ctx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'sine';
  osc.frequency.value = frequency;
  gain.gain.value = 0.0001;
  osc.connect(gain).connect(c.destination);
  const now = c.currentTime;
  gain.gain.exponentialRampToValueAtTime(0.2, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);
  osc.start(now);
  osc.stop(now + durationMs / 1000 + 0.02);
}

export function speak(text: string, settings: Settings): void {
  if (!settings.voiceCues) return;
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'fr-FR';
    u.rate = 1.05;
    u.pitch = 1;
    window.speechSynthesis.speak(u);
  } catch {}
}

// ---- Wake lock ----

let wakeLock: any = null;

export async function requestWakeLock(): Promise<void> {
  if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) return;
  try {
    wakeLock = await (navigator as any).wakeLock.request('screen');
    wakeLock.addEventListener?.('release', () => { wakeLock = null; });
  } catch (e) {
    console.warn('wakeLock denied', e);
  }
}

export async function releaseWakeLock(): Promise<void> {
  try {
    if (wakeLock) await wakeLock.release();
  } catch {}
  wakeLock = null;
}
