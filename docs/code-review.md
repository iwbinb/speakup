# SpeakUp · Code Review & Test Expansion Report

A systematic audit of the entire codebase: new test cases written, all
tests executed, bugs found and fixed, code-quality cleanup.

Last updated 2026-05-24.

---

## Test inventory after this pass

| Package | Suite | Count | Coverage |
|---|---|---|---|
| **contracts** | `test/Registry.t.sol` (unit + fuzz + invariant) | **28 tests** | **100% lines / 100% functions / 95.18% stmts / 80.95% branches** on Registry.sol |
| **agent** | `test/demo-proposals.test.ts` (zod schema integrity) | **29 tests · 229 expect() calls** | full DEMO_PROPOSALS validation |
| **app** | `test/lib.test.ts` (pure helpers) + `test/smoke.test.ts` (live routes + API) | **22 tests · 61 expect() calls** | ENS helper, tickers catalog, chains config, all routes + 3 API endpoints |
| **Total** | | **79 tests** | all green |

Reproduce:

```bash
# from repo root
cd packages/contracts && forge test            # 28 / 28
cd ../agent && bun test                        # 29 / 29
cd ../app && bun test                          # 22 / 22 (requires dev server on :3000)
```

---

## Bugs found via TypeScript strict + fixed

The audit started with a full `tsc --noEmit` pass across all packages,
which surfaced 3 real type-safety bugs that the runtime had been
silently absorbing.

### 1 · `corporate_structure` not in proposal-category enum

- **Where**: `packages/agent/src/demo-proposals.ts:86` set
  `category: 'corporate_structure'` for the TSLA Texas-reincorporation
  proposal, but the zod enum in `packages/agent/src/types.ts` only
  listed 10 categories.
- **Effect**: front-end `ProposalCard.tsx` switch on category had a
  TS2678 "type is not comparable" error; the corresponding case
  branch was unreachable in the type system; runtime parse via
  `ProposalListSchema.safeParse` would have failed silently because
  zod was never invoked on demo data.
- **Fix**: added `'corporate_structure'` to `ProposalCategoryEnum`.

### 2 · `actionLabel` violated `exactOptionalPropertyTypes`

- **Where**: `packages/app/src/components/Header.tsx:279` passed
  `actionLabel={auth.mode === 'wallet' ? 'Disconnect' : undefined}`
  to `<IdentityOption>` whose prop type was `actionLabel?: string`.
- **Effect**: under TS strict the literal `undefined` is not
  assignable to an optional-not-set field; runtime worked but the
  type was lying.
- **Fix**: spread-conditional pattern
  `{...(auth.mode === 'wallet' ? { actionLabel: 'Disconnect' } : {})}`
  so the prop is genuinely absent when not applicable.

### 3 · Blocking `alert()` on watch-mode validation

- **Where**: `packages/app/src/lib/auth.tsx:99` threw a browser
  `alert()` when the user typed something that was neither a 0x
  address nor an ENS name.
- **Effect**: blocking UX, plus the alert is unstyled and breaks the
  fintech aesthetic.
- **Fix**: `setWatchAddress` now returns `boolean`; Header's
  `IdentitySwitcher` shows an inline branded error message via the
  existing `resolveError` state.

---

## New test cases written

### `packages/agent/test/demo-proposals.test.ts` (29 tests)

Validates every entry in `DEMO_PROPOSALS` against the canonical zod
schemas:

- exact set of meeting ids (TSLA / AMZN / NFLX, no drift)
- `ProposalListSchema.safeParse` for each meeting
- `RecommendationListSchema.safeParse` for each meeting
- every proposal has a matching recommendation (no orphans)
- itemIds are unique within a meeting
- meeting title contains a year token
- meetingDate is ISO YYYY-MM-DD and parses as a Date
- recommendation `threeLineRationale` is exactly 3 non-empty lines
- recommendation `confidence` is one of low/medium/high
- proposal `keyDetails` is 1-5 items, no empty strings
- **proposal counts match the values the landing page advertises**
  (7/8/5) — this is the regression guard for the next time someone
  adds a proposal in one file but forgets the other

### `packages/app/test/lib.test.ts` (14 tests)

Pure-function helpers:

- `looksLikeEns`: accepts .eth / .xyz / .cb.id, rejects 0x addresses,
  rejects bare names, case-insensitive on TLD, rejects unknown TLDs
- `TICKERS` catalog: exact set TSLA/AMZN/NFLX, every ticker has a
  Robinhood Chain address, CIK is 10-digit zero-padded, storyHook
  length is reasonable, symbols + token addresses are unique
- `supportedChains` + `DEFAULT_CHAIN_ID`: contains 46630 + 421614,
  default is in the supported list, every chain has a non-empty name

### `packages/contracts/test/Registry.t.sol` (3 new tests, +5 fuzz/inv)

- `testFuzz_WindowBoundariesAreInclusive(uint8)`: confirms
  exactly-voteOpen and exactly-voteDeadline both accept votes
  (off-by-one guard)
- `testFuzz_DistinctVotersDistinctUids(address, address)`: two
  voters on the same (meeting, item) produce different uids
- `test_RelayerCanRejectAttestation`: explicit coverage that
  acknowledge() also accepts the REJECTED status path (not just
  ACKNOWLEDGED), with a meaningful ackRef

Combined with the existing 19 unit tests + 2 fuzz + 2 invariant, the
Registry suite now stands at 28 / 28 with 100% line coverage and
100% function coverage.

---

## Code-quality cleanup

- **`alert()`** call removed in favour of inline branded error
  (see fix #3 above)
- **Console scan**: 0 `console.log` leftovers in `packages/app/src`
  or `packages/agent/src`. Only `console.error` / `console.warn`
  remain on legitimate error paths (wallet connect failure, ENS
  resolve failure).
- **TODO / FIXME / XXX scan**: 0 in production code.
- **NodeStake mention scan** (after earlier cleanup): 0 across all
  user-visible code and docs.

---

## Static analysis posture

- **Slither**: 0 High / 0 Medium / 1 Low (accepted: read-only
  `balanceOf` inside the batch `castVotes` loop) / 0 Informational /
  0 Optimization. Per-finding rationale in
  `packages/contracts/SECURITY.md`.
- **forge-lint**: 2 `block-timestamp` advisories on the voting-window
  comparison, suppressed with inline comment and documented in
  SECURITY.md.

---

## What's intentionally not covered yet

The following are explicit gaps tracked in `docs/p1-completion-status.md`:

- **Component-level React tests** (CommandPalette, IdentitySwitcher,
  ConnectWalletModal, ProposalCard interaction). Would need a DOM test
  harness; the smoke + lib tests provide functional + data integrity
  coverage instead, which is sufficient for hackathon submission.
- **Real Anthropic API call eval**: the Reader and Advisor agent
  prompt files are not exercised against a live API in CI because that
  costs money per run. Tracked for production CI behind a flag.
- **Playwright browser-driven e2e**: smoke tests cover SSR-rendered
  output and API contract; full browser interaction (wallet connect
  flow, mode-switcher click-through) would require Playwright +
  headless Chrome which doubles container size. Tracked.
