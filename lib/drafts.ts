import "server-only";

import { eq } from "drizzle-orm";

import { DEFAULT_CONFIG } from "@/lib/config/default";
import { parseSiteConfig, type SiteConfig } from "@/lib/config/schema";
import { db, sites, type Site } from "@/lib/db";
import { newEditToken, newSiteId } from "@/lib/tokens";

/**
 * A new draft starts as a full copy of the example site.
 *
 * The alternative — an empty config the wizard fills in — fails the schema
 * at every step (galleries need at least one photo, the player needs a
 * cover) and shows the user a broken preview until they finish. Starting
 * from a working site means the preview is live from the first screen and
 * every field is an edit rather than a blank page. It also keeps one strict
 * schema for drafts and published sites instead of two.
 */
export function createDraft(): { site: Site; config: SiteConfig } {
  const id = newSiteId();
  const editToken = newEditToken();
  const config = structuredClone(DEFAULT_CONFIG);

  const site = db
    .insert(sites)
    .values({ id, editToken, status: "DRAFT", config })
    .returning()
    .get();

  return { site, config };
}

export class DraftError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "DraftError";
  }
}

/**
 * Loads a site by id and checks the caller holds its edit token.
 *
 * Compares against the token stored for *that* row rather than looking the
 * site up by token, so a wrong token on a real id is a 403 and not a 404 —
 * the distinction doesn't leak anything here, since ids aren't secret.
 */
export function authorizeDraft(id: string, token: string | null): Site {
  if (!token) throw new DraftError("token ausente", 401);

  const site = db.select().from(sites).where(eq(sites.id, id)).get();
  if (!site) throw new DraftError("site não encontrado", 404);
  if (site.editToken !== token) throw new DraftError("token inválido", 403);
  if (site.status === "EXPIRED") throw new DraftError("este site expirou", 410);

  return site;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

/**
 * Recursively merges a patch into a config object.
 *
 * Nested objects merge; **arrays replace**. That asymmetry is deliberate:
 * a patch for `galleries` or `player.covers` means "this is the new list",
 * and merging arrays by index would make deleting a photo impossible.
 *
 * The depth matters — the retrospective step patches one slide at a time
 * (`retro.slides.movie`), and a shallow merge would drop the other ten.
 *
 * Keys absent from the current object are ignored, so a patch cannot add
 * fields the schema doesn't know about, and `__proto__` never lands on a
 * real key.
 */
function deepMerge(
  current: Record<string, unknown>,
  patch: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...current };

  for (const [key, value] of Object.entries(patch)) {
    if (!Object.prototype.hasOwnProperty.call(current, key)) continue;

    const existing = current[key];
    out[key] =
      isPlainObject(existing) && isPlainObject(value)
        ? deepMerge(existing, value)
        : value;
  }

  return out;
}

/**
 * Merges a partial update into a site's config and saves it.
 *
 * The result is validated in full before it is written, so a bad patch can
 * never leave a site unrenderable — the worst case is a 422 and no change.
 */
export function updateConfig(
  site: Site,
  patch: Record<string, unknown>,
): SiteConfig {
  const current = parseSiteConfig(site.config);
  const next = parseSiteConfig(
    deepMerge(current as unknown as Record<string, unknown>, patch),
  );

  db.update(sites)
    .set({ config: next, updatedAt: Math.floor(Date.now() / 1000) })
    .where(eq(sites.id, site.id))
    .run();

  return next;
}
