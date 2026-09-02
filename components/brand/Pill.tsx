import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

const TONES = {
  solid: "bg-brand-lav text-brand-ink hover:bg-brand-lav-deep",
  ghost: "bg-brand-mist text-brand-slate hover:bg-brand-lav/70 hover:text-brand-ink",
  paper: "bg-brand-paper text-brand-ink hover:bg-brand-lav",
  ink: "bg-brand-ink text-white hover:bg-brand-ink/85",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";

type Tone = keyof typeof TONES;

interface PillProps extends Omit<ComponentProps<typeof Link>, "className" | "children"> {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}

export function Pill({ children, tone = "solid", className, ...rest }: PillProps) {
  return (
    <Link className={cn(BASE, TONES[tone], className)} {...rest}>
      {children}
    </Link>
  );
}

interface PillButtonProps extends Omit<ComponentProps<"button">, "className" | "children"> {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}

export function PillButton({
  children,
  tone = "solid",
  className,
  type = "button",
  ...rest
}: PillButtonProps) {
  return (
    <button type={type} className={cn(BASE, TONES[tone], className)} {...rest}>
      {children}
    </button>
  );
}
