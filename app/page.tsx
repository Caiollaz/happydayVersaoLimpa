import type { Metadata } from "next";

import { Shell } from "@/components/brand/Shell";
import { brandViewport } from "@/components/brand/viewport";
import { Closing } from "@/components/landing/Closing";
import { Faq } from "@/components/landing/Faq";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Occasions } from "@/components/landing/Occasions";
import { Pricing } from "@/components/landing/Pricing";
import { WhatsInside } from "@/components/landing/WhatsInside";

export const viewport = brandViewport;

export const metadata: Metadata = {
  title: "Happyday — um presente pra abrir mais de uma vez",
  description:
    "Suas fotos, sua música e a história de vocês viram um site que abre no celular. Pronto em 10 minutos, a partir de R$29, com link e QR Code na hora.",
};

export default function LandingPage() {
  return (
    <Shell footer={<Closing />}>
      <main>
        <Hero />
        <WhatsInside />
        <HowItWorks />
        <Occasions />
        <Pricing />
        <Faq />
      </main>
    </Shell>
  );
}
