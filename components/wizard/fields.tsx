"use client";

import { useId, type ReactNode } from "react";

import { DatePicker } from "@/components/brand/DatePicker";
import { INPUT } from "@/components/brand/input";
import { cn } from "@/lib/utils";

interface LabelProps {
  htmlFor: string;
  children: ReactNode;
}

function Label({ htmlFor, children }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold text-brand-ink">
      {children}
    </label>
  );
}

interface HintProps {
  hint?: string;
  counter?: string;
}

function Hint({ hint, counter }: HintProps) {
  if (!hint && !counter) return null;
  return (
    <div className="mt-1.5 flex justify-between gap-3 text-xs text-brand-slate">
      {hint && <span>{hint}</span>}
      {counter && <span className="ml-auto shrink-0">{counter}</span>}
    </div>
  );
}

interface TextFieldProps {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
}

export function TextField({
  label,
  hint,
  value,
  onChange,
  placeholder,
  maxLength,
}: TextFieldProps) {
  const id = useId();
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <input
        id={id}
        type="text"
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={INPUT}
      />
      <Hint hint={hint} />
    </div>
  );
}

interface TextAreaProps {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  maxLength?: number;
}

export function TextArea({ label, hint, value, onChange, rows = 10, maxLength }: TextAreaProps) {
  const id = useId();
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <textarea
        id={id}
        value={value}
        rows={rows}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        className={cn(INPUT, "resize-y leading-relaxed")}
      />
      <Hint hint={hint} counter={maxLength ? `${value.length} / ${maxLength}` : undefined} />
    </div>
  );
}

interface DateFieldProps {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
}

export function DateField({ label, hint, value, onChange }: DateFieldProps) {
  const id = useId();
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <DatePicker id={id} value={value} onChange={onChange} />
      <Hint hint={hint} />
    </div>
  );
}

interface NumberFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function NumberField({ label, hint, value, onChange, min = 0, max }: NumberFieldProps) {
  const id = useId();
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <input
        id={id}
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => {
          const parsed = Number(e.target.value);
          if (!Number.isFinite(parsed)) return;
          onChange(Math.min(max ?? Infinity, Math.max(min, parsed)));
        }}
        className={INPUT}
      />
      <Hint hint={hint} />
    </div>
  );
}

interface ToggleProps {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Toggle({ label, hint, checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-brand-stroke bg-brand-paper px-4 py-3 text-left transition-colors hover:bg-brand-mist"
    >
      <span>
        <span className="block text-sm font-semibold text-brand-ink">{label}</span>
        {hint && <span className="block text-xs text-brand-slate">{hint}</span>}
      </span>
      <span
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-brand-ink" : "bg-brand-stroke",
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
