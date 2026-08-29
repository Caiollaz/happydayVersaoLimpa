import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteExperience } from "@/components/SiteExperience";
import { SiteConfigProvider } from "@/lib/config/context";
import { interpolate } from "@/lib/config/schema";
import { findPublishedSite } from "@/lib/sites";

/**
 * A published couple's site.
 *
 * Rendered on demand rather than prebuilt: slugs are created when someone
 * pays, so there is no build-time list of them, and a site edited after
 * publishing must reflect the change immediately.
 */
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const loaded = findPublishedSite(slug);

  if (!loaded) return { title: "Site não encontrado" };

  const { config } = loaded;
  const title = interpolate(config.meta.title, config.couple);
  const description = interpolate(config.meta.description, config.couple);

  return {
    title,
    description,
    // The OG image itself comes from opengraph-image.tsx, which Next wires
    // up automatically — pointing at the couple's own photo here would put
    // it in the WhatsApp preview and spoil the surprise in the chat list.
    openGraph: {
      title,
      description,
      type: "website",
    },
    // Drafts and gifts alike have no business in search results.
    robots: { index: false, follow: false },
  };
}

export default async function PublishedSitePage({ params }: Props) {
  const { slug } = await params;
  const loaded = findPublishedSite(slug);

  if (!loaded) notFound();

  return (
    <SiteConfigProvider config={loaded.config}>
      <SiteExperience />
    </SiteConfigProvider>
  );
}
