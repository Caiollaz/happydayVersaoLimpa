"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { StoryProps } from "../storiesConfig";
import { useSiteConfig, useText } from "@/lib/config/context";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Slide 10 — the final, static slide. The progress bar stops here (enforced
 * by StoryPlayer's handleBarComplete no-op on the last index); the user
 * leaves via the explicit "voltar" button, swipe down, X, or ESC. This is
 * the only slide that receives/uses `onClose`.
 */
export function WhatsNextStory({ onClose }: StoryProps) {
  const { retro } = useSiteConfig();
  const t = useText();
  const slide = retro.slides.whatsNext;
  const { backLabel } = slide;
  const phrase = t(slide.phrase);

  return (
    <section className="relative h-full w-full overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(175deg, #FF3D78 0%, #5A0D2A 55%, #07020A 100%)" }}
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-70 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(255, 200, 220, 0.3) 0%, rgba(255,200,220,0) 65%)",
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
          transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
          className="text-[11px] font-bold uppercase tracking-[0.35em] text-white/80 mb-8"
        >
          {slide.eyebrow}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.6 }}
          className="text-[12vw] sm:text-[9vw] md:text-7xl font-black leading-[0.92] text-white tracking-tight max-w-xl"
        >
          {phrase}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 1.5 }}
          className="mt-12"
        >
          <button
            type="button"
            onClick={() => onClose?.()}
            className="group inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 backdrop-blur-sm px-5 py-3 text-white text-sm font-semibold hover:bg-white/15 hover:border-white/40 active:scale-[0.97] transition-all"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" strokeWidth={2.5} />
            {backLabel}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
