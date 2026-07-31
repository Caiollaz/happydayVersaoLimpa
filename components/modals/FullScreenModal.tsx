"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FullScreenModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Optional background — defaults to Spotify black */
  backgroundClassName?: string;
  /** Hide the default close button if you need a custom one */
  hideCloseButton?: boolean;
  /** Close button color (for dark/light backgrounds) */
  closeButtonClassName?: string;
  label?: string;
}

/**
 * Full-screen modal that covers 100vh/100vw, Spotify-style.
 *   - Locks body scroll while open
 *   - Closes on ESC
 *   - Fade + slight slide-up entrance
 *
 * Used by MessageModal and PhotoCarouselModal.
 */
export function FullScreenModal({
  open,
  onClose,
  children,
  backgroundClassName,
  hideCloseButton = false,
  closeButtonClassName,
  label,
}: FullScreenModalProps) {
  // Lock body scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className={cn(
            "fixed inset-0 z-50 overflow-hidden",
            backgroundClassName ?? "bg-spotify-black",
          )}
        >
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-full w-full"
          >
            {!hideCloseButton && (
              <button
                onClick={onClose}
                aria-label="Fechar"
                className={cn(
                  "absolute top-5 right-5 z-10 safe-top",
                  "grid place-items-center h-10 w-10 rounded-full",
                  "bg-black/40 backdrop-blur-md border border-white/10",
                  "text-white hover:bg-black/60 hover:scale-105 active:scale-95",
                  "transition-all duration-200",
                  closeButtonClassName,
                )}
              >
                <X className="h-5 w-5" strokeWidth={2.5} />
              </button>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
