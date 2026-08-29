import { sql } from "drizzle-orm";

import { db } from "@/lib/db";

/**
 * Liveness probe for the Docker healthcheck and any uptime monitor.
 *
 * Touches the database on purpose — a process that is up but can't read
 * its own volume is not healthy, and that is the failure mode a mounted
 * volume actually has.
 */
export const dynamic = "force-dynamic";

export function GET() {
  try {
    db.get(sql`select 1`);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("healthcheck falhou:", error);
    return Response.json({ ok: false }, { status: 503 });
  }
}
