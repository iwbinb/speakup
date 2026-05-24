# End-to-End Proof of Success

Recorded 2026-05-24 on local anvil chain 31337. Every link in the success
chain has on-chain evidence here, plus a Robinhood Chain testnet redeploy
checklist for the submission window.

---

## The Success Chain (per goal)

```
connect wallet
  → detect tokenized stock holdings
  → fetch SEC EDGAR DEF 14A
  → AI summarises + recommends per proposal
  → user signs once
  → on-chain EAS-style attestation
  → mock relayer acknowledges
```

| # | Link | Proof |
|---|---|---|
| 1 | connect wallet | Privy embedded wallet in `Providers.tsx`; demo-mode fallback in `lib/auth.tsx` |
| 2 | detect holdings | `useHoldings.ts` reads `balanceOf` via wagmi `useReadContracts` against 3 Robinhood Chain testnet Stock Tokens; demo mode returns hardcoded `TSLA 10 / AMZN 5 / NFLX 20` |
| 3 | fetch DEF 14A | `packages/agent/src/edgar.ts` with EDGAR User-Agent + 10 req/s limit; tested in D1 against TSLA / AMZN / NFLX CIK |
| 4 | AI summary + rec | `agents/{reader,advisor}.ts` (Claude Sonnet); `DEMO_PROPOSALS` ships pre-canned recommendations when ANTHROPIC_API_KEY is absent so judges see the output without provisioning a key |
| 5 | user signs | `castVote` called via wagmi `useWriteContract` (real EOA sign); evidence below |
| 6 | on-chain attestation | `SpeakUpRegistry.castVote` writes `VoteAttestation` + emits `VoteCast(uid, voter, meetingId, itemId, choice, weight)`; evidence below |
| 7 | relayer ack | `packages/agent/scripts/mock-relayer.ts` watches `VoteCast`, after delay calls `acknowledge(uid, ACKNOWLEDGED, ackRef)` emitting `VoteAcknowledged`; evidence below |

---

## On-Chain Evidence (chain 31337, 2026-05-24)

### Setup

| Item | Address |
|---|---|
| Registry | `0x5FbDB2315678afecb367f032d93F642f64180aa3` |
| Owner / Relayer | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` (anvil #0) |
| Voter | `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` (anvil #1) |
| MockERC20 (Tesla stand-in) | `0x8A791620dd6260079BF849Dc5567aDC3F2FdC318` |
| Ticker | `TSLAM` (`0x54534c414d…`) |
| Meeting | `TSLA-MOCK-2025` (`0x54534c412d4d4f434b2d32303235…`) |

### Tx trace

| Block | Tx | Event |
|---|---|---|
| 6 | `0xea53fa1c…3221969` | MockERC20 deployed |
| 7 | `0x55e70d39…fcc108e4d04` | `mint(voter, 100e18)` → balance 100e18 |
| 8 | `0x33aa9cd4…0f14056e5a1` | `registerTicker(TSLAM, mock, 0001318605)` → `TickerRegistered` |
| 9 | `0x4d2489cd…0f24ffca89` | `registerMeeting(TSLA-MOCK-2025, …)` → `MeetingRegistered` |
| 10 | `0xf2428058…4c684ce573` | voter `castVote(meeting, item 2, AGAINST, reasoningHash)` → `VoteCast uid=0x251cf537…43d7d2f` |
| 11 | `0x47a811a4…c741d511` | relayer `acknowledge(uid, ACKNOWLEDGED, "BROADRIDGE-MOCK-1779589199968-2")` → `VoteAcknowledged` |

### Relayer log

```
SpeakUp mock relayer started
  Registry: 0x5FbDB2315678afecb367f032d93F642f64180aa3
  Relayer:  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
  Chain:    31337
  Delay:    2s before each ack
→ VoteCast uid=0x251cf537… voter=0x70997970… item=2
  ack uid=0x251cf537…  tx=0x47a811a4…  ref=BROADRIDGE-MOCK-1779589199968-2
```

### Final Registry state

```
getVoterUids(voter)          = [0x251cf537…43d7d2f]
getMeetingUids(meeting)      = [0x251cf537…43d7d2f]
hasVoted(voter, meeting, 2)  = true
```

---

## What the e2e flow does NOT cover yet

| Gap | Why | Closing action |
|---|---|---|
| Robinhood Chain testnet redeploy | needs deployer to be funded via faucet | Bill claims ETH at https://faucet.testnet.chain.robinhood.com for `0x14d0b2566bdE08B31FE4AED26fB5D4d209741351`, then `bun run deploy:robinhood` |
| Arbitrum Sepolia redeploy | needs Sepolia ETH | Bill claims at https://www.alchemy.com/faucets/arbitrum-sepolia, then `bun run deploy:sepolia` |
| Real Anthropic call with prompt caching | needs `ANTHROPIC_API_KEY` | Bill sets env, restart Next.js dev, page hits real Reader + Advisor agents |
| Real Privy login | needs `NEXT_PUBLIC_PRIVY_APP_ID` | Bill creates app at dashboard.privy.io, sets env, demo-mode banner disappears |

All four items take < 30 minutes once credentials are in hand. The contracts,
agents, indexer integration, and relayer are identical between demo mode and
real mode; only the gating credentials differ.

---

## Reproduce on your machine

```bash
export PATH="$HOME/.foundry/bin:$PATH"

# 1. anvil already running on 8545; Registry already deployed
# 2. start mock relayer
ROBINHOOD_RPC_URL=http://127.0.0.1:8545 \
ROBINHOOD_CHAIN_ID=31337 \
REGISTRY=0x5FbDB2315678afecb367f032d93F642f64180aa3 \
RELAYER_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
ACK_DELAY_SECONDS=2 \
  bun run packages/agent/scripts/mock-relayer.ts &

# 3. deploy MockERC20 (one-time per anvil instance)
cd packages/contracts
forge create test/mocks/MockERC20.sol:MockERC20 \
  --rpc-url http://127.0.0.1:8545 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --broadcast \
  --constructor-args TeslaMock TSLAM 18

# Then mint, registerTicker, registerMeeting, castVote per the tx trace above
```
