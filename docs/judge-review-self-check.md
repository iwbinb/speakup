# Judge Review Self-Check

Mirror of the four official judging dimensions for Arbitrum Open House
London Buildathon. For each dimension we record what we shipped, what the
artifact path is, and what the gap is.

Last updated 2026-05-24.

---

## 1. Smart Contract Quality

| Sub-dimension | Status | Evidence |
|---|---|---|
| Single source of truth | ✅ | `packages/contracts/src/Registry.sol`, 1 file, < 250 lines |
| Custom errors over revert strings | ✅ | `NotOwner`, `NotRelayer`, `TickerNotFound`, `MeetingNotFound`, `MeetingNotOpen`, `MeetingClosedAlready`, `AlreadyVoted`, `NoVotingWeight`, `AlreadyAcknowledged`, `AttestationNotFound`, `ZeroAddress`, `TickerAlreadyRegistered`, `InvalidWindow`, `ArrayLengthMismatch`, `BatchTooLarge` |
| Access control | ✅ | `onlyOwner`, `onlyRelayer` modifiers; owner ≠ relayer separation supported |
| EAS-style attestation schema | ✅ | `VoteAttestation { voter, meetingId, itemId, choice, weight, reasoningHash, timestamp, status, ackRef }` with deterministic `uid = keccak256(voter, meetingId, itemId, chainid, registry)` |
| Foundry tests | ✅ | `packages/contracts/test/Registry.t.sol` covering register, vote, batch vote, ack, double-vote rejection, weight check, window check, access control |
| Storage layout safety | ✅ | No upgradeability proxy; explicit `struct` definitions; no `delegatecall` |
| External calls | ✅ | Only one: `IERC20(token).balanceOf(voter)` for vote weight; no token transfers, no callbacks |
| Reentrancy surface | ✅ | No `call` with value, no token transfers initiated by Registry |
| Events fully indexed | ✅ | `VoteCast(indexed uid, indexed voter, indexed meetingId, itemId, choice, weight)` enables Envio HyperIndex without touching state reads |

**Score self-estimate: 4.5 / 5.** Gap: no formal audit; no fuzz tests.

---

## 2. Product Market Fit

| Sub-dimension | Status | Evidence |
|---|---|---|
| Stated TAM | ✅ | US public equity governance market: ~$50T market cap, retail proxy participation < 30%; if 5% on-chain in 5 years = $2.5T addressable |
| Real user pain | ✅ | DEF 14A average length 100+ pages; quantified in `docs/d1-research.md §5` (TSLA 2025 = 4.5 MB / 42K lines) |
| Concrete user persona | ✅ | Robinhood retail customer who owns 10 TSLA, gets a proxy email every May, never reads it; landing copy speaks directly to them |
| Distribution path | ✅ | Pitch deck slide 7 (kataposed for Robinhood Chain): Robinhood itself is the wedge distribution because the tokenized stocks all live on their L2; SpeakUp ships as an embedded vote panel inside the Robinhood-Chain wallet experience |
| Regulatory tailwind | ✅ | Pitch deck slide 9: SEC pass-through voting modernization, UK FCA retail proxy push, EU SRD II; SpeakUp is on the side regulators are pushing |
| Existing competition | ✅ | Pitch deck slide 8 head-to-head vs Tally / Boardroom / BlackRock Voting Choice; differentiators are (a) retail-first UX, (b) tokenized-equity native, (c) chain-anchored audit trail |
| Pricing model | ⚠️ Documented | Production roadmap §3 in `docs/production-onepager.md`: free for end users; revenue from issuer subscription + record-keeping API |

**Score self-estimate: 4 / 5.** Gap: no LOI from issuer or Robinhood, no validated WTP from end users.

---

## 3. Innovation and Creativity

| Sub-dimension | Status | Evidence |
|---|---|---|
| New unlock | ✅ | LLM summarisation of DEF 14A is genuinely impossible before 2023; not a "wallet but cheaper" project |
| Three-agent architecture | ✅ | Reader (Sonnet, ingestion) + Advisor (Sonnet, recommendation) + Executor (Haiku, transaction packing); all three independently prompt-engineered with prompt caching planned |
| Demo-mode-first design for judges | ✅ | Spawning a working e2e for evaluators without provisioning Anthropic / Privy is unusual and demonstrates product polish |
| Chain-anchored proxy attestation as primitive | ✅ | EAS-style schema for shareholder vote attestation does not exist in production today; this work could become a standalone standard (e.g., ERC for retail proxy attestations) |
| Reasoning-hash field | ✅ | `reasoningHash` in attestation lets a third party verify the AI rationale that produced a given vote, off-chain content addressable, IPFS-ready |

**Score self-estimate: 4.5 / 5.** Gap: no working integration with Broadridge (the real proxy infrastructure) yet, only a mock relayer.

---

## 4. Real Problem Solving

| Sub-dimension | Status | Evidence |
|---|---|---|
| Concrete proposal handled | ✅ | TSLA Musk $56B re-vote: real 2025 issue, $300B implication; Demo Mode walks through all 4 proposals with real ISS/Glass Lewis positions cited |
| Verifiable on-chain outcome | ✅ | `docs/e2e-proof.md` records block 10-11 attestation + acknowledgement |
| Honesty about what is mocked | ✅ | Demo banner at top of UI says "demo mode"; production roadmap explicitly maps each mock to the real component it would call |
| Production path is real, not handwaved | ✅ | `docs/production-onepager.md` traces every mock → real integration: Robinhood Chain mainnet, Privy real app id, Anthropic key, Broadridge/Mediant proxy bridge |
| Submission is reproducible | ✅ | `docs/e2e-proof.md` includes copy-pasteable reproduce-on-your-machine recipe |

**Score self-estimate: 4 / 5.** Gap: not yet redeployed to public Robinhood Chain testnet or Arbitrum Sepolia (needs faucet ETH).

---

## Overall Self-Estimate

| Dimension | Score | Confidence |
|---|---|---|
| Smart contract quality | 4.5 / 5 | high |
| Product market fit | 4 / 5 | medium (depends on judge's lens) |
| Innovation and creativity | 4.5 / 5 | high |
| Real problem solving | 4 / 5 | high once testnet redeploy is in |
| **Weighted average** | **4.25 / 5** | |

---

## Top Three Things to Do Before Submission

1. **Redeploy to Robinhood Chain testnet** once Bill funds the deployer. Single command: `bun run deploy:robinhood`. Updates a verifiable etherscan-style link in the pitch.
2. **Record the 3-minute demo video.** Script ready in `docs/demo-video-script.md` (TODO). Live demo URL: `speakup.vote`.
3. **Submit on HackQuest.** Form requires: project name, public GitHub URL, demo URL, video URL, team info, 200-word description.
