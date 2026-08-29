import "server-only";

import { timingSafeEqual } from "node:crypto";

import { env } from "@/lib/env";

/**
 * Admin access, guarded by a single shared token.
 *
 * One operator, one secret — a login system for an audience of one would be
 * more code to get wrong than it protects. The token lives in the env and
 * is compared in constant time.
 *
 * When ADMIN_TOKEN is unset the panel is closed rather than open: a missing
 * secret must never mean "no check".
 */
export function isAdmin(provided: string | null | undefined): boolean {
  if (!env.ADMIN_TOKEN || !provided) return false;

  const a = Buffer.from(env.ADMIN_TOKEN, "utf8");
  const b = Buffer.from(provided, "utf8");

  return a.length === b.length && timingSafeEqual(a, b);
}

/** Reads the token from the `Authorization: Bearer …` header. */
export function bearerToken(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice(7).trim() || null;
}
