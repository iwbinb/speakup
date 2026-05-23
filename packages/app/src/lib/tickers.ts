import type { Address } from 'viem';
import { keccak256, toBytes } from 'viem';

import { robinhoodTestnet } from './chains';

export type StockTicker = {
  symbol: string;
  name: string;
  cik: string;
  /** Tagline shown in proposal cards to anchor the story for users. */
  storyHook: string;
  /** Per-chain ERC-20 address. Filled for Robinhood Chain testnet; other chains
   *  are populated after Sepolia mock deploy. */
  addresses: Partial<Record<number, Address>>;
};

export const TICKERS: StockTicker[] = [
  {
    symbol: 'TSLA',
    name: 'Tesla',
    cik: '0001318605',
    storyHook: 'Musk $56B comp package re-vote',
    addresses: {
      [robinhoodTestnet.id]: '0xC9f9c86933092BbbfFF3CCb4b105A4A94bf3Bd4E',
    },
  },
  {
    symbol: 'AMZN',
    name: 'Amazon',
    cik: '0001018724',
    storyHook: 'Antitrust, AWS spin-off proposals',
    addresses: {
      [robinhoodTestnet.id]: '0x5884aD2f920c162CFBbACc88C9C51AA75eC09E02',
    },
  },
  {
    symbol: 'NFLX',
    name: 'Netflix',
    cik: '0001065280',
    storyHook: 'Content ESG, executive comp',
    addresses: {
      [robinhoodTestnet.id]: '0x3b8262A63d25f0477c4DDE23F83cfe22Cb768C93',
    },
  },
];

export function tickerBytes32(symbol: string): `0x${string}` {
  return keccak256(toBytes(symbol));
}

export function meetingIdBytes32(label: string): `0x${string}` {
  return keccak256(toBytes(label));
}
