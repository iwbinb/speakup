import { NextResponse } from 'next/server';

import { DEMO_PROPOSALS } from '@speakup/agent/demo-proposals';
import type { ProposalList, RecommendationList } from '@speakup/agent/types';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/**
 * Proposals API.
 *
 * Currently serves pre-canned DEMO_PROPOSALS for every meeting. Production
 * Real-mode (live SEC EDGAR + Anthropic Reader + Anthropic Advisor) runs in
 * local dev where Node-only deps (linkedom HTML parser, node:fs cache) work
 * natively. On Cloudflare Pages Edge runtime, those deps cannot be bundled
 * so the real path is intentionally inactive here; the Edge deployment is
 * a judge-friendly demo surface.
 *
 * To activate real-mode on a production deployment:
 *   1. Move the route to a Node-runtime host (Vercel, Fly, Railway), OR
 *   2. Replace the file cache with Cloudflare KV / R2 and the linkedom
 *      HTML parser with an Edge-compatible alternative, then re-import
 *      from @speakup/agent at module scope.
 */

const MEETINGS = new Set([
  'TSLA-2025-ANNUAL',
  'AMZN-2026-ANNUAL',
  'NFLX-2026-ANNUAL',
]);

// In-memory cache per worker isolate.
const memo = new Map<
  string,
  { at: number; proposals: ProposalList; recommendations: RecommendationList }
>();
const TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

export function GET(req: Request) {
  const url = new URL(req.url);
  const meetingId = url.searchParams.get('meetingId');
  if (!meetingId) {
    return NextResponse.json({ error: 'meetingId required' }, { status: 400 });
  }
  if (!MEETINGS.has(meetingId)) {
    return NextResponse.json({ error: 'unknown meetingId' }, { status: 404 });
  }

  const hit = memo.get(meetingId);
  if (hit && Date.now() - hit.at < TTL_MS) {
    return NextResponse.json({
      proposals: hit.proposals,
      recommendations: hit.recommendations,
      cached: true,
    });
  }

  const demo = DEMO_PROPOSALS[meetingId];
  if (!demo) {
    return NextResponse.json(
      { error: 'demo proposals not available for this meeting' },
      { status: 503 },
    );
  }
  memo.set(meetingId, {
    at: Date.now(),
    proposals: demo.proposals,
    recommendations: demo.recommendations,
  });
  return NextResponse.json({
    proposals: demo.proposals,
    recommendations: demo.recommendations,
    cached: false,
    demo: true,
  });
}
