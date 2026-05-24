/**
 * Lightweight ENS resolver used by Watch mode so users can paste
 * `vitalik.eth` instead of a 42-character hex address.
 *
 * Uses a public mainnet RPC (cloudflare-eth.com, no API key) on demand.
 * Cached in memory for the session.
 */
import { createPublicClient, http, isAddress } from 'viem';
import { normalize } from 'viem/ens';
import { mainnet } from 'viem/chains';

const cache = new Map<string, `0x${string}` | null>();

const mainnetClient = createPublicClient({
  chain: mainnet,
  transport: http('https://cloudflare-eth.com'),
});

export function looksLikeEns(input: string): boolean {
  const trimmed = input.trim().toLowerCase();
  return (
    trimmed.endsWith('.eth') ||
    trimmed.endsWith('.xyz') ||
    trimmed.endsWith('.cb.id')
  );
}

/**
 * Returns the resolved address for `name` or `null` if no record exists.
 * Returns the input untouched (as `0x…`) when it is already a hex address.
 */
export async function resolveEns(
  raw: string,
): Promise<`0x${string}` | null> {
  const input = raw.trim();
  if (isAddress(input)) return input as `0x${string}`;
  if (!looksLikeEns(input)) return null;

  const key = input.toLowerCase();
  if (cache.has(key)) return cache.get(key) ?? null;

  try {
    const addr = await mainnetClient.getEnsAddress({
      name: normalize(key),
    });
    cache.set(key, addr ?? null);
    return addr ?? null;
  } catch (e) {
    console.warn('ENS resolve failed for', key, e);
    cache.set(key, null);
    return null;
  }
}
