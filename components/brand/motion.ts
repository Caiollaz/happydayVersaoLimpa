import type { CSSProperties } from "react";

export const RISE = "motion-safe:animate-brand-rise";
export const DRIFT = "motion-safe:animate-brand-drift";

export function riseDelay(ms: number): CSSProperties {
  return { animationDelay: `${ms}ms` };
}

export function drift(seconds: number, tilt: `${number}deg`, delaySeconds = 0): CSSProperties {
  return {
    "--tilt": tilt,
    animationDuration: `${seconds}s`,
    animationDelay: `${delaySeconds}s`,
  } as CSSProperties;
}
