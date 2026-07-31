"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { FullScreenModal } from "./FullScreenModal";
import { DynamicGradientBg } from "@/components/ui/DynamicGradientBg";
import { useImagePalette } from "@/hooks/useImagePalette";
import { cn } from "@/lib/utils";

interface PhotoCarouselModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  photos: string[];
}

/**
 * Instagram-style full-screen photo carousel with swipe + keyboard controls,
 * dots indicator, counter, and Spotify-style background that melts to match
 * the current photo's dominant color.
 */
export function PhotoCarouselModal({
  open,
  onClose,
  title,
  photos,
}: PhotoCarouselModalProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const current = photos[index];
  const palette = useImagePalette(open ? current : null);

  const next = useCallback(() => {
    setDirection(1);
    setIndex((i) => (i + 1) % photos.length);
  }, [photos.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setIndex((i) => (i - 1 + photos.length) % photos.length);
  }, [photos.length]);

  // Reset to first photo each time the modal opens
  useEffect(() => {
    if (open) { setIndex(0); setDirection(0); }
  }, [open]);

  // Arrow key navigation
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, next, prev]);

  if (photos.length === 0) return null;

  return (
    <FullScreenModal
      open={open}
      onClose={onClose}
      label={title}
      backgroundClassName="bg-transparent"
    >
      <DynamicGradientBg
        color={palette.darkVibrant}
        bottomColor="#000000"
        className="h-full w-full"
      >
        <div className="flex h-full w-full flex-col">
          {/* Header */}
          <div className="safe-top flex items-center justify-between px-5 pt-5 sm:px-8 sm:pt-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                {title}
              </p>
              <p className="text-sm text-white font-medium mt-0.5 tabular-nums">
                {index + 1} <span className="text-white/50">/ {photos.length}</span>
              </p>
            </div>
            {/* Placeholder to offset the close button from FullScreenModal */}
            <div className="h-10 w-10" aria-hidden />
          </div>

          {/* Photo area */}
          <div className="relative flex-1 flex items-center justify-center px-4 sm:px-8 overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false} custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                variants={{
                  enter: (d: number) => ({ x: `${d * 100}%`, opacity: 0 }),
                  center: { x: "0%", opacity: 1 },
                  exit: (d: number) => ({ x: `${d * -100}%`, opacity: 0 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) next();
                  else if (info.offset.x > 80) prev();
                }}
                className="relative w-full max-w-[520px] aspect-square rounded-2xl overflow-hidden shadow-2xl shadow-black/60 cursor-grab active:cursor-grabbing"
              >
                {/* Using <img> intentionally: static export + user-uploaded photos */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={current}
                  alt={`${title} ${index + 1}`}
                  className="h-full w-full object-cover pointer-events-none select-none"
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>

            {/* Desktop arrows */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={prev}
                  aria-label="Foto anterior"
                  className="hidden sm:grid absolute left-4 top-1/2 -translate-y-1/2 place-items-center h-12 w-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/60 hover:scale-105 active:scale-95 transition-all"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={next}
                  aria-label="Próxima foto"
                  className="hidden sm:grid absolute right-4 top-1/2 -translate-y-1/2 place-items-center h-12 w-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/60 hover:scale-105 active:scale-95 transition-all"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>

          {/* Dots indicator */}
          {photos.length > 1 && (
            <div className="safe-bottom flex items-center justify-center gap-2 pb-8 pt-4">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Ir para foto ${i + 1}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === index ? "w-8 bg-white" : "w-1.5 bg-white/40",
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </DynamicGradientBg>
    </FullScreenModal>
  );
}
