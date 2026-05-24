import type { SVGProps } from 'react';

/**
 * SpeakUp logo. A stylized microphone with a sound-wave halo, representing
 * "every on-chain shareholder gets a voice". Renders as plain SVG so it
 * scales cleanly and inherits the parent's text color.
 */
export function LogoMark({
  size = 32,
  className,
  ...rest
}: { size?: number; className?: string } & Omit<SVGProps<SVGSVGElement>, 'width' | 'height'>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className={className}
      {...rest}
    >
      <defs>
        <linearGradient id="speakup-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00e676" />
          <stop offset="100%" stopColor="#00a843" />
        </linearGradient>
      </defs>
      {/* Background pill */}
      <rect x="0" y="0" width="32" height="32" rx="9" fill="url(#speakup-grad)" />
      {/* Microphone body */}
      <rect x="13" y="7" width="6" height="11" rx="3" fill="white" />
      {/* Sound wave halo */}
      <path
        d="M9 14a7 7 0 0 0 14 0"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Mic stand */}
      <path
        d="M16 21v3"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 24h8"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
