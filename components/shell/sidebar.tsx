"use client";

import { Menu, Music2, PanelLeft, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AccountActions, CreditSlot, ROW, SignInSlot } from "@/components/shell/sidebar-account";
import { APP_NAV, isNavActive } from "@/components/shell/nav";
import { cn } from "@/lib/cn";
import { prefixedKey } from "@/lib/storage-prefix";

const COLLAPSED_KEY = prefixedKey("sidebar_collapsed");

export function SidebarRail() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(COLLAPSED_KEY) === "1");
    } catch {
      /* storage can be blocked */
    }
  }, []);

  function toggle() {
    setCollapsed((value) => {
      const next = !value;
      try {
        window.localStorage.setItem(COLLAPSED_KEY, next ? "1" : "0");
      } catch {
        /* storage can be blocked */
      }
      return next;
    });
  }

  return (
    <div className="lp-sidebar-rail relative sticky top-0 hidden h-[100dvh] shrink-0 py-3 pl-3 lg:block" data-collapsed={collapsed}>
      <aside className="flex h-full flex-col overflow-hidden rounded-xl border border-overlay/10 bg-bg-sidebar shadow-[0_28px_70px_-36px_rgba(0,0,0,0.9)]">
        <SidebarPanel collapsed={collapsed} onToggle={toggle} />
      </aside>
    </div>
  );
}

export function SidebarMobile() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-overlay/8 bg-bg/80 backdrop-blur-xl lg:hidden">
        <div className="flex h-14 items-center gap-2 px-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Открыть меню"
            className="grid size-10 place-items-center rounded-lg text-text-primary transition-colors duration-150 hover:bg-overlay/6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Menu aria-hidden className="size-5" strokeWidth={1.75} />
          </button>
          <Wordmark />
          <div className="ml-auto">
            <AccountActions />
          </div>
        </div>
      </header>
      <SidebarDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export function AccountHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-overlay/8 bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-3xl items-center gap-3 px-4">
        <Wordmark />
        <div className="ml-auto">
          <AccountActions />
        </div>
      </div>
    </header>
  );
}

function SidebarDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const node = dialogRef.current;
    if (!node) return;
    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();
  }, [open]);

  return (
    <dialog ref={dialogRef} className="lp-sidebar-drawer lg:hidden" aria-label="Меню" onClose={onClose} onClick={onClose}>
      <div
        className="relative flex h-full w-[min(18.5rem,calc(100vw-3rem))] flex-col bg-bg-sidebar"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть меню"
          className="absolute right-2 top-3 z-10 grid size-10 place-items-center rounded-lg text-text-muted transition-colors duration-150 hover:bg-overlay/6 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <X aria-hidden className="size-5" strokeWidth={1.75} />
        </button>
        <SidebarPanel onNavigate={onClose} />
      </div>
    </dialog>
  );
}

function SidebarPanel({
  collapsed = false,
  onNavigate,
  onToggle,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
  onToggle?: () => void;
}) {
  const pathname = usePathname();
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
          className={cn(onToggle ? "lp-sidebar-mark absolute inset-y-0 left-2.5 right-12" : "min-w-0 flex-1")}
        />
        {onToggle ? <CollapseButton collapsed={collapsed} onClick={onToggle} className="lp-sidebar-toggle absolute top-1" /> : null}
      </div>
      <SignInSlot onNavigate={onNavigate} />
      <nav aria-label="Основная навигация" className="flex flex-1 flex-col gap-5 overflow-y-auto overflow-x-hidden">
        {APP_NAV.map((group) => (
          <div key={group.label ?? "main"} className="flex flex-col gap-0.5">
            {group.label ? (
              <p className={cn("px-3 pb-1 text-[11px] font-medium uppercase tracking-[0.14em] text-text-dim", collapsed && "sr-only")}>
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
                  title={collapsed ? item.label : undefined}
                  onClick={() => {
                    setPendingHref(item.href);
                    onNavigate?.();
                  }}
                  className={cn(ROW, active ? "bg-overlay/8 text-text-primary" : "text-text-muted hover:bg-overlay/5 hover:text-text-primary")}
                >
                  <span className="grid size-5 shrink-0 place-items-center">
                    <Icon aria-hidden className="size-[18px]" strokeWidth={1.75} />
                  </span>
                  <span className="whitespace-nowrap">{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <CreditSlot collapsed={collapsed} onNavigate={onNavigate} />
    </div>
  );
}

function CollapseButton({ collapsed, onClick, className }: { collapsed: boolean; onClick?: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={collapsed ? "Развернуть меню" : "Свернуть меню"}
      aria-expanded={!collapsed}
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-lg border border-overlay/15 bg-bg-raised text-text-muted hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-[0.94]",
        className,
      )}
    >
      <PanelLeft aria-hidden className="size-3.5" strokeWidth={1.75} />
    </button>
  );
}

function Wordmark({
  onNavigate,
  className,
  quiet = false,
}: {
  onNavigate?: () => void;
  className?: string;
  quiet?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="AI Music, создать песню"
      aria-hidden={quiet || undefined}
      tabIndex={quiet ? -1 : undefined}
      inert={quiet ? true : undefined}
      onClick={onNavigate}
      className={cn("flex min-w-0 items-center gap-3 overflow-hidden", className)}
    >
      <span aria-hidden className="lp-accent-gradient grid size-8 shrink-0 place-items-center rounded-lg">
        <Music2 className="size-4 text-on-accent" />
      </span>
      <span className="whitespace-nowrap text-[0.9375rem] font-semibold tracking-tight text-text-primary">AI Music</span>
    </Link>
  );
}
