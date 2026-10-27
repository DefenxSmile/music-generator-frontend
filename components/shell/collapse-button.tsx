import { PanelLeft } from "lucide-react";
import { cn } from "@/utils/cn";

export function CollapseButton({ collapsed, onClick, className }: { collapsed: boolean; onClick?: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={collapsed ? "Развернуть меню" : "Свернуть меню"}
      aria-expanded={!collapsed}
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-lg border border-overlay/15 bg-bg-raised text-text-muted hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        className,
      )}
    >
      <PanelLeft aria-hidden className="size-3.5" strokeWidth={1.75} />
    </button>
  );
}
