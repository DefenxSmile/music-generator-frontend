"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** One accent only: `primary` is the gold→coral CTA, the rest are neutral surfaces. */
export type ButtonVariant = "primary" | "outline" | "ghost";
type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  ariaLabel?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "lp-accent-gradient lp-cta text-on-accent font-semibold shadow-[0_10px_30px_-14px_rgba(255,150,60,0.55)] hover:brightness-[1.07]",
  outline:
    "border border-border text-text-primary hover:border-border-hover hover:bg-bg-card",
  ghost: "text-text-muted hover:text-text-primary hover:bg-bg-card",
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: "h-10 px-3 text-[0.8125rem]",
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-[0.9375rem]",
  lg: "px-6 py-3.5 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  children,
  href,
  onClick,
  className = "",
  type = "button",
  disabled = false,
  ariaLabel,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg cursor-pointer transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
    variantClasses[variant],
    sizeClasses[size],
    disabled && "opacity-40 pointer-events-none",
    className,
  );

  if (href && !disabled) {
    const external = /^https?:\/\//i.test(href);
    if (external) {
      return (
        <a href={href} aria-label={ariaLabel} className={classes} rel="noopener noreferrer">
          {children}
          {variant === "primary" && size === "lg" ? <CtaEqualizer /> : null}
        </a>
      );
    }
    return (
      <Link href={href} aria-label={ariaLabel} className={classes}>
        {children}
        {variant === "primary" && size === "lg" ? <CtaEqualizer /> : null}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={classes}
    >
      {children}
      {variant === "primary" && size === "lg" ? <CtaEqualizer /> : null}
    </button>
  );
}

/** Three static bars; they move only on hover of the parent `.lp-cta`. */
function CtaEqualizer() {
  return (
    <span aria-hidden className="lp-eq">
      <span />
      <span />
      <span />
    </span>
  );
}
