"use client";

import Link from "next/link";
import { useMe } from "@/hooks/use-me";
import { useSessionStatus } from "@/hooks/use-session-status";
import { useSignedInHint } from "@/hooks/use-signed-in-hint";
import { cn } from "@/utils/cn";
import { creditsLabel } from "@/utils/credits";

export function CreditSlot({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const status = useSessionStatus();
  const signedIn = useSignedInHint();
  const me = useMe();
  const account = status === "authenticated" || (status === "loading" && signedIn);
  const balance = account ? me.data?.balance : 0;
  const known = balance !== undefined;

  return (
    <div className={cn("mt-3 shrink-0 rounded-xl border border-overlay/10 bg-bg/40 p-3", collapsed && "px-1.5 py-2")}>
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
        <span className={cn("text-lg font-semibold tabular-nums leading-none text-text-primary", !known && "invisible")}>
          {known ? balance : 0}
        </span>
        <span className={cn("mt-1 text-[11px] text-text-muted", collapsed && "sr-only", !known && "invisible")}>
          {known ? creditsLabel(balance).replace(/^-?\d+\s/, "") : "кредитов"}
        </span>
      </Link>
    </div>
  );
}
