import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";

import { db, photos, sites } from "@/lib/db";
import { DRAFT_LIMITS, PLANS, isPlanId } from "@/lib/plans";
import {
  MAX_UPLOAD_BYTES,
  UploadError,
  mediaUrl,
  storeImage,
} from "@/lib/storage";

/**
 * Accepts one photo for a draft site.
 *
 * Authorized by the site's secret editToken rather than a session — there
 * are no accounts in this product. The token is the capability: whoever
 * holds it can add photos to that site and nothing else.
 */
export const dynamic = "force-dynamic";
/** Photos can take a moment to re-encode on a small VPS. */
export const maxDuration = 60;

function fail(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
  // Reject oversized bodies before buffering them. This is a courtesy check
  // — the header is client-supplied — but it turns the common accidental
  // 200 MB video into a fast 413 instead of a slow one.
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_UPLOAD_BYTES + 4096) {
    return fail("arquivo maior que 15 MB", 413);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail("corpo inválido", 400);
  }

  const token = form.get("token");
  const slot = form.get("slot");
  const file = form.get("file");

  if (typeof token !== "string" || !token) return fail("token ausente", 401);
  if (typeof slot !== "string" || !slot) return fail("slot ausente", 400);
  if (!(file instanceof File)) return fail("arquivo ausente", 400);
  if (file.size > MAX_UPLOAD_BYTES) return fail("arquivo maior que 15 MB", 413);

  const site = db.select().from(sites).where(eq(sites.editToken, token)).get();
  if (!site) return fail("site não encontrado", 404);
  if (site.status === "EXPIRED") return fail("este site expirou", 410);

  // Quota. A draft gets the most generous plan's cap so choosing a plan
  // later never means deleting photos already uploaded.
  const limit = isPlanId(site.plan)
    ? PLANS[site.plan].maxPhotos
    : DRAFT_LIMITS.maxPhotos;

  const used =
    db
      .select({ n: sql<number>`count(*)` })
      .from(photos)
      .where(eq(photos.siteId, site.id))
      .get()?.n ?? 0;

  if (used >= limit) {
    return fail(`limite de ${limit} fotos atingido no seu plano`, 409);
  }

  let stored;
  try {
    stored = await storeImage(site.id, Buffer.from(await file.arrayBuffer()));
  } catch (error) {
    if (error instanceof UploadError) return fail(error.message, error.status);
    console.error("falha ao processar upload:", error);
    return fail("não consegui processar essa imagem", 500);
  }

  const nextOrder =
    (db
      .select({ n: sql<number>`coalesce(max(${photos.order}), -1)` })
      .from(photos)
      .where(eq(photos.siteId, site.id))
      .get()?.n ?? -1) + 1;

  const id = randomUUID();

  db.insert(photos)
    .values({
      id,
      siteId: site.id,
      slot,
      order: nextOrder,
      path: stored.path,
      thumbPath: stored.thumbPath,
      width: stored.width,
      height: stored.height,
      bytes: stored.bytes,
      dominantColor: stored.dominantColor,
    })
    .run();

  db.update(sites)
    .set({ updatedAt: Math.floor(Date.now() / 1000) })
    .where(eq(sites.id, site.id))
    .run();

  return Response.json(
    {
      id,
      slot,
      url: mediaUrl(stored.path),
      thumbUrl: mediaUrl(stored.thumbPath),
      width: stored.width,
      height: stored.height,
      dominantColor: stored.dominantColor,
      remaining: limit - used - 1,
    },
    { status: 201 },
  );
}
