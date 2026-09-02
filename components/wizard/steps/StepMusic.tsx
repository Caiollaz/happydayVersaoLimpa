"use client";

import { cn } from "@/lib/utils";

import type { StepProps } from "../Wizard";
import { TextField } from "../fields";

/**
 * The track catalog.
 *
 * Both pieces are synthesized by `scripts/gen-audio.mjs` — written by code,
 * so there is no rights holder and nothing to license. Adding a real
 * licensed track later means dropping the file in and adding a row here.
 */
const CATALOG = [
  {
    src: "/audio/nossa-cancao.mp3",
    title: "Nossa canção",
    artist: "Instrumental",
  },
  {
    src: "/audio/retrospectiva.mp3",
    title: "Retrospectiva",
    artist: "Instrumental",
  },
] as const;

type Track = (typeof CATALOG)[number];

/**
 * Step 3 — the soundtrack.
 *
 * Two tracks: one plays on the site, one during the retrospective. Both come
 * from the built-in catalog. Uploading your own file is a Premium feature
 * that is not wired yet — the field is deliberately absent rather than
 * disabled, so nothing here promises something that doesn't work.
 */
export function StepMusic({ draft }: StepProps) {
  const { config, patch } = draft;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-brand-ink">A música</h1>
        <p className="mt-1 text-body text-brand-slate">
          Uma toca no site, outra durante a retrospectiva.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-sm font-bold text-brand-ink">Música do site</h2>
        {CATALOG.map((track) => (
          <TrackOption
            key={track.src}
            track={track}
            selected={config.player.audioSrc === track.src}
            onSelect={() =>
              patch({
                player: {
                  audioSrc: track.src,
                  trackTitle: track.title,
                  trackArtist: track.artist,
                },
              })
            }
          />
        ))}
      </section>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Nome da faixa"
          hint="Como aparece no player"
          value={config.player.trackTitle}
          maxLength={80}
          onChange={(trackTitle) => patch({ player: { trackTitle } })}
        />
        <TextField
          label="Artista"
          value={config.player.trackArtist}
          maxLength={80}
          onChange={(trackArtist) => patch({ player: { trackArtist } })}
        />
      </div>

      {config.retro.enabled && (
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-brand-ink">Música da retrospectiva</h2>
          {CATALOG.map((track) => (
            <TrackOption
              key={track.src}
              track={track}
              selected={config.retro.audioSrc === track.src}
              onSelect={() => patch({ retro: { audioSrc: track.src } })}
            />
          ))}
        </section>
      )}
    </div>
  );
}

interface TrackOptionProps {
  track: Track;
  selected: boolean;
  onSelect: () => void;
}

function TrackOption({ track, selected, onSelect }: TrackOptionProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-card p-3 transition-colors sm:flex-row sm:items-center",
        selected ? "bg-brand-lav ring-1 ring-brand-ink/10" : "bg-brand-mist",
      )}
    >
      <button type="button" onClick={onSelect} className="flex-1 text-left" aria-pressed={selected}>
        <span className="block text-sm font-semibold text-brand-ink">{track.title}</span>
        <span className="block text-xs text-brand-slate">{track.artist}</span>
      </button>

      {/* Native controls: a custom player here would be a second audio
          implementation to keep in sync with the real one on the site. */}
      <audio
        src={track.src}
        controls
        preload="none"
        aria-label={`Prévia: ${track.title}`}
        className="w-full sm:max-w-[220px]"
      />
    </div>
  );
}
