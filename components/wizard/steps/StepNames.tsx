"use client";

import type { StepProps } from "../Wizard";
import { DateField, TextField } from "../fields";

/**
 * Step 1 — who the site is for, and the dates that drive every counter.
 *
 * The names propagate to about eight places (the landing headline, the
 * letter's From/To, the retrospective's opening slide, the recap poster),
 * so this is the single screen that changes the most of the site.
 */
export function StepNames({ draft }: StepProps) {
  const { config, patch } = draft;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-black text-white">Sobre vocês</h1>
        <p className="mt-1 text-sm text-white/50">
          Os nomes aparecem em várias partes do site. As datas alimentam os
          contadores.
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Seu nome"
          hint="quem está dando o presente"
          value={config.couple.authorName}
          maxLength={40}
          placeholder="Léo"
          onChange={(authorName) => patch({ couple: { authorName } })}
        />
        <TextField
          label="Nome de quem vai receber"
          value={config.couple.recipientName}
          maxLength={40}
          placeholder="Ana"
          onChange={(recipientName) => patch({ couple: { recipientName } })}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <DateField
          label="Quando se conheceram"
          hint="alimenta os “dias juntos”"
          value={config.dates.met}
          onChange={(met) => patch({ dates: { met } })}
        />
        <DateField
          label="Início do namoro"
          hint="alimenta o contador da home"
          value={config.dates.relationshipStart}
          onChange={(relationshipStart) =>
            patch({
              dates: { relationshipStart },
              // The subtitle is free text but starts as "Juntos desde
              // <ano>". Left alone it would keep showing the example's year
              // after the couple sets their own date.
              about: { subtitle: `Juntos desde ${relationshipStart.slice(0, 4)}` },
            })
          }
        />
        <DateField
          label="Data da comemoração"
          hint="aparece na tela de abertura"
          value={config.dates.gift}
          onChange={(gift) => patch({ dates: { gift } })}
        />
      </div>

      <div className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <h2 className="text-sm font-bold text-white">Tela de abertura</h2>
        <TextField
          label="Título"
          hint="use *asteriscos* pra destacar uma palavra em verde · {author} e {recipient} viram os nomes"
          value={config.anchor.headline}
          maxLength={120}
          onChange={(headline) => patch({ anchor: { headline } })}
        />
        <TextField
          label="Subtítulo"
          value={config.anchor.subhead}
          maxLength={200}
          onChange={(subhead) => patch({ anchor: { subhead } })}
        />
        <TextField
          label="Texto do botão"
          value={config.anchor.ctaLabel}
          maxLength={30}
          onChange={(ctaLabel) => patch({ anchor: { ctaLabel } })}
        />
      </div>
    </div>
  );
}
