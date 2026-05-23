'use client';

import type { Proposal, Recommendation, Choice } from '@speakup/agent';

import { CopilotChat } from './CopilotChat';

type Props = {
  proposal: Proposal;
  recommendation: Recommendation | null;
  decision: Choice | null;
  onDecide: (choice: Choice) => void;
};

const choices: Choice[] = ['FOR', 'AGAINST', 'ABSTAIN'];

export function ProposalCard({ proposal, recommendation, decision, onDecide }: Props) {
  return (
    <article className="card space-y-4">
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-ink-500">
            Proposal {proposal.itemId} · {labelForCategory(proposal.category)}
          </p>
          <h3 className="text-lg font-semibold mt-1">{proposal.title}</h3>
          <p className="text-sm text-ink-700 mt-2">{proposal.oneLineBackground}</p>
        </div>
      </header>

      {proposal.keyDetails.length > 0 && (
        <ul className="text-sm text-ink-700 list-disc list-inside space-y-1 pl-1">
          {proposal.keyDetails.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      )}

      <div className="grid sm:grid-cols-3 gap-3 text-sm">
        <Stance label="Management" choice={proposal.managementRecommendation} />
        <Stance label="ISS" choice={proposal.iss?.stance ?? null} />
        <Stance label="Glass Lewis" choice={proposal.glassLewis?.stance ?? null} />
      </div>

      {recommendation && (
        <div className="bg-brand-soft border border-brand/20 rounded-card p-4 space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-brand-dark">
            SpeakUp recommends · {recommendation.recommended} · {recommendation.confidence} confidence
          </p>
          <ol className="text-sm text-ink-800 space-y-1 list-decimal list-inside">
            {recommendation.threeLineRationale.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ol>
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-2 border-t border-ink-100">
        {choices.map((c) => {
          const isPicked = decision === c;
          const base = 'rounded-full text-sm font-medium px-4 py-2 border transition';
          const cls = isPicked
            ? c === 'FOR'
              ? `${base} bg-brand text-white border-brand`
              : c === 'AGAINST'
                ? `${base} bg-red-600 text-white border-red-600`
                : `${base} bg-ink-800 text-white border-ink-800`
            : `${base} bg-white text-ink-700 border-ink-200 hover:bg-ink-100`;
          return (
            <button key={c} className={cls} onClick={() => onDecide(c)}>
              {c}
            </button>
          );
        })}
      </div>

      <CopilotChat proposal={proposal} recommendation={recommendation} />
    </article>
  );
}

function Stance({ label, choice }: { label: string; choice: Choice | null }) {
  return (
    <div className="bg-ink-100 rounded-lg px-3 py-2">
      <p className="text-xs text-ink-500">{label}</p>
      <p className={`mt-0.5 font-semibold ${tintFor(choice)}`}>
        {choice ?? '—'}
      </p>
    </div>
  );
}

function tintFor(c: Choice | null): string {
  if (c === 'FOR') return 'text-brand-dark';
  if (c === 'AGAINST') return 'text-red-700';
  if (c === 'ABSTAIN') return 'text-ink-700';
  return 'text-ink-400';
}

function labelForCategory(cat: Proposal['category']): string {
  switch (cat) {
    case 'compensation':
      return 'Executive comp';
    case 'director_election':
      return 'Director election';
    case 'auditor_ratification':
      return 'Auditor ratification';
    case 'say_on_pay':
      return 'Say-on-pay';
    case 'shareholder_proposal_esg':
      return 'Shareholder · ESG';
    case 'shareholder_proposal_governance':
      return 'Shareholder · governance';
    case 'shareholder_proposal_other':
      return 'Shareholder · other';
    case 'merger_acquisition':
      return 'M&A';
    case 'capital_structure':
      return 'Capital structure';
    default:
      return 'Other';
  }
}
