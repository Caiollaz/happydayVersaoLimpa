import { parseSiteConfig } from "@/lib/config/schema";
import { DraftError, authorizeDraft, updateConfig } from "@/lib/drafts";
import { ZodError } from "zod";

/**
 * Reads and autosaves one draft. Authorized by the `x-edit-token` header.
 *
 * The token travels in a header rather than the path so it stays out of
 * access logs and Referer headers.
 */
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

function handle(error: unknown) {
  if (error instanceof DraftError) {
    return Response.json({ error: error.message }, { status: error.status });
  }
  if (error instanceof ZodError) {
    // Surface which field was rejected — the wizard shows it inline.
    return Response.json(
      {
        error: "config inválido",
        issues: error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 422 },
    );
  }
  console.error("erro no rascunho:", error);
  return Response.json({ error: "erro interno" }, { status: 500 });
}

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const site = authorizeDraft(id, request.headers.get("x-edit-token"));

    return Response.json({
      id: site.id,
      status: site.status,
      plan: site.plan,
      slug: site.slug,
      config: parseSiteConfig(site.config),
    });
  } catch (error) {
    return handle(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const site = authorizeDraft(id, request.headers.get("x-edit-token"));

    // Editing a site after it is paid for is allowed and expected — people
    // fix typos. Only expired sites are frozen, which authorizeDraft covers.
    const body = await request.json();
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return Response.json({ error: "corpo inválido" }, { status: 400 });
    }

    return Response.json({ config: updateConfig(site, body) });
  } catch (error) {
    return handle(error);
  }
}
