import { javaApiConfigured, javaApiUrl } from "@/utils/java-api";

export type SupportContactSource = "app" | "landing";

export type SupportContactPayload = {
  email: string;
  message: string;
  name?: string;
  source: SupportContactSource;
  pageUrl?: string;
  /** Honeypot — leave empty */
  company?: string;
};

export type SupportContactResult =
  { ok: true; skipped?: boolean } | { ok: false; status: number; message: string };

/**
 * Public Java endpoint — no access token.
 * Both the app and the landing post here.
 */
export async function submitSupportContact(
  payload: SupportContactPayload,
): Promise<SupportContactResult> {
  if (!javaApiConfigured()) {
    return { ok: false, status: 0, message: "Не задан адрес API (JAVA_API_BASE_URL)." };
  }

  try {
    const res = await fetch(javaApiUrl("/api/v1/support/contact"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        email: payload.email,
        message: payload.message,
        name: payload.name,
        source: payload.source,
        pageUrl: payload.pageUrl,
        company: payload.company ?? "",
      }),
    });

    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      body = null;
    }

    if (
      res.ok &&
      body &&
      typeof body === "object" &&
      "ok" in body &&
      (body as { ok: boolean }).ok
    ) {
      const skipped = "skipped" in body && Boolean((body as { skipped?: boolean }).skipped);
      return skipped ? { ok: true, skipped: true } : { ok: true };
    }

    let message = `Что-то пошло не так (${res.status}). Попробуйте позже.`;
    if (body && typeof body === "object" && "message" in body) {
      const raw = (body as { message: unknown }).message;
      if (typeof raw === "string" && raw) message = raw;
    }
    return { ok: false, status: res.status, message };
  } catch {
    return { ok: false, status: 0, message: "Ошибка сети. Попробуйте ещё раз." };
  }
}
