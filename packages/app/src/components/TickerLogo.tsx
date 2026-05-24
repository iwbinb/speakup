'use client';

import { useState } from 'react';

/**
 * Renders a company's X (Twitter) profile picture as the ticker avatar.
 * Falls back through clearbit logo API, then to a tinted letter, in
 * case the upstream services are slow or the company has no entry.
 *
 * Marks are used for identification only (nominative fair use); SpeakUp
 * is not affiliated with any of these companies.
 */

type Props = {
  symbol: string;
  size?: number;
  className?: string;
};

type Meta = {
  xHandle: string;
  domain: string;
};

const COMPANY_META: Record<string, Meta> = {
  TSLA: { xHandle: 'Tesla', domain: 'tesla.com' },
  AMZN: { xHandle: 'amazon', domain: 'amazon.com' },
  NFLX: { xHandle: 'netflix', domain: 'netflix.com' },
  PLTR: { xHandle: 'PalantirTech', domain: 'palantir.com' },
  AMD: { xHandle: 'AMD', domain: 'amd.com' },
};

const FALLBACK_TINT: Record<string, { bg: string; fg: string }> = {
  TSLA: { bg: 'bg-red-50', fg: 'text-red-700' },
  AMZN: { bg: 'bg-amber-50', fg: 'text-amber-700' },
  NFLX: { bg: 'bg-red-50', fg: 'text-red-700' },
  PLTR: { bg: 'bg-ink-900', fg: 'text-white' },
  AMD: { bg: 'bg-emerald-50', fg: 'text-emerald-700' },
};

export function TickerLogo({ symbol, size = 48, className = '' }: Props) {
  const meta = COMPANY_META[symbol];
  // Three-step fallback: 0 = X avatar via unavatar.io, 1 = clearbit logo,
  // 2 = tinted letter placeholder. Tracked in state so each <img> error
  // bumps us to the next source.
  const [stage, setStage] = useState<0 | 1 | 2>(meta ? 0 : 2);

  if (stage === 2 || !meta) {
    const tint = FALLBACK_TINT[symbol] ?? {
      bg: 'bg-ink-100',
      fg: 'text-ink-700',
    };
    return (
      <div
        className={`shrink-0 rounded-2xl ${tint.bg} ${tint.fg} flex items-center justify-center font-bold ${className}`}
        style={{
          width: size,
          height: size,
          fontSize: Math.floor(size * 0.42),
        }}
        aria-label={`${symbol} logo`}
      >
        {symbol[0]}
      </div>
    );
  }

  const src =
    stage === 0
      ? `https://unavatar.io/x/${meta.xHandle}`
      : `https://logo.clearbit.com/${meta.domain}`;

  return (
    <div
      className={`shrink-0 rounded-2xl bg-white border border-ink-200/60 shadow-sm overflow-hidden ${className}`}
      style={{ width: size, height: size }}
      aria-label={`${symbol} logo`}
    >
      {/* Plain <img> to avoid next/image domain whitelist; logos are small + cached upstream. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`${symbol} logo`}
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        onError={() => setStage((s) => (s < 2 ? ((s + 1) as 1 | 2) : 2))}
        style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
}
