"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/utils/cn";

/** Native dialog. A prop-driven close does not call `onClose` again. */
export function Modal({
  open,
  onClose,
  onClosed,
  labelledBy,
  label,
  className,
  chrome = "card",
  initialFocus,
  dismissable = true,
  onEscape,
  children,
}: {
  open: boolean;
  onClose: () => void;
  onClosed?: () => void;
  labelledBy?: string;
  label?: string;
  className?: string;
  chrome?: "card" | "plain";
  initialFocus?: { readonly current: HTMLElement | null };
  /** Backdrop and Escape stay inside the dialog until the screen closes it. */
  dismissable?: boolean;
  /** When set, Escape does not close the dialog — caller handles the key. */
  onEscape?: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const silent = useRef(false);
  const onClosedRef = useRef(onClosed);
  const onEscapeRef = useRef(onEscape);
  onClosedRef.current = onClosed;
  onEscapeRef.current = onEscape;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (open && !node.open) {
      node.showModal();
      const focusTarget = initialFocus?.current ?? node;
      focusTarget.focus({ preventScroll: true });
    }
    if (!open && node.open) {
      silent.current = true;
      node.close();
    }
  }, [initialFocus, open]);

  return (
    <dialog
      ref={ref}
      className={cn(chrome === "card" && "lp-auth-dialog", className)}
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : label}
      onClose={() => {
        onClosedRef.current?.();
        if (silent.current) {
          silent.current = false;
          return;
        }
        onClose();
      }}
      onCancel={(event) => {
        if (!dismissable) {
          event.preventDefault();
          return;
        }
        if (onEscapeRef.current) {
          event.preventDefault();
          onEscapeRef.current();
        }
      }}
      onClick={(event) => {
        if (!dismissable) return;
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {children}
    </dialog>
  );
}
