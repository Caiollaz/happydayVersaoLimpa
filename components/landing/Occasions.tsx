import Link from "next/link";

import { Figure, type FigureName } from "@/components/brand/scenes";
import { SectionHeading } from "@/components/brand/SectionHeading";

const OCCASIONS: { figure: FigureName; label: string }[] = [
  { figure: "heart", label: "Aniversário de namoro" },
  { figure: "cake", label: "Aniversário" },
  { figure: "candle", label: "Dia dos Namorados" },
  { figure: "flower", label: "Dia das Mães" },
  { figure: "ring", label: "Pedido de casamento" },
  { figure: "balloon", label: "Só porque sim" },
];

export function Occasions() {
  return (
    <section id="ocasioes" className="scroll-mt-20 px-5 py-20 sm:scroll-mt-24 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Pra qualquer data"
          title="Serve pra qualquer motivo."
          description="O site é o mesmo. O que muda é a história que você conta nele."
        />

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {OCCASIONS.map(({ figure, label }) => (
            <Link
              key={figure}
              href="/criar"
              className="group flex flex-col items-center justify-center gap-4 rounded-panel bg-brand-mist px-5 py-9 text-center transition-colors hover:bg-brand-lav"
            >
              <Figure
                name={figure}
                className="h-24 w-24 transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-[-4deg]"
              />
              <span className="text-body font-semibold leading-snug">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
