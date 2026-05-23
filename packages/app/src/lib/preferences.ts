import type { UserPreference } from '@speakup/agent';

/**
 * Default preference used for unauthenticated demo. In D11-D14 we wire this
 * to a settings panel and persist via localStorage; for now everyone sees
 * the same opinionated baseline.
 */
export const DEFAULT_PREFERENCES: UserPreference = {
  esgSlant: 'progressive',
  executiveCompensation: 'oppose_high_packages',
  boardIndependence: 'prefer_independent_majority',
  shareholderRights: 'expand',
  customNotes:
    'I am a retail Robinhood shareholder. Prefer plain-English reasoning. Skeptical of management-friendly proposals on pay packages above $50M.',
};
