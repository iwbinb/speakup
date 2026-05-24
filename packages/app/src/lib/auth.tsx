'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { isAddress } from 'viem';

/**
 * Demo wallet address. Used in demo mode (when NEXT_PUBLIC_PRIVY_APP_ID is
 * unset) so that hackathon judges can explore the product without setting
 * up Privy. Matches the fresh testnet deployer generated during local
 * validation; fund it via Robinhood Chain faucet for realistic holdings.
 */
export const DEMO_ADDRESS: `0x${string}` =
  '0x14d0b2566bdE08B31FE4AED26fB5D4d209741351';

export const isDemoMode = !process.env['NEXT_PUBLIC_PRIVY_APP_ID'];

/**
 * Three ways to acquire an identity in the no-Privy preview build:
 *   demo   - hardcoded DEMO_ADDRESS (default; judge zero-setup)
 *   watch  - user-entered observer address, read-only
 *   wallet - connected EIP-1193 wallet (MetaMask, Rabby, etc.), can sign
 */
export type AuthMode = 'demo' | 'watch' | 'wallet';

export type AuthState = {
  ready: boolean;
  authenticated: boolean;
  address: `0x${string}` | undefined;
  canSign: boolean;
  mode: AuthMode;
  isDemoMode: boolean;
  // Mode controls
  setDemoMode: () => void;
  setWatchAddress: (addr: string) => void;
  watchAddress: `0x${string}` | undefined;
  connectWallet: () => Promise<void>;
  // Legacy Privy interface
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

const LS_MODE = 'speakup.authMode';
const LS_WATCH = 'speakup.watchAddress';

export function DemoAuthProvider({ children }: { children: ReactNode }) {
  const { address: walletAddress, isConnected, status } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { disconnect: wagmiDisconnect } = useDisconnect();

  const [mode, setModeRaw] = useState<AuthMode>('demo');
  const [watchAddress, setWatchRaw] = useState<`0x${string}` | undefined>(
    undefined,
  );

  // Hydrate from localStorage on client only (avoid SSR mismatch).
  useEffect(() => {
    const m = localStorage.getItem(LS_MODE);
    if (m === 'demo' || m === 'watch' || m === 'wallet') setModeRaw(m);
    const w = localStorage.getItem(LS_WATCH);
    if (w && isAddress(w)) setWatchRaw(w as `0x${string}`);
  }, []);

  const persistMode = useCallback((m: AuthMode) => {
    setModeRaw(m);
    try {
      localStorage.setItem(LS_MODE, m);
    } catch {
      // ignore quota / private-mode errors
    }
  }, []);

  const setDemoMode = useCallback(() => {
    persistMode('demo');
  }, [persistMode]);

  const setWatchAddress = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      if (!isAddress(trimmed)) {
        alert('Not a valid 0x address.');
        return;
      }
      const addr = trimmed as `0x${string}`;
      setWatchRaw(addr);
      try {
        localStorage.setItem(LS_WATCH, addr);
      } catch {
        // ignore
      }
      persistMode('watch');
    },
    [persistMode],
  );

  const connectWallet = useCallback(async () => {
    const injected = connectors.find((c) => c.id === 'injected') ?? connectors[0];
    if (!injected) {
      alert(
        'No EIP-1193 wallet detected. Install MetaMask, Rabby, or similar, then retry.',
      );
      return;
    }
    try {
      await connectAsync({ connector: injected });
      persistMode('wallet');
    } catch (e) {
      console.error('connect failed', e);
    }
  }, [connectAsync, connectors, persistMode]);

  const disconnect = useCallback(() => {
    if (isConnected) wagmiDisconnect();
    persistMode('demo');
  }, [isConnected, persistMode, wagmiDisconnect]);

  let address: `0x${string}` | undefined;
  let canSign = false;
  switch (mode) {
    case 'demo':
      address = DEMO_ADDRESS;
      break;
    case 'watch':
      address = watchAddress;
      break;
    case 'wallet':
      address = walletAddress;
      canSign = isConnected;
      break;
  }

  const value: AuthState = {
    ready: status !== 'connecting' && status !== 'reconnecting',
    authenticated: !!address,
    address,
    canSign,
    mode,
    isDemoMode: true,
    setDemoMode,
    setWatchAddress,
    watchAddress,
    connectWallet,
    login: connectWallet,
    logout: disconnect,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function RealAuthProvider({ children }: { children: ReactNode }) {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const address = user?.wallet?.address as `0x${string}` | undefined;
  const value: AuthState = {
    ready,
    authenticated,
    address,
    canSign: authenticated && !!address,
    mode: 'wallet',
    isDemoMode: false,
    setDemoMode: () => {},
    setWatchAddress: () => {},
    watchAddress: undefined,
    connectWallet: async () => login(),
    login,
    logout,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside an Auth provider');
  }
  return ctx;
}
