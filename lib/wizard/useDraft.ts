"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { SiteConfig } from "@/lib/config/schema";

export type SaveState =
  | { status: "idle" }
  | { status: "saving" }
  | { status: "saved"; at: number }
  | { status: "error"; message: string };

/** How long to wait after the last keystroke before saving. */
const DEBOUNCE_MS = 700;

/** A patch shaped like a subtree of SiteConfig. */
export type ConfigPatch = Record<string, unknown>;

export interface Draft {
  config: SiteConfig;
  save: SaveState;
  /** Applies a patch locally and schedules an autosave. */
  patch: (patch: ConfigPatch) => void;
  /** Forces any pending write to land now. Resolves with the outcome. */
  flush: () => Promise<SaveState>;
}

/**
 * Local draft state with debounced autosave.
 *
 * The optimistic local copy is what the preview renders, so typing feels
 * instant; the server is caught up in the background. Patches are merged
 * into one pending payload rather than queued, so holding a key down sends
 * one request instead of forty.
 *
 * The server's response is deliberately **not** written back into local
 * state. It arrives hundreds of milliseconds late, and applying it would
 * yank the cursor back in whatever field the user has kept typing in.
 */
export function useDraft(
  siteId: string,
  token: string,
  initial: SiteConfig,
): Draft {
  const [config, setConfig] = useState(initial);
  const [save, setSave] = useState<SaveState>({ status: "idle" });

  const pending = useRef<ConfigPatch>({});
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlight = useRef<Promise<SaveState> | null>(null);

  const send = useCallback(async (): Promise<SaveState> => {
    if (Object.keys(pending.current).length === 0) {
      return { status: "saved", at: Date.now() };
    }

    const payload = pending.current;
    pending.current = {};
    setSave({ status: "saving" });

    try {
      const res = await fetch(`/api/sites/${siteId}`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          "x-edit-token": token,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        // Put the rejected fields back so the next save retries them
        // instead of silently dropping the user's work.
        pending.current = { ...payload, ...pending.current };
        const failed: SaveState = {
          status: "error",
          message: body.issues?.[0]?.message ?? body.error ?? "não consegui salvar",
        };
        setSave(failed);
        return failed;
      }

      const saved: SaveState = { status: "saved", at: Date.now() };
      setSave(saved);
      return saved;
    } catch {
      pending.current = { ...payload, ...pending.current };
      const offline: SaveState = { status: "error", message: "sem conexão — vou tentar de novo" };
      setSave(offline);
      return offline;
    }
  }, [siteId, token]);

  const patch = useCallback(
    (next: ConfigPatch) => {
      setConfig((prev) => mergeLocal(prev, next));
      pending.current = mergeLocal(pending.current, next) as ConfigPatch;

      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        inFlight.current = send();
      }, DEBOUNCE_MS);
    },
    [send],
  );

  const flush = useCallback(async () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    await inFlight.current;
    return send();
  }, [send]);

  // Last-ditch save when the tab closes mid-edit.
  //
  // `keepalive` lets the request outlive the page — a normal fetch is
  // cancelled on unload. Chosen over `sendBeacon`, which cannot set headers
  // and would force the edit token into a query string, where it would sit
  // in every access log along the way.
  useEffect(() => {
    const handler = () => {
      if (Object.keys(pending.current).length === 0) return;
      fetch(`/api/sites/${siteId}`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          "x-edit-token": token,
        },
        body: JSON.stringify(pending.current),
        keepalive: true,
      }).catch(() => {
        // Nothing useful to do — the page is going away.
      });
    };
    window.addEventListener("pagehide", handler);
    return () => window.removeEventListener("pagehide", handler);
  }, [siteId, token]);

  return { config, save, patch, flush };
}

/**
 * Same merge rule as the server: objects merge, arrays replace.
 *
 * Kept in sync deliberately — if the two disagreed, the preview would show
 * something different from what gets saved.
 */
function mergeLocal<T>(current: T, patch: Record<string, unknown>): T {
  const out = { ...(current as object) } as Record<string, unknown>;

  for (const [key, value] of Object.entries(patch)) {
    const existing = out[key];
    out[key] =
      isPlainObject(existing) && isPlainObject(value)
        ? mergeLocal(existing, value)
        : value;
  }

  return out as T;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}
