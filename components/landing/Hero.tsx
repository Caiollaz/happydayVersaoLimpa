import { Play } from "lucide-react";

import { DRIFT, RISE, drift, riseDelay } from "@/components/brand/motion";
import { paleClassAt } from "@/components/brand/palette";
import { Pill } from "@/components/brand/Pill";
import { Figure, HeroHeart, HeroLeft, HeroRight } from "@/components/brand/scenes";
import { cn } from "@/lib/utils";

const STONES: { left: string; top: string; width: string; tilt: `${number}deg` }[] = [
  { left: "20%", top: "16%", width: "clamp(38px,4vw,64px)", tilt: "-4deg" },
  { left: "31%", top: "9%", width: "clamp(30px,3vw,48px)", tilt: "3deg" },
  { left: "44%", top: "6%", width: "clamp(36px,3.6vw,58px)", tilt: "-2deg" },
  { left: "57%", top: "8%", width: "clamp(28px,2.8vw,44px)", tilt: "5deg" },
  { left: "67%", top: "14%", width: "clamp(34px,3.4vw,54px)", tilt: "-3deg" },
  { left: "14%", top: "31%", width: "clamp(26px,2.6vw,42px)", tilt: "6deg" },
  { left: "76%", top: "28%", width: "clamp(30px,3vw,48px)", tilt: "-6deg" },
  { left: "8%", top: "52%", width: "clamp(30px,3vw,50px)", tilt: "-5deg" },
  { left: "85%", top: "48%", width: "clamp(26px,2.6vw,44px)", tilt: "7deg" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden px-5 pb-20 pt-4 sm:pb-24 sm:pt-6">
      <HeroLeft className="pointer-events-none absolute -left-16 top-24 hidden w-[220px] md:block lg:top-20 lg:w-[300px] xl:w-[380px] 2xl:-left-20 2xl:w-[480px]" />
      <HeroRight className="pointer-events-none absolute -right-16 top-20 hidden w-[220px] md:block lg:top-16 lg:w-[300px] xl:w-[380px] 2xl:-right-20 2xl:w-[480px]" />
      <HeroHeart className="pointer-events-none absolute left-[9%] top-[8%] hidden w-[110px] lg:block 2xl:w-[140px]" />

      <Figure
        name="paper-plane"
        className={cn(
          DRIFT,
          "pointer-events-none absolute left-[22%] top-[44%] hidden w-[120px] lg:block 2xl:w-[150px]",
        )}
        style={drift(9, "-8deg")}
      />

      <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
        {STONES.map(({ left, top, width, tilt }, i) => (
          <span
            key={`${left}-${top}`}
            className={cn(DRIFT, "absolute block rounded-full", paleClassAt(i))}
            style={{
              left,
              top,
              width,
              height: "clamp(12px,1.3vw,20px)",
              ...drift(7 + i * 0.8, tilt, i * -1.1),
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-2xl pt-8 text-center sm:pt-20">
        <h1
          className={cn(
            RISE,
            "text-[2.25rem] font-extrabold leading-[1.08] tracking-[-0.04em] sm:text-6xl sm:leading-[1.05] sm:tracking-[-0.045em]",
          )}
        >
          Um presente pra abrir <br className="hidden sm:inline" />— mais de uma vez.
        </h1>

        <p
          className={cn(RISE, "mx-auto mt-6 max-w-md text-body leading-relaxed text-brand-slate")}
          style={riseDelay(100)}
        >
          Presente bom dá trabalho. O Happyday junta suas fotos, sua música e a história de vocês
          num site que abre no celular.
        </p>

        <div
          className={cn(RISE, "mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row")}
          style={riseDelay(200)}
        >
          <Pill href="/criar">Criar meu presente</Pill>
          <Pill href="/demo" tone="ghost">
            <Play className="h-3.5 w-3.5 fill-current" />
            Ver o exemplo
          </Pill>
        </div>
      </div>
    </section>
  );
}
