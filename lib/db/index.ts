import "server-only";

import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

import { env } from "@/lib/env";
import * as schema from "./schema";

/**
 * One SQLite connection for the whole process.
 *
 * Next's dev server re-evaluates modules on every edit, which would leak a
 * new file handle each time — so the instance is parked on globalThis and
 * reused. In production the module is evaluated once and this is a no-op.
 */
const globalForDb = globalThis as unknown as {
  __sqlite?: Database.Database;
};

function connect(): Database.Database {
  mkdirSync(dirname(env.DATABASE_PATH), { recursive: true });
  const sqlite = new Database(env.DATABASE_PATH);

  // WAL lets readers work while a write is in flight. Without it, every
  // page render would contend with the autosave writes coming from the
  // wizard.
  sqlite.pragma("journal_mode = WAL");
  // Wait rather than throw SQLITE_BUSY if a write does collide.
  sqlite.pragma("busy_timeout = 5000");
  // Off by default in SQLite; the photos/orders cascades depend on it.
  sqlite.pragma("foreign_keys = ON");
  // WAL + NORMAL is the standard durability tradeoff: survives process
  // crashes, can lose the last transaction on a host power loss. For
  // orders that matters, so the payment webhook checkpoints explicitly.
  sqlite.pragma("synchronous = NORMAL");

  return sqlite;
}

export const sqlite = (globalForDb.__sqlite ??= connect());

export const db = drizzle(sqlite, { schema });

export * from "./schema";
