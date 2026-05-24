'use client';

import { useMemo } from 'react';
import { DEMO_PROPOSALS } from '@speakup/agent/demo-proposals';

import { TICKERS } from '../lib/tickers';

export type Meeting = {
  id: string; // canonical label, e.g. "TSLA-2025-ANNUAL"
  ticker: string; // "TSLA"
  title: string; // human label
  date: string; // YYYY-MM-DD
  defUrl: string; // SEC EDGAR URL
  proposalCount: number; // derived from DEMO_PROPOSALS so landing matches detail
};

const DEF_URLS: Record<string, string> = {
  'TSLA-2025-ANNUAL':
    'https://www.sec.gov/Archives/edgar/data/1318605/000110465925090866/tm252289-12_def14a.htm',
  'AMZN-2026-ANNUAL':
    'https://www.sec.gov/Archives/edgar/data/1018724/000110465926041026/tm261382-1_def14a.htm',
  'NFLX-2026-ANNUAL':
    'https://www.sec.gov/Archives/edgar/data/1065280/000119312526159286/d20613ddef14a.htm',
};

/**
 * Static meeting catalog. In production this is read from Registry events
 * + indexer GraphQL. For the hackathon build we derive metadata + count
 * from DEMO_PROPOSALS so landing card numbers always match the detail page.
 */
export function useMeetings(tickerFilter?: string): Meeting[] {
  return useMemo(() => {
    const all: Meeting[] = Object.entries(DEMO_PROPOSALS).map(([id, payload]) => {
      const ticker = id.split('-')[0]!;
      return {
        id,
        ticker,
        title: payload.proposals.meetingTitle,
        date: payload.proposals.meetingDate,
        defUrl: DEF_URLS[id] ?? '',
        proposalCount: payload.proposals.proposals.length,
      };
    });
    if (!tickerFilter) return all;
    return all.filter((m) => m.ticker === tickerFilter.toUpperCase());
  }, [tickerFilter]);
}

export function findMeeting(id: string): Meeting | undefined {
  return useMeetings().find((m) => m.id === id);
}

export function tickerCikMap(): Record<string, string> {
  return Object.fromEntries(TICKERS.map((t) => [t.symbol, t.cik]));
}
