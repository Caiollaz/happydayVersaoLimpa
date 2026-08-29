"use client";

import type { StepProps } from "../Wizard";
import { NumberField, TextArea, TextField, Toggle } from "../fields";
import type { SiteConfig, SlideKey } from "@/lib/config/schema";

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
        <h1 className="text-2xl font-black text-white">A retrospectiva</h1>
        <p className="mt-1 text-sm text-white/50">
          Onze telas em estilo Wrapped. Desligue as que não combinam com a
          história de vocês.
        </p>
      </header>

      <Toggle
        label="Incluir a retrospectiva"
        hint="disponível no plano Premium"
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
            <p className="text-xs text-white/40">
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
                hint="o filme, o show, o lugar"
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
              hint="dá pra estimar — ninguém confere"
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
                hint="texto livre, tipo “412+”"
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
            <p className="text-xs text-white/40">
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

function SlideCard({
  title,
  slide,
  onToggle,
  children,
}: {
  title: string;
  slide: { enabled: boolean };
  onToggle: (enabled: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <Toggle label={title} checked={slide.enabled} onChange={onToggle} />
      {slide.enabled && <div className="mt-4 space-y-4">{children}</div>}
    </section>
  );
}

function TripsEditor({
  destinations,
  onChange,
}: {
  destinations: { name: string; color: string }[];
  onChange: (next: { name: string; color: string }[]) => void;
}) {
  return (
    <div className="space-y-2">
      {destinations.map((d, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="color"
            value={d.color}
            aria-label={`Cor de ${d.name || "destino"}`}
            onChange={(e) => {
              const next = [...destinations];
              next[i] = { ...next[i], color: e.target.value };
              onChange(next);
            }}
            className="h-9 w-9 shrink-0 cursor-pointer rounded border border-white/10 bg-transparent"
          />
          <input
            type="text"
            value={d.name}
            maxLength={60}
            placeholder="Cidade, UF"
            onChange={(e) => {
              const next = [...destinations];
              next[i] = { ...next[i], name: e.target.value };
              onChange(next);
            }}
            className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-spotify-green"
          />
          <button
            type="button"
            onClick={() => onChange(destinations.filter((_, j) => j !== i))}
            className="rounded px-2 py-1 text-xs text-white/50 hover:text-red-400"
          >
            remover
          </button>
        </div>
      ))}

      {destinations.length < 8 && (
        <button
          type="button"
          onClick={() =>
            onChange([...destinations, { name: "", color: "#FF7A5A" }])
          }
          className="text-xs font-semibold text-spotify-green hover:underline"
        >
          + adicionar destino
        </button>
      )}
    </div>
  );
}

/** Picks the hero photo from whatever the couple has already uploaded. */
function FavPhotoPicker({
  config,
  current,
  onPick,
}: {
  config: SiteConfig;
  current: string;
  onPick: (src: string) => void;
}) {
  const all = [
    ...new Set([config.about.photo, ...config.galleries.flatMap((g) => g.photos)]),
  ];

  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-white">Escolha a foto</p>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {all.map((src) => (
          <button
            key={src}
            type="button"
            onClick={() => onPick(src)}
            aria-pressed={current === src}
            className={
              current === src
                ? "aspect-square overflow-hidden rounded-lg ring-2 ring-spotify-green"
                : "aspect-square overflow-hidden rounded-lg opacity-60 hover:opacity-100"
            }
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
