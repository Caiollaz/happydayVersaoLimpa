"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Highlight } from "@/components/ui/Highlight";
import { useSiteConfig, useText, useDates } from "@/lib/config/context";

interface AnchorCardProps {
  /**
   * Fired when the CTA is clicked. The parent plays the audio and unmounts
   * this overlay so the rest of the experience becomes scrollable.
   */
  onStart?: () => void;
}

/**
 * Landing "screen". Rendered as a full-viewport FIXED overlay on top of the
 * rest of the page — it's not part of the document flow, so once it fades
 * out the user cannot scroll back to it.
 *
 * Mounted only while the user has not clicked the CTA. The click also serves
 * as the "user gesture" that unlocks browser audio autoplay.
 */
export function AnchorCard({ onStart }: AnchorCardProps) {
  const { anchor } = useSiteConfig();
  const t = useText();
  const { gift } = useDates();

  // "05 · 04 · 2026" — the occasion, not today.
  const giftLabel = [
    String(gift.getDate()).padStart(2, "0"),
    String(gift.getMonth() + 1).padStart(2, "0"),
    gift.getFullYear(),
  ].join(" · ");

  const handleStart = () => {
    onStart?.();
  };

  return (
    <motion.section
      id="card-anchor"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 w-full h-[100dvh] flex flex-col items-center justify-center px-6 overflow-hidden bg-spotify-black"
    >
      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 50% 35%, rgba(29,185,84,0.18) 0%, rgba(18,18,18,0) 55%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-spotify-green mb-6"
        >
          {giftLabel}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-6xl md:text-7xl font-black leading-[1.02] tracking-tight text-white"
        >
          <Highlight text={t(anchor.headline)} />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-base sm:text-lg text-spotify-text-secondary max-w-md"
        >
          {t(anchor.subhead)}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10"
        >
          <Button size="lg" onClick={handleStart} className="px-10">
            {t(anchor.ctaLabel)}
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}
