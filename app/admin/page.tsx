import type { Metadata } from "next";
import { cookies } from "next/headers";
import { and, desc, eq, gte, sql } from "drizzle-orm";

import { INPUT } from "@/components/brand/input";
import { Logo } from "@/components/brand/Logo";
import { PillButton } from "@/components/brand/Pill";
import { Shell } from "@/components/brand/Shell";
import { brandViewport } from "@/components/brand/viewport";
import { isAdmin } from "@/lib/admin";
import { parseSiteConfig } from "@/lib/config/schema";
import { db, orders, sites } from "@/lib/db";
import { formatPrice } from "@/lib/plans";
import { cn } from "@/lib/utils";

/**
 * Operator dashboard.
 *
 * Every number here is derived from the `sites` and `orders` tables — there
 * is no analytics table, no pixel, no cookie banner. The funnel a one-off
 * purchase actually needs (drafts → paid → published) is already implied by
 * the rows we keep to run the product, so collecting anything more would be
 * gathering data we don't need on people building a private gift.
 */
export const dynamic = "force-dynamic";

export const viewport = brandViewport;

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

const COOKIE = "hd_admin";

async function login(formData: FormData) {
  "use server";

  const token = String(formData.get("token") ?? "");
  if (!isAdmin(token)) return;

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    // Not `secure` in development, where there is no TLS to satisfy it.
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 60 * 60 * 12,
  });
}

export default async function AdminPage() {
  const jar = await cookies();

  if (!isAdmin(jar.get(COOKIE)?.value)) return <LoginForm />;

  const nowSec = Math.floor(Date.now() / 1000);
  const weekAgo = nowSec - 7 * 86_400;
  const count = (rows: { n: number } | undefined) => rows?.n ?? 0;

  const totalSites = count(db.select({ n: sql<number>`count(*)` }).from(sites).get());
  const drafts = count(
    db.select({ n: sql<number>`count(*)` }).from(sites).where(eq(sites.status, "DRAFT")).get(),
  );
  const published = count(
    db
      .select({ n: sql<number>`count(*)` })
      .from(sites)
      .where(eq(sites.status, "PUBLISHED"))
      .get(),
  );
  const draftsWeek = count(
    db.select({ n: sql<number>`count(*)` }).from(sites).where(gte(sites.createdAt, weekAgo)).get(),
  );
  const revenue = count(
    db
      .select({ n: sql<number>`coalesce(sum(${orders.amountCents}), 0)` })
      .from(orders)
      .where(eq(orders.status, "APPROVED"))
      .get(),
  );
  const expiringSoon = count(
    db
      .select({ n: sql<number>`count(*)` })
      .from(sites)
      .where(
        and(eq(sites.status, "PUBLISHED"), sql`${sites.expiresAt} < ${nowSec + 30 * 86_400}`),
      )
      .get(),
  );

  const conversion = totalSites > 0 ? (published / totalSites) * 100 : 0;

  const recentOrders = db.select().from(orders).orderBy(desc(orders.createdAt)).limit(15).all();

  const recentSites = db
    .select()
    .from(sites)
    .where(eq(sites.status, "PUBLISHED"))
    .orderBy(desc(sites.publishedAt))
    .limit(10)
    .all();

  return (
    <Shell nav={false} footer={null}>
      <main className="px-5 pb-16 pt-6 sm:px-8">
        <div className="mx-auto max-w-5xl space-y-10">
          <header className="flex items-center justify-between gap-4">
            <Logo />
            <h1 className="text-sm font-semibold text-brand-slate">Painel</h1>
          </header>

          <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <Stat label="Receita" value={formatPrice(revenue)} highlight />
            <Stat label="Publicados" value={String(published)} />
            <Stat label="Rascunhos" value={String(drafts)} />
            <Stat label="Novos (7d)" value={String(draftsWeek)} />
            <Stat label="Conversão" value={`${conversion.toFixed(1)}%`} />
            <Stat label="Vencem em 30d" value={String(expiringSoon)} />
          </section>

          <section>
            <h2 className="mb-3 text-sm font-bold">Pedidos recentes</h2>
            <Table
              head={["Data", "Plano", "Valor", "Status", "Método"]}
              rows={recentOrders.map((order) => [
                new Date(order.createdAt * 1000).toLocaleString("pt-BR"),
                order.plan,
                formatPrice(order.amountCents),
                order.status,
                order.mpPaymentMethod ?? "—",
              ])}
              empty="Nenhum pedido ainda."
            />
          </section>

          <section>
            <h2 className="mb-3 text-sm font-bold">Sites no ar</h2>
            <Table
              head={["Casal", "Link", "Publicado", "Expira"]}
              rows={recentSites.map((site) => {
                const config = parseSiteConfig(site.config);
                return [
                  `${config.couple.authorName} & ${config.couple.recipientName}`,
                  `/p/${site.slug}`,
                  site.publishedAt
                    ? new Date(site.publishedAt * 1000).toLocaleDateString("pt-BR")
                    : "—",
                  site.expiresAt
                    ? new Date(site.expiresAt * 1000).toLocaleDateString("pt-BR")
                    : "—",
                ];
              })}
              empty="Nenhum site publicado ainda."
            />
          </section>

          <p className="text-caption text-brand-slate/80">
            Números derivados das tabelas do próprio produto. Sem pixel, sem cookie de rastreio,
            sem serviço de terceiros.
          </p>
        </div>
      </main>
    </Shell>
  );
}

function LoginForm() {
  return (
    <Shell nav={false} footer={null}>
      <main className="grid min-h-[70dvh] place-items-center px-5 py-16 sm:px-8">
        <form action={login} className="w-full max-w-sm rounded-panel bg-brand-mist p-8 sm:p-10">
          <Logo />
          <h1 className="mt-8 text-lg font-extrabold tracking-[-0.02em]">Entrar no painel</h1>
          <label htmlFor="token" className="mt-6 block text-sm font-semibold">
            Token de admin
          </label>
          <input
            id="token"
            name="token"
            type="password"
            autoComplete="off"
            className={cn("mt-2", INPUT)}
          />
          <PillButton type="submit" tone="ink" className="mt-4 w-full">
            Entrar
          </PillButton>
        </form>
      </main>
    </Shell>
  );
}

interface StatProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function Stat({ label, value, highlight = false }: StatProps) {
  return (
    <div className={cn("rounded-card p-4", highlight ? "bg-brand-lav" : "bg-brand-mist")}>
      <p className="text-[11px] font-semibold text-brand-slate">{label}</p>
      <p className="mt-1 text-xl font-extrabold tracking-[-0.02em]">{value}</p>
    </div>
  );
}

interface TableProps {
  head: string[];
  rows: string[][];
  empty: string;
}

function Table({ head, rows, empty }: TableProps) {
  if (rows.length === 0) {
    return <p className="text-sm text-brand-slate">{empty}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-card border border-brand-ground">
      <table className="w-full text-sm">
        <thead className="bg-brand-mist text-left text-xs text-brand-slate">
          <tr>
            {head.map((column) => (
              <th key={column} className="px-4 py-2.5 font-semibold">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-ground">
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="whitespace-nowrap px-4 py-2.5 text-brand-ink">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
