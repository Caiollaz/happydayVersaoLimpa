"use client";

import { motion } from "framer-motion";
import type { StoryProps } from "../storiesConfig";
import { useSiteConfig, useText } from "@/lib/config/context";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Slide 8 — "Fotos guardadas". Number is the hero ("412+"); behind it, a
 * wallpaper of 12 floating thumbs drifts to keep the slide alive even while
 * static. The 12 slots are deterministic (top/left/size/delay/rot fixed),
 * spread around the edges to avoid colliding with the central number.
 * Slots #11 and #12 sit closer to center but are smaller and dimmer so
 * they don't fight for attention.
 */

interface Slot {
  top: string;
  left: string;
  size: number;
  rot: number;
  delay: number;
  opacity: number;
}

const SLOTS: Slot[] = [
  { top: "6%",  left: "4%",  size: 92, rot: -8,  delay: 0.20, opacity: 0.55 },
  { top: "10%", left: "72%", size: 106, rot: 6,  delay: 0.28, opacity: 0.55 },
  { top: "24%", left: "6%",  size: 82, rot: 10,  delay: 0.36, opacity: 0.55 },
  { top: "28%", left: "80%", size: 88, rot: -6,  delay: 0.44, opacity: 0.55 },
  { top: "44%", left: "2%",  size: 94, rot: 4,   delay: 0.52, opacity: 0.55 },
  { top: "48%", left: "76%", size: 100, rot: -10, delay: 0.60, opacity: 0.55 },
  { top: "66%", left: "4%",  size: 90, rot: 8,   delay: 0.68, opacity: 0.55 },
  { top: "70%", left: "78%", size: 96, rot: -4,  delay: 0.76, opacity: 0.55 },
  { top: "84%", left: "8%",  size: 84, rot: 6,   delay: 0.84, opacity: 0.55 },
  { top: "86%", left: "64%", size: 92, rot: -8,  delay: 0.92, opacity: 0.55 },
  { top: "18%", left: "40%", size: 70, rot: 12,  delay: 1.00, opacity: 0.35 },
  { top: "78%", left: "40%", size: 70, rot: -12, delay: 1.08, opacity: 0.35 },
];

export function PhotosCountStory(_props: StoryProps) {
  const { retro } = useSiteConfig();
  const t = useText();
  const slide = retro.slides.photos;
  const { countLabel, collage } = slide;

  return (
    <section className="relative h-full w-full overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(160deg, #FF69B4 0%, #8B2762 55%, #170711 100%)" }}
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-65 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255, 210, 230, 0.3) 0%, rgba(255,210,230,0) 60%)",
        }}
        aria-hidden
      />

      {SLOTS.map((slot, i) => {
        const src = collage[i];
        if (!src) return null;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.6, rotate: slot.rot }}
            animate={{
              opacity: slot.opacity,
              scale: 1,
              rotate: [slot.rot, slot.rot + 3, slot.rot - 2, slot.rot],
              y: [0, -6, 4, 0],
            }}
            transition={{
              opacity: { duration: 0.8, ease: EASE, delay: slot.delay },
              scale:   { duration: 0.8, ease: EASE, delay: slot.delay },
              rotate:  { duration: 7, ease: "easeInOut", repeat: Infinity, delay: slot.delay },
              y:       { duration: 6, ease: "easeInOut", repeat: Infinity, delay: slot.delay },
            }}
            className="absolute rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
            style={{
              top: slot.top,
              left: slot.left,
              width: slot.size,
              height: slot.size,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" />
          </motion.div>
        );
      })}

      <div
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />

      <div className="relative h-full w-full flex flex-col justify-center items-center px-6 safe-top safe-bottom">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
          className="text-[11px] font-bold uppercase tracking-[0.35em] text-white/85 mb-4"
        >
          {slide.eyebrow}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.45 }}
          className="text-[36vw] sm:text-[26vw] md:text-[18rem] font-black leading-[0.85] tracking-tighter text-white drop-shadow-[0_6px_20px_rgba(0,0,0,0.35)]"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {countLabel}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 1.1 }}
          className="mt-4 text-base sm:text-lg text-white/90 max-w-md text-center"
        >
          {t(slide.caption)}
        </motion.p>
      </div>
    </section>
  );
}
