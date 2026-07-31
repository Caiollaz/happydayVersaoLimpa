import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats seconds into mm:ss format (e.g., 3:45)
 */
export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Smoothly scrolls to an element by id
 */
export function scrollToId(id: string) {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/**
 * Fades an <audio> element's volume to a target value over a duration.
 * Uses requestAnimationFrame with ease-out cubic. Resolves when the target
 * is reached.
 */
export function fadeAudio(
  audio: HTMLAudioElement,
  targetVolume: number,
  durationMs = 900,
): Promise<void> {
  return new Promise((resolve) => {
    const start = Math.max(0, Math.min(1, audio.volume));
    const end = Math.max(0, Math.min(1, targetVolume));
    if (Math.abs(start - end) < 0.005 || durationMs <= 0) {
      audio.volume = end;
      resolve();
      return;
    }
    const t0 = performance.now();
    const tick = () => {
      const t = Math.min((performance.now() - t0) / durationMs, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      audio.volume = start + (end - start) * eased;
      if (t < 1) requestAnimationFrame(tick);
      else {
        audio.volume = end;
        resolve();
      }
    };
    requestAnimationFrame(tick);
  });
}
