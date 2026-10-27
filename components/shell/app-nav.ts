import { AudioLines, Clapperboard, Coins, Disc3, House, Library } from "lucide-react";
import type { AppNavGroup } from "@/types/nav";
/** A labeled block appears when a group has a label. Admin pages get their own group. */
export const APP_NAV: AppNavGroup[] = [
  {
    items: [
      { href: "/", label: "Главная", icon: House },
      { href: "/create", label: "Создать", icon: AudioLines },
      { href: "/generations", label: "Мои песни", icon: Library },
      { href: "/video", label: "Создать видео", icon: Clapperboard, soon: true },
      { href: "/release", label: "Релиз", icon: Disc3, soon: true },
      { href: "/plans", label: "Тарифы", icon: Coins },
    ],
  },
];
