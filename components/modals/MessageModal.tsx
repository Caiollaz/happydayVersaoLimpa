"use client";

import { FullScreenModal } from "./FullScreenModal";

interface MessageModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

/**
 * Reads the full love letter in a Spotify-style full-screen overlay.
 * Paragraphs are split on blank lines.
 */
export function MessageModal({ open, onClose, title, message }: MessageModalProps) {
  const paragraphs = message
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <FullScreenModal open={open} onClose={onClose} label={title}>
      <div className="h-full w-full overflow-y-auto">
        <div className="mx-auto w-full max-w-2xl px-6 pt-24 pb-20 sm:px-10 sm:pt-28">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-spotify-green mb-4">
            Mensagem
          </p>
          <h2 className="text-3xl sm:text-5xl font-black leading-[1.05] text-white tracking-tight mb-10">
            {title}
          </h2>
          <div className="space-y-6 text-lg sm:text-xl leading-relaxed text-spotify-text-secondary">
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className="first:text-white first:text-xl sm:first:text-2xl first:font-medium"
              >
                {p}
              </p>
            ))}
          </div>

          {/* Signature */}
          <div className="mt-14 pt-8 border-t border-white/10">
            <p className="text-sm text-spotify-text-secondary">Com todo meu amor,</p>
            <p className="text-2xl font-bold text-white mt-1">Léo 💚</p>
          </div>
        </div>
      </div>
    </FullScreenModal>
  );
}
