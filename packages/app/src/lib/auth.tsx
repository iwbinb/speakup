'use client';

import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { isAddress } from 'viem';

import {
  AuthContext,
  DEMO_ADDRESS,
  isDemoMode,
  type AuthMode,
  type AuthState,
} from './auth-context';
import { useActiveChain } from './chain-context';

// Re-export so existing imports keep working.
export { DEMO_ADDRESS, isDemoMode, useAuth } from './auth-context';
export type { AuthMode, AuthState } from './auth-context';

const LS_MODE = 'speakup.authMode';
const LS_WATCH = 'speakup.watchAddress';

export function DemoAuthProvider({ children }: { children: ReactNode }) {
  const { address: walletAddress, isConnected, chainId, status } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();
  const { activeChainId } = useActiveChain();

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
    (raw: string): boolean => {
      // Returns true on success. Callers (Header IdentitySwitcher) are
      // responsible for surfacing the failure via toast / inline error
      // so we never use a blocking alert() here.
      const trimmed = raw.trim();
      if (!isAddress(trimmed)) {
        return false;
      }
      const addr = trimmed as `0x${string}`;
      setWatchRaw(addr);
      try {
        localStorage.setItem(LS_WATCH, addr);
      } catch {
        // ignore
      }
      persistMode('watch');
      return true;
    },
    [persistMode],
  );

  const [connectError, setConnectError] = useState<string | null>(null);

  const connectWalletById = useCallback(
    async (connectorId: string) => {
      const target =
        connectors.find((c) => c.id === connectorId) ??
        connectors.find((c) => c.id === 'injected') ??
        connectors[0];
      if (!target) {
        setConnectError(
          'No EIP-1193 wallet detected. Install MetaMask, Rabby, or similar, then retry.',
        );
        return;
      }
      setConnectError(null);
      try {
        await connectAsync({ connector: target, chainId: activeChainId });
        persistMode('wallet');
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error('connect failed', e);
        setConnectError(msg);
      }
    },
    [connectAsync, connectors, persistMode, activeChainId],
  );

  const connectWallet = useCallback(
    () => connectWalletById('injected'),
    [connectWalletById],
  );

  /**
   * Prompt the wallet to switch to the active app chain when the user is in
   * wallet mode but connected to the wrong network (common when judges
   * arrive with MetaMask defaulted to Ethereum mainnet).
   */
  const ensureChain = useCallback(async () => {
    if (mode !== 'wallet' || !isConnected) return;
    if (chainId === activeChainId) return;
    try {
      await switchChainAsync({ chainId: activeChainId });
    } catch (e) {
      console.warn('chain switch rejected', e);
    }
  }, [chainId, isConnected, mode, switchChainAsync]);

  useEffect(() => {
    ensureChain();
  }, [ensureChain]);

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
    connectWalletById,
    connectError,
    login: connectWallet,
    logout: disconnect,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// RealAuthProvider (Privy-backed) is in ./auth-real.tsx and only loaded
// when NEXT_PUBLIC_PRIVY_APP_ID is set, so the Edge bundle doesn't pull in
// the Privy SDK in demo deployments.
