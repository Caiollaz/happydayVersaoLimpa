/**
 * Key dates of the relationship — centralized so any component can import
 * them without prop-drilling.
 *
 * COUPLE_MET_DATE drives the "Dias juntos" counter in the retrospective
 * (the romantic origin). RELATIONSHIP_START drives the main site countdown
 * (the anniversary of the formal "pedido em namoro").
 */

// February 14, 2025 — the day they met.
export const COUPLE_MET_DATE = new Date(2025, 1, 14, 0, 0, 0);

// April 5, 2025 — formal start of the namoro. Powers CountdownTimer on
// the home AboutUsCard.
export const RELATIONSHIP_START = new Date(2025, 3, 5, 0, 0, 0);

// April 5, 2026 — the gift / 1-year celebration date.
export const GIFT_DATE = new Date(2026, 3, 5, 0, 0, 0);

/**
 * Full days elapsed between two dates (floor). Used by DaysTogetherStory
 * to show the running counter from COUPLE_MET_DATE.
 */
export function daysBetween(from: Date, to: Date): number {
  const ms = to.getTime() - from.getTime();
  return Math.max(0, Math.floor(ms / 86_400_000));
}
