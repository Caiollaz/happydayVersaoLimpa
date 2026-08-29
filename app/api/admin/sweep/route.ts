import { bearerToken, isAdmin } from "@/lib/admin";
import { sweep } from "@/lib/cleanup";

/**
 * Runs the housekeeping sweep: deletes abandoned drafts with their uploads,
 * and marks finished sites expired.
 *
 * Exposed as an endpoint rather than a script so it reuses the app's own
 * database connection and code path. Call it from host cron on the VPS:
 *
 *   0 4 * * * curl -fsS -X POST -H "Authorization: Bearer $ADMIN_TOKEN" \
 *             https://seudominio.com.br/api/admin/sweep
 *
 * Not scheduled in-process on purpose: an interval inside the server would
 * run once per replica and fire again on every restart.
 */
export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST(request: Request) {
  if (!isAdmin(bearerToken(request))) {
    return Response.json({ error: "não autorizado" }, { status: 401 });
  }

  try {
    const result = await sweep();
    console.log(
      `sweep: ${result.drafts} rascunhos removidos, ${result.expired} sites expirados`,
    );
    return Response.json({ ok: true, ...result });
  } catch (error) {
    console.error("sweep falhou:", error);
    return Response.json({ error: "sweep falhou" }, { status: 500 });
  }
}
