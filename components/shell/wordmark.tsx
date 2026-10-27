import { Music2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/cn";

export function Wordmark({
  onNavigate,
  className,
  quiet = false,
}: {
  onNavigate?: () => void;
  className?: string;
  quiet?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="AI Music, создать песню"
      aria-hidden={quiet || undefined}
      tabIndex={quiet ? -1 : undefined}
      inert={quiet ? true : undefined}
      onClick={onNavigate}
      className={cn("flex min-w-0 items-center gap-3 overflow-hidden", className)}
    >
      <span
        aria-hidden
        className="lp-accent-gradient grid size-8 shrink-0 place-items-center rounded-lg"
      >
        <Music2 className="size-4 text-on-accent" />
      </span>
      <span className="whitespace-nowrap text-[0.9375rem] font-semibold tracking-tight text-text-primary">
        AI Music
      </span>
    </Link>
  );
}
