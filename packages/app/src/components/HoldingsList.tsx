'use client';

import Link from 'next/link';

import { useHoldings } from '../hooks/useHoldings';
import { useMeetings } from '../hooks/useMeetings';
import { useAuth } from '../lib/auth';
import { useActiveChain } from '../lib/chain-context';

const TICKER_TINT: Record<string, { bg: string; fg: string }> = {
  TSLA: { bg: 'bg-red-50', fg: 'text-red-700' },
  AMZN: { bg: 'bg-amber-50', fg: 'text-amber-700' },
  NFLX: { bg: 'bg-red-50', fg: 'text-red-700' },
  PLTR: { bg: 'bg-violet-50', fg: 'text-violet-700' },
  AMD: { bg: 'bg-emerald-50', fg: 'text-emerald-700' },
};

export function HoldingsList() {
  const { address, mode } = useAuth();
  const { holdings, isLoading, error } = useHoldings(address);
  const allMeetings = useMeetings();
  const chain = useActiveChain();
  const activeChainName =
    chain.chains.find((c) => c.id === chain.activeChainId)?.name ??
    `Chain ${chain.activeChainId}`;

  if (error) {
    return (
      <div className="card animate-fade-up">
        <p className="font-medium text-red-700">Could not load holdings.</p>
        <p className="text-sm text-ink-500 mt-1">{String(error)}</p>
      </div>
    );
  }

  if (isLoading || !address) {
    return <HoldingsSkeleton />;
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

  const totalProposals = withMeetings.reduce(
    (sum, h) => sum + (h.meetings[0]?.proposalCount ?? 0),
    0,
  );

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {heading}
          </h2>
          {totalProposals > 0 && (
            <p className="text-sm text-ink-500 mt-1.5">
              {totalProposals} proposals waiting for your vote across{' '}
              {withMeetings.length} {withMeetings.length === 1 ? 'company' : 'companies'}
            </p>
          )}
        </div>
        <span className="text-xs text-ink-500 inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse-soft" />
          {activeChainName}
        </span>
      </div>

      {!anyBalance && mode !== 'demo' && (
        <div className="card border-l-4 border-brand">
          <p className="font-medium">No stock tokens detected for this address.</p>
          <p className="text-sm text-ink-700 mt-1">
            {mode === 'watch'
              ? `The address you are watching holds 0 of TSLA, AMZN, NFLX on ${activeChainName}. Switch to a different address or have its owner claim from the faucet.`
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
        {withMeetings.map((h, idx) => {
          const tint = TICKER_TINT[h.symbol] ?? {
            bg: 'bg-ink-100',
            fg: 'text-ink-700',
          };
          const hasMeeting = h.meetings.length > 0;
          return (
            <li
              key={h.symbol}
              className="card card-hover flex items-center justify-between gap-4 animate-fade-up"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div
                  className={`w-12 h-12 rounded-2xl ${tint.bg} ${tint.fg} flex items-center justify-center font-bold text-lg shrink-0`}
                >
                  {h.symbol[0]}
                </div>
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2">
                    <p className="font-semibold text-lg">{h.name}</p>
                    <span className="text-xs text-ink-400">{h.symbol}</span>
                  </div>
                  <p className="text-sm text-ink-500 truncate">{h.storyHook}</p>
                  <p className="text-xs text-ink-400 mt-1 font-mono">
                    {h.balanceFormatted} {h.symbol}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                {hasMeeting ? (
                  <Link
                    href={{ pathname: `/meeting/${h.meetings[0]!.id}` }}
                    className="btn-primary text-sm group"
                  >
                    {h.meetings[0]!.proposalCount} proposals
                    <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-0.5 transition" />
                  </Link>
                ) : (
                  <span className="text-xs text-ink-400">No upcoming meeting</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function HoldingsSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="skeleton h-8 w-56" />
          <div className="skeleton h-4 w-72" />
        </div>
        <div className="skeleton h-4 w-32" />
      </div>
      <ul className="space-y-3">
        {[0, 1, 2].map((i) => (
          <li key={i} className="card flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="skeleton w-12 h-12 rounded-2xl" />
              <div className="space-y-2 flex-1">
                <div className="skeleton h-5 w-40" />
                <div className="skeleton h-3 w-56" />
              </div>
            </div>
            <div className="skeleton h-10 w-36 rounded-full" />
          </li>
        ))}
      </ul>
    </div>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}
