/**
 * Brand marks for the demo tickers. Inline SVG so no asset bundling is
 * needed and they scale crisply at any size. Falls back to a tinted
 * letter for tickers without a custom mark.
 *
 * These are stylized representations used for identification only,
 * consistent with nominative fair use; SpeakUp is not affiliated with
 * Tesla, Amazon, Netflix, etc.
 */

type Props = {
  symbol: string;
  size?: number;
  className?: string;
};

export function TickerLogo({ symbol, size = 48, className = '' }: Props) {
  const Mark = MARKS[symbol] ?? null;
  const fallback = FALLBACK_TINT[symbol] ?? {
    bg: 'bg-ink-100',
    fg: 'text-ink-700',
  };
  if (Mark) {
    return (
      <div
        className={`shrink-0 rounded-2xl bg-white border border-ink-200/60 shadow-sm flex items-center justify-center overflow-hidden ${className}`}
        style={{ width: size, height: size }}
        aria-label={`${symbol} logo`}
      >
        <Mark size={Math.floor(size * 0.6)} />
      </div>
    );
  }
  return (
    <div
      className={`shrink-0 rounded-2xl ${fallback.bg} ${fallback.fg} flex items-center justify-center font-bold ${className}`}
      style={{ width: size, height: size, fontSize: Math.floor(size * 0.42) }}
    >
      {symbol[0]}
    </div>
  );
}

const FALLBACK_TINT: Record<string, { bg: string; fg: string }> = {
  PLTR: { bg: 'bg-ink-900', fg: 'text-white' },
  AMD: { bg: 'bg-emerald-50', fg: 'text-emerald-700' },
};

const MARKS: Record<string, (props: { size: number }) => React.ReactElement> = {
  TSLA: TeslaMark,
  AMZN: AmazonMark,
  NFLX: NetflixMark,
};

/* ─────────────────── Tesla ─────────────────── */
function TeslaMark({ size }: { size: number }) {
  // Stylized Tesla "T" mark: top swoosh + horizontal cap + vertical bar.
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Tiny swoosh accent above the cap */}
      <path
        d="M 11 9 Q 24 6 37 9"
        stroke="#E31937"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Horizontal cap */}
      <rect x="6" y="12" width="36" height="6" rx="1" fill="#E31937" />
      {/* Vertical bar */}
      <rect x="20" y="18" width="8" height="24" rx="1" fill="#E31937" />
    </svg>
  );
}

/* ─────────────────── Amazon ─────────────────── */
function AmazonMark({ size }: { size: number }) {
  // Simplified "smile" arrow used as the Amazon icon mark.
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
    >
      {/* Lowercase "a" body */}
      <text
        x="30"
        y="38"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="700"
        fontSize="34"
        fill="#232f3e"
      >
        a
      </text>
      {/* Smile/arrow underneath */}
      <path
        d="M8 44 Q 30 56, 52 44"
        stroke="#ff9900"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M48 41 L52 44 L48 47"
        stroke="#ff9900"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/* ─────────────────── Netflix ─────────────────── */
function NetflixMark({ size }: { size: number }) {
  // Stylized Netflix "N" mark inside a red rounded square.
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="6" fill="#E50914" />
      {/* Left bar */}
      <rect x="11" y="9" width="6" height="30" fill="white" />
      {/* Right bar */}
      <rect x="31" y="9" width="6" height="30" fill="white" />
      {/* Diagonal */}
      <path
        d="M17 9 L31 39 L37 39 L37 38 L23 9 Z"
        fill="white"
      />
    </svg>
  );
}
