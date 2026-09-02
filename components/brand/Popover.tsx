"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const MOBILE = "(max-width: 639px)";
const EDGE_GUTTER = 16;

interface PopoverProps {
  open: boolean;
  onClose: () => void;
  title: string;
  trigger: ReactNode;
  children: ReactNode;
}

export function Popover({ open, onClose, title, trigger, children }: PopoverProps) {
  const wrapper = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  const [alignEnd, setAlignEnd] = useState(false);

  useEffect(() => {
    close.current = onClose;
  });

  useEffect(() => {
    if (!open) return;

    const opener = document.activeElement as HTMLElement | null;
    const mobile = window.matchMedia(MOBILE).matches;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close.current();
    };
    document.addEventListener("keydown", onKey);
    if (mobile) document.body.classList.add("no-scroll");

    if (!mobile && wrapper.current && panel.current) {
      const left = wrapper.current.getBoundingClientRect().left;
      setAlignEnd(left + panel.current.offsetWidth > window.innerWidth - EDGE_GUTTER);
    }

    panel.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("no-scroll");
      opener?.focus();
    };
  }, [open]);

  return (
    <div ref={wrapper} className="relative">
      {trigger}

      {open && (
        <>
          <div
            aria-hidden
            onClick={onClose}
            className="fixed inset-0 z-40 touch-none bg-brand-ink/30 motion-safe:animate-brand-fade sm:bg-transparent"
          />
          <div
            ref={panel}
            role="dialog"
            aria-label={title}
            tabIndex={-1}
            className={cn(
              "fixed inset-x-0 bottom-0 z-50 max-h-[90dvh] overflow-y-auto overscroll-contain rounded-t-panel border border-brand-ground bg-brand-paper p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-sheet outline-none motion-safe:animate-brand-sheet-up",
              "sm:absolute sm:inset-x-auto sm:bottom-auto sm:top-full sm:mt-2 sm:max-h-none sm:w-max sm:overflow-visible sm:rounded-card sm:pb-4 sm:shadow-pop sm:motion-safe:animate-brand-pop",
              alignEnd ? "sm:right-0" : "sm:left-0",
            )}
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-brand-lav-deep sm:hidden" />
            <div className="mb-3 flex items-center justify-between sm:hidden">
              <span className="text-sm font-semibold">{title}</span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar"
                className="grid h-8 w-8 place-items-center rounded-full bg-brand-mist text-brand-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {children}
          </div>
        </>
      )}
    </div>
  );
}
