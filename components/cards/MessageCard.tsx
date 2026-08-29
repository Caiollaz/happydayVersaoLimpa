"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { CardContainer } from "@/components/layout/CardContainer";
import { Button } from "@/components/ui/Button";
import { MessageModal } from "@/components/modals/MessageModal";
import { useSiteConfig, useText } from "@/lib/config/context";

export function MessageCard() {
  const { letter, couple } = useSiteConfig();
  const t = useText();
  const [open, setOpen] = useState(false);

  const message = t(letter.body);
  const previewText =
    message.trim().slice(0, 240).replace(/\s+\S*$/, "") + "…";

  return (
    <>
      <CardContainer id="card-message" className="bg-spotify-black">
        <div className="w-full max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-spotify-green mb-5">
            {letter.eyebrow}
          </p>

          <h2 className="text-3xl sm:text-5xl font-black text-white leading-[1.02] tracking-tight mb-8">
            {letter.title}
          </h2>

          {/* Preview card with fade mask */}
          <div className="relative rounded-2xl bg-spotify-card border border-white/5 p-6 sm:p-8 overflow-hidden">
            <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-spotify-green/10 blur-3xl pointer-events-none" />

            <div className="flex items-center gap-3 mb-4 relative">
              <div className="grid place-items-center h-10 w-10 rounded-full bg-spotify-green/20 text-spotify-green">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  De {couple.authorName}
                </p>
                <p className="text-xs text-spotify-text-secondary">
                  Para {couple.recipientName}
                </p>
              </div>
            </div>

            <div
              className="relative text-base sm:text-lg leading-relaxed text-spotify-text-secondary mask-fade-bottom max-h-36 overflow-hidden"
              aria-hidden
            >
              {previewText}
            </div>

            <div className="mt-6 relative">
              <Button onClick={() => setOpen(true)}>{letter.ctaLabel}</Button>
            </div>
          </div>
        </div>
      </CardContainer>

      <MessageModal
        open={open}
        onClose={() => setOpen(false)}
        title={letter.title}
        message={message}
        signatureLabel={t(letter.signatureLabel)}
        signature={t(letter.signature)}
      />
    </>
  );
}
