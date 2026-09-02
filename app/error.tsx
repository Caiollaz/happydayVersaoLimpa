"use client";

import { Pill, PillButton } from "@/components/brand/Pill";
import { SceneLost } from "@/components/brand/scenes";
import { Shell } from "@/components/brand/Shell";

interface ErrorPageProps {
  reset: () => void;
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <Shell>
      <main className="grid min-h-[70dvh] place-items-center px-5 py-16 text-center sm:px-8">
        <div>
          <SceneLost className="mx-auto w-[240px] sm:w-[320px]" />
          <h1 className="mt-6 text-display sm:text-display-lg">
            Alguma coisa saiu do lugar.
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-body leading-relaxed text-brand-slate">
            Nada do que você fez foi perdido. Tente de novo — se continuar, volte pro início.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <PillButton tone="ink" onClick={reset}>
              Tentar de novo
            </PillButton>
            <Pill href="/" tone="ghost">
              Voltar pro início
            </Pill>
          </div>
        </div>
      </main>
    </Shell>
  );
}
