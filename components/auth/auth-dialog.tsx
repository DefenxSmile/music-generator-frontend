"use client";

import { X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useRef, useState, type ReactNode } from "react";
import { AuthQueryOpener } from "@/components/auth/auth-query-opener";
import { VkIdButton } from "@/components/auth/vk-id-button";
import { YandexIdButton } from "@/components/auth/yandex-id-button";
import { IconButton } from "@/components/ui/icon-button";
import { Modal } from "@/components/ui/modal";
import { OpenAuthContext } from "@/hooks/use-open-auth";
import { setAccessToken } from "@/utils/access-token";
import { rememberAuthNext, safeNext, takeAuthNext } from "@/utils/auth-next";
import { DEV_ACCESS_TOKEN, devOauthEnabled, rememberDevOauth } from "@/utils/dev-oauth";
import { javaApiBaseUrl } from "@/utils/java-api";
import type { OpenAuthOptions } from "@/types/auth";
import type { DevOauthProvider } from "@/types/dev-oauth";

export function AuthDialogProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const afterClose = useRef<(() => void) | null>(null);
  const [open, setOpen] = useState(false);
  const [intent, setIntent] = useState<OpenAuthOptions["intent"]>("enter");
  const [leaving, setLeaving] = useState<DevOauthProvider | null>(null);

  function runAfterClose() {
    const next = afterClose.current;
    if (!next) return;
    afterClose.current = null;
    next();
  }

  function openAuth(options?: OpenAuthOptions) {
    rememberAuthNext(safeNext(options?.next ?? pathname));
    setIntent(options?.intent ?? "enter");
    setLeaving(null);
    setOpen(true);
  }

  function close() {
    if (leaving) return;
    setOpen(false);
  }

  function start(provider: DevOauthProvider) {
    if (devOauthEnabled()) {
      afterClose.current = () => {
        rememberDevOauth(provider);
        setAccessToken(DEV_ACCESS_TOKEN);
        router.replace(takeAuthNext());
      };
      setOpen(false);
      return;
    }
    setLeaving(provider);
    setOpen(false);
    window.location.assign(`${javaApiBaseUrl()}/api/v1/auth/oauth/${provider}`);
  }

  return (
    <OpenAuthContext.Provider value={openAuth}>
      {children}
      <Suspense fallback={null}>
        <AuthQueryOpener />
      </Suspense>
      <Modal open={open} onClose={close} onClosed={runAfterClose} labelledBy="auth-dialog-title">
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
              {leaving === "yandex" ? "Открываем Яндекс" : "Открываем VK"}
            </p>
          ) : (
            <div className="mt-8 flex flex-col gap-4">
              <YandexIdButton onClick={() => start("yandex")} />
              <div className="flex items-center gap-4" aria-hidden>
                <span className="h-px flex-1 bg-gradient-to-r from-transparent to-overlay/20" />
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-text-dim">
                  или
                </span>
                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-overlay/20" />
              </div>
              <VkIdButton onClick={() => start("vk")} />
            </div>
          )}
        </div>
      </Modal>
    </OpenAuthContext.Provider>
  );
}
