/**
 * Smoke tests against a live dev server on http://localhost:3000.
 *
 * Run with:
 *   # In one terminal:
 *   bun run --filter './packages/app' dev
 *   # In another:
 *   cd packages/app && bun test
 *
 * Or via the root `bun run test:smoke` script which orchestrates both.
 *
 * Scope: SSR-rendered HTML only. Client-side interactions (mode switching,
 * wallet connect) require a headless browser; tracked as a follow-up to
 * add Playwright once Vercel preview deploys exist.
 */
import { describe, expect, test } from 'bun:test';

const BASE = process.env['SMOKE_BASE_URL'] ?? 'http://localhost:3000';

async function fetchText(path: string): Promise<{ status: number; body: string }> {
  const r = await fetch(`${BASE}${path}`);
  const body = await r.text();
  return { status: r.status, body };
}

describe('SpeakUp smoke', () => {
  test('GET / renders demo holdings landing', async () => {
    const { status, body } = await fetchText('/');
    expect(status).toBe(200);
    expect(body).toContain('SpeakUp');
    expect(body).toContain('Your demo holdings');
    expect(body).toContain('Robinhood Chain Testnet');
    expect(body).toContain('Tesla');
    expect(body).toContain('Amazon');
    expect(body).toContain('Netflix');
  });

  test('GET / advertises proposal counts that match DEMO_PROPOSALS', async () => {
    const { body } = await fetchText('/');
    // React inserts <!-- --> between dynamic number and text node; use regex.
    // Button text is "{N} proposals" with an arrow icon.
    expect(body).toMatch(/>7[^<>]*<[^>]*>[^>]*>?\s*proposals/);
    expect(body).toMatch(/>8[^<>]*<[^>]*>[^>]*>?\s*proposals/);
    expect(body).toMatch(/>5[^<>]*<[^>]*>[^>]*>?\s*proposals/);
  });

  test('GET /about renders project explainer', async () => {
    const { status, body } = await fetchText('/about');
    expect(status).toBe(200);
    expect(body).toContain('plain-English shareholder voting');
    expect(body).toContain('Robinhood Chain');
    expect(body).toContain('shareholder');
  });

  test('GET /meeting/TSLA-2025-ANNUAL renders Tesla meeting', async () => {
    const { status, body } = await fetchText('/meeting/TSLA-2025-ANNUAL');
    expect(status).toBe(200);
    expect(body).toContain('Back to holdings');
  });

  test('API /api/proposals?meetingId=TSLA-2025-ANNUAL returns 7 proposals', async () => {
    const { status, body } = await fetchText(
      '/api/proposals?meetingId=TSLA-2025-ANNUAL',
    );
    expect(status).toBe(200);
    const data = JSON.parse(body) as {
      proposals: { proposals: unknown[] };
      recommendations: { recommendations: unknown[] };
      demo?: boolean;
    };
    expect(data.proposals.proposals.length).toBe(7);
    expect(data.recommendations.recommendations.length).toBe(7);
    expect(data.demo).toBe(true);
  });

  test('API /api/proposals?meetingId=AMZN-2026-ANNUAL returns 8 proposals', async () => {
    const { body } = await fetchText('/api/proposals?meetingId=AMZN-2026-ANNUAL');
    const data = JSON.parse(body) as { proposals: { proposals: unknown[] } };
    expect(data.proposals.proposals.length).toBe(8);
  });

  test('API /api/proposals?meetingId=NFLX-2026-ANNUAL returns 5 proposals', async () => {
    const { body } = await fetchText('/api/proposals?meetingId=NFLX-2026-ANNUAL');
    const data = JSON.parse(body) as { proposals: { proposals: unknown[] } };
    expect(data.proposals.proposals.length).toBe(5);
  });

  test('API /api/proposals 400s on missing meetingId', async () => {
    const { status } = await fetchText('/api/proposals');
    expect(status).toBe(400);
  });
});
