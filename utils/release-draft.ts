import { STREAM_PLATFORMS } from "@/utils/release-platforms";
import { prefixedKey } from "@/utils/storage-prefix";

export type ReleaseDraft = {
  id: string;
  title: string;
  artist: string;
  date: string;
  platformIds: string[];
  updatedAt: string;
};

const KEY = prefixedKey("release_drafts");

function readAll(): ReleaseDraft[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ReleaseDraft[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(drafts: ReleaseDraft[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(drafts));
}

export function listReleaseDrafts(): ReleaseDraft[] {
  return readAll().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function emptyReleaseDraft(): ReleaseDraft {
  const today = new Date();
  const date = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
  return {
    id: `draft-${Date.now()}`,
    title: "",
    artist: "",
    date,
    platformIds: STREAM_PLATFORMS.map((item) => item.id),
    updatedAt: new Date().toISOString(),
  };
}

export function saveReleaseDraft(draft: ReleaseDraft): void {
  const next = { ...draft, updatedAt: new Date().toISOString() };
  const rest = readAll().filter((item) => item.id !== next.id);
  writeAll([next, ...rest]);
}

export function readReleaseDraft(id: string): ReleaseDraft | null {
  return readAll().find((item) => item.id === id) ?? null;
}

export function removeReleaseDraft(id: string): void {
  writeAll(readAll().filter((item) => item.id !== id));
}
