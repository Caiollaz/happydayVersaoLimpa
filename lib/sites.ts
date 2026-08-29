import "server-only";

import { eq } from "drizzle-orm";

import { db, sites, type Site } from "@/lib/db";
import { parseSiteConfig, type SiteConfig } from "@/lib/config/schema";

/** A site plus its config already parsed and validated. */
export interface LoadedSite {
  site: Site;
  config: SiteConfig;
}

/**
 * Looks up a published site by its public slug.
 *
 * Returns null for drafts and expired sites as well as missing ones — the
 * public URL must not reveal that a slug exists but isn't payed for yet.
 */
export function findPublishedSite(slug: string): LoadedSite | null {
  const site = db.select().from(sites).where(eq(sites.slug, slug)).get();

  if (!site || site.status !== "PUBLISHED") return null;

  // A config that fails validation means a bad migration or a hand-edited
  // row. Rendering half a site is worse than a 404, so let it throw.
  return { site, config: parseSiteConfig(site.config) };
}

/** Looks up any site (draft included) by its secret edit token. */
export function findSiteByEditToken(token: string): LoadedSite | null {
  const site = db
    .select()
    .from(sites)
    .where(eq(sites.editToken, token))
    .get();

  if (!site) return null;

  return { site, config: parseSiteConfig(site.config) };
}
