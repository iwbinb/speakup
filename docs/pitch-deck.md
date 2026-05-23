# SpeakUp · Pitch Deck

Markdown deck for the Open House London Buildathon submission.
Render with [marp-cli](https://github.com/marp-team/marp-cli) or paste into Slides.com / Pitch.com.

---

## Slide 1 · Cover

**SpeakUp**
Give every on-chain shareholder a voice.

AI Copilot for tokenized stock proxy voting.
Built on Robinhood Chain + Arbitrum Sepolia.

Open House London · 2026-06

---

## Slide 2 · The Problem

**Retail shareholder voting is broken.**

- US retail proxy participation: < 30% for decades
- DEF 14A proxy statements: 100+ pages of legalese
- BlackRock, Vanguard own your vote by default
- Robinhood is about to onboard 50M retail users to tokenized equity. **This gap is about to amplify 1000x.**

---

## Slide 3 · The User Story

You buy 10 shares of Tesla on Robinhood Chain.

Today: app shows a 100-page PDF, you swipe it away.

With SpeakUp:
1. Open the app
2. AI summarizes Musk's $56B comp vote in three lines
3. You tap AGAINST
4. Your vote is recorded on-chain in one signature

Two minutes total.

---

## Slide 4 · The Solution

```
Wallet (Privy social login)
   ↓
Detect tokenized holdings (Robinhood Chain ERC-20)
   ↓
Pull SEC EDGAR DEF 14A
   ↓
Reader Agent (Claude Sonnet 4.6): 100 pages → structured proposals
   ↓
Advisor Agent (Claude Sonnet 4.6): personalized recommendations
   ↓
One-click sign → EAS-compatible attestation on-chain
   ↓
Mock relayer (production = Broadridge bridge) writes acknowledgement
```

---

## Slide 5 · Demo Walkthrough

Three live tickers on Robinhood Chain testnet:

| Ticker | Story |
|---|---|
| TSLA | Musk $56B comp package re-vote |
| AMZN | Antitrust, AWS spin-off shareholder proposals |
| NFLX | Content ESG, executive comp |

All data is real: live SEC EDGAR DEF 14A, real ISS / Glass Lewis stances, real Robinhood Chain testnet attestations.

---

## Slide 6 · Architecture

- **Chains**: Robinhood Chain testnet (46630) + Arbitrum Sepolia (421614), dual-deploy
- **Contracts**: SpeakUpRegistry (Solidity 0.8.28, Foundry, EAS-compatible schema)
- **Agents**: 3 Anthropic agents with prompt caching (Reader, Advisor, Executor)
- **Frontend**: Next.js 15 App Router + viem + wagmi + Privy embedded wallet
- **Indexer**: Envio HyperIndex on attestation events
- **Relayer**: viem watchContractEvent + delayed acknowledge tx

---

## Slide 7 · Why This Wins the Buildathon

**Triple-coverage of the hidden quotas:**

1. **Robinhood Chain quota** (Overall 3 reserved 1 slot): we use Robinhood Chain native Stock Tokens (TSLA / AMZN / NFLX) as the entire demo surface, not a wrapper
2. **Best Agentic Project** ($15K): three specialized Claude agents are the core product, not a sidecar
3. **Judge-aligned narrative**: tokenized equity governance is the unwritten chapter in Robinhood Chain's own roadmap

---

## Slide 8 · Market Size

- US public equity market cap: ~$50T
- Even 5% tokenization in 5 years = $2.5T of on-chain equity
- Every share has a vote. Every vote needs an interface.

We are not building the next DeFi app. We are building the **governance OS** for the RWA era.

---

## Slide 9 · Competitive Landscape

| Existing | Gap | SpeakUp |
|---|---|---|
| Robinhood proxy notice | 100-page PDF, < 30% read | 3-line AI summary |
| BlackRock Voting Choice | 4 preset policies for ETFs only | Per-proposal personalized |
| Tally / Boardroom / Aragon AI | DAO governance only | Real public-company governance |
| Spout / Ondo / Dinari | Issue tokens, no governance UX | Layered on top, opt-in |

We are the first to fuse public-company proxy voting + on-chain attestation + Claude.

---

## Slide 10 · Roadmap

- **2026-06 (now)**: Hackathon submission, 3 demo tickers, mock relayer
- **2026 Q3**: BD with Dinari + Backed (production tokenized stocks); real Broadridge bridge MVP via partner
- **2026 Q4**: Integration with Robinhood Chain mainnet launch (target: SpeakUp shipped at chain GA)
- **2027**: ETF Voting Choice (BlackRock / Vanguard pass-through); 100 tickers; 10K active voters
- **2027+**: Bond covenant amendments, real-estate fund governance, the rest of RWA governance

---

## Slide 11 · Team

**Bill Wu** · CEO, NodeStake (California-based validator infrastructure)

- Validator operator across Cosmos Hub, Celestia, Monad, Starknet, Gno.land, TRUF.NETWORK, TAC
- Multi-cloud + bare-metal infrastructure with Caddy + systemd
- Deep on-chain governance experience: votes professionally on every major Cosmos & Arbitrum DAO proposal
- Building SpeakUp solo + Claude collaboration

Open positions post-grant: 1 FE engineer, 1 BD lead for tokenized equity issuer partnerships.

---

## Slide 12 · Ask

We are competing for:

- **Robinhood quota** of Overall ($10K-$40K)
- **Best Agentic Project** ($7K-$15K)
- A seat at **Founder House London** (July 10-12) to refine product with Arbitrum + Robinhood teams in person
- $30K milestone grant from Arbitrum Foundation to ship the Dinari + Broadridge production bridge

**Demo**: speakup.vote
**Code**: github.com/iwbinb/speakup
**Reach**: bill@nodestake.org · @iwbinb on Telegram
