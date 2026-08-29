import type { Metadata } from "next";
import Link from "next/link";
import { eq } from "drizzle-orm";

import { db, orders, sites } from "@/lib/db";
import { parseSiteConfig } from "@/lib/config/schema";

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

export const metadata: Metadata = {
  title: "Pagamento",
  robots: { index: false, follow: false },
};

export default async function RetornoPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderId } = await searchParams;

  const order = orderId
    ? db.select().from(orders).where(eq(orders.id, orderId)).get()
    : undefined;

  if (!order) return <Shell title="Pedido não encontrado" />;

  const site = db.select().from(sites).where(eq(sites.id, order.siteId)).get();

  if (order.status === "APPROVED" && site?.slug) {
    const config = parseSiteConfig(site.config);
    return (
      <Shell title="Está no ar 💚">
        <p className="text-white/60">
          O site para {config.couple.recipientName} já pode ser compartilhado.
        </p>

        <div className="mt-6 space-y-3">
          <Link
            href={`/p/${site.slug}`}
            className="block rounded-full bg-spotify-green px-6 py-3 text-center font-bold text-black"
          >
            Abrir o site
          </Link>
          <Link
            href={`/editar/${site.editToken}`}
            className="block rounded-full border border-white/15 px-6 py-3 text-center font-semibold text-white/80"
          >
            Continuar editando
          </Link>
        </div>

        <p className="mt-6 text-xs text-white/40">
          Enviamos os dois links pro seu e-mail. Guarde o de edição — é a única
          forma de mexer no site.
        </p>
      </Shell>
    );
  }

  if (order.status === "PENDING") {
    return (
      <Shell title="Aguardando confirmação">
        <p className="text-white/60">
          Se você pagou com Pix, isso costuma levar alguns segundos. Assim que
          o pagamento cair, o site publica sozinho e o link chega no seu
          e-mail.
        </p>
        <p className="mt-6 text-xs text-white/40">
          Pode fechar esta página — não precisa esperar aqui.
        </p>
      </Shell>
    );
  }

  return (
    <Shell title="O pagamento não foi concluído">
      <p className="text-white/60">
        Nada foi cobrado. Seu rascunho continua salvo — é só tentar de novo.
      </p>
      {site && (
        <Link
          href={`/editar/${site.editToken}`}
          className="mt-6 block rounded-full bg-spotify-green px-6 py-3 text-center font-bold text-black"
        >
          Voltar pro meu site
        </Link>
      )}
    </Shell>
  );
}

function Shell({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <main className="grid min-h-[100dvh] place-items-center bg-spotify-black px-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-black text-white">{title}</h1>
        <div className="mt-3">{children}</div>
      </div>
    </main>
  );
}
