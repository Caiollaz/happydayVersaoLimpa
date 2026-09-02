import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { Pill } from "./Pill";

const LINKS = [
  { href: "/#dentro", label: "O que tem dentro" },
  { href: "/#como", label: "Como funciona" },
  { href: "/#ocasioes", label: "Ocasiões" },
];

const PRICE_LINK = { href: "/#precos", label: "Preço" };

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 rounded-t-panel bg-brand-paper/55 backdrop-blur-xl">
      <div className="relative flex h-16 items-center justify-between gap-3 px-4 sm:h-[72px] sm:px-6 lg:px-10">
        <MobileMenu links={[...LINKS, PRICE_LINK]} />

        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-brand-slate transition-colors hover:bg-brand-paper/70 hover:text-brand-ink"
            >
              {label}
            </Link>
          ))}
        </div>

        <Logo compactOnNarrow className="absolute left-1/2 -translate-x-1/2" />

        <div className="flex items-center gap-1 rounded-full bg-brand-mist/80 p-1">
          <Link
            href={PRICE_LINK.href}
            className="hidden rounded-full px-3.5 py-1.5 text-sm font-medium text-brand-slate transition-colors hover:text-brand-ink lg:block"
          >
            {PRICE_LINK.label}
          </Link>
          <Pill href="/criar" tone="paper" className="whitespace-nowrap px-4 py-1.5">
            Criar<span className="hidden sm:inline"> presente</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Pill>
        </div>
      </div>
    </nav>
  );
}
