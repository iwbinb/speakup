'use client';

import { usePrivy } from '@privy-io/react-auth';

import { Header } from '../components/Header';
import { HoldingsList } from '../components/HoldingsList';

export default function HomePage() {
  const { ready, authenticated } = usePrivy();

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-6 py-10">
        {!ready ? (
          <div className="card text-center text-ink-500">Loading…</div>
        ) : !authenticated ? (
          <LandingHero />
        ) : (
          <HoldingsList />
        )}
      </main>
    </>
  );
}

function LandingHero() {
  return (
    <div className="grid md:grid-cols-2 gap-10 items-center py-10">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-ink-900 leading-tight">
          You own the stock.
          <br />
          You have a vote.
          <br />
          <span className="text-brand">Use it.</span>
        </h1>
        <p className="mt-6 text-lg text-ink-700">
          Every year, Tesla, Amazon, and Netflix shareholders vote on executive
          pay, board seats, and ESG. The materials are 100 pages of legalese.
          70% of retail shareholders skip it.
        </p>
        <p className="mt-4 text-lg text-ink-700">
          SpeakUp reads it for you, summarizes every proposal in three lines,
          and lets you vote with one click. Your vote is recorded on-chain.
        </p>
        <p className="mt-6 text-sm text-ink-500">
          Sign in with your email or Google to get started. No seed phrase, no
          crypto knowledge needed.
        </p>
      </div>
      <div className="card">
        <p className="text-sm font-medium text-ink-500 uppercase tracking-wide">
          Demo Tickers
        </p>
        <ul className="mt-4 divide-y divide-ink-100">
          <li className="py-3 flex items-center justify-between">
            <div>
              <p className="font-semibold">TSLA</p>
              <p className="text-sm text-ink-500">
                Musk $56B comp package re-vote
              </p>
            </div>
            <span className="pill-for">FOR / AGAINST</span>
          </li>
          <li className="py-3 flex items-center justify-between">
            <div>
              <p className="font-semibold">AMZN</p>
              <p className="text-sm text-ink-500">
                Antitrust, AWS spin-off proposals
              </p>
            </div>
            <span className="pill-for">FOR / AGAINST</span>
          </li>
          <li className="py-3 flex items-center justify-between">
            <div>
              <p className="font-semibold">NFLX</p>
              <p className="text-sm text-ink-500">
                Content ESG, executive comp
              </p>
            </div>
            <span className="pill-for">FOR / AGAINST</span>
          </li>
        </ul>
        <p className="mt-4 text-xs text-ink-500">
          Live on Robinhood Chain testnet · Chain ID 46630
        </p>
      </div>
    </div>
  );
}
