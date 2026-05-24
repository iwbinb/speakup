'use client';

import type { Proposal, Recommendation, Choice } from '@speakup/agent/types';

import { CopilotChat } from './CopilotChat';

type Props = {
  proposal: Proposal;
  recommendation: Recommendation | null;
  decision: Choice | null;
  onDecide: (choice: Choice) => void;
};

const choices: Choice[] = ['FOR', 'AGAINST', 'ABSTAIN'];

export function ProposalCard({
  proposal,
  recommendation,
  decision,
  onDecide,
}: Props) {
  return (
    <article className="card card-hover space-y-5 animate-fade-up">
      <header className="flex items-start gap-4">
        <div className="shrink-0 w-10 h-10 rounded-2xl bg-ink-900 text-white flex items-center justify-center font-bold text-sm">
          {proposal.itemId}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] uppercase tracking-wider font-medium text-ink-500">
            {labelForCategory(proposal.category)}
          </p>
          <h3 className="text-lg sm:text-xl font-semibold mt-0.5 text-ink-900 leading-snug">
            {proposal.title}
          </h3>
          <p className="text-sm text-ink-700 mt-2 leading-relaxed">
            {proposal.oneLineBackground}
          </p>
        </div>
      </header>

      {proposal.keyDetails.length > 0 && (
        <ul className="text-sm text-ink-700 space-y-1.5 pl-1">
          {proposal.keyDetails.map((d, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-ink-300 mt-1.5 shrink-0">•</span>
              <span className="leading-relaxed">{d}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="grid sm:grid-cols-3 gap-2.5">
        <Stance label="Management" choice={proposal.managementRecommendation} />
        <Stance label="ISS" choice={proposal.iss?.stance ?? null} />
        <Stance label="Glass Lewis" choice={proposal.glassLewis?.stance ?? null} />
      </div>

      {recommendation && (
        <div className="bg-brand-soft border border-brand/20 rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center gap-2">
            <SpeakUpDot />
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-dark">
              SpeakUp recommends · {recommendation.recommended}
            </p>
            <ConfidenceBadge level={recommendation.confidence} />
          </div>
          <ol className="text-sm text-ink-800 space-y-1.5 pl-1">
            {recommendation.threeLineRationale.map((line, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-brand-dark font-semibold shrink-0 mt-0.5 text-xs tabular-nums">
                  {i + 1}.
                </span>
                <span className="leading-relaxed">{line}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-3 border-t border-ink-100">
        {choices.map((c) => {
          const isPicked = decision === c;
          const cls = isPicked
            ? c === 'FOR'
              ? 'choice-btn-for'
              : c === 'AGAINST'
                ? 'choice-btn-against'
                : 'choice-btn-abstain'
            : 'choice-btn-idle';
          return (
            <button
              key={c}
              type="button"
              className={cls}
              onClick={() => onDecide(c)}
              aria-pressed={isPicked}
            >
              {c}
            </button>
          );
        })}
        {decision && (
          <span className="ml-auto self-center text-xs text-ink-500">
            decided · click again to change
          </span>
        )}
      </div>

      <CopilotChat proposal={proposal} recommendation={recommendation} />
    </article>
  );
}

function Stance({ label, choice }: { label: string; choice: Choice | null }) {
  return (
    <div className="bg-ink-50 border border-ink-100 rounded-xl px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-wider text-ink-500 font-medium">
        {label}
      </p>
      <p className={`mt-0.5 font-semibold text-sm ${tintFor(choice)}`}>
        {choice ?? '—'}
      </p>
    </div>
  );
}

function ConfidenceBadge({ level }: { level: Recommendation['confidence'] }) {
  const map: Record<typeof level, { label: string; cls: string }> = {
    high: { label: 'high confidence', cls: 'bg-brand text-white' },
    medium: { label: 'medium confidence', cls: 'bg-amber-100 text-amber-800' },
    low: { label: 'low confidence', cls: 'bg-ink-200 text-ink-700' },
  };
  const m = map[level];
  return (
    <span
      className={`ml-auto text-[10px] uppercase tracking-wide font-medium px-2 py-0.5 rounded-full ${m.cls}`}
    >
      {m.label}
    </span>
  );
}

function SpeakUpDot() {
  return (
    <span className="w-2 h-2 rounded-full bg-brand inline-block animate-pulse-soft" />
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
    case 'corporate_structure':
      return 'Corporate structure';
    default:
      return 'Other';
  }
}
