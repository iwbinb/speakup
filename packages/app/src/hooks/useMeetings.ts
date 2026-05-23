'use client';

import { useMemo } from 'react';

import { TICKERS } from '../lib/tickers';

export type Meeting = {
  id: string;            // canonical label, e.g. "TSLA-2025-ANNUAL"
  ticker: string;        // "TSLA"
  title: string;         // human label
  date: string;          // YYYY-MM-DD
  defUrl: string;        // SEC EDGAR URL
  proposalCount: number; // hint for the holdings list
};

/**
 * Static meeting catalog. In production this is read from Registry events
 * + indexer GraphQL. For D10-D14 we hardcode the three demo meetings so the
 * UI can render before the contracts ship.
 */
export function useMeetings(tickerFilter?: string): Meeting[] {
  return useMemo(() => {
    const all: Meeting[] = [
      {
        id: 'TSLA-2025-ANNUAL',
        ticker: 'TSLA',
        title: 'Tesla 2025 Annual Meeting',
        date: '2025-11-06',
        defUrl:
          'https://www.sec.gov/Archives/edgar/data/1318605/000110465925090866/tm252289-12_def14a.htm',
        proposalCount: 9,
      },
      {
        id: 'AMZN-2026-ANNUAL',
        ticker: 'AMZN',
        title: 'Amazon 2026 Annual Meeting',
        date: '2026-05-21',
        defUrl:
          'https://www.sec.gov/Archives/edgar/data/1018724/000110465926041026/tm261382-1_def14a.htm',
        proposalCount: 12,
      },
      {
        id: 'NFLX-2026-ANNUAL',
        ticker: 'NFLX',
        title: 'Netflix 2026 Annual Meeting',
        date: '2026-06-04',
        defUrl:
          'https://www.sec.gov/Archives/edgar/data/1065280/000119312526159286/d20613ddef14a.htm',
        proposalCount: 7,
      },
    ];
    if (!tickerFilter) return all;
    return all.filter((m) => m.ticker === tickerFilter.toUpperCase());
  }, [tickerFilter]);
}

export function findMeeting(id: string): Meeting | undefined {
  // Hack until we have a global meeting store; mirrors useMeetings().
  return useMeetings().find((m) => m.id === id);
}

export function tickerCikMap(): Record<string, string> {
  return Object.fromEntries(TICKERS.map((t) => [t.symbol, t.cik]));
}
