import "server-only";

import { and, eq, lt } from "drizzle-orm";

import { db, sites } from "@/lib/db";
import { deleteSiteFiles } from "@/lib/storage";

/**
 * Drafts nobody touched for this long are swept.
 *
 * Most abandoned drafts are someone who opened the wizard, uploaded two
 * photos, and never came back. Their photos sit on the volume forever
 * otherwise, and they are pictures of real people — keeping them
 * indefinitely is a liability, not a courtesy.
 */
export const DRAFT_TTL_DAYS = 30;

export interface SweepResult {
  drafts: number;
  expired: number;
}

/**
 * Deletes stale drafts and marks finished sites expired.
 *
 * Only ever touches DRAFT rows — a site someone paid for is never swept by
 * inactivity, no matter how long they leave it alone. The `photos` rows go
 * with the site through the FK cascade; the files need an explicit unlink.
 */
export async function sweep(now = new Date()): Promise<SweepResult> {
  const nowSec = Math.floor(now.getTime() / 1000);
  const cutoff = nowSec - DRAFT_TTL_DAYS * 86_400;

  const stale = db
    .select({ id: sites.id })
    .from(sites)
    .where(and(eq(sites.status, "DRAFT"), lt(sites.updatedAt, cutoff)))
    .all();

  for (const { id } of stale) {
    // Files first: a crash between the two leaves orphaned files, which a
    // later sweep can still find. The reverse leaves a row pointing at
    // nothing, which renders as a broken site.
    await deleteSiteFiles(id);
    db.delete(sites).where(eq(sites.id, id)).run();
  }

  // Published sites past their hosting window stop being served. The row and
  // the photos stay — someone who renews should get their site back, and
  // someone who doesn't may still ask for their pictures.
  const expired = db
    .update(sites)
    .set({ status: "EXPIRED" })
    .where(and(eq(sites.status, "PUBLISHED"), lt(sites.expiresAt, nowSec)))
    .run();

  return { drafts: stale.length, expired: expired.changes };
}
