"use client";

import Link from "next/link";
import { forwardRef, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/utils/cn";

/** One accent only: `primary` is the gold→coral CTA, the rest are neutral surfaces. */
export type ButtonVariant = "primary" | "outline" | "quiet";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  children: ReactNode;
} & Omit<ComponentProps<"button">, "children">;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "lp-accent-gradient lp-cta text-on-accent font-semibold hover:brightness-[1.07]",
  outline: "border border-border text-text-primary hover:border-border-hover hover:bg-bg-card",
  quiet: "text-text-dim hover:text-text-primary",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-[0.9375rem]",
  lg: "px-6 py-3.5 text-base",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    href,
    children,
    className,
    type = "button",
    disabled = false,
    ...props
  },
  ref,
) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg cursor-pointer transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
    variantClasses[variant],
    sizeClasses[size],
    disabled && "pointer-events-none",
    disabled && variant === "primary" && "lp-cta-quiet",
    disabled && variant !== "primary" && "opacity-40",
    className,
  );
  if (href && !disabled) {
    const external = /^https?:\/\//i.test(href);
    if (external) {
      return (
        <a href={href} className={classes} rel="noopener noreferrer">
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button ref={ref} type={type} disabled={disabled} className={classes} {...props}>
      {children}
    </button>
  );
});

export default Button;
