'use client';

import { useState } from 'react';

import { useAuth, type AuthMode } from '../lib/auth';

export function Header() {
  const auth = useAuth();
  const [showSwitcher, setShowSwitcher] = useState(false);

  return (
    <header className="border-b border-ink-200 bg-white relative">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white font-bold shrink-0">
            S
          </div>
          <span className="font-semibold text-lg">SpeakUp</span>
          <span className="hidden md:inline text-xs text-ink-500 ml-2 truncate">
            Give every on-chain shareholder a voice
          </span>
        </div>

        <div className="flex items-center gap-2">
          {auth.address ? (
            <>
              <button
                type="button"
                className="flex items-center gap-2 text-sm text-ink-700 hover:bg-ink-100 rounded-full px-3 py-1.5 transition"
                onClick={() => setShowSwitcher((s) => !s)}
                title="Switch identity"
              >
                <span className="font-mono">{shortAddr(auth.address)}</span>
                <ModePill mode={auth.mode} />
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  className="opacity-60"
                >
                  <path
                    d="M3 4.5l3 3 3-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </button>
            </>
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
        />
      )}
    </header>
  );
}

function ModePill({ mode }: { mode: AuthMode }) {
  const label =
    mode === 'demo'
      ? 'demo'
      : mode === 'watch'
        ? 'watching'
        : 'connected';
  const cls =
    mode === 'wallet'
      ? 'bg-brand text-white'
      : 'bg-ink-100 text-ink-700';
  return (
    <span
      className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full ${cls}`}
    >
      {label}
    </span>
  );
}

function IdentitySwitcher({ onClose }: { onClose: () => void }) {
  const auth = useAuth();
  const [watchInput, setWatchInput] = useState<string>(
    auth.watchAddress ?? '',
  );

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />
      <div className="absolute right-6 top-full mt-2 z-50 w-[360px] card shadow-xl">
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
              Paste any 0x address to view its holdings and meeting agenda.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="text"
                spellCheck={false}
                autoComplete="off"
                placeholder="0x…"
                value={watchInput}
                onChange={(e) => setWatchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    auth.setWatchAddress(watchInput);
                    onClose();
                  }
                }}
                className="flex-1 min-w-0 px-2 py-1.5 text-sm font-mono border border-ink-200 rounded focus:outline-none focus:border-brand"
              />
              <button
                type="button"
                className="btn-secondary text-sm"
                onClick={() => {
                  auth.setWatchAddress(watchInput);
                  onClose();
                }}
              >
                Watch
              </button>
            </div>
          </div>

          <IdentityOption
            active={auth.mode === 'wallet'}
            title={
              auth.mode === 'wallet' && auth.address
                ? `Connected: ${shortAddr(auth.address)}`
                : 'Connect browser wallet'
            }
            subtitle={
              auth.mode === 'wallet'
                ? 'MetaMask / Rabby / injected. Can sign on-chain votes.'
                : 'MetaMask, Rabby, or any EIP-1193 wallet. Required to cast real votes.'
            }
            badge="SIGNS"
            onClick={async () => {
              if (auth.mode === 'wallet') {
                auth.logout();
              } else {
                await auth.connectWallet();
              }
              onClose();
            }}
            actionLabel={auth.mode === 'wallet' ? 'Disconnect' : undefined}
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
