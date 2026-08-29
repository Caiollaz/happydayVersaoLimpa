import type { Metadata } from "next";
import Link from "next/link";
import {
  Camera,
  Disc3,
  Heart,
  Link2,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { PLANS, formatPrice } from "@/lib/plans";

/**
 * The sales page.
 *
 * Deliberately carries no testimonials, review counts or "X sites criados"
 * numbers: the product has no customers yet, and inventing proof is both
 * dishonest and the fastest way to lose the trust this purchase runs on.
 * The demo does the persuading instead — it is the strongest honest proof
 * available, because it *is* the product.
 */
export const metadata: Metadata = {
  title: "Happyday — um presente pra abrir mais de uma vez",
  description:
    "Monte um site com as fotos, a música e a história de vocês. Fica pronto em 10 minutos, custa a partir de R$29 e o link é seu pra sempre compartilhar.",
};

export default function LandingPage() {
  return (
    <main className="bg-spotify-black text-white">
      <Hero />
      <WhatTheyGet />
      <HowItWorks />
      <Pricing />
      <Faq />
      <FinalCta />
      <Footer />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-24 sm:pt-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(29,185,84,0.18) 0%, rgba(18,18,18,0) 55%)",
        }}
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-spotify-green">
          Presente de namoro
        </p>

        <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
          Um presente pra abrir
          <br />
          <span className="text-spotify-green">mais de uma vez.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg text-white/60">
          As fotos de vocês, a música de vocês e uma retrospectiva do
          relacionamento — num site com link próprio. Você monta em 10 minutos,
          sem saber nada de programação.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/criar"
            className="w-full rounded-full bg-spotify-green px-8 py-4 text-base font-bold text-black transition-transform hover:scale-[1.03] active:scale-95 sm:w-auto"
          >
            Montar o meu
          </Link>
          <Link
            href="/demo"
            className="w-full rounded-full border border-white/20 px-8 py-4 text-base font-semibold text-white/80 transition-colors hover:bg-white/5 sm:w-auto"
          >
            Ver um exemplo pronto
          </Link>
        </div>

        <p className="mt-5 text-sm text-white/40">
          Monte inteiro de graça. Só paga quando quiser o link.
        </p>
      </div>
    </section>
  );
}

function WhatTheyGet() {
  const items = [
    {
      Icon: Disc3,
      title: "Um player com as fotos de vocês",
      body: "A tela abre tocando a música que é de vocês dois, com as fotos passando como capa.",
    },
    {
      Icon: Mail,
      title: "A carta que você escrever",
      body: "Do jeito que você escrever. Sem limite de tamanho, sem template pronto pra preencher.",
    },
    {
      Icon: Camera,
      title: "Os álbuns do relacionamento",
      body: "Os dates, a primeira viagem, as fotos aleatórias que só vocês entendem.",
    },
    {
      Icon: Heart,
      title: "A retrospectiva de vocês",
      body: "Onze telas em estilo Wrapped: quantos dias juntos, quantas mensagens, a música do ano, a foto favorita.",
    },
  ];

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-3xl font-black tracking-tight sm:text-4xl">
          O que a pessoa vai ver
        </h2>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {items.map(({ Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6"
            >
              <Icon className="h-6 w-6 text-spotify-green" strokeWidth={2.25} />
              <h3 className="mt-4 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "1",
      title: "Suba as fotos e escreva",
      body: "Nomes, datas, a carta, os álbuns. Você começa de um site que já funciona e vai trocando pelo que é de vocês.",
    },
    {
      n: "2",
      title: "Veja como ficou",
      body: "A prévia é o site de verdade, não uma simulação. O que você aprovar é exatamente o que a pessoa vai abrir.",
    },
    {
      n: "3",
      title: "Pague e mande o link",
      body: "Pix ou cartão. O link chega no seu e-mail em segundos e é só mandar no WhatsApp.",
    },
  ];

  return (
    <section className="border-y border-white/[0.06] bg-white/[0.015] px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-3xl font-black tracking-tight sm:text-4xl">
          Como funciona
        </h2>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {steps.map(({ n, title, body }) => (
            <div key={n}>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-spotify-green text-sm font-black text-black">
                {n}
              </span>
              <h3 className="mt-4 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="precos" className="px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-3xl font-black tracking-tight sm:text-4xl">
          Preço
        </h2>
        <p className="mt-3 text-center text-white/55">
          Pagamento único. Sem assinatura, sem renovação automática.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {Object.values(PLANS).map((plan) => {
            const featured = plan.id === "premium";

            return (
              <div
                key={plan.id}
                className={
                  featured
                    ? "relative rounded-2xl border-2 border-spotify-green bg-spotify-green/[0.06] p-7"
                    : "rounded-2xl border border-white/[0.08] bg-white/[0.02] p-7"
                }
              >
                {featured && (
                  <span className="absolute -top-3 left-7 rounded-full bg-spotify-green px-3 py-1 text-[11px] font-black uppercase tracking-wider text-black">
                    Mais escolhido
                  </span>
                )}

                <h3 className="text-lg font-bold">{plan.name}</h3>
                <p className="mt-2 text-4xl font-black">
                  {formatPrice(plan.priceCents)}
                </p>

                <ul className="mt-6 space-y-2.5">
                  {plan.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex gap-2.5 text-sm leading-snug text-white/65"
                    >
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-spotify-green" />
                      {h}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/criar"
                  className={
                    featured
                      ? "mt-7 block rounded-full bg-spotify-green py-3 text-center font-bold text-black"
                      : "mt-7 block rounded-full border border-white/20 py-3 text-center font-semibold text-white/85 hover:bg-white/5"
                  }
                >
                  Começar
                </Link>
              </div>
            );
          })}
        </div>

        <p className="mt-8 flex items-center justify-center gap-2 text-sm text-white/45">
          <ShieldCheck className="h-4 w-4" />
          Pix ou cartão, pelo Mercado Pago. Não guardamos dados do seu cartão.
        </p>
      </div>
    </section>
  );
}

function Faq() {
  const items = [
    {
      q: "Preciso saber programar?",
      a: "Não. Você preenche campos e arrasta fotos, como num formulário. Nada de código em nenhum momento.",
    },
    {
      q: "Quanto tempo leva pra montar?",
      a: "Cerca de 10 minutos se você já tiver as fotos separadas. Dá pra parar no meio e voltar depois — o rascunho fica salvo.",
    },
    {
      q: "Posso editar depois de publicar?",
      a: "Pode, quantas vezes quiser. Você recebe um link de edição junto com o link do site, e as mudanças aparecem na hora.",
    },
    {
      q: "Por quanto tempo o site fica no ar?",
      a: "Um ano a partir da publicação. Avisamos por e-mail antes de vencer.",
    },
    {
      q: "Quem mais pode ver o site?",
      a: "Só quem tiver o link. Os sites não aparecem no Google — a gente marca todos como não-indexáveis.",
    },
    {
      q: "O que acontece com as minhas fotos?",
      a: "Ficam no nosso servidor pra montar o site e mais nada. Antes de guardar, removemos os dados escondidos no arquivo — inclusive a localização de onde a foto foi tirada.",
    },
    {
      q: "Posso usar qualquer música?",
      a: "Você escolhe do nosso catálogo de faixas licenciadas. Subir um arquivo próprio está no plano Premium, mas a responsabilidade pelos direitos passa a ser sua.",
    },
    {
      q: "E se a pessoa não gostar?",
      a: "Monte o site inteiro de graça e veja a prévia antes de pagar. Se não ficar do jeito que você queria, é só não publicar.",
    },
  ];

  return (
    <section className="border-t border-white/[0.06] px-6 py-20">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-center text-3xl font-black tracking-tight sm:text-4xl">
          Perguntas
        </h2>

        <dl className="mt-12 space-y-7">
          {items.map(({ q, a }) => (
            <div key={q}>
              <dt className="font-bold">{q}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-white/55">
                {a}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl">
          Dá pra montar antes do café esfriar.
        </h2>
        <p className="mt-4 text-white/55">
          Comece agora e veja como fica. Você só paga se gostar do resultado.
        </p>

        <Link
          href="/criar"
          className="mt-8 inline-block rounded-full bg-spotify-green px-10 py-4 text-base font-bold text-black transition-transform hover:scale-[1.03] active:scale-95"
        >
          Montar o meu presente
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/[0.06] px-6 py-10">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 text-sm text-white/40 sm:flex-row sm:justify-between">
        <span className="flex items-center gap-1.5">
          <Link2 className="h-3.5 w-3.5" />
          Happyday
        </span>
        <nav className="flex flex-wrap justify-center gap-5">
          <Link href="/demo" className="hover:text-white/70">
            Exemplo
          </Link>
          <Link href="/#precos" className="hover:text-white/70">
            Preço
          </Link>
          <Link href="/termos" className="hover:text-white/70">
            Termos
          </Link>
          <Link href="/privacidade" className="hover:text-white/70">
            Privacidade
          </Link>
        </nav>
      </div>
    </footer>
  );
}
