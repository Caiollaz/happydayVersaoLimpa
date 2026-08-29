import "server-only";

import nodemailer from "nodemailer";

import { env, mailConfigured } from "@/lib/env";

/**
 * Transactional email — one message, sent once per sale.
 *
 * That message carries the only copy of the edit link the buyer will ever
 * receive, so a send failure is a real support problem, not a nicety. The
 * caller logs failures loudly rather than swallowing them.
 */

let transport: nodemailer.Transporter | null = null;

function getTransport(): nodemailer.Transporter | null {
  if (!mailConfigured) return null;
  transport ??= nodemailer.createTransport(env.SMTP_URL);
  return transport;
}

export interface DeliveryLinks {
  to: string;
  recipientName: string;
  publicUrl: string;
  editUrl: string;
  expiresAt: Date;
}

/**
 * Sends the "your site is live" email.
 *
 * Returns false when SMTP isn't configured instead of throwing — in
 * development that is the normal state, and a payment must not fail just
 * because a dev box can't send mail.
 */
export async function sendSiteReady(links: DeliveryLinks): Promise<boolean> {
  const mailer = getTransport();
  if (!mailer) {
    console.warn("SMTP não configurado — e-mail não enviado:", links.publicUrl);
    return false;
  }

  const expires = links.expiresAt.toLocaleDateString("pt-BR");

  await mailer.sendMail({
    from: env.MAIL_FROM,
    to: links.to,
    subject: "Seu site está no ar 💚",
    text: [
      `Pronto! O site para ${links.recipientName} está no ar.`,
      "",
      `Link pra compartilhar:  ${links.publicUrl}`,
      `Link pra editar:        ${links.editUrl}`,
      "",
      "Guarde o link de edição — ele é a única forma de mexer no site,",
      "e não temos como recuperá-lo pra você.",
      "",
      `O site fica no ar até ${expires}.`,
    ].join("\n"),
    html: `
      <div style="font-family:system-ui,-apple-system,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#111">
        <h1 style="font-size:22px;margin:0 0 16px">Seu site está no ar 💚</h1>
        <p style="margin:0 0 20px;color:#444">
          Pronto! O site para <strong>${escapeHtml(links.recipientName)}</strong> já pode ser compartilhado.
        </p>

        <p style="margin:0 0 8px">
          <a href="${links.publicUrl}"
             style="display:inline-block;background:#1db954;color:#000;font-weight:700;
                    text-decoration:none;padding:12px 22px;border-radius:999px">
            Abrir o site
          </a>
        </p>
        <p style="margin:0 0 24px;font-size:13px;color:#666">${links.publicUrl}</p>

        <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0">

        <p style="margin:0 0 6px;font-weight:600">Link pra editar</p>
        <p style="margin:0 0 6px;font-size:13px;word-break:break-all">
          <a href="${links.editUrl}" style="color:#1a7f3c">${links.editUrl}</a>
        </p>
        <p style="margin:0 0 24px;font-size:13px;color:#666">
          Guarde este link — ele é a única forma de mexer no site, e não temos
          como recuperá-lo pra você.
        </p>

        <p style="margin:0;font-size:13px;color:#666">
          O site fica no ar até <strong>${expires}</strong>.
        </p>
      </div>
    `,
  });

  return true;
}

/** Names come from user input and land inside the HTML body. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
