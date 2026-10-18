import type { ReactNode } from "react";

export function AuthFrame({
  title,
  children,
  footer,
}: {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-col px-4 py-12">
      <h1 className="lp-section-title">{title}</h1>
      <div className="mt-6 rounded-2xl border border-border bg-bg-card p-5 sm:p-6">{children}</div>
      {footer ? <div className="mt-4 text-sm text-text-muted">{footer}</div> : null}
    </main>
  );
}
