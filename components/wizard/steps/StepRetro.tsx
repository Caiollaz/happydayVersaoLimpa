"use client";

import type { ReactNode } from "react";

import { ColorPicker } from "@/components/brand/ColorPicker";
import { INPUT } from "@/components/brand/input";
import { hues } from "@/components/brand/palette";
import type { SiteConfig, SlideKey } from "@/lib/config/schema";
import { cn } from "@/lib/utils";

import type { StepProps } from "../Wizard";
import { NumberField, TextArea, TextField, Toggle } from "../fields";

const MAX_DESTINATIONS = 8;
const NEW_DESTINATION_COLOR = hues.coral.mid;

/**
 * Step 5 — the retrospective, slide by slide.
 *
 * Each slide is its own toggle plus its own fields. Nobody's story fits all
 * eleven — a couple who never travelled together should switch off Viagens
 * rather than invent a trip, and the player skips what is off.
 */
export function StepRetro({ draft }: StepProps) {
  const { config, patch } = draft;
  const slides = config.retro.slides;

  /** Patches one slide without touching the other ten. */
  const setSlide = (key: SlideKey, value: Record<string, unknown>) =>
    patch({ retro: { slides: { [key]: value } } });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-brand-ink">A retrospectiva</h1>
        <p className="mt-1 text-body text-brand-slate">
          Onze telas em estilo Wrapped. Desligue as que não combinam com a história de vocês.
        </p>
      </header>

      <Toggle
        label="Incluir a retrospectiva"
        hint="Disponível no plano Premium"
        checked={config.retro.enabled}
        onChange={(enabled) => patch({ retro: { enabled } })}
      />

      {config.retro.enabled && (
        <div className="space-y-4">
          <SlideCard
            title="Abertura"
            slide={slides.intro}
            onToggle={(enabled) => setSlide("intro", { enabled })}
          >
            <TextField
              label="Rótulo"
              value={slides.intro.eyebrow}
              maxLength={40}
              onChange={(eyebrow) => setSlide("intro", { eyebrow })}
            />
            <TextField
              label="Frase de abertura"
              value={slides.intro.subhead}
              maxLength={120}
              onChange={(subhead) => setSlide("intro", { subhead })}
            />
          </SlideCard>

          <SlideCard
            title="Onde começou"
            slide={slides.whereStarted}
            onToggle={(enabled) => setSlide("whereStarted", { enabled })}
          >
            <p className="text-xs text-brand-slate">
              A data vem de “quando se conheceram”, no primeiro passo.
            </p>
            <TextField
              label="Uma linha sobre esse dia"
              value={slides.whereStarted.context}
              maxLength={160}
              onChange={(context) => setSlide("whereStarted", { context })}
            />
          </SlideCard>

          <SlideCard
            title="Um momento marcante"
            slide={slides.movie}
            onToggle={(enabled) => setSlide("movie", { enabled })}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Rótulo"
                value={slides.movie.eyebrow}
                maxLength={40}
                onChange={(eyebrow) => setSlide("movie", { eyebrow })}
              />
              <TextField
                label="Título"
                hint="O filme, o show, o lugar"
                value={slides.movie.title}
                maxLength={40}
                onChange={(title) => setSlide("movie", { title })}
              />
              <TextField
                label="Data (texto livre)"
                value={slides.movie.date}
                maxLength={20}
                onChange={(date) => setSlide("movie", { date })}
              />
              <NumberField
                label="Nota (0 a 10)"
                value={slides.movie.rating}
                min={0}
                max={10}
                onChange={(rating) => setSlide("movie", { rating })}
              />
              <TextField
                label="Primeira linha"
                value={slides.movie.tagline1}
                maxLength={80}
                onChange={(tagline1) => setSlide("movie", { tagline1 })}
              />
              <TextField
                label="Segunda linha"
                value={slides.movie.tagline2}
                maxLength={80}
                onChange={(tagline2) => setSlide("movie", { tagline2 })}
              />
            </div>
          </SlideCard>

          <SlideCard
            title="Dias juntos"
            slide={slides.days}
            onToggle={(enabled) => setSlide("days", { enabled })}
          >
            <TextField
              label="Legenda"
              value={slides.days.caption}
              maxLength={80}
              onChange={(caption) => setSlide("days", { caption })}
            />
          </SlideCard>

          <SlideCard
            title="Mensagens trocadas"
            slide={slides.messages}
            onToggle={(enabled) => setSlide("messages", { enabled })}
          >
            <NumberField
              label="Quantas"
              hint="Dá pra estimar — ninguém confere"
              value={slides.messages.total}
              min={0}
              onChange={(total) => setSlide("messages", { total })}
            />
            <TextField
              label="Legenda"
              value={slides.messages.caption}
              maxLength={80}
              onChange={(caption) => setSlide("messages", { caption })}
            />
          </SlideCard>

          <SlideCard
            title="Viagens"
            slide={slides.trips}
            onToggle={(enabled) => setSlide("trips", { enabled })}
          >
            <TextField
              label="Rótulo da região"
              value={slides.trips.label}
              maxLength={40}
              onChange={(label) => setSlide("trips", { label })}
            />
            <TripsEditor
              destinations={slides.trips.destinations}
              onChange={(destinations) => setSlide("trips", { destinations })}
            />
          </SlideCard>

          <SlideCard
            title="Nossa música"
            slide={slides.song}
            onToggle={(enabled) => setSlide("song", { enabled })}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Música"
                value={slides.song.title}
                maxLength={80}
                onChange={(title) => setSlide("song", { title })}
              />
              <TextField
                label="Artista"
                value={slides.song.artist}
                maxLength={80}
                onChange={(artist) => setSlide("song", { artist })}
              />
            </div>
            <TextField
              label="Uma linha sobre ela"
              value={slides.song.verse}
              maxLength={160}
              onChange={(verse) => setSlide("song", { verse })}
            />
          </SlideCard>

          <SlideCard
            title="Fotos guardadas"
            slide={slides.photos}
            onToggle={(enabled) => setSlide("photos", { enabled })}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Contagem"
                hint="Texto livre, tipo “412+”"
                value={slides.photos.countLabel}
                maxLength={12}
                onChange={(countLabel) => setSlide("photos", { countLabel })}
              />
              <TextField
                label="Legenda"
                value={slides.photos.caption}
                maxLength={80}
                onChange={(caption) => setSlide("photos", { caption })}
              />
            </div>
          </SlideCard>

          <SlideCard
            title="Foto favorita"
            slide={slides.favPhoto}
            onToggle={(enabled) => setSlide("favPhoto", { enabled })}
          >
            <FavPhotoPicker
              config={config}
              current={slides.favPhoto.src}
              onPick={(src) => setSlide("favPhoto", { src })}
            />
            <TextField
              label="Legenda"
              value={slides.favPhoto.caption}
              maxLength={120}
              onChange={(caption) => setSlide("favPhoto", { caption })}
            />
          </SlideCard>

          <SlideCard
            title="Recap em números"
            slide={slides.poster}
            onToggle={(enabled) => setSlide("poster", { enabled })}
          >
            <p className="text-xs text-brand-slate">
              Os números vêm das telas anteriores. Só os rótulos são editáveis.
            </p>
          </SlideCard>

          <SlideCard
            title="Encerramento"
            slide={slides.whatsNext}
            onToggle={(enabled) => setSlide("whatsNext", { enabled })}
          >
            <TextArea
              label="Frase final"
              value={slides.whatsNext.phrase}
              rows={2}
              maxLength={120}
              onChange={(phrase) => setSlide("whatsNext", { phrase })}
            />
          </SlideCard>
        </div>
      )}
    </div>
  );
}

interface SlideCardProps {
  title: string;
  slide: { enabled: boolean };
  onToggle: (enabled: boolean) => void;
  children: ReactNode;
}

function SlideCard({ title, slide, onToggle, children }: SlideCardProps) {
  return (
    <section className="rounded-card bg-brand-mist p-5">
      <Toggle label={title} checked={slide.enabled} onChange={onToggle} />
      {slide.enabled && <div className="mt-4 space-y-4">{children}</div>}
    </section>
  );
}

interface Destination {
  name: string;
  color: string;
}

interface TripsEditorProps {
  destinations: Destination[];
  onChange: (next: Destination[]) => void;
}

function TripsEditor({ destinations, onChange }: TripsEditorProps) {
  return (
    <div className="space-y-2">
      {destinations.map((destination, i) => (
        <div key={i} className="flex items-center gap-2">
          <ColorPicker
            label={`Cor de ${destination.name || `destino ${i + 1}`}`}
            value={destination.color}
            onChange={(color) => {
              const next = [...destinations];
              next[i] = { ...next[i], color };
              onChange(next);
            }}
          />
          <input
            type="text"
            value={destination.name}
            maxLength={60}
            placeholder="Cidade, UF"
            aria-label={`Destino ${i + 1}`}
            onChange={(e) => {
              const next = [...destinations];
              next[i] = { ...next[i], name: e.target.value };
              onChange(next);
            }}
            className={cn(INPUT, "flex-1 rounded-xl px-3 py-2.5 text-sm")}
          />
          <button
            type="button"
            onClick={() => onChange(destinations.filter((_, j) => j !== i))}
            aria-label={`Remover ${destination.name || `destino ${i + 1}`}`}
            className="shrink-0 px-2 py-1 text-xs font-semibold text-brand-slate hover:text-brand-danger"
          >
            Remover
          </button>
        </div>
      ))}

      {destinations.length < MAX_DESTINATIONS && (
        <button
          type="button"
          onClick={() => onChange([...destinations, { name: "", color: NEW_DESTINATION_COLOR }])}
          className="text-xs font-semibold text-brand-ink hover:text-brand-pink-deep"
        >
          + Adicionar destino
        </button>
      )}
    </div>
  );
}

interface FavPhotoPickerProps {
  config: SiteConfig;
  current: string;
  onPick: (src: string) => void;
}

/** Picks the hero photo from whatever the couple has already uploaded. */
function FavPhotoPicker({ config, current, onPick }: FavPhotoPickerProps) {
  const all = [
    ...new Set([config.about.photo, ...config.galleries.flatMap((gallery) => gallery.photos)]),
  ];

  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-brand-ink">Escolha a foto</p>
      <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-6">
        {all.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => onPick(src)}
            aria-label={`Foto ${i + 1}`}
            aria-pressed={current === src}
            className={cn(
              "aspect-square overflow-hidden rounded-xl",
              current === src
                ? "ring-2 ring-brand-ink ring-offset-2 ring-offset-brand-mist"
                : "opacity-60 hover:opacity-100",
            )}
          >
            <img src={src} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
