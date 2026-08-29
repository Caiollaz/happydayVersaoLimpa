import { redirect } from "next/navigation";

import { createDraft } from "@/lib/drafts";

/**
 * Starts a new site and hands the visitor their edit link.
 *
 * No form, no account — landing here *is* starting. The edit token in the
 * destination URL is the only thing that will ever grant access to this
 * draft, which is why the page must never be cached or prerendered.
 */
export const dynamic = "force-dynamic";

export default function CriarPage() {
  const { site } = createDraft();
  redirect(`/editar/${site.editToken}`);
}
