/**
 * Applies pending migrations from ./drizzle, then exits.
 *
 * Runs as the container's entrypoint before the server starts, so a deploy
 * that ships a schema change can't serve traffic against the old shape.
 *
 * Deliberately does NOT import lib/db — that module is Next-only (it pulls
 * `server-only` and the `@/` alias). Migrating is a standalone concern and
 * opening its own connection keeps this runnable by plain `node`.
 */
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

const path = process.env.DATABASE_PATH ?? "./data/app.db";

mkdirSync(dirname(path), { recursive: true });

const sqlite = new Database(path);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

migrate(drizzle(sqlite), { migrationsFolder: "./drizzle" });
sqlite.close();

console.log(`migrations aplicadas em ${path}`);
