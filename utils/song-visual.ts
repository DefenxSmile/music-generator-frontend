/** Cover pairs from the landing examples strip. */
const COVERS = [
  { from: "#FFC043", to: "#FF7A4D" },
  { from: "#3FB6A8", to: "#1C4F58" },
  { from: "#FFB347", to: "#FF5A36" },
  { from: "#E85D75", to: "#7B2D4E" },
  { from: "#6C7A99", to: "#262B36" },
  { from: "#FF4D6D", to: "#8B1E3F" },
] as const;

function hash(seed: string): number {
  let value = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    value ^= seed.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function songCover(id: string): { from: string; to: string } {
  return COVERS[hash(id) % COVERS.length];
}

export function songCoverStyle(id: string): { backgroundImage: string } {
  const cover = songCover(id);
  return { backgroundImage: `linear-gradient(128deg, ${cover.from}, ${cover.to})` };
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
