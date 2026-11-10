import type { ContentPlace, GiftOccasion, SongJob } from "@/types/qualification";
import { prefixedKey } from "@/utils/storage-prefix";

const SONG_JOB_KEY = prefixedKey("song_job");
const GIFT_OCCASION_KEY = prefixedKey("gift_occasion");
const CONTENT_PLACE_KEY = prefixedKey("content_place");
const QUALIFICATION_DONE_KEY = prefixedKey("qualification_done");

export const SONG_JOB_QUESTION = "Зачем песня?";
export const GIFT_OCCASION_QUESTION = "По какому поводу?";
export const CONTENT_PLACE_QUESTION = "Куда?";

const DEFAULT_PLACEHOLDER = "Песня о нашей первой встрече летом…";

export const SONG_JOB_OPTIONS: ReadonlyArray<{ value: SongJob; label: string }> = [
  { value: "gift", label: "В подарок" },
  { value: "self", label: "Для себя" },
  { value: "content", label: "Для ролика или поста" },
  { value: "release", label: "На площадки" },
];

export const GIFT_OCCASION_OPTIONS: ReadonlyArray<{
  value: GiftOccasion;
  label: string;
  placeholder: string;
}> = [
  {
    value: "birthday",
    label: "День рождения",
    placeholder: "Песня на день рождения, тёплая и с именем в припеве…",
  },
  {
    value: "love",
    label: "Любовь и признание",
    placeholder: "Песня-признание, без лишней громкости, чтобы её захотелось переслушать…",
  },
  {
    value: "joke",
    label: "Шутка",
    placeholder: "Смешная песня с точной шуткой, которую не стыдно включить в компании…",
  },
  {
    value: "other",
    label: "Другой повод",
    placeholder: "Песня в подарок, с поводом, который понятен с первых строк…",
  },
];

export const CONTENT_PLACE_OPTIONS: ReadonlyArray<{
  value: ContentPlace;
  label: string;
  placeholder: string;
}> = [
  {
    value: "clip",
    label: "Ролик",
    placeholder: "Короткий цепкий трек для ролика, с припевом, который хочется дослушать…",
  },
  {
    value: "post",
    label: "Пост",
    placeholder: "Спокойная песня под пост, без крика в припеве…",
  },
  {
    value: "ad",
    label: "Реклама дела",
    placeholder: "Спокойная песня под пост о деле, без крика в припеве…",
  },
];

const SELF_PLACEHOLDER = "Песня для себя, под настроение, которую хочется дослушать…";
const RELEASE_PLACEHOLDER =
  "Песня со своим героем и цельным припевом, которую можно выложить…";

const listeners = new Set<() => void>();

function notifySongAnswers(): void {
  listeners.forEach((listener) => listener());
}

export function subscribeSongAnswers(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

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

export function songJobNeedsDetail(job: SongJob | null): boolean {
  return job === "gift" || job === "content";
}

export function readSongJob(): SongJob | null {
  return readStored(
    SONG_JOB_KEY,
    SONG_JOB_OPTIONS.map((option) => option.value),
  );
}

export function persistSongJob(value: SongJob | null): void {
  writeStored(SONG_JOB_KEY, value);
  if (value !== "gift") writeStored(GIFT_OCCASION_KEY, null);
  if (value !== "content") writeStored(CONTENT_PLACE_KEY, null);
  notifySongAnswers();
}

export function readGiftOccasion(): GiftOccasion | null {
  return readStored(
    GIFT_OCCASION_KEY,
    GIFT_OCCASION_OPTIONS.map((option) => option.value),
  );
}

export function persistGiftOccasion(value: GiftOccasion | null): void {
  writeStored(GIFT_OCCASION_KEY, value);
  notifySongAnswers();
}

export function readContentPlace(): ContentPlace | null {
  return readStored(
    CONTENT_PLACE_KEY,
    CONTENT_PLACE_OPTIONS.map((option) => option.value),
  );
}

export function persistContentPlace(value: ContentPlace | null): void {
  writeStored(CONTENT_PLACE_KEY, value);
  notifySongAnswers();
}

/**
 * When true, questions open on every signed-in session even after a skip was stored.
 * Product rule: once per browser — keep false.
 */
export const QUALIFICATION_EVERY_SESSION = false;

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

/** Example sentence for the idea field. A gift occasion or a destination replaces the default. */
export function songPlaceholder(): string {
  const job = readSongJob();
  if (job === "gift") {
    return (
      GIFT_OCCASION_OPTIONS.find((option) => option.value === readGiftOccasion())?.placeholder ??
      "Песня в подарок, с поводом, который понятен с первых строк…"
    );
  }
  if (job === "self") return SELF_PLACEHOLDER;
  if (job === "content") {
    return (
      CONTENT_PLACE_OPTIONS.find((option) => option.value === readContentPlace())?.placeholder ??
      "Короткий цепкий трек для ролика, с припевом, который хочется дослушать…"
    );
  }
  if (job === "release") return RELEASE_PLACEHOLDER;
  return DEFAULT_PLACEHOLDER;
}
