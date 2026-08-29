import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import MercadoPagoConfig, { Payment, Preference } from "mercadopago";

import { env } from "@/lib/env";
import { PLANS, type PlanId } from "@/lib/plans";

/**
 * Mercado Pago integration: Checkout Pro (Pix + card).
 *
 * Checkout Pro over the transparent checkout because it means card numbers
 * never touch this server — no PCI scope, no card fields to get wrong, and
 * Pix, boleto and saved cards all arrive for free.
 */

export class PaymentsUnavailable extends Error {
  constructor() {
    super("pagamentos não configurados: falta MP_ACCESS_TOKEN");
    this.name = "PaymentsUnavailable";
  }
}

function client(): MercadoPagoConfig {
  if (!env.MP_ACCESS_TOKEN) throw new PaymentsUnavailable();
  return new MercadoPagoConfig({
    accessToken: env.MP_ACCESS_TOKEN,
    options: { timeout: 10_000 },
  });
}

export interface CheckoutSession {
  preferenceId: string;
  /** Where to send the buyer. */
  initPoint: string;
}

/**
 * Creates the Checkout Pro preference for one order.
 *
 * `external_reference` carries our order id, which is how a webhook is tied
 * back to a site — the payment id alone tells us nothing about who paid.
 */
export async function createCheckout({
  orderId,
  plan,
  siteId,
  buyerEmail,
}: {
  orderId: string;
  plan: PlanId;
  siteId: string;
  buyerEmail?: string;
}): Promise<CheckoutSession> {
  const preference = new Preference(client());
  const details = PLANS[plan];

  const result = await preference.create({
    body: {
      items: [
        {
          id: plan,
          title: `Site de presente — plano ${details.name}`,
          description: `Site publicado por ${details.hostingDays} dias`,
          quantity: 1,
          currency_id: "BRL",
          // Mercado Pago wants a decimal amount; we store cents.
          unit_price: details.priceCents / 100,
        },
      ],

      external_reference: orderId,
      metadata: { site_id: siteId, plan },

      ...(buyerEmail ? { payer: { email: buyerEmail } } : {}),

      back_urls: {
        success: `${env.APP_URL}/checkout/retorno?order=${orderId}`,
        pending: `${env.APP_URL}/checkout/retorno?order=${orderId}`,
        failure: `${env.APP_URL}/checkout/retorno?order=${orderId}`,
      },
      auto_return: "approved",

      notification_url: `${env.APP_URL}/api/webhooks/mercadopago`,

      payment_methods: {
        // A gift site is an impulse purchase; installments on R$49 only
        // add a decision to make.
        installments: 1,
        excluded_payment_types: [{ id: "ticket" }], // no boleto: too slow
      },

      // An abandoned checkout shouldn't hold a Pix code open for days.
      expires: true,
      expiration_date_to: new Date(Date.now() + 24 * 3600_000).toISOString(),
    },
  });

  if (!result.id || !result.init_point) {
    throw new Error("Mercado Pago não devolveu init_point");
  }

  return { preferenceId: result.id, initPoint: result.init_point };
}

export interface PaymentDetails {
  id: string;
  status: string;
  /** Our order id, echoed back from the preference. */
  orderId: string | null;
  method: string | null;
  amountCents: number | null;
  payerEmail: string | null;
}

/**
 * Fetches a payment from Mercado Pago.
 *
 * The webhook body is only a notification — it carries an id, not a status
 * worth trusting. Everything that decides whether to publish a site is read
 * back from the API over an authenticated connection.
 */
export async function fetchPayment(paymentId: string): Promise<PaymentDetails> {
  const payment = new Payment(client());
  const p = await payment.get({ id: paymentId });

  return {
    id: String(p.id),
    status: p.status ?? "unknown",
    orderId: p.external_reference ?? null,
    method: p.payment_type_id ?? p.payment_method_id ?? null,
    amountCents:
      typeof p.transaction_amount === "number"
        ? Math.round(p.transaction_amount * 100)
        : null,
    payerEmail: p.payer?.email ?? null,
  };
}

/**
 * Verifies the `x-signature` header on an incoming webhook.
 *
 * Without this the endpoint is a public "mark this order paid" button. The
 * manifest format is fixed by Mercado Pago:
 *
 *     id:<data.id>;request-id:<x-request-id>;ts:<ts>;
 *
 * signed with HMAC-SHA256 using the webhook secret from the dashboard.
 */
export function verifyWebhookSignature({
  signatureHeader,
  requestId,
  dataId,
}: {
  signatureHeader: string | null;
  requestId: string | null;
  dataId: string;
}): boolean {
  if (!env.MP_WEBHOOK_SECRET) return false;
  if (!signatureHeader) return false;

  // "ts=1704908010,v1=618c85345248dd820d5fd456117c2ab2ef8eda45a0282ff693eac24131a5e839"
  const parts = new Map(
    signatureHeader.split(",").map((chunk) => {
      const [k, ...rest] = chunk.trim().split("=");
      return [k.trim(), rest.join("=").trim()] as const;
    }),
  );

  const ts = parts.get("ts");
  const v1 = parts.get("v1");
  if (!ts || !v1) return false;

  // Reject stale signatures so a captured webhook can't be replayed later.
  const age = Math.abs(Date.now() / 1000 - Number(ts));
  if (!Number.isFinite(age) || age > 600) return false;

  const manifest = `id:${dataId};request-id:${requestId ?? ""};ts:${ts};`;
  const expected = createHmac("sha256", env.MP_WEBHOOK_SECRET)
    .update(manifest)
    .digest("hex");

  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(v1, "utf8");
  // Length check first: timingSafeEqual throws on a mismatch.
  return a.length === b.length && timingSafeEqual(a, b);
}
