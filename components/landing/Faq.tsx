import { ChevronDown } from "lucide-react";

import { SectionHeading } from "@/components/brand/SectionHeading";

const QUESTIONS = [
  {
    question: "Preciso saber programar?",
    answer:
      "Não. Você preenche campos e arrasta fotos, como num formulário. Nada de código em nenhum momento.",
  },
  {
    question: "Quanto tempo leva pra montar?",
    answer:
      "Cerca de 10 minutos se você já tiver as fotos separadas. Dá pra parar no meio e voltar depois — o rascunho fica salvo.",
  },
  {
    question: "Posso editar depois de publicar?",
    answer:
      "Pode, quantas vezes quiser. Você recebe um link de edição junto com o link do site, e as mudanças aparecem na hora.",
  },
  {
    question: "Por quanto tempo o site fica no ar?",
    answer: "Um ano a partir da publicação. Avisamos por e-mail antes de vencer.",
  },
  {
    question: "Quem mais pode ver o site?",
    answer:
      "Só quem tiver o link. Os sites não aparecem no Google — a gente marca todos como não-indexáveis.",
  },
  {
    question: "Funciona pra mandar pra fora do Brasil?",
    answer:
      "Funciona. É um link comum, abre em qualquer celular com internet, em qualquer país. Só o pagamento precisa ser feito daqui, por Pix ou cartão brasileiro.",
  },
  {
    question: "O que acontece com as minhas fotos?",
    answer:
      "Ficam no nosso servidor pra montar o site e mais nada. Antes de guardar, removemos os dados escondidos no arquivo — inclusive a localização de onde a foto foi tirada.",
  },
  {
    question: "Posso usar qualquer música?",
    answer:
      "Você escolhe do nosso catálogo de faixas licenciadas. Subir um arquivo próprio está no plano Premium, mas a responsabilidade pelos direitos passa a ser sua.",
  },
  {
    question: "E se a pessoa não gostar?",
    answer:
      "Monte o site inteiro de graça e veja a prévia antes de pagar. Se não ficar do jeito que você queria, é só não publicar.",
  },
];

export function Faq() {
  return (
    <section id="perguntas" className="scroll-mt-20 px-5 pb-24 sm:scroll-mt-24 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <SectionHeading eyebrow="Perguntas" title="O que costumam perguntar." />

        <div className="mt-10">
          {QUESTIONS.map(({ question, answer }) => (
            <details key={question} className="group border-b border-brand-ground">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-body font-semibold [&::-webkit-details-marker]:hidden">
                {question}
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-mist transition-transform duration-200 group-open:rotate-180">
                  <ChevronDown className="h-3.5 w-3.5" />
                </span>
              </summary>
              <p className="pb-5 pr-10 text-sm leading-relaxed text-brand-slate">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
