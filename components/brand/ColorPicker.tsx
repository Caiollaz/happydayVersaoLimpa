"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

import { hues, ink, isLight } from "./palette";
import { Popover } from "./Popover";

const HEX = /^#[0-9a-f]{6}$/i;

const SWATCHES = [
  ...Object.values(hues).flatMap(({ deep, mid, light }) => [deep, mid, light]),
  ink,
];

interface ColorPickerProps {
  value: string;
  onChange: (hex: string) => void;
  label: string;
}

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const preview = HEX.test(draft) ? draft : value;

  const toggle = () => {
    if (!open) setDraft(value);
    setOpen((state) => !state);
  };

  const pick = (hex: string) => {
    onChange(hex.toUpperCase());
    setOpen(false);
  };

  const onDraft = (next: string) => {
    const hex = next === "" || next.startsWith("#") ? next : `#${next}`;
    setDraft(hex);
    if (HEX.test(hex)) onChange(hex.toUpperCase());
  };

  return (
    <Popover
      open={open}
      onClose={() => setOpen(false)}
      title={label}
      trigger={
        <button
          type="button"
          onClick={toggle}
          aria-label={`${label}: ${value}`}
          aria-haspopup="dialog"
          aria-expanded={open}
          style={{ backgroundColor: value }}
          className="h-11 w-11 shrink-0 rounded-xl border border-brand-ink/10 transition-transform hover:scale-105"
        />
      }
    >
      <div className="w-full sm:w-[304px]">
        <div className="grid grid-cols-8 gap-2">
          {SWATCHES.map((hex) => {
            const isSelected = hex.toUpperCase() === value.toUpperCase();
            return (
              <button
                key={hex}
                type="button"
                onClick={() => pick(hex)}
                aria-label={hex}
                aria-pressed={isSelected}
                style={{ backgroundColor: hex }}
                className={cn(
                  "grid aspect-square place-items-center rounded-xl border border-brand-ink/10 transition-transform hover:scale-105",
                  isSelected && "ring-2 ring-brand-ink ring-offset-2 ring-offset-brand-paper",
                )}
              >
                {isSelected && (
                  <Check
                    className={cn("h-4 w-4", isLight(hex) ? "text-brand-ink" : "text-white")}
                    strokeWidth={3}
                  />
                )}
              </button>
            );
          })}
        </div>

        <label className="mt-4 flex items-center gap-3 rounded-xl bg-brand-mist px-3 py-2">
          <span
            className="h-6 w-6 shrink-0 rounded-full border border-brand-ink/10"
            style={{ backgroundColor: preview }}
          />
          <input
            type="text"
            value={draft}
            onChange={(event) => onDraft(event.target.value.trim())}
            maxLength={7}
            spellCheck={false}
            autoCapitalize="characters"
            autoCorrect="off"
            aria-label="Cor em hexadecimal"
            placeholder={hues.coral.mid}
            className="w-full bg-transparent font-mono text-sm uppercase text-brand-ink outline-none placeholder:text-brand-slate/80"
          />
        </label>
      </div>
    </Popover>
  );
}
