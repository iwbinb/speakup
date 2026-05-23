# SpeakUp

> Give every on-chain shareholder a voice.

AI Copilot for on-chain shareholder governance. SpeakUp reads the 100-page SEC DEF 14A proxy statement, condenses it into three-line decisions, and lets users sign a single on-chain attestation to cast their vote. Built for the Robinhood Chain era of tokenized equities.

Submission for [Arbitrum Open House London Online Buildathon](https://www.hackquest.io/hackathons/Arbitrum-Open-House-London-Online-Buildathon) (2026-05-25 to 2026-06-14).

---

## The Problem

US retail shareholder participation in annual meetings has been below 30% for decades. Reason: proxy statements are 100+ pages of legalese and financial jargon. With Robinhood about to bring 50 million retail users on-chain via tokenized stocks, this gap is about to be amplified 1000x.

## The Solution

1. Connect wallet (social login via Privy, no seed phrase needed)
2. SpeakUp detects your tokenized stock holdings on Robinhood Chain
3. AI reads every upcoming meeting's DEF 14A and summarizes each proposal in three lines
4. Compare management recommendation, ISS, Glass Lewis, and SpeakUp's personalized recommendation
5. One-click sign your vote
6. Vote is recorded as an on-chain EAS attestation
7. Mock relayer acknowledges the attestation (production path: bridged to Broadridge)

## Demo Tickers

Three tokenized equities live on Robinhood Chain testnet (Chain ID 46630):

| Ticker | Address | Story |
|---|---|---|
| TSLA | `0xC9f9c86933092BbbfFF3CCb4b105A4A94bf3Bd4E` | Musk $56B comp package re-vote |
| AMZN | `0x5884aD2f920c162CFBbACc88C9C51AA75eC09E02` | Antitrust, AWS spin-off proposals |
| NFLX | `0x3b8262A63d25f0477c4DDE23F83cfe22Cb768C93` | Content ESG, executive comp |

---

## Architecture

```
packages/
  contracts/   Solidity + Foundry. EAS schema + Registry.
  agent/       Anthropic SDK + three agents (Reader / Advisor / Executor).
  app/         Next.js + viem + wagmi + Privy. Fintech-style UI.
  indexer/     Envio HyperIndex tracking attestations.
```

## Stack

- **Chains**: Robinhood Chain testnet (primary), Arbitrum Sepolia (fallback)
- **Contracts**: Solidity 0.8.x + Foundry, EAS (Ethereum Attestation Service)
- **AI**: Anthropic Claude Sonnet 4.6 (reasoning) + Haiku 4.5 (extraction), with prompt caching
- **Frontend**: Next.js App Router, TypeScript strict, viem, wagmi, Privy embedded wallet
- **Indexer**: Envio HyperIndex
- **Package manager**: bun workspaces

## Quick Start

```bash
bun install
cp .env.example .env
# Fill ANTHROPIC_API_KEY and DEPLOYER_PRIVATE_KEY at minimum

# Deploy contracts to Robinhood Chain testnet
cd packages/contracts && forge install && forge build && forge test

# Run the app
bun dev
```

## Status

Active development. Submission target 2026-06-14. See [CLAUDE.md](./CLAUDE.md) for project memory and [docs/d1-research.md](./docs/d1-research.md) for D1 research notes.
