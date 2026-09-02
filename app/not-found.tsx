import type { Metadata } from "next";

import { Pill } from "@/components/brand/Pill";
import { SceneLost } from "@/components/brand/scenes";
import { Shell } from "@/components/brand/Shell";
import { brandViewport } from "@/components/brand/viewport";

export const viewport = brandViewport;

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <Shell>
      <main className="grid min-h-[70dvh] place-items-center px-5 py-16 text-center sm:px-8">
        <div>
          <SceneLost className="mx-auto w-[240px] sm:w-[320px]" />
          <h1 className="mt-6 text-display sm:text-display-lg">
            Essa página flutuou pra longe.
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-body leading-relaxed text-brand-slate">
            O endereço não existe, ou o link que você recebeu venceu.
          </p>
          <Pill href="/" tone="ink" className="mt-8">
            Voltar pro início
          </Pill>
        </div>
      </main>
    </Shell>
  );
}
