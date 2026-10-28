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
      className={cn("flex min-w-0 items-center overflow-hidden", className)}
    >
      <span className="whitespace-nowrap text-base font-semibold tracking-tight text-text-primary">
        AI Music
      </span>
    </Link>
  );
}
