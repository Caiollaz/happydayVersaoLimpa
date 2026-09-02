"use client";

import type { StepProps } from "../Wizard";
import { TextArea, TextField } from "../fields";

/**
 * Step 4 — the letter.
 *
 * The one screen where people spend real time, so it is deliberately plain:
 * a big textarea and nothing competing with it.
 */
export function StepLetter({ draft }: StepProps) {
  const { config, patch } = draft;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-brand-ink">A carta</h1>
        <p className="mt-1 text-body text-brand-slate">
          Deixe uma linha em branco entre os parágrafos. Escreva{" "}
          <code className="rounded bg-brand-mist px-1.5 py-0.5 text-brand-ink">{"{recipient}"}</code>{" "}
          onde quiser o nome de quem recebe.
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Rótulo pequeno"
          value={config.letter.eyebrow}
          maxLength={40}
          onChange={(eyebrow) => patch({ letter: { eyebrow } })}
        />
        <TextField
          label="Título"
          value={config.letter.title}
          maxLength={60}
          onChange={(title) => patch({ letter: { title } })}
        />
      </div>

      <TextArea
        label="Sua carta"
        value={config.letter.body}
        rows={16}
        maxLength={8000}
        onChange={(body) => patch({ letter: { body } })}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Despedida"
          hint="A linha acima da assinatura"
          value={config.letter.signatureLabel}
          maxLength={60}
          onChange={(signatureLabel) => patch({ letter: { signatureLabel } })}
        />
        <TextField
          label="Assinatura"
          value={config.letter.signature}
          maxLength={60}
          onChange={(signature) => patch({ letter: { signature } })}
        />
      </div>

      <TextField
        label="Texto do botão"
        value={config.letter.ctaLabel}
        maxLength={40}
        onChange={(ctaLabel) => patch({ letter: { ctaLabel } })}
      />
    </div>
  );
}
