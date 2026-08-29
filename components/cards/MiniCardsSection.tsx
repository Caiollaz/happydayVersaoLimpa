"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CardContainer } from "@/components/layout/CardContainer";
import { PhotoCarouselModal } from "@/components/modals/PhotoCarouselModal";
import { useSiteConfig } from "@/lib/config/context";

/**
 * "Conheça <autor> e <destinatária>" — follows the Pencil prototype:
 * a single outer card containing a horizontal gallery of 3 mini-cards,
 * each one a clickable thumbnail that opens a full-screen photo carousel.
 */
export function MiniCardsSection() {
  const { galleries: items, couple } = useSiteConfig();
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = items.find((i) => i.id === activeId) ?? null;

  // Nothing to show if the couple removed every album.
  if (items.length === 0) return null;

  return (
    <>
      <CardContainer id="card-mini" className="bg-spotify-black">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[460px] rounded-2xl bg-spotify-card border border-white/[0.06] p-5 shadow-2xl shadow-black/40"
        >
          {/* Inline title — the author's name highlighted in Spotify green */}
          <h2 className="flex flex-wrap items-center gap-x-1.5 text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
            <span>Conheça</span>
            <span className="text-spotify-green">{couple.authorName}</span>
            <span>e</span>
            <span>{couple.recipientName}</span>
          </h2>

          {/* Gallery — 3 mini-cards side by side, fill container */}
          <div className="mt-4 flex gap-2.5 h-[180px]">
            {items.map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.6,
                  delay: 0.2 + i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveId(item.id)}
                aria-label={`Abrir galeria: ${item.title}`}
                className="group relative flex-1 min-w-0 rounded-xl overflow-hidden bg-spotify-card-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-spotify-green focus-visible:ring-offset-2 focus-visible:ring-offset-spotify-card"
              >
                {/* Background image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                  draggable={false}
                />

                {/* Bottom fade for label legibility */}
                <div
                  className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%)",
                  }}
                  aria-hidden
                />

                {/* Label bottom-left */}
                <span className="absolute bottom-2.5 left-2.5 right-2.5 text-[11px] sm:text-[13px] font-bold text-white leading-tight">
                  {item.title}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </CardContainer>

      <PhotoCarouselModal
        open={active !== null}
        onClose={() => setActiveId(null)}
        title={active?.title ?? ""}
        photos={active?.photos ?? []}
      />
    </>
  );
}
