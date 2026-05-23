'use client';

import { useAuth } from '../lib/auth';

export function Header() {
  const { ready, authenticated, address, login, logout, isDemoMode } = useAuth();

  return (
    <header className="border-b border-ink-200 bg-white">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white font-bold">
            S
          </div>
          <span className="font-semibold text-lg">SpeakUp</span>
          <span className="hidden sm:inline text-xs text-ink-500 ml-2">
            Give every on-chain shareholder a voice
          </span>
        </div>
        <div className="flex items-center gap-3">
          {ready && authenticated ? (
            <>
              <span className="text-sm text-ink-700 hidden sm:inline">
                {shortAddr(address)}
              </span>
              {isDemoMode ? (
                <span className="pill bg-ink-100 text-ink-700">demo</span>
              ) : (
                <button className="btn-secondary" onClick={logout}>
                  Sign out
                </button>
              )}
            </>
          ) : (
            <button className="btn-primary" onClick={login} disabled={!ready}>
              {ready ? 'Sign in' : 'Loading...'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

function shortAddr(addr: string | undefined): string {
  if (!addr) return '';
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}
