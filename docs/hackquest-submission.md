# HackQuest Submission Form Copy

Drop this verbatim into the corresponding fields when you submit at
https://www.hackquest.io/hackathons/Arbitrum-Open-House-London-Online-Buildathon

---

## Project name

```
SpeakUp
```

## Tagline (one line)

```
Give every on-chain shareholder a voice. AI Copilot for tokenized stock proxy voting on Robinhood Chain.
```

## Short description (200 words, drop verbatim)

```
SpeakUp is the first plain-English shareholder voting app built for the
on-chain era of tokenized equities. When Robinhood Chain brings 50 million
retail users on-chain through tokenized stocks, the 70 percent of US
shareholders who skip their annual proxy vote because the materials are
100 pages of legalese will be amplified 1000x. SpeakUp closes that gap.

Three specialized AI agents (Reader, Advisor, Executor) read the full
SEC DEF 14A filing for you, summarize each proposal in three lines, and
recommend a vote based on your stated preferences and the public ISS and
Glass Lewis positions. One signature records the vote as an EAS-style
attestation on Robinhood Chain. A mock relayer bridges to Broadridge in
production.

Built native on Robinhood Chain testnet (Chain ID 46630). Registry
contract verified on Blockscout at 0xb6D8E46BF9e48aDD4747595b2e437Eb327071c94.
End-to-end proof of 8 on-chain transactions documented in the repo.
Slither clean. 100% line coverage on the Registry. 79 tests green
across contracts, agents, and front-end.

Live demo: https://speakup-2la.pages.dev
Code: https://github.com/iwbinb/speakup
```

(Word count: 200)

## Long description (markdown, for the project page)

```
## Why this matters

Every public company in the US holds an annual shareholder meeting where
holders vote on executive compensation, board seats, mergers, and ESG
proposals. The proxy statement (SEC DEF 14A) is 100+ pages of legalese.
Retail participation has stayed below 30 percent for two decades.

Robinhood is bringing 50 million retail brokerage users on-chain through
tokenized stocks on Robinhood Chain, a custom Arbitrum Orbit L2. If we do
nothing, the participation gap amplifies 1000x.

## What we built

- **3-agent architecture**: Reader (Sonnet 4.6) extracts proposals from the
  DEF 14A. Advisor (Sonnet 4.6) recommends a vote based on user preferences
  plus public ISS and Glass Lewis stances. Executor (Haiku 4.5) packs
  decisions into on-chain transactions.
- **EAS-style attestation schema**: every vote is a deterministic uid on
  Robinhood Chain. Reasoning hash is content-addressable and IPFS-ready.
- **3 identity modes** (demo / watch / wallet) so judges experience the
  full UX with zero setup.
- **Reown-style wallet picker** + ENS resolution.
- **Cmd+K command palette** for power users.

## What's mocked (honest disclosure)

- The relayer writes BROADRIDGE-MOCK-... reference numbers. Production
  bridges to actual Broadridge / Mediant SOAP APIs.
- ISS and Glass Lewis stances are approximated from public season previews.
  Production licenses the real feed.
- Demo mode serves pre-canned proposals so judges can explore without an
  Anthropic API key.

## Why we win the Robinhood quota

SpeakUp uses Robinhood Chain native Stock Tokens (TSLA / AMZN / NFLX) as
the entire demo surface, not a wrapper. The product is the missing
governance UX layer that Robinhood Chain's own roadmap leaves open.

## Why we win Best Agentic

Three independently prompt-engineered Claude agents are the core product,
not a sidecar. Prompt caching planned for production cost target under
$0.05 per ballot.
```

## Tech stack tags

```
Solidity, Foundry, TypeScript, Next.js 15, React 19, viem, wagmi,
Privy, WalletConnect, Anthropic Sonnet 4.6, Anthropic Haiku 4.5,
EAS (Ethereum Attestation Service), Envio HyperIndex, Cloudflare Pages,
Robinhood Chain, Arbitrum Sepolia.
```

## Target prize tracks

```
- Overall (Robinhood Chain quota)
- Best Agentic Project
- Milestone Grant from Arbitrum Foundation
```

## Live links

```
Demo URL:    https://speakup-2la.pages.dev
Video:       https://youtu.be/qzmoaD1ajoU
GitHub:      https://github.com/iwbinb/speakup
Pitch deck:  https://github.com/iwbinb/speakup/blob/main/docs/pitch-deck.pdf
```

## Team

```
Bill Wu · solo founder
Email: iwbinb@gmail.com
Telegram: @iwbinb
```

## On-chain verification (for skeptical judges)

```
Network:   Robinhood Chain Testnet (Chain ID 46630)
Registry:  0xb6D8E46BF9e48aDD4747595b2e437Eb327071c94
Blockscout: https://explorer.testnet.chain.robinhood.com/address/0xb6D8E46BF9e48aDD4747595b2e437Eb327071c94
Source:    Pass · Verified
Full e2e trace (8 tx hashes): docs/e2e-proof.md
```

---

## Pre-submission checklist (final 10 minutes)

- [ ] GitHub repo flipped to public: `gh repo edit iwbinb/speakup --visibility public`
- [x] Video uploaded to YouTube Unlisted; URL pasted above
- [ ] All 4 fields above pasted verbatim into HackQuest form
- [ ] Submit
- [ ] DM @arbitrum and @robinhood on X with demo URL
