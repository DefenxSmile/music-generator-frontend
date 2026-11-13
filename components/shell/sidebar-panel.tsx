"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { useOptionalSupportLauncher } from "@/components/support/support-launcher-context";
import { CreditSlot } from "@/components/shell/credit-slot";
import { CollapseButton } from "@/components/shell/collapse-button";
import { APP_NAV } from "@/components/shell/app-nav";
import { ROW } from "@/components/shell/nav-row";
import { SignInSlot } from "@/components/shell/sign-in-slot";
import { Wordmark } from "@/components/shell/wordmark";
import { cn } from "@/utils/cn";
import { isNavActive } from "@/utils/is-nav-active";

export function SidebarPanel({
  collapsed = false,
  onNavigate,
  onToggle,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
  onToggle?: () => void;
}) {
  const pathname = usePathname();
  const support = useOptionalSupportLauncher();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  useEffect(() => {
    setPendingHref(null);
  }, [pathname]);

  const currentPath = pendingHref ?? pathname;

  return (
    <div className="flex h-full min-h-0 w-full flex-col px-2 pb-3 pt-3">
      <div className={cn("relative mb-4 h-10", !onToggle && "flex items-center px-2.5")}>
        <Wordmark
          onNavigate={onNavigate}
          quiet={Boolean(onToggle && collapsed)}
          className={cn(
            onToggle ? "lp-sidebar-mark absolute inset-y-0 left-2.5 right-12" : "min-w-0 flex-1",
          )}
        />
        {onToggle ? (
          <CollapseButton
            collapsed={collapsed}
            onClick={onToggle}
            className="lp-sidebar-toggle absolute top-1"
          />
        ) : null}
      </div>
      <SignInSlot collapsed={collapsed} onNavigate={onNavigate} />
      <nav
        aria-label="Основная навигация"
        className="flex flex-1 flex-col gap-5 overflow-y-auto overflow-x-hidden"
      >
        {APP_NAV.map((group) => (
          <div key={group.label ?? "main"} className="flex flex-col gap-0.5">
            {group.label ? (
              <p
                className={cn(
                  "px-3 pb-1 text-[11px] font-medium uppercase tracking-[0.14em] text-text-dim",
                  collapsed && "sr-only",
                )}
              >
                {group.label}
              </p>
            ) : null}
            {group.items.map((item) => {
              const active = isNavActive(item.href, currentPath);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  title={collapsed ? (item.soon ? `${item.label}, скоро` : item.label) : undefined}
                  onClick={() => {
                    setPendingHref(item.href);
                    onNavigate?.();
                  }}
                  className={cn(
                    ROW,
                    active
                      ? "bg-overlay/10 font-medium text-text-primary"
                      : "text-text-muted hover:bg-overlay/5 hover:text-text-primary",
                    item.soon && !active && "text-text-dim",
                  )}
                >
                  <span className="grid size-5 shrink-0 place-items-center">
                    <Icon aria-hidden className="size-[18px]" strokeWidth={1.75} />
                  </span>
                  <span className="whitespace-nowrap">{item.label}</span>
                  {item.soon ? (
                    <span className="ml-auto text-[10px] font-medium tracking-wide text-text-dim/70">
                      скоро
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      {onNavigate && !onToggle && support ? (
        <button
          type="button"
          className={cn(ROW, "mb-2 text-text-muted hover:bg-overlay/5 hover:text-text-primary")}
          onClick={() => {
            onNavigate();
            support.openSupport();
          }}
        >
          <span className="grid size-5 shrink-0 place-items-center">
            <MessageCircle aria-hidden className="size-[18px]" strokeWidth={1.75} />
          </span>
          <span className="whitespace-nowrap">Поддержка</span>
        </button>
      ) : null}
      <CreditSlot collapsed={collapsed} onNavigate={onNavigate} />
    </div>
  );
}
