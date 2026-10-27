import type { ReactNode } from "react";
export function FormMessage({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="border-l-2 border-border-hover pl-3 text-sm text-text-primary">
      {children}
    </p>
  );
}
