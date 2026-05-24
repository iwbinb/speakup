'use client';

import Link from 'next/link';

import { useHoldings } from '../hooks/useHoldings';
import { useMeetings } from '../hooks/useMeetings';
import { useAuth } from '../lib/auth';

export function HoldingsList() {
  const { address, mode } = useAuth();
  const { holdings, isLoading, error } = useHoldings(address);
  const allMeetings = useMeetings();

  if (error) {
    return (
      <div className="card">
        <p className="font-medium text-red-700">Could not load holdings.</p>
        <p className="text-sm text-ink-500 mt-1">{String(error)}</p>
      </div>
    );
  }

  if (isLoading || !address) {
    return <div className="card text-ink-500">Detecting your holdings…</div>;
  }

  const withMeetings = holdings.map((h) => ({
    ...h,
    meetings: allMeetings.filter((m) => m.ticker === h.symbol),
  }));
  const anyBalance = withMeetings.some((h) => h.balance > 0n);
  const heading =
    mode === 'demo'
      ? 'Your demo holdings'
      : mode === 'watch'
        ? 'Watching holdings'
        : 'Your holdings';

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h2 className="text-2xl font-bold">{heading}</h2>
        <p className="text-sm text-ink-500">
          Robinhood Chain testnet · {withMeetings.length} ticker
          {withMeetings.length === 1 ? '' : 's'} tracked
        </p>
      </div>

      {!anyBalance && mode !== 'demo' && (
        <div className="card border-l-4 border-brand">
          <p className="font-medium">No stock tokens detected for this address.</p>
          <p className="text-sm text-ink-700 mt-1">
            {mode === 'watch'
              ? 'The address you are watching holds 0 of TSLA, AMZN, NFLX on Robinhood Chain testnet. Switch to a different address or have its owner claim from the faucet.'
              : 'Claim Stock Tokens at '}
            {mode === 'wallet' && (
              <a
                href="https://faucet.testnet.chain.robinhood.com"
                target="_blank"
                rel="noreferrer"
                className="underline text-brand-dark"
              >
                faucet.testnet.chain.robinhood.com
              </a>
            )}
            {mode === 'wallet' && ', then refresh.'}
          </p>
        </div>
      )}

      <ul className="space-y-3">
        {withMeetings.map((h) => (
          <li key={h.symbol} className="card flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-full bg-ink-100 flex items-center justify-center font-bold text-ink-700">
                {h.symbol[0]}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-lg">{h.name}</p>
                <p className="text-sm text-ink-500 truncate">{h.storyHook}</p>
                <p className="text-xs text-ink-400 mt-1">
                  {h.balanceFormatted} {h.symbol}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              {h.meetings.length === 0 ? (
                <span className="text-xs text-ink-400">No upcoming meeting</span>
              ) : (
                <Link
                  href={{ pathname: `/meeting/${h.meetings[0]!.id}` }}
                  className="btn-primary text-sm"
                >
                  {h.meetings[0]!.proposalCount} proposals to review
                </Link>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
