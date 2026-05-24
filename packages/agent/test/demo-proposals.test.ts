/**
 * Validates every DEMO_PROPOSALS entry against the canonical zod schemas.
 * Catches accidental data drift between docs/d1-research.md, the SEC
 * filings, and what the UI actually renders.
 *
 *   cd packages/agent && bun test
 */
import { describe, expect, test } from 'bun:test';

import { DEMO_PROPOSALS } from '../src/demo-proposals';
import {
  ProposalListSchema,
  RecommendationListSchema,
} from '../src/types';

const MEETINGS = Object.keys(DEMO_PROPOSALS);

describe('DEMO_PROPOSALS · canonical demo data integrity', () => {
  test('covers exactly the 3 demo meeting ids', () => {
    expect(MEETINGS.sort()).toEqual(
      ['AMZN-2026-ANNUAL', 'NFLX-2026-ANNUAL', 'TSLA-2025-ANNUAL'].sort(),
    );
  });

  test.each(MEETINGS)('%s · proposals match ProposalListSchema', (id) => {
    const payload = DEMO_PROPOSALS[id]!;
    const parsed = ProposalListSchema.safeParse(payload.proposals);
    if (!parsed.success) {
      console.error(parsed.error.format());
    }
    expect(parsed.success).toBe(true);
  });

  test.each(MEETINGS)('%s · recommendations match RecommendationListSchema', (id) => {
    const payload = DEMO_PROPOSALS[id]!;
    const parsed = RecommendationListSchema.safeParse(payload.recommendations);
    if (!parsed.success) {
      console.error(parsed.error.format());
    }
    expect(parsed.success).toBe(true);
  });

  test.each(MEETINGS)('%s · every proposal has a recommendation', (id) => {
    const payload = DEMO_PROPOSALS[id]!;
    const proposalIds = payload.proposals.proposals.map((p) => p.itemId).sort();
    const recIds = payload.recommendations.recommendations
      .map((r) => r.itemId)
      .sort();
    expect(recIds).toEqual(proposalIds);
  });

  test.each(MEETINGS)('%s · itemIds are unique', (id) => {
    const payload = DEMO_PROPOSALS[id]!;
    const ids = payload.proposals.proposals.map((p) => p.itemId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test.each(MEETINGS)('%s · meeting title is non-empty and includes year', (id) => {
    const t = DEMO_PROPOSALS[id]!.proposals.meetingTitle;
    expect(t.length).toBeGreaterThan(10);
    expect(/(2025|2026|2027)/.test(t)).toBe(true);
  });

  test.each(MEETINGS)('%s · meetingDate parses as ISO YYYY-MM-DD', (id) => {
    const d = DEMO_PROPOSALS[id]!.proposals.meetingDate;
    expect(/^\d{4}-\d{2}-\d{2}$/.test(d)).toBe(true);
    expect(Number.isNaN(Date.parse(d))).toBe(false);
  });

  test.each(MEETINGS)(
    '%s · each recommendation has exactly 3 rationale lines',
    (id) => {
      for (const r of DEMO_PROPOSALS[id]!.recommendations.recommendations) {
        expect(r.threeLineRationale.length).toBe(3);
        for (const line of r.threeLineRationale) {
          expect(line.trim().length).toBeGreaterThan(0);
        }
      }
    },
  );

  test.each(MEETINGS)('%s · confidence is one of low/medium/high', (id) => {
    for (const r of DEMO_PROPOSALS[id]!.recommendations.recommendations) {
      expect(['low', 'medium', 'high']).toContain(r.confidence);
    }
  });

  test.each(MEETINGS)('%s · key details list is reasonable', (id) => {
    for (const p of DEMO_PROPOSALS[id]!.proposals.proposals) {
      expect(p.keyDetails.length).toBeGreaterThan(0);
      expect(p.keyDetails.length).toBeLessThanOrEqual(5);
      for (const d of p.keyDetails) {
        expect(d.trim().length).toBeGreaterThan(0);
      }
    }
  });

  test('proposal counts match the values the landing page advertises', () => {
    expect(
      DEMO_PROPOSALS['TSLA-2025-ANNUAL']!.proposals.proposals.length,
    ).toBe(7);
    expect(
      DEMO_PROPOSALS['AMZN-2026-ANNUAL']!.proposals.proposals.length,
    ).toBe(8);
    expect(
      DEMO_PROPOSALS['NFLX-2026-ANNUAL']!.proposals.proposals.length,
    ).toBe(5);
  });
});
