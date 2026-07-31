"use client";

import { motion } from "framer-motion";
import type { StoryProps } from "../storiesConfig";

/**
 * Slide 1 — the opener. Spotify-Wrapped aesthetic: saturated gradient
 * background, bold eyebrow label, names dominating the screen on stacked
 * lines with a colored "e" connector, subhead underneath. Staggered kinetic
 * entrance (eyebrow → names → sub).
 */
export function IntroStory(_props: StoryProps) {
  return (
    <section className="relative h-full w-full overflow-hidden">
      {/* Base gradient — hot pink → deep rose → near-black burgundy. Direction
       * kept diagonal for a bit of motion in the composition. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, #FF3D78 0%, #C9184A 48%, #1E060F 100%)",
        }}
        aria-hidden
      />

      {/* Radial bloom behind the title, top-left. */}
      <div
        className="absolute inset-0 opacity-70 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 30% 18%, rgba(255, 200, 220, 0.35) 0%, rgba(255,200,220,0) 60%)",
        }}
        aria-hidden
      />

      {/* Grain overlay for texture/depth. */}
      <div
        className="absolute inset-0 opacity-[0.09] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />

      {/* Content: left-aligned, vertically centered. */}
      <div className="relative h-full w-full flex flex-col justify-center px-6 sm:px-10 safe-top safe-bottom">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
          className="text-[11px] font-bold uppercase tracking-[0.35em] text-white/80 mb-7 sm:mb-9"
        >
          Retrospectiva
        </motion.p>

        {/* Names — stacked: Léo / e (gold italic) / Ana */}
        <h1 className="font-black leading-[0.82] tracking-tight text-white">
          <motion.span
            initial={{ opacity: 0, y: 48, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.55 }}
            className="block text-[17vw] sm:text-[14vw] md:text-[11rem]"
          >
            Léo
          </motion.span>
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.9 }}
            className="block italic font-extrabold text-[#F5C36A] text-[9vw] sm:text-[7vw] md:text-[5.5rem] my-1 sm:my-2 ml-[3vw]"
          >
            e
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 48, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 1.05 }}
            className="block text-[17vw] sm:text-[14vw] md:text-[11rem]"
          >
            Ana
          </motion.span>
        </h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 1.5 }}
          className="mt-7 sm:mt-9 text-base sm:text-lg text-white/85 max-w-md leading-snug"
        >
          os momentos que viraram história
        </motion.p>
      </div>
    </section>
  );
}
