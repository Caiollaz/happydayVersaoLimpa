"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import type { SpotifyPlayerCardHandle } from "@/components/cards/SpotifyPlayerCard";
import { fadeAudio } from "@/lib/utils";
import { ProgressBars } from "./ProgressBars";
import { STORIES } from "./storiesConfig";
import { useSiteConfig } from "@/lib/config/context";

interface StoryPlayerProps {
  open: boolean;
  onClose: () => void;
  mainPlayerRef: RefObject<SpotifyPlayerCardHandle | null>;
  retroAudioSrc: string;
}

const OPEN_FADE_MS = 900;
const CLOSE_FADE_MS = 700;
const HOLD_THRESHOLD_MS = 180;
const SWIPE_DOWN_THRESHOLD = 80;

/**
 * Full-screen Spotify-Wrapped-style retrospective.
 *
 * State:
 *   currentIndex — which story is active (single source of truth)
 *   isPaused     — true while user is long-pressing (pauses progress + audio)
 *
 * Lifecycle:
 *   open=true  → reset to slide 0, crossfade site audio → retro, play retro
 *   open=false → crossfade retro → site, pause retro
 *
 * Gestures (three invisible zones: 30% / 40% / 30%):
 *   tap left  → prev()
 *   tap right → next()
 *   hold any  → pause while held, resume on release
 *   swipe ↓   → close (drag on outer wrapper with y-only constraint)
 */
export function StoryPlayer({
  open,
  onClose,
  mainPlayerRef,
  retroAudioSrc,
}: StoryPlayerProps) {
  const { slides } = useSiteConfig().retro;

  const audioRef = useRef<HTMLAudioElement>(null);
  const didMount = useRef(false);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHolding = useRef(false);
  const isDragging = useRef(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Slides the couple switched off in the wizard never mount, so the
  // progress bars and the swipe indices line up with what is on screen.
  const stories = useMemo(
    () => STORIES.filter((s) => slides[s.id].enabled),
    [slides],
  );

  const total = stories.length;
  const active = stories[currentIndex];

  const next = useCallback(() => {
    setCurrentIndex((i) => Math.min(i + 1, total - 1));
  }, [total]);

  const prev = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }, []);

  // Audio crossfade tied to `open`.
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    if (open) {
      setCurrentIndex(0);
      setIsPaused(false);
      mainPlayerRef.current?.fadeOut(OPEN_FADE_MS);
      audio.currentTime = 0;
      audio.volume = 0;
      audio.play().catch(() => {
        // Autoplay should be unlocked from the earlier user gesture; fail silent.
      });
      fadeAudio(audio, 1, OPEN_FADE_MS);
    } else {
      fadeAudio(audio, 0, CLOSE_FADE_MS).then(() => {
        audio.pause();
      });
      mainPlayerRef.current?.fadeIn(CLOSE_FADE_MS);
    }
  }, [open, mainPlayerRef]);

  // Pause / resume audio playback while user holds.
  useEffect(() => {
    if (!open) return;
    const audio = audioRef.current;
    if (!audio) return;

    if (isPaused) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
  }, [isPaused, open]);

  // Scroll lock + ESC.
  useEffect(() => {
    if (!open) return;

    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, next, prev]);

  const handleBarComplete = useCallback(() => {
    if (currentIndex < total - 1) {
      next();
    }
    // On the last slide, stop — user closes manually.
  }, [currentIndex, total, next]);

  // Tap / hold handlers — one zone's `data-zone` attr tells us which side.
  const onPointerDown = () => {
    isHolding.current = false;
    holdTimer.current = setTimeout(() => {
      isHolding.current = true;
      setIsPaused(true);
    }, HOLD_THRESHOLD_MS);
  };

  const resolvePointer = (zone: "prev" | "mid" | "next") => {
    // If framer's drag took over, ignore pointer logic.
    if (isDragging.current) return;
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    if (isHolding.current) {
      isHolding.current = false;
      setIsPaused(false);
      return;
    }
    // Was a tap — navigate.
    if (zone === "prev") prev();
    else if (zone === "next") next();
  };

  const cancelHold = () => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    if (isHolding.current) {
      isHolding.current = false;
      setIsPaused(false);
    }
  };

  // Every slide switched off — nothing to play.
  if (!active) return null;

  const ActiveComponent = active.Component;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Retrospectiva"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] overflow-hidden bg-black"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragStart={() => {
              isDragging.current = true;
              // If a hold timer armed, cancel it — swipe intent wins.
              cancelHold();
            }}
            onDragEnd={(_, info) => {
              isDragging.current = false;
              if (info.offset.y > SWIPE_DOWN_THRESHOLD) {
                onClose();
              }
            }}
          >
            {/* The active story — full screen underneath everything. */}
            <div className="absolute inset-0">
              <ActiveComponent
                key={active.id}
                isActive
                onClose={onClose}
              />
            </div>

            {/* Progress bars */}
            <ProgressBars
              total={total}
              currentIndex={currentIndex}
              durationMs={active.durationMs}
              isPaused={isPaused}
              onComplete={handleBarComplete}
            />

            {/* Gesture zones — transparent, above story but below close button */}
            <div className="absolute inset-0 z-20 flex select-none">
              <div
                data-zone="prev"
                className="w-[30%] h-full"
                onPointerDown={onPointerDown}
                onPointerUp={() => resolvePointer("prev")}
                onPointerCancel={cancelHold}
                onPointerLeave={cancelHold}
              />
              <div
                data-zone="mid"
                className="flex-1 h-full"
                onPointerDown={onPointerDown}
                onPointerUp={() => resolvePointer("mid")}
                onPointerCancel={cancelHold}
                onPointerLeave={cancelHold}
              />
              <div
                data-zone="next"
                className="w-[30%] h-full"
                onPointerDown={onPointerDown}
                onPointerUp={() => resolvePointer("next")}
                onPointerCancel={cancelHold}
                onPointerLeave={cancelHold}
              />
            </div>

            {/* Close button — above gesture layer */}
            <button
              onClick={onClose}
              aria-label="Fechar retrospectiva"
              className="absolute top-5 right-5 z-40 safe-top p-2 text-white/90 hover:text-white hover:scale-110 active:scale-95 transition-all"
            >
              <X className="h-6 w-6" strokeWidth={2.5} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <audio ref={audioRef} src={retroAudioSrc} loop preload="auto" />
    </>
  );
}
