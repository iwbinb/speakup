'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import {
  DEFAULT_CHAIN_ID,
  supportedChains,
  type SupportedChainId,
} from './chains';

const LS_CHAIN = 'speakup.activeChain';

export type ChainContextValue = {
  activeChainId: SupportedChainId;
  setActiveChainId: (id: SupportedChainId) => void;
  chains: typeof supportedChains;
};

const ChainContext = createContext<ChainContextValue | null>(null);

export function ChainProvider({ children }: { children: ReactNode }) {
  const [activeChainId, setActiveChainIdRaw] =
    useState<SupportedChainId>(DEFAULT_CHAIN_ID);

  // Hydrate from localStorage client-side only.
  useEffect(() => {
    const stored = localStorage.getItem(LS_CHAIN);
    if (!stored) return;
    const n = Number(stored) as SupportedChainId;
    if (supportedChains.some((c) => c.id === n)) {
      setActiveChainIdRaw(n);
    }
  }, []);

  const setActiveChainId = useCallback((id: SupportedChainId) => {
    setActiveChainIdRaw(id);
    try {
      localStorage.setItem(LS_CHAIN, String(id));
    } catch {
      // ignore
    }
  }, []);

  return (
    <ChainContext.Provider
      value={{ activeChainId, setActiveChainId, chains: supportedChains }}
    >
      {children}
    </ChainContext.Provider>
  );
}

export function useActiveChain(): ChainContextValue {
  const ctx = useContext(ChainContext);
  if (!ctx) {
    throw new Error('useActiveChain must be used inside <ChainProvider>');
  }
  return ctx;
}
