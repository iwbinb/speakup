#!/usr/bin/env bun
/**
 * EDGAR + Reader Agent end-to-end probe.
 *
 * Usage:
 *   bun run scripts/edgar-probe.ts          # all three demo tickers
 *   bun run scripts/edgar-probe.ts TSLA     # just TSLA
 *
 * Requires:
 *   ANTHROPIC_API_KEY in env (only for the AI step; without it, you still
 *   get the fetch + parse + token-count probe).
 */
import { fetchDef14aFilings, fetchDef14aTextCached } from '../src/edgar';
import { readProposals } from '../src/agents/reader';

type Demo = { ticker: string; cik: string };
const DEMOS: Demo[] = [
  { ticker: 'TSLA', cik: '1318605' },
  { ticker: 'AMZN', cik: '1018724' },
  { ticker: 'NFLX', cik: '1065280' },
];

const CACHE_DIR = '.cache/edgar';

async function probe(d: Demo) {
  console.log(`\n=== ${d.ticker} (CIK ${d.cik}) ===`);
  const filings = await fetchDef14aFilings(d.cik, 1);
  const latest = filings[0];
  if (!latest) {
    console.log('  no DEF 14A filings found');
    return;
  }
  console.log(`  Latest DEF 14A: ${latest.filingDate}`);
  console.log(`  URL: ${latest.url}`);

  const t0 = Date.now();
  const { text, approxTokens, cached } = await fetchDef14aTextCached(
    latest.url,
    CACHE_DIR,
  );
  console.log(
    `  Body: ${(text.length / 1024).toFixed(1)} KB  ~${approxTokens.toLocaleString()} tokens  (${cached ? 'cached' : 'fresh'} in ${Date.now() - t0}ms)`,
  );

  if (!process.env['ANTHROPIC_API_KEY']) {
    console.log('  [skip AI step: ANTHROPIC_API_KEY not set]');
    return;
  }

  console.log('  Running Reader Agent...');
  const t1 = Date.now();
  const result = await readProposals({
    ticker: d.ticker,
    defUrl: latest.url,
    bodyText: text,
  });
  console.log(
    `  Extracted ${result.proposals.length} proposals in ${(Date.now() - t1) / 1000}s`,
  );
  console.log(`  Meeting: ${result.meetingTitle} (${result.meetingDate})`);
  for (const p of result.proposals) {
    console.log(
      `    [${p.itemId}] ${p.title}  | mgmt=${p.managementRecommendation}  cat=${p.category}`,
    );
  }
}

const arg = process.argv[2];
const targets = arg ? DEMOS.filter((d) => d.ticker === arg.toUpperCase()) : DEMOS;
if (targets.length === 0) {
  console.error(`Unknown ticker: ${arg}. Available: ${DEMOS.map((d) => d.ticker).join(', ')}`);
  process.exit(1);
}

for (const d of targets) {
  await probe(d);
}
