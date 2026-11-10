"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useOpenAuth } from "@/hooks/use-open-auth";
import { useSessionStatus } from "@/hooks/use-session-status";
import { safeNext } from "@/types/auth-next";
import { isAuthenticated, isSessionLoading } from "@/utils/session-status";

export function AuthQueryOpener() {
  const params = useSearchParams();
  const router = useRouter();
  const openAuth = useOpenAuth();
  const status = useSessionStatus();
  const handled = useRef(false);

  useEffect(() => {
    if (params.get("auth") !== "1" || handled.current || isSessionLoading(status)) return;
    handled.current = true;
    const next = params.get("next");
    const url = new URL(window.location.href);
    url.searchParams.delete("auth");
    url.searchParams.delete("next");
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    if (isAuthenticated(status)) {
      if (next) router.replace(safeNext(next));
      return;
    }
    openAuth(next ? { next } : undefined);
  }, [openAuth, params, router, status]);

  return null;
}
