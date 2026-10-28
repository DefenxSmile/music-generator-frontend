import { LoaderCircle } from "lucide-react";
import { generationStatusLabel } from "@/utils/generation-status";

/** A song row that is not ready yet: a spinner and two empty lines, without a step list. */
export function GenerationProgress({ status }: { status: string }) {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">{generationStatusLabel(status)}</span>
      <div className="flex items-center gap-3">
        <span className="grid size-14 shrink-0 place-items-center rounded-lg bg-bg-elevated">
          <LoaderCircle aria-hidden className="lp-spin size-5 text-text-muted" strokeWidth={1.75} />
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-2.5">
          <span className="lp-skeleton h-2.5 w-2/3" />
          <span className="lp-skeleton h-2.5 w-5/12" />
        </span>
      </div>
      <p className="mt-4 text-sm text-text-muted">
        Можно закрыть страницу: песня останется в списке.
      </p>
    </div>
  );
}
