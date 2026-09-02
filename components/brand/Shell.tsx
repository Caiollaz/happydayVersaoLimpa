import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Footer } from "./Footer";
import { jakarta } from "./font";
import { Nav } from "./Nav";

interface ShellProps {
  children: ReactNode;
  nav?: boolean;
  footer?: ReactNode;
}

const DEFAULT_FOOTER = (
  <div className="mt-3 overflow-hidden rounded-panel">
    <Footer />
  </div>
);

export function Shell({ children, nav = true, footer = DEFAULT_FOOTER }: ShellProps) {
  return (
    <div
      className={cn(
        jakarta.variable,
        "brand-surface min-h-dvh bg-brand-ground p-2 font-display text-brand-ink sm:p-4",
      )}
    >
      <div className="relative rounded-panel bg-brand-paper">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[600px] rounded-t-panel bg-halo"
        />
        {nav && <Nav />}
        <div className="relative">{children}</div>
      </div>

      {footer}
    </div>
  );
}
