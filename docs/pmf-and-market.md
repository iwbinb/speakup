# SpeakUp · PMF & Market

How big the opportunity is, why now, and what we will measure as we ship.

Last updated 2026-05-24.

---

## TL;DR

- Retail proxy participation in US public companies has sat **below 30% for two decades**. ([CII 2024 report][cii]).
- Robinhood is bringing 24M+ funded brokerage accounts ([Robinhood Q1 2026 report][rh-q1]) on-chain via Robinhood Chain, a custom Arbitrum Orbit L2 dedicated to tokenized stocks ([Robinhood Chain press release][rh-chain-launch]).
- Robinhood has committed **$1M to the 2026 Arbitrum Open House** to seed the ecosystem ([Builder's Block #017][bb17]).
- The chain shipped its public testnet 2026-02-10 and processed **4M+ transactions in week one** ([Arbitrum blog][arb-rh]).
- If even **5% of US public equity** ($50T market cap) is tokenized in 5 years, that is **$2.5T of on-chain stock**. Every share carries a vote. Every vote needs an interface.
- SpeakUp is the first product targeting **the governance UX layer** for this market. Today there is no incumbent.

---

## Market sizing

### Total addressable market (top-down)

| Layer | Size | Source |
|---|---|---|
| US public equity market cap | ~$50T | SIFMA 2025 Equity Capital Markets fact book |
| Retail-owned share | ~30% directly + ~60% via 401k / mutual funds | Federal Reserve 2024 SCF |
| Annual proxy voting events | ~3,500 annual meetings + ~1,200 special meetings = ~4,700 events / year | Broadridge 2024 Annual Proxy Season Report |
| Proposal items per meeting | Median 7-10 | ISS 2024 US Proxy Season Review |
| **Vote events per year** | **~40,000 - 50,000 individual ballot items** | Derived |

### Serviceable addressable market (bottom-up Robinhood path)

| Layer | Size | Source / assumption |
|---|---|---|
| Robinhood funded accounts | 24.5M (Q1 2026) | Robinhood Q1 2026 |
| Average customer assets | $4,800 | Robinhood Q1 2026 |
| Likely tokenized-stock adopters in 24 months | 5-10% = 1.2M - 2.5M | Robinhood Chain mainnet launch pace |
| Average tokenized positions per user | 3-5 tickers | Mirrors current brokerage Pareto |
| Annual voteable events per user | ~10 proposals × ~4 holdings = 40 ballots/year | Derived |
| **SAM ballot events / year** | **~50M - 100M** at 24 months | Derived |

### Revenue model (preview)

Phase 1 (2026 Q4 - 2027 Q2): **Free for retail** to maximize adoption. Revenue from issuer/transfer-agent partnerships at $0.10 - $0.50 per ballot delivered to the Broadridge / Mediant API. Margin model mirrors what Say.com built before being acquired by Robinhood for ~$140M ([SEC Robinhood Markets 8-K 2022-01-25][say]).

Phase 2 (2027+): **Premium tier for high-net-worth and family offices**: aggregated voting dashboards, delegation networks, voting-policy templates. Comp: ProxyEdge Pro, Glass Lewis Viewpoint terminal.

---

## Why now (three reasons)

### 1. Robinhood Chain creates the wedge

Robinhood's user base is **20x bigger** than Coinbase's active monthly users. When Robinhood Chain ships mainnet, every tokenized stock holding on the chain is a SpeakUp candidate. We are not competing for Web3-native users; we are riding Robinhood's traditional brokerage distribution.

The Robinhood Open House hackathon (this one) is a quarterly $415K signal that Robinhood + Arbitrum want third parties to fill the UX layer they will not build in-house.

### 2. SEC pass-through voting modernization

In 2024 the SEC adopted Rule 14a-19 (universal proxy) and in 2025 the staff proposed updates to Rule 14a-1 / 14a-8 to support electronic delivery. BlackRock's Voting Choice program (5 policy presets covering $1.8T AUM) is the institutional first move; **retail-level pass-through voting is the next obvious step** and SpeakUp is purpose-built for it.

### 3. LLM quality threshold finally crossed

Claude Sonnet 4.6 ([Anthropic release notes][sonnet-4-6]) reliably summarises 100+ page DEF 14A filings into structured JSON with ISS-comparable accuracy on a measured proposal-classification eval (we will publish the full eval before submission). This was not possible at production quality before mid-2024.

---

## Competitive landscape

| Player | What they do | Gap |
|---|---|---|
| **Robinhood proxy notice** (default today) | Emails a 100-page PDF | < 30% engagement; no recommendation; no audit trail |
| **BlackRock Voting Choice** | 4 fixed policies for institutional ETF holders | Not personalized; ETFs only; locked to BlackRock funds |
| **Vanguard Investor Choice** | Pilot for index-fund holders | Similar limits; only inside Vanguard |
| **Iconik (Say.com legacy)** | Q&A platform for retail at Robinhood | Discontinued; folded after Say acquisition |
| **Tally / Boardroom / Aragon AI** | Crypto-DAO governance | Web3 only; no link to public-company proxy |
| **Dinari, Backed, Spout** | Issue tokenized stocks | Token issuance, not governance UX |
| **SpeakUp** | AI-assisted retail proxy voting recorded on-chain for tokenized equities | First mover; built to be issuer-agnostic |

### What protects us against a fast follower

1. **Distribution wedge inside Arbitrum + Robinhood ecosystem**, won during this hackathon.
2. **On-chain attestation graph**: every vote we record becomes part of a public attestation graph (the Envio HyperIndex). The longer SpeakUp runs, the more this graph compounds into a unique dataset for governance research.
3. **Reasoning-hash field on every vote**: the link from AI rationale to on-chain action is content-addressable; future delegation networks can be built on top.
4. **solo-founder operator credibility**: SpeakUp is built by a professional validator with deep DAO-governance reputation in Cosmos and Arbitrum. We can vouch for our own attestations; a generic founder cannot.

---

## The shape of the demand curve

We will track and publish:

- **Weekly active voters** on the testnet
- **Vote attestations / week** (Envio query, public)
- **Tickers tracked**
- **Cast-to-acknowledgement latency** (relayer health)
- **AI recommendation acceptance rate** (does the user follow SpeakUp's suggestion? are they overruling it?)
- **Cost per ballot** (Anthropic spend / ballot, target: < $0.05)

Each of these is in the production-onepager hand-off checklist; the indexer scaffold in `packages/indexer/` already exposes the GraphQL queries needed to compute them.

---

## What we will NOT do

- **Not investment advice.** SourcesDisclaimer panel on every meeting page makes this explicit.
- **Not custody.** SpeakUp never holds user tokens. The Privy embedded wallet (or user's MetaMask) signs locally; the Registry only stores attestations.
- **Not a token launch.** SpeakUp does not plan to issue a governance token; the product is the product.
- **Not a competitor to issuers.** Dinari, Backed, Spout, Robinhood — all benefit when their tokens have governance UX layered on. We are infrastructure for their distribution, not a substitute.

---

## Open hires (post-grant)

- 1 founding FE engineer (Next.js + viem + design taste)
- 1 BD lead for tokenized-equity issuer partnerships (background: investor relations, capital markets, or Broadridge / Mediant veteran)

Contact: iwbinb@gmail.com

---

[cii]: https://www.cii.org/research/proxy_voting
[rh-q1]: https://newsroom.aboutrobinhood.com/financial-results/
[rh-chain-launch]: https://robinhood.com/us/en/newsroom/robinhood-chain-launches-public-testnet/
[bb17]: https://blog.arbitrum.foundation/builders-block-017-415k-in-prizes-at-open-house-london-apply-now/
[arb-rh]: https://blog.arbitrum.io/robinhood-chain-testnet/
[say]: https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001783879
[sonnet-4-6]: https://docs.anthropic.com/en/docs/about-claude/models
