"use client";

import { SupportWidget } from "@/components/support/support-widget";
import { useOptionalSupportLauncher } from "@/components/support/support-launcher-context";
import { useMe } from "@/hooks/use-me";

/** Desktop keeps the corner button. The phone opens the same panel from the menu. */
export function SupportWidgetApp() {
  const me = useMe();
  const launcher = useOptionalSupportLauncher();
  if (!launcher) return null;
  return (
    <SupportWidget
      source="app"
      defaultEmail={me.data?.email ?? ""}
      open={launcher.open}
      onOpenChange={launcher.setOpen}
      hideMobileLauncher
    />
  );
}
