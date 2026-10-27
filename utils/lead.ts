import type { LeadSnapshot, LeadStep } from "@/types/lead";
import { readHeroIdea } from "@/utils/hero-idea";
import { readMarketingAttribution } from "@/utils/marketing-attribution";
import { readSongFor, readVisitor } from "@/utils/qualification";
import { prefixedKey } from "@/utils/storage-prefix";

const LEAD_KEY = prefixedKey("lead");

export function rememberLead(step: LeadStep, javaUserId?: string | null, idea?: string): void {
  if (typeof window === "undefined") return;
  const previous = readLead();
  const snapshot: LeadSnapshot = {
    savedAt: new Date().toISOString(),
    step,
    idea: idea ?? readHeroIdea(),
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
