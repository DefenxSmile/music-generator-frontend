import { NextResponse } from "next/server";

const WINDOW_MS = 60_000;
const LIMIT = 15;
const hits = new Map<string, number[]>();

function clientIp(request: Request): string | undefined {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded?.trim()) return forwarded.split(",")[0]?.trim() || undefined;
  return undefined;
}

function limited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((at) => now - at < WINDOW_MS);
  if (recent.length >= LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

function escapeTelegramHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value.trim() : undefined;
}

function isEmail(value: string): boolean {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function sendTicket(params: {
  email: string;
  message: string;
  name?: string;
  source: string;
  pageUrl?: string;
  clientIp?: string;
  userAgent?: string;
}): Promise<{ ok: true } | { ok: false; reason: "not_configured" | "telegram_error" }> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_SUPPORT_CHAT_ID?.trim();
  if (!token || !chatId) return { ok: false, reason: "not_configured" };

  const e = escapeTelegramHtml;
  const lines = [
    "<b>Support ticket</b>",
    `<b>Source:</b> ${e(params.source)}`,
    `<b>Email:</b> ${e(params.email)}`,
  ];
  if (params.name?.trim()) lines.push(`<b>Name:</b> ${e(params.name.trim())}`);
  if (params.pageUrl?.trim()) lines.push(`<b>Page:</b> ${e(params.pageUrl.trim())}`);
  if (params.clientIp?.trim()) lines.push(`<b>IP:</b> ${e(params.clientIp.trim())}`);
  if (params.userAgent?.trim())
    lines.push(`<b>UA:</b> ${e(params.userAgent.trim().slice(0, 500))}`);
  lines.push("", "<b>Message</b>", `<pre>${e(params.message.trim())}</pre>`);
  let text = lines.join("\n");
  if (text.length > 4090) text = `${text.slice(0, 4080)}\n…`;

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${encodeURIComponent(token)}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
        signal: AbortSignal.timeout(15_000),
      },
    );
    if (!res.ok) return { ok: false, reason: "telegram_error" };
    return { ok: true };
  } catch {
    return { ok: false, reason: "telegram_error" };
  }
}

export async function POST(request: Request) {
  const ip = clientIp(request) ?? "unknown";
  if (limited(ip)) {
    return NextResponse.json(
      { message: "Слишком много сообщений. Попробуйте через минуту." },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Некорректный запрос." }, { status: 400 });
  }
  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ message: "Некорректный запрос." }, { status: 400 });
  }
  const body = payload as Record<string, unknown>;
  const company = asString(body.company);
  if (company) return NextResponse.json({ ok: true, skipped: true });

  const email = asString(body.email) ?? "";
  const message = asString(body.message) ?? "";
  const name = asString(body.name);
  const source = asString(body.source);
  const pageUrl = asString(body.page_url);
  if (!isEmail(email)) {
    return NextResponse.json({ message: "Укажите почту." }, { status: 400 });
  }
  if (!message || message.length > 4000) {
    return NextResponse.json({ message: "Напишите сообщение." }, { status: 400 });
  }
  if (name && name.length > 120) {
    return NextResponse.json({ message: "Имя слишком длинное." }, { status: 400 });
  }
  if (source !== "app" && source !== "landing") {
    return NextResponse.json({ message: "Некорректный запрос." }, { status: 400 });
  }
  if (pageUrl && pageUrl.length > 2000) {
    return NextResponse.json({ message: "Некорректный запрос." }, { status: 400 });
  }

  const result = await sendTicket({
    email,
    message,
    name,
    source,
    pageUrl,
    clientIp: ip === "unknown" ? undefined : ip,
    userAgent: request.headers.get("user-agent") ?? undefined,
  });
  if (result.ok) return NextResponse.json({ ok: true });
  if (result.reason === "not_configured") {
    return NextResponse.json(
      {
        message: "Канал поддержки не настроен.",
      },
      { status: 503 },
    );
  }
  return NextResponse.json(
    { message: "Не удалось отправить сообщение. Попробуйте позже." },
    { status: 502 },
  );
}
