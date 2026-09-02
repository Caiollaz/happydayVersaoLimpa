import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { brandViewport } from "@/components/brand/viewport";
import { Wizard } from "@/components/wizard/Wizard";
import { findSiteByEditToken } from "@/lib/sites";

/**
 * The wizard, addressed by the site's edit token.
 *
 * The token lives in the path here — unlike the API, which takes it in a
 * header — because this URL is the user's bookmark and the link that gets
 * emailed to them. `noindex` plus a 404 on a bad token is what keeps it
 * private.
 */
export const dynamic = "force-dynamic";

export const viewport = brandViewport;

export const metadata: Metadata = {
  title: "Montando seu presente",
  robots: { index: false, follow: false },
};

interface EditarPageProps {
  params: Promise<{ token: string }>;
}

export default async function EditarPage({ params }: EditarPageProps) {
  const { token } = await params;
  const loaded = findSiteByEditToken(token);

  if (!loaded) notFound();

  return <Wizard siteId={loaded.site.id} token={token} initialConfig={loaded.config} />;
}
