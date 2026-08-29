"use client";

import { motion } from "framer-motion";
import { Disc3 } from "lucide-react";
import { CardContainer } from "@/components/layout/CardContainer";
import { Button } from "@/components/ui/Button";
import { useSiteConfig } from "@/lib/config/context";

interface RetrospectivaCardProps {
  /** Fired when the user clicks "Vamos lá" — opens the StoryPlayer overlay. */
  onStart?: () => void;
}

/**
 * Entry card for the Spotify-Wrapped-style retrospective. The button opens
 * the full-screen <StoryPlayer /> (mounted in app/page.tsx).
 */
export function RetrospectivaCard({ onStart }: RetrospectivaCardProps) {
  const { retroCard } = useSiteConfig();

  return (
    <CardContainer id="card-retrospectiva">
      <div className="relative w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden shadow-2xl shadow-black/60"
          style={{
            background:
              "linear-gradient(135deg, #FF3D78 0%, #C9184A 48%, #1E060F 100%)",
          }}
        >
          {/* Decorative orbs — warm bloom, matches the IntroStory palette */}
          <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
          <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-[#FF3D78]/40 blur-3xl" />

          {/* Grain overlay */}
          <div
            className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />

          {/* Content */}
          <div className="relative h-full w-full flex flex-col justify-between p-6 sm:p-8 text-white">
            <div className="flex items-center gap-2">
              <Disc3 className="h-5 w-5" strokeWidth={2.25} />
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em]">
                {retroCard.eyebrow}
              </span>
            </div>

            <div>
              <h2 className="text-[2rem] sm:text-5xl md:text-6xl font-black leading-[0.95] tracking-tight">
                <span className="text-[#F5C36A]">{retroCard.titleTop}</span>
                <br />
                {retroCard.titleBottom}
              </h2>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-white/85 max-w-xs">
                {retroCard.description}
              </p>
            </div>

            <div>
              <Button
                variant="secondary"
                size="sm"
                onClick={onStart}
                className="bg-white text-black hover:bg-white/90 border-transparent shadow-xl sm:px-7 sm:py-3 sm:text-base"
              >
                {retroCard.ctaLabel}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </CardContainer>
  );
}
