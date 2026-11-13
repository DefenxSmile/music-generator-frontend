import { prefixedKey } from "@/utils/storage-prefix";

export type ComposerMode = "simple" | "advanced";

const MODE_KEY = prefixedKey("composer_mode");

/** Simple = idea + styles; advanced adds lyrics and extras. */
export function readComposerMode(): ComposerMode {
  if (typeof window === "undefined") return "simple";
  try {
    const raw = window.sessionStorage.getItem(MODE_KEY);
    return raw === "advanced" ? "advanced" : "simple";
  } catch {
    return "simple";
  }
}

export function persistComposerMode(mode: ComposerMode): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(MODE_KEY, mode);
  } catch {
    /* sessionStorage blocked */
  }
}

/** Open advanced when the draft already carries lyrics. */
export function resolveComposerMode(lyrics: string, stored: ComposerMode): ComposerMode {
  if (lyrics.replace(/\r\n/g, "\n").trim()) return "advanced";
  return stored;
}
