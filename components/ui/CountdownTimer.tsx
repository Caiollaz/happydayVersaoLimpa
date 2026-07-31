"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  /** Start date of the relationship */
  startDate: Date;
}

interface Duration {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function computeDuration(from: Date, to: Date): Duration {
  if (to < from) {
    return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();
  let hours = to.getHours() - from.getHours();
  let minutes = to.getMinutes() - from.getMinutes();
  let seconds = to.getSeconds() - from.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes -= 1;
  }
  if (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }
  if (hours < 0) {
    hours += 24;
    days -= 1;
  }
  if (days < 0) {
    // Days in the previous month
    const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0).getDate();
    days += prevMonth;
    months -= 1;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }

  return { years, months, days, hours, minutes, seconds };
}

const STATS: Array<{ key: keyof Duration; label: string }> = [
  { key: "years", label: "Anos" },
  { key: "months", label: "Meses" },
  { key: "days", label: "Dias" },
  { key: "hours", label: "Horas" },
  { key: "minutes", label: "Minutos" },
  { key: "seconds", label: "Segundos" },
];

/**
 * Stats grid matching the Pencil "Card Sobre o Casal" prototype:
 * six rounded cells in a 3×2 grid, each 80px tall, with a 26px bold value
 * on top and a 13px secondary label below.
 */
export function CountdownTimer({ startDate }: CountdownTimerProps) {
  const [duration, setDuration] = useState<Duration | null>(null);

  useEffect(() => {
    const update = () => setDuration(computeDuration(startDate, new Date()));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [startDate]);

  return (
    <div
      className="grid grid-cols-3 gap-2.5"
      role="timer"
      aria-live="off"
      aria-label="Tempo juntos"
    >
      {STATS.map(({ key, label }) => {
        const value = duration ? duration[key] : null;
        return (
          <div
            key={key}
            className="flex h-20 flex-col items-center justify-center gap-1 rounded-[10px] bg-spotify-elevated border border-white/[0.06]"
          >
            {value === null ? (
              <div className="h-6 w-8 animate-pulse rounded bg-white/10" />
            ) : (
              <span className="text-[26px] font-bold leading-none tabular-nums text-white">
                {value}
              </span>
            )}
            <span className="text-[13px] font-normal text-spotify-text-secondary">
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
