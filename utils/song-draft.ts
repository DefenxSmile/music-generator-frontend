import type { SongDraft } from "@/types/song-draft";
import { PROMPT_MAX } from "@/utils/hero-idea";
import { prefixedKey } from "@/utils/storage-prefix";

const DRAFT_KEY = prefixedKey("song_draft");

type StoredSongDraft = SongDraft & { source: string };

/** Home and the landing `idea` param are a description. Lyrics are written on `/create`. */
export function descriptionDraft(text: string): SongDraft {
  const value = text.replace(/\r\n/g, "\n").trim();
  return { idea: value, lyrics: "" };
}

export function composePrompt(draft: SongDraft): string {
  const idea = draft.idea.trim();
  const lyrics = draft.lyrics.trim();
  if (idea && lyrics) {
    return `Стиль и идея:\n${idea}\n\nТекст песни, оставь его как есть:\n${lyrics}`;
  }
  if (lyrics) return `Текст песни, оставь его как есть:\n${lyrics}`;
  return idea;
}

export function promptFits(draft: SongDraft): boolean {
  const prompt = composePrompt(draft);
  return prompt.length > 0 && prompt.length <= PROMPT_MAX;
}

export function readSongDraft(): StoredSongDraft | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(DRAFT_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<StoredSongDraft>;
    if (
      !parsed ||
      typeof parsed.idea !== "string" ||
      typeof parsed.lyrics !== "string" ||
      typeof parsed.source !== "string"
    ) {
      return null;
    }
    return { idea: parsed.idea, lyrics: parsed.lyrics, source: parsed.source };
  } catch {
    return null;
  }
}

export function persistSongDraft(draft: SongDraft, source: string): void {
  if (typeof window === "undefined") return;
  const stored: StoredSongDraft = { idea: draft.idea, lyrics: draft.lyrics, source };
  window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(stored));
}
