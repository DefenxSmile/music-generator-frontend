"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useMe } from "@/hooks/use-me";
import { useSessionStatus } from "@/hooks/use-session-status";
import { useSignedInHint } from "@/hooks/use-signed-in-hint";
import { cn } from "@/utils/cn";
import { creditsLabel } from "@/utils/credits";
import { showAccountChrome } from "@/utils/session-status";

export function CreditSlot({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const status = useSessionStatus();
  const signedIn = useSignedInHint();
  const me = useMe();
  const account = showAccountChrome(status, signedIn);
  // Guests always see 0 (next-step tile). Signed-in uses /me, with skeleton only while loading.
  const balance = account ? me.data?.balance : 0;
  const known = !account || typeof me.data?.balance === "number";
  const loading =
    account && typeof me.data?.balance !== "number" && (me.isPending || me.isFetching || status === "loading");
  const displayBalance = known ? (balance as number) : 0;
  const empty = known && displayBalance <= 0;
  const word = known ? creditsLabel(displayBalance).replace(/^-?\d+\s/, "") : "кредитов";

  return (
    <div
      className={cn(
        "mt-3 shrink-0 overflow-hidden rounded-xl border border-overlay/6 transition-colors duration-150",
        collapsed ? "px-1.5 py-2" : "px-3 py-2.5",
      )}
    >
      <Link
        href="/plans"
        onClick={onNavigate}
        title={collapsed && known ? creditsLabel(displayBalance) : undefined}
        aria-label={known ? `${creditsLabel(displayBalance)}. Тарифы` : "Тарифы"}
        aria-busy={loading || undefined}
        className={cn(
          "group flex min-w-0 flex-col rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          collapsed && "items-center",
        )}
      >
        {collapsed ? (
          loading ? (
            <span aria-hidden className="h-4 w-6 animate-pulse rounded-md bg-overlay/12" />
          ) : (
            <span className="text-base font-semibold tabular-nums leading-none text-text-primary">
              {displayBalance}
            </span>
          )
        ) : loading ? (
          <>
            <span className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-text-dim">
                Баланс
              </span>
              <ChevronRight aria-hidden className="size-3.5 text-text-dim" strokeWidth={1.75} />
            </span>
            <span aria-hidden className="mt-2.5 h-7 w-16 animate-pulse rounded-md bg-overlay/12" />
            <span aria-hidden className="mt-2 h-3 w-20 animate-pulse rounded-md bg-overlay/8" />
            <span className="mt-3 border-t border-overlay/10 pt-2.5 text-xs text-text-dim">
              К тарифам
            </span>
          </>
        ) : (
          <>
            <span className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-text-dim">
                Баланс
              </span>
              <ChevronRight
                aria-hidden
                className="size-3.5 text-text-dim transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-text-primary"
                strokeWidth={1.75}
              />
            </span>
            <span className="mt-2 text-xl font-semibold tabular-nums leading-none tracking-tight text-text-primary">
              {displayBalance}
            </span>
            <span className="mt-1 text-xs text-text-muted">{word}</span>
            <span className="mt-2.5 border-t border-overlay/6 pt-2 text-xs text-text-dim transition-colors duration-150 group-hover:text-text-primary">
              {empty ? "Пополнить" : "К тарифам"}
            </span>
          </>
        )}
      </Link>
    </div>
  );
}
