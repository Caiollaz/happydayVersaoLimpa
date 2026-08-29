import { eq } from "drizzle-orm";

import { env } from "@/lib/env";
import { db, orders, sites } from "@/lib/db";
import { fetchPayment, verifyWebhookSignature } from "@/lib/mercadopago";
import { sendSiteReady } from "@/lib/mail";
import { publishSite } from "@/lib/publish";
import { isPlanId } from "@/lib/plans";
import { parseSiteConfig } from "@/lib/config/schema";

/**
 * Mercado Pago payment notifications.
 *
 * Three rules this endpoint lives by:
 *
 *  1. **Verify the signature.** Unsigned, this is a public "publish this
 *     site for free" button.
 *  2. **Trust nothing in the body.** It carries an id; the status that
 *     decides whether to publish is fetched back from the API.
 *  3. **Be idempotent.** Mercado Pago retries, and does deliver duplicates.
 *     The unique index on `mp_payment_id` is the backstop.
 *
 * Always answers 200 once the signature checks out. A non-2xx puts the
 * notification into MP's retry queue, which is right for "we're down" and
 * wrong for "we already handled this".
 */
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(request: Request) {
  const url = new URL(request.url);

  let body: { type?: string; action?: string; data?: { id?: string } };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "corpo inválido" }, { status: 400 });
  }

  // MP sends the id in the body, and on some integrations only in the query.
  const dataId = body.data?.id ?? url.searchParams.get("data.id");
  if (!dataId) return Response.json({ ignored: "sem data.id" });

  if (
    !verifyWebhookSignature({
      signatureHeader: request.headers.get("x-signature"),
      requestId: request.headers.get("x-request-id"),
      dataId: String(dataId),
    })
  ) {
    console.warn("webhook com assinatura inválida rejeitado");
    return Response.json({ error: "assinatura inválida" }, { status: 401 });
  }

  // Merchant-order and plan notifications share this endpoint; only
  // payments move an order forward.
  const kind = body.type ?? url.searchParams.get("type");
  if (kind && kind !== "payment") {
    return Response.json({ ignored: kind });
  }

  try {
    await handlePayment(String(dataId));
  } catch (error) {
    console.error("erro processando webhook:", error);
    // 500 so MP retries — the payment is real and unprocessed.
    return Response.json({ error: "erro ao processar" }, { status: 500 });
  }

  return Response.json({ ok: true });
}

async function handlePayment(paymentId: string): Promise<void> {
  const payment = await fetchPayment(paymentId);

  if (!payment.orderId) {
    console.warn("pagamento sem external_reference:", paymentId);
    return;
  }

  const order = db
    .select()
    .from(orders)
    .where(eq(orders.id, payment.orderId))
    .get();

  if (!order) {
    console.warn("pagamento aponta pra pedido desconhecido:", payment.orderId);
    return;
  }

  // Already settled by an earlier delivery of this same notification.
  if (order.status === "APPROVED" && order.mpPaymentId === payment.id) return;

  const status = mapStatus(payment.status);

  if (status !== "APPROVED") {
    db.update(orders)
      .set({ status, mpPaymentId: payment.id, mpPaymentMethod: payment.method })
      .where(eq(orders.id, order.id))
      .run();
    return;
  }

  // Guard against a tampered or mismatched amount before publishing.
  if (payment.amountCents !== null && payment.amountCents < order.amountCents) {
    console.error(
      `valor pago (${payment.amountCents}) menor que o pedido (${order.amountCents})`,
    );
    return;
  }

  db.update(orders)
    .set({
      status: "APPROVED",
      mpPaymentId: payment.id,
      mpPaymentMethod: payment.method,
      paidAt: Math.floor(Date.now() / 1000),
    })
    .where(eq(orders.id, order.id))
    .run();

  const site = db.select().from(sites).where(eq(sites.id, order.siteId)).get();
  if (!site) {
    console.error("pedido aprovado sem site:", order.id);
    return;
  }

  const plan = isPlanId(order.plan) ? order.plan : "premium";
  const published = publishSite(site, plan, env.APP_URL);

  const to = site.ownerEmail ?? payment.payerEmail;
  if (!to) {
    console.error("site publicado sem e-mail de entrega:", published.publicUrl);
    return;
  }

  const config = parseSiteConfig(site.config);

  try {
    await sendSiteReady({
      to,
      recipientName: config.couple.recipientName,
      publicUrl: published.publicUrl,
      editUrl: published.editUrl,
      expiresAt: published.expiresAt,
    });
  } catch (error) {
    // The site is live and paid for. A failed email is a support ticket,
    // not a reason to make MP retry and re-run all of the above.
    console.error("falha ao enviar e-mail de entrega:", published.publicUrl, error);
  }
}

/** Mercado Pago's payment states, mapped onto ours. */
function mapStatus(status: string) {
  switch (status) {
    case "approved":
      return "APPROVED" as const;
    case "refunded":
    case "charged_back":
      return "REFUNDED" as const;
    case "cancelled":
      return "CANCELLED" as const;
    case "rejected":
      return "REJECTED" as const;
    default:
      // pending, in_process, authorized — Pix sits here until it clears.
      return "PENDING" as const;
  }
}
