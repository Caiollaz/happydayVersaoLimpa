"use client";

import { useState } from "react";
import { Check, ChevronLeft, ChevronRight, Loader2, TriangleAlert } from "lucide-react";

import type { SiteConfig } from "@/lib/config/schema";
import { useDraft, type Draft } from "@/lib/wizard/useDraft";
import { cn } from "@/lib/utils";

import { StepNames } from "./steps/StepNames";
import { StepPhotos } from "./steps/StepPhotos";
import { StepMusic } from "./steps/StepMusic";
import { StepLetter } from "./steps/StepLetter";
import { StepRetro } from "./steps/StepRetro";
import { StepPreview } from "./steps/StepPreview";

export interface StepProps {
  draft: Draft;
  siteId: string;
  token: string;
}

const STEPS = [
  { id: "names",  label: "Vocês",         Component: StepNames },
  { id: "photos", label: "Fotos",         Component: StepPhotos },
  { id: "music",  label: "Música",        Component: StepMusic },
  { id: "letter", label: "A carta",       Component: StepLetter },
  { id: "retro",  label: "Retrospectiva", Component: StepRetro },
  { id: "review", label: "Revisar",       Component: StepPreview },
] as const;

export function Wizard({
  siteId,
  token,
  initialConfig,
}: {
  siteId: string;
  token: string;
  initialConfig: SiteConfig;
}) {
  const draft = useDraft(siteId, token, initialConfig);
  const [index, setIndex] = useState(0);

  const step = STEPS[index];
  const Component = step.Component;
  const isLast = index === STEPS.length - 1;

  // Any pending edit is written before leaving a step, so the preview on
  // the next screen can never show stale content.
  const go = async (next: number) => {
    await draft.flush();
    setIndex(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-[100dvh] bg-spotify-black">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-spotify-black/90 backdrop-blur safe-top">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-3">
          <span className="text-sm font-bold text-white">
            Montando seu site
          </span>
          <SaveIndicator draft={draft} />
        </div>

        {/* Step rail — clickable, because people jump back to fix a typo
            far more often than they walk forward one screen at a time. */}
        <nav className="mx-auto flex max-w-3xl gap-1 overflow-x-auto px-5 pb-3">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => go(i)}
              aria-current={i === index ? "step" : undefined}
              className={cn(
                "shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                i === index
                  ? "bg-spotify-green text-black"
                  : i < index
                    ? "bg-white/10 text-white/80 hover:bg-white/15"
                    : "text-white/40 hover:text-white/70",
              )}
            >
              {i < index && <Check className="mr-1 inline h-3 w-3" />}
              {s.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-8 pb-28">
        <Component draft={draft} siteId={siteId} token={token} />
      </main>

      <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-spotify-black/90 backdrop-blur safe-bottom">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-5 py-3">
          <button
            type="button"
            onClick={() => go(Math.max(0, index - 1))}
            disabled={index === 0}
            className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-white/70 transition-colors hover:text-white disabled:invisible"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </button>

          <span className="text-xs text-white/40">
            {index + 1} de {STEPS.length}
          </span>

          <button
            type="button"
            onClick={() => go(Math.min(STEPS.length - 1, index + 1))}
            disabled={isLast}
            className="flex items-center gap-1 rounded-full bg-spotify-green px-5 py-2 text-sm font-bold text-black transition-transform hover:scale-[1.03] active:scale-95 disabled:invisible"
          >
            Continuar
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}

function SaveIndicator({ draft }: { draft: Draft }) {
  const { save } = draft;

  if (save.status === "saving") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-white/50">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        salvando…
      </span>
    );
  }
  if (save.status === "saved") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-white/50">
        <Check className="h-3.5 w-3.5 text-spotify-green" />
        salvo
      </span>
    );
  }
  if (save.status === "error") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-amber-400">
        <TriangleAlert className="h-3.5 w-3.5" />
        {save.message}
      </span>
    );
  }
  return <span className="text-xs text-white/30">rascunho</span>;
}
