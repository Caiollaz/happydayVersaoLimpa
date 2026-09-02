import { SceneSend, SceneShape, SceneTell } from "@/components/brand/scenes";
import { SectionHeading } from "@/components/brand/SectionHeading";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    Scene: SceneTell,
    title: "Conte a história",
    body: "Os nomes, a data em que começou, a carta. Você parte de um site que já funciona e vai trocando pelo que é de vocês — nada de tela em branco.",
  },
  {
    Scene: SceneShape,
    title: "Personalize tudo",
    body: "Arraste as fotos pros álbuns, escolha a faixa, ligue ou desligue cada uma das onze telas da retrospectiva. É formulário, nunca código.",
  },
  {
    Scene: SceneSend,
    title: "Mande o link",
    body: "Veja a prévia — que é o site de verdade, não uma simulação. Pague com Pix ou cartão e o link chega no seu e-mail com o QR Code junto.",
  },
];

export function HowItWorks() {
  return (
    <section id="como" className="scroll-mt-20 px-3 pb-6 sm:scroll-mt-24 sm:px-4">
      <div className="rounded-panel bg-brand-mist px-5 py-16 sm:px-10 sm:py-20">
        <SectionHeading eyebrow="Como funciona" title="Pronto em três passos." />

        <div className="mx-auto mt-12 max-w-5xl space-y-14 lg:space-y-0">
          {STEPS.map(({ Scene, title, body }, i) => (
            <div
              key={title}
              className={cn(
                "flex flex-col items-center gap-6 sm:gap-12",
                i % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row",
              )}
            >
              <Scene className="w-full max-w-sm shrink-0 lg:w-[380px]" />
              <div className="max-w-md text-center lg:text-left">
                <h3 className="text-xl font-extrabold tracking-[-0.025em]">{title}</h3>
                <p className="mt-3 text-body leading-relaxed text-brand-slate">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
