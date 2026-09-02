"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Loader2, TriangleAlert } from "lucide-react";

import { jakarta } from "@/components/brand/font";
import { Logo } from "@/components/brand/Logo";
import { PillButton } from "@/components/brand/Pill";
import type { SiteConfig } from "@/lib/config/schema";
import { cn } from "@/lib/utils";
import { useDraft, type Draft } from "@/lib/wizard/useDraft";

import { StepLetter } from "./steps/StepLetter";
import { StepMusic } from "./steps/StepMusic";
import { StepNames } from "./steps/StepNames";
import { StepPhotos } from "./steps/StepPhotos";
import { StepPreview } from "./steps/StepPreview";
import { StepRetro } from "./steps/StepRetro";

export interface StepProps {
  draft: Draft;
  siteId: string;
  token: string;
}

const STEPS = [
  { id: "names", label: "Vocês", hint: "Nomes e datas", Component: StepNames },
  { id: "photos", label: "Fotos", hint: "Os álbuns", Component: StepPhotos },
  { id: "music", label: "Música", hint: "A trilha do site", Component: StepMusic },
  { id: "letter", label: "A carta", hint: "O que você quer dizer", Component: StepLetter },
  { id: "retro", label: "Retrospectiva", hint: "As onze telas", Component: StepRetro },
  { id: "review", label: "Revisar", hint: "Prévia e pagamento", Component: StepPreview },
] as const;

type StepState = "done" | "current" | "upcoming";

function stateOf(step: number, current: number): StepState {
  if (step < current) return "done";
  if (step === current) return "current";
  return "upcoming";
}

interface WizardProps {
  siteId: string;
  token: string;
  initialConfig: SiteConfig;
}

export function Wizard({ siteId, token, initialConfig }: WizardProps) {
  const draft = useDraft(siteId, token, initialConfig);
  const [index, setIndex] = useState(0);
  const rail = useRef<HTMLElement>(null);

  const step = STEPS[index];
  const Component = step.Component;
  const isLast = index === STEPS.length - 1;

  useEffect(() => {
    rail.current
      ?.querySelector('[aria-current="step"]')
      ?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [index]);

  const go = async (next: number) => {
    await draft.flush();
    setIndex(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={cn(
        jakarta.variable,
        "brand-surface min-h-dvh bg-brand-ground font-display text-brand-ink",
      )}
    >
      <header className="safe-top sticky top-0 z-30 border-b border-brand-ground bg-brand-paper/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Logo />
          <SaveIndicator draft={draft} />
        </div>

        <nav
          ref={rail}
          aria-label="Etapas"
          className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden"
        >
          {STEPS.map((s, i) => {
            const state = stateOf(i, index);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => go(i)}
                aria-current={state === "current" ? "step" : undefined}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
                  state === "current" && "bg-brand-ink text-white",
                  state === "done" && "bg-brand-mint-pale text-brand-ink hover:bg-brand-mint-light",
                  state === "upcoming" && "text-brand-slate hover:bg-brand-mist hover:text-brand-ink",
                )}
              >
                {state === "done" && <Check className="h-3 w-3" strokeWidth={3} />}
                {s.label}
              </button>
            );
          })}
        </nav>
      </header>

      <div className="mx-auto max-w-6xl px-3 py-6 pb-32 sm:px-4 lg:grid lg:grid-cols-[240px_1fr] lg:gap-8 lg:py-8">
        <aside className="hidden lg:block">
          <ol aria-label="Etapas" className="sticky top-24">
            {STEPS.map((s, i) => (
              <StepItem
                key={s.id}
                number={i + 1}
                label={s.label}
                hint={s.hint}
                state={stateOf(i, index)}
                last={i === STEPS.length - 1}
                onSelect={() => go(i)}
              />
            ))}
          </ol>
        </aside>

        <main className="rounded-panel bg-brand-paper p-5 sm:p-8">
          <Component draft={draft} siteId={siteId} token={token} />
        </main>
      </div>

      <footer className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-brand-ground bg-brand-paper">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <PillButton
            tone="ghost"
            onClick={() => go(Math.max(0, index - 1))}
            disabled={index === 0}
            className="px-3 disabled:invisible sm:px-6"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </PillButton>

          <span className="shrink-0 whitespace-nowrap text-xs text-brand-slate">
            {index + 1} de {STEPS.length}
          </span>

          <PillButton
            tone="ink"
            onClick={() => go(Math.min(STEPS.length - 1, index + 1))}
            disabled={isLast}
            className="px-3 disabled:invisible sm:px-6"
          >
            Continuar
            <ChevronRight className="h-4 w-4" />
          </PillButton>
        </div>
      </footer>
    </div>
  );
}

interface StepItemProps {
  number: number;
  label: string;
  hint: string;
  state: StepState;
  last: boolean;
  onSelect: () => void;
}

function StepItem({ number, label, hint, state, last, onSelect }: StepItemProps) {
  return (
    <li className="relative">
      {!last && (
        <span
          aria-hidden
          className={cn(
            "absolute -bottom-2 left-[23px] top-10 w-0.5 rounded-full",
            state === "done" ? "bg-brand-mint-deep" : "bg-brand-lav-deep",
          )}
        />
      )}
      <button
        type="button"
        onClick={onSelect}
        aria-current={state === "current" ? "step" : undefined}
        className="flex w-full items-start gap-3 rounded-2xl px-2 py-2 text-left transition-colors hover:bg-brand-paper/70"
      >
        <span
          className={cn(
            "grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors",
            state === "current" && "bg-brand-ink text-white",
            state === "done" && "bg-brand-mint-deep text-white",
            state === "upcoming" && "border-2 border-brand-stroke bg-brand-paper text-brand-slate",
          )}
        >
          {state === "done" ? <Check className="h-4 w-4" strokeWidth={3} /> : number}
        </span>
        <span className="min-w-0 pt-1.5">
          <span
            className={cn(
              "block text-sm font-semibold leading-tight",
              state === "upcoming" ? "text-brand-slate" : "text-brand-ink",
            )}
          >
            {label}
          </span>
          <span className="mt-0.5 block text-xs text-brand-slate">{hint}</span>
        </span>
      </button>
    </li>
  );
}

function SaveIndicator({ draft }: { draft: Draft }) {
  const { save } = draft;

  return (
    <span role="status" className="flex items-center gap-1.5 text-xs text-brand-slate">
      {save.status === "saving" && (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          salvando…
        </>
      )}
      {save.status === "saved" && (
        <>
          <Check className="h-3.5 w-3.5 text-brand-mint-deep" />
          salvo
        </>
      )}
      {save.status === "error" && (
        <span className="flex items-center gap-1.5 text-brand-danger">
          <TriangleAlert className="h-3.5 w-3.5" />
          {save.message}
        </span>
      )}
      {save.status === "idle" && <span className="text-brand-slate/60">rascunho</span>}
    </span>
  );
}
