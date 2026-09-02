import { Clock, Lock, Play, QrCode, RefreshCw, Smartphone } from "lucide-react";

import { Footer } from "@/components/brand/Footer";
import { DRIFT, drift } from "@/components/brand/motion";
import { paleClassAt } from "@/components/brand/palette";
import { Pill } from "@/components/brand/Pill";
import { Figure, Waves, WideArc } from "@/components/brand/scenes";
import { cn } from "@/lib/utils";

const CLAIMS = [
  { top: "42%", left: "3%", tilt: "-17deg", Icon: Lock, text: "Link privado, fora do Google" },
  { top: "20%", left: "17%", tilt: "-9deg", Icon: Smartphone, text: "Abre em qualquer celular" },
  { top: "8%", left: "40%", tilt: "-1deg", Icon: Clock, text: "No ar por um ano inteiro" },
  { top: "19%", left: "63%", tilt: "9deg", Icon: RefreshCw, text: "Edite depois quantas vezes quiser" },
  { top: "41%", left: "80%", tilt: "17deg", Icon: QrCode, text: "QR Code pra imprimir e colar" },
];

export function Closing() {
  return (
    <div className="mt-3 overflow-hidden rounded-panel">
      <div className="bg-gradient-to-b from-brand-lav via-brand-paper to-brand-mist">
        <h2 className="mx-auto max-w-2xl px-5 pt-20 text-center text-display sm:px-8 sm:text-display-lg">
          Presente que não some. <br className="hidden sm:inline" />
          Link que não expira amanhã.
        </h2>

        <div className="relative mt-12">
          <WideArc className="block h-[200px] w-full sm:h-[280px]" />

          <div aria-hidden className="absolute inset-0 hidden lg:block">
            {CLAIMS.map(({ top, left, tilt, Icon, text }, i) => (
              <span
                key={text}
                className="absolute inline-flex items-center gap-2 rounded-full bg-brand-paper py-2 pl-2 pr-4 text-caption font-medium shadow-pin"
                style={{ top, left, transform: `rotate(${tilt})` }}
              >
                <span
                  className={cn("grid h-6 w-6 place-items-center rounded-full", paleClassAt(i))}
                >
                  <Icon className="h-3 w-3" />
                </span>
                {text}
              </span>
            ))}
          </div>
        </div>

        <div className="relative px-5 pb-10 text-center sm:px-8">
          <Figure
            name="qrcard"
            className={cn(
              DRIFT,
              "pointer-events-none absolute right-[12%] top-[-20px] hidden w-[110px] lg:block xl:right-[18%] xl:w-[130px]",
            )}
            style={drift(10, "5deg")}
          />
          <Figure
            name="giftbox"
            className={cn(
              DRIFT,
              "pointer-events-none absolute left-[13%] top-[-10px] hidden w-[120px] lg:block xl:left-[19%] xl:w-[140px]",
            )}
            style={drift(8, "-6deg", -3)}
          />

          <p className="mx-auto max-w-md text-body leading-relaxed text-brand-slate">
            Dez minutos montando, um ano no ar, um link privado que a pessoa reabre num dia
            qualquer.
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Pill href="/criar">Criar meu presente</Pill>
            <Pill href="/demo" tone="ghost">
              <Play className="h-3.5 w-3.5 fill-current" />
              Ver o exemplo
            </Pill>
          </div>
        </div>

        <Waves className="block h-[150px] w-full sm:h-[210px]" />
      </div>

      <Footer />
    </div>
  );
}
