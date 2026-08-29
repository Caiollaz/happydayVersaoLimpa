"use client";

import { motion } from "framer-motion";
import type { StoryProps } from "../storiesConfig";
import { daysBetween } from "@/lib/config/schema";
import { useSiteConfig, useDates } from "@/lib/config/context";
import { useState } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Slide 9 — "Recap em números". Spotify-green poster with the headline
 * the span of years, the couple names, and a 2x2 grid of highlight stats
 * derived from the same sources used in earlier slides. Shareable-feeling
 * card with rounded blur bloom in the corners.
 */
export function PosterStory(_props: StoryProps) {
  const { retro, couple } = useSiteConfig();
  const { met, gift } = useDates();
  const slide = retro.slides.poster;
  const labels = slide.statLabels;

  const [days] = useState(() => daysBetween(met, new Date()));
  const trips = retro.slides.trips.destinations.length;
  const messages = retro.slides.messages.total.toLocaleString("pt-BR");
  const song = retro.slides.song.title;

  const stats = [
    { label: labels.days,     value: days.toLocaleString("pt-BR") },
    { label: labels.messages, value: messages },
    { label: labels.trips,    value: String(trips).padStart(2, "0") },
    { label: labels.song,     value: song, small: true },
  ];

  return (
    <section className="relative h-full w-full overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(165deg, #1DB954 0%, #0D6B31 52%, #071B0E 100%)" }}
        aria-hidden
      />
      {/* Corner blooms */}
      <div
        className="absolute -top-20 -left-20 h-80 w-80 rounded-full opacity-60 blur-3xl pointer-events-none"
        style={{ background: "#30E167" }}
        aria-hidden
      />
      <div
        className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full opacity-50 blur-3xl pointer-events-none"
        style={{ background: "#F5C36A" }}
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

      <div className="relative h-full w-full flex flex-col justify-center px-6 sm:px-10 safe-top safe-bottom">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
          className="text-[11px] font-bold uppercase tracking-[0.35em] text-white/85 mb-4"
        >
          {slide.eyebrow}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}
          className="text-[14vw] sm:text-[9vw] md:text-7xl font-black leading-[0.9] text-white tracking-tight"
        >
          {met.getFullYear()}{" "}
          <span className="text-[#F5C36A]">→</span> {gift.getFullYear()}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.75 }}
          className="mt-2 text-xl sm:text-2xl font-extrabold text-white/90"
        >
          {couple.authorName} &amp; {couple.recipientName}
        </motion.p>

        <div className="mt-8 grid grid-cols-2 gap-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 1.0 + i * 0.12 }}
              className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 px-4 py-4"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/70">
                {s.label}
              </p>
              <p
                className={
                  s.small
                    ? "mt-1 text-base font-extrabold text-white leading-tight"
                    : "mt-1 text-3xl sm:text-4xl font-black text-white leading-none"
                }
                style={s.small ? undefined : { fontVariantNumeric: "tabular-nums" }}
              >
                {s.value}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
