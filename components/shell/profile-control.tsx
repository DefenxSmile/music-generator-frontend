"use client";

import { ChevronDown, LogOut } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLogout } from "@/hooks/use-logout";
import { ROW } from "@/components/shell/nav-row";
import { cn } from "@/utils/cn";

function profileInitial(email: string | undefined): string {
  const source = email?.trim();
  return source ? source.slice(0, 1).toUpperCase() : "·";
}

export function ProfileControl({
  email,
  loading = false,
  compact = false,
  collapsed = false,
  onNavigate,
}: {
  email?: string;
  /** Quiet skeleton while `/me` is still resolving after resume. */
  loading?: boolean;
  compact?: boolean;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const logout = useLogout();
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number; width: number } | null>(
    null,
  );
  const known = Boolean(email);
  const showSkeleton = loading && !known;

  useEffect(() => {
    if (!open) return;
    const button = buttonRef.current;
    if (!button) return;
    const box = button.getBoundingClientRect();
    const width = 220;
    const left = compact ? box.right - width : box.right + 8;
    setPosition({
      top: compact ? box.bottom + 6 : box.top,
      left: Math.max(8, Math.min(left, window.innerWidth - width - 8)),
      width,
    });
  }, [open, collapsed, compact]);

  useEffect(() => {
    if (!open) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    function onPointer(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    }

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  async function onLogout() {
    setLeaving(true);
    try {
      await logout();
      setOpen(false);
      onNavigate?.();
    } finally {
      setLeaving(false);
    }
  }

  const label = known ? email : "Профиль";

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        title={known ? email : undefined}
        aria-busy={showSkeleton || undefined}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          compact
            ? "inline-flex h-9 max-w-40 items-center gap-2 rounded-lg border border-overlay/15 bg-overlay/6 px-2.5 text-sm font-medium text-text-primary hover:bg-overlay/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            : cn(
                ROW,
                "mb-4 border border-overlay/15 bg-overlay/6 font-medium text-text-primary hover:bg-overlay/10",
              ),
        )}
      >
        {showSkeleton ? (
          <>
            <span
              aria-hidden
              className="size-5 shrink-0 animate-pulse rounded-full bg-overlay/12"
            />
            <span
              aria-hidden
              className={cn(
                "h-3.5 max-w-[9rem] flex-1 animate-pulse rounded-md bg-overlay/10",
                collapsed && "hidden",
                compact && "min-w-16",
              )}
            />
          </>
        ) : (
          <>
            <span
              aria-hidden
              className="grid size-5 shrink-0 place-items-center rounded-full bg-overlay/10 text-[11px] text-text-primary"
            >
              {profileInitial(email)}
            </span>
            <span className={cn("min-w-0 truncate", collapsed && "sr-only", !known && "invisible")}>
              {label}
            </span>
            {compact ? null : (
              <ChevronDown
                aria-hidden
                className={cn("ml-auto size-4 shrink-0 text-text-dim", collapsed && "hidden")}
                strokeWidth={1.75}
              />
            )}
          </>
        )}
      </button>
      {open && position
        ? createPortal(
            <div
              ref={menuRef}
              id={menuId}
              role="menu"
              aria-label="Профиль"
              style={{ top: position.top, left: position.left, width: position.width }}
              className="fixed z-[80] rounded-lg border border-overlay/10 bg-bg-elevated p-1.5 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.9)]"
            >
              <button
                type="button"
                role="menuitem"
                onClick={onLogout}
                disabled={leaving}
                className="flex h-9 w-full items-center gap-2 rounded-lg px-2.5 text-sm text-text-primary hover:bg-overlay/8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-40"
              >
                <LogOut aria-hidden className="size-4" strokeWidth={1.75} />
                {leaving ? "Выходим…" : "Выйти"}
              </button>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
