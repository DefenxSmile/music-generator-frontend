"use client";

import { LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useOpenAuth } from "@/components/auth/auth-dialog";
import { useLogout, useMe, useSessionStatus } from "@/components/shell/session";
import { cn } from "@/lib/cn";
import { creditsLabel } from "@/lib/credits";

export const ROW =
  "flex h-10 w-full min-w-0 items-center gap-3 overflow-hidden rounded-lg px-2.5 text-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function SignInSlot({ onNavigate }: { onNavigate?: () => void }) {
  const status = useSessionStatus();
  const openAuth = useOpenAuth();

  if (status === "loading") {
    return <span aria-hidden className="lp-skeleton mb-4 block h-10 w-full" />;
  }

  if (status !== "anonymous") return null;

  return (
    <button
      type="button"
      onClick={() => {
        onNavigate?.();
        openAuth();
      }}
      className={cn(ROW, "mb-4 border border-overlay/15 bg-overlay/6 font-medium text-text-primary hover:bg-overlay/10")}
    >
      <span className="grid size-5 shrink-0 place-items-center">
        <LogIn aria-hidden className="size-[18px]" strokeWidth={1.75} />
      </span>
      <span className="whitespace-nowrap">Войти</span>
    </button>
  );
}

export function CreditSlot({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const status = useSessionStatus();
  const me = useMe();
  const logout = useLogout();
  const [leaving, setLeaving] = useState(false);
  const balance = status === "authenticated" ? me.data?.balance : 0;
  const known = balance !== undefined;

  async function onLogout() {
    setLeaving(true);
    try {
      await logout();
      onNavigate?.();
    } finally {
      setLeaving(false);
    }
  }

  return (
    <div className={cn("mt-3 shrink-0 rounded-xl border border-overlay/10 bg-bg/40 p-3", collapsed && "px-1.5 py-2")}>
      {status === "loading" ? (
        <span aria-hidden className={cn("lp-skeleton block rounded-lg", collapsed ? "mx-auto size-10" : "h-10 w-full")} />
      ) : (
        <Link
          href="/plans"
          onClick={onNavigate}
          title={collapsed && known ? creditsLabel(balance) : undefined}
          aria-label={known ? `${creditsLabel(balance)}. Тарифы` : "Тарифы"}
          className={cn(
            "flex min-w-0 flex-col rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
            collapsed && "items-center",
          )}
        >
          <span className="text-lg font-semibold tabular-nums leading-none text-text-primary">{known ? balance : "·"}</span>
          <span className={cn("mt-1 text-[11px] text-text-muted", collapsed && "sr-only")}>
            {known ? creditsLabel(balance).replace(/^-?\d+\s/, "") : "кредитов"}
          </span>
        </Link>
      )}
      {status === "authenticated" ? (
        <button
          type="button"
          onClick={onLogout}
          disabled={leaving}
          aria-label="Выйти"
          className={cn(
            "mt-3 flex h-8 w-full items-center justify-center gap-2 rounded-lg text-xs text-text-muted transition-colors duration-150 hover:bg-overlay/6 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-40",
            collapsed && "mt-2 size-8",
          )}
        >
          <LogOut aria-hidden className="size-3.5" strokeWidth={1.75} />
          <span className={cn(collapsed && "sr-only")}>{leaving ? "Выходим…" : "Выйти"}</span>
        </button>
      ) : null}
    </div>
  );
}

/** Account control for the mobile bar and the header shown without the rail. */
export function AccountActions() {
  const status = useSessionStatus();
  const me = useMe();
  const openAuth = useOpenAuth();

  if (status === "loading") {
    return <span aria-hidden className="lp-skeleton block h-9 w-20" />;
  }

  if (status === "anonymous") {
    return (
      <button
        type="button"
        onClick={() => openAuth()}
        className="inline-flex h-9 items-center rounded-lg border border-overlay/15 px-3 text-sm font-medium text-text-primary transition-colors duration-150 hover:bg-overlay/6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-[0.98]"
      >
        Войти
      </button>
    );
  }

  if (!me.data) {
    return <span aria-hidden className="lp-skeleton block h-9 w-12" />;
  }

  return (
    <Link
      href="/plans"
      aria-label={`Баланс: ${creditsLabel(me.data.balance)}. Тарифы`}
      className="inline-flex h-9 items-center rounded-lg border border-overlay/10 px-3 text-xs font-medium tabular-nums text-text-primary"
    >
      {me.data.balance}
    </Link>
  );
}
