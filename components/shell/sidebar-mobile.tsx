"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AccountActions } from "@/components/shell/account-actions";
import { SidebarDrawer } from "@/components/shell/sidebar-drawer";
import { Wordmark } from "@/components/shell/wordmark";

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
