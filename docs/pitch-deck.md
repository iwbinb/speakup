---
marp: true
theme: default
paginate: true
size: 16:9
backgroundColor: '#ffffff'
color: '#1a1d21'
header: 'SpeakUp · AI Copilot for on-chain shareholder governance'
footer: 'NodeStake · Arbitrum Open House London Buildathon · 2026-06'
style: |
  section {
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
    padding: 60px;
  }
  h1 { color: #00c853; font-weight: 700; }
  h2 { color: #1a1d21; font-weight: 600; font-size: 38px; }
  table { font-size: 18px; }
  code { background: #f3f5f7; padding: 2px 6px; border-radius: 4px; font-size: 16px; }
  blockquote { border-left: 4px solid #00c853; padding-left: 16px; color: #4a525a; }
  strong { color: #00701a; }
---

<!-- _class: lead -->
<!-- _paginate: false -->

# SpeakUp

### Give every on-chain shareholder a voice.

AI Copilot for tokenized stock proxy voting.
Built on Robinhood Chain + Arbitrum Sepolia.

Arbitrum Open House London · June 2026

---

## The Problem

**Retail shareholder voting is broken.**

- US retail proxy participation has stayed **below 30% for decades**
- DEF 14A proxy statements: **100+ pages of legalese**
- BlackRock and Vanguard own your vote by default
- Robinhood is about to onboard **50M retail users** to tokenized equity

> If we do nothing, this gap amplifies 1000x.

---

## The User Story

You buy 10 shares of Tesla on Robinhood Chain.

**Today:** the app shows a 100-page PDF. You swipe it away.

**With SpeakUp:**

1. Open the app
2. AI summarises Musk's $56B comp re-vote in three lines
3. You tap AGAINST
4. Your vote is recorded on-chain in **one signature**

Two minutes total.

---

## The Solution

```text
Wallet (Privy social login / EIP-1193 / WalletConnect)
     ↓
Detect tokenized holdings (Robinhood Chain ERC-20)
     ↓
Pull SEC EDGAR DEF 14A
     ↓
Reader Agent (Claude Sonnet 4.6): 100 pages → structured proposals
     ↓
Advisor Agent (Claude Sonnet 4.6): personalized recommendations
     ↓
One-click sign → EAS-style attestation on-chain
     ↓
Mock relayer (production = Broadridge bridge) writes acknowledgement
```

---

## Demo Walkthrough

Three live tickers on Robinhood Chain testnet:

| Ticker | Story |
|---|---|
| **TSLA** | Musk $56B comp package re-vote, Texas reincorporation |
| **AMZN** | Antitrust risk, Project Nimbus, warehouse safety |
| **NFLX** | Content moderation, AI in scripts, $42M CEO pay |

Live demo: **speakup.vote** · Registry: `0xb6D8E46BF9e48aDD4747595b2e437Eb327071c94`

---

## Architecture

- **Chains**: Robinhood Chain testnet (46630) + Arbitrum Sepolia (421614), dual-deploy
- **Contracts**: `SpeakUpRegistry` (Solidity 0.8.28, Foundry, EAS-style schema), Blockscout-verified
- **Agents**: 3 Claude Sonnet 4.6 agents with prompt caching (Reader, Advisor, Executor)
- **Frontend**: Next.js 15 + viem + wagmi + Privy embedded wallet + WalletConnect
- **Indexer**: Envio HyperIndex on attestation events
- **Relayer**: viem `watchContractEvent` (polling mode) + delayed `acknowledge()` tx
- **Tests**: 19 forge unit tests + 8 bun smoke tests, all green

---

## Why This Wins the Buildathon

**Triple-coverage of the hidden quotas:**

1. **Robinhood Chain quota** (Overall 3 reserved 1 slot for Robinhood-Chain projects):
   we use Robinhood Chain native Stock Tokens (TSLA / AMZN / NFLX) as the entire
   demo surface, not a wrapper
2. **Best Agentic Project** ($15K): three specialised Claude agents are the
   core product, not a sidecar
3. **Judge-aligned narrative**: tokenized equity governance is the unwritten
   chapter in Robinhood Chain's own product roadmap

---

## Market Size

- US public equity market cap: **~$50T**
- Even 5% tokenization in 5 years = **$2.5T of on-chain equity**
- Every share has a vote. **Every vote needs an interface.**

We are not building the next DeFi app.
We are building the **governance OS** for the RWA era.

---

## Competitive Landscape

| Existing | Gap | SpeakUp |
|---|---|---|
| Robinhood proxy notice | 100-page PDF, < 30% read | 3-line AI summary |
| BlackRock Voting Choice | 4 preset policies, ETFs only | Per-proposal, personalized |
| Tally / Boardroom / Aragon AI | DAO governance only | Real public-company governance |
| Spout / Ondo / Dinari | Issue tokens, no governance UX | Layered on top, opt-in |

We are the first to fuse **public-company proxy voting + on-chain attestation + Claude**.

---

## Roadmap

- **2026-06 (now)**: Hackathon submission. 3 demo tickers. Mock relayer. Live testnet.
- **2026 Q3**: BD with Dinari + Backed; real Broadridge bridge MVP via partner
- **2026 Q4**: Integration with Robinhood Chain mainnet launch (target: SpeakUp shipped at chain GA)
- **2027**: ETF Voting Choice (BlackRock / Vanguard pass-through); 100 tickers; 10K active voters
- **2027+**: Bond covenant amendments, real-estate fund governance, the rest of RWA

---

## Team

**Bill Wu** · CEO, NodeStake (California-based validator infrastructure)

- Validator across **Cosmos Hub, Celestia, Monad, Starknet, Gno.land, TRUF.NETWORK, TAC**
- Multi-cloud + bare-metal infrastructure (Caddy + systemd)
- Deep on-chain governance experience: votes professionally on every major Cosmos and Arbitrum DAO proposal
- Building SpeakUp solo + Claude collaboration

Open positions post-grant: **1 FE engineer, 1 BD lead** for tokenized equity issuer partnerships.

---

## Ask

We are competing for:

- **Robinhood quota of Overall** ($10K-$40K)
- **Best Agentic Project** ($7K-$15K)
- A seat at **Founder House London** (July 10-12) to refine product with Arbitrum + Robinhood teams in person
- **$30K milestone grant** from Arbitrum Foundation to ship the Dinari + Broadridge production bridge

---

<!-- _class: lead -->
<!-- _paginate: false -->

## Thank you

**Demo**: speakup.vote
**Code**: github.com/iwbinb/speakup
**Reach**: bill@nodestake.org · @iwbinb on Telegram

> Give every on-chain shareholder a voice.
