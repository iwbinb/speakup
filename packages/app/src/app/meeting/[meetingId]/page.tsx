'use client';

import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { useWriteContract } from 'wagmi';
import { keccak256, toBytes } from 'viem';

import { Header } from '../../../components/Header';
import { ProposalCard } from '../../../components/ProposalCard';
import { useMeetings } from '../../../hooks/useMeetings';
import { useAuth } from '../../../lib/auth';
import { DEFAULT_CHAIN_ID } from '../../../lib/chains';
import { CHOICE_LABEL, REGISTRY_ABI, REGISTRY_ADDRESS, choiceToIdx } from '../../../lib/registry';
import type { Choice, ProposalList, RecommendationList } from '@speakup/agent';

type Decisions = Record<number, Choice>;

export default function MeetingPage({ params }: { params: Promise<{ meetingId: string }> }) {
  const { meetingId } = use(params);
  const meeting = useMeetings().find((m) => m.id === meetingId);
  const { ready, authenticated, canSign, mode } = useAuth();
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
    const registryAddr = REGISTRY_ADDRESS[DEFAULT_CHAIN_ID];
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
        chainId: DEFAULT_CHAIN_ID,
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
      <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        <div>
          <Link href="/" className="text-sm text-ink-500 hover:underline">
            ← Back to holdings
          </Link>
          <h1 className="text-3xl font-bold mt-2">{meeting.title}</h1>
          <p className="text-ink-500 mt-1">
            Meeting date: {meeting.date} ·{' '}
            <a
              href={meeting.defUrl}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Source DEF 14A
            </a>
          </p>
        </div>

        {loading && <div className="card text-ink-500">Reading the 100-page proxy for you…</div>}
        {error && <div className="card border-l-4 border-red-500 text-red-700">{error}</div>}

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
