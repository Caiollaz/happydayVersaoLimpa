import { ShieldCheck } from "lucide-react";

import { Pill } from "@/components/brand/Pill";
import { SectionHeading } from "@/components/brand/SectionHeading";
import { PLANS, formatPrice } from "@/lib/plans";
import { cn } from "@/lib/utils";

export function Pricing() {
  return (
    <section id="precos" className="scroll-mt-20 px-5 pb-20 sm:scroll-mt-24 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Preço"
          title="Paga uma vez e pronto."
          description="Sem assinatura, sem renovação automática, sem cobrança surpresa."
        />

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {Object.values(PLANS).map((plan) => {
            const featured = plan.id === "premium";

            return (
              <div
                key={plan.id}
                className={cn("rounded-panel p-8", featured ? "bg-brand-lav" : "bg-brand-mist")}
              >
                <h3 className="text-body font-bold">{plan.name}</h3>

                <p className="mt-2 flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold tracking-[-0.045em]">
                    {formatPrice(plan.priceCents)}
                  </span>
                  <span className="text-sm text-brand-slate">uma vez</span>
                </p>

                <ul className="mt-7 space-y-3">
                  {plan.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-3 text-sm leading-snug">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-pink-deep" />
                      <span className={cn(!featured && "text-brand-slate")}>{highlight}</span>
                    </li>
                  ))}
                </ul>

                <Pill href="/criar" tone={featured ? "paper" : "solid"} className="mt-8 w-full">
                  {featured ? "Criar meu presente" : "Começar pelo Básico"}
                </Pill>
              </div>
            );
          })}
        </div>

        <p className="mt-8 flex items-center justify-center gap-2 text-caption text-brand-slate">
          <ShieldCheck className="h-4 w-4" />
          Pix ou cartão, pelo Mercado Pago. Não guardamos dados do seu cartão.
        </p>
      </div>
    </section>
  );
}
