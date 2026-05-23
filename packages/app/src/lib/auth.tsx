'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { usePrivy } from '@privy-io/react-auth';

/**
 * Demo wallet address. Used in demo mode (when NEXT_PUBLIC_PRIVY_APP_ID is
 * unset) so that hackathon judges can explore the product without setting
 * up Privy. Matches the fresh testnet deployer generated during local
 * validation; fund it via Robinhood Chain faucet for realistic holdings.
 */
export const DEMO_ADDRESS: `0x${string}` =
  '0x14d0b2566bdE08B31FE4AED26fB5D4d209741351';

export const isDemoMode = !process.env['NEXT_PUBLIC_PRIVY_APP_ID'];

export type AuthState = {
  ready: boolean;
  authenticated: boolean;
  address: `0x${string}` | undefined;
  login: () => void;
  logout: () => void;
  isDemoMode: boolean;
};

const AuthContext = createContext<AuthState | null>(null);

export function DemoAuthProvider({ children }: { children: ReactNode }) {
  const value: AuthState = {
    ready: true,
    authenticated: true,
    address: DEMO_ADDRESS,
    login: () => {
      alert(
        'Demo mode is active. Set NEXT_PUBLIC_PRIVY_APP_ID in .env.local to enable real wallet login.',
      );
    },
    logout: () => {},
    isDemoMode: true,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function RealAuthProvider({ children }: { children: ReactNode }) {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const value: AuthState = {
    ready,
    authenticated,
    address: user?.wallet?.address as `0x${string}` | undefined,
    login,
    logout,
    isDemoMode: false,
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
