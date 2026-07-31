"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardContainerProps {
  id?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Wraps every "content card" on the page (About, Message, Mini, Retro).
 *
 * Sizing: content-sized with consistent vertical padding. We deliberately do
 * NOT force `min-h-[100dvh]` here — doing so would create big dead zones
 * above and below small content cards (~200px of empty black each side),
 * which makes the spacing between consecutive cards feel inconsistent next
 * to the full-screen SpotifyPlayerCard. Uniform padding keeps the gap
 * between cards tight and predictable.
 *
 * Also handles the fade/slide-up entrance animation when scrolled into view.
 */
export function CardContainer({
  id,
  children,
  className,
}: CardContainerProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative w-full flex flex-col items-center",
        "px-5 sm:px-8",
        "py-6 sm:py-8",
        className,
      )}
    >
      {children}
    </motion.section>
  );
}
