import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { MediaFrame } from "@/components/ui/media-frame";
import type { Generation } from "@/types/generation";
import { cn } from "@/utils/cn";
import { formatWhen } from "@/utils/format";
import { generationStatusLabel, isActiveGenerationStatus } from "@/utils/generation-status";

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
        <MediaFrame
          toneId={generation.id}
          className={cn("size-11", !ready && !active && "opacity-40")}
        />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[0.9375rem] font-medium text-text-primary">
            {title}
          </span>
          <span className="mt-0.5 flex items-center gap-1.5 text-xs text-text-dim">
            {active ? (
              <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-accent" />
            ) : null}
            <span className={cn(active && "text-text-muted")}>
              {generationStatusLabel(generation.status)}
            </span>
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
