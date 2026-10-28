"use client";

/**
 * Support contact → POST /api/support/contact → Telegram.
 * Layout follows ViralThumblify: phone sheet, desktop popover, quick topics, honeypot.
 * The dock stays pointer-events-none so a closed panel does not cover the page.
 */

import { useEffect, useId, useState, type ReactNode } from "react";
import { ArrowUpRight, MessageCircle, Send, X } from "lucide-react";
import { SupportProactiveNudge } from "@/components/support/support-proactive-nudge";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSupportProactiveNudge } from "@/hooks/use-support-proactive-nudge";
import { SUPPORT_CONTACT_EMAIL } from "@/utils/support";
import { cn } from "@/utils/cn";

export type SupportWidgetProps = {
  source: "app";
  defaultEmail?: string;
  postUrl?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Phone: no floating button. The menu opens the sheet. */
  hideMobileLauncher?: boolean;
};

const QUICK = ["Как это работает?", "Вопрос по тарифам", "Нужна помощь"] as const;

type PanelBodyProps = {
  idPrefix: string;
  titleId: string;
  sent: boolean;
  email: string;
  name: string;
  message: string;
  honeypot: string;
  error: string | null;
  submitting: boolean;
  postUrl: string;
  onEmailChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onHoneypotChange: (value: string) => void;
  onQuickSelect: (value: string) => void;
  onSubmit: () => void;
  headerEnd?: ReactNode;
};

function SupportPanelBody({
  idPrefix,
  titleId,
  sent,
  email,
  name,
  message,
  honeypot,
  error,
  submitting,
  postUrl,
  onEmailChange,
  onNameChange,
  onMessageChange,
  onHoneypotChange,
  onQuickSelect,
  onSubmit,
  headerEnd,
}: PanelBodyProps) {
  return (
    <>
      <div className="relative flex shrink-0 items-center gap-2.5 border-b border-overlay/8 bg-bg-elevated px-4 py-3 sm:gap-3 sm:px-5 sm:py-3.5">
        <div className="flex size-9 items-center justify-center rounded-full border border-overlay/10 sm:size-10">
          <MessageCircle className="size-4 text-accent sm:size-5" strokeWidth={1.75} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <div id={titleId} className="text-sm font-semibold text-text-primary">
            Поддержка
          </div>
          {SUPPORT_CONTACT_EMAIL ? (
            <a
              href={`mailto:${SUPPORT_CONTACT_EMAIL}`}
              className="block truncate text-[11px] text-text-muted underline decoration-overlay/40 underline-offset-2 hover:text-text-primary sm:text-xs"
            >
              {SUPPORT_CONTACT_EMAIL}
            </a>
          ) : (
            <div className="text-[11px] text-text-dim sm:text-xs">Ответим на почту</div>
          )}
        </div>
        {headerEnd}
      </div>

      <div className="lp-support-form relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3 sm:px-5 sm:py-4">
        {sent ? (
          <div className="flex flex-col items-center py-5 text-center sm:py-6">
            <div className="flex size-11 items-center justify-center rounded-full bg-accent/15">
              <ArrowUpRight className="size-5 text-accent" strokeWidth={1.75} aria-hidden />
            </div>
            <p className="mt-2.5 text-sm font-medium text-text-primary">Запрос получен</p>
            <p className="mt-1 text-xs text-text-muted">Посмотрим и ответим на вашу почту.</p>
          </div>
        ) : (
          <>
            <p className="mb-3 text-xs text-text-muted sm:mb-4 sm:text-sm">
              Напишите — ответим на почту.
            </p>

            <div className="mb-3 flex flex-wrap gap-1.5 sm:mb-4 sm:gap-2">
              {QUICK.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => onQuickSelect(topic)}
                  className="cursor-pointer rounded-full border border-border px-2.5 py-1 text-[11px] text-text-muted transition-colors hover:border-border-hover hover:text-text-primary sm:px-3 sm:py-1.5 sm:text-xs"
                >
                  {topic}
                </button>
              ))}
            </div>

            <label className="sr-only" htmlFor={`${idPrefix}email`}>
              Почта
            </label>
            <Input
              id={`${idPrefix}email`}
              type="email"
              autoComplete="email"
              placeholder="Ваша почта *"
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
              className="mb-2.5 h-auto sm:mb-3"
            />

            <label className="sr-only" htmlFor={`${idPrefix}name`}>
              Имя (необязательно)
            </label>
            <Input
              id={`${idPrefix}name`}
              type="text"
              placeholder="Имя (необязательно)"
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              className="mb-2.5 h-auto sm:mb-3"
            />

            <label className="sr-only" htmlFor={`${idPrefix}message`}>
              Сообщение
            </label>
            <div className="lp-support-message mb-2.5 rounded-lg border border-overlay/10 px-3.5 py-2.5 sm:mb-3">
              <Textarea
                id={`${idPrefix}message`}
                placeholder="Сообщение *"
                rows={3}
                value={message}
                onChange={(event) => onMessageChange(event.target.value)}
                className="min-h-[4.75rem] text-sm sm:min-h-[5.5rem]"
              />
            </div>

            <div className="absolute left-[-9999px] h-px w-px overflow-hidden opacity-0">
              <label htmlFor={`${idPrefix}company`}>Компания</label>
              <input
                id={`${idPrefix}company`}
                tabIndex={-1}
                value={honeypot}
                onChange={(event) => onHoneypotChange(event.target.value)}
                autoComplete="off"
              />
            </div>

            {error ? <p className="mb-2 text-xs text-accent-warm">{error}</p> : null}

            <Button
              type="button"
              disabled={submitting || !postUrl}
              onClick={onSubmit}
              className="w-full"
            >
              <Send className="size-4" strokeWidth={1.75} aria-hidden />
              {submitting ? "Отправляем…" : "Отправить"}
            </Button>
          </>
        )}
      </div>
    </>
  );
}

export function SupportWidget({
  source,
  defaultEmail = "",
  postUrl: postUrlProp,
  open: openProp,
  onOpenChange,
  hideMobileLauncher = false,
}: SupportWidgetProps) {
  const titleId = useId();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? Boolean(openProp) : uncontrolledOpen;
  const setOpen = (next: boolean): void => {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };
  const [mounted, setMounted] = useState(false);
  const [postUrl, setPostUrl] = useState("");
  const [email, setEmail] = useState(defaultEmail);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSubmittedThisSession, setHasSubmittedThisSession] = useState(false);
  const { showNudge, markNudgeHandled } = useSupportProactiveNudge({
    isWidgetOpen: open,
    hasSubmitted: hasSubmittedThisSession,
    isLauncherVisible: mounted,
  });

  useEffect(() => {
    if (open) markNudgeHandled();
  }, [markNudgeHandled, open]);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setEmail(defaultEmail);
  }, [defaultEmail]);

  useEffect(() => {
    if (postUrlProp?.trim()) {
      setPostUrl(postUrlProp.trim());
      return;
    }
    const fromEnv = process.env.NEXT_PUBLIC_SUPPORT_API_URL?.trim();
    if (fromEnv) {
      setPostUrl(fromEnv);
      return;
    }
    if (typeof window !== "undefined") {
      setPostUrl(`${window.location.origin}/api/support/contact`);
    }
  }, [postUrlProp]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  async function handleSubmit() {
    setError(null);
    const em = email.trim();
    const msg = message.trim();
    if (!em && !msg) {
      setError("Укажите почту и сообщение.");
      return;
    }
    if (!em) {
      setError("Укажите почту.");
      return;
    }
    if (!msg) {
      setError("Напишите сообщение.");
      return;
    }
    if (!postUrl) {
      setError("Адрес поддержки ещё не готов. Попробуйте ещё раз.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: em,
          message: msg,
          name: name.trim() || undefined,
          source,
          page_url:
            typeof window !== "undefined"
              ? `${window.location.pathname}${window.location.search}`
              : undefined,
          company: honeypot || undefined,
        }),
      });
      let body: unknown;
      try {
        body = await res.json();
      } catch {
        body = null;
      }
      const ok =
        res.ok && body && typeof body === "object" && "ok" in body && (body as { ok: boolean }).ok;
      if (ok) {
        setSent(true);
        setHasSubmittedThisSession(true);
        setMessage("");
        setTimeout(() => setSent(false), 8000);
        return;
      }
      let messageText: string | null = null;
      if (body && typeof body === "object" && "message" in body) {
        const responseMessage = (body as { message: unknown }).message;
        if (Array.isArray(responseMessage)) {
          messageText = responseMessage.filter((item) => typeof item === "string").join(", ");
        } else if (typeof responseMessage === "string") {
          messageText = responseMessage;
        }
      }
      setError(messageText || `Что-то пошло не так (${res.status}). Попробуйте позже.`);
    } catch {
      setError("Ошибка сети. Попробуйте ещё раз.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleAcceptNudge(): void {
    markNudgeHandled();
    setOpen(true);
  }

  const panelProps: Omit<PanelBodyProps, "headerEnd" | "idPrefix" | "titleId"> = {
    sent,
    email,
    name,
    message,
    honeypot,
    error,
    submitting,
    postUrl,
    onEmailChange: setEmail,
    onNameChange: setName,
    onMessageChange: setMessage,
    onHoneypotChange: setHoneypot,
    onQuickSelect: setMessage,
    onSubmit: () => void handleSubmit(),
  };

  return (
    <>
      <div
        className="lp-support-layer pointer-events-none fixed inset-0 z-50 sm:hidden"
        data-open={open ? "true" : "false"}
        aria-hidden={!open}
      >
        <button
          type="button"
          aria-label="Закрыть поддержку"
          className="lp-support-scrim absolute inset-0 bg-black/60"
          onClick={() => setOpen(false)}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${titleId}-sheet`}
          inert={!open}
          className="lp-support-sheet absolute inset-x-0 bottom-0 flex max-h-[min(88dvh,40rem)] flex-col overflow-hidden rounded-t-xl border border-b-0 border-border bg-bg-card shadow-2xl shadow-black/50"
        >
          <SupportPanelBody
            {...panelProps}
            idPrefix="support-sheet-"
            titleId={`${titleId}-sheet`}
            headerEnd={
              <button
                type="button"
                aria-label="Закрыть поддержку"
                onClick={() => setOpen(false)}
                className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-text-muted hover:bg-overlay/8 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <X className="size-4" strokeWidth={1.75} aria-hidden />
              </button>
            }
          />
        </div>
      </div>

      <div
        className={cn(
          "lp-support-dock pointer-events-none fixed z-50 flex-col items-end",
          "right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))]",
          hideMobileLauncher ? "hidden sm:flex" : "flex",
        )}
      >
        <div className="relative hidden w-[min(calc(100vw-2rem),21rem)] sm:block">
          <SupportProactiveNudge
            visible={showNudge && !open}
            onDismiss={markNudgeHandled}
            onAccept={handleAcceptNudge}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${titleId}-pop`}
            data-open={open ? "true" : "false"}
            inert={!open}
            className="lp-support-pop overflow-hidden rounded-xl border border-border bg-bg-card shadow-2xl shadow-black/40"
          >
            <div className="relative flex max-h-[min(75dvh,36rem)] flex-col">
              <SupportPanelBody
                {...panelProps}
                idPrefix="support-pop-"
                titleId={`${titleId}-pop`}
              />
            </div>
          </div>
        </div>

        {hideMobileLauncher ? null : (
          <div className="relative mb-2.5 w-[min(calc(100vw-1.5rem),18rem)] sm:hidden">
            <SupportProactiveNudge
              visible={showNudge && !open}
              onDismiss={markNudgeHandled}
              onAccept={handleAcceptNudge}
            />
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Закрыть поддержку" : "Открыть поддержку"}
          aria-expanded={open}
          data-mounted={mounted ? "true" : "false"}
          className={cn(
            "lp-support-fab pointer-events-auto relative flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-accent text-on-accent shadow-accent",
            "hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:size-12",
            hideMobileLauncher && "hidden sm:flex",
            mounted && open && "max-sm:pointer-events-none max-sm:opacity-0",
          )}
        >
          <MessageCircle
            className={cn(
              "lp-support-fab-icon absolute size-5 text-on-accent",
              open ? "lp-support-fab-icon-out" : "lp-support-fab-icon-in",
            )}
            strokeWidth={1.75}
            aria-hidden
          />
          <X
            className={cn(
              "lp-support-fab-icon absolute size-5 text-on-accent",
              open ? "lp-support-fab-icon-in" : "lp-support-fab-icon-out-back",
            )}
            strokeWidth={1.75}
            aria-hidden
          />
        </button>
      </div>
    </>
  );
}
