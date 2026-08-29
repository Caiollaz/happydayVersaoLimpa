import { z } from "zod";

/**
 * The entire content of one published site, as a single serializable object.
 *
 * This is the product's core data structure: the wizard writes it, the
 * database stores it as JSON, and every component reads from it. Nothing
 * about a couple's site lives anywhere else.
 *
 * Two rules keep it honest:
 *
 * 1. **JSON-serializable only.** No `Date`, no functions. Dates are
 *    "YYYY-MM-DD" strings — see `parseLocalDate` for why that matters.
 * 2. **Every user-visible string lives here.** If a component hardcodes
 *    text, that text can never be personalized, which is the whole product.
 */

/** Bumped when a change to this shape needs a migration of stored configs. */
export const CONFIG_VERSION = 1;

/** "YYYY-MM-DD". Rejects impossible dates like 2025-02-31. */
const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "use o formato AAAA-MM-DD")
  .refine((s) => {
    const [y, m, d] = s.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    return (
      dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d
    );
  }, "data inexistente");

/**
 * A path to an image or audio file. Either a bundled asset ("/photos/…")
 * or an uploaded one ("/api/media/…"). Rejecting everything else keeps a
 * user-supplied config from pointing at an arbitrary external URL, which
 * would leak every visitor's IP to a third party and let someone swap the
 * content after we've reviewed it.
 */
const assetPath = z
  .string()
  .min(1)
  .refine(
    (s) => /^\/(photos|covers|audio|api\/media)\//.test(s),
    "o caminho precisa apontar pra um arquivo do próprio site",
  );

const hexColor = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, "use uma cor hex tipo #FF7A5A");

/** Wraps a slide's own fields with the toggle the wizard needs. */
const slide = <T extends z.ZodRawShape>(shape: T) =>
  z.object({ enabled: z.boolean().default(true), ...shape });

export const siteConfigSchema = z.object({
  version: z.literal(CONFIG_VERSION).default(CONFIG_VERSION),

  /** Who made it, and who it's for. Used across ~8 components. */
  couple: z.object({
    /** The person giving the gift. */
    authorName: z.string().min(1).max(40),
    /** The person receiving it. */
    recipientName: z.string().min(1).max(40),
  }),

  dates: z.object({
    /** The day they met — drives "Dias juntos" in the retrospective. */
    met: dateString,
    /** Formal start of the relationship — drives the home countdown. */
    relationshipStart: dateString,
    /** The occasion this site celebrates. Shown on the landing screen. */
    gift: dateString,
  }),

  /** The full-screen landing overlay, before anything else is reachable. */
  anchor: z.object({
    /** Big headline. `{author}` is substituted at render time. */
    headline: z.string().min(1).max(120),
    subhead: z.string().max(200),
    ctaLabel: z.string().min(1).max(30),
  }),

  /** The Now Playing card at the top of the site. */
  player: z.object({
    audioSrc: assetPath,
    trackTitle: z.string().min(1).max(80),
    trackArtist: z.string().min(1).max(80),
    /** Rotating cover art. At least one, or the card has nothing to show. */
    covers: z.array(assetPath).min(1).max(20),
  }),

  about: z.object({
    heading: z.string().min(1).max(60),
    photo: assetPath,
    /** e.g. "Juntos desde 2025" — free text so it can be a place or a joke. */
    subtitle: z.string().max(60),
  }),

  letter: z.object({
    /** Small label above the title. */
    eyebrow: z.string().max(40),
    title: z.string().min(1).max(60),
    /** The letter itself. Blank lines separate paragraphs. */
    body: z.string().min(1).max(8000),
    /** Line above the sign-off, e.g. "Com todo meu amor,". */
    signatureLabel: z.string().max(60),
    /** Sign-off itself, e.g. "Léo 💚". */
    signature: z.string().max(60),
    ctaLabel: z.string().min(1).max(40),
  }),

  /** The horizontal strip of photo albums. */
  galleries: z
    .array(
      z.object({
        id: z.string().min(1).max(40),
        title: z.string().min(1).max(40),
        thumbnail: assetPath,
        photos: z.array(assetPath).min(1).max(60),
      }),
    )
    .max(6),

  /** The card that opens the retrospective. */
  retroCard: z.object({
    eyebrow: z.string().max(40),
    /** First line, rendered in gold above the second. */
    titleTop: z.string().max(30),
    titleBottom: z.string().max(30),
    description: z.string().max(200),
    ctaLabel: z.string().min(1).max(30),
  }),

  /** The Wrapped-style story player. */
  retro: z.object({
    enabled: z.boolean().default(true),
    audioSrc: assetPath,

    slides: z.object({
      intro: slide({
        eyebrow: z.string().max(40),
        subhead: z.string().max(120),
      }),
      whereStarted: slide({
        eyebrow: z.string().max(40),
        context: z.string().max(160),
      }),
      movie: slide({
        eyebrow: z.string().max(40),
        title: z.string().max(40),
        /** Display-only, e.g. "01·03·25" — not parsed as a date. */
        date: z.string().max(20),
        tagline1: z.string().max(80),
        tagline2: z.string().max(80),
        rating: z.number().int().min(0).max(10),
      }),
      days: slide({
        eyebrow: z.string().max(40),
        caption: z.string().max(80),
      }),
      messages: slide({
        eyebrow: z.string().max(40),
        total: z.number().int().min(0).max(100_000_000),
        caption: z.string().max(80),
      }),
      trips: slide({
        eyebrow: z.string().max(40),
        label: z.string().max(40),
        destinations: z
          .array(
            z.object({
              name: z.string().min(1).max(60),
              color: hexColor,
            }),
          )
          .max(8),
      }),
      song: slide({
        eyebrow: z.string().max(40),
        title: z.string().max(80),
        artist: z.string().max(80),
        coverSrc: assetPath,
        verse: z.string().max(160),
      }),
      photos: slide({
        eyebrow: z.string().max(40),
        caption: z.string().max(80),
        /** Free text, e.g. "412+" — a count nobody wants to be exact. */
        countLabel: z.string().max(12),
        /** The floating collage. Twelve slots in the current layout. */
        collage: z.array(assetPath).max(12),
      }),
      favPhoto: slide({
        eyebrow: z.string().max(40),
        src: assetPath,
        caption: z.string().max(120),
      }),
      poster: slide({
        eyebrow: z.string().max(40),
        /** Labels on the 2x2 recap grid. The values are derived from the
         *  other slides, so only the labels are editable. */
        statLabels: z.object({
          days: z.string().max(24),
          messages: z.string().max(24),
          trips: z.string().max(24),
          song: z.string().max(24),
        }),
      }),
      whatsNext: slide({
        eyebrow: z.string().max(40),
        phrase: z.string().max(120),
        backLabel: z.string().max(40),
      }),
    }),
  }),

  /** Browser tab and link-preview text. This is what WhatsApp shows. */
  meta: z.object({
    title: z.string().min(1).max(70),
    description: z.string().max(160),
  }),
});

export type SiteConfig = z.infer<typeof siteConfigSchema>;
export type SlideKey = keyof SiteConfig["retro"]["slides"];
export type Gallery = SiteConfig["galleries"][number];

/**
 * Parses "YYYY-MM-DD" as local midnight.
 *
 * `new Date("2025-02-14")` is parsed as *UTC* midnight, which in Brazil is
 * 21:00 on the 13th — so a naive parse renders the wrong day and makes
 * every day-counter off by one. Splitting the parts avoids that entirely.
 */
export function parseLocalDate(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

/** Full days between two dates, floored and clamped at zero. */
export function daysBetween(from: Date, to: Date): number {
  return Math.max(0, Math.floor((to.getTime() - from.getTime()) / 86_400_000));
}

/**
 * Substitutes `{author}` and `{recipient}` in a config string.
 *
 * Lets the wizard ship a default headline that reads naturally for any
 * couple ("{author} preparou um presente especial") without the user
 * having to retype their own name into it.
 */
export function interpolate(
  template: string,
  couple: SiteConfig["couple"],
): string {
  return template
    .replaceAll("{author}", couple.authorName)
    .replaceAll("{recipient}", couple.recipientName);
}

/** Parses unknown JSON into a SiteConfig, throwing on anything invalid. */
export function parseSiteConfig(value: unknown): SiteConfig {
  return siteConfigSchema.parse(value);
}
