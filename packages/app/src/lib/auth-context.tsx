'use client';

import { createContext, useContext } from 'react';

export const DEMO_ADDRESS: `0x${string}` =
  '0x14d0b2566bdE08B31FE4AED26fB5D4d209741351';

export const isDemoMode = !process.env['NEXT_PUBLIC_PRIVY_APP_ID'];

export type AuthMode = 'demo' | 'watch' | 'wallet';

export type AuthState = {
  ready: boolean;
  authenticated: boolean;
  address: `0x${string}` | undefined;
  canSign: boolean;
  mode: AuthMode;
  isDemoMode: boolean;
  setDemoMode: () => void;
  setWatchAddress: (addr: string) => boolean;
  watchAddress: `0x${string}` | undefined;
  connectWallet: () => Promise<void>;
  connectWalletById: (connectorId: string) => Promise<void>;
  connectError: string | null;
  login: () => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthState | null>(null);

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside an Auth provider');
  }
  return ctx;
}
