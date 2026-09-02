import type { Metadata } from "next";
import type { ReactNode } from "react";
import { eq } from "drizzle-orm";

import { Pill } from "@/components/brand/Pill";
import { Figure, type FigureName } from "@/components/brand/scenes";
import { Shell } from "@/components/brand/Shell";
import { brandViewport } from "@/components/brand/viewport";
import { parseSiteConfig } from "@/lib/config/schema";
import { db, orders, sites } from "@/lib/db";

/**
 * Where Mercado Pago sends the buyer back to.
 *
 * Reads our own order row rather than the status in the query string — the
 * URL is attacker-controlled, and the webhook is what actually decides
 * whether a site is published.
 *
 * Pix is the common case where the buyer lands here before the webhook
 * arrives, so "pending" is a normal state with its own copy, not an error.
 */
export const dynamic = "force-dynamic";

export const viewport = brandViewport;

export const metadata: Metadata = {
  title: "Pagamento",
  robots: { index: false, follow: false },
};

interface RetornoPageProps {
  searchParams: Promise<{ order?: string }>;
}

export default async function RetornoPage({ searchParams }: RetornoPageProps) {
  const { order: orderId } = await searchParams;

  const order = orderId
    ? db.select().from(orders).where(eq(orders.id, orderId)).get()
    : undefined;

  if (!order) {
    return (
      <Outcome title="Pedido não encontrado">
        <p>Não achamos esse pedido. Se você acabou de pagar, confira o link que chegou no seu e-mail.</p>
      </Outcome>
    );
  }

  const site = db.select().from(sites).where(eq(sites.id, order.siteId)).get();

  if (order.status === "APPROVED" && site?.slug) {
    const config = parseSiteConfig(site.config);

    return (
      <Outcome figure="giftbox" title="Está no ar.">
        <p>O presente para {config.couple.recipientName} já pode ser compartilhado.</p>

        <div className="mt-8 flex flex-col gap-3">
          <Pill href={`/p/${site.slug}`} tone="ink">
            Abrir o site
          </Pill>
          <Pill href={`/editar/${site.editToken}`} tone="ghost">
            Continuar editando
          </Pill>
        </div>

        <p className="mt-6 text-caption text-brand-slate/80">
          Enviamos os dois links pro seu e-mail. Guarde o de edição — é a única forma de mexer no
          site.
        </p>
      </Outcome>
    );
  }

  if (order.status === "PENDING") {
    return (
      <Outcome figure="envelope" title="Aguardando confirmação">
        <p>
          Se você pagou com Pix, isso costuma levar alguns segundos. Assim que o pagamento cair, o
          site publica sozinho e o link chega no seu e-mail.
        </p>
        <p className="mt-6 text-caption text-brand-slate/80">
          Pode fechar esta página — não precisa esperar aqui.
        </p>
      </Outcome>
    );
  }

  return (
    <Outcome title="O pagamento não foi concluído">
      <p>Nada foi cobrado. Seu rascunho continua salvo — é só tentar de novo.</p>
      {site && (
        <Pill href={`/editar/${site.editToken}`} tone="ink" className="mt-8 w-full">
          Voltar pro meu site
        </Pill>
      )}
    </Outcome>
  );
}

interface OutcomeProps {
  title: string;
  figure?: FigureName;
  children: ReactNode;
}

function Outcome({ title, figure, children }: OutcomeProps) {
  return (
    <Shell>
      <main className="grid min-h-[70dvh] place-items-center px-5 py-16 sm:px-8">
        <div className="w-full max-w-md rounded-panel bg-brand-mist p-8 text-center sm:p-10">
          {figure && <Figure name={figure} className="mx-auto h-28 w-28" />}
          <h1 className="mt-5 text-[2rem] font-extrabold leading-[1.12] tracking-[-0.035em]">
            {title}
          </h1>
          <div className="mt-4 text-body leading-relaxed text-brand-slate">{children}</div>
        </div>
      </main>
    </Shell>
  );
}
