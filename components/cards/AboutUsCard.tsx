"use client";

import { motion } from "framer-motion";
import { CardContainer } from "@/components/layout/CardContainer";
import { CountdownTimer } from "@/components/ui/CountdownTimer";

interface AboutUsCardProps {
  photoSrc: string;
  startDate: Date;
}

/**
 * "Sobre o casal" card — follows the Pencil prototype:
 * a single vertical card with a hero image on top (photo + overlaid title)
 * and a body below containing the couple name and a 3×2 stats grid timer.
 */
export function AboutUsCard({ photoSrc, startDate }: AboutUsCardProps) {
  return (
    <CardContainer id="card-about" className="bg-spotify-black">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[420px] overflow-hidden rounded-2xl bg-spotify-card border border-white/[0.06] shadow-2xl shadow-black/40"
      >
        {/* Hero image */}
        <div
          className="relative h-[280px] w-full"
          style={{
            backgroundImage: `url(${photoSrc})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Top gradient for title legibility */}
          <div
            className="absolute inset-x-0 top-0 h-2/3 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 100%)",
            }}
            aria-hidden
          />
          {/* Bottom gradient so the card meets the body seamlessly */}
          <div
            className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(24,24,24,0) 0%, rgba(24,24,24,0.9) 100%)",
            }}
            aria-hidden
          />

          {/* Title — top-left, matching proto */}
          <div className="relative p-5 safe-top">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Sobre o casal
            </h2>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 p-5">
          {/* Name block */}
          <div className="flex flex-col gap-1">
            <h3 className="text-[22px] font-bold leading-tight text-white tracking-tight">
              Léo <span className="text-spotify-green">&amp;</span> Ana
            </h3>
            <p className="text-sm font-normal text-spotify-text-secondary">
              Juntos desde 2025
            </p>
          </div>

          {/* Stats grid — CountdownTimer renders 3×2 cells */}
          <CountdownTimer startDate={startDate} />
        </div>
      </motion.div>
    </CardContainer>
  );
}
