#!/usr/bin/env bun
/**
 * Mock Broadridge relayer.
 *
 * Listens for VoteCast events on SpeakUpRegistry and, after a short delay,
 * calls acknowledge() with a fake Broadridge reference number. Demonstrates
 * the production path: in real deployment, this process bridges on-chain
 * vote attestations to the existing Broadridge proxy infrastructure.
 *
 * Usage:
 *   RELAYER_PRIVATE_KEY=0x... \
 *   REGISTRY=0x... \
 *   ACK_DELAY_SECONDS=10 \
 *   bun run scripts/mock-relayer.ts
 */
import {
  createPublicClient,
  createWalletClient,
  http,
  parseAbi,
  type Address,
  type Hex,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

const RPC_URL =
  process.env['ROBINHOOD_RPC_URL'] ??
  'https://rpc.testnet.chain.robinhood.com';
const CHAIN_ID = Number(process.env['ROBINHOOD_CHAIN_ID'] ?? 46630);
const REGISTRY = process.env['REGISTRY'] as Address | undefined;
const RELAYER_PK = process.env['RELAYER_PRIVATE_KEY'] as Hex | undefined;
const ACK_DELAY_MS = Number(process.env['ACK_DELAY_SECONDS'] ?? 10) * 1000;

if (!REGISTRY) {
  console.error('REGISTRY env required');
  process.exit(1);
}
if (!RELAYER_PK) {
  console.error('RELAYER_PRIVATE_KEY env required');
  process.exit(1);
}

const ABI = parseAbi([
  'event VoteCast(bytes32 indexed uid, address indexed voter, bytes32 indexed meetingId, uint16 itemId, uint8 choice, uint256 weight)',
  'function acknowledge(bytes32 uid, uint8 status, string ackRef) external',
]);

const chain = {
  id: CHAIN_ID,
  name: 'Robinhood Chain Testnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: { default: { http: [RPC_URL] } },
} as const;

const account = privateKeyToAccount(RELAYER_PK);
const publicClient = createPublicClient({ chain, transport: http(RPC_URL) });
const walletClient = createWalletClient({ chain, account, transport: http(RPC_URL) });

console.log(`SpeakUp mock relayer started`);
console.log(`  Registry: ${REGISTRY}`);
console.log(`  Relayer:  ${account.address}`);
console.log(`  Chain:    ${CHAIN_ID}`);
console.log(`  Delay:    ${ACK_DELAY_MS / 1000}s before each ack`);

const pending = new Set<string>();

publicClient.watchContractEvent({
  address: REGISTRY,
  abi: ABI,
  eventName: 'VoteCast',
  onLogs: (logs) => {
    for (const log of logs) {
      const uid = log.args.uid;
      if (!uid || pending.has(uid)) continue;
      pending.add(uid);
      const voter = log.args.voter ?? '0x0';
      const itemId = log.args.itemId ?? 0;
      console.log(
        `→ VoteCast uid=${uid.slice(0, 10)}… voter=${voter.slice(0, 10)}… item=${itemId}`,
      );
      setTimeout(() => {
        void acknowledge(uid, voter as Address, itemId as number);
      }, ACK_DELAY_MS);
    }
  },
});

async function acknowledge(uid: Hex, voter: Address, itemId: number) {
  const ref = `BROADRIDGE-MOCK-${Date.now()}-${itemId}`;
  try {
    const hash = await walletClient.writeContract({
      address: REGISTRY!,
      abi: ABI,
      functionName: 'acknowledge',
      args: [uid, 1, ref], // 1 = ACKNOWLEDGED
    });
    console.log(`  ack uid=${uid.slice(0, 10)}…  tx=${hash}  ref=${ref}`);
  } catch (e) {
    console.error(`  ack FAILED uid=${uid.slice(0, 10)}…`, e);
  } finally {
    pending.delete(uid);
  }
}
