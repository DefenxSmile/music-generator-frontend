import type { ReactNode } from "react";

export function DetailMessage({ text, children }: { text: string; children?: ReactNode }) {
  return (
    <div className="rounded-xl border border-border px-4 py-10 text-center">
      <p className="text-sm text-text-muted">{text}</p>
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}
