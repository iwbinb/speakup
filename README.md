# SpeakUp

> Give every on-chain shareholder a voice.

AI Copilot that turns the 100-page SEC proxy statement into a three-line decision and records your vote on-chain. Built for the Robinhood Chain era of tokenized equities.

Submission for the [Arbitrum Open House London Online Buildathon](https://www.hackquest.io/hackathons/Arbitrum-Open-House-London-Online-Buildathon) (2026-05-25 to 2026-06-14).

---

## For judges: try it in 90 seconds

- **Live demo**: https://speakup.vote (pending deploy, see below)
- **Demo video (3 min)**: pending recording
- **Repo**: this directory (will be public on GitHub at submission time)
- **No setup needed**: the live demo runs in zero-config Demo Mode (no Privy app id, no Anthropic API key). Click around freely.

If you want to run it locally, see [Local quick start](#local-quick-start) below.

---

## Try the three identity modes

The header chip at top right (`0x14d0…1351 DEMO`) opens a switcher with three ways to use SpeakUp:

| Mode | What it gives you | Used for |
|---|---|---|
| **Demo wallet** (default) | Fake hardcoded holdings (10 TSLA, 5 AMZN, 20 NFLX) + pre-canned AI recommendations | Judges who want to see the full flow in one click without configuring anything |
| **Watch any address** | Read-only view of any 0x address with real-time Robinhood Chain RPC reads | "What is vitalik holding? What proposals can he vote on?" Paste `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045` to see live |
| **Connect browser wallet** | Real wagmi-connected EIP-1193 wallet (MetaMask, Rabby). The only mode that can sign actual on-chain votes | Crypto-native users casting real votes after claiming Stock Tokens from the Robinhood faucet |

Modes are persisted to `localStorage`; reload keeps your selection.

---

## The problem in one paragraph

US retail shareholder participation in annual meetings has been below 30% for decades. Reason: proxy statements are 100+ pages of legalese. Robinhood is about to bring 50 million retail users on-chain via tokenized stocks. If we do nothing, the participation gap is amplified 1000x. SpeakUp closes that gap before it forms.

## The user flow

1. Connect wallet (Privy social login in production, demo wallet in preview).
2. Detect tokenized stock holdings on Robinhood Chain.
3. AI Reader pulls every upcoming meeting's DEF 14A from SEC EDGAR.
4. AI Advisor summarizes each proposal in three lines and recommends a vote based on user preferences and ISS / Glass Lewis positions.
5. One-click sign.
6. Vote recorded on-chain as an EAS-style `VoteAttestation` in the `SpeakUpRegistry` contract.
7. Mock relayer auto-acknowledges, emitting `VoteAcknowledged` (production path: bridges to Broadridge).

End-to-end proof on local anvil chain 31337, with block-by-block tx trace: [`docs/e2e-proof.md`](./docs/e2e-proof.md).

## Demo tickers

Three tokenized equities live on Robinhood Chain testnet (Chain ID 46630):

| Ticker | Robinhood Chain testnet address | SEC CIK | Story |
|---|---|---|---|
| TSLA | `0xC9f9c86933092BbbfFF3CCb4b105A4A94bf3Bd4E` | 0001318605 | Musk $56B comp package re-vote, Texas reincorporation |
| AMZN | `0x5884aD2f920c162CFBbACc88C9C51AA75eC09E02` | 0001018724 | Antitrust risk, Project Nimbus, warehouse safety |
| NFLX | `0x3b8262A63d25f0477c4DDE23F83cfe22Cb768C93` | 0001065280 | Content moderation, AI in scripts, $42M CEO pay |

Faucet for testnet ETH + Stock Tokens: https://faucet.testnet.chain.robinhood.com

## Architecture

```
packages/
  contracts/   Solidity 0.8.28 + Foundry. SpeakUpRegistry + EAS schema.
  agent/       Anthropic SDK + Reader + Advisor + Executor + mock relayer.
  app/         Next.js App Router + TypeScript strict + viem + wagmi.
  indexer/     Envio HyperIndex (D15 target, currently scaffold).
```

See [`docs/architecture.md`](./docs/architecture.md) for the full diagram.

## Stack

- **Chains**: Robinhood Chain testnet (primary, Chain ID 46630), Arbitrum Sepolia (fallback, Chain ID 421614)
- **Contracts**: Solidity 0.8.28 + Foundry, EAS-style attestation schema
- **AI**: Anthropic Claude Sonnet 4.6 + Haiku 4.5 (prompt caching enabled)
- **Frontend**: Next.js 15 + TypeScript strict + Tailwind v4 + viem + wagmi + Privy
- **Indexer**: Envio HyperIndex
- **Package manager**: bun workspaces

---

## Local quick start

Prereqs: `bun >= 1.3`, `foundry` (`forge`, `cast`, `anvil` in `~/.foundry/bin`).

```bash
git clone <repo-url> SpeakUp && cd SpeakUp
bun install

# 1. Start local anvil
anvil --chain-id 31337 --port 8545 &

# 2. Deploy the registry
cd packages/contracts
DEPLOYER_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  forge script script/Deploy.s.sol \
  --rpc-url http://127.0.0.1:8545 --broadcast

# 3. Run the app (port 3000)
cd ../..
bun run --filter './packages/app' dev
```

Open http://localhost:3000 — you land in Demo Mode with a pre-funded mock wallet. No Anthropic or Privy keys needed.

To unlock real-mode features, fill the variables in `.env.local`:

```env
NEXT_PUBLIC_PRIVY_APP_ID=          # https://dashboard.privy.io
NEXT_PUBLIC_DEFAULT_CHAIN_ID=46630 # Robinhood Chain testnet
ANTHROPIC_API_KEY=                 # https://console.anthropic.com
ALCHEMY_API_KEY=                   # https://alchemy.com (Robinhood Chain RPC)
```

Then restart the dev server. Demo banner disappears and Privy / Anthropic flows become live.

### Reproduce the full on-chain proof

```bash
# After anvil + registry deploy above:
cd packages/agent
# Run mock relayer
ROBINHOOD_RPC_URL=http://127.0.0.1:8545 \
ROBINHOOD_CHAIN_ID=31337 \
REGISTRY=<address-from-deploy-step> \
RELAYER_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
ACK_DELAY_SECONDS=2 \
  bun run scripts/mock-relayer.ts
```

Then follow `docs/e2e-proof.md` to deploy a MockERC20, register a ticker + meeting, cast a vote, and watch the relayer auto-acknowledge.

---

## Honest disclosures

- The **mock relayer** writes `BROADRIDGE-MOCK-...` reference numbers. Production would bridge to actual Broadridge proxy infrastructure; the bridge contract is out of scope for the buildathon.
- The **demo proposals** are realistic representations of the 2025-2026 meeting agendas for TSLA / AMZN / NFLX, anchored on real DEF 14A items (Musk comp re-vote, FTC antitrust action, SAG-AFTRA AI clause). The structured AI output is generated by Claude Sonnet 4.6 when an API key is provided; without one, pre-canned reasonable approximations are served so judges can see the UX.
- **Privy embedded wallet** is wired into the app but requires a free Privy `appId` to activate. Demo mode bypasses it for zero-config evaluation.

## Status and submission timeline

- 5/25-6/2: contracts + agents implemented
- 6/3-6/7: front-end MVP
- 6/8-6/11: end-to-end on testnets
- 6/12-6/13: demo video, polish
- **6/14: submit on HackQuest**

See [`CLAUDE.md`](./CLAUDE.md) for full project memory, [`docs/judge-review-self-check.md`](./docs/judge-review-self-check.md) for our self-scoring against the four judging dimensions, and [`docs/d1-research.md`](./docs/d1-research.md) for the initial research notes.

## Pitch deck

- **PDF**: [`docs/pitch-deck.pdf`](./docs/pitch-deck.pdf) (13 slides, Marp-rendered)
- **HTML slides**: [`docs/pitch-deck.html`](./docs/pitch-deck.html) (open in browser, arrow keys to navigate)
- **Markdown source**: [`docs/pitch-deck.md`](./docs/pitch-deck.md)
- **Architecture diagram**: [`docs/architecture.md`](./docs/architecture.md)
- **Production roadmap onepager**: [`docs/production-roadmap.md`](./docs/production-roadmap.md)
- **Run book** (operator playbook): [`docs/runbook.md`](./docs/runbook.md)

## Indexer + deploy

- **GraphQL indexer** (Envio HyperIndex): [`packages/indexer/`](./packages/indexer/) — `bun run codegen && bun run dev` from there starts the local instance and GraphQL playground at http://localhost:8080
- **Deploy recipes** (Caddy + systemd + Vercel): [`deploy/`](./deploy/) — full runbook from bare-metal Ubuntu host to public `speakup.vote` deployment

## License

MIT.
