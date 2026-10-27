"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { CtaEqualizer } from "@/components/ui/cta-equalizer";
import { cn } from "@/utils/cn";

/** One accent only: `primary` is the gold→coral CTA, the rest are neutral surfaces. */
export type ButtonVariant = "primary" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "lp-accent-gradient lp-cta text-on-accent font-semibold shadow-accent hover:brightness-[1.07]",
  outline:
    "border border-border text-text-primary hover:border-border-hover hover:bg-bg-card",
};

const sizeClasses: Record<ButtonSize, string> = {
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
        <a href={href} className={classes} rel="noopener noreferrer">
          {children}
          {variant === "primary" && size === "lg" ? <CtaEqualizer /> : null}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
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
      className={classes}
    >
      {children}
      {variant === "primary" && size === "lg" ? <CtaEqualizer /> : null}
    </button>
  );
}
