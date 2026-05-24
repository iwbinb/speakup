# SpeakUp · Regulatory & Compliance Posture

A frank read of where SpeakUp sits under US securities law today and the
clear path to production-grade compliance.

Last updated 2026-05-24. Not legal advice.

---

## What SpeakUp does that touches regulation

| Action | Regulated activity? | Regulator |
|---|---|---|
| Read SEC EDGAR DEF 14A | No (public data) | n/a |
| Summarize with LLM | No (information service) | n/a |
| Recommend a vote per user profile | **Yes (proxy advisor)** | SEC Rule 14a-1 / 14a-2(b)(9) |
| User casts vote, signs locally | No (their own ballot) | n/a |
| Record vote attestation on-chain | No (informational record) | n/a |
| Relay attestation to Broadridge as a real proxy ballot | **Yes (proxy solicitation)** | SEC Rule 14a-9 |

## Today (hackathon submission)

- We do **not** relay any vote to Broadridge. The mock relayer writes
  `BROADRIDGE-MOCK-…` reference strings on-chain. No real ballot is
  cast at any shareholder meeting because of a SpeakUp attestation.
- The Advisor Agent's recommendation is labelled *not investment advice*
  on every meeting page (`SourcesDisclaimer` panel).
- ISS and Glass Lewis stances are labelled *approximations of public
  season previews* on every meeting page, with the source identified.
- All user identities and votes live on Robinhood Chain testnet
  (chain id 46630), which carries no legal weight.

Net effect for the buildathon: **SpeakUp is a research and visualization
tool, not a proxy advisor or solicitation channel**, until the relayer
becomes real.

## Production path (2026 Q3 - Q4)

### Step 1 · Register as a proxy advisor or partner with one

US SEC defines a proxy voting advice business ("PVAB") under Rule
14a-1(l). Smaller PVABs can rely on Rule 14a-2(b)(9)(ii) safe harbor,
but the practical bar is:

- File a Form ADV if SpeakUp also gives investment advice (we will not;
  recommendations are vote-only)
- Provide registrants advance look at the recommendation (Rule 14a-2(b)(9)(ii)(A))
- Provide a mechanism for clients to receive registrant responses
  (Rule 14a-2(b)(9)(ii)(B))

We will engage outside counsel before activating Phase 1 revenue. Two
candidate firms: Davis Polk and Sullivan & Cromwell (both have active
proxy practice).

### Step 2 · Real bridge to Broadridge

Broadridge (~80% of US issuer market) exposes a SOAP API for vote
record submission. Mediant covers the remaining ~20%. Both require:

- Issuer / transfer-agent contract
- Agreement to operate as a Voter Information Form ("VIF") channel
- Network connectivity through their dedicated VPN

Production relayer will:

- Sign each acknowledgement with a KMS-held private key (`RELAYER_KMS_KEY_ID`)
- Submit the vote to Broadridge / Mediant within the per-issuer cutoff
  window
- Write back a real reference (`BROADRIDGE-…` or `MEDIANT-…`) on-chain

### Step 3 · KYC / sanctions on the voter side

Robinhood Chain itself performs KYC on the user before they can hold
the underlying tokenized security. SpeakUp does **not** add a second
KYC layer; we treat the underlying ERC-3643 / whitelist token's holder
list as the source of truth. Two effects:

- We can never authorise a vote for a sanctioned address because they
  cannot hold the token in the first place.
- Token issuer is the responsible party for OFAC screening.

### Step 4 · State-level proxy rules

Delaware DGCL §211(a) and equivalents in NY / CA require that proxy
votes be cast through procedures the company specifies. Most issuers
specify Broadridge or Mediant. Our bridge satisfies this.

Some issuers (notably Tesla pending Texas reincorporation, item 5 of
the 2025 DEF 14A demo) will move to Texas TBOC where Title 1 §6.252
applies. The bridge needs to support both. Both jurisdictions accept
electronic proxy submission per Broadridge / Mediant standard.

## Risks (frank list)

1. **PVAB designation.** SEC may consider SpeakUp's per-user
   recommendation function to be a covered service under Rule 14a-1(l).
   Mitigation: register, comply, or partner with a registered PVAB.
2. **Tax characterization.** Recommendation outputs are not investment
   advice, but the line is judgment-dependent. We avoid any output
   that ranks proposals by expected return or capital allocation.
3. **AI hallucination.** LLM output errors could mislead a vote.
   Mitigation: every recommendation cites a 3-line rationale that the
   user must scroll past; the SourcesDisclaimer panel labels the
   recommendation as a starting point; on-chain `reasoningHash` lets a
   third party verify the rationale text against the cited inputs.
4. **GDPR / CCPA on user profile.** Advisor agent uses a "user
   preference profile". Production stores this in a per-user encrypted
   record with delete-on-request honoured within 72 hours.

## What we are NOT going to do

- Issue any token (no token launch, no fundraising via token).
- Custody user assets.
- Aggregate proxies across users and vote on their behalf without an
  explicit per-meeting signature. Every vote stays a single-user
  individual ballot.
- Sell user vote data. Aggregate statistics on-chain are public via the
  Envio HyperIndex; that is the entire surface area of any third-party
  visibility.

## Engagement plan with regulators

- **2026 Q2 (now)**: Hackathon submission with all the above transparency baked in.
- **2026 Q3**: Outside-counsel opinion on PVAB status before any
  paid issuer relationship.
- **2026 Q4**: NoAction letter request to SEC Division of Corporation
  Finance on the specific question of on-chain attestation as
  evidence of a properly-cast ballot.
- **2027**: Engage with FINRA on the boundary between vote
  recommendation and investment recommendation.

## Why this is solvable

Broadridge, ISS, Glass Lewis, BlackRock Voting Choice, Vanguard
Investor Choice all operate today under variations of the same rules.
None of them are using LLMs or on-chain attestation, but the
regulatory pathway is well-trodden. SpeakUp is layering new technology
onto existing legal scaffolding, not inventing a new regulatory
category.
