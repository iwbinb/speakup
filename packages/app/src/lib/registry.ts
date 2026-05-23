import type { Address } from 'viem';

import { robinhoodTestnet } from './chains';
import { arbitrumSepolia } from 'viem/chains';

/**
 * Filled after `forge script Deploy.s.sol` succeeds on each chain.
 * Update via `bun run scripts/sync-addresses.ts` (D17 helper).
 */
export const REGISTRY_ADDRESS: Partial<Record<number, Address>> = {
  [robinhoodTestnet.id]: (process.env['NEXT_PUBLIC_REGISTRY_RH'] as Address | undefined) ?? '0x0000000000000000000000000000000000000000',
  [arbitrumSepolia.id]: (process.env['NEXT_PUBLIC_REGISTRY_ARB_SEPOLIA'] as Address | undefined) ?? '0x0000000000000000000000000000000000000000',
};

export const REGISTRY_ABI = [
  {
    type: 'constructor',
    inputs: [{ name: 'relayer_', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'castVote',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'meetingId', type: 'bytes32' },
      { name: 'itemId', type: 'uint16' },
      { name: 'choice', type: 'uint8' },
      { name: 'reasoningHash', type: 'bytes32' },
    ],
    outputs: [{ name: 'uid', type: 'bytes32' }],
  },
  {
    type: 'function',
    name: 'castVotes',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'meetingId', type: 'bytes32' },
      { name: 'itemIds', type: 'uint16[]' },
      { name: 'choices', type: 'uint8[]' },
      { name: 'reasoningHashes', type: 'bytes32[]' },
    ],
    outputs: [{ name: 'uids', type: 'bytes32[]' }],
  },
  {
    type: 'function',
    name: 'hasVoted',
    stateMutability: 'view',
    inputs: [
      { name: 'voter', type: 'address' },
      { name: 'meetingId', type: 'bytes32' },
      { name: 'itemId', type: 'uint16' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    type: 'function',
    name: 'getVoterUids',
    stateMutability: 'view',
    inputs: [{ name: 'voter', type: 'address' }],
    outputs: [{ type: 'bytes32[]' }],
  },
  {
    type: 'function',
    name: 'attestations',
    stateMutability: 'view',
    inputs: [{ type: 'bytes32' }],
    outputs: [
      { name: 'voter', type: 'address' },
      { name: 'meetingId', type: 'bytes32' },
      { name: 'itemId', type: 'uint16' },
      { name: 'choice', type: 'uint8' },
      { name: 'weight', type: 'uint256' },
      { name: 'reasoningHash', type: 'bytes32' },
      { name: 'timestamp', type: 'uint64' },
      { name: 'status', type: 'uint8' },
      { name: 'ackRef', type: 'string' },
    ],
  },
  {
    type: 'event',
    name: 'VoteCast',
    inputs: [
      { name: 'uid', type: 'bytes32', indexed: true },
      { name: 'voter', type: 'address', indexed: true },
      { name: 'meetingId', type: 'bytes32', indexed: true },
      { name: 'itemId', type: 'uint16', indexed: false },
      { name: 'choice', type: 'uint8', indexed: false },
      { name: 'weight', type: 'uint256', indexed: false },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'VoteAcknowledged',
    inputs: [
      { name: 'uid', type: 'bytes32', indexed: true },
      { name: 'status', type: 'uint8', indexed: false },
      { name: 'ackRef', type: 'string', indexed: false },
    ],
    anonymous: false,
  },
] as const;

export const CHOICE_LABEL = ['ABSTAIN', 'FOR', 'AGAINST'] as const;
export const ACK_STATUS_LABEL = ['PENDING', 'ACKNOWLEDGED', 'REJECTED'] as const;

export type ChoiceIdx = 0 | 1 | 2;
export function choiceToIdx(c: 'FOR' | 'AGAINST' | 'ABSTAIN'): ChoiceIdx {
  return c === 'FOR' ? 1 : c === 'AGAINST' ? 2 : 0;
}
