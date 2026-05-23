# SpeakUp Architecture

## High-Level Flow

```mermaid
flowchart LR
  U[Retail user] -->|Google / Apple / email| P[Privy embedded wallet]
  P --> W[wagmi]
  W -->|balanceOf x 3| RH[(Robinhood Chain testnet)]
  W -->|read Registry| RH
  U -->|opens meeting| API[/api/proposals]
  API -->|fetch DEF 14A| EDGAR[(SEC EDGAR)]
  API -->|Reader Agent| AN[Anthropic Sonnet 4.6]
  API -->|Advisor Agent| AN
  API -->|render| UI[ProposalCard + CopilotChat]
  UI -->|streaming Q&A| API2[/api/copilot]
  API2 --> AN
  U -->|one-click sign| W
  W -->|castVotes tx| REG[SpeakUpRegistry]
  REG -->|VoteCast event| REL[Mock Relayer]
  REL -->|acknowledge tx| REG
  REG -->|Attestation index| IDX[Envio HyperIndex]
  IDX -->|GraphQL| UI
```

## Component Boundaries

### packages/contracts (Solidity 0.8.28, Foundry)

| Contract | Responsibility |
|---|---|
| `SpeakUpRegistry` | Ticker registry + meeting registry + vote attestation storage. EAS-compatible schema (struct layout matches `IEAS.attest()` input so production swap is mechanical). |
| `MockERC20` (test only) | Mocks Robinhood Chain Stock Token for unit tests. |
| `Deploy.s.sol` | Deploys Registry to a target chain, sets owner = msg.sender, relayer = RELAYER_ADDRESS or msg.sender. |
| `Seed.s.sol` | Registers TSLA / AMZN / NFLX tickers + their current meeting + SEC EDGAR URL. |

Test surface: 15+ Foundry tests covering admin, happy paths, error paths, fuzz vote weight. Target: `forge coverage` ≥ 90% line + branch.

### packages/agent (TypeScript, Bun)

| Module | Responsibility |
|---|---|
| `anthropic.ts` | Anthropic SDK client + `cachedSystem()` helper that marks the last system block with `cache_control: ephemeral`. `callJson()` parses unstructured model output with a balanced-brace JSON extractor. |
| `edgar.ts` | SEC EDGAR JSON submissions API client + linkedom-based HTML to text reducer + 24h filesystem cache keyed on SHA-256 of URL. |
| `agents/reader.ts` | Sonnet 4.6. Input: ticker + DEF 14A URL + cleaned body text. Output: `ProposalList` (zod-validated). |
| `agents/advisor.ts` | Sonnet 4.6. Input: `ProposalList` + `UserPreference`. Output: `RecommendationList` with three-line rationale per item. |
| `agents/executor.ts` | Haiku 4.5. Validates + packs final decisions into `castVotes` call args. Local zod re-validation enforces the contract. |
| `scripts/edgar-probe.ts` | E2E probe: TSLA + AMZN + NFLX. Without ANTHROPIC_API_KEY, runs fetch + parse + token-count only. |
| `scripts/mock-relayer.ts` | viem `watchContractEvent` on VoteCast → `setTimeout(ACK_DELAY)` → `acknowledge()` with mock Broadridge ref. |

### packages/app (Next.js 15, React 19, TypeScript strict)

- `src/app/page.tsx`: landing hero (unauthenticated) + HoldingsList (authenticated)
- `src/app/meeting/[meetingId]/page.tsx`: full proposal review + sticky one-click castVotes
- `src/app/api/proposals/route.ts`: EDGAR → Reader → Advisor pipeline, 6h memo per meetingId
- `src/app/api/copilot/route.ts`: SSE streaming follow-up Q&A
- `src/components/ProposalCard.tsx`: 3-stance grid (mgmt/ISS/GL) + recommendation + decision buttons + CopilotChat
- `src/hooks/useHoldings.ts`: wagmi `useReadContracts` batch ERC-20 balanceOf
- `src/lib/registry.ts`: Registry ABI + per-chain address constants + Choice helpers
- `src/providers.tsx`: PrivyProvider + WagmiProvider + react-query

### packages/indexer (Envio HyperIndex, bootstrapped in D15)

Indexes `VoteCast` + `VoteAcknowledged` events from Registry on both chains. Exposes GraphQL at `localhost:8080/v1/graphql` (dev) for the app to query per-voter and per-meeting attestation history.

## Data Flow per Vote

1. User opens `/meeting/TSLA-2025-ANNUAL`
2. App calls `GET /api/proposals?meetingId=TSLA-2025-ANNUAL`
3. API resolves to CIK 0001318605 + DEF 14A URL
4. `fetchDef14aTextCached` returns cleaned body text from 24h fs cache
5. `readProposals` runs Sonnet with cached system prompt; returns validated `ProposalList`
6. `advise` runs Sonnet with cached system prompt + default `UserPreference`; returns validated `RecommendationList`
7. Both blobs cached in process memory for 6 hours, keyed by meetingId
8. App renders `ProposalCard` per proposal with SpeakUp recommendation prefilled
9. User clicks buttons to adjust, or asks Copilot a follow-up via SSE-streamed `/api/copilot`
10. User clicks "Cast votes". App packs `castVotes(meetingId, itemIds[], choices[], reasoningHashes[])`
11. wagmi `useWriteContract` → Privy signature → broadcast to Robinhood Chain
12. `VoteCast` event emitted; mock relayer picks it up, waits 10s, calls `acknowledge`
13. `VoteAcknowledged` event emitted; Envio indexer updates GraphQL state; app refetches

## EAS Compatibility

Our `VoteAttestation` struct layout matches the standard EAS schema:

```
address voter,
bytes32 meetingId,
uint16  itemId,
uint8   choice,
uint256 weight,
bytes32 reasoningHash
```

For production we register this schema with the canonical EAS contract (`0xC2679fBD37d54388Ce493F1DB75320D236e1815e` on most chains) and switch `castVote` to call `IEAS.attest(...)` instead of writing to our own storage. The struct layout, event signatures, and uid derivation all transfer over. The hackathon version uses in-place storage because Robinhood Chain testnet does not host a canonical EAS deployment.

## Why We Self-Store Today

| Reason | Detail |
|---|---|
| Demo independence | Robinhood Chain testnet has no EAS deployment we control. Self-storage avoids a 200-line EAS-deploy detour. |
| Custom guards | `AlreadyVoted` and `NoVotingWeight` checks need our own storage layer to be cheap. |
| Production cost | EAS attestation gas on chains with canonical EAS is ~30k cheaper, so production swap is positive ROI. |

## Threat Model (Hackathon Scope)

| Threat | Mitigation |
|---|---|
| Double voting | `_existingVote[voter][meetingId][itemId]` reverts with `AlreadyVoted` |
| Voting with zero balance | `balanceOf(msg.sender) == 0` reverts with `NoVotingWeight` |
| Voting after deadline | `voteOpen <= block.timestamp <= voteDeadline` enforced |
| Relayer impersonation | `onlyRelayer` modifier on `acknowledge` |
| Owner key compromise | Out of scope for hackathon. Production: 2/3 Safe multisig on owner. |
| AI hallucination | Output runs through zod; Executor agent re-validates before tx send |
| Prompt injection | DEF 14A body is user data; Reader prompt isolates instructions in system; output schema constrained |
