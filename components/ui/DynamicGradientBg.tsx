"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DynamicGradientBgProps {
  /** Top color of the vertical gradient (typically the dominant image color) */
  color: string;
  /** Optional bottom color. Defaults to the Spotify black for Spotify-like fade */
  bottomColor?: string;
  children?: ReactNode;
  className?: string;
}

/**
 * Spotify-style background gradient that smoothly animates when `color`
 * changes. Used behind the player card — as the cover photo changes, the
 * background melts into the new dominant color.
 */
export function DynamicGradientBg({
  color,
  bottomColor = "#121212",
  children,
  className,
}: DynamicGradientBgProps) {
  return (
    <motion.div
      className={cn("relative overflow-hidden", className)}
      animate={{
        background: `linear-gradient(180deg, ${color} 0%, ${mix(color, bottomColor, 0.45)} 35%, ${bottomColor} 80%)`,
      }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Subtle noise/grain overlay for depth */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.8'/%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />
      {children}
    </motion.div>
  );
}

/** Mixes two hex colors by a given ratio (0 = color1, 1 = color2). */
function mix(c1: string, c2: string, ratio: number): string {
  const a = hexToRgb(c1);
  const b = hexToRgb(c2);
  if (!a || !b) return c1;
  const r = Math.round(a.r * (1 - ratio) + b.r * ratio);
  const g = Math.round(a.g * (1 - ratio) + b.g * ratio);
  const bl = Math.round(a.b * (1 - ratio) + b.b * ratio);
  return `rgb(${r}, ${g}, ${bl})`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return null;
  const num = parseInt(clean, 16);
  if (Number.isNaN(num)) return null;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}
