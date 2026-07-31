"use client";

import { motion } from "framer-motion";
import type { StoryProps } from "../storiesConfig";
import { RETRO_CONTENT } from "../content";
import { COUPLE_MET_DATE } from "@/lib/dates";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Slide 2 — "Onde começou". The origin date 14 · 02 · 2025 stacked big
 * in gold, with a short contextual line. Deep-rose gradient for a more
 * intimate entry after the loud Intro.
 */
export function WhereStartedStory(_props: StoryProps) {
  const d = COUPLE_MET_DATE;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();

  return (
    <section className="relative h-full w-full overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(160deg, #D94A8C 0%, #8B1538 60%, #15070C 100%)" }}
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-60 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 70% 30%, rgba(255, 200, 220, 0.32) 0%, rgba(255,200,220,0) 60%)",
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

      <div className="relative h-full w-full flex flex-col justify-center px-6 sm:px-10 safe-top safe-bottom">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.25 }}
          className="text-[11px] font-bold uppercase tracking-[0.35em] text-white/80 mb-8"
        >
          Onde começou
        </motion.p>

        <div className="font-black leading-[0.82] tracking-tight text-[#F5C36A]">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
            className="text-[20vw] sm:text-[14vw] md:text-[11rem]"
          >
            {dd}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.75 }}
            className="text-[20vw] sm:text-[14vw] md:text-[11rem] my-1"
          >
            {mm}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 1.0 }}
            className="text-[20vw] sm:text-[14vw] md:text-[11rem]"
          >
            {yyyy}
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: EASE, delay: 1.35 }}
          className="mt-6 text-base sm:text-lg text-white/85 max-w-md leading-snug italic"
        >
          {RETRO_CONTENT.whereStarted.context}
        </motion.p>
      </div>
    </section>
  );
}
