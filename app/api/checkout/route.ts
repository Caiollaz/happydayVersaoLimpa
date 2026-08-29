import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { DraftError, authorizeDraft } from "@/lib/drafts";
import { db, orders, sites } from "@/lib/db";
import { PaymentsUnavailable, createCheckout } from "@/lib/mercadopago";
import { PLANS, PLAN_IDS } from "@/lib/plans";
import { parseSiteConfig } from "@/lib/config/schema";

/**
 * Opens a Checkout Pro session for a draft.
 *
 * Creates our order row first, then the Mercado Pago preference — the order
 * id is what `external_reference` carries, so it has to exist before the
 * preference does.
 */
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  siteId: z.string().min(1),
  plan: z.enum(PLAN_IDS),
  email: z.email(),
});

export async function POST(request: Request) {
  let parsed;
  try {
    parsed = bodySchema.parse(await request.json());
  } catch {
    return Response.json({ error: "dados inválidos" }, { status: 400 });
  }

  const { siteId, plan, email } = parsed;

  let site;
  try {
    site = authorizeDraft(siteId, request.headers.get("x-edit-token"));
  } catch (error) {
    if (error instanceof DraftError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    throw error;
  }

  if (site.status === "PUBLISHED") {
    return Response.json({ error: "este site já foi publicado" }, { status: 409 });
  }

  // The plan has to actually cover what they built. Letting someone buy
  // Básico with the retrospective on would publish a site missing the
  // feature they spent the most time filling in.
  const config = parseSiteConfig(site.config);
  if (config.retro.enabled && !PLANS[plan].retrospective) {
    return Response.json(
      { error: "a retrospectiva só existe no plano Premium" },
      { status: 409 },
    );
  }

  const orderId = randomUUID();

  // The email is stored now so delivery works even if the buyer never
  // returns to the success page.
  db.update(sites).set({ ownerEmail: email }).where(eq(sites.id, site.id)).run();

  db.insert(orders)
    .values({
      id: orderId,
      siteId: site.id,
      plan,
      amountCents: PLANS[plan].priceCents,
      status: "PENDING",
    })
    .run();

  try {
    const session = await createCheckout({
      orderId,
      plan,
      siteId: site.id,
      buyerEmail: email,
    });

    db.update(orders)
      .set({ mpPreferenceId: session.preferenceId })
      .where(eq(orders.id, orderId))
      .run();

    return Response.json({ orderId, initPoint: session.initPoint });
  } catch (error) {
    if (error instanceof PaymentsUnavailable) {
      return Response.json(
        { error: "pagamentos ainda não estão configurados" },
        { status: 503 },
      );
    }
    console.error("falha ao criar checkout:", error);
    return Response.json({ error: "não consegui abrir o checkout" }, { status: 502 });
  }
}
