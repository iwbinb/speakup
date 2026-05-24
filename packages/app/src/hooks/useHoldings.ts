'use client';

import { useReadContracts } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import type { Address } from 'viem';

import { ERC20_ABI } from '../lib/erc20';
import { TICKERS } from '../lib/tickers';
import { useAuth } from '../lib/auth';
import { useActiveChain } from '../lib/chain-context';

export type Holding = {
  symbol: string;
  name: string;
  cik: string;
  address: Address;
  balance: bigint;
  balanceFormatted: string;
  storyHook: string;
};

const DEMO_BALANCES: Record<string, string> = {
  TSLA: '10',
  AMZN: '5',
  NFLX: '20',
};

export function useHoldings(account: Address | undefined) {
  const { mode } = useAuth();
  const { activeChainId } = useActiveChain();
  const isDemoIdentity = mode === 'demo';

  const calls = TICKERS.flatMap((t) => {
    const addr = t.addresses[activeChainId];
    if (!addr) return [];
    return [
      {
        address: addr,
        abi: ERC20_ABI,
        functionName: 'balanceOf' as const,
        args: [account ?? '0x0000000000000000000000000000000000000000'],
        chainId: activeChainId,
      },
    ];
  });

  const { data, isLoading, error, refetch } = useReadContracts({
    contracts: calls,
    query: { enabled: !!account && !isDemoIdentity },
  });

  const holdings: Holding[] = [];

  // Demo identity: synthetic balances so judges see proposals without
  // claiming faucet tokens. Watch + wallet modes always hit the RPC.
  // We show the same demo data on every supported chain so switching
  // networks does not blank the page; the displayed token address falls
  // back to the canonical Robinhood Chain entry when the active chain
  // has no deploy yet (e.g., Arbitrum Sepolia pre-broadcast).
  if (isDemoIdentity && account) {
    const ZERO = '0x0000000000000000000000000000000000000000' as Address;
    for (const t of TICKERS) {
      const addr =
        t.addresses[activeChainId] ??
        (Object.values(t.addresses)[0] as Address | undefined) ??
        ZERO;
      const amount = DEMO_BALANCES[t.symbol] ?? '0';
      const balance = parseUnits(amount, 18);
      holdings.push({
        symbol: t.symbol,
        name: t.name,
        cik: t.cik,
        address: addr,
        balance,
        balanceFormatted: amount,
        storyHook: t.storyHook,
      });
    }
    return { holdings, isLoading: false, error: null, refetch };
  }

  if (data && account) {
    let i = 0;
    for (const t of TICKERS) {
      const addr = t.addresses[activeChainId];
      if (!addr) continue;
      const res = data[i++];
      const balance = res?.status === 'success' ? (res.result as bigint) : 0n;
      holdings.push({
        symbol: t.symbol,
        name: t.name,
        cik: t.cik,
        address: addr,
        balance,
        balanceFormatted: formatUnits(balance, 18),
        storyHook: t.storyHook,
      });
    }
  }

  return { holdings, isLoading, error, refetch };
}
