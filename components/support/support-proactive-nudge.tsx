"use client";

import { useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import { playSupportNudgeSound } from "@/utils/play-support-nudge-sound";

type SupportProactiveNudgeProps = {
  visible: boolean;
  onDismiss: () => void;
  onAccept: () => void;
};

export function SupportProactiveNudge({
  visible,
  onDismiss,
  onAccept,
}: SupportProactiveNudgeProps) {
  const acceptButtonRef = useRef<HTMLButtonElement>(null);
  const hasPlayedSoundRef = useRef(false);

  useEffect(() => {
    if (!visible) {
      hasPlayedSoundRef.current = false;
      return;
    }
    if (!hasPlayedSoundRef.current) {
      hasPlayedSoundRef.current = true;
      playSupportNudgeSound();
    }
    acceptButtonRef.current?.focus({ preventScroll: true });
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Предложение поддержки"
      className="pointer-events-auto w-full origin-bottom-right overflow-hidden rounded-xl border border-border bg-bg-card shadow-2xl shadow-black/40"
    >
      <div className="flex items-center gap-3 bg-bg-elevated px-5 py-3.5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-overlay/10">
          <MessageCircle className="size-4 text-accent" strokeWidth={1.75} aria-hidden />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-text-primary">Поддержка</div>
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden />
            <span>Мы на связи</span>
          </div>
        </div>
      </div>

      <div className="px-5 py-4">
        <div className="rounded-xl rounded-tl-none border border-border bg-bg-elevated px-4 py-3 text-sm text-text-muted">
          Нужна помощь с песней? Спросите про вход, кредиты или генерацию — ответим на почту.
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onDismiss}
            className="cursor-pointer rounded-lg px-3 py-2 text-xs font-medium text-text-muted transition-colors hover:text-text-primary"
          >
            Не сейчас
          </button>
          <Button ref={acceptButtonRef} type="button" size="sm" onClick={onAccept}>
            Да, конечно
          </Button>
        </div>
      </div>
    </div>
  );
}
