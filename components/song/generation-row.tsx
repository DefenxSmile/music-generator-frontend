import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { formatWhen } from "@/lib/format";
import { generationStatusLabel, isActiveGenerationStatus } from "@/lib/song/generation-status";
import { songCoverStyle } from "@/lib/song/song-visual";
import type { Generation } from "@/lib/api/generations";

export function GenerationRow({
  generation,
  href,
  selected = false,
}: {
  generation: Generation;
  href: string;
  selected?: boolean;
}) {
  const title = generation.caption?.trim() || generation.prompt;
  const active = isActiveGenerationStatus(generation.status);
  const ready = generation.status === "READY";
  const created = formatWhen(generation.createdAt);

  return (
    <li>
      <Link
        href={href}
        aria-current={selected ? "page" : undefined}
        className={cn(
          "group flex items-center gap-3 px-3 py-3 transition-colors duration-150 hover:bg-bg-card-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent sm:gap-4 sm:px-4",
          selected && "bg-overlay/6",
        )}
      >
        <span
          aria-hidden
          style={songCoverStyle(generation.id)}
          className={cn(
            "size-11 shrink-0 rounded-lg shadow-[inset_0_1px_0_color-mix(in_srgb,var(--color-overlay)_18%,transparent)]",
            !ready && !active && "opacity-40 grayscale",
          )}
        />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[0.9375rem] font-medium text-text-primary">{title}</span>
          <span className="mt-0.5 flex items-center gap-1.5 text-xs text-text-dim">
            {active ? <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-accent" /> : null}
            <span className={cn(active && "text-text-muted")}>{generationStatusLabel(generation.status)}</span>
            {created ? <span aria-hidden>·</span> : null}
            {created ? <span className="truncate">{created}</span> : null}
          </span>
        </span>
        <ChevronRight
          aria-hidden
          className="size-4 shrink-0 text-text-dim transition-transform duration-150 group-hover:translate-x-0.5"
        />
      </Link>
    </li>
  );
}

export function GenerationRowsSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <ul aria-busy="true" aria-label="Загружаем песни" className="divide-y divide-border">
      {Array.from({ length: rows }, (_, index) => (
        <li key={index} className="flex items-center gap-3 px-3 py-3 sm:gap-4 sm:px-4">
          <span className="lp-skeleton size-11 shrink-0" />
          <span className="flex-1">
            <span className="lp-skeleton block h-4 w-2/3" />
            <span className="lp-skeleton mt-2 block h-3 w-1/3" />
          </span>
        </li>
      ))}
    </ul>
  );
}
