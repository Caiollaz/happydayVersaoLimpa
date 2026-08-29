"use client";

import { motion } from "framer-motion";
import type { StoryProps } from "../storiesConfig";
import { useSiteConfig, useText } from "@/lib/config/context";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Slide 3 — "O Porão". Inside-joke slide about their first in-person date:
 * they picked the worst horror movie of the year and neither of them can
 * remember the plot. VHS/parodied-movie-poster aesthetic: Georgia italic
 * title with a hot-pink offset shadow, REC badge in the corner, rating
 * reveal, tagline that lands the emotional beat ("o filme era ruim. a
 * companhia não.").
 */
export function MovieStory(_props: StoryProps) {
  const { retro } = useSiteConfig();
  const t = useText();
  const { eyebrow, title, date, tagline1, tagline2, rating } =
    retro.slides.movie;

  // Render 10 stars: `rating` filled, the rest empty.
  const stars = Array.from({ length: 10 }, (_, i) => (i < rating ? "★" : "☆"));

  return (
    <section className="relative h-full w-full overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(160deg, #2B0B38 0%, #110418 100%)" }}
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-70 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 65% 40% at 50% 18%, rgba(240, 168, 204, 0.28) 0%, rgba(240,168,204,0) 62%)",
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

      {/* REC badge — top-right, camcorder vibe */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.75 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
        className="absolute top-5 right-5 safe-top flex items-center gap-1.5 text-[10px] font-mono text-[#F0A8CC] tracking-wider"
      >
        <motion.span
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity }}
          className="h-1.5 w-1.5 rounded-full bg-[#FF3355]"
        />
        REC · {date}
      </motion.div>

      <div className="relative h-full w-full flex flex-col justify-center items-center px-6 sm:px-10 safe-top safe-bottom">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
          className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#F0A8CC] mb-8"
        >
          {eyebrow}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.95, ease: EASE, delay: 0.55 }}
          className="font-black italic leading-[0.92] tracking-tight text-white text-center"
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "clamp(56px, 13vw, 120px)",
            textShadow: "3px 3px 0 #FF3D78",
          }}
        >
          {title}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 1.15 }}
          className="mt-10 text-center italic text-[#F5C36A] leading-tight"
          style={{ fontSize: "clamp(14px, 3.4vw, 18px)" }}
        >
          <p>{t(tagline1)}</p>
          <p>{t(tagline2)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.75 }}
          transition={{ duration: 0.6, ease: EASE, delay: 1.6 }}
          className="mt-10 flex gap-1.5 text-sm sm:text-base tracking-widest"
          aria-label={`Rating ${rating} of 10`}
        >
          {stars.map((s, i) => (
            <span
              key={i}
              className={i < rating ? "text-[#F5C36A]" : "text-white/30"}
            >
              {s}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
