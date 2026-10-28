/** Cover washes: clear hue on top, dark stop below — no muddy mid-gray. */
const TONES = [
  { from: "#e08a3a", to: "#3a180c" },
  { from: "#2f9a8e", to: "#0c2428" },
  { from: "#d45a72", to: "#2e1018" },
  { from: "#6a82c4", to: "#141c34" },
  { from: "#c47a3a", to: "#28140a" },
  { from: "#8a5ab8", to: "#1e1028" },
] as const;

function hash(seed: string): number {
  let value = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    value ^= seed.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

/** Stable tint for a song until a real picture replaces the frame. */
export function coverTone(id: string): { backgroundImage: string } {
  const tone = TONES[hash(id) % TONES.length];
  return { backgroundImage: `linear-gradient(148deg, ${tone.from}, ${tone.to})` };
}

/** Stable pseudo-waveform: the API returns no peaks, so the shape only identifies the song. */
export function songWaveform(id: string, bars = 56): number[] {
  let state = hash(id) || 1;
  const values: number[] = [];
  for (let index = 0; index < bars; index += 1) {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    const noise = ((state >>> 0) % 1000) / 1000;
    const envelope = 0.55 + 0.45 * Math.sin((index / bars) * Math.PI);
    values.push(Math.max(0.14, Math.min(1, envelope * (0.35 + noise * 0.65))));
  }
  return values;
}

export function formatClock(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}
