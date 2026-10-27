"use client";

import { LogIn } from "lucide-react";
import { useOpenAuth } from "@/hooks/use-open-auth";
import { useMe } from "@/hooks/use-me";
import { useSessionStatus } from "@/hooks/use-session-status";
import { useSignedInHint } from "@/hooks/use-signed-in-hint";
import { ProfileControl } from "@/components/shell/profile-control";
import { ROW } from "@/components/shell/nav-row";
import { cn } from "@/utils/cn";

export function SignInSlot({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const status = useSessionStatus();
  const signedIn = useSignedInHint();
  const me = useMe();
  const openAuth = useOpenAuth();
  const account = status === "authenticated" || (status === "loading" && signedIn);

  if (account) {
    return <ProfileControl email={me.data?.email} collapsed={collapsed} onNavigate={onNavigate} />;
  }

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
