import Link from "next/link";

/**
 * Shared shell for the terms and privacy pages.
 *
 * Plain prose, no accordions. Someone reading these is looking for one
 * specific answer, and hiding paragraphs behind clicks makes that harder.
 */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-[100dvh] bg-spotify-black px-6 py-16 text-white">
      <article className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="text-sm text-white/45 hover:text-white/70"
        >
          ← Voltar
        </Link>

        <h1 className="mt-6 text-3xl font-black tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-white/40">
          Última atualização: {updated}
        </p>

        <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-white/65 [&_a]:text-spotify-green [&_a:hover]:underline [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-white [&_li]:ml-5 [&_li]:list-disc [&_p+p]:mt-3 [&_strong]:text-white">
          {children}
        </div>
      </article>
    </main>
  );
}
