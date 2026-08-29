"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

const inputBase =
  "w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 text-white " +
  "placeholder:text-white/30 outline-none transition-colors " +
  "focus:border-spotify-green focus:bg-white/[0.06]";

function Label({ htmlFor, children, hint }: {
  htmlFor: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-2">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-semibold text-white"
      >
        {children}
      </label>
      {hint && <p className="mt-0.5 text-xs text-white/45">{hint}</p>}
    </div>
  );
}

export function TextField({
  label,
  hint,
  value,
  onChange,
  placeholder,
  maxLength,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
}) {
  const id = useId();
  return (
    <div>
      <Label htmlFor={id} hint={hint}>{label}</Label>
      <input
        id={id}
        type="text"
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={inputBase}
      />
    </div>
  );
}

export function TextArea({
  label,
  hint,
  value,
  onChange,
  rows = 10,
  maxLength,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  maxLength?: number;
}) {
  const id = useId();
  return (
    <div>
      <Label htmlFor={id} hint={hint}>{label}</Label>
      <textarea
        id={id}
        value={value}
        rows={rows}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        className={cn(inputBase, "resize-y leading-relaxed")}
      />
      {maxLength && (
        <p className="mt-1 text-right text-xs text-white/35">
          {value.length} / {maxLength}
        </p>
      )}
    </div>
  );
}

export function DateField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = useId();
  return (
    <div>
      <Label htmlFor={id} hint={hint}>{label}</Label>
      <input
        id={id}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        // The native picker renders its icon in black on our dark field.
        className={cn(inputBase, "[color-scheme:dark]")}
      />
    </div>
  );
}

export function NumberField({
  label,
  hint,
  value,
  onChange,
  min = 0,
  max,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) {
  const id = useId();
  return (
    <div>
      <Label htmlFor={id} hint={hint}>{label}</Label>
      <input
        id={id}
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => {
          const n = Number(e.target.value);
          // An empty field parses as NaN, which would fail validation and
          // block autosave while the user is mid-edit.
          if (Number.isFinite(n)) onChange(n);
        }}
        className={inputBase}
      />
    </div>
  );
}

export function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition-colors hover:bg-white/[0.06]"
    >
      <span>
        <span className="block text-sm font-semibold text-white">{label}</span>
        {hint && <span className="block text-xs text-white/45">{hint}</span>}
      </span>
      <span
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-spotify-green" : "bg-white/20",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
            checked ? "translate-x-[22px]" : "translate-x-0.5",
          )}
        />
      </span>
    </button>
  );
}
