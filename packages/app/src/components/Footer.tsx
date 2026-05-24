import Link from 'next/link';

import { LogoMark } from './Logo';

export function Footer() {
  return (
    <footer className="border-t border-ink-200/60 mt-16 bg-white/40 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 grid sm:grid-cols-[1.6fr_1fr_1fr_1fr] gap-8 sm:gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <LogoMark size={28} />
            <span className="font-semibold text-base">SpeakUp</span>
          </div>
          <p className="text-sm text-ink-500 leading-relaxed max-w-xs">
            Plain-English shareholder voting on Robinhood Chain. Every
            on-chain shareholder gets a voice.
          </p>
          <p className="text-xs text-ink-400">
            © {new Date().getFullYear()} NodeStake · MIT licence
          </p>
        </div>

        <FooterCol title="Product">
          <FooterLink href="/">Holdings</FooterLink>
          <FooterLink href="/about">About</FooterLink>
          <FooterLink
            href="https://explorer.testnet.chain.robinhood.com/address/0xb6D8E46BF9e48aDD4747595b2e437Eb327071c94"
            external
          >
            Registry contract
          </FooterLink>
          <FooterLink
            href="https://faucet.testnet.chain.robinhood.com"
            external
          >
            Get test tokens
          </FooterLink>
        </FooterCol>

        <FooterCol title="For judges">
          <FooterLink
            href="https://www.hackquest.io/hackathons/Arbitrum-Open-House-London-Online-Buildathon"
            external
          >
            Buildathon page
          </FooterLink>
          <FooterLink href="/about">How it works</FooterLink>
          <FooterLink href="https://github.com/iwbinb/speakup" external>
            Source on GitHub
          </FooterLink>
        </FooterCol>

        <FooterCol title="Built with">
          <span className="text-sm text-ink-700">Arbitrum Orbit</span>
          <span className="text-sm text-ink-700">Claude Sonnet 4.6</span>
          <span className="text-sm text-ink-700">Foundry + viem + wagmi</span>
          <span className="text-sm text-ink-700">Privy · WalletConnect</span>
        </FooterCol>
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

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] uppercase tracking-wider font-semibold text-ink-500">
        {title}
      </p>
      <ul className="space-y-1.5">
        {children
          ? Array.isArray(children)
            ? children.map((c, i) => <li key={i}>{c}</li>)
            : <li>{children}</li>
          : null}
      </ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const cls = 'text-sm text-ink-700 hover:text-brand-dark transition';
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href as never} className={cls}>
      {children}
    </Link>
  );
}
