"use client";

import { motion } from "framer-motion";
import type { StoryProps } from "../storiesConfig";
import { RETRO_CONTENT } from "../content";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Slide 6 — "Nossa música". Rotating vinyl cover centered, title/artist
 * revealing in sequence, iconic verse in italic below. Purple/indigo palette
 * breaks the warm Intro/Days/Messages/Trips streak and primes the dopamine
 * drop for the photo slides that follow.
 */
export function OurSongStory(_props: StoryProps) {
  const { title, artist, coverSrc, verse } = RETRO_CONTENT.song;

  return (
    <section className="relative h-full w-full overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(160deg, #7A4BFF 0%, #2E1B6B 52%, #0A0614 100%)" }}
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-70 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 65% 45% at 50% 35%, rgba(180, 150, 255, 0.35) 0%, rgba(180,150,255,0) 60%)",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />

      <div className="relative h-full w-full flex flex-col justify-center items-center px-6 sm:px-10 safe-top safe-bottom">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
          className="text-[11px] font-bold uppercase tracking-[0.35em] text-white/80 mb-8"
        >
          Nossa música
        </motion.p>

        {/* Vinyl: cover inside a black disc, spinning */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}
          className="relative mb-8"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, ease: "linear", repeat: Infinity }}
            className="relative rounded-full overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            style={{ width: "min(58vw, 260px)", height: "min(58vw, 260px)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverSrc}
              alt={`${title} — ${artist}`}
              className="h-full w-full object-cover"
            />
            {/* Center vinyl hole */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black"
              style={{ width: "14%", height: "14%", boxShadow: "0 0 0 4px rgba(255,255,255,0.08)" }}
              aria-hidden
            />
          </motion.div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 1.0 }}
          className="text-3xl sm:text-4xl font-black text-white text-center leading-tight"
        >
          {title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 1.25 }}
          className="mt-1 text-base sm:text-lg text-white/70"
        >
          {artist}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: EASE, delay: 1.6 }}
          className="mt-6 max-w-xs text-center italic text-white/85 text-sm sm:text-base leading-relaxed"
        >
          &ldquo;{verse}&rdquo;
        </motion.p>
      </div>
    </section>
  );
}
