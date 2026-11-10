import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export function ProviderButton({
  onClick,
  icon,
  className,
  children,
  disabled = false,
}: {
  onClick: () => void;
  icon: ReactNode;
  className: string;
  children: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      className={cn(
        "relative flex h-14 w-full items-center rounded-lg px-3.5 text-[17px] font-medium leading-none transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2",
        disabled ? "cursor-not-allowed opacity-45" : "",
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute left-3.5 grid size-7 place-items-center"
      >
        {icon}
      </span>
      <span className="w-full text-center">{children}</span>
    </button>
  );
}
