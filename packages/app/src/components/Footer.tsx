import Link from 'next/link';

import { LogoMark } from './Logo';

export function Footer() {
  return (
    <footer className="border-t border-ink-200/60 mt-16 bg-white/40 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 grid sm:grid-cols-[1.6fr_1fr] gap-8 sm:gap-12">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <LogoMark size={28} />
            <span className="font-semibold text-base">SpeakUp</span>
          </div>
          <p className="text-sm text-ink-500 leading-relaxed max-w-md">
            Plain-English shareholder voting on Robinhood Chain. Every
            on-chain shareholder gets a voice.
          </p>
          <p className="text-xs text-ink-400">
            © {new Date().getFullYear()} SpeakUp · MIT licence
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-ink-500">
            Product
          </p>
          <ul className="space-y-1.5">
            <li>
              <Link href="/" className="text-sm text-ink-700 hover:text-brand-dark transition">
                Holdings
              </Link>
            </li>
            <li>
              <Link href={'/about' as never} className="text-sm text-ink-700 hover:text-brand-dark transition">
                About
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-200/60 px-4 sm:px-6 py-3 max-w-5xl mx-auto text-[11px] text-ink-400 flex items-center justify-between flex-wrap gap-2">
        <p>
          Not investment advice. Stylized brand marks used for identification
          only; SpeakUp is not affiliated with Tesla, Amazon, Netflix, or
          Robinhood.
        </p>
        <p>
          Press <kbd className="px-1.5 py-0.5 bg-ink-100 rounded text-ink-700 font-mono">⌘K</kbd>{' '}
          anywhere
        </p>
      </div>
    </footer>
  );
}
