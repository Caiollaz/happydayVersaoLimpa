"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, Trash2 } from "lucide-react";

import type { StepProps } from "../Wizard";
import { TextField } from "../fields";
import { cn } from "@/lib/utils";

/**
 * Step 2 — the photo albums.
 *
 * Reordering is arrow buttons rather than drag-and-drop. Drag needs a
 * pointer, and most of these sites are built on a phone; arrows work with
 * a thumb, with a keyboard, and with a screen reader for free.
 */
export function StepPhotos({ draft, token }: StepProps) {
  const { config, patch } = draft;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-black text-white">As fotos</h1>
        <p className="mt-1 text-sm text-white/50">
          As fotos de exemplo já estão aqui — troque pelas suas. A localização
          e os dados da câmera são removidos de toda foto enviada.
        </p>
      </header>

      {config.galleries.map((gallery, gi) => (
        <GalleryEditor
          key={gallery.id}
          index={gi}
          gallery={gallery}
          token={token}
          onChange={(next) => {
            const galleries = [...config.galleries];
            galleries[gi] = { ...galleries[gi], ...next };
            patch({ galleries });
          }}
        />
      ))}
    </div>
  );
}

type Gallery = { id: string; title: string; thumbnail: string; photos: string[] };

function GalleryEditor({
  gallery,
  token,
  onChange,
}: {
  index: number;
  gallery: Gallery;
  token: string;
  onChange: (next: Partial<Gallery>) => void;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const upload = async (files: FileList) => {
    setError(null);
    setBusy((n) => n + files.length);

    const added: string[] = [];
    for (const file of Array.from(files)) {
      const body = new FormData();
      body.append("token", token);
      body.append("slot", gallery.id);
      body.append("file", file);

      try {
        const res = await fetch("/api/upload", { method: "POST", body });
        const json = await res.json();
        if (!res.ok) {
          setError(json.error ?? "não consegui enviar essa foto");
        } else {
          added.push(json.url);
        }
      } catch {
        setError("sem conexão — tente de novo");
      } finally {
        setBusy((n) => n - 1);
      }
    }

    if (added.length) {
      // The gallery is replaced wholesale, matching the server's rule that
      // arrays replace rather than merge.
      onChange({ photos: [...gallery.photos, ...added] });
    }
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= gallery.photos.length) return;
    const photos = [...gallery.photos];
    [photos[from], photos[to]] = [photos[to], photos[from]];
    onChange({ photos });
  };

  const remove = (i: number) => {
    // The schema needs at least one photo per gallery, so the last one
    // can't go. Deleting the album itself is a separate action.
    if (gallery.photos.length <= 1) {
      setError("cada álbum precisa de pelo menos uma foto");
      return;
    }
    const photos = gallery.photos.filter((_, j) => j !== i);
    const next: Partial<Gallery> = { photos };
    // The cover pointed at the photo that just left.
    if (gallery.thumbnail === gallery.photos[i]) next.thumbnail = photos[0];
    onChange(next);
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <TextField
        label="Nome do álbum"
        value={gallery.title}
        maxLength={40}
        onChange={(title) => onChange({ title })}
      />

      <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
        {gallery.photos.map((src, i) => (
          <figure
            key={`${src}-${i}`}
            className="group relative aspect-square overflow-hidden rounded-lg bg-white/5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              className="h-full w-full object-cover"
              draggable={false}
            />

            {gallery.thumbnail === src && (
              <span className="absolute left-1 top-1 rounded bg-spotify-green px-1.5 py-0.5 text-[9px] font-bold text-black">
                capa
              </span>
            )}

            <div className="absolute inset-x-0 bottom-0 flex justify-between gap-0.5 bg-black/70 p-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
              <button
                type="button"
                onClick={() => move(i, i - 1)}
                aria-label="Mover para trás"
                className="rounded p-1 text-white/80 hover:text-white"
              >
                <ArrowLeft className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => onChange({ thumbnail: src })}
                aria-label="Usar como capa"
                className="rounded px-1 text-[9px] font-bold text-white/80 hover:text-white"
              >
                capa
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label="Remover foto"
                className="rounded p-1 text-white/80 hover:text-red-400"
              >
                <Trash2 className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => move(i, i + 1)}
                aria-label="Mover para frente"
                className="rounded p-1 text-white/80 hover:text-white"
              >
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </figure>
        ))}

        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          className={cn(
            "grid aspect-square place-items-center rounded-lg border border-dashed border-white/20 text-white/40",
            "transition-colors hover:border-spotify-green hover:text-spotify-green",
          )}
        >
          {busy > 0 ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <ImagePlus className="h-5 w-5" />
          )}
        </button>
      </div>

      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files?.length) upload(e.target.files);
          // Reset so picking the same file twice still fires onChange.
          e.target.value = "";
        }}
      />

      {error && <p className="mt-3 text-xs text-amber-400">{error}</p>}
    </section>
  );
}
