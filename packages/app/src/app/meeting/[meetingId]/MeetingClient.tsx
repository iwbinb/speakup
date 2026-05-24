'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useWriteContract } from 'wagmi';
import { keccak256, toBytes } from 'viem';

import { Header } from '../../../components/Header';
import { ProposalCard } from '../../../components/ProposalCard';
import { Spinner } from '../../../components/Spinner';
import { useMeetings } from '../../../hooks/useMeetings';
import { useAuth } from '../../../lib/auth';
import { useActiveChain } from '../../../lib/chain-context';
import { CHOICE_LABEL, REGISTRY_ABI, REGISTRY_ADDRESS, choiceToIdx } from '../../../lib/registry';
import type { Choice, ProposalList, RecommendationList } from '@speakup/agent/types';

type Decisions = Record<number, Choice>;

export default function MeetingClient({ meetingId }: { meetingId: string }) {
  // Render a minimal shell on the server, then hydrate to full UI on client.
  // Avoids edge-SSR errors from wallet SDKs that expect browser globals.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-20 flex items-center justify-center text-ink-500">
        <Spinner size={20} />
        <span className="ml-3">Loading meeting…</span>
      </main>
    );
  }
  return <MeetingBody meetingId={meetingId} />;
}

function MeetingBody({ meetingId }: { meetingId: string }) {
  const meeting = useMeetings().find((m) => m.id === meetingId);
  const { ready, authenticated, canSign, mode } = useAuth();
  const { activeChainId } = useActiveChain();
  const [proposals, setProposals] = useState<ProposalList | null>(null);
  const [recs, setRecs] = useState<RecommendationList | null>(null);
  const [decisions, setDecisions] = useState<Decisions>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { writeContractAsync, isPending: isSigning } = useWriteContract();
  const [txHash, setTxHash] = useState<string | null>(null);

  useEffect(() => {
    if (!meeting) return;
    setLoading(true);
    setError(null);
    fetch(`/api/proposals?meetingId=${encodeURIComponent(meeting.id)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: { proposals: ProposalList; recommendations: RecommendationList }) => {
        setProposals(data.proposals);
        setRecs(data.recommendations);
        const seeded: Decisions = {};
        for (const r of data.recommendations.recommendations) {
          seeded[r.itemId] = r.recommended;
        }
        setDecisions(seeded);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [meeting]);

  if (!ready) {
    return (
      <>
        <Header />
        <main className="max-w-3xl mx-auto px-6 py-10 text-ink-500">Loading…</main>
      </>
    );
  }
  if (!authenticated) {
    return (
      <>
        <Header />
        <main className="max-w-3xl mx-auto px-6 py-10">
          <div className="card">Sign in to view this meeting.</div>
        </main>
      </>
    );
  }
  if (!meeting) {
    return (
      <>
        <Header />
        <main className="max-w-3xl mx-auto px-6 py-10">
          <div className="card">Meeting not found.</div>
        </main>
      </>
    );
  }

  async function submit() {
    if (!proposals) return;
    if (!canSign) {
      setError(
        mode === 'demo'
          ? 'Demo identity is read-only. Switch to "Connect browser wallet" in the header to cast real votes.'
          : mode === 'watch'
            ? 'You are watching this address read-only. Connect a wallet you control to cast votes.'
            : 'Wallet not ready. Reconnect and try again.',
      );
      return;
    }
    const registryAddr = REGISTRY_ADDRESS[activeChainId];
    if (!registryAddr || registryAddr === '0x0000000000000000000000000000000000000000') {
      setError('Registry not deployed on this chain yet.');
      return;
    }
    if (!meeting) {
      setError('Meeting unavailable.');
      return;
    }
    const meetingIdBytes = keccak256(toBytes(meeting.id));
    const itemIds: number[] = [];
    const choices: number[] = [];
    const reasoningHashes: `0x${string}`[] = [];
    for (const p of proposals.proposals) {
      const c = decisions[p.itemId];
      if (!c) continue;
      itemIds.push(p.itemId);
      choices.push(choiceToIdx(c));
      reasoningHashes.push(keccak256(toBytes(`${meeting.id}:${p.itemId}:${c}`)));
    }
    try {
      const hash = await writeContractAsync({
        address: registryAddr,
        abi: REGISTRY_ABI,
        functionName: 'castVotes',
        args: [meetingIdBytes, itemIds, choices, reasoningHashes],
        chainId: activeChainId,
      });
      setTxHash(hash);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  const decidedCount = Object.keys(decisions).length;
  const totalCount = proposals?.proposals.length ?? 0;
  const recsByItem = new Map((recs?.recommendations ?? []).map((r) => [r.itemId, r]));

  return (
    <>
      <Header />
      {proposals && totalCount > 0 && (
        <div className="sticky top-[57px] z-20 bg-white/85 backdrop-blur border-b border-ink-200/60">
          <div className="max-w-3xl mx-auto px-6 py-2 flex items-center gap-3">
            <p className="text-xs text-ink-500 shrink-0 tabular-nums">
              {decidedCount} / {totalCount}
            </p>
            <div className="flex-1 h-1.5 bg-ink-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand transition-all duration-300 ease-out"
                style={{
                  width: `${totalCount === 0 ? 0 : (decidedCount / totalCount) * 100}%`,
                }}
              />
            </div>
            <p className="text-xs text-ink-500 shrink-0">decided</p>
          </div>
        </div>
      )}
      <main className="max-w-3xl mx-auto px-6 py-8 sm:py-10 space-y-6">
        <div className="animate-fade-up">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-ink-500 hover:text-ink-900 transition gap-1"
          >
            <span aria-hidden>←</span> Back to holdings
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold mt-2 tracking-tight">
            {meeting.title}
          </h1>
          <p className="text-ink-500 mt-1.5 text-sm">
            Meeting date: <span className="text-ink-700">{meeting.date}</span>{' '}
            ·{' '}
            <a
              href={meeting.defUrl}
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-brand-dark transition"
            >
              Source DEF 14A
            </a>
          </p>
        </div>

        {loading && (
          <div className="space-y-3 animate-fade-in">
            <div className="card space-y-3">
              <div className="skeleton h-5 w-3/4" />
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-5/6" />
              <div className="skeleton h-4 w-4/6" />
            </div>
            <p className="text-center text-sm text-ink-500">
              Reading the 100-page proxy for you…
            </p>
          </div>
        )}
        {error && (
          <div className="card border-l-4 border-red-500 text-red-700 animate-fade-in">
            {error}
          </div>
        )}

        {proposals?.proposals.map((p) => (
          <ProposalCard
            key={p.itemId}
            proposal={p}
            recommendation={recsByItem.get(p.itemId) ?? null}
            decision={decisions[p.itemId] ?? null}
            onDecide={(c) => setDecisions((d) => ({ ...d, [p.itemId]: c }))}
          />
        ))}

        {proposals && (
          <>
            <div className="card sticky bottom-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold">
                  {decidedCount} of {totalCount} proposals decided
                </p>
                {txHash ? (
                  <p className="text-sm text-brand-dark mt-1">
                    Vote signed. Tx: <code className="font-mono text-xs">{txHash.slice(0, 18)}…</code>
                  </p>
                ) : (
                  <p className="text-sm text-ink-500 mt-1">
                    One signature records your vote on Robinhood Chain.
                  </p>
                )}
              </div>
              <button
                className="btn-primary"
                disabled={decidedCount === 0 || isSigning}
                onClick={submit}
              >
                {isSigning ? 'Signing…' : `Cast ${decidedCount} vote${decidedCount === 1 ? '' : 's'}`}
              </button>
            </div>

            <SourcesDisclaimer />
          </>
        )}

        {recs && proposals && decidedCount > 0 && (
          <p className="text-xs text-ink-400 text-center">
            Choices encoded as {Object.entries(decisions).map(([k, v]) => `${k}:${CHOICE_LABEL[choiceToIdx(v)]}`).join(', ')}
          </p>
        )}
      </main>
    </>
  );
}

function SourcesDisclaimer() {
  return (
    <div className="card mt-4 border-l-4 border-ink-200 bg-ink-50/50">
      <p className="text-xs font-semibold text-ink-700 mb-1">
        How we sourced this content
      </p>
      <ul className="text-xs text-ink-500 space-y-1 leading-relaxed">
        <li>
          <strong>Proposal text</strong> is the verbatim summary of the SEC
          DEF 14A filing linked above, produced by the Reader Agent (Anthropic
          Sonnet 4.6). In demo mode the AI output is replaced with a
          pre-canned approximation so judges can explore without API keys.
        </li>
        <li>
          <strong>ISS and Glass Lewis stances</strong> shown here are{' '}
          <em>approximations</em> drawn from each firm&apos;s public season
          previews and prior-year reports. Authoritative recommendations sit
          behind paid research subscriptions; production SpeakUp will license
          a real feed and label every stance with its publication date.
        </li>
        <li>
          <strong>SpeakUp recommendation</strong> is generated by the Advisor
          Agent from a stated user preference profile plus the inputs above.
          It is not investment advice.
        </li>
      </ul>
    </div>
  );
}
