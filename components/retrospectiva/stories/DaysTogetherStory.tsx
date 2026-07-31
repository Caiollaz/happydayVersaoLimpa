"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import type { StoryProps } from "../storiesConfig";
import { COUPLE_MET_DATE, daysBetween } from "@/lib/dates";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Slide 3 — "Dias juntos". Number counts 0 → N with an eased sweep using
 * useMotionValue + animate(). Coral/carmim gradient to echo the Intro warmth
 * but feel distinct.
 */
export function DaysTogetherStory(_props: StoryProps) {
  const [target] = useState(() => daysBetween(COUPLE_MET_DATE, new Date()));
  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) => Math.round(v).toLocaleString("pt-BR"));
  const [rendered, setRendered] = useState("0");

  useEffect(() => {
    const unsub = display.on("change", (v) => setRendered(v));
    const controls = animate(mv, target, {
      duration: 2.8,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => {
      controls.stop();
      unsub();
    };
  }, [mv, display, target]);

  return (
    <section className="relative h-full w-full overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(160deg, #FF6F4A 0%, #C93920 55%, #1E0908 100%)" }}
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-70 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 30% 20%, rgba(255, 210, 180, 0.3) 0%, rgba(255,210,180,0) 60%)",
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

      <div className="relative h-full w-full flex flex-col justify-center items-start px-6 sm:px-10 safe-top safe-bottom">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
          className="text-[11px] font-bold uppercase tracking-[0.35em] text-white/80 mb-6"
        >
          Dias juntos
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.4 }}
          className="text-[28vw] sm:text-[22vw] md:text-[16rem] font-black leading-[0.85] tracking-tighter text-white"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {rendered}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 1.1 }}
          className="mt-5 text-lg sm:text-xl text-white/85 max-w-md leading-snug"
        >
          dias de nós dois
        </motion.p>
      </div>
    </section>
  );
}
