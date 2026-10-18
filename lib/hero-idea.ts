import { prefixedKey } from "@/lib/storage-prefix";

/** Query name the landing appends. Line breaks are flattened there. */
export const IDEA_QUERY_PARAM = "idea";
export const IDEA_STORAGE_KEY = prefixedKey("hero_idea");
/** Landing hero cap. The query param is never longer than this. */
export const IDEA_QUERY_MAX = 1500;
/** Java `CreateGenerationRequest.prompt` max. */
export const PROMPT_MAX = 2000;

export function collapseIdea(raw: string): string {
  return raw.trim().replace(/\s+/g, " ").slice(0, IDEA_QUERY_MAX);
}

export function readStoredIdea(): string {
  if (typeof window === "undefined") return "";
  const raw = window.sessionStorage.getItem(IDEA_STORAGE_KEY) ?? "";
  return raw.slice(0, PROMPT_MAX);
}

export function persistHeroIdea(idea: string): void {
  if (typeof window === "undefined") return;
  const value = idea.slice(0, PROMPT_MAX);
  if (!value.trim()) {
    window.sessionStorage.removeItem(IDEA_STORAGE_KEY);
    return;
  }
  window.sessionStorage.setItem(IDEA_STORAGE_KEY, value);
}

/**
 * URL `idea` wins when it differs from storage.
 * When storage is the same idea with line breaks, storage wins.
 * Without a query param, storage is the field value.
 */
export function resolveInitialIdea(search: string): string {
  const stored = readStoredIdea();
  const fromQuery = new URLSearchParams(search).get(IDEA_QUERY_PARAM);
  const queryIdea = fromQuery ? collapseIdea(fromQuery) : "";
  if (queryIdea) {
    if (stored && collapseIdea(stored) === queryIdea) return stored;
    return queryIdea;
  }
  return stored;
}
