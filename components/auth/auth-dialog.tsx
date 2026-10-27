"use client";

import { X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { AuthQueryOpener } from "@/components/auth/auth-query-opener";
import { VkIdButton } from "@/components/auth/vk-id-button";
import { YandexIdButton } from "@/components/auth/yandex-id-button";
import { OpenAuthContext } from "@/hooks/use-open-auth";
import { rememberAuthNext, safeNext } from "@/utils/auth-next";
import { devOauthEnabled, rememberDevOauth } from "@/utils/dev-oauth";
import { javaApiBaseUrl } from "@/utils/java-api";
import type { OpenAuthOptions } from "@/types/auth";
import type { DevOauthProvider } from "@/types/dev-oauth";

export function AuthDialogProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [intent, setIntent] = useState<OpenAuthOptions["intent"]>("enter");
  const [leaving, setLeaving] = useState<DevOauthProvider | null>(null);

  useEffect(() => {
    const node = dialogRef.current;
    if (!node) return;
    if (open && !node.open) {
      node.showModal();
      node.focus({ preventScroll: true });
    }
    if (!open && node.open) node.close();
  }, [open]);

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
    setLeaving(provider);
    setOpen(false);
    if (devOauthEnabled()) {
      rememberDevOauth(provider);
      router.push("/oauth/callback");
      return;
    }
    window.location.assign(`${javaApiBaseUrl()}/api/v1/auth/oauth/${provider}`);
  }

  return (
    <OpenAuthContext.Provider value={openAuth}>
      {children}
      <Suspense fallback={null}>
        <AuthQueryOpener />
      </Suspense>
      <dialog
        ref={dialogRef}
        className="lp-auth-dialog"
        aria-labelledby="auth-dialog-title"
        onClose={close}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div aria-hidden className="lp-dialog-wash pointer-events-none absolute inset-x-0 top-0 h-36" />
        <button
          type="button"
          onClick={close}
          aria-label="Закрыть"
          className="absolute right-3.5 top-3.5 grid size-9 place-items-center rounded-lg text-text-dim transition-colors duration-150 hover:bg-overlay/10 hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-overlay/30"
        >
          <X aria-hidden className="size-4" strokeWidth={1.75} />
        </button>
        <div className="px-7 pb-8 pt-12">
          <h2 id="auth-dialog-title" className="text-balance text-center text-[1.35rem] font-semibold tracking-tight text-text-primary">
            {intent === "create" ? "Войдите, чтобы создать песню" : "Вход"}
          </h2>
          <p className="mt-2 text-center text-sm leading-relaxed text-text-muted">Яндекс или VK, без пароля.</p>
          {leaving ? (
            <p role="status" className="mt-8 text-center text-sm text-text-muted">
              {leaving === "yandex" ? "Открываем Яндекс" : "Открываем VK"}
            </p>
          ) : (
            <div className="mt-8 flex flex-col gap-4">
              <YandexIdButton onClick={() => start("yandex")} />
              <div className="flex items-center gap-4" aria-hidden>
                <span className="h-px flex-1 bg-gradient-to-r from-transparent to-overlay/20" />
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-text-dim">или</span>
                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-overlay/20" />
              </div>
              <VkIdButton onClick={() => start("vk")} />
            </div>
          )}
        </div>
      </dialog>
    </OpenAuthContext.Provider>
  );
}
