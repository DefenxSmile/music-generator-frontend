import { AudioLines, Coins, Library, type LucideIcon } from "lucide-react";

export type AppNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

/** A labeled block appears when a group has a label. Admin pages get their own group. */
export type AppNavGroup = {
  label?: string;
  items: AppNavItem[];
};

export const APP_NAV: AppNavGroup[] = [
  {
    items: [
      { href: "/create", label: "Создать", icon: AudioLines },
      { href: "/generations", label: "Мои песни", icon: Library },
      { href: "/plans", label: "Тарифы", icon: Coins },
    ],
  },
];

export function isNavActive(href: string, pathname: string): boolean {
  const current = pathname.replace(/\/+$/, "") || "/";
  if (href === "/") return current === "/";
  return current === href || current.startsWith(`${href}/`);
}
