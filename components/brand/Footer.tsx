import Link from "next/link";

import { ABUSE_EMAIL } from "./constants";
import { Logo } from "./Logo";

interface FooterLink {
  href: string;
  label: string;
  external?: boolean;
}

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Produto",
    links: [
      { href: "/demo", label: "Ver o exemplo" },
      { href: "/criar", label: "Criar um presente" },
      { href: "/#precos", label: "Preço" },
    ],
  },
  {
    title: "Ajuda",
    links: [
      { href: "/#como", label: "Como funciona" },
      { href: "/#perguntas", label: "Perguntas frequentes" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/termos", label: "Termos de uso" },
      { href: "/privacidade", label: "Privacidade" },
      { href: `mailto:${ABUSE_EMAIL}`, label: "Denunciar um site", external: true },
    ],
  },
];

const LINK_CLASS = "transition-colors hover:text-white";

export function Footer() {
  return (
    <footer className="bg-brand-ink px-5 pb-10 pt-4 text-white sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_repeat(3,1fr)]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-caption leading-relaxed text-white/45">
              Um presente que abre no celular e continua lá amanhã. Fotos, música, uma carta e a
              retrospectiva de vocês, num link privado que funciona em qualquer lugar do mundo.
            </p>
          </div>

          {COLUMNS.map(({ title, links }) => (
            <div key={title}>
              <h3 className="text-caption font-bold">{title}</h3>
              <ul className="mt-4 space-y-2.5 text-caption text-white/45">
                {links.map(({ href, label, external }) => (
                  <li key={label}>
                    {external ? (
                      <a href={href} className={LINK_CLASS}>
                        {label}
                      </a>
                    ) : (
                      <Link href={href} className={LINK_CLASS}>
                        {label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/[0.08] pt-7 text-xs text-white/35 sm:flex-row">
          <span>© {new Date().getFullYear()} Happyday. Todos os direitos reservados.</span>
          <span>Feito no Brasil</span>
        </div>
      </div>
    </footer>
  );
}
