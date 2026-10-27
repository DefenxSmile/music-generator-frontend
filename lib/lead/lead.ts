import { readHeroIdea } from "@/lib/lead/hero-idea";
import { readMarketingAttribution } from "@/lib/lead/marketing-attribution";
import { readSongFor, readVisitor, type SongFor, type VisitorKind } from "@/lib/lead/qualification";
import { prefixedKey } from "@/lib/storage-prefix";

/**
 * Local lead snapshot for a later worker.
 * YouGile, Excel, and the Yandex Metrika pixel are not called from here.
 * Nothing in this object is sent to the Java API.
 */
export type LeadStep = "idea" | "auth" | "qualified" | "generation";

export type LeadSnapshot = {
  savedAt: string;
  step: LeadStep;
  idea: string;
  visitor: VisitorKind | null;
  songFor: SongFor | null;
  javaUserId: string | null;
  attribution: ReturnType<typeof readMarketingAttribution>;
};

const LEAD_KEY = prefixedKey("lead");

export function rememberLead(step: LeadStep, javaUserId?: string | null): void {
  if (typeof window === "undefined") return;
  const previous = readLead();
  const snapshot: LeadSnapshot = {
    savedAt: new Date().toISOString(),
    step,
    idea: readHeroIdea(),
    visitor: readVisitor(),
    songFor: readSongFor(),
    javaUserId: javaUserId ?? previous?.javaUserId ?? null,
    attribution: readMarketingAttribution(),
  };
  window.localStorage.setItem(LEAD_KEY, JSON.stringify(snapshot));
}

export function readLead(): LeadSnapshot | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(LEAD_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<LeadSnapshot>;
    if (!parsed || typeof parsed.step !== "string") return null;
    return parsed as LeadSnapshot;
  } catch {
    return null;
  }
}
