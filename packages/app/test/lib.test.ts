/**
 * Pure-function unit tests for app lib helpers. No DOM, no RPC, fast.
 *
 *   cd packages/app && bun test test/lib.test.ts
 */
import { describe, expect, test } from 'bun:test';

import { looksLikeEns } from '../src/lib/ens';
import { TICKERS } from '../src/lib/tickers';
import { robinhoodTestnet, supportedChains, DEFAULT_CHAIN_ID } from '../src/lib/chains';

describe('lib/ens · looksLikeEns', () => {
  test('accepts common ENS-compatible TLDs', () => {
    expect(looksLikeEns('vitalik.eth')).toBe(true);
    expect(looksLikeEns('alice.xyz')).toBe(true);
    expect(looksLikeEns('bob.cb.id')).toBe(true);
  });

  test('rejects 0x addresses', () => {
    expect(looksLikeEns('0x14d0b2566bdE08B31FE4AED26fB5D4d209741351')).toBe(false);
  });

  test('rejects bare names with no TLD', () => {
    expect(looksLikeEns('vitalik')).toBe(false);
    expect(looksLikeEns('')).toBe(false);
  });

  test('case-insensitive on the TLD', () => {
    expect(looksLikeEns('Vitalik.ETH')).toBe(true);
    expect(looksLikeEns('  alice.Xyz  ')).toBe(true);
  });

  test('rejects unknown TLDs', () => {
    expect(looksLikeEns('alice.com')).toBe(false);
    expect(looksLikeEns('alice.io')).toBe(false);
  });
});

describe('lib/tickers · TICKERS catalog integrity', () => {
  test('contains exactly TSLA, AMZN, NFLX', () => {
    const symbols = TICKERS.map((t) => t.symbol).sort();
    expect(symbols).toEqual(['AMZN', 'NFLX', 'TSLA']);
  });

  test('every ticker has a Robinhood Chain address', () => {
    for (const t of TICKERS) {
      const addr = t.addresses[robinhoodTestnet.id];
      expect(addr).toBeDefined();
      expect(addr!.length).toBe(42);
      expect(addr!.startsWith('0x')).toBe(true);
    }
  });

  test('CIK is 10 zero-padded digits', () => {
    for (const t of TICKERS) {
      expect(/^\d{10}$/.test(t.cik)).toBe(true);
    }
  });

  test('storyHook is non-empty and reasonable length', () => {
    for (const t of TICKERS) {
      expect(t.storyHook.length).toBeGreaterThan(5);
      expect(t.storyHook.length).toBeLessThan(80);
    }
  });

  test('symbols are unique', () => {
    const set = new Set(TICKERS.map((t) => t.symbol));
    expect(set.size).toBe(TICKERS.length);
  });

  test('token addresses are unique', () => {
    const addrs = TICKERS.map((t) => t.addresses[robinhoodTestnet.id]).filter(
      Boolean,
    );
    const set = new Set(addrs);
    expect(set.size).toBe(addrs.length);
  });
});

describe('lib/chains · supportedChains', () => {
  test('contains Robinhood Chain Testnet + Arbitrum Sepolia', () => {
    const ids = supportedChains.map((c) => c.id).sort();
    expect(ids).toContain(46630);
    expect(ids).toContain(421614);
  });

  test('DEFAULT_CHAIN_ID is one of the supported chains', () => {
    const ids = supportedChains.map((c) => c.id);
    expect(ids).toContain(DEFAULT_CHAIN_ID);
  });

  test('every chain has a non-empty name', () => {
    for (const c of supportedChains) {
      expect(c.name).toBeDefined();
      expect(c.name.length).toBeGreaterThan(0);
    }
  });
});
