"use client";

import { motion } from "framer-motion";
import {
  Heart,
  MoreHorizontal,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  ChevronDown,
} from "lucide-react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { DynamicGradientBg } from "@/components/ui/DynamicGradientBg";
import { useImagePalette } from "@/hooks/useImagePalette";
import { cn, fadeAudio, formatTime } from "@/lib/utils";

export interface SpotifyPlayerCardHandle {
  play: () => void;
  pause: () => void;
  /** Fades volume to 0 then pauses. Resolves when done. */
  fadeOut: (durationMs?: number) => Promise<void>;
  /** Resumes playback and fades volume up to 1. Resolves when done. */
  fadeIn: (durationMs?: number) => Promise<void>;
}

interface SpotifyPlayerCardProps {
  audioSrc: string;
  title: string;
  artist: string;
  /** Rotating cover photos. prev/next cycles through these. */
  covers: string[];
}

/**
 * Pixel-close recreation of the Spotify mobile "Now Playing" screen.
 *   - Plays a real audio file on loop
 *   - Prev/Next buttons rotate the COVER PHOTO only (not the track)
 *   - Background is a vertical gradient adapted to the current cover's
 *     dominant color, with smooth crossfade between photos
 */
export const SpotifyPlayerCard = forwardRef<
  SpotifyPlayerCardHandle,
  SpotifyPlayerCardProps
>(({ audioSrc, title, artist, covers }, ref) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const coverStripRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [coverIndex, setCoverIndex] = useState(0);
  const [coverWidth, setCoverWidth] = useState(0);
  const [liked, setLiked] = useState(true);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(true);

  const currentCover = covers[coverIndex] ?? "";
  const palette = useImagePalette(currentCover);

  // Track the cover strip's container width so the Instagram-style filmstrip
  // can translate by the exact pixel amount per index.
  useEffect(() => {
    const el = coverStripRef.current;
    if (!el) return;
    const update = () => setCoverWidth(el.getBoundingClientRect().width);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Expose imperative controls so parent can unlock autoplay and orchestrate
  // audio handoff with the Retrospectiva's own track.
  useImperativeHandle(ref, () => ({
    play: () => {
      audioRef.current?.play().catch(() => {
        // Browsers may still block if there's no gesture — fail silent
      });
    },
    pause: () => audioRef.current?.pause(),
    fadeOut: async (durationMs = 900) => {
      const audio = audioRef.current;
      if (!audio) return;
      await fadeAudio(audio, 0, durationMs);
      audio.pause();
    },
    fadeIn: async (durationMs = 900) => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.play().catch(() => {});
      await fadeAudio(audio, 1, durationMs);
    },
  }));

  // Sync audio state → React state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  }, []);

  // Non-circular navigation so the filmstrip animation stays smooth (wrapping
  // would cause the strip to sweep across every photo on a single press).
  const nextCover = () =>
    setCoverIndex((i) => Math.min(i + 1, covers.length - 1));
  const prevCover = () => setCoverIndex((i) => Math.max(i - 1, 0));

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Number(e.target.value);
  };

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section
      id="card-player"
      className="relative w-full min-h-[100dvh] overflow-hidden"
    >
      <DynamicGradientBg
        color={palette.darkVibrant}
        bottomColor="#121212"
        className="absolute inset-0"
      />

      <div className="relative z-10 flex min-h-[100dvh] w-full items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-md flex flex-col">
          {/* Top bar — mimics Spotify's "Now Playing" header */}
          <div className="flex items-center justify-between text-white safe-top">
            <button
              aria-label="Minimizar"
              className="p-2 -ml-2 opacity-80 hover:opacity-100 transition-opacity"
            >
              <ChevronDown className="h-6 w-6" strokeWidth={2.5} />
            </button>
            <div className="flex flex-col items-center">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-semibold">
                Tocando de
              </p>
              <p className="text-xs font-semibold text-white">Nossa playlist</p>
            </div>
            <button
              aria-label="Opções"
              className="p-2 -mr-2 opacity-80 hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-6 w-6" strokeWidth={2.5} />
            </button>
          </div>

          {/* Cover art — Instagram-feed-style horizontal filmstrip. Dragging
           * reveals the neighboring cover, snapping to the nearest on release. */}
          <div
            ref={coverStripRef}
            className="mt-10 sm:mt-12 relative aspect-square w-full overflow-hidden rounded-md shadow-2xl shadow-black/60"
          >
            <motion.div
              className="flex h-full will-change-transform"
              drag={covers.length > 1 ? "x" : false}
              dragConstraints={{
                left: -Math.max(covers.length - 1, 0) * coverWidth,
                right: 0,
              }}
              dragElastic={0.15}
              animate={{ x: -coverIndex * coverWidth }}
              transition={{ type: "spring", stiffness: 320, damping: 38 }}
              onDragEnd={(_, info) => {
                // Trigger on either offset (slow drag) or velocity (flick).
                const offsetThreshold = 55;
                const velocityThreshold = 350;
                if (
                  info.offset.x < -offsetThreshold ||
                  info.velocity.x < -velocityThreshold
                ) {
                  nextCover();
                } else if (
                  info.offset.x > offsetThreshold ||
                  info.velocity.x > velocityThreshold
                ) {
                  prevCover();
                }
              }}
            >
              {covers.map((src, i) => (
                <div key={i} className="relative h-full w-full shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`Capa ${i + 1}`}
                    className="h-full w-full object-cover pointer-events-none select-none"
                    draggable={false}
                  />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Title + artist + heart */}
          <div className="mt-8 flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="text-2xl font-bold text-white tracking-tight truncate">
                {title}
              </h3>
              <p className="text-sm text-white/70 truncate mt-1">{artist}</p>
            </div>
            <button
              onClick={() => setLiked((v) => !v)}
              aria-label={liked ? "Descurtir" : "Curtir"}
              aria-pressed={liked}
              className="shrink-0 p-2 transition-transform hover:scale-110 active:scale-95"
            >
              <Heart
                className={cn(
                  "h-7 w-7 transition-colors",
                  liked
                    ? "fill-spotify-green text-spotify-green"
                    : "text-white/80",
                )}
                strokeWidth={2}
              />
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-6">
            <div className="relative h-1 rounded-full bg-white/20 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-white rounded-full"
                style={{ width: `${progressPct}%` }}
              />
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.1}
                value={currentTime}
                onChange={handleSeek}
                aria-label="Progresso"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <div className="mt-2 flex justify-between text-[11px] font-medium text-white/70 tabular-nums">
              <span>{formatTime(currentTime)}</span>
              <span>-{formatTime(Math.max(0, duration - currentTime))}</span>
            </div>
          </div>

          {/* Transport controls */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => setShuffle((v) => !v)}
              aria-label="Shuffle"
              aria-pressed={shuffle}
              className="p-2 transition-transform hover:scale-110 active:scale-95"
            >
              <Shuffle
                className={cn(
                  "h-5 w-5 transition-colors",
                  shuffle ? "text-spotify-green" : "text-white/80",
                )}
                strokeWidth={2.25}
              />
            </button>
            <button
              onClick={prevCover}
              aria-label="Foto anterior"
              className="p-2 transition-transform hover:scale-110 active:scale-90"
            >
              <SkipBack
                className="h-8 w-8 fill-white text-white"
                strokeWidth={1.5}
              />
            </button>
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? "Pausar" : "Reproduzir"}
              className="grid place-items-center h-16 w-16 rounded-full bg-white text-black shadow-2xl shadow-black/40 hover:scale-105 active:scale-95 transition-transform"
            >
              {isPlaying ? (
                <Pause className="h-7 w-7 fill-black" strokeWidth={1.5} />
              ) : (
                <Play
                  className="h-7 w-7 fill-black translate-x-[1px]"
                  strokeWidth={1.5}
                />
              )}
            </button>
            <button
              onClick={nextCover}
              aria-label="Próxima foto"
              className="p-2 transition-transform hover:scale-110 active:scale-90"
            >
              <SkipForward
                className="h-8 w-8 fill-white text-white"
                strokeWidth={1.5}
              />
            </button>
            <button
              onClick={() => setRepeat((v) => !v)}
              aria-label="Repetir"
              aria-pressed={repeat}
              className="p-2 transition-transform hover:scale-110 active:scale-95"
            >
              <Repeat
                className={cn(
                  "h-5 w-5 transition-colors",
                  repeat ? "text-spotify-green" : "text-white/80",
                )}
                strokeWidth={2.25}
              />
            </button>
          </div>

          {/* Cover photo dots indicator */}
          {covers.length > 1 && (
            <div className="mt-8 flex items-center justify-center gap-1.5">
              {covers.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCoverIndex(i)}
                  aria-label={`Capa ${i + 1}`}
                  className={cn(
                    "h-1 rounded-full transition-all duration-300",
                    i === coverIndex ? "w-6 bg-white" : "w-1 bg-white/40",
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hidden audio element — controlled imperatively */}
      <audio ref={audioRef} src={audioSrc} loop preload="auto" />
    </section>
  );
});

SpotifyPlayerCard.displayName = "SpotifyPlayerCard";
