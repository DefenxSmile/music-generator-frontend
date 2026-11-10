"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AccountHeader } from "@/components/shell/account-header";
import { SessionResumeBanner } from "@/components/shell/session-resume-banner";
import { SidebarMobile } from "@/components/shell/sidebar-mobile";
import { SidebarRail } from "@/components/shell/sidebar-rail";
import { useSessionStatus } from "@/hooks/use-session-status";
import { isAuthenticated } from "@/utils/session-status";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const current = pathname.replace(/\/+$/, "") || "/";
  const status = useSessionStatus();
  const onAuthStep =
    current === "/auth" || current.startsWith("/auth/") || current.startsWith("/oauth/");
  const showNav = !onAuthStep;
  const showAccount = onAuthStep && isAuthenticated(status);

  return (
    <div className="flex min-h-[100dvh]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[100] focus:rounded-lg focus:bg-bg-card focus:px-3 focus:py-2 focus:text-sm"
      >
        Перейти к содержимому
      </a>
      {showNav ? <SidebarRail /> : null}
      <div className="flex min-w-0 flex-1 flex-col">
        {showNav ? <SidebarMobile /> : null}
        {showAccount ? <AccountHeader /> : null}
        {showNav ? <SessionResumeBanner /> : null}
        <div id="main-content" className="min-w-0 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
