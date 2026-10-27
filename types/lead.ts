import type { MarketingAttributionParams } from "@/types/marketing";
import type { SongFor, VisitorKind } from "@/types/qualification";

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
  attribution: MarketingAttributionParams;
};
