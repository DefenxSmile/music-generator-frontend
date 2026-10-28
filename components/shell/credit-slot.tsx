"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useMe } from "@/hooks/use-me";
import { useSessionStatus } from "@/hooks/use-session-status";
import { useSignedInHint } from "@/hooks/use-signed-in-hint";
import { cn } from "@/utils/cn";
import { creditsLabel } from "@/utils/credits";

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
  const account = status === "authenticated" || (status === "loading" && signedIn);
  const balance = account ? me.data?.balance : 0;
  const known = balance !== undefined;
  const empty = known && balance <= 0;
  const word = known ? creditsLabel(balance).replace(/^-?\d+\s/, "") : "кредитов";

  return (
    <div
      className={cn(
        "mt-3 shrink-0 overflow-hidden rounded-xl border border-overlay/10 bg-bg-elevated transition-colors duration-150",
        collapsed ? "px-1.5 py-2" : "p-3",
      )}
    >
      <Link
        href="/plans"
        onClick={onNavigate}
        title={collapsed && known ? creditsLabel(balance) : undefined}
        aria-label={known ? `${creditsLabel(balance)}. Тарифы` : "Тарифы"}
        className={cn(
          "group flex min-w-0 flex-col rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          collapsed && "items-center",
        )}
      >
        {collapsed ? (
          <span
            className={cn(
              "text-base font-semibold tabular-nums leading-none text-text-primary",
              !known && "invisible",
            )}
          >
            {known ? balance : 0}
          </span>
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
            <span
              className={cn(
                "mt-2.5 text-[1.75rem] font-semibold tabular-nums leading-none tracking-tight text-text-primary",
                !known && "invisible",
              )}
            >
              {known ? balance : 0}
            </span>
            <span className={cn("mt-1.5 text-xs text-text-muted", !known && "invisible")}>{word}</span>
            <span className="mt-3 border-t border-overlay/10 pt-2.5 text-xs text-text-dim transition-colors duration-150 group-hover:text-text-primary">
              {empty ? "Пополнить" : "К тарифам"}
            </span>
          </>
        )}
      </Link>
    </div>
  );
}
