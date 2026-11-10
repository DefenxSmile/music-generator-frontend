import type { Me } from "@/types/me";
import { prefixedKey } from "@/utils/storage-prefix";

/** Last successful `/me` for this tab — soft placeholder across F5 while session resumes. */
const ME_SNAPSHOT_KEY = prefixedKey("me_snapshot");

export function readMeSnapshot(): Me | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(ME_SNAPSHOT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Me>;
    if (
      typeof parsed.id !== "string" ||
      typeof parsed.email !== "string" ||
      typeof parsed.balance !== "number" ||
      !Number.isFinite(parsed.balance)
    ) {
      return null;
    }
    return {
      id: parsed.id,
      email: parsed.email,
      emailVerified: Boolean(parsed.emailVerified),
      balance: parsed.balance,
      createdAt: typeof parsed.createdAt === "string" ? parsed.createdAt : "",
    };
  } catch {
    return null;
  }
}

export function writeMeSnapshot(me: Me): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(ME_SNAPSHOT_KEY, JSON.stringify(me));
  } catch {
    /* private mode / quota */
  }
}

export function clearMeSnapshot(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(ME_SNAPSHOT_KEY);
  } catch {
    /* ignore */
  }
}
