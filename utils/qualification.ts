import type { SongFor, VisitorKind } from "@/types/qualification";
import { prefixedKey } from "@/utils/storage-prefix";
const VISITOR_STORAGE_KEY = prefixedKey("visitor");
const SONG_FOR_STORAGE_KEY = prefixedKey("song_for");
const QUALIFICATION_DONE_KEY = prefixedKey("qualification_done");

export const VISITOR_OPTIONS: ReadonlyArray<{ value: VisitorKind; label: string }> = [
  { value: "user", label: "Обычный пользователь" },
  { value: "creator", label: "Креатор" },
  { value: "business", label: "Владелец бизнеса" },
  { value: "musician", label: "Музыкант" },
];

export const SONG_FOR_OPTIONS: ReadonlyArray<{
  value: SongFor;
  label: string;
  placeholder: string;
}> = [
  { value: "self", label: "Себе", placeholder: "Песня о том, как я переехал в новый город…" },
  {
    value: "gift",
    label: "В подарок",
    placeholder: "Песня для мамы на юбилей, она любит дачу и старые песни…",
  },
];

function readStored<T extends string>(key: string, allowed: readonly T[]): T | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(key);
  return raw && allowed.includes(raw as T) ? (raw as T) : null;
}

function writeStored(key: string, value: string | null): void {
  if (typeof window === "undefined") return;
  if (value) window.sessionStorage.setItem(key, value);
  else window.sessionStorage.removeItem(key);
}

export function readVisitor(): VisitorKind | null {
  return readStored(
    VISITOR_STORAGE_KEY,
    VISITOR_OPTIONS.map((option) => option.value),
  );
}

export function persistVisitor(value: VisitorKind | null): void {
  writeStored(VISITOR_STORAGE_KEY, value);
}

export function readSongFor(): SongFor | null {
  return readStored(
    SONG_FOR_STORAGE_KEY,
    SONG_FOR_OPTIONS.map((option) => option.value),
  );
}

export function persistSongFor(value: SongFor | null): void {
  writeStored(SONG_FOR_STORAGE_KEY, value);
}

/** Java does not say whether OAuth created the account. This browser remembers the step. */
export function readQualificationDone(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(QUALIFICATION_DONE_KEY) === "1";
  } catch {
    return false;
  }
}

export function markQualificationDone(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(QUALIFICATION_DONE_KEY, "1");
  } catch {
    /* storage can be blocked */
  }
}

export function songForPlaceholder(value: SongFor | null): string {
  return (
    SONG_FOR_OPTIONS.find((option) => option.value === value)?.placeholder ??
    "Песня о нашей первой встрече летом…"
  );
}
