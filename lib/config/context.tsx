"use client";

import { createContext, useContext, useMemo } from "react";

import { interpolate, parseLocalDate, type SiteConfig } from "./schema";

const SiteConfigContext = createContext<SiteConfig | null>(null);

export function SiteConfigProvider({
  config,
  children,
}: {
  config: SiteConfig;
  children: React.ReactNode;
}) {
  return (
    <SiteConfigContext.Provider value={config}>
      {children}
    </SiteConfigContext.Provider>
  );
}

/**
 * The site's content. Throws rather than returning a default when used
 * outside the provider — a component silently rendering someone else's
 * placeholder names is far worse than a crash during development.
 */
export function useSiteConfig(): SiteConfig {
  const config = useContext(SiteConfigContext);
  if (!config) {
    throw new Error("useSiteConfig precisa estar dentro de <SiteConfigProvider>");
  }
  return config;
}

/**
 * Interpolator bound to this site's couple, for strings containing
 * `{author}` / `{recipient}`.
 *
 * Every config string may contain placeholders, so components run their
 * text through this instead of each one reaching for `couple` itself.
 */
export function useText(): (template: string) => string {
  const { couple } = useSiteConfig();
  return useMemo(
    () => (template: string) => interpolate(template, couple),
    [couple],
  );
}

/**
 * The config's dates as `Date` objects, parsed as local midnight.
 *
 * Memoized on the raw strings: `CountdownTimer` and the counter slides
 * take these as dependencies, and a fresh object each render would
 * restart their animations on every parent update.
 */
export function useDates(): { met: Date; relationshipStart: Date; gift: Date } {
  const { dates } = useSiteConfig();
  return useMemo(
    () => ({
      met: parseLocalDate(dates.met),
      relationshipStart: parseLocalDate(dates.relationshipStart),
      gift: parseLocalDate(dates.gift),
    }),
    [dates.met, dates.relationshipStart, dates.gift],
  );
}
