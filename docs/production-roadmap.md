# SpeakUp · Production Roadmap Onepager

## What Ships at Hackathon Submission (2026-06-14)

End-to-end MVP on Robinhood Chain testnet:

- Privy social login (Google / Apple / email)
- Auto-detected holdings of TSLA / AMZN / NFLX
- Live SEC EDGAR DEF 14A parsing + Claude Sonnet 4.6 summary + personalized recommendation
- One-click `castVotes` signature → on-chain attestation
- Mock relayer acknowledges within 10 seconds
- Dual deploy: Robinhood Chain testnet (46630) + Arbitrum Sepolia (421614)

## What Becomes Real Post-Hackathon

| Mock today | Production path | Owner | Timing |
|---|---|---|---|
| Mock relayer writes `BROADRIDGE-MOCK-*` | Real bridge to Broadridge proxy infrastructure via Dinari or Backed partnership API | BD + 1 engineer | Q3 2026 |
| reasoningHash = keccak256(meetingId:item:choice) | Real IPFS pin of the user's full rationale (CopilotChat transcript + final picks) | 1 engineer | Q3 2026 |
| Self-stored attestations in Registry | EAS canonical contract on chains that host it | 1 engineer | Q4 2026 (chains: Arbitrum One, Base, Ethereum mainnet) |
| Hardcoded `MEETING_TO_CIK` table | Live ingestion from SEC EDGAR RSS + Tally-style meeting calendar | 1 engineer | Q3 2026 |
| Static `DEFAULT_PREFERENCES` | User-settable preference panel + per-issuer overrides + delegation policy | 1 designer + 1 engineer | Q3 2026 |
| 3 demo tickers | Top 100 US public companies + S&P 500 ETFs (BlackRock Voting Choice pass-through) | Data engineer | Q4 2026 |
| Mock ISS / Glass Lewis stances | Licensed ISS / Glass Lewis data feed | BD + legal | Q4 2026 |

## Partnerships Required for Production

1. **Tokenized equity issuer** (one of: Dinari, Backed/xStocks, Robinhood Chain native): become the default governance UI for their tokens. Revenue share or per-attestation fee.
2. **Broadridge or comparable proxy infra**: bridge on-chain attestations to the existing US proxy-voting system. Likely via API partnership through (1).
3. **Arbitrum Foundation**: $30K milestone grant requested at submission to fund Q3 production push. Founder House attendance is the gate.
4. **Privy / Alchemy**: production tier accounts once user base > 1K MAU.

## Regulatory Posture

SpeakUp is a **voting interface**, not an investment adviser, not a broker-dealer.

- Output is strictly limited to per-proposal vote recommendations sourced from publicly filed DEF 14A documents.
- Every recommendation requires explicit user signature; we never auto-vote.
- We do not custody tokens. Privy embedded wallets are user-controlled.
- ISS / Glass Lewis stances cited with attribution; we are not redistributing their proprietary analytics.
- SEC EDGAR is public domain.

This positions us alongside Tally + Boardroom (who serve DAOs without registration) and is consistent with SEC's stated direction encouraging retail proxy participation.

## Cost Model

Per-meeting AI cost with prompt caching:

| Component | Tokens | Cost (Sonnet 4.6) |
|---|---|---|
| System prompt (cached) | 800 | $0.0009 first call, $0.00009 thereafter |
| DEF 14A body (input) | ~100K | $0.30 first call |
| Reader output | 3K | $0.045 |
| Advisor system (cached) | 600 | $0.0007 first call |
| Advisor output | 1.5K | $0.0225 |
| **Total per meeting** | | **~$0.37 first user, ~$0.07 cached** |

With 6-hour memo per meetingId, average cost per active user per meeting falls below **$0.10**. At 10K monthly active voters across 50 quarterly meetings = $5K monthly AI bill. Sustainable on a $1/user/year freemium or a per-issuer SaaS model.

## What "Winning" Looks Like in 12 Months

- 10K monthly active voters across 50+ tickers
- 60%+ retail proxy participation rate among SpeakUp users (vs industry < 30%)
- 2 signed issuer partnerships (Dinari + 1 ETF voting choice integration)
- Production Broadridge bridge live
- 1 Robinhood Chain mainnet integration shipping at GA
- $1M seed close on the back of the partnerships above
