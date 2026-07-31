"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import type { StoryProps } from "../storiesConfig";
import { RETRO_CONTENT } from "../content";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Slide 4 — "Mensagens trocadas". The big real number (47.312) in amber/gold
 * tones, counted up from 0.
 */
export function MessagesStory(_props: StoryProps) {
  const target = RETRO_CONTENT.messages.total;
  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) => Math.round(v).toLocaleString("pt-BR"));
  const [rendered, setRendered] = useState("0");

  useEffect(() => {
    const unsub = display.on("change", (v) => setRendered(v));
    const controls = animate(mv, target, {
      duration: 3.2,
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
        style={{ background: "linear-gradient(160deg, #FFB84D 0%, #D97915 50%, #1E0F05 100%)" }}
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-70 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 10%, rgba(255, 220, 160, 0.35) 0%, rgba(255,220,160,0) 60%)",
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
          className="text-[11px] font-bold uppercase tracking-[0.35em] text-white/85 mb-6"
        >
          Mensagens trocadas
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.4 }}
          className="text-[18vw] sm:text-[14vw] md:text-[11rem] font-black leading-[0.85] tracking-tight text-white"
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
          e nenhuma delas deu conta de explicar o que eu sinto.
        </motion.p>
      </div>
    </section>
  );
}
