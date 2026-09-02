"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

import { INPUT } from "./input";
import { PillButton } from "./Pill";
import { Popover } from "./Popover";

const MONTHS = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

const YEARS_BACK = 80;
const YEARS_AHEAD = 5;

const ARROW_STEPS: Record<string, number> = {
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -7,
  ArrowDown: 7,
};

interface Ymd {
  y: number;
  m: number;
  d: number;
}

interface MonthView {
  y: number;
  m: number;
}

function parse(iso: string): Ymd | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  return { y: Number(match[1]), m: Number(match[2]) - 1, d: Number(match[3]) };
}

function toIso({ y, m, d }: Ymd): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function formatBr(iso: string): string {
  const date = parse(iso);
  if (!date) return "";
  return `${String(date.d).padStart(2, "0")}/${String(date.m + 1).padStart(2, "0")}/${date.y}`;
}

function todayYmd(): Ymd {
  const now = new Date();
  return { y: now.getFullYear(), m: now.getMonth(), d: now.getDate() };
}

function daysIn({ y, m }: MonthView): number {
  return new Date(y, m + 1, 0).getDate();
}

function monthOf(date: Date): MonthView {
  return { y: date.getFullYear(), m: date.getMonth() };
}

function sameMonth(a: MonthView, b: MonthView): boolean {
  return a.y === b.y && a.m === b.m;
}

interface DatePickerProps {
  id?: string;
  value: string;
  onChange: (iso: string) => void;
}

export function DatePicker({ id, value, onChange }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selected = parse(value);
  const today = todayYmd();
  const [view, setView] = useState<MonthView>(selected ?? today);
  const [focusDay, setFocusDay] = useState(1);
  const grid = useRef<HTMLDivElement>(null);
  const focusPending = useRef(false);

  const daysInMonth = daysIn(view);
  const firstWeekday = new Date(view.y, view.m, 1).getDay();
  const years = [
    ...new Set([
      ...Array.from({ length: YEARS_BACK + YEARS_AHEAD + 1 }, (_, i) => today.y - YEARS_BACK + i),
      view.y,
    ]),
  ].sort((a, b) => a - b);
  const label = formatBr(value);

  useEffect(() => {
    if (!focusPending.current) return;
    focusPending.current = false;
    grid.current?.querySelector<HTMLButtonElement>(`[data-day="${focusDay}"]`)?.focus();
  }, [focusDay, view]);

  const toggle = () => {
    if (!open) {
      const start = selected ?? today;
      setView(start);
      setFocusDay(start.d);
    }
    setOpen((state) => !state);
  };

  const changeView = (next: MonthView) => {
    setView(next);
    setFocusDay(1);
  };

  const shiftMonth = (delta: number) => changeView(monthOf(new Date(view.y, view.m + delta, 1)));

  const pick = (ymd: Ymd) => {
    onChange(toIso(ymd));
    setOpen(false);
  };

  const moveFocus = (target: number) => {
    focusPending.current = true;
    if (target < 1) {
      const previous = monthOf(new Date(view.y, view.m - 1, 1));
      setView(previous);
      setFocusDay(daysIn(previous) + target);
    } else if (target > daysInMonth) {
      setView(monthOf(new Date(view.y, view.m + 1, 1)));
      setFocusDay(target - daysInMonth);
    } else {
      setFocusDay(target);
    }
  };

  const onGridKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = Number((event.target as HTMLElement).dataset.day);
    if (!current) return;

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      moveFocus(event.key === "Home" ? 1 : daysInMonth);
      return;
    }

    const step = ARROW_STEPS[event.key];
    if (!step) return;
    event.preventDefault();
    moveFocus(current + step);
  };

  return (
    <Popover
      open={open}
      onClose={() => setOpen(false)}
      title="Escolha a data"
      trigger={
        <button
          id={id}
          type="button"
          onClick={toggle}
          aria-haspopup="dialog"
          aria-expanded={open}
          className={cn(INPUT, "flex items-center justify-between gap-3 text-left")}
        >
          <span className={cn("tabular-nums", !label && "text-brand-slate/80")}>
            {label || "dd/mm/aaaa"}
          </span>
          <CalendarDays className="h-4 w-4 shrink-0 text-brand-slate" />
        </button>
      }
    >
      <div className="w-full sm:w-[300px]">
        <div className="flex items-center gap-1.5">
          <IconButton label="Mês anterior" onClick={() => shiftMonth(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </IconButton>

          <Select
            label="Mês"
            value={view.m}
            onChange={(m) => changeView({ ...view, m })}
            options={MONTHS.map((name, i) => ({ value: i, label: name }))}
            className="flex-1"
          />
          <Select
            label="Ano"
            value={view.y}
            onChange={(y) => changeView({ ...view, y })}
            options={years.map((y) => ({ value: y, label: String(y) }))}
          />

          <IconButton label="Próximo mês" onClick={() => shiftMonth(1)}>
            <ChevronRight className="h-4 w-4" />
          </IconButton>
        </div>

        <div className="mt-4 grid grid-cols-7 text-center text-[11px] font-semibold text-brand-slate">
          {WEEKDAYS.map((day, i) => (
            <span key={i} className="py-1">
              {day}
            </span>
          ))}
        </div>

        <div
          ref={grid}
          role="group"
          aria-label={`Dias de ${MONTHS[view.m]} de ${view.y}`}
          onKeyDown={onGridKey}
          className="mt-1 grid grid-cols-7 gap-y-1"
        >
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
            const ymd = { ...view, d };
            const isSelected = selected !== null && sameMonth(selected, view) && selected.d === d;
            const isToday = sameMonth(today, view) && today.d === d;

            return (
              <button
                key={d}
                type="button"
                data-day={d}
                tabIndex={d === focusDay ? 0 : -1}
                onClick={() => pick(ymd)}
                onFocus={() => setFocusDay(d)}
                aria-label={`${d} de ${MONTHS[view.m]} de ${view.y}`}
                aria-pressed={isSelected}
                style={d === 1 ? { gridColumnStart: firstWeekday + 1 } : undefined}
                className={cn(
                  "mx-auto grid h-9 w-9 place-items-center rounded-full text-sm tabular-nums transition-colors",
                  isSelected
                    ? "bg-brand-ink font-bold text-white"
                    : "text-brand-ink hover:bg-brand-mist",
                  isToday && !isSelected && "font-bold ring-1 ring-inset ring-brand-stroke",
                )}
              >
                {d}
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex justify-end border-t border-brand-ground pt-3">
          <PillButton tone="ghost" onClick={() => pick(today)} className="px-4 py-2 text-xs">
            Hoje
          </PillButton>
        </div>
      </div>
    </Popover>
  );
}

interface IconButtonProps {
  label: string;
  onClick: () => void;
  children: ReactNode;
}

function IconButton({ label, onClick, children }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-brand-ink transition-colors hover:bg-brand-mist"
    >
      {children}
    </button>
  );
}

interface SelectProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  options: { value: number; label: string }[];
  className?: string;
}

function Select({ label, value, onChange, options, className }: SelectProps) {
  return (
    <span className={cn("relative", className)}>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full appearance-none rounded-xl bg-brand-mist py-2 pl-3 pr-8 text-sm font-semibold capitalize text-brand-ink outline-none transition-shadow focus:ring-2 focus:ring-brand-ink/15"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-brand-slate" />
    </span>
  );
}
