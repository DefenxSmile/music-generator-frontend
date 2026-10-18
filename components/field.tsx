import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const controlClass =
  "w-full rounded-lg border border-border bg-bg-elevated px-3 py-2.5 text-base text-text-primary placeholder:text-text-dim focus:border-border-hover focus:outline-none";

export function TextField({
  label,
  hint,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-text-muted">{label}</span>
      <input className={cn(controlClass, className)} {...props} />
      {hint ? <span className="mt-1.5 block text-xs text-text-dim">{hint}</span> : null}
    </label>
  );
}

export function TextAreaField({
  label,
  hint,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-text-muted">{label}</span>
      <textarea className={cn(controlClass, "min-h-28 resize-y", className)} {...props} />
      {hint ? <span className="mt-1.5 block text-xs text-text-dim">{hint}</span> : null}
    </label>
  );
}

export function FormMessage({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="border-l-2 border-border-hover pl-3 text-sm text-text-primary">
      {children}
    </p>
  );
}
