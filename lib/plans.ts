/**
 * What each plan costs and what it allows.
 *
 * Quotas are enforced at upload time (Phase 2) and at publish time (Phase 4),
 * so this module is imported by both. Prices are in cents to keep floating
 * point away from money.
 */

export const PLAN_IDS = ["basico", "premium"] as const;
export type PlanId = (typeof PLAN_IDS)[number];

export interface Plan {
  id: PlanId;
  name: string;
  /** BRL cents. */
  priceCents: number;
  /** How long the published site stays online. */
  hostingDays: number;
  /** Total photos across every gallery plus the retrospective. */
  maxPhotos: number;
  /** Whether the Wrapped-style retrospective is included. */
  retrospective: boolean;
  /** Whether they can upload their own audio instead of the free catalog. */
  customAudio: boolean;
  /** Shown on the pricing page. */
  highlights: string[];
}

export const PLANS: Record<PlanId, Plan> = {
  basico: {
    id: "basico",
    name: "Básico",
    priceCents: 2900,
    hostingDays: 365,
    maxPhotos: 20,
    retrospective: false,
    customAudio: false,
    highlights: [
      "Site no ar por 1 ano",
      "Até 20 fotos",
      "Carta personalizada",
      "Música do nosso catálogo",
    ],
  },
  premium: {
    id: "premium",
    name: "Premium",
    priceCents: 4900,
    hostingDays: 365,
    maxPhotos: 60,
    retrospective: true,
    customAudio: true,
    highlights: [
      "Tudo do Básico",
      "Retrospectiva completa (11 telas)",
      "Até 60 fotos",
      "Sua própria música",
    ],
  },
};

/** Quotas applied to a draft, before anyone has chosen a plan. */
export const DRAFT_LIMITS = {
  /** The most generous plan's cap — a draft shouldn't block an upgrade. */
  maxPhotos: PLANS.premium.maxPhotos,
} as const;

export function isPlanId(value: unknown): value is PlanId {
  return typeof value === "string" && PLAN_IDS.includes(value as PlanId);
}

/** Formats cents as "R$ 29,00". */
export function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
