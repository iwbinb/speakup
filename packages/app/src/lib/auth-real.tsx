'use client';

import { usePrivy } from '@privy-io/react-auth';
import type { ReactNode } from 'react';

import { AuthContext, type AuthState } from './auth-context';

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
    setWatchAddress: () => false,
    watchAddress: undefined,
    connectWallet: async () => login(),
    connectWalletById: async () => login(),
    connectError: null,
    login,
    logout,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
