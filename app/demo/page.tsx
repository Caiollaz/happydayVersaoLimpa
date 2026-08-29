import type { Metadata } from "next";

import { SiteExperience } from "@/components/SiteExperience";
import { SiteConfigProvider } from "@/lib/config/context";
import { DEFAULT_CONFIG } from "@/lib/config/default";

/**
 * The live example, rendered from DEFAULT_CONFIG.
 *
 * Doubles as the regression fixture for the whole config refactor: this
 * page must look exactly like the hardcoded site it replaced.
 */
export const metadata: Metadata = {
  title: "Exemplo — Happyday",
  description: "Veja como fica um site pronto antes de montar o seu.",
};

export default function DemoPage() {
  return (
    <SiteConfigProvider config={DEFAULT_CONFIG}>
      <SiteExperience />
    </SiteConfigProvider>
  );
}
