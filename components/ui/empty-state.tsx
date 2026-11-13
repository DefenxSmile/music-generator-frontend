import { Plus } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

/** Quiet empty surface: optional slot mark, title, one line, one next step. */
export function EmptyState({
  title,
  lead,
  action,
  mark = "none",
  layout = "page",
}: {
  title?: string;
  lead: string;
  action?: ReactNode;
  /** Dashed slot like Release empty — one visual language for empties. */
  mark?: "none" | "slot";
  /** `page` fills the viewport; `panel` fills a workspace card. */
  layout?: "page" | "panel";
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6",
        layout === "page" ? "min-h-[100dvh]" : "lp-studio-idle flex-1 py-12",
      )}
    >
      {mark === "slot" ? (
        <div
          aria-hidden
          className="mb-5 grid size-16 place-items-center rounded-xl border border-dashed border-overlay/22 bg-overlay/[0.03]"
        >
          <span className="grid size-8 place-items-center rounded-full border border-overlay/15">
            <Plus className="size-3.5 text-text-dim" strokeWidth={1.75} />
          </span>
        </div>
      ) : null}
      {title ? <h1 className="text-base font-medium text-text-primary">{title}</h1> : null}
      <p
        className={cn(
          "max-w-xs text-center text-sm text-text-dim",
          title ? "mt-1" : null,
        )}
      >
        {lead}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
