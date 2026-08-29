"use client";

import { motion } from "framer-motion";
import type { StoryProps } from "../storiesConfig";
import { useSiteConfig, useText } from "@/lib/config/context";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Slide 8 — "Foto favorita". Full-bleed photo with a subtle Ken Burns zoom
 * over the 7-second duration. Vignette gradient darkens the top and bottom
 * so the caption (top) and eyebrow (top) stay legible regardless of the
 * underlying image.
 */
export function FavPhotoStory(_props: StoryProps) {
  const { retro } = useSiteConfig();
  const t = useText();
  const slide = retro.slides.favPhoto;
  const src = slide.src;
  const caption = t(slide.caption);

  return (
    <section className="relative h-full w-full overflow-hidden bg-black">
      {/* Ken Burns image */}
      <motion.div
        initial={{ scale: 1.0 }}
        animate={{ scale: 1.08 }}
        transition={{ duration: 7, ease: "linear" }}
        className="absolute inset-0"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={caption} className="h-full w-full object-cover" />
      </motion.div>

      {/* Top + bottom vignette for legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 65%, rgba(0,0,0,0.7) 100%)",
        }}
        aria-hidden
      />

      <div className="relative h-full w-full flex flex-col justify-between px-6 sm:px-10 py-10 safe-top safe-bottom">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
          className="text-[11px] font-bold uppercase tracking-[0.35em] text-white/85"
        >
          {slide.eyebrow}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.9 }}
          className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight max-w-md italic"
        >
          &ldquo;{caption}&rdquo;
        </motion.p>
      </div>
    </section>
  );
}
