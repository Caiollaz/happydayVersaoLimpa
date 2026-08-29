import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteExperience } from "@/components/SiteExperience";
import { SiteConfigProvider } from "@/lib/config/context";
import { findSiteByEditToken } from "@/lib/sites";

/**
 * The draft rendered exactly as a visitor would see it, plus a watermark.
 *
 * Shares SiteExperience with the published route rather than reimplementing
 * a preview — a preview that drifts from the real thing is worse than none,
 * because people approve one and receive the other.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Prévia",
  robots: { index: false, follow: false },
};

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const loaded = findSiteByEditToken(token);

  if (!loaded) notFound();

  const paid = loaded.site.status !== "DRAFT";

  return (
    <SiteConfigProvider config={loaded.config}>
      <SiteExperience />

      {/* Unpaid drafts carry a mark. Fixed and pointer-events-none so it
        rides above the experience without blocking a single tap. */}
      {!paid && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[100] flex items-end justify-center pb-6"
        >
          <span className="rounded-full bg-black/70 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
            prévia
          </span>
        </div>
      )}
    </SiteConfigProvider>
  );
}
