import type { LucideIcon } from "lucide-react";

/** Centered disc, title, and one line. Same frame as «Релиз» and «Создать видео». */
export function EmptyState({
  title,
  lead,
  icon: Icon,
}: {
  title: string;
  lead: string;
  icon: LucideIcon;
}) {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6">
      <span
        aria-hidden
        className="lp-empty-disc grid size-[4.5rem] place-items-center rounded-full text-accent"
      >
        <Icon className="size-6" strokeWidth={1.75} />
      </span>
      <h1 className="mt-4 text-base font-medium text-text-primary">{title}</h1>
      <p className="mt-1 max-w-xs text-center text-sm text-text-dim">{lead}</p>
    </div>
  );
}
