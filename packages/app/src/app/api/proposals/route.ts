import { NextResponse } from 'next/server';

import {
  advise,
  DEMO_PROPOSALS,
  fetchDef14aFilings,
  fetchDef14aTextCached,
  readProposals,
  type ProposalList,
  type RecommendationList,
} from '@speakup/agent';

import { DEFAULT_PREFERENCES } from '../../../lib/preferences';
import { useMeetings } from '../../../hooks/useMeetings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CACHE_DIR = process.env['EDGAR_CACHE_DIR'] ?? '.cache/edgar';
const MEETING_TO_CIK: Record<string, { ticker: string; cik: string; defUrl: string }> = {
  'TSLA-2025-ANNUAL': {
    ticker: 'TSLA',
    cik: '1318605',
    defUrl:
      'https://www.sec.gov/Archives/edgar/data/1318605/000110465925090866/tm252289-12_def14a.htm',
  },
  'AMZN-2026-ANNUAL': {
    ticker: 'AMZN',
    cik: '1018724',
    defUrl:
      'https://www.sec.gov/Archives/edgar/data/1018724/000110465926041026/tm261382-1_def14a.htm',
  },
  'NFLX-2026-ANNUAL': {
    ticker: 'NFLX',
    cik: '1065280',
    defUrl:
      'https://www.sec.gov/Archives/edgar/data/1065280/000119312526159286/d20613ddef14a.htm',
  },
};

// In-memory cache per process. Survives request-to-request within a single
// dev server lifetime. Production swaps for Redis.
const memo = new Map<
  string,
  { at: number; proposals: ProposalList; recommendations: RecommendationList }
>();
const TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

export async function GET(req: Request) {
  const url = new URL(req.url);
  const meetingId = url.searchParams.get('meetingId');
  if (!meetingId) {
    return NextResponse.json({ error: 'meetingId required' }, { status: 400 });
  }
  const entry = MEETING_TO_CIK[meetingId];
  if (!entry) {
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

  // Demo mode: when no Anthropic key is configured, serve pre-canned
  // proposals so judges can experience the full flow without provisioning.
  if (!process.env['ANTHROPIC_API_KEY']) {
    const demo = DEMO_PROPOSALS[meetingId];
    if (demo) {
      return NextResponse.json({
        proposals: demo.proposals,
        recommendations: demo.recommendations,
        cached: false,
        demo: true,
      });
    }
    return NextResponse.json(
      { error: 'demo proposals not available for this meeting' },
      { status: 503 },
    );
  }

  try {
    const defUrl = await resolveLatestDefUrl(entry);
    const { text } = await fetchDef14aTextCached(defUrl, CACHE_DIR);
    const proposals = await readProposals({
      ticker: entry.ticker,
      defUrl,
      bodyText: text,
    });
    const recommendations = await advise({
      proposals,
      preferences: DEFAULT_PREFERENCES,
      meetingContext: `${entry.ticker} shareholder meeting. DEF 14A source: ${defUrl}`,
    });
    memo.set(meetingId, { at: Date.now(), proposals, recommendations });
    return NextResponse.json({ proposals, recommendations, cached: false });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function resolveLatestDefUrl(entry: {
  ticker: string;
  cik: string;
  defUrl: string;
}): Promise<string> {
  // Prefer the hardcoded URL we know is parseable. Fall back to live EDGAR.
  if (entry.defUrl) return entry.defUrl;
  const filings = await fetchDef14aFilings(entry.cik, 1);
  if (!filings[0]) throw new Error(`no DEF 14A filings for ${entry.ticker}`);
  return filings[0].url;
}
