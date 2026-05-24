'use client';

import { useState } from 'react';
import { useConnect } from 'wagmi';

import { useAuth } from '../lib/auth';

const HAS_PRIVY = !!process.env['NEXT_PUBLIC_PRIVY_APP_ID'];
const HAS_WC = !!process.env['NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID'];

/**
 * Wallet picker modeled after Reown AppKit / Web3Modal. Lists all
 * EIP-6963-discovered injected wallets (wagmi v2 auto-discovers when
 * the injected() connector is present), plus disabled placeholders for
 * WalletConnect QR + email + Google so users see the full vision.
 */
export function ConnectWalletModal({ onClose }: { onClose: () => void }) {
  const { connectors } = useConnect();
  const auth = useAuth();
  const [filter, setFilter] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  // Hide the bare "injected" entry when EIP-6963 produced richer entries.
  const detailed = connectors.filter(
    (c) => c.id !== 'injected' || connectors.length === 1,
  );
  const visible = detailed.filter((c) =>
    c.name.toLowerCase().includes(filter.toLowerCase()),
  );

  async function pick(id: string) {
    setBusyId(id);
    await auth.connectWalletById(id);
    setBusyId(null);
    if (!auth.connectError) onClose();
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-50"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal
        aria-label="Connect wallet"
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[400px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        <ModalHeader onClose={onClose} />

        <div className="px-3 pt-3">
          <SearchBar value={filter} onChange={setFilter} />
        </div>

        <div className="px-3 py-3 space-y-1.5 max-h-[340px] overflow-y-auto">
          <WalletRow
            icon={<WalletConnectIcon />}
            name="WalletConnect"
            badge={HAS_WC ? 'QR CODE' : 'NOT SET'}
            disabled={!HAS_WC}
            disabledHint="Set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID to enable QR"
            onClick={() => pick('walletConnect')}
          />

          {visible.length === 0 && (
            <p className="text-center text-xs text-ink-400 py-4">
              {filter
                ? `No installed wallet matches "${filter}"`
                : 'No wallet extension detected in this browser. Install MetaMask, Rabby, or similar.'}
            </p>
          )}

          {visible.map((c) => (
            <WalletRow
              key={c.uid ?? c.id}
              icon={
                c.icon ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.icon} alt="" className="w-7 h-7 rounded-md" />
                ) : (
                  <FallbackIcon />
                )
              }
              name={c.name}
              badge="INSTALLED"
              loading={busyId === c.id}
              onClick={() => pick(c.id)}
            />
          ))}

          <WalletRow
            icon={<SearchCircleIcon />}
            name="More wallets"
            badge="550+"
            disabled
            disabledHint="WalletConnect project id required to browse other wallets"
            onClick={() => {}}
          />
        </div>

        <Divider label="or" />

        <div className="px-4 pb-4 space-y-2">
          <EmailField disabled={!HAS_PRIVY} />
          <GoogleButton disabled={!HAS_PRIVY} />
          {!HAS_PRIVY && (
            <p className="text-[11px] text-ink-400 text-center pt-1 leading-snug">
              Email + Google sign-in unlock when{' '}
              <code className="text-ink-500">NEXT_PUBLIC_PRIVY_APP_ID</code> is
              set in <code>.env.local</code>.
            </p>
          )}
        </div>

        {auth.connectError && (
          <div className="px-4 pb-4">
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {auth.connectError}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

function ModalHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="grid grid-cols-[40px_1fr_40px] items-center px-3 py-3.5 border-b border-ink-100">
      <button
        type="button"
        title="What is a wallet?"
        className="w-9 h-9 rounded-full hover:bg-ink-100 flex items-center justify-center text-ink-400 hover:text-ink-700"
      >
        <HelpIcon />
      </button>
      <h2 className="text-center font-semibold text-ink-900">Connect Wallet</h2>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="w-9 h-9 rounded-full hover:bg-ink-100 flex items-center justify-center text-ink-400 hover:text-ink-700 justify-self-end"
      >
        <CloseIcon />
      </button>
    </div>
  );
}

function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex items-center gap-2 px-3 py-2 bg-ink-50 rounded-xl border border-ink-100 focus-within:border-brand">
      <SearchIcon className="w-4 h-4 text-ink-400 shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search installed wallets"
        className="flex-1 min-w-0 bg-transparent text-sm placeholder-ink-400 focus:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="text-ink-400 hover:text-ink-700 text-xs"
          aria-label="Clear"
        >
          ×
        </button>
      )}
    </label>
  );
}

function WalletRow({
  icon,
  name,
  badge,
  disabled,
  disabledHint,
  loading,
  onClick,
}: {
  icon: React.ReactNode;
  name: string;
  badge: string;
  disabled?: boolean;
  disabledHint?: string;
  loading?: boolean;
  onClick: () => void;
}) {
  const badgeCls =
    badge === 'INSTALLED'
      ? 'bg-brand/10 text-brand-dark'
      : badge === 'QR CODE'
        ? 'bg-violet-100 text-violet-700'
        : badge === '550+'
          ? 'bg-ink-100 text-ink-600'
          : 'bg-ink-100 text-ink-400';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      title={disabled ? disabledHint : `Connect with ${name}`}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl border transition text-left ${
        disabled
          ? 'border-ink-100 opacity-50 cursor-not-allowed'
          : 'border-ink-100 hover:border-brand hover:bg-brand/5 active:bg-brand/10'
      }`}
    >
      <span className="w-9 h-9 flex items-center justify-center shrink-0">
        {icon}
      </span>
      <span className="flex-1 text-sm font-medium text-ink-900 truncate">
        {loading ? `Connecting to ${name}…` : name}
      </span>
      <span
        className={`text-[10px] uppercase tracking-wide font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${badgeCls}`}
      >
        {badge}
      </span>
      <ChevronRight className="w-4 h-4 text-ink-400" />
    </button>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 px-5 my-1">
      <hr className="flex-1 border-ink-100" />
      <span className="text-[10px] text-ink-400 uppercase tracking-wide font-medium">
        {label}
      </span>
      <hr className="flex-1 border-ink-100" />
    </div>
  );
}

function EmailField({ disabled }: { disabled: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2.5 bg-ink-50 rounded-xl border border-ink-100 ${
        disabled ? 'opacity-60' : 'focus-within:border-brand'
      }`}
    >
      <EmailIcon className="w-4 h-4 text-ink-400 shrink-0" />
      <input
        type="email"
        placeholder="Email"
        disabled={disabled}
        className="flex-1 min-w-0 bg-transparent text-sm placeholder-ink-400 focus:outline-none disabled:cursor-not-allowed"
      />
    </div>
  );
}

function GoogleButton({ disabled }: { disabled: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      title={disabled ? 'Requires Privy app id' : 'Sign in with Google'}
      className={`w-full flex items-center justify-center gap-2 py-2.5 bg-ink-50 hover:bg-ink-100 disabled:hover:bg-ink-50 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl border border-ink-100 text-sm font-medium text-ink-700`}
    >
      <GoogleIcon className="w-4 h-4" />
      Continue with Google
    </button>
  );
}

/* ──────────────────────── Inline SVG icons ──────────────────────── */

function HelpIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2 2-2.5 3.5" />
      <circle cx="12" cy="17" r="0.5" fill="currentColor" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function SearchCircleIcon() {
  return (
    <div className="w-7 h-7 rounded-full bg-ink-100 flex items-center justify-center text-ink-500">
      <SearchIcon className="w-4 h-4" />
    </div>
  );
}

function EmailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  // Plain G mark, multi-colour
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.7c-.2 1.3-1 2.4-2.1 3.1v2.6h3.4c2-1.8 3-4.5 3-7.6z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.8 0 5.2-.9 6.9-2.5l-3.4-2.6c-1 .7-2.2 1-3.5 1-2.7 0-5-1.8-5.8-4.3H2.7v2.7C4.4 19.7 8 22 12 22z"
      />
      <path
        fill="#FBBC05"
        d="M6.2 13.6c-.2-.7-.4-1.4-.4-2.1 0-.7.1-1.4.4-2.1V6.7H2.7C2 8.2 1.5 9.9 1.5 11.5s.4 3.3 1.2 4.8l3.5-2.7z"
      />
      <path
        fill="#EA4335"
        d="M12 5.7c1.5 0 2.9.5 4 1.5l3-3C17.1 2.4 14.7 1.5 12 1.5 8 1.5 4.4 3.8 2.7 7.2l3.5 2.7C7 7.4 9.3 5.7 12 5.7z"
      />
    </svg>
  );
}

function WalletConnectIcon() {
  return (
    <div className="w-7 h-7 rounded-md bg-[#3b99fc] flex items-center justify-center">
      <svg viewBox="0 0 32 32" className="w-5 h-5">
        <path
          fill="white"
          d="M9.6 11.7c3.5-3.4 9.3-3.4 12.8 0l.4.4c.2.2.2.4 0 .6l-1.4 1.4c-.1.1-.2.1-.3 0l-.6-.5c-2.4-2.4-6.4-2.4-8.8 0l-.6.6c-.1.1-.2.1-.3 0L9.4 12.8c-.2-.2-.2-.4 0-.6l.2-.5zm15.8 2.9l1.3 1.3c.2.2.2.4 0 .6L20.9 23c-.2.2-.4.2-.6 0l-4.1-4.1c-.1-.1-.2-.1-.2 0L11.9 23c-.2.2-.4.2-.6 0l-5.8-6.5c-.2-.2-.2-.4 0-.6L6.8 14.6c.2-.2.4-.2.6 0l4.1 4.1c.1.1.2.1.2 0l4.1-4.1c.2-.2.4-.2.6 0l4.1 4.1c.1.1.2.1.2 0l4.1-4.1c.2-.2.4-.2.6 0z"
        />
      </svg>
    </div>
  );
}

function FallbackIcon() {
  return (
    <div className="w-7 h-7 rounded-md bg-ink-100 flex items-center justify-center text-ink-500 font-semibold text-xs">
      W
    </div>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}
