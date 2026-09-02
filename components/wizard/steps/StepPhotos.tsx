"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";

import type { StepProps } from "../Wizard";
import { TextField } from "../fields";

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
        <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-brand-ink">As fotos</h1>
        <p className="mt-1 text-body text-brand-slate">
          As fotos de exemplo já estão aqui — troque pelas suas. A localização e os dados da câmera
          são removidos de toda foto enviada.
        </p>
      </header>

      {config.galleries.map((gallery, gi) => (
        <GalleryEditor
          key={gallery.id}
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

interface Gallery {
  id: string;
  title: string;
  thumbnail: string;
  photos: string[];
}

interface GalleryEditorProps {
  gallery: Gallery;
  token: string;
  onChange: (next: Partial<Gallery>) => void;
}

const TOOL_BUTTON = "grid h-7 w-7 place-items-center rounded-md text-white/80 hover:text-white";

function GalleryEditor({ gallery, token, onChange }: GalleryEditorProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const latestPhotos = useRef(gallery.photos);
  const [busy, setBusy] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    latestPhotos.current = gallery.photos;
  }, [gallery.photos]);

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
      // arrays replace rather than merge. Read the latest photos, not the
      // ones captured when the upload started — the user may have reordered
      // or removed some while the files were in flight.
      onChange({ photos: [...latestPhotos.current, ...added] });
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
    <section className="rounded-card bg-brand-mist p-5">
      <TextField
        label="Nome do álbum"
        value={gallery.title}
        maxLength={40}
        onChange={(title) => onChange({ title })}
      />

      <div className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-5">
        {gallery.photos.map((src, i) => (
          <figure
            key={`${src}-${i}`}
            className={cn(
              "group relative aspect-square overflow-hidden rounded-xl bg-brand-lav",
              gallery.thumbnail === src &&
                "ring-2 ring-brand-ink ring-offset-2 ring-offset-brand-mist",
            )}
          >
            <img src={src} alt="" className="h-full w-full object-cover" draggable={false} />

            <div className="absolute inset-x-0 bottom-0 flex justify-between gap-0.5 bg-brand-ink/75 p-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
              <button
                type="button"
                onClick={() => move(i, i - 1)}
                aria-label="Mover para trás"
                className={TOOL_BUTTON}
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onChange({ thumbnail: src })}
                aria-label="Usar como capa"
                aria-pressed={gallery.thumbnail === src}
                className={cn(TOOL_BUTTON, "w-auto px-1.5 text-[10px] font-bold")}
              >
                capa
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label="Remover foto"
                className={cn(TOOL_BUTTON, "hover:text-brand-coral-light")}
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => move(i, i + 1)}
                aria-label="Mover para frente"
                className={TOOL_BUTTON}
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </figure>
        ))}

        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          aria-label="Adicionar fotos"
          aria-busy={busy > 0}
          className="grid aspect-square place-items-center rounded-xl border-2 border-dashed border-brand-stroke text-brand-slate transition-colors hover:border-brand-ink hover:text-brand-ink"
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

      {error && (
        <p role="alert" className="mt-3 text-xs text-brand-danger">
          {error}
        </p>
      )}
    </section>
  );
}
