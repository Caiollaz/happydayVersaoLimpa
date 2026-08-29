import { createDraft } from "@/lib/drafts";

/**
 * Starts a new draft. No body, no auth — anyone can begin building.
 *
 * The response carries the edit token exactly once. The client stores it
 * (localStorage plus the URL) and it is emailed at checkout; there is no
 * way to recover it from the server afterwards, which is the point.
 */
export const dynamic = "force-dynamic";

export function POST() {
  const { site, config } = createDraft();

  return Response.json(
    { id: site.id, editToken: site.editToken, config },
    { status: 201 },
  );
}
