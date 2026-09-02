import type { ReactNode } from "react";

import { Shell } from "./Shell";

interface LegalPageProps {
  title: string;
  updated: string;
  children: ReactNode;
}

export function LegalPage({ title, updated, children }: LegalPageProps) {
  return (
    <Shell>
      <main className="px-5 pb-24 pt-12 sm:px-8 sm:pt-16">
        <article className="mx-auto max-w-2xl">
          <p className="text-sm font-medium text-brand-slate">Última atualização: {updated}</p>
          <h1 className="mt-3 text-display sm:text-display-lg">
            {title}
          </h1>

          <div className="mt-10 space-y-8 text-body leading-relaxed text-brand-slate [&_a:hover]:text-brand-pink-deep [&_a]:font-semibold [&_a]:text-brand-ink [&_a]:underline [&_a]:underline-offset-4 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:tracking-[-0.02em] [&_h2]:text-brand-ink [&_li]:ml-5 [&_li]:list-disc [&_p+p]:mt-3 [&_strong]:font-semibold [&_strong]:text-brand-ink [&_ul]:space-y-2">
            {children}
          </div>
        </article>
      </main>
    </Shell>
  );
}
