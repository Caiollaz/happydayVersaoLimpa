import { ArrowRight } from "lucide-react";

import { Figure, type FigureName, SceneMain } from "@/components/brand/scenes";
import { SectionHeading } from "@/components/brand/SectionHeading";

const FLOW = ["Menos esforço", "Mais história", "Melhor reação"];

const FEATURES: { figure: FigureName; title: string; body: string }[] = [
  {
    figure: "phone",
    title: "Retrospectiva de onze telas",
    body: "Quantos dias juntos, a música do ano, a foto favorita. Passa sozinha, no ritmo da faixa, estilo Wrapped.",
  },
  {
    figure: "photos",
    title: "Os álbuns do relacionamento",
    body: "Os dates, a primeira viagem, as fotos aleatórias que só vocês entendem. Cada um com capa e galeria.",
  },
  {
    figure: "envelope",
    title: "A carta em tela cheia",
    body: "Do jeito que você escrever, sem limite de tamanho e sem template pronto pra preencher.",
  },
  {
    figure: "record",
    title: "A música de vocês tocando",
    body: "A tela abre com a faixa que é de vocês dois e as fotos passando como capa do disco.",
  },
];

export function WhatsInside() {
  return (
    <section id="dentro" className="scroll-mt-20 px-5 pb-20 sm:scroll-mt-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Feito em dez minutos, reaberto por anos."
          title={
            <>
              Não é um cartão. É um lugar
              <br className="hidden sm:inline" /> pra onde você manda alguém.
            </>
          }
        />

        <SceneMain className="mx-auto mt-8 w-full max-w-5xl" />

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
          {FLOW.map((step, i) => (
            <div key={step} className="flex items-center gap-4">
              <span className="text-lg font-bold tracking-[-0.02em] sm:text-xl">{step}</span>
              {i < FLOW.length - 1 && (
                <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-lav">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ figure, title, body }) => (
            <div key={figure} className="text-center sm:text-left">
              <Figure name={figure} className="mx-auto h-24 w-24 sm:mx-0" />
              <h3 className="mt-5 text-body font-bold leading-snug tracking-[-0.01em]">
                {title}
              </h3>
              <p className="mt-2 text-caption leading-relaxed text-brand-slate">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
