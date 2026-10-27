import type { SongDraft } from "@/types/song-draft";
import { PROMPT_MAX } from "@/utils/hero-idea";
import { prefixedKey } from "@/utils/storage-prefix";

const DRAFT_KEY = prefixedKey("song_draft");

const SECTION_MARK =
  /\[[^\]]*(?:verse|chorus|bridge|intro|outro|куплет|припев|бридж|интро|аутро)[^\]]*\]|(?:^|\n)\s*(?:куплет|припев|бридж|verse|chorus|bridge)\b/i;

type StoredSongDraft = SongDraft & { source: string };

/** A description is one block of prose. Lyrics are marked sections or several short lines. */
export function classifyIdea(text: string): SongDraft {
  const value = text.replace(/\r\n/g, "\n").trim();
  if (!value) return { idea: "", lyrics: "" };
  if (looksLikeLyrics(value)) return { idea: "", lyrics: value };
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
    if (!parsed || typeof parsed.idea !== "string" || typeof parsed.lyrics !== "string" || typeof parsed.source !== "string") {
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

function looksLikeLyrics(text: string): boolean {
  if (SECTION_MARK.test(text)) return true;
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  if (lines.length < 4) return false;
  const average = lines.reduce((sum, line) => sum + line.length, 0) / lines.length;
  return average <= 72;
}
