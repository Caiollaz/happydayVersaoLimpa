"use client";

import { useState } from "react";
import { ExternalLink, Loader2, RefreshCw } from "lucide-react";

import { INPUT } from "@/components/brand/input";
import { Pill, PillButton } from "@/components/brand/Pill";
import { PLANS, formatPrice, type PlanId } from "@/lib/plans";
import { cn } from "@/lib/utils";

import type { StepProps } from "../Wizard";

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Step 6 — see it, then pay for it.
 *
 * The preview is a real render of the site in an iframe, not a mockup: it
 * hits the same route a visitor would, so what they approve is exactly what
 * gets published. `key` forces a reload after edits, since the iframe has
 * no idea the draft changed.
 */
export function StepPreview({ draft, siteId, token }: StepProps) {
  const { config, flush } = draft;
  const [nonce, setNonce] = useState(0);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState<PlanId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const previewUrl = `/preview/${token}`;

  const buy = async (plan: PlanId) => {
    setError(null);

    if (!EMAIL_PATTERN.test(email)) {
      setError("preciso de um e-mail válido pra te mandar o link");
      return;
    }

    setBusy(plan);
    // Any unsaved edit must land before Mercado Pago takes over the tab.
    const saved = await flush();
    if (saved.status === "error") {
      setError(`${saved.message} — confira a conexão antes de pagar`);
      setBusy(null);
      return;
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json", "x-edit-token": token },
        body: JSON.stringify({ siteId, plan, email }),
      });
      const json = await res.json();

      if (!res.ok || typeof json.initPoint !== "string") {
        setError(json.error ?? "não consegui abrir o checkout");
        setBusy(null);
        return;
      }

      window.location.href = json.initPoint;
    } catch {
      setError("sem conexão — tente de novo");
      setBusy(null);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-brand-ink">Como ficou</h1>
        <p className="mt-1 text-body text-brand-slate">
          Esta é a versão real do site. Só falta escolher o plano pra tirar a marca d’água e ganhar
          o link.
        </p>
      </header>

      <div className="xl:grid xl:grid-cols-[380px_1fr] xl:items-start xl:gap-8">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <PillButton
              tone="ghost"
              onClick={() => setNonce((n) => n + 1)}
              className="px-4 py-2 text-xs"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Atualizar
            </PillButton>
            <Pill
              href={previewUrl}
              tone="ghost"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 text-xs"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Abrir em outra aba
            </Pill>
          </div>

          {/* Phone-shaped frame: these sites are opened on a phone essentially
              always, so previewing them at desktop width would mislead. */}
          <div className="mx-auto w-full max-w-[380px] overflow-hidden rounded-[2rem] border-4 border-brand-ink bg-brand-ink shadow-phone">
            <iframe
              key={nonce}
              src={previewUrl}
              title="Prévia do site"
              className="h-[min(680px,70dvh)] w-full lg:h-[680px]"
              // The preview renders user-authored content; keeping it in a
              // restrictive sandbox means a future rich-text field can't script
              // its way into the wizard around it.
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>

        <section className="mt-8 space-y-4 rounded-card bg-brand-mist p-5 sm:p-6 xl:sticky xl:top-24 xl:mt-0">
          <h2 className="text-lg font-extrabold tracking-[-0.02em] text-brand-ink">
            Escolha o plano
          </h2>

          <div>
            <label htmlFor="buyer-email" className="mb-2 block text-sm font-semibold text-brand-ink">
              Seu e-mail
            </label>
            <input
              id="buyer-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
              autoComplete="email"
              className={INPUT}
            />
            <p className="mt-1.5 text-xs text-brand-slate">
              É pra onde vai o link do site e o link de edição.
            </p>
          </div>

          {Object.values(PLANS).map((plan) => {
            const blocked = config.retro.enabled && !plan.retrospective;

            return (
              <div key={plan.id} className="rounded-2xl bg-brand-paper p-5">
                <div className={cn(blocked && "opacity-50")}>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-base font-bold text-brand-ink">{plan.name}</h3>
                    <span className="text-xl font-extrabold tracking-[-0.02em] text-brand-ink">
                      {formatPrice(plan.priceCents)}
                    </span>
                  </div>

                  <ul className="mt-3 space-y-1.5">
                    {plan.highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-2.5 text-sm text-brand-slate">
                        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-pink-deep" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                {blocked ? (
                  <p className="mt-4 text-xs text-brand-danger">
                    Você ativou a retrospectiva — ela só existe no Premium. Desligue no passo
                    anterior pra usar este plano.
                  </p>
                ) : (
                  <PillButton
                    tone="ink"
                    onClick={() => buy(plan.id)}
                    disabled={busy !== null}
                    className="mt-4 w-full"
                  >
                    {busy === plan.id && <Loader2 className="h-4 w-4 animate-spin" />}
                    Pagar com Pix ou cartão
                  </PillButton>
                )}
              </div>
            );
          })}

          {error && (
            <p role="alert" className="text-sm text-brand-danger">
              {error}
            </p>
          )}

          <p className="text-xs text-brand-slate">Pagamento único. O site fica no ar por 1 ano.</p>
        </section>
      </div>
    </div>
  );
}
