import type { LucideIcon } from "lucide-react";

export type AppNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  soon?: boolean;
};

/** A labeled block appears when a group has a label. Admin pages get their own group. */
export type AppNavGroup = {
  label?: string;
  items: AppNavItem[];
};
