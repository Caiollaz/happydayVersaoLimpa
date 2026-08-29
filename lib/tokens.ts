import { randomBytes, randomUUID } from "node:crypto";

/**
 * Identifiers, split by who is allowed to guess them.
 *
 * `newSiteId` is internal and appears in URLs and logs. `newEditToken` is
 * the product's only credential — it must be unguessable, because anyone
 * holding it can edit that site.
 */

export function newSiteId(): string {
  return randomUUID();
}

/**
 * 32 hex chars from 16 random bytes — 128 bits.
 *
 * Not `randomUUID()`: a UUID v4 carries 6 fixed bits and reads like an
 * internal id, which invites someone to try tweaking one.
 */
export function newEditToken(): string {
  return randomBytes(16).toString("hex");
}

/** Words that make an unfortunate slug for a couple's gift. */
const RESERVED = new Set([
  "api", "admin", "criar", "editar", "checkout", "demo", "p", "sobre",
  "termos", "privacidade", "precos", "ajuda", "login", "www", "null",
]);

/**
 * Turns two names into a shareable slug: "Léo", "Ana" → "leo-e-ana".
 *
 * Accents are folded rather than dropped so "João" becomes "joao", not
 * "joo". A short random suffix is appended by the caller when the slug is
 * already taken — two different couples named the same thing is common.
 */
export function slugifyNames(author: string, recipient: string): string {
  const clean = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // combining accents, after NFD
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 24);

  const base = [clean(author), clean(recipient)].filter(Boolean).join("-e-");

  if (!base || RESERVED.has(base)) return `nos-${randomBytes(3).toString("hex")}`;
  return base;
}

/** Four hex chars, appended when a slug collides. */
export function slugSuffix(): string {
  return randomBytes(2).toString("hex");
}
