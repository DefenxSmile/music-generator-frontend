import type { ReactNode } from "react";

/** A quiet empty page: a title, one line, and one next step. */
export function EmptyState({
  title,
  lead,
  action,
}: {
  title: string;
  lead: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6">
      <h1 className="text-base font-medium text-text-primary">{title}</h1>
      <p className="mt-1 max-w-xs text-center text-sm text-text-dim">{lead}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
