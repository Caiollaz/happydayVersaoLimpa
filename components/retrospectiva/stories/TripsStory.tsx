"use client";

import { motion } from "framer-motion";
import type { StoryProps } from "../storiesConfig";
import { RETRO_CONTENT } from "../content";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Slide 6 — "Viagens". Hybrid layout: big "02" with a stylized mini-map
 * of the coastline alongside, a uppercase label, and the two destinations
 * listed with colored dots that match the map pins. Turquoise palette to
 * evoke the beach without copying the Spotify green.
 *
 * The map SVG is schematic, not geographic — a vertical coastline on the
 * left, two pings offset into the water, and a dashed gold line connecting
 * them. Pin colors come from `RETRO_CONTENT.trips.destinations[*].color`
 * so the legend (list bullets) matches the map automatically.
 */
export function TripsStory(_props: StoryProps) {
  const destinations = RETRO_CONTENT.trips.destinations;
  const label = RETRO_CONTENT.trips.label;

  // Pin positions on the mini-map viewBox (80 × 100). First destination in
  // the list rides higher (north), second rides lower.
  const pinPositions = [
    { cx: 25, cy: 40 },
    { cx: 30, cy: 75 },
  ];

  return (
    <section className="relative h-full w-full overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(160deg, #2EC4CC 0%, #0E5A6B 55%, #031218 100%)" }}
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-60 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 75% 20%, rgba(180, 230, 255, 0.28) 0%, rgba(180,230,255,0) 60%)",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />

      <div className="relative h-full w-full flex flex-col justify-center px-6 sm:px-10 safe-top safe-bottom">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
          className="text-[11px] font-bold uppercase tracking-[0.35em] text-white/85 mb-4"
        >
          Viagens
        </motion.p>

        <div className="flex items-start gap-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}
            className="text-[32vw] sm:text-[22vw] md:text-[16rem] font-black leading-[0.85] tracking-tighter text-white"
          >
            {String(destinations.length).padStart(2, "0")}
          </motion.div>

          <motion.svg
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.6 }}
            viewBox="0 0 80 100"
            className="flex-shrink-0 mt-3 w-[20vw] sm:w-[14vw] md:w-[8rem] max-w-[120px]"
            aria-hidden
          >
            {/* Coast silhouette on the left — thin line simulating shore */}
            <path
              d="M10,5 Q30,20 25,40 Q20,60 30,80 Q35,95 32,100"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1"
              fill="none"
            />
            {/* Land fill (left) */}
            <path d="M10,5 L10,100 L0,100 L0,5 Z" fill="rgba(255,255,255,0.05)" />

            {/* Dashed route connecting the two pins */}
            <motion.path
              d={`M${pinPositions[0].cx},${pinPositions[0].cy} L${pinPositions[1].cx},${pinPositions[1].cy}`}
              stroke="#FFE07A"
              strokeWidth="1"
              strokeDasharray="2 2"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: EASE, delay: 1.1 }}
            />

            {/* Pings */}
            {destinations.map((dest, i) => {
              const pos = pinPositions[i];
              if (!pos) return null;
              return (
                <motion.g
                  key={dest.name}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.8 + i * 0.2 }}
                >
                  <circle cx={pos.cx} cy={pos.cy} r={7} fill={dest.color} opacity={0.25} />
                  <circle cx={pos.cx} cy={pos.cy} r={4} fill={dest.color} />
                </motion.g>
              );
            })}
          </motion.svg>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.95 }}
          className="text-sm font-bold uppercase tracking-[0.25em] text-white/75 mb-5"
        >
          {label}
        </motion.p>

        <ul className="space-y-3">
          {destinations.map((dest, i) => (
            <motion.li
              key={dest.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, ease: EASE, delay: 1.15 + i * 0.18 }}
              className="flex items-center gap-3 text-white text-2xl sm:text-3xl font-extrabold"
            >
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: dest.color }}
              />
              <span>{dest.name}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
