"use client";

import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { Suspense, useState, type ReactNode } from "react";
import { AuthQueryOpener } from "@/components/auth/auth-query-opener";
import { VkIdButton } from "@/components/auth/vk-id-button";
import { YandexIdButton } from "@/components/auth/yandex-id-button";
import { IconButton } from "@/components/ui/icon-button";
import { Modal } from "@/components/ui/modal";
import { OpenAuthContext } from "@/hooks/use-open-auth";
import { rememberAuthNext, safeNext } from "@/types/auth-next";
import type { OpenAuthOptions } from "@/types/auth";
import { javaApiOrigin } from "@/utils/java-api";

export function AuthDialogProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [intent, setIntent] = useState<OpenAuthOptions["intent"]>("enter");
  const [leaving, setLeaving] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);

  function openAuth(options?: OpenAuthOptions) {
    rememberAuthNext(safeNext(options?.next ?? pathname));
    setIntent(options?.intent ?? "enter");
    setLeaving(false);
    setConfigError(null);
    setOpen(true);
  }

  function close() {
    if (leaving) return;
    setOpen(false);
  }

  function startYandex() {
    const origin = javaApiOrigin();
    if (!origin) {
      setConfigError("Не задан адрес API. Проверьте JAVA_API_BASE_URL.");
      return;
    }
    setLeaving(true);
    setOpen(false);
    // Full navigation to Java so PKCE cookies stay on the API host (not the local proxy).
    window.location.assign(`${origin}/api/v1/auth/yandex`);
  }

  return (
    <OpenAuthContext.Provider value={openAuth}>
      {children}
      <Suspense fallback={null}>
        <AuthQueryOpener />
      </Suspense>
      <Modal open={open} onClose={close} labelledBy="auth-dialog-title">
        <div
          aria-hidden
          className="lp-dialog-wash pointer-events-none absolute inset-x-0 top-0 h-36"
        />
        <IconButton label="Закрыть" onClick={close} className="absolute right-3.5 top-3.5">
          <X aria-hidden className="size-4" strokeWidth={1.75} />
        </IconButton>
        <div className="px-7 pb-8 pt-12">
          <h2
            id="auth-dialog-title"
            className="text-balance text-center text-[1.35rem] font-semibold tracking-tight text-text-primary"
          >
            {intent === "create" ? "Войдите, чтобы создать песню" : "Вход"}
          </h2>
          <p className="mt-2 text-center text-sm leading-relaxed text-text-muted">
            Яндекс или VK, без пароля.
          </p>
          {leaving ? (
            <p role="status" className="mt-8 text-center text-sm text-text-muted">
              Открываем Яндекс
            </p>
          ) : (
            <div className="mt-8 flex flex-col gap-4">
              {configError ? (
                <p role="alert" className="text-center text-sm text-text-muted">
                  {configError}
                </p>
              ) : null}
              <YandexIdButton onClick={startYandex} />
              <div className="flex items-center gap-4" aria-hidden>
                <span className="h-px flex-1 bg-gradient-to-r from-transparent to-overlay/20" />
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-text-dim">
                  или
                </span>
                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-overlay/20" />
              </div>
              <VkIdButton onClick={() => undefined} disabled />
            </div>
          )}
        </div>
      </Modal>
    </OpenAuthContext.Provider>
  );
}
