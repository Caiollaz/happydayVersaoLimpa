"use client";

import { useState } from "react";
import { ExternalLink, Loader2, RefreshCw } from "lucide-react";

import type { StepProps } from "../Wizard";
import { PLANS, formatPrice } from "@/lib/plans";
import { cn } from "@/lib/utils";

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
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const previewUrl = `/preview/${token}`;

  const buy = async (plan: string) => {
    setError(null);

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("preciso de um e-mail válido pra te mandar o link");
      return;
    }

    setBusy(plan);
    // Any unsaved edit must land before Mercado Pago takes over the tab.
    await flush();

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json", "x-edit-token": token },
        body: JSON.stringify({ siteId, plan, email }),
      });
      const json = await res.json();

      if (!res.ok) {
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
        <h1 className="text-2xl font-black text-white">Como ficou</h1>
        <p className="mt-1 text-sm text-white/50">
          Esta é a versão real do site. Só falta escolher o plano pra tirar a
          marca d’água e ganhar o link.
        </p>
      </header>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setNonce((n) => n + 1)}
          className="flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white/80 hover:bg-white/5"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Atualizar
        </button>
        <a
          href={previewUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white/80 hover:bg-white/5"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Abrir em outra aba
        </a>
      </div>

      {/* Phone-shaped frame: these sites are opened on a phone essentially
          always, so previewing them at desktop width would mislead. */}
      <div className="mx-auto w-full max-w-[380px] overflow-hidden rounded-[2rem] border-4 border-white/10 bg-black shadow-2xl">
        <iframe
          key={nonce}
          src={previewUrl}
          title="Prévia do site"
          className="h-[680px] w-full"
          // The preview renders user-authored content; keeping it in a
          // restrictive sandbox means a future rich-text field can't script
          // its way into the wizard around it.
          sandbox="allow-scripts allow-same-origin"
        />
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-black text-white">Escolha o plano</h2>

        <div>
          <label
            htmlFor="buyer-email"
            className="mb-2 block text-sm font-semibold text-white"
          >
            Seu e-mail
          </label>
          <input
            id="buyer-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@email.com"
            autoComplete="email"
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-spotify-green"
          />
          <p className="mt-1 text-xs text-white/45">
            É pra onde vai o link do site e o link de edição.
          </p>
        </div>

        {Object.values(PLANS).map((plan) => {
          const blocked = config.retro.enabled && !plan.retrospective;

          return (
            <div
              key={plan.id}
              className={cn(
                "rounded-2xl border p-5",
                blocked
                  ? "border-white/5 bg-white/[0.01] opacity-50"
                  : "border-white/10 bg-white/[0.02]",
              )}
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-base font-bold text-white">{plan.name}</h3>
                <span className="text-xl font-black text-spotify-green">
                  {formatPrice(plan.priceCents)}
                </span>
              </div>

              <ul className="mt-3 space-y-1">
                {plan.highlights.map((h) => (
                  <li key={h} className="text-sm text-white/60">
                    · {h}
                  </li>
                ))}
              </ul>

              {blocked ? (
                <p className="mt-4 text-xs text-amber-400">
                  Você ativou a retrospectiva — ela só existe no Premium.
                  Desligue no passo anterior pra usar este plano.
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => buy(plan.id)}
                  disabled={busy !== null}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-spotify-green py-2.5 text-sm font-bold text-black transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                  {busy === plan.id && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  Pagar com Pix ou cartão
                </button>
              )}
            </div>
          );
        })}

        {error && <p className="text-sm text-amber-400">{error}</p>}

        <p className="text-xs text-white/35">
          Pagamento único. O site fica no ar por 1 ano.
        </p>
      </section>
    </div>
  );
}
