"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-spotify-green text-black font-bold hover:bg-spotify-green-hover hover:scale-[1.04] active:scale-[0.98] active:bg-spotify-green-press shadow-lg shadow-spotify-green/10",
  secondary:
    "bg-white/10 text-white font-semibold hover:bg-white/15 border border-white/15 backdrop-blur-sm",
  ghost:
    "bg-transparent text-spotify-text-secondary font-medium hover:text-white",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-5 py-2 text-sm",
  md: "px-7 py-3 text-base",
  lg: "px-9 py-4 text-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2",
          "rounded-spotify-btn",
          "transition-all duration-200 ease-out",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-spotify-green focus-visible:ring-offset-2 focus-visible:ring-offset-black",
          "disabled:opacity-50 disabled:pointer-events-none",
          "select-none will-change-transform",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
