"use client";

interface ProgressBarsProps {
  total: number;
  currentIndex: number;
  durationMs: number;
  isPaused: boolean;
  /** Called when the currently-animating bar reaches 100%. */
  onComplete: () => void;
}

/**
 * Instagram-Stories style row of progress bars. One segment per story.
 * The active segment fills 0 → 100% via a pure CSS animation (so
 * `animationPlayState: paused` actually freezes it — framer's JS-based
 * animate doesn't respect that CSS property).
 *
 * `key={currentIndex}` on the active fill forces a fresh mount on every
 * navigation, which resets the animation to 0 even when advancing.
 */
export function ProgressBars({
  total,
  currentIndex,
  durationMs,
  isPaused,
  onComplete,
}: ProgressBarsProps) {
  return (
    <div className="absolute top-0 left-0 right-0 z-30 safe-top px-3 pt-2 flex gap-1.5">
      {Array.from({ length: total }).map((_, i) => {
        const isPast = i < currentIndex;
        const isActive = i === currentIndex;

        return (
          <div
            key={i}
            className="h-[3px] flex-1 rounded-full bg-white/25 overflow-hidden"
          >
            {isPast && <div className="h-full w-full bg-white" />}
            {isActive && (
              <div
                key={`active-${currentIndex}`}
                onAnimationEnd={onComplete}
                style={{
                  height: "100%",
                  width: "100%",
                  background: "white",
                  transformOrigin: "left center",
                  animation: `retroBarFill ${durationMs}ms linear forwards`,
                  animationPlayState: isPaused ? "paused" : "running",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
