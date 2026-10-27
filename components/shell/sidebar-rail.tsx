"use client";

import { useEffect, useState } from "react";
import { SidebarPanel } from "@/components/shell/sidebar-panel";
import { Sidebar } from "@/components/ui/sidebar";
import { prefixedKey } from "@/utils/storage-prefix";

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
        if (next) document.documentElement.setAttribute("data-sidebar", "collapsed");
        else document.documentElement.removeAttribute("data-sidebar");
      } catch {
        /* storage can be blocked */
      }
      return next;
    });
  }

  return (
    <div
      className="lp-sidebar-rail relative sticky top-0 hidden h-[100dvh] shrink-0 py-3 pl-3 lg:block"
      data-collapsed={collapsed}
    >
      <Sidebar>
        <SidebarPanel collapsed={collapsed} onToggle={toggle} />
      </Sidebar>
    </div>
  );
}
