'use client';

import { useState } from 'react';

import type { Proposal, Recommendation } from '@speakup/agent';

type Props = {
  proposal: Proposal;
  recommendation: Recommendation | null;
};

export function CopilotChat({ proposal, recommendation }: Props) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function ask() {
    if (!question || !recommendation) return;
    setPending(true);
    setAnswer('');
    setError(null);
    try {
      const resp = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          proposalTitle: proposal.title,
          oneLineBackground: proposal.oneLineBackground,
          keyDetails: proposal.keyDetails,
          managementRecommendation: proposal.managementRecommendation,
          speakUpRecommended: recommendation.recommended,
          threeLineRationale: recommendation.threeLineRationale,
        }),
      });
      if (!resp.ok || !resp.body) {
        throw new Error(`HTTP ${resp.status}`);
      }
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        setAnswer((prev) => prev + decoder.decode(value, { stream: true }));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="border-t border-ink-100 pt-4 mt-4 space-y-2">
      <p className="text-xs uppercase text-ink-500 tracking-wide">Ask SpeakUp Copilot</p>
      <div className="flex gap-2">
        <input
          className="flex-1 border border-ink-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-brand"
          placeholder="Why do you recommend AGAINST?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !pending) ask();
          }}
        />
        <button
          className="btn-secondary text-sm"
          disabled={pending || !question || !recommendation}
          onClick={ask}
        >
          {pending ? '…' : 'Ask'}
        </button>
      </div>
      {answer && <p className="text-sm text-ink-800 whitespace-pre-wrap">{answer}</p>}
      {error && <p className="text-sm text-red-700">{error}</p>}
    </div>
  );
}
