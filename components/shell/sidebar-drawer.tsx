"use client";

import { X } from "lucide-react";
import { SidebarPanel } from "@/components/shell/sidebar-panel";
import { IconButton } from "@/components/ui/icon-button";
import { Modal } from "@/components/ui/modal";

export function SidebarDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      label="Меню"
      chrome="plain"
      className="lp-sidebar-drawer lg:hidden"
    >
      <div className="relative flex h-full w-[min(18.5rem,calc(100vw-3rem))] flex-col bg-bg-sidebar">
        <IconButton
          label="Закрыть меню"
          onClick={onClose}
          className="absolute right-2 top-3 z-10 size-10 text-text-muted hover:bg-overlay/6"
        >
          <X aria-hidden className="size-5" strokeWidth={1.75} />
        </IconButton>
        <SidebarPanel onNavigate={onClose} />
      </div>
    </Modal>
  );
}
