import type { Metadata } from "next";
import { cookies } from "next/headers";
import { and, desc, eq, gte, sql } from "drizzle-orm";

import { isAdmin } from "@/lib/admin";
import { db, orders, sites } from "@/lib/db";
import { formatPrice } from "@/lib/plans";
import { parseSiteConfig } from "@/lib/config/schema";

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

  const totalSites = count(
    db.select({ n: sql<number>`count(*)` }).from(sites).get(),
  );
  const drafts = count(
    db.select({ n: sql<number>`count(*)` }).from(sites)
      .where(eq(sites.status, "DRAFT")).get(),
  );
  const published = count(
    db.select({ n: sql<number>`count(*)` }).from(sites)
      .where(eq(sites.status, "PUBLISHED")).get(),
  );
  const draftsWeek = count(
    db.select({ n: sql<number>`count(*)` }).from(sites)
      .where(gte(sites.createdAt, weekAgo)).get(),
  );
  const revenue = count(
    db.select({ n: sql<number>`coalesce(sum(${orders.amountCents}), 0)` })
      .from(orders).where(eq(orders.status, "APPROVED")).get(),
  );
  const expiringSoon = count(
    db.select({ n: sql<number>`count(*)` }).from(sites)
      .where(and(
        eq(sites.status, "PUBLISHED"),
        sql`${sites.expiresAt} < ${nowSec + 30 * 86_400}`,
      )).get(),
  );

  const conversion = totalSites > 0 ? (published / totalSites) * 100 : 0;

  const recentOrders = db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt))
    .limit(15)
    .all();

  const recentSites = db
    .select()
    .from(sites)
    .where(eq(sites.status, "PUBLISHED"))
    .orderBy(desc(sites.publishedAt))
    .limit(10)
    .all();

  return (
    <main className="min-h-[100dvh] bg-spotify-black px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl space-y-10">
        <h1 className="text-2xl font-black">Painel</h1>

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Stat label="Receita" value={formatPrice(revenue)} highlight />
          <Stat label="Publicados" value={String(published)} />
          <Stat label="Rascunhos" value={String(drafts)} />
          <Stat label="Novos (7d)" value={String(draftsWeek)} />
          <Stat label="Conversão" value={`${conversion.toFixed(1)}%`} />
          <Stat label="Vencem em 30d" value={String(expiringSoon)} />
        </section>

        <section>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-white/50">
            Pedidos recentes
          </h2>
          <Table
            head={["Data", "Plano", "Valor", "Status", "Método"]}
            rows={recentOrders.map((o) => [
              new Date(o.createdAt * 1000).toLocaleString("pt-BR"),
              o.plan,
              formatPrice(o.amountCents),
              o.status,
              o.mpPaymentMethod ?? "—",
            ])}
            empty="Nenhum pedido ainda."
          />
        </section>

        <section>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-white/50">
            Sites no ar
          </h2>
          <Table
            head={["Casal", "Link", "Publicado", "Expira"]}
            rows={recentSites.map((s) => {
              const c = parseSiteConfig(s.config);
              return [
                `${c.couple.authorName} & ${c.couple.recipientName}`,
                `/p/${s.slug}`,
                s.publishedAt
                  ? new Date(s.publishedAt * 1000).toLocaleDateString("pt-BR")
                  : "—",
                s.expiresAt
                  ? new Date(s.expiresAt * 1000).toLocaleDateString("pt-BR")
                  : "—",
              ];
            })}
            empty="Nenhum site publicado ainda."
          />
        </section>

        <p className="text-xs text-white/35">
          Números derivados das tabelas do próprio produto. Sem pixel, sem
          cookie de rastreio, sem serviço de terceiros.
        </p>
      </div>
    </main>
  );
}

function LoginForm() {
  return (
    <main className="grid min-h-[100dvh] place-items-center bg-spotify-black px-6">
      <form action={login} className="w-full max-w-xs">
        <label
          htmlFor="token"
          className="mb-2 block text-sm font-semibold text-white"
        >
          Token de admin
        </label>
        <input
          id="token"
          name="token"
          type="password"
          autoComplete="off"
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-spotify-green"
        />
        <button
          type="submit"
          className="mt-3 w-full rounded-full bg-spotify-green py-3 font-bold text-black"
        >
          Entrar
        </button>
      </form>
    </main>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-white/45">
        {label}
      </p>
      <p
        className={
          highlight
            ? "mt-1 text-xl font-black text-spotify-green"
            : "mt-1 text-xl font-black text-white"
        }
      >
        {value}
      </p>
    </div>
  );
}

function Table({
  head,
  rows,
  empty,
}: {
  head: string[];
  rows: string[][];
  empty: string;
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-white/40">{empty}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <thead className="bg-white/[0.03] text-left text-xs uppercase tracking-wider text-white/45">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-4 py-2.5 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.06]">
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="whitespace-nowrap px-4 py-2.5 text-white/70">
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
