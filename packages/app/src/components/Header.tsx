'use client';

import { useEffect, useState } from 'react';

import { useAuth, type AuthMode } from '../lib/auth';
import { useActiveChain } from '../lib/chain-context';
import type { SupportedChainId } from '../lib/chains';
import { resolveEns, looksLikeEns } from '../lib/ens';
import { ConnectWalletModal } from './ConnectWalletModal';
import { LogoMark } from './Logo';

export function Header() {
  const auth = useAuth();
  const chain = useActiveChain();
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [showChainMenu, setShowChainMenu] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);

  const activeChain = chain.chains.find((c) => c.id === chain.activeChainId);

  return (
    <header className="border-b border-ink-200/60 bg-white/80 backdrop-blur sticky top-0 z-30 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <a href="/" className="flex items-center gap-2.5 min-w-0 group">
          <LogoMark size={32} className="shrink-0 group-hover:scale-105 transition" />
          <span className="font-semibold text-lg tracking-tight">SpeakUp</span>
          <span className="hidden lg:inline text-xs text-ink-500 ml-1 truncate">
            Give every on-chain shareholder a voice
          </span>
        </a>

        <div className="flex items-center gap-2 relative">
          {/* Chain selector */}
          <button
            type="button"
            className="flex items-center gap-1.5 text-xs text-ink-700 hover:bg-ink-100 rounded-full px-3 py-1.5 transition border border-ink-200"
            onClick={() => {
              setShowChainMenu((s) => !s);
              setShowSwitcher(false);
            }}
            title="Switch chain"
          >
            <span className="w-1.5 h-1.5 bg-brand rounded-full" />
            <span className="font-medium">
              {activeChain?.name ?? `Chain ${chain.activeChainId}`}
            </span>
            <svg width="10" height="10" viewBox="0 0 12 12" className="opacity-60">
              <path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>

          {showChainMenu && (
            <ChainMenu
              activeId={chain.activeChainId}
              chains={chain.chains}
              onPick={(id) => {
                chain.setActiveChainId(id);
                setShowChainMenu(false);
              }}
              onClose={() => setShowChainMenu(false)}
            />
          )}

          {/* Identity */}
          {auth.address ? (
            <button
              type="button"
              className="flex items-center gap-2 text-sm text-ink-700 hover:bg-ink-100 rounded-full px-3 py-1.5 transition"
              onClick={() => {
                setShowSwitcher((s) => !s);
                setShowChainMenu(false);
              }}
              title="Switch identity"
            >
              <span className="font-mono">{shortAddr(auth.address)}</span>
              <ModePill mode={auth.mode} />
              <svg width="12" height="12" viewBox="0 0 12 12" className="opacity-60">
                <path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          ) : (
            <button
              className="btn-primary"
              onClick={() => setShowSwitcher(true)}
            >
              Get started
            </button>
          )}
        </div>
      </div>

      {showSwitcher && (
        <IdentitySwitcher
          onClose={() => setShowSwitcher(false)}
          onOpenConnectModal={() => {
            setShowSwitcher(false);
            setShowConnectModal(true);
          }}
        />
      )}

      {showConnectModal && (
        <ConnectWalletModal onClose={() => setShowConnectModal(false)} />
      )}
    </header>
  );
}

function ChainMenu({
  activeId,
  chains,
  onPick,
  onClose,
}: {
  activeId: SupportedChainId;
  chains: readonly { id: number; name: string }[];
  onPick: (id: SupportedChainId) => void;
  onClose: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-[120px] top-full mt-2 z-50 w-[240px] card shadow-xl p-2">
        <p className="text-[10px] uppercase tracking-wide text-ink-500 px-2 py-1">
          Active chain
        </p>
        {chains.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onPick(c.id as SupportedChainId)}
            className={`w-full text-left px-3 py-2 rounded text-sm transition ${
              c.id === activeId
                ? 'bg-brand/10 text-brand-dark font-medium'
                : 'hover:bg-ink-100 text-ink-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{c.name}</span>
              <span className="text-xs text-ink-400">id {c.id}</span>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

function ModePill({ mode }: { mode: AuthMode }) {
  const label =
    mode === 'demo' ? 'demo' : mode === 'watch' ? 'watching' : 'connected';
  const cls =
    mode === 'wallet' ? 'bg-brand text-white' : 'bg-ink-100 text-ink-700';
  return (
    <span
      className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full ${cls}`}
    >
      {label}
    </span>
  );
}

function IdentitySwitcher({
  onClose,
  onOpenConnectModal,
}: {
  onClose: () => void;
  onOpenConnectModal: () => void;
}) {
  const auth = useAuth();
  const [watchInput, setWatchInput] = useState<string>(auth.watchAddress ?? '');
  const [resolving, setResolving] = useState(false);
  const [resolveError, setResolveError] = useState<string | null>(null);

  async function commitWatch() {
    setResolveError(null);
    const raw = watchInput.trim();
    if (looksLikeEns(raw)) {
      setResolving(true);
      const addr = await resolveEns(raw);
      setResolving(false);
      if (!addr) {
        setResolveError(`No address record for ${raw}`);
        return;
      }
      const ok = auth.setWatchAddress(addr);
      if (!ok) {
        setResolveError(`Resolved address ${addr} failed validation.`);
        return;
      }
      onClose();
      return;
    }
    const ok = auth.setWatchAddress(raw);
    if (!ok) {
      setResolveError(
        'Not a valid 0x address or ENS name. Example: 0x14d0… or vitalik.eth',
      );
      return;
    }
    onClose();
  }

  // Esc to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40 animate-fade-in" onClick={onClose} />
      <div className="absolute right-4 sm:right-6 top-full mt-2 z-50 w-[360px] max-w-[calc(100vw-2rem)] card shadow-card-lg animate-scale-in origin-top-right">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Switch identity</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-ink-500 hover:text-ink-900 text-lg leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="space-y-3">
          <IdentityOption
            active={auth.mode === 'demo'}
            title="Demo wallet"
            subtitle="Pre-funded mock holdings. Read-only."
            badge="DEMO"
            onClick={() => {
              auth.setDemoMode();
              onClose();
            }}
          />

          <div
            className={`border rounded-lg p-3 transition ${
              auth.mode === 'watch'
                ? 'border-brand bg-brand/5'
                : 'border-ink-200'
            }`}
          >
            <div className="flex items-baseline justify-between mb-1">
              <p className="font-medium text-sm">Watch any address</p>
              <span className="text-[10px] uppercase tracking-wide text-ink-500">
                READ-ONLY
              </span>
            </div>
            <p className="text-xs text-ink-500 mb-2">
              Paste any 0x address or ENS name (e.g. <code>vitalik.eth</code>).
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="text"
                spellCheck={false}
                autoComplete="off"
                placeholder="0x… or vitalik.eth"
                value={watchInput}
                onChange={(e) => {
                  setWatchInput(e.target.value);
                  setResolveError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitWatch();
                }}
                disabled={resolving}
                className="flex-1 min-w-0 px-2 py-1.5 text-sm font-mono border border-ink-200 rounded focus:outline-none focus:border-brand disabled:opacity-60"
              />
              <button
                type="button"
                className="btn-secondary text-sm"
                onClick={commitWatch}
                disabled={resolving}
              >
                {resolving ? 'Resolving…' : 'Watch'}
              </button>
            </div>
            {resolveError && (
              <p className="text-xs text-red-600 mt-2">{resolveError}</p>
            )}
          </div>

          <IdentityOption
            active={auth.mode === 'wallet'}
            title={
              auth.mode === 'wallet' && auth.address
                ? `Connected: ${shortAddr(auth.address)}`
                : 'Connect a wallet'
            }
            subtitle={
              auth.mode === 'wallet'
                ? 'Connected to a signing wallet. Can cast real on-chain votes.'
                : 'MetaMask, Rabby, WalletConnect, email, Google. Required to cast real votes.'
            }
            badge="SIGNS"
            onClick={() => {
              if (auth.mode === 'wallet') {
                auth.logout();
                onClose();
              } else {
                onOpenConnectModal();
              }
            }}
            {...(auth.mode === 'wallet' ? { actionLabel: 'Disconnect' } : {})}
          />
        </div>
      </div>
    </>
  );
}

function IdentityOption({
  active,
  title,
  subtitle,
  badge,
  onClick,
  actionLabel,
}: {
  active: boolean;
  title: string;
  subtitle: string;
  badge?: string;
  onClick: () => void;
  actionLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left border rounded-lg p-3 transition ${
        active ? 'border-brand bg-brand/5' : 'border-ink-200 hover:bg-ink-100'
      }`}
    >
      <div className="flex items-baseline justify-between mb-1">
        <p className="font-medium text-sm">{title}</p>
        {badge && (
          <span className="text-[10px] uppercase tracking-wide text-ink-500">
            {actionLabel ?? badge}
          </span>
        )}
      </div>
      <p className="text-xs text-ink-500">{subtitle}</p>
    </button>
  );
}

function shortAddr(addr: string | undefined): string {
  if (!addr) return '';
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}
