/** Soft two-note chime when the support nudge appears. Same timing as ViralThumblify. */

const NUDGE_SOUND_CLOSE_DELAY_MS = 500;
const NUDGE_SOUND_PEAK_GAIN = 0.07;

type BrowserAudioContext = typeof AudioContext;

function resolveAudioContextCtor(): BrowserAudioContext | null {
  if (typeof window === "undefined") return null;
  const extendedWindow = window as Window & { webkitAudioContext?: BrowserAudioContext };
  return window.AudioContext ?? extendedWindow.webkitAudioContext ?? null;
}

function shouldSkipNudgeSound(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scheduleTone(
  context: AudioContext,
  frequencyHz: number,
  startAt: number,
  durationSec: number,
): void {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequencyHz, startAt);
  gain.gain.setValueAtTime(0, startAt);
  gain.gain.linearRampToValueAtTime(NUDGE_SOUND_PEAK_GAIN, startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, startAt + durationSec);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(startAt);
  oscillator.stop(startAt + durationSec);
}

export function playSupportNudgeSound(): void {
  if (shouldSkipNudgeSound()) return;
  const AudioContextCtor = resolveAudioContextCtor();
  if (!AudioContextCtor) return;
  try {
    const context = new AudioContextCtor();
    const startAt = context.currentTime;
    scheduleTone(context, 880, startAt, 0.14);
    scheduleTone(context, 1174.66, startAt + 0.09, 0.18);
    if (context.state === "suspended") void context.resume();
    window.setTimeout(() => {
      void context.close();
    }, NUDGE_SOUND_CLOSE_DELAY_MS);
  } catch {
    /* Autoplay blocked or audio unsupported */
  }
}
