import type { SongDraft, VocalGender } from "@/types/song-draft";
import { PROMPT_MAX } from "@/utils/hero-idea";
import { expandStyleForPrompt, songStyleByLegacyId } from "@/utils/song-styles";
import { prefixedKey } from "@/utils/storage-prefix";

const DRAFT_KEY = prefixedKey("song_draft");
const DEFAULT_GENDER: VocalGender = "female";

type StoredSongDraft = SongDraft & { source: string };

export function emptySongDraft(): SongDraft {
  return {
    idea: "",
    lyrics: "",
    style: "",
    vocalGender: DEFAULT_GENDER,
  };
}

/** Home and the landing `idea` param are a description. Lyrics are written on `/create`. */
export function descriptionDraft(text: string): SongDraft {
  const value = text.replace(/\r\n/g, "\n").trim();
  return { ...emptySongDraft(), idea: value };
}

function genderLabel(gender: VocalGender): string {
  return gender === "male" ? "мужской" : "женский";
}

/** Always Russian vocals — no language control in the UI. */
export function composePrompt(draft: SongDraft): string {
  const idea = draft.idea.trim();
  const lyrics = draft.lyrics.trim();
  const style = expandStyleForPrompt(draft.style);
  const parts: string[] = [
    "Язык вокала: русский.",
    `Голос: ${genderLabel(draft.vocalGender)}.`,
  ];
  if (style) parts.push(`Стиль: ${style}.`);
  if (idea) parts.push(`Идея:\n${idea}`);
  if (lyrics) parts.push(`Текст песни, оставь его как есть:\n${lyrics}`);
  return parts.join("\n\n");
}

export function promptFits(draft: SongDraft): boolean {
  const hasContent = Boolean(draft.idea.trim() || draft.lyrics.trim());
  const prompt = composePrompt(draft);
  return hasContent && prompt.length > 0 && prompt.length <= PROMPT_MAX;
}

function normalizeDraft(parsed: Partial<SongDraft> & Record<string, unknown>): SongDraft | null {
  if (!parsed || typeof parsed.idea !== "string" || typeof parsed.lyrics !== "string") {
    return null;
  }
  let style = typeof parsed.style === "string" ? parsed.style : "";
  if (!style.trim()) {
    const legacyId = typeof parsed.styleId === "string" ? parsed.styleId : "";
    const legacyCustom = typeof parsed.customStyle === "string" ? parsed.customStyle : "";
    if (legacyId === "custom") style = legacyCustom;
    else style = songStyleByLegacyId(legacyId) ?? legacyCustom;
  }
  const vocalGender: VocalGender =
    parsed.vocalGender === "male" || parsed.vocalGender === "female"
      ? parsed.vocalGender
      : DEFAULT_GENDER;
  return {
    idea: parsed.idea,
    lyrics: parsed.lyrics,
    style,
    vocalGender,
  };
}

export function readSongDraft(): StoredSongDraft | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(DRAFT_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<StoredSongDraft> & Record<string, unknown>;
    if (!parsed || typeof parsed.source !== "string") return null;
    const draft = normalizeDraft(parsed);
    if (!draft) return null;
    return { ...draft, source: parsed.source };
  } catch {
    return null;
  }
}

export function persistSongDraft(draft: SongDraft, source: string): void {
  if (typeof window === "undefined") return;
  const stored: StoredSongDraft = { ...draft, source };
  window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(stored));
}

/** Fill the lyrics field from Java once per generation; later polls must not wipe edits. */
export function applyGenerationLyrics(
  draft: SongDraft,
  generationId: string,
  lyrics: string | null | undefined,
  appliedForId: string,
): { draft: SongDraft; appliedForId: string } | null {
  const value = lyrics?.replace(/\r\n/g, "\n").trim() ?? "";
  if (!generationId || !value || appliedForId === generationId) return null;
  if (draft.lyrics === value) return { draft, appliedForId: generationId };
  return { draft: { ...draft, lyrics: value }, appliedForId: generationId };
}
