"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { SidebarPanel } from "@/components/shell/sidebar-panel";

export function SidebarDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
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
