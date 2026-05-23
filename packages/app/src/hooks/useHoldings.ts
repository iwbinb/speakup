'use client';

import { useReadContracts } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import type { Address } from 'viem';

import { DEFAULT_CHAIN_ID } from '../lib/chains';
import { ERC20_ABI } from '../lib/erc20';
import { TICKERS } from '../lib/tickers';
import { isDemoMode } from '../lib/auth';

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
  const calls = TICKERS.flatMap((t) => {
    const addr = t.addresses[DEFAULT_CHAIN_ID];
    if (!addr) return [];
    return [
      {
        address: addr,
        abi: ERC20_ABI,
        functionName: 'balanceOf' as const,
        args: [account ?? '0x0000000000000000000000000000000000000000'],
        chainId: DEFAULT_CHAIN_ID,
      },
    ];
  });

  const { data, isLoading, error, refetch } = useReadContracts({
    contracts: calls,
    query: { enabled: !!account && !isDemoMode },
  });

  const holdings: Holding[] = [];
  if (isDemoMode && account) {
    for (const t of TICKERS) {
      const addr = t.addresses[DEFAULT_CHAIN_ID];
      if (!addr) continue;
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
      const addr = t.addresses[DEFAULT_CHAIN_ID];
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
